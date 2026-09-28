import { GoogleGenAI } from '@google/genai';
import { DEFAULT_AI_CONFIG, AIModelsConfig, AIProviderConfig } from './config';

export interface ProviderResponse {
  provider: 'gemini' | 'openai' | 'anthropic';
  modelUsed: string;
  text: string;
  durationMs: number;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onStatus?: (message: string) => void;
}

/**
 * Universal Unified AI Client for Backend Layer
 * Supports Google Gemini, OpenAI (ChatGPT), and Anthropic Claude
 * with 8s timeouts, 1-retry, seamless automatic fallback, and streaming.
 */
export class MultiProviderAIClient {
  private config: AIModelsConfig;
  private geminiInstance: GoogleGenAI | null = null;

  constructor(customConfig?: Partial<AIModelsConfig>) {
    this.config = { ...DEFAULT_AI_CONFIG, ...customConfig };
  }

  public updateConfig(newConfig: Partial<AIModelsConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): AIModelsConfig {
    return this.config;
  }

  public setProviderEnabled(providerId: 'gemini' | 'openai' | 'anthropic', enabled: boolean) {
    if (this.config.providers[providerId]) {
      this.config.providers[providerId].enabled = enabled;
    }
  }

  private getGemini(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    if (!this.geminiInstance) {
      this.geminiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: { 'User-Agent': 'startup-pulse-ai' }
        }
      });
    }
    return this.geminiInstance;
  }

  /**
   * Safe fetch with strict timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }

  // =========================================================================
  // 1. PROVIDER IMPLEMENTATIONS: SINGLE-TURN / COMPLETIONS
  // =========================================================================

  private async callGemini(
    model: string,
    prompt: string,
    systemInstruction: string,
    maxTokens: number
  ): Promise<string> {
    const client = this.getGemini();
    if (!client) throw new Error('GEMINI_API_KEY not configured on server');

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini timed out after 8000ms`)), 8000)
    );

    const callPromise = client.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        maxOutputTokens: maxTokens,
        temperature: 0.1,
      },
    });

    const res = await Promise.race([callPromise, timeoutPromise]);
    return res.text?.trim() || '';
  }

  private async callOpenAI(
    model: string,
    prompt: string,
    systemInstruction: string,
    maxTokens: number
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not configured on server');

    const body = {
      model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.1,
    };

    const res = await this.fetchWithTimeout(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      },
      8000
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const data: any = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  private async callAnthropic(
    model: string,
    prompt: string,
    systemInstruction: string,
    maxTokens: number
  ): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured on server');

    const body = {
      model,
      system: systemInstruction,
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.1,
    };

    const res = await this.fetchWithTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      },
      8000
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Anthropic HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const data: any = await res.json();
    const contentArr = data.content || [];
    const textPart = contentArr.find((c: any) => c.type === 'text');
    return textPart?.text?.trim() || '';
  }

  // =========================================================================
  // 2. ORCHESTRATION WITH 8S TIMEOUT, 1 RETRY, AND AUTOMATIC FALLBACK
  // =========================================================================

  /**
   * Execute request against a specific provider with 1 retry before falling back
   */
  private async executeWithSingleRetry(
    providerId: 'gemini' | 'openai' | 'anthropic',
    taskType: 'fast' | 'longText' | 'verification',
    prompt: string,
    systemInstruction: string,
    maxTokens: number
  ): Promise<ProviderResponse> {
    const providerConfig = this.config.providers[providerId];
    if (!providerConfig || !providerConfig.enabled) {
      throw new Error(`Provider ${providerId} is disabled by admin setting`);
    }

    const modelName = providerConfig.models[taskType];
    const startTime = Date.now();

    // Attempt 1
    try {
      let text = '';
      if (providerId === 'gemini') {
        text = await this.callGemini(modelName, prompt, systemInstruction, maxTokens);
      } else if (providerId === 'openai') {
        text = await this.callOpenAI(modelName, prompt, systemInstruction, maxTokens);
      } else if (providerId === 'anthropic') {
        text = await this.callAnthropic(modelName, prompt, systemInstruction, maxTokens);
      }

      if (!text) throw new Error(`Empty response from ${providerId}`);
      return {
        provider: providerId,
        modelUsed: `${providerId}/${modelName}`,
        text,
        durationMs: Date.now() - startTime,
      };
    } catch (err1: any) {
      console.warn(`[AI Orchestrator] ${providerId} attempt 1 failed (${err1.message}). Retrying once...`);
      
      // Retry once after brief pause (150ms)
      await new Promise(r => setTimeout(r, 150));
      
      let text = '';
      if (providerId === 'gemini') {
        text = await this.callGemini(modelName, prompt, systemInstruction, maxTokens);
      } else if (providerId === 'openai') {
        text = await this.callOpenAI(modelName, prompt, systemInstruction, maxTokens);
      } else if (providerId === 'anthropic') {
        text = await this.callAnthropic(modelName, prompt, systemInstruction, maxTokens);
      }

      if (!text) throw new Error(`Empty response on retry from ${providerId}`);
      return {
        provider: providerId,
        modelUsed: `${providerId}/${modelName}`,
        text,
        durationMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Primary intelligent orchestrator dispatch for non-streaming completion.
   * Automatically switches to next provider if one fails or times out.
   */
  public async generateWithFallback(
    preferredProvider: 'gemini' | 'openai' | 'anthropic',
    taskType: 'fast' | 'longText' | 'verification',
    prompt: string,
    systemInstruction: string,
    maxTokens = 600
  ): Promise<ProviderResponse> {
    const sequence: Array<'gemini' | 'openai' | 'anthropic'> = [
      preferredProvider,
      ...this.config.fallbackOrder.filter(p => p !== preferredProvider)
    ];

    const errors: Record<string, string> = {};

    for (const provider of sequence) {
      if (!this.config.providers[provider]?.enabled) continue;

      try {
        const result = await this.executeWithSingleRetry(
          provider,
          taskType,
          prompt,
          systemInstruction,
          maxTokens
        );
        return result;
      } catch (err: any) {
        errors[provider] = err.message || String(err);
        console.warn(`[AI Orchestrator] Provider ${provider} failed completely: ${err.message}. Switching to next available provider...`);
      }
    }

    throw new Error(
      `All AI providers (Gemini, OpenAI, Anthropic) were temporarily unavailable. Details: ${JSON.stringify(errors)}`
    );
  }

  // =========================================================================
  // 3. STREAMING ORCHESTRATION WITH PROGRESSIVE TOKEN DELIVERY & FALLBACK
  // =========================================================================

  private async streamGemini(
    model: string,
    contentsPayload: any,
    systemInstruction: string,
    maxTokens: number,
    callbacks: StreamCallbacks
  ): Promise<string> {
    const client = this.getGemini();
    if (!client) throw new Error('GEMINI_API_KEY not configured on server');

    const stream = await client.models.generateContentStream({
      model,
      contents: contentsPayload,
      config: {
        systemInstruction,
        maxOutputTokens: maxTokens,
        temperature: 0.1,
      }
    });

    let fullText = '';
    for await (const chunk of stream) {
      if (chunk.text) {
        fullText += chunk.text;
        callbacks.onChunk(chunk.text);
      }
    }
    return fullText;
  }

  private async streamOpenAI(
    model: string,
    messages: Array<{ role: string; content: string }>,
    maxTokens: number,
    callbacks: StreamCallbacks
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not configured on server');

    const res = await this.fetchWithTimeout(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.1,
          stream: true,
        }),
      },
      8000
    );

    if (!res.ok || !res.body) {
      const err = await res.text().catch(() => '');
      throw new Error(`OpenAI Stream HTTP ${res.status}: ${err.slice(0, 150)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const clean = line.trim();
        if (clean.startsWith('data: [DONE]')) return fullText;
        if (clean.startsWith('data:')) {
          try {
            const parsed = JSON.parse(clean.replace('data:', '').trim());
            const textDelta = parsed.choices?.[0]?.delta?.content;
            if (textDelta) {
              fullText += textDelta;
              callbacks.onChunk(textDelta);
            }
          } catch {}
        }
      }
    }

    return fullText;
  }

  private async streamAnthropic(
    model: string,
    systemInstruction: string,
    messages: Array<{ role: string; content: string }>,
    maxTokens: number,
    callbacks: StreamCallbacks
  ): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured on server');

    const res = await this.fetchWithTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: systemInstruction,
          messages,
          max_tokens: maxTokens,
          temperature: 0.1,
          stream: true,
        }),
      },
      8000
    );

    if (!res.ok || !res.body) {
      const err = await res.text().catch(() => '');
      throw new Error(`Anthropic Stream HTTP ${res.status}: ${err.slice(0, 150)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const clean = line.trim();
        if (clean.startsWith('data:')) {
          try {
            const parsed = JSON.parse(clean.replace('data:', '').trim());
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullText += parsed.delta.text;
              callbacks.onChunk(parsed.delta.text);
            }
          } catch {}
        }
      }
    }

    return fullText;
  }

  /**
   * Main Streaming Entry Point: Streams token-by-token with automatic provider fallback
   */
  public async streamWithFallback(
    preferredProvider: 'gemini' | 'openai' | 'anthropic',
    taskType: 'fast' | 'longText' | 'verification',
    prompt: string,
    systemInstruction: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    maxTokens: number,
    callbacks: StreamCallbacks
  ): Promise<{ provider: string; modelUsed: string; fullText: string }> {
    const sequence: Array<'gemini' | 'openai' | 'anthropic'> = [
      preferredProvider,
      ...this.config.fallbackOrder.filter(p => p !== preferredProvider)
    ];

    for (const provider of sequence) {
      const providerConfig = this.config.providers[provider];
      if (!providerConfig || !providerConfig.enabled) continue;

      const modelName = providerConfig.models[taskType];

      // Formulate provider-specific payload
      try {
        let fullText = '';
        if (provider === 'gemini') {
          // Gemini payload: history + current prompt
          const contents = [
            ...history.map(h => ({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }]
            })),
            { role: 'user', parts: [{ text: prompt }] }
          ];
          fullText = await this.streamGemini(modelName, contents, systemInstruction, maxTokens, callbacks);
        } else if (provider === 'openai') {
          const messages = [
            { role: 'system', content: systemInstruction },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: prompt }
          ];
          fullText = await this.streamOpenAI(modelName, messages, maxTokens, callbacks);
        } else if (provider === 'anthropic') {
          const messages = [
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: prompt }
          ];
          fullText = await this.streamAnthropic(modelName, systemInstruction, messages, maxTokens, callbacks);
        }

        if (fullText.trim()) {
          return {
            provider,
            modelUsed: `${provider}/${modelName}`,
            fullText,
          };
        }
      } catch (err: any) {
        console.warn(`[AI Streamer] ${provider} stream failed (${err.message}). Trying fallback provider...`);
        // If error occurred before emitting tokens, continue loop to next provider
      }
    }

    throw new Error('All AI providers (Gemini, OpenAI, Anthropic) failed or timed out during streaming.');
  }

  // =========================================================================
  // 4. PARALLEL 3-PROVIDER VERIFICATION CONSENSUS ENGINE
  // =========================================================================

  /**
   * Run Gemini, OpenAI, and Claude in parallel to verify uploaded startup news
   * Compares outputs: If all 3 agree the news is real and consistent -> "AI-verified".
   * If any disagreement or discrepancy detected -> flags for manual review by admin.
   */
  public async verifyNewsWithAllProviders(newsItem: {
    title: string;
    summary: string;
    body: string;
    sourceName: string;
    sourceUrl: string;
    category: string;
    startupName?: string;
    investorName?: string;
    amount?: string;
  }): Promise<{
    consensus: 'ai_verified' | 'manual_review_required';
    agreementRatio: number;
    results: Record<string, {
      model: string;
      isConsistent: boolean;
      confidence: number;
      findings: string;
      discrepancies: string[];
    }>;
    adminSummary: string;
  }> {
    const prompt = `You are a strict editorial fact-checking and integrity verification engine for a startup ecosystem portal.
Analyze this submitted startup news article for internal consistency, source credibility, and realistic parameters:

TITLE: ${newsItem.title}
CATEGORY: ${newsItem.category}
SOURCE: ${newsItem.sourceName} (${newsItem.sourceUrl})
STARTUP: ${newsItem.startupName || 'N/A'}
INVESTOR: ${newsItem.investorName || 'N/A'}
AMOUNT: ${newsItem.amount || 'N/A'}
SUMMARY: ${newsItem.summary}
FULL TEXT: ${newsItem.body}

RULES FOR VERIFICATION:
1. Check if the claimed funding, startup, or scheme aligns with realistic numbers and legitimate business practice.
2. Check for contradictions between the Title, Summary, and Full Text.
3. Check if the source URL appears to be a legitimate HTTPS domain rather than a deceptive URL.
4. If the report appears genuine, consistent, and plausible, mark isConsistent: true.
5. If there are contradictions, unrealistic figures, suspicious claims, or fabricated statements, mark isConsistent: false and list discrepancies.

Output ONLY a JSON object with this exact structure:
{
  "isConsistent": true | false,
  "confidence": number between 0 and 100,
  "findings": "one sentence summary of your analysis",
  "discrepancies": ["list of contradictions or concerns, or empty if clean"]
}`;

    const systemInstruction = 'You are an objective news verification auditor. Output strictly valid JSON and nothing else.';

    // Run active providers in parallel
    const activeProviders = (['gemini', 'openai', 'anthropic'] as const).filter(
      p => this.config.providers[p].enabled
    );

    const verificationPromises = activeProviders.map(async (provider) => {
      const model = this.config.providers[provider].models.verification;
      try {
        let rawResponse = '';
        if (provider === 'gemini') {
          rawResponse = await this.callGemini(model, prompt, systemInstruction, 350);
        } else if (provider === 'openai') {
          rawResponse = await this.callOpenAI(model, prompt, systemInstruction, 350);
        } else if (provider === 'anthropic') {
          rawResponse = await this.callAnthropic(model, prompt, systemInstruction, 350);
        }

        // Parse JSON
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          provider,
          model: `${provider}/${model}`,
          isConsistent: Boolean(parsed.isConsistent),
          confidence: Number(parsed.confidence) || 80,
          findings: String(parsed.findings || 'Analysis complete'),
          discrepancies: Array.isArray(parsed.discrepancies) ? parsed.discrepancies : [],
        };
      } catch (err: any) {
        console.warn(`[Verification] ${provider} evaluation notice:`, err.message);
        return {
          provider,
          model: `${provider}/${model}`,
          isConsistent: false,
          confidence: 0,
          findings: `Provider could not complete verification: ${err.message}`,
          discrepancies: ['Evaluation timeout or provider unreachable'],
        };
      }
    });

    const evaluated = await Promise.all(verificationPromises);
    const resultsMap: Record<string, any> = {};
    let consistentCount = 0;

    for (const res of evaluated) {
      resultsMap[res.provider] = res;
      if (res.isConsistent && res.confidence >= 65) {
        consistentCount++;
      }
    }

    const agreementRatio = evaluated.length > 0 ? consistentCount / evaluated.length : 0;
    // Strict requirement: All active providers must agree
    const allAgree = evaluated.length >= 2 && consistentCount === evaluated.length;

    const consensus: 'ai_verified' | 'manual_review_required' = allAgree 
      ? 'ai_verified' 
      : 'manual_review_required';

    const adminSummary = allAgree
      ? `All ${evaluated.length} AI providers (Gemini, OpenAI, Claude) cross-verified this story as authentic and consistent.`
      : `Discrepancy detected across AI models (${consistentCount}/${evaluated.length} verified). Flagged for human editorial review.`;

    return {
      consensus,
      agreementRatio,
      results: resultsMap,
      adminSummary,
    };
  }
}

// Singleton backend orchestrator instance
export const multiProviderAI = new MultiProviderAIClient();
