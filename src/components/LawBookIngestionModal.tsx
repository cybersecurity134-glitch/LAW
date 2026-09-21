import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Scale, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Layers, 
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExtractedActDocument, ExtractedSection } from '../types';
import { MOTION_EASINGS } from '../utils/motion';
import { copyToClipboard } from '../utils/clipboard';

// Sample Bare Act Excerpts for 1-click testing
const PRESET_BARE_ACTS = [
  {
    name: 'BNS 2023: Sections 103–106 (Offences Affecting Life)',
    actTitle: 'Bharatiya Nyaya Sanhita, 2023',
    sectionRange: 'Sections 103-106',
    text: `BHARATIYA NYAYA SANHITA, 2023
Act No. 45 of 2023
[25th December, 2023]
An Act to consolidate and amend the provisions relating to offences and for matters connected therewith or incidental thereto.
Be it enacted by Parliament in the Seventy-fourth Year of the Republic of India as follows:—

CHAPTER VI
OF OFFENCES AFFECTING LIFE

Section 103. Punishment for murder.—
(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.
(2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.

Section 104. Culpable homicide not amounting to murder.—
Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act by which the death is caused is done with the intention of causing death, or of causing such bodily injury as is likely to cause death;
or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act is done with the knowledge that it is likely to cause death, but without any intention to cause death, or to cause such bodily injury as is likely to cause death.

Section 105. Punishment for culpable homicide not amounting to murder.—
Whoever commits culpable homicide not amounting to murder shall be punished as provided under section 104.

Section 106. Causing death by negligence.—
(1) Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine.
(2) Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide and escapes from the scene of incident or fails to report the incident to a police officer or Magistrate soon after the incident, shall be punished with imprisonment of either description of a term which may extend to ten years, and shall also be liable to fine.
Provided that where the act causing death is done by a registered medical practitioner while performing medical procedure, he shall be punished with imprisonment of either description for a term which may extend to two years, and shall also be liable to fine.
Explanation.—For the purposes of this sub-section, "registered medical practitioner" means a medical practitioner who possesses any medical qualification recognized under the National Medical Commission Act, 2019.`
  },
  {
    name: 'Consumer Protection Act 2019: Chapter IV (Dispute Redressal)',
    actTitle: 'The Consumer Protection Act, 2019',
    sectionRange: 'Sections 28-31',
    text: `THE CONSUMER PROTECTION ACT, 2019
Act No. 35 of 2019
[9th August, 2019]
An Act to provide for protection of the interests of consumers and for the said purpose, to establish authorities for timely and effective administration and settlement of consumers' disputes.

CHAPTER IV
CONSUMER DISPUTES REDRESSAL COMMISSION

Section 28. Establishment of District Consumer Disputes Redressal Commission.—
(1) The State Government shall, by notification, establish a District Consumer Disputes Redressal Commission, to be known as the District Commission, in each district of the State:
Provided that the State Government may, if it deems fit, establish more than one District Commission in a district.
(2) Each District Commission shall consist of—
(a) a President; and
(b) not less than two and not more than such number of members as may be prescribed, in consultation with the Central Government.

Section 29. Qualifications, etc., of President and members of District Commission.—
The Central Government may, by notification, make rules to provide for the qualifications, method of recruitment, procedure for appointment, term of office, resignation and removal of the President and members of the District Commission.

Section 30. Vacancy in the office of President.—
If at any time there is a vacancy in the office of the President of a District Commission, the State Government may direct the senior-most member thereof to act as the President until a new President is appointed.

Section 31. Jurisdiction of District Commission.—
Subject to the other provisions of this Act, the District Commission shall have jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed one crore rupees.`
  },
  {
    name: 'IT Act 2000: Sections 43 & 66 (Cyber Penalties)',
    actTitle: 'The Information Technology Act, 2000',
    sectionRange: 'Sections 43, 66',
    text: `THE INFORMATION TECHNOLOGY ACT, 2000
Act No. 21 of 2000
[9th June, 2000]
An Act to provide legal recognition for transactions carried out by means of electronic data interchange and other means of electronic communication.

Section 43. Penalty and compensation for damage to computer, computer system, etc.—
If any person without permission of the owner or any other person who is incharge of a computer, computer system or computer network,—
(a) accesses or secures access to such computer, computer system or computer network;
(b) downloads, copies or extracts any data, computer data base or information from such computer;
he shall be liable to pay damages by way of compensation to the person so affected.

Section 66. Computer related offences.—
If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.
Explanation.—For the purposes of this section,—
(a) the word "dishonestly" shall have the meaning assigned to it in section 24 of the Indian Penal Code;
(b) the word "fraudulently" shall have the meaning assigned to it in section 25 of the Indian Penal Code.`
  }
];

export const LawBookIngestionModal: React.FC = () => {
  const { showIngestionModal, setShowIngestionModal, syncLaws } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'extract' | 'results' | 'prompt'>('extract');

  // Input states
  const [rawText, setRawText] = useState<string>(PRESET_BARE_ACTS[0].text);
  const [actTitleHint, setActTitleHint] = useState<string>(PRESET_BARE_ACTS[0].actTitle);
  const [sectionRange, setSectionRange] = useState<string>(PRESET_BARE_ACTS[0].sectionRange);
  const [modelPreference, setModelPreference] = useState<'flash' | 'pro'>('flash');

  // Status & Output
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedDoc, setExtractedDoc] = useState<ExtractedActDocument | null>(null);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);
  const [engineUsed, setEngineUsed] = useState<string>('');

  // Commit status
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<string | null>(null);

  // UI helpers
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [filterSectionQuery, setFilterSectionQuery] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [viewJsonMode, setViewJsonMode] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showIngestionModal) {
        setShowIngestionModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIngestionModal, setShowIngestionModal]);

  if (!showIngestionModal) return null;

  // Handle preset selection
  const handleSelectPreset = (preset: typeof PRESET_BARE_ACTS[0]) => {
    setRawText(preset.text);
    setActTitleHint(preset.actTitle);
    setSectionRange(preset.sectionRange);
    setCommitSuccessMessage(null);
  };

  // Handle file drop / upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
        setActTitleHint(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  // Run extraction via backend endpoint
  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    setExtractionNotice(null);
    setCommitSuccessMessage(null);

    try {
      const res = await fetch('/api/ingest/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          actTitleHint,
          sectionRange,
          modelPreference
        })
      });

      const data = await res.json();
      if (data.success && data.document) {
        setExtractedDoc(data.document);
        setEngineUsed(data.extraction_engine || 'Legal Extraction Engine');
        setExtractionNotice(data.message || 'Extraction complete.');
        setActiveTab('results');
        // Expand first section by default
        if (data.document.chapters?.[0]?.sections?.[0]) {
          setExpandedSections({ [data.document.chapters[0].sections[0].section_number]: true });
        }
      } else {
        setExtractionNotice(data.error || 'Extraction failed. Please verify the input text.');
      }
    } catch (err: any) {
      setExtractionNotice('Extraction request failed: ' + (err?.message || err));
    } finally {
      setIsExtracting(false);
    }
  };

  // Commit to Live Legal Database
  const handleCommitToDatabase = async () => {
    if (!extractedDoc) return;
    setIsCommitting(true);
    setCommitSuccessMessage(null);

    try {
      const res = await fetch('/api/ingest/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: extractedDoc
        })
      });

      const data = await res.json();
      if (data.success) {
        setCommitSuccessMessage(data.message);
        await syncLaws();
      } else {
        setCommitSuccessMessage('Failed to commit: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setCommitSuccessMessage('Commit error: ' + (err?.message || err));
    } finally {
      setIsCommitting(false);
    }
  };

  // Copy extracted JSON
  const handleCopyJson = async () => {
    if (!extractedDoc) return;
    const success = await copyToClipboard(JSON.stringify(extractedDoc, null, 2));
    if (success) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  // Download JSON file
  const handleDownloadJson = () => {
    if (!extractedDoc) return;
    const blob = new Blob([JSON.stringify(extractedDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(extractedDoc.act_title || 'bare-act').toLowerCase().replace(/\s+/g, '-')}-extracted.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy Ingestion System Prompt for AI Studio
  const handleCopyPrompt = async () => {
    try {
      const res = await fetch('/api/ingest/prompt');
      const data = await res.json();
      if (data.system_prompt) {
        const success = await copyToClipboard(data.system_prompt);
        if (success) {
          setCopiedPrompt(true);
          setTimeout(() => setCopiedPrompt(false), 2000);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch system prompt for clipboard:", e);
    }
  };

  const toggleSectionExpand = (secNum: string) => {
    setExpandedSections(prev => ({ ...prev, [secNum]: !prev[secNum] }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md overflow-hidden"
      id="law-book-ingestion-modal-backdrop"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: MOTION_EASINGS.appleDecel }}
        className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#0c0c0e] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden"
        id="law-book-ingestion-dialog"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#a78bfa] flex items-center justify-center shrink-0 border border-orange-500/20 dark:border-[#7C5CFF]/30">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  Law Book Data Ingestion Engine
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Verbatim Fidelity
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Extract raw Bare Act text into database-ready structured legal records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyPrompt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title="Copy Google AI Studio System Prompt"
              id="copy-system-prompt-header-btn"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedPrompt ? 'Prompt Copied' : 'AI Studio Prompt'}</span>
            </button>

            <button
              onClick={() => setShowIngestionModal(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close"
              id="close-ingestion-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('extract')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'extract'
                  ? 'bg-white dark:bg-white/15 text-orange-600 dark:text-white shadow-sm border border-slate-200/70 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id="tab-ingest-extract"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Ingest & Extract</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-white dark:bg-white/15 text-orange-600 dark:text-white shadow-sm border border-slate-200/70 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id="tab-database-results"
            >
              <Database className="w-3.5 h-3.5" />
              <span>2. Database Schema & Inspection</span>
              {extractedDoc && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'prompt'
                  ? 'bg-white dark:bg-white/15 text-orange-600 dark:text-white shadow-sm border border-slate-200/70 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id="tab-system-prompt"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. AI Studio Prompt</span>
            </button>
          </div>

          {activeTab === 'results' && extractedDoc && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewJsonMode(prev => !prev)}
                className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                id="toggle-json-view-btn"
              >
                {viewJsonMode ? 'Tree View' : 'Raw JSON'}
              </button>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                id="copy-json-btn"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedJson ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white cursor-pointer"
                id="download-json-btn"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: INGEST & EXTRACT */}
          {activeTab === 'extract' && (
            <div className="space-y-6">
              {/* Presets Row */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1-Click Sample Bare Acts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRESET_BARE_ACTS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        actTitleHint === preset.actTitle
                          ? 'border-orange-500 dark:border-[#7C5CFF] bg-orange-500/5 dark:bg-[#7C5CFF]/10 text-orange-950 dark:text-white font-semibold'
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                      id={`preset-btn-${idx}`}
                    >
                      <div className="font-bold line-clamp-1 mb-1">{preset.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {preset.sectionRange}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata Hints and Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Act Title / Citation (Hint)
                  </label>
                  <input
                    type="text"
                    value={actTitleHint}
                    onChange={(e) => setActTitleHint(e.target.value)}
                    placeholder="e.g. Bharatiya Nyaya Sanhita, 2023"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    id="act-title-hint-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Section Range / Chapter
                  </label>
                  <input
                    type="text"
                    value={sectionRange}
                    onChange={(e) => setSectionRange(e.target.value)}
                    placeholder="e.g. Sections 103-106 or Chapter VI"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    id="section-range-hint-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Extraction Model Engine
                  </label>
                  <select
                    value={modelPreference}
                    onChange={(e) => setModelPreference(e.target.value as 'flash' | 'pro')}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    id="extraction-model-select"
                  >
                    <option value="flash">Gemini 2.5 Flash (Fast Verbatim Extraction)</option>
                    <option value="pro">Gemini 3.8 Flash (High-Fidelity Complex Schedules)</option>
                  </select>
                </div>
              </div>

              {/* Raw Text Input & Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Raw Bare Act / Law Book Text
                  </label>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{rawText.length.toLocaleString()} characters</span>
                    <span>•</span>
                    <span>{rawText.split(/\s+/).filter(Boolean).length} words</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-orange-600 dark:text-[#a78bfa] hover:underline font-medium cursor-pointer"
                    >
                      Upload File (.txt, .json)
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".txt,.json,.md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </div>
                </div>

                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className={`relative rounded-xl border transition-all ${
                    dragActive
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/5'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={12}
                    placeholder="Paste raw Bare Act text, Gazette notifications, amendments, or chapter sections here verbatim..."
                    className="w-full p-4 text-xs font-mono text-slate-800 dark:text-slate-200 bg-transparent border-0 focus:outline-none resize-y leading-relaxed"
                    id="raw-bare-act-textarea"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Notice:</span> Long Acts should be ingested in chunks of 25–50 sections to ensure zero truncation.
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setRawText('')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    id="clear-raw-text-btn"
                  >
                    Clear
                  </button>

                  <button
                    onClick={handleExtract}
                    disabled={isExtracting || !rawText.trim()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#6340e6] text-white shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    id="start-extraction-btn"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting Verbatim Schema...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Extract Structured Law Book</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {extractionNotice && (
                <div className="p-3.5 rounded-xl text-xs bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{extractionNotice}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DATABASE SCHEMA & INSPECTION */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {!extractedDoc ? (
                <div className="text-center py-16 space-y-3">
                  <Database className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No Ingested Law Book Loaded Yet
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Return to Step 1, select a sample Bare Act, and run extraction to inspect structured records.
                  </p>
                  <button
                    onClick={() => setActiveTab('extract')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-orange-500 text-white cursor-pointer"
                  >
                    Go to Step 1: Ingest & Extract
                  </button>
                </div>
              ) : viewJsonMode ? (
                /* Raw JSON View */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Structured Database JSON Representation</span>
                    <span className="font-mono">{engineUsed}</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800">
                    {JSON.stringify(extractedDoc, null, 2)}
                  </pre>
                </div>
              ) : (
                /* Structured Legal Inspection View */
                <div className="space-y-6">
                  {/* Completeness Self-Check Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                          Completeness & Fidelity Verification
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {engineUsed}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Section Sequence</div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3" />
                          <span>{extractedDoc.completeness_check?.continuous_sections ? 'Continuous' : 'Continuous with Gaps'}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Sections</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                          {extractedDoc.completeness_check?.total_sections || 0} extracted
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Definitions Logged</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                          {extractedDoc.completeness_check?.total_definitions || 0} terms
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Penalty Provisions</div>
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                          {extractedDoc.completeness_check?.penalty_provisions_count || 0} flagged
                        </div>
                      </div>
                    </div>

                    {extractedDoc.completeness_check?.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                        {extractedDoc.completeness_check.notes}
                      </p>
                    )}
                  </div>

                  {/* Act Metadata Overview */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.01] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {extractedDoc.act_title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {extractedDoc.act_number && <span>{extractedDoc.act_number}</span>}
                          {extractedDoc.year && <span>• Year: {extractedDoc.year}</span>}
                          {extractedDoc.jurisdiction && <span>• Jurisdiction: {extractedDoc.jurisdiction}</span>}
                          {extractedDoc.enforcement_date && <span>• Enforced: {extractedDoc.enforcement_date}</span>}
                        </div>
                      </div>

                      {/* Commit to Database CTA */}
                      <button
                        onClick={handleCommitToDatabase}
                        disabled={isCommitting}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 cursor-pointer"
                        id="commit-to-db-btn"
                        title="Persist this Act into the app's searchable laws index"
                      >
                        {isCommitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Adding to Live Database...</span>
                          </>
                        ) : (
                          <>
                            <Database className="w-3.5 h-3.5" />
                            <span>Commit to Live Database</span>
                          </>
                        )}
                      </button>
                    </div>

                    {commitSuccessMessage && (
                      <div className="p-3 rounded-lg text-xs bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{commitSuccessMessage}</span>
                      </div>
                    )}

                    {extractedDoc.preamble && (
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                          Verbatim Preamble / Long Title
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-200/60 dark:border-white/5">
                          "{extractedDoc.preamble}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Definitions List (if present) */}
                  {Array.isArray(extractedDoc.definitions) && extractedDoc.definitions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Statutory Definitions ({extractedDoc.definitions.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {extractedDoc.definitions.map((def, dIdx) => (
                          <div
                            key={dIdx}
                            className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-orange-600 dark:text-[#a78bfa]">
                                "{def.term}"
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono">
                                {def.section_ref}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                              {def.definition}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chapters & Sections Explorer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Extracted Chapters & Operative Sections
                      </div>
                      <div className="relative w-48 sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={filterSectionQuery}
                          onChange={(e) => setFilterSectionQuery(e.target.value)}
                          placeholder="Filter sections..."
                          className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {extractedDoc.chapters?.map((chapter, cIdx) => {
                      const filteredSections = (chapter.sections || []).filter(sec => {
                        if (!filterSectionQuery.trim()) return true;
                        const q = filterSectionQuery.toLowerCase();
                        return (
                          sec.section_number.toLowerCase().includes(q) ||
                          sec.heading.toLowerCase().includes(q) ||
                          sec.text.toLowerCase().includes(q)
                        );
                      });

                      if (filteredSections.length === 0 && filterSectionQuery.trim()) return null;

                      return (
                        <div 
                          key={cIdx} 
                          className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-white/[0.01]"
                        >
                          <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {chapter.chapter_number} — {chapter.heading}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {filteredSections.length} sections
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredSections.map((sec, sIdx) => {
                              const isExpanded = !!expandedSections[sec.section_number];

                              return (
                                <div key={sIdx} className="p-4 space-y-3">
                                  {/* Section Header */}
                                  <div 
                                    onClick={() => toggleSectionExpand(sec.section_number)}
                                    className="flex items-start justify-between gap-3 cursor-pointer select-none group"
                                  >
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-orange-600 dark:text-[#a78bfa]">
                                          {sec.section_number}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-white transition-colors">
                                          {sec.heading}
                                        </span>
                                        {sec.penalty?.applicable && (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                            Penalty
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <button 
                                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                      aria-label="Toggle section expand"
                                    >
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                  </div>

                                  {/* Section Content */}
                                  {isExpanded && (
                                    <div className="space-y-3 pt-2 text-xs">
                                      {/* Verbatim Operative Text */}
                                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 font-serif text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                                        {sec.text}
                                      </div>

                                      {/* Sub-sections */}
                                      {Array.isArray(sec.sub_sections) && sec.sub_sections.length > 0 && (
                                        <div className="space-y-1 pl-3 border-l-2 border-orange-500/30 dark:border-[#7C5CFF]/30">
                                          <div className="text-[10px] uppercase font-bold text-slate-400">
                                            Sub-sections ({sec.sub_sections.length})
                                          </div>
                                          {sec.sub_sections.map((sub, subIdx) => (
                                            <div key={subIdx} className="text-xs text-slate-700 dark:text-slate-300">
                                              <span className="font-bold mr-1">{sub.number}</span>
                                              <span>{sub.text}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Provisos */}
                                      {Array.isArray(sec.provisos) && sec.provisos.length > 0 && (
                                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 space-y-1">
                                          <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            <span>Statutory Proviso Clause</span>
                                          </div>
                                          {sec.provisos.map((prov, pIdx) => (
                                            <p key={pIdx} className="text-xs text-amber-900 dark:text-amber-200">
                                              {prov}
                                            </p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Explanations */}
                                      {Array.isArray(sec.explanations) && sec.explanations.length > 0 && (
                                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/5 space-y-1">
                                          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                                            Statutory Explanations
                                          </div>
                                          {sec.explanations.map((exp, eIdx) => (
                                            <p key={eIdx} className="text-xs text-slate-700 dark:text-slate-300 italic">
                                              {exp}
                                            </p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Illustrations */}
                                      {Array.isArray(sec.illustrations) && sec.illustrations.length > 0 && (
                                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                                          <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                            Statutory Illustrations
                                          </div>
                                          {sec.illustrations.map((ill, iIdx) => (
                                            <p key={iIdx} className="text-xs text-emerald-950 dark:text-emerald-200">
                                              {ill}
                                            </p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Penalty Details */}
                                      {sec.penalty?.applicable && sec.penalty.details && (
                                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-1">
                                          <div className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400">
                                            Statutory Penalties & Consequences
                                          </div>
                                          <p className="text-xs text-rose-900 dark:text-rose-200 font-semibold">
                                            {sec.penalty.details}
                                          </p>
                                        </div>
                                      )}

                                      {/* Amendment Notes */}
                                      {Array.isArray(sec.amendment_notes) && sec.amendment_notes.length > 0 && (
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                                          <div className="font-semibold text-[10px] uppercase text-slate-400">
                                            Legislative Footnotes / History
                                          </div>
                                          {sec.amendment_notes.map((note, nIdx) => (
                                            <div key={nIdx}>• {note}</div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE AI STUDIO INGESTION PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-orange-500/10 dark:bg-[#7C5CFF]/10 border border-orange-500/20 dark:border-[#7C5CFF]/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600 dark:text-[#a78bfa]" />
                  <span className="text-xs font-bold text-orange-900 dark:text-white">
                    Google AI Studio Law Book Ingestion Workflow
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Use this prompt in Google AI Studio to convert raw Bare Act text or codified law books into structured, database-ready JSON. Run this step <strong>before</strong> the Q&A assistant queries the database — this ingestion engine builds the database, while the assistant prompt reads from it.
                </p>
              </div>

              {/* Ingestion Rules & Protocol */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    System / Main Prompt for AI Studio
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                    id="copy-system-prompt-tab-btn"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied Prompt' : 'Copy System Prompt'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800 space-y-4">
                  <div>
                    <div className="text-amber-400 font-bold mb-1">## SYSTEM PROMPT</div>
                    <p className="text-slate-300">
                      You are a legal data extraction engine. Your task is to convert raw law book or Bare Act text supplied to you into complete, structured, database-ready output. Your priority is completeness and fidelity to the source — not summarization, not simplification, not selective inclusion.
                    </p>
                  </div>

                  <div>
                    <div className="text-amber-400 font-bold mb-1">### Core Rule</div>
                    <p className="text-slate-300">
                      Extract everything. If the source text contains it, your output must contain it. The operative legal text — section text, provisos, explanations, illustrations, schedules — must be reproduced verbatim: exact wording, punctuation, and numbering. Do not condense, paraphrase, or skip any part of it.
                    </p>
                  </div>

                  <div>
                    <div className="text-amber-400 font-bold mb-1">### What to Extract from Each Document</div>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      <li><strong>1. Act Metadata:</strong> Full title, Act number/year, date of assent, date of enforcement, jurisdiction, preamble.</li>
                      <li><strong>2. Definitions:</strong> Every defined term with its exact definition text and the section it appears in.</li>
                      <li><strong>3. Chapters/Parts:</strong> Chapter/Part number and heading, in original order.</li>
                      <li><strong>4. Sections:</strong> Section number and heading, full verbatim text, all sub-sections, provisos ("Provided that..."), explanations, illustrations, and amendment notes.</li>
                      <li><strong>5. Schedules & Annexures:</strong> Full content of every schedule, table, or form referenced.</li>
                      <li><strong>6. Amendment History:</strong> What changed, by which amending Act, and effective date.</li>
                      <li><strong>7. Penalty Provisions:</strong> Flag every section containing a penalty, fine, or punishment.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="text-amber-400 font-bold mb-1">### Handling Large Documents</div>
                    <p className="text-slate-300">
                      Feed large codified books in chapters or fixed section ranges (e.g. Sections 1–50, then 51–100) rather than an entire book at once. Never silently truncate; stop at a clean section boundary.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
