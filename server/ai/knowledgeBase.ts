import { adminDb } from '../firebaseAdmin';
import { LAWS_DATABASE } from '../../src/data/laws';

export interface RetrievedContextItem {
  id: string;
  type: 'startup_news' | 'statute';
  title: string;
  source: string;
  url: string;
  summary: string;
  category?: string;
  details?: Record<string, any>;
}

export interface NewsArticleData {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  startupName?: string;
  investorName?: string;
  amount?: string;
  round?: string;
  issuingBody?: string;
  deadline?: string;
  eligibility?: string;
  problem?: string;
  solution?: string;
}

/**
 * Fetch approved startup news items from Firestore database
 */
export async function getApprovedStartupNews(limitCount = 40): Promise<NewsArticleData[]> {
  try {
    const snap = await adminDb.collection('news')
      .where('status', '==', 'approved')
      .limit(limitCount)
      .get();

    return snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<NewsArticleData, 'id'>)
    }));
  } catch (err: any) {
    console.warn('[Knowledge Base] Firestore read notice, fallback to empty list:', err?.message || err);
    return [];
  }
}

/**
 * Grounded Retrieval Engine:
 * Matches user query strictly against real verified news in the app's database.
 * If query targets legal compliance or statutes, grounds against official bare acts.
 */
export async function retrieveGroundedContext(query: string): Promise<{
  contextText: string;
  sources: Array<{ id: string; title: string; source: string; url: string; type: 'startup_news' | 'statute' }>;
  hasDirectMatch: boolean;
}> {
  const cleanQ = query.trim().toLowerCase();
  const words = cleanQ.split(/\s+/).filter(w => w.length > 2);

  // 1. Fetch real approved startup news from database
  const approvedNews = await getApprovedStartupNews(50);

  const matchedNews = approvedNews.filter(n => {
    const titleLower = n.title.toLowerCase();
    const summaryLower = n.summary.toLowerCase();
    const startupLower = (n.startupName || '').toLowerCase();
    const investorLower = (n.investorName || '').toLowerCase();
    const categoryLower = (n.category || '').toLowerCase();
    const issuingBodyLower = (n.issuingBody || '').toLowerCase();

    const matchTitle = cleanQ.includes(titleLower) || titleLower.includes(cleanQ) || (words.length > 0 && words.filter(w => titleLower.includes(w)).length >= 2);
    const matchSummary = summaryLower.includes(cleanQ) || (words.length > 0 && words.filter(w => summaryLower.includes(w)).length >= 2);
    const matchBody = words.length >= 2 && words.filter(w => n.body.toLowerCase().includes(w)).length >= 2;
    const matchStartup = startupLower && (cleanQ.includes(startupLower) || startupLower.includes(cleanQ));
    const matchInvestor = investorLower && (cleanQ.includes(investorLower) || investorLower.includes(cleanQ));
    const matchCategory = categoryLower && cleanQ.includes(categoryLower);
    const matchIssuingBody = issuingBodyLower && (cleanQ.includes(issuingBodyLower) || issuingBodyLower.includes(cleanQ));

    return matchTitle || matchSummary || matchBody || matchStartup || matchInvestor || matchCategory || matchIssuingBody;
  });

  // 2. Also search statutory laws database for legal/regulatory startup queries
  const matchedLaws = LAWS_DATABASE.filter(l => {
    const secLower = l.section_number.toLowerCase();
    const actLower = l.act_name.toLowerCase();
    const shortActLower = (l.short_act || '').toLowerCase();
    const titleLower = l.section_title.toLowerCase();

    const matchSection = cleanQ.includes(secLower) || secLower.includes(cleanQ) || words.some(w => secLower.replace(/[^a-z0-9]/g, '').includes(w.replace(/[^a-z0-9]/g, '')) && w.length >= 3);
    const matchTitle = cleanQ.includes(titleLower) || titleLower.includes(cleanQ) || (words.length >= 2 && words.filter(w => titleLower.includes(w)).length >= 2);
    const matchAct = cleanQ.includes(actLower) || actLower.includes(cleanQ) || (shortActLower && cleanQ.includes(shortActLower));
    const matchKeywords = l.keywords?.some(k => cleanQ.includes(k.toLowerCase()) || k.toLowerCase().includes(cleanQ));
    return matchSection || matchTitle || matchAct || matchKeywords;
  }).slice(0, 3);

  const sources: Array<{ id: string; title: string; source: string; url: string; type: 'startup_news' | 'statute' }> = [];
  const contextChunks: string[] = [];

  // Add Startup News matches
  for (const n of matchedNews.slice(0, 4)) {
    sources.push({
      id: n.id,
      title: n.title,
      source: n.sourceName,
      url: n.sourceUrl,
      type: 'startup_news',
    });

    contextChunks.push(`[VERIFIED_STARTUP_NEWS: ${n.id}]
Title: ${n.title}
Category: ${n.category}
Source: ${n.sourceName} (${n.sourceUrl})
Startup: ${n.startupName || 'N/A'}
Investor: ${n.investorName || 'N/A'}
Funding / Round: ${n.amount ? `${n.round || ''} - ${n.amount}` : 'N/A'}
Govt Body / Scheme: ${n.issuingBody || 'N/A'} (Deadline: ${n.deadline || 'N/A'})
Eligibility: ${n.eligibility || 'N/A'}
Summary: ${n.summary}
Details: ${n.body.slice(0, 600)}`);
  }

  // Add Statutory matches
  for (const l of matchedLaws) {
    sources.push({
      id: l.id,
      title: `${l.act_name} (${l.section_number})`,
      source: l.source,
      url: l.source_url,
      type: 'statute',
    });

    contextChunks.push(`[VERIFIED_STATUTE: ${l.id}]
Act & Section: ${l.act_name} - ${l.section_number}: ${l.section_title}
Status: ${l.current_status}
Official Source: ${l.source} (${l.source_url})
Explanation: ${l.simple_explanation}
Penalties: ${l.penalties_fines || l.punishment}`);
  }

  const hasDirectMatch = sources.length > 0;
  const contextText = contextChunks.join('\n\n---\n\n');

  return {
    contextText,
    sources,
    hasDirectMatch,
  };
}

/**
 * Build Strict Real-News System Instruction
 * Requirement 3: REAL NEWS ONLY (VERY IMPORTANT)
 * Never invent, guess, or generate fake news, startups, funding amounts, investors, schemes, or events.
 * If the answer is not in the app's real data, say "I don't have verified information on this".
 */
export function buildStrictRealNewsSystemPrompt(groundedContext: string): string {
  return `================================================================================
# REAL-NEWS-ONLY GROUNDING SPECIFICATION (CRITICAL DIRECTIVE)
================================================================================
You are the built-in AI Assistant for this Startup & Legal News platform.

STRICT ACCURACY AND ZERO-HALLUCINATION RULES:
1. REAL NEWS ONLY: You MUST NEVER invent, hallucinate, extrapolate, or guess fake news, startups, founders, funding amounts, investors, government schemes, or events.
2. SOURCE-BOUND ANSWERS: You may ONLY summarize, explain, translate, or answer questions using the verified records provided below in the [VERIFIED DATABASE RECORDS] section.
3. CITATION MANDATE: Every answer you produce must explicitly state which news item or statute it came from, including the exact source publication name (e.g. "Source: [Economic Times / PIB](url)").
4. UNKNOWN DATA PROTOCOL: If the answer is NOT present in the provided verified database records below, you MUST state exactly:
   "I don't have verified information on this in the app's database. I only provide answers based on real, verified news and official statutes."
   Do NOT attempt a best guess. Do NOT make up names, numbers, or dates.
5. CONCISE, OBJECTIVE TONE: Deliver clear, high-density facts without fluff or conversational AI banter.

[VERIFIED DATABASE RECORDS]:
${groundedContext || 'No matching database records found for this query.'}
================================================================================`;
}
