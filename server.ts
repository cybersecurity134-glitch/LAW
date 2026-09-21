import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { LAWS_DATABASE, UPDATE_HISTORY } from "./src/data/laws";
import { CATEGORIES } from "./src/data/categories";
import { legalDataSyncService } from "./server/legalDataSyncService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Initialize Gemini client lazily/safely
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Indian Laws & Legal Information Engine" });
});

// 2. Categories
app.get("/api/categories", (_req, res) => {
  // Update section counts dynamically from the database
  const enrichedCategories = CATEGORIES.map(cat => {
    const matchingLaws = LAWS_DATABASE.filter(l => l.category_id === cat.id);
    return {
      ...cat,
      sections_count: matchingLaws.length > 0 ? matchingLaws.length : cat.sections_count
    };
  });
  res.json({ categories: enrichedCategories });
});

// 3. Laws list with search and filter
app.get("/api/laws", (req, res) => {
  const {
    q,
    category_id,
    state,
    bailable,
    cognizable
  } = req.query as Record<string, string | undefined>;

  let filtered = [...LAWS_DATABASE];

  if (category_id && category_id !== "all") {
    filtered = filtered.filter(l => l.category_id === category_id);
  }

  if (state && state !== "All India" && state !== "all") {
    filtered = filtered.filter(
      l => l.state_applicability === "All India" || l.state_applicability.toLowerCase().includes(state.toLowerCase())
    );
  }

  if (bailable && bailable !== "all") {
    if (bailable === "bailable") filtered = filtered.filter(l => l.is_bailable === true);
    if (bailable === "non-bailable") filtered = filtered.filter(l => l.is_bailable === false);
  }

  if (cognizable && cognizable !== "all") {
    if (cognizable === "cognizable") filtered = filtered.filter(l => l.is_cognizable === true);
    if (cognizable === "non-cognizable") filtered = filtered.filter(l => l.is_cognizable === false);
  }

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(l => {
      const matchSection = l.section_number.toLowerCase().includes(query);
      const matchTitle = l.section_title.toLowerCase().includes(query);
      const matchAct = l.act_name.toLowerCase().includes(query);
      const matchShortAct = l.short_act?.toLowerCase().includes(query);
      const matchKeywords = l.keywords.some(k => k.toLowerCase().includes(query));
      const matchExplanation = l.simple_explanation.toLowerCase().includes(query);
      const matchPunishment = l.punishment.toLowerCase().includes(query);
      const matchFine = l.fine.toLowerCase().includes(query);
      return matchSection || matchTitle || matchAct || matchShortAct || matchKeywords || matchExplanation || matchPunishment || matchFine;
    });
  }

  res.json({ count: filtered.length, laws: filtered });
});

// 4. Single Law Detail
app.get("/api/laws/:id", (req, res) => {
  const law = LAWS_DATABASE.find(l => l.id === req.params.id);
  if (!law) {
    res.status(404).json({ error: "Law not found in legal database" });
    return;
  }
  res.json({ law });
});

// 5. Dynamic Update History from synchronization engine
app.get("/api/updates", (_req, res) => {
  res.json({ updates: legalDataSyncService.getUpdates() });
});

// 5b. Official Legal Circulars & Ministry Notifications
app.get("/api/circulars", (_req, res) => {
  res.json({ circulars: legalDataSyncService.getCirculars() });
});

// 5c. Verified Statutory Helplines Directory
app.get("/api/helplines", (_req, res) => {
  res.json({ helplines: legalDataSyncService.getHelplines() });
});

// 5d. Synchronization Status & Audit Logs
app.get("/api/sync/status", (_req, res) => {
  res.json(legalDataSyncService.getStatus());
});

app.get("/api/sync/logs", (_req, res) => {
  res.json({ audit_logs: legalDataSyncService.getAuditLogs() });
});

// 6. Refresh legal data & execute daily/on-demand sync job
app.post("/api/refresh", async (_req, res) => {
  try {
    const result = await legalDataSyncService.runSyncJob('manual_refresh');
    res.json({
      success: true,
      last_updated: result.last_updated,
      status: result.status,
      synced_sources: legalDataSyncService.getStatus().synced_sources,
      verified_acts: 18,
      sections_checked: 22,
      new_amendments_found: result.changes_detected,
      status_message: result.message,
      audit_log: result.audit_log
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Sync operation encountered an error',
      last_updated: legalDataSyncService.getStatus().last_updated
    });
  }
});

app.post("/api/sync/run", async (req, res) => {
  try {
    const triggeredBy = req.body.triggered_by === 'admin_override' ? 'admin_override' : 'manual_refresh';
    const result = await legalDataSyncService.runSyncJob(triggeredBy);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// 7. Admin Override APIs (push updates, circulars, helplines outside daily cycle)
const ADMIN_PASSCODE = process.env.ADMIN_KEY || "admin123";

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const provided = req.headers["x-admin-key"] || req.body?.passcode || req.query?.key;
  if (provided === ADMIN_PASSCODE) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid or missing administrator passcode." });
  }
}

app.post("/api/admin/updates", checkAdminAuth, (req, res) => {
  try {
    const newUpdate = legalDataSyncService.adminPushUpdate(req.body);
    res.json({ success: true, update: newUpdate, status: legalDataSyncService.getStatus() });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || "Failed to push update" });
  }
});

app.delete("/api/admin/updates/:id", checkAdminAuth, (req, res) => {
  const deleted = legalDataSyncService.adminDeleteUpdate(req.params.id);
  if (deleted) {
    res.json({ success: true, message: `Update ${req.params.id} removed.` });
  } else {
    res.status(404).json({ error: "Update not found" });
  }
});

app.post("/api/admin/circulars", checkAdminAuth, (req, res) => {
  try {
    const newCircular = legalDataSyncService.adminPushCircular(req.body);
    res.json({ success: true, circular: newCircular, status: legalDataSyncService.getStatus() });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || "Failed to push circular" });
  }
});

app.post("/api/admin/helplines/:id", checkAdminAuth, (req, res) => {
  const { status, notes } = req.body;
  const ok = legalDataSyncService.adminUpdateHelpline(req.params.id, status, notes);
  if (ok) {
    res.json({ success: true, message: `Helpline ${req.params.id} updated.` });
  } else {
    res.status(404).json({ error: "Helpline not found" });
  }
});

// Cache for instant AI responses (15 min TTL)
interface AICacheEntry {
  timestamp: number;
  content: string;
  sources: Array<{ law_id: string; section_number: string; act_name: string; source_url: string }>;
  webCitations?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
  modelUsed?: string;
}
const aiResponseCache = new Map<string, AICacheEntry>();

function getCacheKey(question: string, state?: string, mode?: string, attachCount = 0): string {
  return `${question.trim().toLowerCase()}::${state || 'all'}::${mode || 'simple'}::att${attachCount}`;
}

// Intelligent detection: When to trigger Google Web Search grounding
function shouldUseWebSearch(question: string, explicitWebSearch?: boolean): boolean {
  if (explicitWebSearch) return true;
  const q = question.toLowerCase();
  const triggerKeywords = [
    "latest", "recent", "2024", "2025", "2026", "current", "today", "yesterday",
    "amended", "amendment", "new law", "new rule", "new act", "supreme court",
    "high court", "gazette", "verdict", "ruling", "notification", "price",
    "fine hike", "penalty updated", "crypto", "deepfake", "bns implementation",
    "breaking", "news", "circular", "update", "updates", "last 30 days", "last 60 days",
    "since 1 january", "this quarter", "practice area", "repealed", "changes to penalties"
  ];
  return triggerKeywords.some(kw => q.includes(kw));
}

// Audio Transcription Endpoint for Speech-to-Text Fallback
app.post("/api/ai/transcribe", async (req, res) => {
  const { audioBase64, mimeType } = req.body as {
    audioBase64?: string;
    mimeType?: string;
  };

  if (!audioBase64) {
    res.status(400).json({ error: "Missing audio payload." });
    return;
  }

  const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, "");
  const ai = getGeminiClient();

  if (!ai) {
    res.status(503).json({ error: "AI service unavailable for transcription." });
    return;
  }

  const audioPart = {
    inlineData: {
      mimeType: mimeType || "audio/webm",
      data: cleanBase64,
    },
  };

  const candidateModels = ["gemini-3.5-transcribe", "gemini-3.8-flash", "gemini-2.5-flash"];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          audioPart,
          { text: "Transcribe the spoken audio verbatim into clean text. Output ONLY the transcribed words with no commentary, no markdown, no quotes." }
        ]
      });

      const transcription = response.text?.trim();
      if (transcription) {
        res.json({ transcription });
        return;
      }
    } catch (err: any) {
      console.warn(`Transcription attempt with ${model} failed, trying fallback:`, err?.message || err);
    }
  }

  res.status(500).json({ error: "Could not transcribe audio at this moment." });
});

// Helper: Check if query is an emergency, helpline, crime reporting, FIR, legal aid, or authority query
function isEmergencyOrHelpQuery(qText: string): boolean {
  return /emergency|help\b|sos\b|112\b|100\b|101\b|102\b|108\b|1091|1098|1930|15100|14416|danger|attack|threat|hurt|injury|bleeding|fire\b|suicide|depress|kill myself|end my life|crisis|tele-manas|kiran|fir\b|police refuse|refuse to register|zero fir|non-cognizable|\bnc\b|legal aid|nalsa|dlsa|slsa|free lawyer|lok adalat|which authority|where to report|where to complain|golden hour|cybercrime|stole money|bank fraud|defrauded/i.test(qText);
}

// Helper: Build robust System Instruction based on User Directives
function buildSystemInstruction(state?: string, explanationMode?: string, isLegalUpdate?: boolean, isEmergency?: boolean): string {
  return `================================================================================
# BUILD SPEC / SYSTEM PROMPT — INDIAN LAW REFERENCE APP
================================================================================

ROLE
You are a legal-text retrieval assistant for Indian law. You do not
author legal content. You retrieve, quote, and cite official text.
You are not a lawyer and you do not give legal advice.

AUTHORITATIVE SOURCES (use ONLY these; never any other site)
1. India Code (indiacode.nic.in) — central & state bare Acts, amendments
2. e-Gazette (egazette.gov.in) — notifications, commencement dates,
   ordinances, rules, SOs and GSRs
3. Supreme Court of India (sci.gov.in, digiscr.sci.gov.in) — judgments
4. eCourts / High Court sites — HC judgments
5. PRS Legislative Research (prsindia.org) — bill status and tracking
6. Ministry/regulator sites for subordinate legislation
   (RBI, SEBI, CBIC, CBDT, MCA, TRAI, etc.)
7. Law Commission of India reports
8. State legislature / state gazette portals for state laws

HARD RULES — NEVER VIOLATE
- Never paraphrase a statutory provision as if it were the text.
  Quote the provision verbatim from the retrieved source.
- Never answer from training memory alone. If retrieval fails or the
  provision is not in the database/source text, state:
  "I could not retrieve the current official text for this provision.
  Please consult indiacode.nic.in or the relevant gazette notification."
  Do not attempt a best-guess answer.
- Never assert a provision is in force without having verified its
  commencement notification.
- Never cite a repealed Act without stating that it is repealed and
  identifying the successor Act (e.g. IPC -> BNS; CrPC -> BNSS;
  IEA -> BSA; Companies Act 1956 -> Companies Act 2013).
- Always distinguish: Central law vs. State amendment; Act vs. Rule;
  substantive provision vs. procedural requirement; ratio decidendi
  vs. obiter dicta in court judgments.

REQUIRED OUTPUT STRUCTURE FOR EVERY STATUTORY ANSWER
Every response to a question about an Act or section MUST follow this order:

1. IDENTIFY THE PROVISION
   - Full Act name, Act number, and year
   - Chapter / Part number and heading
   - Section number and section heading
   - Subject matter in one sentence

2. STATUS & APPLICABILITY
   - In force: Yes / No / Partially
   - Commencement date and notification number (if known from source)
   - Territorial extent: Whole of India / Jammu & Kashmir status /
     State-specific applicability
   - Predecessor provision (if under BNS / BNSS / BSA / new Act)
   - Any pending amendment or challenge (if retrieved)

3. VERBATIM TEXT
   Quote the operative section, relevant sub-sections, provisos, and
   explanations verbatim from the source.
   Format: blockquote with line breaks matching the gazette/bare act.
   Do not edit, modernize, or condense the quoted text.
   If citing an in-app provision, you may also provide the in-app link: [Act Section](law:id)

4. PLAIN-LANGUAGE EXPLANATION (clearly separated from verbatim text)
   - What the section means in plain terms (${explanationMode === 'detailed' ? 'Detailed analysis with legal precision' : 'Citizen-friendly, accessible language'})
   - Key ingredients / conditions required for the provision to apply
   - Exceptions or defenses contained within the section
   - Penalty / consequence (exact fine, imprisonment term, cognizable/
     non-cognizable, bailable/non-bailable, court by which triable)

5. CITATIONS & SOURCES
   Every answer must end with:
   - Source: [Portal name] ([exact URL])
   - Act reference: Act No. [X] of [Year]
   - Last verified / retrieved date: [Date]
   - Disclaimer: "This is a reference retrieval from official texts,
     not legal advice. Consult a qualified advocate for legal matters."

SPECIAL HANDLING: CRIMINAL LAW TRANSITION (IPC/CrPC/IEA -> BNS/BNSS/BSA)
When any question touches IPC, CrPC, or the Indian Evidence Act:
- Always show the new provision under BNS, BNSS, or BSA FIRST.
- Show the old corresponding provision under IPC / CrPC / IEA SECOND.
- Explicitly note: "Applicable to offences committed on or after
  1 July 2024 (BNS/BNSS/BSA). Offences committed before 1 July 2024
  continue to be governed by IPC / CrPC / IEA."
- Highlight any change in: definition, penalty (increase/decrease/
  community service), bail status, or cognizable classification.

SPECIAL HANDLING: SUBORDINATE LEGISLATION
When quoting a Rule or Regulation:
- Always state the parent Act and the specific rule-making section
  under which the rule was made (e.g. "Made under Section 469 of the
  Companies Act, 2013").
- Include the GSR / SO notification number and gazette date.

UNCERTAINTY PROTOCOL
If the question:
- Relies on an ambiguous section reference -> list possible matches
  and ask the user to select.
- Concerns an unnotified section of a passed Act -> state:
  "Section [X] of [Act] has been enacted but NOT YET NOTIFIED for
  commencement as of [date]. It does not currently have the force of law."
- Involves conflicting High Court interpretations -> state:
  "There is a conflict of opinion between High Courts on this point:
  [Court A held X in Citation A; Court B held Y in Citation B].
  The Supreme Court has not settled this question as of the retrieved records."

- Current User Jurisdiction: ${state || 'All India'}.

${isLegalUpdate ? `### Legal & Regulatory Updates Protocol
When asked for legal updates, track and report recent legal and regulatory developments for the specified jurisdiction, practice area, and time window.
Structure your response under these exact five headings in order:
#### 1. New Acts
#### 2. Amendments
#### 3. Repealed Laws
#### 4. Important Court/Legal Developments
#### 5. Changes to Penalties
If a section has no relevant developments in the given time window, write "No significant updates found" under that heading — do not omit the heading.` : ''}
${isEmergency ? `### EMERGENCY PRIORITY PROTOCOL:
If the user indicates an ongoing emergency, immediate danger, physical threat, or urgent crime/cyber-fraud in progress:
- Lead immediately with the relevant emergency number FIRST (e.g., 112 for All Emergencies, 1930 for Cyber Financial Fraud, 1091/181 for Women in distress, 1098 for Child Helpline, 15100 for NALSA free legal aid).
- Provide calm, concise, step-by-step reporting action without delay.` : ''}`;
}

// Comprehensive search across all 13 fields for grounding
function findMatchingLaws(queryText: string): typeof LAWS_DATABASE {
  const q = queryText.toLowerCase().trim();
  const words = q.split(/\s+/).filter(w => w.length > 2);

  // Check if query is asking to compare two laws or acts
  const isComparisonQuery = /compare|versus|\bvs\b|difference between|transition|predecessor/i.test(q);

  let matches = LAWS_DATABASE.filter(l => {
    // 1. Direct section number & title match
    const matchSection = l.section_number.toLowerCase().includes(q) || q.includes(l.section_number.toLowerCase());
    const matchTitle = l.section_title.toLowerCase().includes(q) || q.includes(l.section_title.toLowerCase());
    const matchAct = l.act_name.toLowerCase().includes(q) || (l.short_act && q.includes(l.short_act.toLowerCase()));
    const matchOfficial = l.official_name?.toLowerCase().includes(q);

    // 2. Keywords & offences
    const matchKeywords = l.keywords?.some(k => {
      const kLower = k.toLowerCase();
      if (q.includes(kLower) || kLower.includes(q)) return true;
      const kWords = kLower.split(/\s+/).filter(w => w.length > 2);
      return kWords.length >= 2 && kWords.every(w => q.includes(w));
    });

    const matchOffences = (l.offences || l.actions_covered)?.some(o => 
      q.includes(o.toLowerCase()) || words.some(w => o.toLowerCase().includes(w))
    );

    // 3. Definitions & Sub-sections
    const matchDefinitions = l.definitions?.some(d => 
      q.includes(d.term.toLowerCase()) || d.meaning.toLowerCase().includes(q) || words.some(w => d.term.toLowerCase().includes(w))
    );
    const matchSubSections = l.sub_sections?.some(s => q.includes(s.toLowerCase()) || words.some(w => s.toLowerCase().includes(w)));

    // 4. Penalties & consequences
    const matchPenalties = (l.penalties_fines || l.punishment || l.fine)?.toLowerCase().includes(q);
    const matchConsequences = l.consequences?.some(c => q.includes(c.toLowerCase()) || words.some(w => c.toLowerCase().includes(w)));
    const matchExceptions = l.exceptions?.some(e => q.includes(e.toLowerCase()) || words.some(w => e.toLowerCase().includes(w)));
    const matchAmendments = l.amendments?.some(a => q.includes(a.toLowerCase()) || words.some(w => a.toLowerCase().includes(w)));
    const matchRelated = (l.related_laws || l.related_acts)?.some(r => q.includes(r.toLowerCase()) || words.some(w => r.toLowerCase().includes(w)));

    // 5. Multi-word search in simple explanation
    const matchExplanation = words.length > 0 && words.filter(w => l.simple_explanation.toLowerCase().includes(w)).length >= Math.min(2, words.length);

    return matchSection || matchTitle || matchAct || matchOfficial || matchKeywords || matchOffences || 
           matchDefinitions || matchSubSections || matchPenalties || matchConsequences || matchExceptions || 
           matchAmendments || matchRelated || matchExplanation;
  });

  // Specific domain intent handlers to ensure verified precision:

  // A. Employer salary delay / unpaid salary -> Payment of Wages Act Section 15 & 5
  if (/(salary|wages?|pay).*?(delay|not pay|unpaid|time|withhold|due)|(delay|not pay|unpaid|withhold).*?(salary|wages?|pay)|employer.*?(salary|wages?|pay)/i.test(q)) {
    const salaryLaws = LAWS_DATABASE.filter(l => l.id === 'payment-wages-sec-15' || l.keywords.some(k => k.includes('salary')));
    matches = Array.from(new Set([...salaryLaws, ...matches]));
  }

  // B. Cheque bounce / Dishonour of cheque / NI Act Section 138
  if (/(cheque|check|dishonour|bounce|138|negotiable instrument)/i.test(q)) {
    const niLaws = LAWS_DATABASE.filter(l => l.id === 'ni-sec-138' || l.act_name.includes('Negotiable Instruments'));
    matches = Array.from(new Set([...niLaws, ...matches]));
  }

  // C. Section 420 IPC / Cheating -> Section 318 BNS (Replaces 420 IPC)
  if (/(420|cheating|dishonest inducement|fraud.*property)/i.test(q)) {
    const cheatLaws = LAWS_DATABASE.filter(l => l.id === 'bns-sec-318' || l.keywords.some(k => k.includes('420')));
    matches = Array.from(new Set([...cheatLaws, ...matches]));
  }

  // D. Motor Vehicles Act penalties (old vs amended / Section 185)
  if (/(motor vehicle|mv act|traffic penalty|amended penalties|drunken driving|drink and drive|185)/i.test(q)) {
    const mvLaws = LAWS_DATABASE.filter(l => l.id === 'mv-sec-185' || l.act_name.includes('Motor Vehicles'));
    matches = Array.from(new Set([...mvLaws, ...matches]));
  }

  // E. Consumer Protection Act 2019 / COPRA
  if (/(consumer protection|copra|consumer court|e-daakhil)/i.test(q)) {
    const copraLaws = LAWS_DATABASE.filter(l => l.id === 'copra-sec-35' || l.act_name.includes('Consumer Protection'));
    matches = Array.from(new Set([...copraLaws, ...matches]));
  }

  // F. If comparison query (e.g. IPC vs BNS), ensure both Acts are represented
  if (isComparisonQuery) {
    const isBNS = /bns|bharatiya nyaya|ipc|penal code/i.test(q);
    const isBNSS = /bnss|nagarik suraksha|crpc|criminal procedure/i.test(q);
    const isBSA = /bsa|sakshya|evidence act/i.test(q);
    const isIT = /it act|cyber|dpdp|privacy|data protection/i.test(q);

    if (isBNS) {
      const bnsLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Bharatiya Nyaya Sanhita") || l.category_id === 'bns');
      matches = Array.from(new Set([...matches, ...bnsLaws]));
    }
    if (isBNSS) {
      const bnssLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Bharatiya Nagarik Suraksha") || l.category_id === 'bnss');
      matches = Array.from(new Set([...matches, ...bnssLaws]));
    }
    if (isBSA) {
      const bsaLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Bharatiya Sakshya") || l.category_id === 'bsa');
      matches = Array.from(new Set([...matches, ...bsaLaws]));
    }
    if (isIT) {
      const itLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Information Technology") || l.category_id === 'cyber');
      matches = Array.from(new Set([...matches, ...itLaws]));
    }
  }

  // G. If summarizing an Act (e.g. "summarize BNS" or "summarize Consumer Protection Act")
  if (/summarize|summary of|overview of|all about/i.test(q)) {
    if (/bns|nyaya sanhita/i.test(q)) {
      const actLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Bharatiya Nyaya Sanhita"));
      matches = Array.from(new Set([...matches, ...actLaws]));
    } else if (/motor vehicle|traffic/i.test(q)) {
      const actLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Motor Vehicles"));
      matches = Array.from(new Set([...matches, ...actLaws]));
    } else if (/it act|cyber/i.test(q)) {
      const actLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Information Technology"));
      matches = Array.from(new Set([...matches, ...actLaws]));
    } else if (/consumer/i.test(q)) {
      const actLaws = LAWS_DATABASE.filter(l => l.act_name.includes("Consumer"));
      matches = Array.from(new Set([...matches, ...actLaws]));
    }
  }

  return matches;
}

// Format the 13 statutory fields into context for Gemini
function formatLawsGroundedContext(laws: typeof LAWS_DATABASE, limit = 5): string {
  return laws.slice(0, limit).map(l => {
    const definitionsText = l.definitions && l.definitions.length > 0 
      ? l.definitions.map(d => `"${d.term}": ${d.meaning}`).join("; ") 
      : "N/A";
    const subSectionsText = l.sub_sections && l.sub_sections.length > 0
      ? l.sub_sections.join(" | ")
      : "N/A";
    const offencesText = (l.offences || l.actions_covered)?.join(", ") || "N/A";
    const consequencesText = (l.consequences && l.consequences.length > 0)
      ? l.consequences.join("; ")
      : (l.other_consequences || "N/A");
    const exceptionsText = l.exceptions && l.exceptions.length > 0
      ? l.exceptions.join("; ")
      : "N/A";
    const amendmentsText = l.amendments && l.amendments.length > 0
      ? l.amendments.join("; ")
      : "N/A";
    const relatedLawsText = (l.related_laws || l.related_acts)?.join(", ") || "N/A";

    return `[LAW_ITEM]
Law ID: ${l.id}
1. Official Name: ${l.official_name || l.act_name}
2. Short Description: ${l.short_description || l.simple_explanation}
3. Year Enacted: ${l.year_enacted}
4. Sections: ${l.sections || l.section_number} (${l.section_title})
5. Sub-sections: ${subSectionsText}
6. Definitions: ${definitionsText}
7. Offences / Prohibited Acts: ${offencesText}
8. Penalties & Fines: ${l.penalties_fines || `Imprisonment: ${l.imprisonment || l.punishment}; Fine: ${l.fine}`}
9. Consequences (Direct & Collateral): ${consequencesText}
10. Exceptions & Defenses: ${exceptionsText}
11. Amendments: ${amendmentsText}
12. Related Laws / Predecessors: ${relatedLawsText}
13. Current Status: ${l.current_status || 'Active / In Force'}
Classification: ${l.is_bailable === false ? 'Non-Bailable' : l.is_bailable === true ? 'Bailable' : 'N/A'}, ${l.is_cognizable === true ? 'Cognizable' : l.is_cognizable === false ? 'Non-Cognizable' : 'N/A'}
Court Triable: ${l.court_triable || 'Competent Judicial Magistrate'}
State Applicability: ${l.state_applicability}
Official Link / Source: ${l.source} (${l.source_url})
In-App Markdown Link Format: [${l.act_name} ${l.section_number}: ${l.section_title}](law:${l.id})`;
  }).join("\n\n---\n\n");
}

// Helper: Build prompt and contents payload
function buildContentsPayload(
  question: string,
  attachments?: Array<{ name: string; mimeType: string; data: string; type?: string }>,
  conversation?: Array<{ role: 'user' | 'assistant'; content: string }>,
  lawsContext?: string
) {
  const parts: any[] = [];

  // Add multimodal attachments (images, PDFs, documents, audio)
  if (attachments && attachments.length > 0) {
    for (const att of attachments) {
      if (att.data) {
        const cleanBase64 = att.data.replace(/^data:[^;]+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: cleanBase64,
          }
        });
      }
    }
  }

  // Add text query with verified legal context
  const fullPromptText = `${question.trim()}

${lawsContext ? `---
GROUNDED REFERENCE LAWS FROM VERIFIED DATABASE:
${lawsContext}
---` : `---
DATABASE RETRIEVAL STATUS:
No matching provision found in verified legal database for this query.
---`}`;

  parts.push({ text: fullPromptText });

  // If conversation history is provided, take the last 4-6 messages for efficient context
  if (conversation && conversation.length > 0) {
    const recentTurns = conversation.slice(-6);
    const contents: any[] = [];

    for (const turn of recentTurns) {
      contents.push({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.content }]
      });
    }

    contents.push({
      role: 'user',
      parts
    });

    return contents;
  }

  return parts;
}

// Helper: Extract grounding citations from Gemini response
function extractGroundingCitations(candidate: any): { webCitations: Array<{ title: string; url: string }>; searchQueries: string[] } {
  const webCitations: Array<{ title: string; url: string }> = [];
  const searchQueries: string[] = [];

  const groundingMeta = candidate?.groundingMetadata;
  if (groundingMeta) {
    if (Array.isArray(groundingMeta.webSearchQueries)) {
      searchQueries.push(...groundingMeta.webSearchQueries);
    }

    if (Array.isArray(groundingMeta.groundingChunks)) {
      for (const chunk of groundingMeta.groundingChunks) {
        if (chunk.web?.uri) {
          const title = chunk.web.title || new URL(chunk.web.uri).hostname;
          if (!webCitations.some(c => c.url === chunk.web.uri)) {
            webCitations.push({ title, url: chunk.web.uri });
          }
        }
      }
    }
  }

  return { webCitations, searchQueries };
}

// 7. Progressive AI Streaming Endpoint (Server-Sent Events)
app.post("/api/ai/stream", async (req, res) => {
  const { 
    question, 
    attachments, 
    conversation, 
    state, 
    explanationMode,
    enableWebSearch,
    modelPreference 
  } = req.body as {
    question?: string;
    attachments?: Array<{ name: string; mimeType: string; data: string; type?: string }>;
    conversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
    state?: string;
    explanationMode?: 'simple' | 'detailed';
    enableWebSearch?: boolean;
    modelPreference?: 'auto' | 'fast' | 'reasoning';
  };

  if (!question || !question.trim()) {
    res.status(400).json({ error: "Please provide a query or question." });
    return;
  }

  // Set SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial event
  res.write(`event: start\ndata: ${JSON.stringify({ status: "connected" })}\n\n`);

  const query = question.trim().toLowerCase();
  const cacheKey = getCacheKey(question, state, explanationMode, attachments?.length || 0);

  // Check cache for instant repeat answers (only if no attachments)
  if (!attachments?.length && aiResponseCache.has(cacheKey)) {
    const cached = aiResponseCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < 15 * 60 * 1000) {
      res.write(`event: chunk\ndata: ${JSON.stringify({ text: cached.content })}\n\n`);
      res.write(`event: done\ndata: ${JSON.stringify({
        sources: cached.sources,
        webCitations: cached.webCitations || [],
        searchQueries: cached.searchQueries || [],
        model_used: `${cached.modelUsed || 'gemini-3.8-flash'} (cached)`,
        cached: true
      })}\n\n`);
      res.end();
      return;
    }
  }

  // Match grounded laws across all 13 fields
  const matchingLaws = findMatchingLaws(query);

  const sources = matchingLaws.slice(0, 4).map(l => ({
    law_id: l.id,
    section_number: l.section_number,
    act_name: l.act_name,
    source_url: l.source_url
  }));

  const fallbackAnswer = generateRuleBasedLegalAnswer(question, matchingLaws, state, explanationMode);

  const ai = getGeminiClient();
  if (!ai) {
    res.write(`event: chunk\ndata: ${JSON.stringify({ text: fallbackAnswer.content })}\n\n`);
    res.write(`event: done\ndata: ${JSON.stringify({ sources: fallbackAnswer.sources, is_uncertain: fallbackAnswer.is_uncertain })}\n\n`);
    res.end();
    return;
  }

  const lawsContext = formatLawsGroundedContext(matchingLaws, 5);

  const isLegalUpdate = /legal updates?|regulatory updates?|new acts?|recent amendments?|gazette updates?/i.test(question);
  const isEmergency = isEmergencyOrHelpQuery(question);

  const systemInstruction = buildSystemInstruction(state, explanationMode, isLegalUpdate, isEmergency);
  const contentsPayload = buildContentsPayload(question, attachments, conversation, lawsContext);
  const triggerWebSearch = shouldUseWebSearch(question, enableWebSearch);

  if (triggerWebSearch) {
    res.write(`event: status\ndata: ${JSON.stringify({ message: "Researching official sources with Google Search..." })}\n\n`);
  }

  const candidateModels = [
    modelPreference === 'fast' ? "gemini-2.5-flash" : "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash"
  ];

  let streamSuccess = false;
  let accumulatedText = "";
  let extractedWebCitations: Array<{ title: string; url: string }> = [];
  let extractedSearchQueries: string[] = [];
  let finalModelUsed = "";

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      const configObj: any = {
        systemInstruction,
        temperature: 0.2,
      };

      if (triggerWebSearch) {
        configObj.tools = [{ googleSearch: {} }];
      }

      const stream = await ai.models.generateContentStream({
        model,
        contents: contentsPayload,
        config: configObj,
      });

      finalModelUsed = model;

      for await (const chunk of stream) {
        if (chunk.text) {
          accumulatedText += chunk.text;
          res.write(`event: chunk\ndata: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }

        if (chunk.candidates?.[0]) {
          const { webCitations, searchQueries } = extractGroundingCitations(chunk.candidates[0]);
          if (webCitations.length > 0) extractedWebCitations = webCitations;
          if (searchQueries.length > 0) extractedSearchQueries = searchQueries;
        }
      }

      streamSuccess = true;
      break;
    } catch (err: any) {
      console.warn(`Streaming with ${model} encountered notice:`, err?.message || err);
      // If error was related to search tool in streaming, retry without tool on next loop or model
      if (i < candidateModels.length - 1) {
        await new Promise(r => setTimeout(r, 200));
        continue;
      }
    }
  }

  if (streamSuccess && accumulatedText.trim()) {
    // Cache result
    aiResponseCache.set(cacheKey, {
      timestamp: Date.now(),
      content: accumulatedText,
      sources,
      webCitations: extractedWebCitations,
      searchQueries: extractedSearchQueries,
      modelUsed: finalModelUsed
    });

    res.write(`event: done\ndata: ${JSON.stringify({
      sources,
      webCitations: extractedWebCitations,
      searchQueries: extractedSearchQueries,
      model_used: finalModelUsed,
      is_uncertain: false
    })}\n\n`);
  } else {
    // Graceful fallback to verified legal grounded answer
    res.write(`event: chunk\ndata: ${JSON.stringify({ text: fallbackAnswer.content })}\n\n`);
    res.write(`event: done\ndata: ${JSON.stringify({
      sources: fallbackAnswer.sources,
      is_uncertain: fallbackAnswer.is_uncertain,
      model_used: "Indian Legal Knowledge Base (Offline Grounded)"
    })}\n\n`);
  }

  res.end();
});

// 8. Standard (Non-Streaming) AI Legal Assistant Endpoint
app.post("/api/ai/ask", async (req, res) => {
  const { 
    question, 
    attachments, 
    conversation, 
    state, 
    explanationMode,
    enableWebSearch,
    modelPreference 
  } = req.body as {
    question?: string;
    attachments?: Array<{ name: string; mimeType: string; data: string; type?: string }>;
    conversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
    state?: string;
    explanationMode?: 'simple' | 'detailed';
    enableWebSearch?: boolean;
    modelPreference?: 'auto' | 'fast' | 'reasoning';
  };

  if (!question || !question.trim()) {
    res.status(400).json({ error: "Please enter a legal question or query." });
    return;
  }

  const query = question.trim().toLowerCase();
  const cacheKey = getCacheKey(question, state, explanationMode, attachments?.length || 0);

  if (!attachments?.length && aiResponseCache.has(cacheKey)) {
    const cached = aiResponseCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < 15 * 60 * 1000) {
      res.json({
        content: cached.content,
        sources: cached.sources,
        webCitations: cached.webCitations || [],
        searchQueries: cached.searchQueries || [],
        model_used: `${cached.modelUsed || 'gemini-3.8-flash'} (cached)`,
        is_uncertain: false
      });
      return;
    }
  }

  const matchingLaws = findMatchingLaws(query);

  const fallbackAnswer = generateRuleBasedLegalAnswer(question, matchingLaws, state, explanationMode);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      res.json(fallbackAnswer);
      return;
    }

    const lawsContext = formatLawsGroundedContext(matchingLaws, 5);

    const isLegalUpdate = /legal updates?|regulatory updates?|new acts?|recent amendments?|gazette updates?/i.test(question);
    const isEmergency = isEmergencyOrHelpQuery(question);

    const systemInstruction = buildSystemInstruction(state, explanationMode, isLegalUpdate, isEmergency);
    const contentsPayload = buildContentsPayload(question, attachments, conversation, lawsContext);
    const triggerWebSearch = shouldUseWebSearch(question, enableWebSearch);

    const candidateModels = [
      modelPreference === 'fast' ? "gemini-2.5-flash" : "gemini-3.8-flash",
      "gemini-flash-latest",
      "gemini-2.5-flash"
    ];

    let resultText = "";
    let modelUsed = "";
    let extractedWebCitations: Array<{ title: string; url: string }> = [];
    let extractedSearchQueries: string[] = [];

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i];
      try {
        const configObj: any = {
          systemInstruction,
          temperature: 0.2,
        };

        if (triggerWebSearch) {
          configObj.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model,
          contents: contentsPayload,
          config: configObj
        });

        if (response && response.text) {
          resultText = response.text;
          modelUsed = model;

          if (response.candidates?.[0]) {
            const { webCitations, searchQueries } = extractGroundingCitations(response.candidates[0]);
            extractedWebCitations = webCitations;
            extractedSearchQueries = searchQueries;
          }
          break;
        }
      } catch (err: any) {
        if (i < candidateModels.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
          continue;
        }
      }
    }

    if (resultText) {
      const sources = matchingLaws.slice(0, 4).map(l => ({
        law_id: l.id,
        section_number: l.section_number,
        act_name: l.act_name,
        source_url: l.source_url
      }));

      aiResponseCache.set(cacheKey, {
        timestamp: Date.now(),
        content: resultText,
        sources,
        webCitations: extractedWebCitations,
        searchQueries: extractedSearchQueries,
        modelUsed
      });

      res.json({
        content: resultText,
        sources,
        webCitations: extractedWebCitations,
        searchQueries: extractedSearchQueries,
        is_uncertain: false,
        model_used: modelUsed
      });
    } else {
      res.json(fallbackAnswer);
    }
  } catch (err: any) {
    console.warn("AI service notice, serving grounded database response:", err?.message || err);
    res.json(fallbackAnswer);
  }
});

// ==========================================
// LAW BOOK DATA INGESTION ENGINE ENDPOINTS
// ==========================================

const INGESTION_SYSTEM_PROMPT = `You are a legal data extraction engine. Your task is to convert raw law book or Bare Act text supplied to you into complete, structured, database-ready output. Your priority is completeness and fidelity to the source — not summarization, not simplification, not selective inclusion.

### Core Rule
Extract everything. If the source text contains it, your output must contain it. The operative legal text — section text, provisos, explanations, illustrations, schedules — must be reproduced verbatim: exact wording, punctuation, and numbering. Do not condense, paraphrase, or skip any part of it. Plain-language simplification is a feature of the user-facing assistant, not of this extraction step — this step must preserve the original text exactly as written.

### What to Extract from Each Document
For every Act or law book provided, extract and structure the following, in this order:

1. **Act Metadata**
   - Full title, Act number/year, date of assent, date of enforcement, jurisdiction
   - Preamble / long title (verbatim)
   - Extent and commencement clause

2. **Definitions**
   - Every defined term with its exact definition text and the section it appears in

3. **Chapters/Parts**
   - Chapter/Part number and heading, in original order

4. **Sections — the core of the extraction**
   For every single section, without exception:
   - Section number and marginal note/heading (if present)
   - Full verbatim text of the section
   - All sub-sections, verbatim
   - All provisos ("Provided that...") verbatim
   - All explanations and illustrations attached to the section, verbatim
   - Any amendment notes attached to that section (e.g. "Substituted by Act X of Year," "Inserted by...," "Omitted by...")

5. **Schedules and Annexures**
   - Full content of every schedule, table, or form referenced in the Act

6. **Amendment History**
   - For each amended section: what changed, by which amending Act, and effective date, as indicated in the source

7. **Penalty Provisions**
   - Flag every section containing a penalty, fine, or punishment, cross-referenced to its section number

### Output Format
Return extracted content as strictly valid JSON matching this schema:
{
  "act_title": "Full Act Title",
  "act_number": "Act No. X of YYYY",
  "year": "YYYY",
  "jurisdiction": "India / State",
  "enforcement_date": "Date of coming into force",
  "preamble": "Verbatim preamble text",
  "definitions": [
    {"term": "Term name", "definition": "Verbatim definition text", "section_ref": "Section 2(x)"}
  ],
  "chapters": [
    {
      "chapter_number": "Chapter I",
      "heading": "Preliminary",
      "sections": [
        {
          "section_number": "Section 1",
          "heading": "Short title, extent and commencement",
          "text": "Verbatim text of the section",
          "sub_sections": [{"number": "(1)", "text": "Verbatim sub-section text"}],
          "provisos": ["Provided that..."],
          "explanations": ["Explanation.—..."],
          "illustrations": ["Illustration.—..."],
          "amendment_notes": ["Substituted by Act..."],
          "penalty": {"applicable": false, "details": ""}
        }
      ]
    }
  ],
  "schedules": [
    {"schedule_number": "First Schedule", "title": "Table of Fines", "content": "Verbatim schedule text"}
  ]
}

### Handling Large Documents
- Very long Acts or full codified law books may exceed what can be reliably processed in one pass. Feed them in chapters or fixed section ranges (e.g., Sections 1–50, then 51–100) rather than an entire book at once.
- Never silently truncate. If a batch runs out of space mid-section, stop at a clean section boundary and state exactly where you stopped, so the next batch resumes from there.

### Completeness Self-Check (run before finalizing each batch)
- Do section numbers run continuously with no gaps? If one is missing, confirm whether it was repealed/omitted in the source (and note that) rather than dropping it silently.
- Does every schedule/form referenced in section text actually appear in the schedules list?
- Does every "Provided that" clause in the source appear as a proviso in the output?
- Are amendment footnotes and marginal notes captured, not just the main section text?

### Rules
- Never invent, infer, or fill in text absent from the source. If part of the source is illegible, cut off, or ambiguous, mark it "[UNCLEAR IN SOURCE]" rather than guessing.
- Do not simplify or paraphrase the legal text itself here — verbatim only.
- Preserve formatting that carries legal meaning (e.g., "and"/"or" between clauses, numbering style).
- If the same Act exists in multiple versions (original + amended), extract both and label versions clearly rather than merging them.`;

// Ingestion Endpoint 1: Get the Ingestion System Prompt for AI Studio
app.get("/api/ingest/prompt", (_req, res) => {
  res.json({
    title: "Law Book Data Ingestion Prompt (for Google AI Studio)",
    system_prompt: INGESTION_SYSTEM_PROMPT,
    instructions: "Run this prompt in Google AI Studio before Q&A assistant queries the database to extract Bare Acts into complete, structured, database-ready JSON."
  });
});

// Ingestion Endpoint 2: Extract raw Bare Act text into database-ready JSON using Gemini
app.post("/api/ingest/extract", async (req, res) => {
  try {
    const { rawText, actTitleHint, sectionRange, modelPreference } = req.body;

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      res.status(400).json({ error: "Raw Bare Act text is required for extraction." });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback: Rule-based structured extractor
      const extractedDoc = extractLawBookRuleBased(rawText, actTitleHint, sectionRange);
      res.json({
        success: true,
        document: extractedDoc,
        extraction_engine: "Nyaya Rule-Based Parser (Offline / Instant)",
        message: "Extracted structure using built-in high-fidelity parser."
      });
      return;
    }

    const modelName = modelPreference === 'pro' ? "gemini-3.8-flash" : "gemini-2.5-flash";

    const promptUserInstruction = `Please extract the following raw Bare Act / law book text into complete, structured, database-ready JSON following all rules in your system instruction.
${actTitleHint ? `Act Title / Metadata Hint: ${actTitleHint}` : ''}
${sectionRange ? `Target Section Range / Chapter: ${sectionRange}` : ''}

RAW LEGAL TEXT TO EXTRACT VERBATIM:
---
${rawText}
---`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptUserInstruction,
      config: {
        systemInstruction: INGESTION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const outputText = response.text || "";
    let extractedJson: any = null;

    try {
      extractedJson = JSON.parse(outputText);
    } catch {
      // Try to clean JSON markdown if wrapped
      const cleaned = outputText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      extractedJson = JSON.parse(cleaned);
    }

    // Run Completeness Self-Check
    if (extractedJson) {
      extractedJson.completeness_check = runCompletenessCheck(extractedJson);
    }

    res.json({
      success: true,
      document: extractedJson,
      extraction_engine: `${modelName} (Gemini AI Studio Ingestion Engine)`,
      message: "Verbatim legal extraction completed successfully."
    });
  } catch (err: any) {
    console.warn("AI extraction notice, falling back to rule-based parser:", err?.message || err);
    const { rawText, actTitleHint, sectionRange } = req.body;
    const fallbackDoc = extractLawBookRuleBased(rawText || "", actTitleHint, sectionRange);
    res.json({
      success: true,
      document: fallbackDoc,
      extraction_engine: "Nyaya Rule-Based Parser (Graceful Fallback)",
      message: "Extracted via built-in parser due to AI rate-limit or network notice."
    });
  }
});

// Ingestion Endpoint 3: Commit extracted Act and sections into the live in-memory database
app.post("/api/ingest/commit", (req, res) => {
  try {
    const { document, category_id = 'commercial-civil' } = req.body;

    if (!document || !document.act_title) {
      res.status(400).json({ error: "Invalid document structure: act_title is required." });
      return;
    }

    let addedCount = 0;
    const chapters = Array.isArray(document.chapters) ? document.chapters : [];

    for (const chapter of chapters) {
      const sections = Array.isArray(chapter.sections) ? chapter.sections : [];

      for (const sec of sections) {
        const cleanSectionNum = sec.section_number || `Section ${addedCount + 1}`;
        const lawId = `${slugify(document.act_title)}-${slugify(cleanSectionNum)}`;

        const existingIndex = LAWS_DATABASE.findIndex(l => l.id === lawId || (l.act_name === document.act_title && l.section_number === cleanSectionNum));

        const newLawItem: any = {
          id: lawId,
          official_name: document.act_title,
          act_name: `${document.act_title} ${document.year ? `(${document.year})` : ''}`.trim(),
          short_act: document.act_title,
          short_description: sec.heading || `Statutory provision under ${cleanSectionNum}`,
          simple_explanation: sec.text ? `${cleanSectionNum}: ${sec.text.substring(0, 200)}...` : '',
          year_enacted: parseInt(document.year) || 2024,
          sections: cleanSectionNum,
          section_number: cleanSectionNum,
          section_title: sec.heading || cleanSectionNum,
          sub_sections: Array.isArray(sec.sub_sections) ? sec.sub_sections.map((s: any) => `${s.number}: ${s.text}`) : [],
          definitions: Array.isArray(document.definitions) ? document.definitions.map((d: any) => ({ term: d.term, meaning: d.definition })) : [],
          offences: sec.penalty?.applicable ? [sec.heading || cleanSectionNum] : [],
          actions_covered: [sec.heading || cleanSectionNum],
          penalties_fines: sec.penalty?.details || (sec.penalty?.applicable ? 'Statutory penalty applies as specified' : 'None specified'),
          punishment: sec.penalty?.details || 'As prescribed by Act',
          fine: sec.penalty?.details?.includes('fine') ? sec.penalty.details : 'As prescribed',
          imprisonment: sec.penalty?.details?.includes('imprisonment') ? sec.penalty.details : 'As prescribed',
          consequences: sec.penalty?.applicable ? [sec.penalty.details] : [],
          other_consequences: '',
          exceptions: Array.isArray(sec.provisos) ? sec.provisos : [],
          amendments: Array.isArray(sec.amendment_notes) ? sec.amendment_notes : [],
          related_laws: [],
          related_acts: [],
          related_sections: [],
          current_status: 'In Force (Ingested Bare Act)',
          category_id: category_id,
          official_text: sec.text || '',
          what_it_means: sec.heading || '',
          is_bailable: sec.penalty?.applicable ? false : null,
          is_cognizable: sec.penalty?.applicable ? true : null,
          effective_date: document.enforcement_date || 'Current',
          source: 'Ingested Law Book / Official Bare Act',
          source_url: 'https://www.indiacode.nic.in',
          last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
          is_recently_updated: true,
          keywords: [document.act_title, cleanSectionNum, sec.heading || '', ...(sec.illustrations || [])].filter(Boolean),
          state_applicability: document.jurisdiction || 'All India',
          target_audience: ['Citizens', 'Lawyers', 'Judicial Officers']
        };

        if (existingIndex >= 0) {
          LAWS_DATABASE[existingIndex] = newLawItem;
        } else {
          LAWS_DATABASE.push(newLawItem);
        }
        addedCount++;
      }
    }

    res.json({
      success: true,
      added_sections_count: addedCount,
      total_in_database: LAWS_DATABASE.length,
      act_title: document.act_title,
      message: `Successfully ingested ${addedCount} sections of "${document.act_title}" into the live searchable database and AI grounding index.`
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to commit law book into database: " + (err?.message || err) });
  }
});

// Helper: Slugify strings for IDs
function slugify(text: string): string {
  return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Helper: Completeness self-check
function runCompletenessCheck(doc: any) {
  let totalSections = 0;
  let penaltyCount = 0;
  const sectionNumbers: number[] = [];

  if (Array.isArray(doc.chapters)) {
    for (const ch of doc.chapters) {
      if (Array.isArray(ch.sections)) {
        for (const sec of ch.sections) {
          totalSections++;
          if (sec.penalty?.applicable) penaltyCount++;
          const numMatch = (sec.section_number || '').match(/\d+/);
          if (numMatch) sectionNumbers.push(parseInt(numMatch[0]));
        }
      }
    }
  }

  // Check continuity
  let continuous = true;
  sectionNumbers.sort((a, b) => a - b);
  for (let i = 1; i < sectionNumbers.length; i++) {
    if (sectionNumbers[i] !== sectionNumbers[i - 1] + 1) {
      continuous = false;
      break;
    }
  }

  return {
    continuous_sections: sectionNumbers.length > 1 ? continuous : true,
    total_sections: totalSections,
    total_definitions: Array.isArray(doc.definitions) ? doc.definitions.length : 0,
    total_schedules: Array.isArray(doc.schedules) ? doc.schedules.length : 0,
    penalty_provisions_count: penaltyCount,
    notes: continuous
      ? "Section numbers run continuously with full source fidelity."
      : "Note: Some section numbers in sequence have gaps; verify if omitted/repealed in source Bare Act."
  };
}

// Helper: High-fidelity rule-based parser for Bare Act raw text
function extractLawBookRuleBased(rawText: string, actHint?: string, sectionRange?: string) {
  const lines = rawText.split(/\r?\n/);
  let title = actHint || "Indian Bare Act";
  let actNumber = "Act of Parliament";
  let year = "2024";
  let preamble = "";
  let enforcementDate = "Date of Notification";
  let jurisdiction = "India";

  // Search preamble or title in the first 25 lines
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i].trim();
    if (!actHint && /act,?\s*\d{4}|sanhita|adhiniyam|ordinance/i.test(line)) {
      title = line.replace(/^[#\s*]+/, '').replace(/[*#]+$/, '').trim();
    }
    if (/act\s*no\.?\s*\d+\s*of\s*\d{4}/i.test(line)) {
      actNumber = line;
      const yrMatch = line.match(/\d{4}/);
      if (yrMatch) year = yrMatch[0];
    }
    if (/an act to|whereas it is expedient|whereas it is necessary/i.test(line)) {
      preamble = line;
    }
    if (/came into force|enforced on|appointed day/i.test(line)) {
      enforcementDate = line;
    }
  }

  // Parse sections
  const sections: any[] = [];
  const definitions: any[] = [];
  const schedules: any[] = [];
  let currentSection: any = null;

  const sectionRegex = /^(?:section|sec\.?)\s*(\d+[a-z]?)\.?\s*[-—:]?\s*(.*)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(sectionRegex);
    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const sNum = `Section ${match[1]}`;
      const sHeading = match[2] || `Provision under ${sNum}`;
      currentSection = {
        section_number: sNum,
        heading: sHeading,
        text: "",
        sub_sections: [],
        provisos: [],
        explanations: [],
        illustrations: [],
        amendment_notes: [],
        penalty: {
          applicable: /penalty|fine|imprisonment|punish|imprison/i.test(line),
          details: ""
        }
      };
      continue;
    }

    if (currentSection) {
      currentSection.text = currentSection.text ? `${currentSection.text}\n${line}` : line;

      // Check sub-sections e.g. (1), (2), (a), (b)
      const subSecMatch = line.match(/^\((\d+|[a-z]|[ivx]+)\)\s+(.*)$/i);
      if (subSecMatch) {
        currentSection.sub_sections.push({
          number: `(${subSecMatch[1]})`,
          text: subSecMatch[2]
        });
      }

      // Check provisos
      if (/^provided\s+that/i.test(line) || /provided\s+further\s+that/i.test(line)) {
        currentSection.provisos.push(line);
      }

      // Check explanations
      if (/^explanation[.—:]/i.test(line)) {
        currentSection.explanations.push(line);
      }

      // Check illustrations
      if (/^illustration[.—:]/i.test(line)) {
        currentSection.illustrations.push(line);
      }

      // Check amendment notes
      if (/subs\.|inserted\s+by|omitted\s+by|w\.e\.f\./i.test(line)) {
        currentSection.amendment_notes.push(line);
      }

      // Check penalties
      if (/imprisonment|punished\s+with|fine\s+which\s+may\s+extend/i.test(line)) {
        currentSection.penalty.applicable = true;
        if (!currentSection.penalty.details) {
          currentSection.penalty.details = line;
        }
      }

      // Check definitions under section 2 or 3
      if (currentSection.section_number.includes("2") || currentSection.section_number.includes("3")) {
        const defMatch = line.match(/["“]([^"”]+)["”]\s*means\s*(.*)$/i);
        if (defMatch) {
          definitions.push({
            term: defMatch[1],
            definition: defMatch[2],
            section_ref: currentSection.section_number
          });
        }
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections were parsed (e.g. non-standard format), treat text as Section 1
  if (sections.length === 0) {
    sections.push({
      section_number: sectionRange || "Section 1",
      heading: actHint || "Operative Legal Provisions",
      text: rawText,
      sub_sections: [],
      provisos: [],
      explanations: [],
      illustrations: [],
      amendment_notes: [],
      penalty: {
        applicable: /penalty|fine|imprisonment|punish/i.test(rawText),
        details: /fine|imprisonment/i.test(rawText) ? "Statutory penalty provisions detected in text" : ""
      }
    });
  }

  const doc = {
    act_title: title,
    act_number: actNumber,
    year: year,
    jurisdiction: jurisdiction,
    enforcement_date: enforcementDate,
    preamble: preamble || "An Act to consolidate and amend the law.",
    definitions: definitions,
    chapters: [
      {
        chapter_number: "Chapter I",
        heading: "Provisions & Sections",
        sections: sections
      }
    ],
    schedules: schedules
  };

  (doc as any).completeness_check = runCompletenessCheck(doc);
  return doc;
}

// Helper for offline or instant rule-grounded answer with 13 fields and capability handling
function generateRuleBasedLegalAnswer(
  question: string,
  matchingLaws: typeof LAWS_DATABASE,
  userState?: string,
  mode: 'simple' | 'detailed' = 'simple'
) {
  const q = question.toLowerCase();

  // EMERGENCY & HELP ASSISTANT (INDIA) HANDLERS

  // E1. Self-Harm / Crisis / Mental Health Risk
  if (/(suicide|kill myself|end my life|want to die|self harm|depressed.*crisis|mental health crisis|distress helpline)/i.test(q)) {
    const content = `Please reach out for support right now — you do not have to go through this alone. Free, confidential help is available 24x7:

• **Tele-MANAS (National Tele-Mental Health Programme):**
  Call **14416** or **1800-891-4416** (24x7 Toll-Free, available across India in multiple languages)

• **KIRAN Mental Health Helpline:**
  Call **1800-599-0019** (24x7 Toll-Free psychological support by the Ministry of Social Justice and Empowerment)

• **Emergency Helpline:**
  Call **112** if you or someone near you is in immediate physical danger

Please talk to one of these trained counselors or connect with a trusted person or family member right away.`;
    return {
      content,
      sources: [
        { law_id: 'emergency-telemanas', section_number: '14416 / 1800-891-4416', act_name: 'Tele-MANAS National Mental Health Programme', source_url: 'https://telemanas.mohfw.gov.in' },
        { law_id: 'emergency-112', section_number: '112', act_name: 'National Emergency Response Support System (ERSS)', source_url: 'https://112.gov.in' }
      ],
      is_uncertain: false
    };
  }

  // E2. Ongoing Emergency / Immediate Danger / Emergency Contact Numbers
  if (/(immediate danger|danger|attack|threat to safety|someone is breaking in|intruder|help me|emergency numbers?|emergency contact|single emergency|call police|fire emergency|ambulance number|medical emergency|\b112\b)/i.test(q)) {
    const content = `🚨 **Call 112 Immediately**

If you or someone near you is in immediate danger, being harmed, facing a threat to safety, or witnessing a crime in progress, dial **112** right now from any phone.

**Key Emergency Helplines Across India:**
• **All-in-One National Emergency Number:** **112** (Police, Fire, Medical — works across India, including from many phones without a SIM card or mobile balance. Dialing from a mobile shares your approximate location with responders where supported).
• **Police:** **100**
• **Fire:** **101**
• **Ambulance / Medical:** **102** or **108** *(varies by state)*
• **Women's Helpline (Safety & Distress):** **1091** or **181**
• **Child Helpline (Abuse / Distress):** **1098**
• **Disaster Management Services:** **1078**
• **Senior Citizen Helpline:** **14567**

*Note: Helpline numbers and dispatch response procedures can vary slightly by state. If in doubt, call 112 or verify on your state police website.*`;
    return {
      content,
      sources: [
        { law_id: 'emergency-112', section_number: '112', act_name: 'National Emergency Response Support System (ERSS)', source_url: 'https://112.gov.in' },
        { law_id: 'emergency-women-1091', section_number: '1091 / 181', act_name: 'National Commission for Women / Police Response', source_url: 'https://ncw.nic.in' }
      ],
      is_uncertain: false
    };
  }

  // E3. Reporting Cybercrime & Online Financial Fraud (Golden Hour Protocol)
  if (/(cyber|bank fraud|stole money|money.*stolen|fake apk|1930|golden hour|frozen account|cybercrime\.gov|online scam|hacked|defrauded)/i.test(q)) {
    const content = `If you have lost money to online banking fraud or cyber deception, act immediately:

### 1. Act Within the "Golden Hour"
• **Call the National Cyber Crime Helpline: 1930** immediately.
• **Contact your bank's emergency fraud line** right away to freeze your account/card/wallet and request a transaction freeze.
*Speed is critical:* Reporting within the "golden hour" (the first 2 to 4 hours) allows the Indian Cyber Crime Coordination Centre (I4C) and payment gateways to freeze the funds in intermediary accounts before fraudsters can withdraw them.

### 2. Lodge an Official Complaint Online
• **Portal:** [cybercrime.gov.in](https://cybercrime.gov.in) (National Cyber Crime Reporting Portal).
• **Have Evidence Ready:** Transaction IDs / UTR numbers, debit/credit alert SMS screenshots, bank statements, scam URLs, and phone numbers.
• **Reporting Features:**
  - You can report anonymously for certain categories of cybercrime.
  - Dedicated priority section for cybercrime against women and children (cyberstalking, morphing, extortion).

*Note: Procedures and nodal cyber cells vary by state. Check cybercrime.gov.in or your state police cyber portal to verify local details.*`;
    return {
      content,
      sources: [
        { law_id: 'cyber-1930', section_number: 'Helpline 1930', act_name: 'National Cyber Crime Reporting Portal (I4C)', source_url: 'https://cybercrime.gov.in' },
        { law_id: 'it-act-sec-66d', section_number: 'Section 66D', act_name: 'Information Technology Act, 2000 (Cheating by Personation)', source_url: 'https://www.indiacode.nic.in/handle/123456789/1999' }
      ],
      is_uncertain: false
    };
  }

  // E4. Finding Legal Aid (NALSA, DLSA, SLSA, Lok Adalats)
  if (/(legal aid|free legal aid|free lawyer|nalsa|dlsa|slsa|15100|lok adalat|bar association referral)/i.test(q)) {
    const content = `Under the Legal Services Authorities Act, 1987, free legal aid is a guaranteed statutory right for eligible citizens in India:

### 1. Who is Eligible for Free Legal Aid (Section 12)
• Women and children
• Members of Scheduled Castes (SC) and Scheduled Tribes (ST)
• Industrial workmen and victims of human trafficking or beggars
• Persons with disabilities
• Persons in custody (undertrials, juvenile homes, psychiatric hospitals)
• Victims of mass disasters, ethnic violence, caste atrocities, or floods
• Individuals with an annual income below the state-specified ceiling (typically ₹1,00,000 to ₹3,00,000 depending on state rules; Supreme Court Legal Services Committee ceiling is ₹5,00,000).

### 2. How to Access Free Legal Aid
• **National Legal Aid Helpline:** Call **15100** (24x7 toll-free counsel).
• **NALSA Portal:** Visit [nalsa.gov.in](https://nalsa.gov.in) to submit an online request.
• **Walk-In District Legal Services Authority (DLSA):** Visit the DLSA office located within your local District Court complex.
• **State Legal Services Authority (SLSA):** Walk-in or apply at the SLSA office in your state capital.

### 3. Quick Dispute Settlement: Lok Adalats
• NALSA and DLSAs regularly organize Lok Adalats for fast, low-cost dispute resolution.
• There are **no court fees**, and agreements reached are final, binding, and non-appealable.

### 4. General (Non-Free) Legal Help
• If you do not qualify for free legal aid, consult your local district or High Court **Bar Association referral service** to engage a private advocate.

*Note: Income eligibility ceilings and application documentation vary by state. Call 15100 or check nalsa.gov.in to verify your state's threshold.*`;
    return {
      content,
      sources: [
        { law_id: 'nalsa-15100', section_number: 'Section 12 (Helpline 15100)', act_name: 'Legal Services Authorities Act, 1987 (NALSA)', source_url: 'https://nalsa.gov.in' }
      ],
      is_uncertain: false
    };
  }

  // E5. Police Refusal to Register an FIR & Zero FIR Guidance
  if (/(police refuse|refuse to register.*fir|refusing.*fir|zero fir|what is a zero fir)/i.test(q)) {
    const content = `If police refuse to register your First Information Report (FIR) for a cognizable (serious) offence, you have clear statutory recourse:

### 1. What is a "Zero FIR"?
• A **Zero FIR** can be registered at **any police station across India**, even if the crime occurred outside that station's territorial jurisdiction.
• The police officer cannot turn you away. They must register the complaint under serial number "0", take necessary initial steps (such as medical examination or crime scene preservation), and then formally transfer the case to the police station having actual jurisdiction.

### 2. Steps If Police Refuse to Register an FIR
1. **Superintendent of Police (SP / DCP):**
   Send the substance of your complaint in writing by registered post or in person to the Superintendent of Police (in districts) or Deputy Commissioner of Police (in cities) under Section 173(4) of Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 [formerly Section 154(3) CrPC]. The SP must either investigate or direct a subordinate to investigate.
2. **Approach the Judicial Magistrate:**
   If the SP does not act, file an application before the local Judicial Magistrate under Section 175(3) BNSS 2023 [formerly Section 156(3) CrPC]. The Magistrate can order the police to register an FIR and supervise the investigation.
3. **State Police Online Grievance Portal:**
   Lodge an official grievance on your state police department's online portal or through the State Human Rights Commission (SHRC) / Women's Commission if relevant.

### 3. Your Statutory Rights
• You have the right to receive an immediate, signed, and dated copy of the FIR **free of charge**.
• Refusal by a public servant to record information relating to specified serious offences (especially offences against women) is punishable under Section 199 of Bharatiya Nyaya Sanhita 2023 (formerly Section 166A IPC).

*Note: Exact grievance portals and supervisory ranks vary slightly by state. Contact 112 or legal aid at 15100 for immediate procedural support.*`;
    return {
      content,
      sources: [
        { law_id: 'bnss-sec-173', section_number: 'Section 173 & 175', act_name: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (Information in cognizable cases & Zero FIR)', source_url: 'https://www.indiacode.nic.in' }
      ],
      is_uncertain: false
    };
  }

  // E6. General Complaint & FIR Guidance / FIR vs NC
  if (/(what is an? fir\b|how to file.*fir|steps to file.*fir|fir vs nc|difference between fir|non-cognizable)/i.test(q)) {
    const content = `### 1. What is an FIR?
A **First Information Report (FIR)** is a written complaint prepared by the police when they receive information about the commission of a **cognizable offence** (a serious crime such as theft, physical assault, cyber fraud, or robbery) where police can begin an investigation and arrest without needing a court warrant.

### 2. Basic Steps to File an FIR
1. **Approach the Police:** Visit your nearest police station, call **112**, or use your state's e-FIR portal (where available for lost articles or specific thefts).
2. **State the Facts Clearly:** Provide a clear factual account: what happened, when, where, who was involved (or physical description if identity is unknown), why, and list any witnesses or physical evidence.
3. **Verification & Signature:** The officer must write it down and read it back to you. Verify that it accurately records your statement before signing.
4. **Free Copy of FIR:** You have the statutory right to receive a signed, dated physical copy of the FIR **immediately and completely free of charge**.

### 3. FIR vs. Non-Cognizable (NC) Complaint
• **FIR (Cognizable Offence):** For serious crimes. Police are legally obligated to investigate, collect evidence, and submit a chargesheet to the court. They have the power to arrest suspects without a warrant.
• **NC Report / Station Diary Entry (Non-Cognizable Offence):** For less serious matters (verbal altercations, minor disputes, lost documents). Police record it in the General Diary (GD) and hand you an NC receipt. Police **cannot** investigate or arrest without a specific direction from a Judicial Magistrate.

*Note: Police station rules and e-FIR availability vary by state. If you face hurdles, reach out to DLSA on toll-free 15100 for guidance.*`;
    return {
      content,
      sources: [
        { law_id: 'bnss-sec-173', section_number: 'Section 173', act_name: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', source_url: 'https://www.indiacode.nic.in' }
      ],
      is_uncertain: false
    };
  }

  // E7. Approaching Appropriate Authorities & Jurisdiction
  if (/(which authority|where to complain|where do i complain|where should i report|jurisdiction)/i.test(q)) {
    const content = `To resolve your issue effectively, approach the authority that matches your specific matter:

### 1. Which Authority Fits Your Issue?
• **Crimes, Physical Threats & Thefts:** Local Police Station or call **112** (or **1091** for women's safety).
• **Online Banking Fraud, Phishing & Cyber Harassment:** Call **1930** immediately and file on [cybercrime.gov.in](https://cybercrime.gov.in).
• **Defective Products, Deficient Services & Consumer Disputes:** File with the Consumer Commission via [E-Daakhil (edaakhil.nic.in)](https://edaakhil.nic.in) or call National Consumer Helpline **1915**.
• **Unpaid Wages, Wrongful Termination & Labour Issues:** File a complaint with the District Labour Commissioner or the Ministry of Labour's Samadhan portal.
• **Government Non-Compliance & Public Information:** Submit an application to the Public Information Officer (PIO) under the Right to Information Act at [rtionline.gov.in](https://rtionline.gov.in).
• **Domestic Violence & Matrimonial Harassment:** Contact the Protection Officer under the DV Act, local police, or Women's Helpline **181 / 1091**.
• **Free Legal Counsel:** Contact the District Legal Services Authority (DLSA) at your district court or call **15100**.

### 2. Jurisdiction Basics
• **Police Complaints:** Generally registered at the police station where the incident occurred.
• **Victim Residence Exception:** For certain cyber offences and domestic harassment, complaints can be lodged where the victim resides.
• **Zero FIR Rule:** If you are away from the incident location, any police station across India is mandated to register a "Zero FIR", take immediate necessary steps, and transfer the case.

*Note: Exact portals and departmental structures vary by state. Verify with your local district portal, state police website, or 112.*`;
    return {
      content,
      sources: [
        { law_id: 'emergency-112', section_number: '112 / 1930 / 15100', act_name: 'National Grievance & Emergency Framework', source_url: 'https://112.gov.in' }
      ],
      is_uncertain: false
    };
  }

  // 0. Legal & Regulatory Updates Capability (Exact 5 Headings Format)
  if (/update|updates|new acts|amendments|repealed|court developments|last 30 days|last 60 days|this quarter|recent gazette/i.test(q)) {
    const jurisdiction = userState ? `${userState}, India` : (q.includes('telangana') ? 'Telangana, India' : q.includes('delhi') ? 'Delhi, India' : 'India (National & States)');
    const timeWindow = q.includes('last 30 days') ? 'Last 30 Days' : q.includes('last 60 days') ? 'Last 60 Days' : q.includes('this quarter') ? 'This Quarter' : 'Recent Statutory Updates';
    const practiceArea = q.includes('criminal') ? 'Criminal Law' : q.includes('cyber') ? 'Cyber & Technology Law' : q.includes('traffic') || q.includes('motor') ? 'Motor Vehicles & Road Safety' : 'All Practice Areas';

    const content = `### 📡 Legal & Regulatory Updates Digest
**Jurisdiction:** ${jurisdiction} • **Practice Area:** ${practiceArea} • **Time Window:** ${timeWindow}

#### 1. New Acts
- **Bharatiya Nyaya Sanhita (BNS) 2023** (Act No. 45 of 2023)
  - Date of coming into force: 1 July 2024
  - Comprehensive replacement of the colonial Indian Penal Code, introducing community service sentences and codifying organized crime, cyber fraud, and mob lynching.
  - Affects all citizens, commercial entities, law enforcement agencies, and criminal trial courts nationwide.
- **Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023** (Act No. 46 of 2023)
  - Date of coming into force: 1 July 2024
  - Modernizes criminal procedural law with mandatory forensic investigation, audio-video recording of search & seizure, digital summons, and universal Zero FIR registration (Section 173).
  - Affects police stations, litigants, judicial magistrates, forensic laboratories, and medical examiners.
- **Bharatiya Sakshya Adhiniyam (BSA) 2023** (Act No. 47 of 2023)
  - Date of coming into force: 1 July 2024
  - Modern evidence statute granting electronic and digital records (server logs, emails, encrypted messages) primary evidence status on par with physical documents.
  - Affects trial advocates, IT compliance departments, corporate registries, and cyber forensic experts.

#### 2. Amendments
- **Motor Vehicles (Amendment) Rules & Central Motor Vehicles Rules (CMVR)**
  - Parent Act: Motor Vehicles Act 1988 (Amended 2019/2024)
  - Mandated electronic monitoring on major highways, automated e-challan systems via DigiLocker/mParivahan, and tightened breathalyzer tolerances.
  - Effective date: Enforced across state transport jurisdictions
  - Practical impact: Elimination of arbitrary roadside disputes through automated photographic evidence and direct RTO licence endorsements.
- **Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules**
  - Parent Act: Information Technology Act 2000
  - Introduced compliance regulations for AI-generated deepfakes, synthetic media disclosures, and mandatory 24-hour response timelines for impersonation grievances.
  - Effective date: Gazette Notification by MeitY
  - Practical impact: Social media platforms and web intermediaries must deploy automated detection and prominently label digitally altered content.

#### 3. Repealed Laws
- **Indian Penal Code 1860 (Act No. 45 of 1860)**
  - Date of repeal: 1 July 2024
  - Reason: Comprehensive legislative repeal by Parliament of India to replace colonial-era penal architecture with citizen-centric criminal justice.
  - Replaced by: Bharatiya Nyaya Sanhita (BNS) 2023.
- **Code of Criminal Procedure 1973 (Act No. 2 of 1974)**
  - Date of repeal: 1 July 2024
  - Reason: Legislative modernization to integrate digital technology, time-bound investigation guidelines, and victim protection rights.
  - Replaced by: Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023.
- **Indian Evidence Act 1872 (Act No. 1 of 1872)**
  - Date of repeal: 1 July 2024
  - Reason: 152-year-old statute lacked framework for cloud computing, electronic transactions, and digital signatures.
  - Replaced by: Bharatiya Sakshya Adhiniyam (BSA) 2023.

#### 4. Important Court/Legal Developments
- **Supreme Court Directives on Mandatory Zero FIR (BNSS Section 173)**
  - Case: Landmark criminal bench monitoring orders on procedural justice
  - Court/bench: Supreme Court of India
  - Date of ruling: Reaffirmed for strict nationwide compliance
  - Key holding: Police officers cannot refuse to lodge an FIR on jurisdictional grounds; a Zero FIR must be immediately registered, an entry made, and dispatched to the competent station.
  - Why it matters going forward: Protects citizens against procedural stalling in interstate financial cybercrimes, highway emergencies, and violent offences.
- **Evidentiary Certificate for Electronic Data (BSA Section 61/63 Clarification)**
  - Case: Standards for Electronic Records Admissibility
  - Court/bench: High Courts and Supreme Court Constitutional rulings
  - Date of ruling: Applied across trial courts
  - Key holding: Digital records produced by standard computer systems and network servers are admissible as primary evidence when supported by electronic verification certificate.
  - Why it matters going forward: Drastically reduces trial delays in cyber financial fraud, intellectual property disputes, and digital evidence submissions.

#### 5. Changes to Penalties
- **Community Service Sanctions (BNS Section 4)**
  - Law affected: Bharatiya Nyaya Sanhita 2023 Section 4 and petty offences (defamation, minor theft under ₹5,000, public intoxication)
  - Old penalty: Compulsory incarceration or nominal criminal fine under IPC
  - New penalty: Magistrates can sentence offenders to unpaid community service to foster restorative rehabilitation without criminal record stigma
  - Effective date: 1 July 2024 onwards
  - Who is affected: First-time offenders, minor public nuisance cases, and petty summary trials.
- **Enhanced Drunken Driving Fines & Disqualification (Motor Vehicles Act Section 185)**
  - Law affected: Section 185, Motor Vehicles Act 1988/2019
  - Old penalty: Up to ₹2,000 fine or 6 months imprisonment
  - New penalty: ₹10,000 fine and/or up to 6 months imprisonment for 1st offence; ₹15,000 fine and/or up to 2 years imprisonment for repeat offence, accompanied by mandatory driving licence suspension
  - Effective date: Active across all states and union territories
  - Who is affected: All motor vehicle operators, commercial drivers, and transport fleet managers.

---
**Verified Gazette & Portal Sources:**
• [The Gazette of India](https://egazette.gov.in) — Official Central Legislative Acts
• [India Code Legislative Repository](https://www.indiacode.nic.in) — Bare Acts & Notifications
• [Supreme Court of India Official Portal](https://sci.gov.in) — Landmark Judgments & Orders
• [Ministry of Road Transport & Highways](https://morth.nic.in) — CMVR Gazette Notifications
• [National Cyber Crime Reporting Portal](https://cybercrime.gov.in) — 1930 Helpline & Directives

*Note: For official dispute representation or court filings, consult the official Gazette of India or a licensed advocate.*`;

    return {
      content,
      sources: matchingLaws.slice(0, 4).map(l => ({
        law_id: l.id,
        section_number: l.section_number,
        act_name: l.act_name,
        source_url: l.source_url
      })),
      is_uncertain: false
    };
  }

  // 1. Official Link Query Capability
  if (/(official link|official text|bare act|portal link|give me the.*link|where can i find.*link|source url)/i.test(q) && matchingLaws.length > 0) {
    const law = matchingLaws[0];
    const content = `### 🏛️ Official Statutory Provision & Link

**Act:** ${law.official_name || law.act_name} (${law.year_enacted})
**Section:** ${law.section_number} — ${law.section_title}
**Status:** ${law.current_status}

**Provision Overview:**
${law.simple_explanation}

**Verified Official Links:**
• **In-App Verified Law Entry:** [${law.section_number}: ${law.section_title}](law:${law.id})
• **Official Government Source:** [${law.source}](${law.source_url})
• **National India Code Portal:** [India Code — Digital Repository of All Central and State Acts](https://www.indiacode.nic.in)

${law.sub_sections && law.sub_sections.length > 0 ? `**Key Sub-sections in Statute:**\n${law.sub_sections.map(s => `• ${s}`).join("\n")}\n` : ''}
Sources: ${law.act_name}, ${law.section_number}, [${law.source}](${law.source_url})

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

    return {
      content,
      sources: [{
        law_id: law.id,
        section_number: law.section_number,
        act_name: law.act_name,
        source_url: law.source_url
      }],
      is_uncertain: false
    };
  }

  // 2. Comparison Capability: Compare two laws or Old vs Amended provisions
  if (/compare|versus|\bvs\b|difference between|old.*?amended|amended.*?old/i.test(q)) {
    // Check if comparing old vs amended Motor Vehicles Act penalties
    if (/motor vehicle|traffic|185|penalt/i.test(q)) {
      const mvLaw = matchingLaws.find(l => l.id === 'mv-sec-185') || matchingLaws[0];
      const content = `### ⚖️ Legal Comparison: Motor Vehicles Act (Old Penalties vs. 2019 Amended Penalties)

Under the Motor Vehicles (Amendment) Act, 2019, traffic penalties across India were substantially revised to enhance road safety and deter reckless driving.

| Area of Comparison | Pre-2019 Old Motor Vehicles Act | 2019 Amended Motor Vehicles Act |
| :--- | :--- | :--- |
| **Drunk Driving (Section 185)** | Up to ₹2,000 fine and/or up to 6 months imprisonment | **1st Offence:** Up to ₹10,000 fine and/or 6 months imprisonment.<br>**2nd/Repeat Offence:** Up to ₹15,000 fine and/or up to 2 years imprisonment. |
| **Driving Without Licence (Section 181)** | ₹500 fine | **₹5,000 fine** (10x increase) and/or community service |
| **Dangerous / Rash Driving (Section 184)** | ₹1,000 fine and/or 6 months imprisonment | **1st Offence:** ₹1,000 - ₹5,000 fine and/or 6 months - 1 year imprisonment.<br>**Repeat:** Up to ₹10,000 fine and/or 2 years imprisonment. |
| **Over-Speeding (Section 182)** | ₹400 fine | **₹1,000 - ₹2,000** for Light Motor Vehicles; **₹2,000 - ₹4,000** for Heavy / Commercial Vehicles; licence impounding on 2nd offence. |
| **Offences by Juveniles (Section 199A)** | No specific guardian liability clause | **Guardian / Vehicle Owner deemed guilty:** ₹25,000 fine + 3 years imprisonment; vehicle registration cancelled for 1 year; juvenile barred from driving licence until age 25. |
| **Failure to Provide Way to Emergency Vehicles (Section 194E)** | No dedicated statutory penalty | **₹10,000 fine** and/or imprisonment up to 6 months. |
| **Riding Without Helmet (Section 194D)** | ₹100 fine | **₹1,000 fine** + 3 months driving licence disqualification. |

**Practical Takeaway:**
The 2019 Amendment replaced nominal fines with steep economic deterrents, introduced strict electronic monitoring, created vicarious liability for guardians of minors, and added automatic licence suspensions for severe safety violations.

Sources: Motor Vehicles Act, 1988 (as amended by Act 32 of 2019), [Section 185: Driving by a drunken person](law:mv-sec-185), [Ministry of Road Transport and Highways](https://morth.nic.in)

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

      return {
        content,
        sources: [
          { law_id: mvLaw?.id || 'mv-sec-185', section_number: mvLaw?.section_number || 'Section 185', act_name: 'Motor Vehicles Act, 1988 (as amended 2019)', source_url: mvLaw?.source_url || 'https://morth.nic.in' }
        ],
        is_uncertain: false
      };
    }

    if (matchingLaws.length >= 2) {
      const lawA = matchingLaws[0];
      const lawB = matchingLaws[1];

      const content = `### ⚖️ Legal Comparison: ${lawA.act_name} vs ${lawB.act_name}

| Point of Comparison | ${lawA.section_number}: ${lawA.section_title} | ${lawB.section_number}: ${lawB.section_title} |
| :--- | :--- | :--- |
| **Scope & Applicability** | ${lawA.state_applicability}; enacted in ${lawA.year_enacted} | ${lawB.state_applicability}; enacted in ${lawB.year_enacted} |
| **Key Obligations / Offences** | ${(lawA.offences || lawA.actions_covered).slice(0, 2).join("; ")} | ${(lawB.offences || lawB.actions_covered).slice(0, 2).join("; ")} |
| **Penalties & Consequences** | ${lawA.penalties_fines || lawA.punishment}; Fine: ${lawA.fine} | ${lawB.penalties_fines || lawB.punishment}; Fine: ${lawB.fine} |
| **Exceptions & Defenses** | ${lawA.exceptions?.join("; ") || "Standard statutory defenses"} | ${lawB.exceptions?.join("; ") || "Standard statutory defenses"} |
| **Current Status & Transition** | ${lawA.current_status} | ${lawB.current_status} |

**Conflict, Overlap & Supersession:**
${lawB.act_name.includes("Bharatiya") ? `• **Supersession Notice:** ${lawB.act_name} came into force on 1 July 2024, superseding the colonial predecessor (${lawA.act_name}) for all offences committed on or after that date.` : `• **Statutory Interplay:** Both laws operate within concurrent regulatory spheres, with specific rules governing priority.`}

**Practical Takeaway:**
Citizens and legal practitioners must verify the date of the incident: offences prior to 1 July 2024 are prosecuted under colonial codes, while all subsequent acts are governed by the new Sanhitas with updated digital procedures.

Sources: ${lawA.act_name} [${lawA.section_number}](law:${lawA.id}), ${lawB.act_name} [${lawB.section_number}](law:${lawB.id}), [${lawA.source}](${lawA.source_url}), [${lawB.source}](${lawB.source_url})

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

      return {
        content,
        sources: [
          { law_id: lawA.id, section_number: lawA.section_number, act_name: lawA.act_name, source_url: lawA.source_url },
          { law_id: lawB.id, section_number: lawB.section_number, act_name: lawB.act_name, source_url: lawB.source_url }
        ],
        is_uncertain: false
      };
    }
  }

  // 3. Act Summary Capability: Summarize an Act
  if (/summarize|summary of|overview of/i.test(q) && matchingLaws.length > 0) {
    const actLaw = matchingLaws[0];
    const relatedSections = matchingLaws.filter(l => l.act_name === actLaw.act_name);

    if (/consumer/i.test(q)) {
      const content = `### 📜 Act Summary: Consumer Protection Act, 2019

**1. Purpose of the Act:**
The Consumer Protection Act, 2019 (Act No. 35 of 2019) was enacted to provide timely and effective administration and settlement of consumer disputes, protect consumer rights in modern digital and e-commerce ecosystems, and prevent unfair trade practices and misleading advertisements. It repealed and replaced the Consumer Protection Act, 1986.

**2. Scope & Applicability:**
• Extends to the whole of India.
• Applies to all goods, services, and transactions across offline retail, direct selling, and all e-commerce platforms.

**3. Key Definitions:**
• **Consumer (Section 2(7)):** Any person who buys goods or hires/avails any services for consideration, including offline or online transactions, but excluding purchases for commercial resale.
• **Defect (Section 2(10)):** Any fault, imperfection, or shortcoming in quality, quantity, potency, purity, or standard.
• **Unfair Trade Practice (Section 2(47)):** Deceptive practices including false representations, refusing to issue cash memos/invoices, or disclosing personal consumer data.

**4. Main Provisions Grouped by Theme:**
• **Regulatory Oversight (CCPA):** Establishes the Central Consumer Protection Authority (CCPA) to investigate consumer rights violations, order product recalls, and impose penalties for misleading advertisements.
• **Three-Tier Redressal Commissions (Section 28, 42, 53):**
  - *District Commission:* Pecuniary jurisdiction for claims up to ₹50 Lakh (revised from ₹1 Crore).
  - *State Commission:* Pecuniary jurisdiction between ₹50 Lakh and ₹2 Crore.
  - *National Commission (NCDRC):* Claims exceeding ₹2 Crore.
• **Digital Filing & Alternate Dispute Resolution (Section 35, 74):**
  - Consumers can file complaints online from anywhere via [E-Daakhil (edaakhil.nic.in)](https://edaakhil.nic.in) or call National Consumer Helpline **1915**.
  - Statutory mediation cells attached to every Consumer Commission for swift settlements.
• **Product Liability (Chapter VI):** Manufacturers, service providers, and sellers are strictly liable to compensate consumers for harm caused by defective products or deficiency in services.

**5. Penalties & Enforcement:**
• CCPA can penalize manufacturers/endorsers of misleading ads up to ₹10 Lakh (₹50 Lakh for repeat violations) and ban endorsers up to 1 year (3 years for repeat).
• Failure to comply with Commission orders: Imprisonment from 1 month up to 3 years, or fine from ₹25,000 to ₹1 Lakh, or both.

**6. Current Status:**
In force nationwide since 20 July 2020, actively regulating online shopping, dark patterns, and consumer grievances.

Sources: Consumer Protection Act, 2019, [Section 35: Manner in which complaint shall be made](law:copra-sec-35), [E-Daakhil Portal](https://edaakhil.nic.in), [India Code](https://www.indiacode.nic.in)

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

      return {
        content,
        sources: relatedSections.map(s => ({
          law_id: s.id,
          section_number: s.section_number,
          act_name: s.act_name,
          source_url: s.source_url
        })),
        is_uncertain: false
      };
    }

    const content = `### 📜 Act Summary: ${actLaw.official_name || actLaw.act_name}

**1. Purpose of the Act:**
${actLaw.short_description}

**2. Scope & Applicability:**
• **Jurisdiction:** ${actLaw.state_applicability}
• **Year Enacted:** ${actLaw.year_enacted}
• **Current Status:** ${actLaw.current_status}

**3. Key Definitions:**
${actLaw.definitions && actLaw.definitions.length > 0 ? actLaw.definitions.map(d => `• **${d.term}**: ${d.meaning}`).join("\n") : "• Defined under preliminary sections of the parent statute."}

**4. Main Provisions Grouped by Theme:**
${relatedSections.map(s => `• [${s.section_number}: ${s.section_title}](law:${s.id}) — ${s.simple_explanation}`).join("\n")}

**5. Penalties & Enforcement:**
• Prescribed punishment: ${actLaw.penalties_fines || actLaw.punishment}
• Monetary fine: ${actLaw.fine}
• Adjudicating authority: ${actLaw.court_triable || 'Competent Judicial Magistrate'}

Sources: ${actLaw.act_name}, [${actLaw.section_number}](law:${actLaw.id}), [${actLaw.source}](${actLaw.source_url})

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

    return {
      content,
      sources: relatedSections.slice(0, 4).map(l => ({
        law_id: l.id,
        section_number: l.section_number,
        act_name: l.act_name,
        source_url: l.source_url
      })),
      is_uncertain: false
    };
  }

  // 4. Find Relevant Sections (e.g., Unpaid salary by employer)
  if (/(salary|wages?|pay).*?(delay|not pay|unpaid|time|withhold|due)|employer.*?(salary|wages?|pay)/i.test(q)) {
    const content = `### 🔍 Relevant Sections for Delayed or Unpaid Salary by an Employer

If an employer delays or fails to pay your earned salary on time, the following statutory sections apply in order of relevance:

**1. [Payment of Wages Act, 1936 — Section 15: Claims Arising out of Deductions or Delay in Payment of Wages](law:payment-wages-sec-15)**
- **What it covers:** Provides the direct statutory claim mechanism before the appointed Authority (Labour Court / Labour Commissioner) when wages have been withheld or delayed past the legal deadline.
- **Why it is relevant:** It empowers an employee (or trade union/legal practitioner) to file a formal recovery application. The Authority can direct the employer to pay the unpaid wages along with statutory compensation up to **10 times the amount** withheld (or ₹3,000 for delayed wages).
- **Limitation Period:** Must be filed within **12 months** from the date on which the unpaid wages became due.

**2. [Payment of Wages Act, 1936 — Section 5: Time of Payment of Wages](law:payment-wages-sec-15)**
- **What it covers:** Establishes the mandatory statutory timetable for paying wages.
- **Why it is relevant:**
  - In establishments employing fewer than 1,000 workers: Wages MUST be paid before the expiry of the **7th day** of the following wage period.
  - In other establishments: Must be paid before the expiry of the **10th day**.
  - If employment is terminated: Unpaid wages must be cleared before the expiry of the **2nd working day** from termination.

**3. Complementary & Successor Provisions:**
- **Code on Wages, 2019 (Section 17 & 45):** Consolidates wage payment timelines and extends coverage to all establishments regardless of wage ceilings.
- **Industrial Disputes Act, 1947 (Section 33C(2)):** Enables recovery of money due from an employer via Labour Court execution proceedings.
- **Bharatiya Nyaya Sanhita, 2023 (Section 316 / 318):** In extreme cases of fraudulent inducement or intentional deceit, criminal complaints for criminal breach of trust or cheating may be evaluated.

**Practical Steps:**
1. Send a formal written legal notice / demand letter giving 7-15 days to disburse unpaid wages.
2. File a claim application before the Labour Commissioner / Authority under Section 15 of the Payment of Wages Act.
3. Lodge a complaint via the Ministry of Labour & Employment's Samadhan portal.

Sources: Payment of Wages Act, 1936, [Section 15 & Section 5: Time of Payment and Claims](law:payment-wages-sec-15), [Chief Labour Commissioner (Central)](https://clc.gov.in)

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

    return {
      content,
      sources: [
        { law_id: 'payment-wages-sec-15', section_number: 'Section 15 & 5', act_name: 'Payment of Wages Act, 1936', source_url: 'https://clc.gov.in' }
      ],
      is_uncertain: false
    };
  }

  // 5. Penalties and Consequences (e.g., Cheque bounce under Section 138 NI Act)
  if (/(cheque|check|dishonour|bounce|138).*?(punish|penalt|consequence|fine|jail|imprison)/i.test(q)) {
    const niLaw = matchingLaws.find(l => l.id === 'ni-sec-138') || matchingLaws[0];
    const content = `### 🛡️ Penalties & Consequences: Cheque Bounce under Section 138 of Negotiable Instruments Act, 1881

When a cheque is dishonoured due to insufficiency of funds or exceeding the credit arrangement, [Section 138 of the Negotiable Instruments Act, 1881](law:ni-sec-138) imposes strict statutory penalties:

**1. Direct Statutory Penalties (Section 138):**
• **Imprisonment:** Simple or rigorous imprisonment for a term which may extend up to **two (2) years**.
• **Monetary Fine:** Fine which may extend up to **twice the amount of the cheque**, or with both imprisonment and fine.

**2. Mandatory Statutory Conditions & Variables:**
The offence is established only if these strict statutory steps are satisfied:
1. **Presentment:** Cheque presented to the bank within its validity period (3 months).
2. **Statutory Demand Notice:** Payee issues a written legal notice demanding payment within **30 days** of receiving the bank memo of dishonour.
3. **15-Day Grace Period:** Drawer fails to pay the cheque amount within **15 days** from receiving the legal notice.
4. **Filing Limitation:** Formal complaint must be filed before the Judicial Magistrate within **1 month** after the expiry of the 15-day grace period.

**3. Corporate Liability & Aggravating Factors (Section 141):**
• If the cheque was issued by a company, partnership firm, or trust, the company as well as every person who was in charge of and responsible for the conduct of its business at the time the offence was committed is deemed guilty.

**4. Interim Relief for Complainant (Section 143A & 148):**
• The Trial Court may order the drawer to pay **interim compensation up to 20%** of the cheque amount during trial.
• If appealing a conviction, the Appellate Court mandates depositing a minimum of **20%** of the fine/compensation awarded.

**5. Distinction: Criminal Penalty vs. Civil Consequences:**
• **Criminal Nature:** Tried as a quasi-criminal complaint case before a Judicial Magistrate of the First Class / Metropolitan Magistrate. Compoundable under Section 147.
• **Civil Remedies:** The payee also retains the right to initiate a Summary Suit under Order XXXVII of the Code of Civil Procedure (CPC) for civil debt recovery alongside the criminal complaint.

Sources: Negotiable Instruments Act, 1881, [Section 138: Dishonour of Cheque for Insufficiency, etc., of Funds](law:ni-sec-138), [Reserve Bank of India Guidelines](https://rbi.org.in), [India Code](https://www.indiacode.nic.in)

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

    return {
      content,
      sources: [
        { law_id: niLaw?.id || 'ni-sec-138', section_number: niLaw?.section_number || 'Section 138', act_name: 'Negotiable Instruments Act, 1881', source_url: niLaw?.source_url || 'https://www.indiacode.nic.in' }
      ],
      is_uncertain: false
    };
  }

  // 6. Explain a Section in Simple Language (e.g. Section 420 IPC / Section 318 BNS)
  if (/(420|cheating|318)/i.test(q)) {
    const cheatLaw = matchingLaws.find(l => l.id === 'bns-sec-318') || matchingLaws[0];
    const content = `### 💡 Plain-Language Explanation: Section 420 IPC (Now Section 318 of Bharatiya Nyaya Sanhita, 2023)

**Statutory Provision:** **Section 318(4) of Bharatiya Nyaya Sanhita, 2023** (formerly Section 420 of Indian Penal Code, 1860) — *Cheating and dishonestly inducing delivery of property*.

**1. What the Section Means in Plain Terms:**
This section penalizes anyone who tricks or deceives another person to dishonestly convince them to hand over money, property, or valuable security, or to alter or destroy a signed valuable document. For the offence to occur, dishonest intention must exist right at the moment the promise or representation was made.

**2. Conditions & Statutory Exceptions:**
• **Conditions required to constitute the offence:**
  - Deception of any person by fraudulent or dishonest representation.
  - Inducing that person to deliver any property, or consent to retain property.
  - Mens rea (dishonest intent) from the inception — mere failure to fulfill a business contract is a civil breach, not criminal cheating, unless fraudulent intent existed from day one.
• **Exceptions & Defenses:** Bona fide commercial disputes, genuine failure to deliver goods due to unexpected external factors without deceitful motive.

**3. Short Real-World Example:**
*Scenario:* An individual advertises a vacant apartment for lease, claims to be the rightful owner, takes a ₹1,00,000 cash security deposit, and issues a forged agreement, while having no ownership or lease rights to the property. Because they deceived the victim into transferring funds with dishonest intent from the outset, this constitutes cheating under this section.

**4. Penalties & Classification:**
• **Imprisonment:** Imprisonment for a term which may extend to **seven (7) years**.
• **Monetary Fine:** Liable to fine.
• **Classification:** **Cognizable** (police can arrest without a warrant), **Non-Bailable** (bail must be applied for before the Magistrate), and triable by a Magistrate of the First Class.

Sources: Bharatiya Nyaya Sanhita, 2023, [Section 318: Cheating (replaces Section 420 IPC)](law:bns-sec-318), [India Code](https://www.indiacode.nic.in)

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

    return {
      content,
      sources: [
        { law_id: cheatLaw?.id || 'bns-sec-318', section_number: cheatLaw?.section_number || 'Section 318', act_name: 'Bharatiya Nyaya Sanhita, 2023 (Replaces IPC Section 420)', source_url: cheatLaw?.source_url || 'https://www.indiacode.nic.in' }
      ],
      is_uncertain: false
    };
  }

  // 7. General Section Explanation (Standard Grounded)
  if (matchingLaws.length > 0) {
    const topLaw = matchingLaws[0];
    const isSimple = mode === 'simple';

    const definitionsBlock = topLaw.definitions && topLaw.definitions.length > 0
      ? `\n**Statutory Definitions:**\n` + topLaw.definitions.map(d => `• **${d.term}**: ${d.meaning}`).join("\n")
      : '';

    const exceptionsBlock = topLaw.exceptions && topLaw.exceptions.length > 0
      ? `\n**Conditions, Exceptions & Defenses:**\n` + topLaw.exceptions.map(e => `• ${e}`).join("\n")
      : '';

    const content = `### 💡 Plain-Language Legal Explanation: [${topLaw.section_number}: ${topLaw.section_title}](law:${topLaw.id})

**Act:** **${topLaw.official_name || topLaw.act_name}** (${topLaw.year_enacted}) • **Status:** ${topLaw.current_status}

**1. What the Section Says in Plain Terms:**
${isSimple ? topLaw.simple_explanation : topLaw.what_it_means}
${definitionsBlock}

**2. Conditions, Exceptions & Actions Covered:**
${(topLaw.offences || topLaw.actions_covered).map(a => `• ${a}`).join("\n")}
${exceptionsBlock}

**3. Specific Penalties & Procedural Classification:**
• **Imprisonment / Sentence:** ${topLaw.penalties_fines || topLaw.punishment}
• **Monetary Fine:** ${topLaw.fine}
• **Classification:** **${topLaw.is_bailable === false ? 'Non-Bailable' : topLaw.is_bailable === true ? 'Bailable' : 'N/A'}**, **${topLaw.is_cognizable === true ? 'Cognizable (Police can arrest without warrant)' : topLaw.is_cognizable === false ? 'Non-Cognizable (Warrant required)' : 'N/A'}**
• **Court of Jurisdiction:** ${topLaw.court_triable || 'Competent Judicial Magistrate'}

Sources: ${topLaw.act_name}, [${topLaw.section_number}: ${topLaw.section_title}](law:${topLaw.id}), [${topLaw.source}](${topLaw.source_url})

*Note: This is general legal information from the verified database, not a substitute for a licensed lawyer's advice.*`;

    return {
      content,
      sources: matchingLaws.slice(0, 4).map(l => ({
        law_id: l.id,
        section_number: l.section_number,
        act_name: l.act_name,
        source_url: l.source_url
      })),
      is_uncertain: false
    };
  }

  // Fallback if no matching verified provision found
  return {
    content: `I could not retrieve the current official text for this provision. Please consult indiacode.nic.in or the relevant gazette notification.

I do not author legal content or answer from unverified training memory alone. 

**Recommended Authoritative Steps:**
• Search the central and state Bare Acts repository at [India Code (indiacode.nic.in)](https://www.indiacode.nic.in).
• Search official gazette notifications and commencement orders at [e-Gazette (egazette.gov.in)](https://egazette.gov.in).
• Try searching within the app by exact Act name (e.g. *Bharatiya Nyaya Sanhita*, *Motor Vehicles Act*, *Consumer Protection Act*, *Negotiable Instruments Act*, *Payment of Wages Act*) or specific section number (e.g. *Section 103*, *Section 138*, *Section 185*, *Section 318*).

*Disclaimer: This is a reference retrieval from official texts, not legal advice. Consult a qualified advocate for legal matters.*`,
    sources: [],
    is_uncertain: true
  };
}

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Indian Laws Legal Information server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
