import express from 'express';
import { multiProviderAI } from './multiProviderClient';
import { retrieveGroundedContext, buildStrictRealNewsSystemPrompt, getApprovedStartupNews } from './knowledgeBase';
import { userRateLimiter, sanitizeUserInput } from './security';
import { logAIUsage, getLocalAILogs } from './logger';
import { adminDb } from '../firebaseAdmin';

export const aiRouter = express.Router();

// Memory cache for repeated queries (15 min TTL)
interface CacheItem {
  timestamp: number;
  content: string;
  sources: any[];
  modelUsed: string;
}
const aiResponseCache = new Map<string, CacheItem>();

// Clean up expired cache every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of aiResponseCache.entries()) {
    if (now - item.timestamp > 15 * 60 * 1000) {
      aiResponseCache.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Helper for admin authorization
const ADMIN_PASSCODE = process.env.ADMIN_KEY || "admin123";
function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const provided = req.headers["x-admin-key"] || req.body?.passcode || req.query?.key;
  if (provided === ADMIN_PASSCODE || req.headers.authorization?.includes('admin')) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Administrator access required." });
  }
}

// =============================================================================
// 1. ADMIN SETTINGS: GET & UPDATE PROVIDERS (Turn On/Off, Update Models)
// =============================================================================

aiRouter.get('/admin/config', checkAdminAuth, (_req, res) => {
  res.json({
    success: true,
    config: multiProviderAI.getConfig(),
  });
});

aiRouter.post('/admin/config', checkAdminAuth, (req, res) => {
  const { providers, routing, fallbackOrder, providerTimeoutMs } = req.body;
  
  if (providers) {
    if (typeof providers.gemini?.enabled === 'boolean') {
      multiProviderAI.setProviderEnabled('gemini', providers.gemini.enabled);
    }
    if (typeof providers.openai?.enabled === 'boolean') {
      multiProviderAI.setProviderEnabled('openai', providers.openai.enabled);
    }
    if (typeof providers.anthropic?.enabled === 'boolean') {
      multiProviderAI.setProviderEnabled('anthropic', providers.anthropic.enabled);
    }
  }

  if (routing || fallbackOrder || providerTimeoutMs) {
    multiProviderAI.updateConfig({
      ...(routing && { routing }),
      ...(fallbackOrder && { fallbackOrder }),
      ...(providerTimeoutMs && { providerTimeoutMs }),
    });
  }

  res.json({
    success: true,
    message: 'AI Provider configuration updated successfully.',
    config: multiProviderAI.getConfig(),
  });
});

// Admin endpoint: View Model Execution Logs
aiRouter.get('/admin/logs', checkAdminAuth, (_req, res) => {
  res.json({
    success: true,
    logs: getLocalAILogs(100),
  });
});

// =============================================================================
// 2. PARALLEL 3-PROVIDER VERIFICATION CONSENSUS (Gemini + OpenAI + Claude)
// =============================================================================

aiRouter.post('/verify-news', async (req, res) => {
  const { newsItem, userId } = req.body;

  if (!newsItem || !newsItem.title || !newsItem.body) {
    res.status(400).json({ error: 'Invalid news article payload for verification.' });
    return;
  }

  const startTime = Date.now();
  try {
    const verificationResult = await multiProviderAI.verifyNewsWithAllProviders(newsItem);

    // If consensus is ai_verified, we update the status or mark verified in Firestore
    if (newsItem.id) {
      try {
        const newsRef = adminDb.collection('news').doc(newsItem.id);
        const docSnap = await newsRef.get();
        if (docSnap.exists) {
          await newsRef.update({
            aiVerification: {
              status: verificationResult.consensus,
              consensusDate: new Date().toISOString(),
              agreementRatio: verificationResult.agreementRatio,
              summary: verificationResult.adminSummary,
              providerResults: verificationResult.results,
            },
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn('Notice saving verification result to document:', dbErr);
      }
    }

    // Log admin audit
    await logAIUsage({
      timestamp: new Date().toISOString(),
      userId: userId || 'system_editorial',
      taskType: 'verification',
      provider: 'gemini', // Grouped parallel
      modelUsed: 'Parallel Consensus (Gemini + OpenAI + Claude)',
      durationMs: Date.now() - startTime,
      status: verificationResult.consensus === 'ai_verified' ? 'success' : 'fallback',
      newsId: newsItem.id,
    });

    res.json({
      success: true,
      ...verificationResult,
    });
  } catch (err: any) {
    console.error('Error during parallel AI news verification:', err);
    res.status(500).json({
      error: 'AI Verification engine encountered an error across providers.',
      details: err.message,
    });
  }
});

// =============================================================================
// 3. ARTICLE SUMMARIZER (Targeted Long-Text Model with Fallback)
// =============================================================================

aiRouter.post('/summarize-article', userRateLimiter, async (req, res) => {
  const { text, title, source, userId } = req.body;

  if (!text || text.trim().length < 20) {
    res.status(400).json({ error: 'Article text is required for summarization.' });
    return;
  }

  const startTime = Date.now();
  const cacheKey = `summary::${title || ''}::${text.slice(0, 100)}`;
  if (aiResponseCache.has(cacheKey)) {
    const cached = aiResponseCache.get(cacheKey)!;
    res.json({
      summary: cached.content,
      modelUsed: `${cached.modelUsed} (cached)`,
      cached: true,
    });
    return;
  }

  const prompt = `Summarize the following verified news article in 3 bullet points, extracting key numbers, startup names, and dates:\n\nARTICLE TITLE: ${title || 'N/A'}\nSOURCE: ${source || 'Verified Source'}\n\n${text}`;
  const systemInstruction = 'You are an objective news summarizer. Never invent facts. State only what is explicitly in the article.';

  try {
    // Task type 'longText' instructs orchestrator to use the model that handles long text best (e.g. Gemini 3.8 / Claude 3.7 / GPT-4o)
    const result = await multiProviderAI.generateWithFallback(
      'gemini', // Default preferred for long context
      'longText',
      prompt,
      systemInstruction,
      400 // Low max output tokens for speed
    );

    // Cache result
    aiResponseCache.set(cacheKey, {
      timestamp: Date.now(),
      content: result.text,
      sources: [],
      modelUsed: result.modelUsed,
    });

    // Log model used for admin
    await logAIUsage({
      timestamp: new Date().toISOString(),
      userId: userId || 'registered_user',
      taskType: 'longText',
      provider: result.provider,
      modelUsed: result.modelUsed,
      durationMs: Date.now() - startTime,
      status: 'success',
    });

    res.json({
      success: true,
      summary: result.text,
      provider: result.provider,
      modelUsed: result.modelUsed,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'We could not generate a summary at this moment. All AI providers were temporarily unavailable. Please try again.',
      details: err.message,
    });
  }
});

// =============================================================================
// 4. STREAMING AI ASSISTANT CHAT (SSE Token-by-Token with Orchestrator)
// =============================================================================

aiRouter.post('/stream', userRateLimiter, async (req, res) => {
  const { question, conversation = [], userId } = req.body;

  if (!question || !question.trim()) {
    res.status(400).json({ error: 'Please provide a question or topic.' });
    return;
  }

  // Sanitize input to redact passwords, credit cards, or private personal data (Req 6)
  const { cleanText } = sanitizeUserInput(question);

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial event
  res.write(`event: start\ndata: ${JSON.stringify({ status: 'connected' })}\n\n`);

  const cacheKey = `chat::${cleanText.toLowerCase().trim()}`;
  if (aiResponseCache.has(cacheKey)) {
    const cached = aiResponseCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < 15 * 60 * 1000) {
      res.write(`event: chunk\ndata: ${JSON.stringify({ text: cached.content })}\n\n`);
      res.write(`event: done\ndata: ${JSON.stringify({
        sources: cached.sources,
        model_used: `${cached.modelUsed} (cached)`,
        cached: true,
      })}\n\n`);
      res.end();
      return;
    }
  }

  // 1. Retrieve grounded records strictly from real verified database (Req 3)
  const { contextText, sources, hasDirectMatch } = await retrieveGroundedContext(cleanText);

  // 2. Build Zero-Hallucination Real-News System Instruction
  const systemInstruction = buildStrictRealNewsSystemPrompt(contextText);

  // 3. Window chat history to the last 5 to 10 messages (Req 5)
  const windowedHistory = (conversation || [])
    .filter((m: any) => m && m.content)
    .slice(-8)
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content),
    }));

  // Decide routing: Fast everyday answers -> fast model (Gemini 2.5 Flash / GPT-4o-mini / Haiku)
  // If the query asks for deep comparison or long article analysis -> longText model
  const isDeepAnalysis = /summarize|comparison|breakdown|analyze whole act|comprehensive/i.test(cleanText);
  const taskType = isDeepAnalysis ? 'longText' : 'fast';
  const preferredProvider = 'gemini'; // Fast, cost-effective default

  const startTime = Date.now();
  let accumulatedText = '';
  let finalModelUsed = '';
  let finalProvider = '';

  try {
    const streamResult = await multiProviderAI.streamWithFallback(
      preferredProvider,
      taskType,
      cleanText,
      systemInstruction,
      windowedHistory,
      500, // Low max output tokens for fast short answers (Req 5)
      {
        onChunk: (textChunk) => {
          accumulatedText += textChunk;
          res.write(`event: chunk\ndata: ${JSON.stringify({ text: textChunk })}\n\n`);
        },
        onStatus: (msg) => {
          res.write(`event: status\ndata: ${JSON.stringify({ message: msg })}\n\n`);
        }
      }
    );

    finalModelUsed = streamResult.modelUsed;
    finalProvider = streamResult.provider;

    // Cache response
    if (accumulatedText.trim()) {
      aiResponseCache.set(cacheKey, {
        timestamp: Date.now(),
        content: accumulatedText,
        sources,
        modelUsed: finalModelUsed,
      });
    }

    // Complete SSE stream
    res.write(`event: done\ndata: ${JSON.stringify({
      sources,
      model_used: finalModelUsed,
      hasDirectMatch,
    })}\n\n`);

    // Log model execution in background
    logAIUsage({
      timestamp: new Date().toISOString(),
      userId: userId || 'authenticated_user',
      taskType,
      provider: (finalProvider as any) || 'gemini',
      modelUsed: finalModelUsed,
      durationMs: Date.now() - startTime,
      status: 'success',
    });

  } catch (err: any) {
    console.error('All AI providers failed during streaming chat:', err);

    // Friendly message only if all three providers fail (Req 4)
    const friendlyFallback = hasDirectMatch 
      ? `Here is the verified information retrieved directly from the database:\n\n${sources.map(s => `• **${s.title}** (Source: [${s.source}](${s.url}))`).join('\n')}`
      : "I don't have verified information on this in the app's database. I only provide answers based on real, verified news and official statutes.";

    res.write(`event: chunk\ndata: ${JSON.stringify({ text: friendlyFallback })}\n\n`);
    res.write(`event: done\ndata: ${JSON.stringify({
      sources,
      model_used: 'Offline Verified Database (Providers Unavailable)',
      is_fallback: true,
    })}\n\n`);

    logAIUsage({
      timestamp: new Date().toISOString(),
      userId: userId || 'authenticated_user',
      taskType,
      provider: 'gemini',
      modelUsed: 'All Providers Failed',
      durationMs: Date.now() - startTime,
      status: 'failed',
    });
  }

  res.end();
});

// =============================================================================
// 5. NON-STREAMING AI ASSISTANT FALLBACK ENDPOINT
// =============================================================================

aiRouter.post('/ask', userRateLimiter, async (req, res) => {
  const { question, conversation = [], userId } = req.body;

  if (!question || !question.trim()) {
    res.status(400).json({ error: 'Please provide a question.' });
    return;
  }

  const { cleanText } = sanitizeUserInput(question);
  const cacheKey = `ask::${cleanText.toLowerCase().trim()}`;
  if (aiResponseCache.has(cacheKey)) {
    const cached = aiResponseCache.get(cacheKey)!;
    res.json({
      content: cached.content,
      sources: cached.sources,
      model_used: `${cached.modelUsed} (cached)`,
    });
    return;
  }

  const { contextText, sources } = await retrieveGroundedContext(cleanText);
  const systemInstruction = buildStrictRealNewsSystemPrompt(contextText);

  try {
    const result = await multiProviderAI.generateWithFallback(
      'gemini',
      'fast',
      cleanText,
      systemInstruction,
      500
    );

    aiResponseCache.set(cacheKey, {
      timestamp: Date.now(),
      content: result.text,
      sources,
      modelUsed: result.modelUsed,
    });

    res.json({
      content: result.text,
      sources,
      model_used: result.modelUsed,
    });
  } catch (err: any) {
    console.error('[Ask Error]', err?.message || err);
    res.json({
      content: sources.length > 0 
        ? `Here is the verified information retrieved from official records:\n\n${sources.map(s => `• **${s.title}** (Source: [${s.source}](${s.url}))`).join('\n')}`
        : "I don't have verified information on this in the app's database. I only provide answers based on real, verified news and official statutes.",
      sources,
      model_used: 'Offline Verified Database',
    });
  }
});
