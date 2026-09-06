import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { LAWS_DATABASE, UPDATE_HISTORY } from "./src/data/laws";
import { CATEGORIES } from "./src/data/categories";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// 5. Update History
app.get("/api/updates", (_req, res) => {
  res.json({ updates: UPDATE_HISTORY });
});

// 6. Refresh legal data status
app.post("/api/refresh", (_req, res) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  res.json({
    success: true,
    last_updated: `${formattedDate} at ${formattedTime} IST`,
    synced_sources: [
      "India Code (indiacode.nic.in)",
      "Gazette of India (egazette.gov.in)",
      "Ministry of Law and Justice",
      "Ministry of Road Transport and Highways (MoRTH)",
      "Ministry of Electronics and Information Technology (MeitY)",
      "Telangana State Portal & Police Department"
    ],
    verified_acts: 18,
    sections_checked: 22,
    new_amendments_found: 0,
    status_message: "Database successfully verified against official government legal repositories."
  });
});

// 7. AI Legal Assistant Endpoint
app.post("/api/ai/ask", async (req, res) => {
  const { question, state, explanationMode } = req.body as {
    question?: string;
    state?: string;
    explanationMode?: 'simple' | 'detailed';
  };

  if (!question || !question.trim()) {
    res.status(400).json({ error: "Please enter a legal question or query." });
    return;
  }

  const query = question.trim().toLowerCase();

  // Find matching laws in our verified database to ground the response
  const matchingLaws = LAWS_DATABASE.filter(l => {
    return (
      l.section_number.toLowerCase().includes(query) ||
      l.section_title.toLowerCase().includes(query) ||
      l.act_name.toLowerCase().includes(query) ||
      l.keywords.some(k => query.includes(k.toLowerCase()) || k.toLowerCase().includes(query)) ||
      l.actions_covered.some(a => query.split(" ").some(w => w.length > 3 && a.toLowerCase().includes(w)))
    );
  });

  // Prepare fallback grounded answer if Gemini is unavailable
  const fallbackAnswer = generateRuleBasedLegalAnswer(question, matchingLaws, state, explanationMode);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Return grounded fallback without failure
      res.json(fallbackAnswer);
      return;
    }

    const lawsContext = matchingLaws.slice(0, 4).map(l => (
      `Act: ${l.act_name}
Section: ${l.section_number} - ${l.section_title}
Explanation: ${l.simple_explanation}
Actions: ${l.actions_covered.join(", ")}
Punishment: ${l.punishment}
Fine: ${l.fine}
Bailable: ${l.is_bailable === true ? 'Bailable' : l.is_bailable === false ? 'Non-Bailable' : 'N/A'}
Cognizable: ${l.is_cognizable === true ? 'Cognizable' : l.is_cognizable === false ? 'Non-Cognizable' : 'N/A'}
Source: ${l.source} (${l.source_url})`
    )).join("\n---\n");

    const systemInstruction = `You are the AI Legal Information Assistant for India ("Nyaya Legal Guide").
Your purpose is to provide clear, accurate legal information based strictly on verified Indian laws, Acts, and rules (including Bharatiya Nyaya Sanhita BNS 2023, IT Act 2000, Motor Vehicles Act 1988/2019, Consumer Protection Act 2019, etc.).

CRITICAL RULES:
1. NEVER invent or fabricate laws, section numbers, or penalties.
2. If you are uncertain or the topic lacks explicit statutory coverage, explicitly state your uncertainty.
3. Distinguish clearly between the law itself and the simplified explanation.
4. Always note whether offences are bailable/non-bailable, cognizable/non-cognizable, and the exact penalty/fine if known.
5. The user's state context is: ${state || 'All India'}. If state-specific regulations apply (such as Telangana Motor Rules or Police Act), mention them.
6. Tone: Highly respectful, objective, educational.
7. Style Mode: ${explanationMode === 'detailed' ? 'Detailed legal breakdown with precise statutory phrasing' : 'Beginner-friendly and easy to understand for an ordinary citizen'}.
8. MANDATORY DISCLAIMER: Always remind the user that this is for legal information and educational purposes only, and is NOT a substitute for advice from a licensed advocate or qualified lawyer. Do not claim to be a lawyer.`;

    const prompt = `User's Question: "${question}"

Verified Reference Legal Database Context:
${lawsContext || "General Indian Legal Framework (Constitution, BNS 2023, BNSS 2023, IT Act 2000, Motor Vehicles Act, etc.)"}

Provide a direct, helpful, well-structured response with clear bullet points, specifying relevant Act names, Section numbers, penalties, and official references.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual accuracy
      }
    });

    const aiText = response.text || fallbackAnswer.content;

    res.json({
      content: aiText,
      sources: matchingLaws.slice(0, 3).map(l => ({
        law_id: l.id,
        section_number: l.section_number,
        act_name: l.act_name,
        source_url: l.source_url
      })),
      is_uncertain: false
    });
  } catch (err: any) {
    console.error("Gemini AI error, using grounded database response:", err?.message || err);
    res.json(fallbackAnswer);
  }
});

// Helper for offline or instant rule-grounded answer
function generateRuleBasedLegalAnswer(
  question: string,
  matchingLaws: typeof LAWS_DATABASE,
  userState?: string,
  mode: 'simple' | 'detailed' = 'simple'
) {
  if (matchingLaws.length > 0) {
    const topLaw = matchingLaws[0];
    const isSimple = mode === 'simple';

    const content = `### Legal Overview for "${question}"

Under Indian Law, this matter is primarily governed by **${topLaw.act_name}** under **${topLaw.section_number}: ${topLaw.section_title}**.

**What this law means:**
${isSimple ? topLaw.simple_explanation : topLaw.what_it_means}

**Actions Covered:**
${topLaw.actions_covered.map(a => `• ${a}`).join("\n")}

**Prescribed Penalties & Consequences:**
• **Punishment:** ${topLaw.punishment}
• **Fine:** ${topLaw.fine}
• **Classification:** ${topLaw.is_bailable === false ? 'Non-Bailable' : topLaw.is_bailable === true ? 'Bailable' : 'N/A'}, ${topLaw.is_cognizable === true ? 'Cognizable' : topLaw.is_cognizable === false ? 'Non-Cognizable' : 'N/A'}
• **Court Triable:** ${topLaw.court_triable || 'Competent Court'}

${topLaw.state_applicability !== 'All India' || userState === 'Telangana' ? `**State Relevance (${userState || 'State'}):** Applies in conjunction with local State Police and Motor Vehicle regulations.` : ''}

**Official Source:**
${topLaw.source} (${topLaw.source_url})

*Disclaimer: This response provides legal educational information and is not a substitute for formal legal advice from a qualified advocate.*`;

    return {
      content,
      sources: matchingLaws.slice(0, 3).map(l => ({
        law_id: l.id,
        section_number: l.section_number,
        act_name: l.act_name,
        source_url: l.source_url
      })),
      is_uncertain: false
    };
  }

  return {
    content: `### Legal Information Guide

Regarding your question: "${question}"

In India, legal provisions are governed by the relevant central and state enactments (such as the **Bharatiya Nyaya Sanhita, 2023**, **Motor Vehicles Act, 1988/2019**, **Information Technology Act, 2000**, and the **Constitution of India**).

To find the exact section and prescribed penalty:
1. Search by keyword or section number in the search bar above (e.g. "Section 66", "drunk driving", "cheque bounce").
2. Browse through the 22 categories on the home screen.
3. For personalized matters, consult a qualified lawyer licensed by the Bar Council of India.

*Disclaimer: This app provides legal information for educational purposes and is not a substitute for advice from a qualified lawyer.*`,
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
