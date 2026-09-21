import React, { memo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Bookmark, 
  BookmarkCheck, 
  X, 
  MapPin, 
  Shield, 
  Scale, 
  FileText, 
  ChevronUp, 
  ChevronDown, 
  AlertTriangle, 
  Clock, 
  Coins, 
  BookOpen, 
  ExternalLink, 
  Calendar,
  Layers,
  HelpCircle,
  History,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { LawItem, LawRelatedSection, StatutoryDefinition } from '../../types';

// ==========================================
// 1. Memoized Modal Header Bar
// ==========================================
interface LawDetailHeaderProps {
  categoryName?: string;
  isSaved: boolean;
  copied: boolean;
  onBack: () => void;
  onAskAI: () => void;
  onShare: () => void;
  onToggleBookmark: () => void;
  onClose: () => void;
}

export const LawDetailHeader = memo<LawDetailHeaderProps>(({
  categoryName = 'Indian Law',
  isSaved,
  copied,
  onBack,
  onAskAI,
  onShare,
  onToggleBookmark,
  onClose
}) => {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 sm:px-6 py-3.5 liquid-header dark:bg-[#0B0B0B]/95 dark:border-b dark:border-[#222222]">
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-xl liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929] text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
        <span className="text-xs text-slate-400 dark:text-[#292929] hidden sm:inline">|</span>
        <span className="text-xs font-semibold text-slate-500 dark:text-[#777777] hidden sm:inline truncate max-w-xs">
          {categoryName}
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Ask AI about this law */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAskAI}
          className="flex items-center gap-1.5 min-h-[44px] px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] text-white text-xs font-bold shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 ring-1 ring-white/20 transition-all cursor-pointer"
          title="Ask AI questions about this section"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </motion.button>

        {/* Share / Copy */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onShare}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929] transition-colors cursor-pointer"
          title="Copy citation & summary"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
        </motion.button>

        {/* Bookmark */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleBookmark}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
            isSaved 
              ? 'bg-orange-500/20 dark:bg-[#7C5CFF]/20 text-orange-600 dark:text-[#7C5CFF] border-orange-500/30 dark:border-[#7C5CFF]/40 shadow-xs' 
              : 'liquid-pill text-slate-600 dark:text-[#777777] dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929]'
          }`}
          title={isSaved ? 'Remove Bookmark' : 'Save Law'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 fill-orange-500 dark:fill-[#7C5CFF] text-orange-600 dark:text-[#7C5CFF]" /> : <Bookmark className="w-4 h-4" />}
        </motion.button>

        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl liquid-pill text-slate-500 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929] transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
});

LawDetailHeader.displayName = 'LawDetailHeader';

// ==========================================
// 2. Memoized Title & Metadata Banner
// ==========================================
interface LawDetailTitleBannerProps {
  law: LawItem;
  categoryName?: string;
}

export const LawDetailTitleBanner = memo<LawDetailTitleBannerProps>(({ law, categoryName }) => {
  return (
    <div className="space-y-3.5">
      {/* Official Verification & Sourcing Header Strip */}
      <div className="p-3 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-[#60A5FA] shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white">
            Official Source Verified
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            • {law.primary_source_name || 'India Code'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-600 dark:text-slate-400">
            Retrieved: <strong className="text-slate-900 dark:text-white">{law.last_verified_date || law.last_updated}</strong>
          </span>
          {law.source_url && (
            <a
              href={law.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-[#60A5FA] hover:underline"
            >
              <span>View Bare Act</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/30 text-xs font-bold font-mono">
          {law.sections || law.section_number}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3] text-xs font-semibold">
          {categoryName || 'Law'}
        </span>
        {law.act_number_year && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-slate-800 dark:text-white text-xs font-mono font-medium">
            {law.act_number_year}
          </span>
        )}
        {law.status && (
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
            law.status === 'In Force'
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-[#22C55E] border-emerald-500/25 dark:border-[#22C55E]/30'
              : law.status === 'Superseded' || law.status === 'Repealed'
              ? 'bg-amber-500/15 text-amber-700 dark:text-[#F59E0B] border-amber-500/25 dark:border-[#F59E0B]/30'
              : 'bg-slate-500/15 text-slate-700 dark:text-[#B3B3B3] border-slate-500/25'
          }`}>
            {law.status}
          </span>
        )}
        {law.year_enacted && (
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 dark:bg-[#3B82F6]/15 text-indigo-700 dark:text-[#3B82F6] border border-indigo-500/20 dark:border-[#3B82F6]/30 text-xs font-semibold">
            Enacted {law.year_enacted}
          </span>
        )}
        {law.state_applicability !== 'All India' && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 dark:bg-[#EF4444]/15 text-rose-700 dark:text-[#EF4444] border border-rose-500/20 dark:border-[#EF4444]/30 text-xs font-semibold">
            <MapPin className="w-3 h-3" />
            {law.state_applicability}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] tracking-tight font-display">
        {law.section_title}
      </h1>

      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-orange-600 dark:text-[#7C5CFF] flex flex-wrap items-center gap-2">
          <span>{law.official_name || law.act_name}</span>
          {law.enacting_body && (
            <span className="text-xs font-normal text-slate-500 dark:text-[#888888]">
              • Enacted by {law.enacting_body}
            </span>
          )}
        </div>
        {law.short_description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A0A0A0] leading-relaxed">
            {law.short_description}
          </p>
        )}
      </div>

      {/* Statutory Status & Assent Strip */}
      {(law.date_of_assent || law.date_of_commencement || law.status_citation) && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#262626] space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {law.date_of_assent && (
              <div>
                Presidential Assent: <strong className="text-slate-900 dark:text-white">{law.date_of_assent}</strong>
              </div>
            )}
            {law.date_of_commencement && (
              <div>
                Commencement: <strong className="text-slate-900 dark:text-white">{law.date_of_commencement}</strong>
              </div>
            )}
          </div>
          {law.status_citation && (
            <div className="text-[11px] text-slate-500 dark:text-[#888888] pt-0.5">
              Citation: {law.status_citation}
            </div>
          )}
        </div>
      )}

      {/* Classification Quick Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {law.is_bailable !== null && (
          <div className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
            law.is_bailable 
              ? 'bg-amber-500/15 dark:bg-[#22C55E]/15 text-amber-700 dark:text-[#22C55E] border-amber-500/30 dark:border-[#22C55E]/30' 
              : 'bg-rose-500/15 dark:bg-[#EF4444]/15 text-rose-700 dark:text-[#EF4444] border-rose-500/30 dark:border-[#EF4444]/30'
          }`}>
            <Shield className="w-3.5 h-3.5" />
            {law.is_bailable ? 'Bailable Offence' : 'Non-Bailable Offence'}
          </div>
        )}

        {law.is_cognizable !== null && (
          <div className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
            law.is_cognizable 
              ? 'bg-indigo-500/15 dark:bg-[#3B82F6]/15 text-indigo-700 dark:text-[#3B82F6] border-indigo-500/30 dark:border-[#3B82F6]/30' 
              : 'bg-slate-500/15 dark:bg-[#181818] text-slate-700 dark:text-[#B3B3B3] border-slate-500/30 dark:border-[#292929]'
          }`}>
            <Scale className="w-3.5 h-3.5" />
            {law.is_cognizable ? 'Cognizable (Arrest without warrant)' : 'Non-Cognizable'}
          </div>
        )}

        {law.court_triable && (
          <div className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-[#151515] text-slate-700 dark:text-[#B3B3B3] border border-slate-200 dark:border-[#292929]">
            Triable: <span className="font-semibold text-slate-900 dark:text-[#FFFFFF]">{law.court_triable}</span>
          </div>
        )}
      </div>
    </div>
  );
});

LawDetailTitleBanner.displayName = 'LawDetailTitleBanner';

// ==========================================
// 2.5 Memoized AI Quick Actions Bar
// ==========================================
export interface LawDetailAIQuickActionsProps {
  law: LawItem;
  onAskAIWithPrompt?: (prompt: string) => void;
}

export const LawDetailAIQuickActions = memo<LawDetailAIQuickActionsProps>(({ law, onAskAIWithPrompt }) => {
  if (!onAskAIWithPrompt) return null;

  const sectionName = `${law.act_name} ${law.sections || law.section_number}`;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 dark:from-[#7C5CFF]/15 dark:via-[#7C5CFF]/5 dark:to-blue-500/10 border border-orange-500/20 dark:border-[#7C5CFF]/30 space-y-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500 dark:bg-[#7C5CFF] text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Ask Nyaya AI About This Section
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-[#888888]">
              Verified AI analysis grounded in statutory provisions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onAskAIWithPrompt(`Explain ${sectionName} (${law.section_title}) in simple citizen language with practical real-life examples.`)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-orange-500/20 dark:border-[#292929] hover:border-orange-500/60 dark:hover:border-[#7C5CFF]/60 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-[#a78bfa] mb-0.5">
            <span>💡</span>
            <span>Explain</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-[#888888] line-clamp-1 group-hover:text-slate-900 dark:group-hover:text-white">
            In simple words
          </p>
        </button>

        <button
          type="button"
          onClick={() => onAskAIWithPrompt(`Explain all direct penalties, imprisonment duration, fine amounts, bailable status, and collateral consequences for ${sectionName}.`)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-rose-500/20 dark:border-[#292929] hover:border-rose-500/60 dark:hover:border-[#EF4444]/60 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-[#EF4444] mb-0.5">
            <span>🛡️</span>
            <span>Penalties</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-[#888888] line-clamp-1 group-hover:text-slate-900 dark:group-hover:text-white">
            Fines & impacts
          </p>
        </button>

        <button
          type="button"
          onClick={() => onAskAIWithPrompt(`Compare ${sectionName} with its predecessor law (e.g. IPC, CrPC, or previous amendments) with section mappings and major changes.`)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-purple-500/20 dark:border-[#292929] hover:border-purple-500/60 dark:hover:border-[#7C5CFF]/60 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-[#c084fc] mb-0.5">
            <span>⚖️</span>
            <span>Compare</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-[#888888] line-clamp-1 group-hover:text-slate-900 dark:group-hover:text-white">
            Predecessor diff
          </p>
        </button>

        <button
          type="button"
          onClick={() => onAskAIWithPrompt(`Summarize the entire ${law.official_name || law.act_name}: key chapters, historical objectives, and core statutory provisions.`)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-blue-500/20 dark:border-[#292929] hover:border-blue-500/60 dark:hover:border-[#3B82F6]/60 text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-[#60a5fa] mb-0.5">
            <span>📜</span>
            <span>Summarize</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-[#888888] line-clamp-1 group-hover:text-slate-900 dark:group-hover:text-white">
            Entire Act
          </p>
        </button>
      </div>
    </div>
  );
});

LawDetailAIQuickActions.displayName = 'LawDetailAIQuickActions';

// ==========================================
// 3. Memoized Meaning / Explanation Section
// ==========================================
interface LawDetailExplanationSectionProps {
  isExpanded: boolean;
  simpleExplanation: string;
  whatItMeans: string;
  onToggle: () => void;
}

export const LawDetailExplanationSection = memo<LawDetailExplanationSectionProps>(({
  isExpanded,
  simpleExplanation,
  whatItMeans,
  onToggle
}) => {
  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-500 dark:text-[#7C5CFF]">
            <FileText className="w-4 h-4" />
          </div>
          <span>What does this law mean?</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {/* Statutory Separation Warning Badge */}
          <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wide">
                Unofficial Plain-Language Explanation (Not Authoritative Statutory Text)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                Crafted for citizen understanding and reference. For legal pleadings, judicial citations, and formal proceedings, always rely exclusively on the verbatim Bare Act statutory text below.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-sm text-slate-800 dark:text-[#FFFFFF] leading-relaxed font-normal shadow-xs">
            <div className="text-xs uppercase font-bold text-orange-600 dark:text-[#7C5CFF] tracking-wider mb-1">
              Simplified Plain Language
            </div>
            {simpleExplanation}
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-700 dark:text-[#B3B3B3] leading-relaxed">
            <div className="text-xs uppercase font-bold text-slate-500 dark:text-[#777777] tracking-wider mb-1">
              In-Depth Legal Scope
            </div>
            {whatItMeans}
          </div>
        </div>
      )}
    </div>
  );
});

LawDetailExplanationSection.displayName = 'LawDetailExplanationSection';

// ==========================================
// 4. Memoized Causes & Actions Section
// ==========================================
interface LawDetailActionsSectionProps {
  isExpanded: boolean;
  actionsCovered: string[];
  onToggle: () => void;
}

export const LawDetailActionsSection = memo<LawDetailActionsSectionProps>(({
  isExpanded,
  actionsCovered,
  onToggle
}) => {
  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full min-h-[48px] flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-[#EF4444]/15 text-rose-500 dark:text-[#EF4444]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span>Causes & When This Law Applies</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          <div className="grid gap-2">
            {actionsCovered.map((action, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs sm:text-sm text-slate-800 dark:text-[#FFFFFF]"
              >
                <span className="w-5 h-5 rounded-full bg-rose-500/15 dark:bg-[#EF4444]/15 text-rose-700 dark:text-[#EF4444] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

LawDetailActionsSection.displayName = 'LawDetailActionsSection';

// ==========================================
// 5. Memoized Penalties, Fine & Consequences
// ==========================================
interface LawDetailPenaltiesSectionProps {
  isExpanded: boolean;
  punishment: string;
  imprisonment?: string;
  fine?: string;
  otherConsequences?: string;
  onToggle: () => void;
}

export const LawDetailPenaltiesSection = memo<LawDetailPenaltiesSectionProps>(({
  isExpanded,
  punishment,
  imprisonment,
  fine,
  otherConsequences,
  onToggle
}) => {
  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-[#3B82F6]/15 text-indigo-500 dark:text-[#3B82F6]">
            <Clock className="w-4 h-4" />
          </div>
          <span>Punishment, Fine & Consequences</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Punishment */}
            <div className="p-4 rounded-xl bg-rose-500/10 dark:bg-[#EF4444]/10 border border-rose-500/20 dark:border-[#EF4444]/25 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-[#EF4444]">
                <Clock className="w-3.5 h-3.5" />
                Imprisonment & Penalty
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-[#FFFFFF]">
                {punishment}
              </div>
              {imprisonment && (
                <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
                  Term: {imprisonment}
                </p>
              )}
            </div>

            {/* Fine Amount */}
            <div className="p-4 rounded-xl bg-orange-500/10 dark:bg-[#F59E0B]/10 border border-orange-500/20 dark:border-[#F59E0B]/25 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#F59E0B]">
                <Coins className="w-3.5 h-3.5" />
                Fine Amount
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-[#FFFFFF]">
                {fine || 'Discretion of the Court'}
              </div>
            </div>
          </div>

          {/* Other consequences */}
          {otherConsequences && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs sm:text-sm text-slate-700 dark:text-[#B3B3B3]">
              <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">Additional Legal Consequences: </span>
              {otherConsequences}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

LawDetailPenaltiesSection.displayName = 'LawDetailPenaltiesSection';

// ==========================================
// 6. Memoized Exceptions & Defenses
// ==========================================
interface LawDetailExceptionsSectionProps {
  isExpanded: boolean;
  exceptions: string[];
  onToggle: () => void;
}

export const LawDetailExceptionsSection = memo<LawDetailExceptionsSectionProps>(({
  isExpanded,
  exceptions,
  onToggle
}) => {
  if (!exceptions || exceptions.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-[#22C55E]/15 text-emerald-500 dark:text-[#22C55E]">
            <Shield className="w-4 h-4" />
          </div>
          <span>Important Exceptions & Defenses</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {exceptions.map((exc, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 dark:bg-[#22C55E]/10 border border-emerald-500/20 dark:border-[#22C55E]/25 text-xs sm:text-sm text-slate-700 dark:text-[#FFFFFF]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#22C55E] shrink-0 mt-0.5" />
              <span>{exc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailExceptionsSection.displayName = 'LawDetailExceptionsSection';

// ==========================================
// 6B. Memoized Statutory Definitions
// ==========================================
interface LawDetailDefinitionsSectionProps {
  isExpanded: boolean;
  definitions?: StatutoryDefinition[];
  onToggle: () => void;
}

export const LawDetailDefinitionsSection = memo<LawDetailDefinitionsSectionProps>(({
  isExpanded,
  definitions,
  onToggle
}) => {
  if (!definitions || definitions.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 dark:bg-[#06B6D4]/15 text-cyan-600 dark:text-[#06B6D4]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span>Key Statutory Definitions</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2.5 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {definitions.map((def, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] space-y-1">
              <div className="text-xs font-bold font-mono text-cyan-700 dark:text-[#06B6D4]">
                {def.term}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-[#D1D5DB] leading-relaxed">
                {def.meaning}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailDefinitionsSection.displayName = 'LawDetailDefinitionsSection';

// ==========================================
// 6C. Memoized Sub-Sections Breakdown
// ==========================================
interface LawDetailSubSectionsProps {
  isExpanded: boolean;
  subSections?: string[];
  onToggle: () => void;
}

export const LawDetailSubSections = memo<LawDetailSubSectionsProps>(({
  isExpanded,
  subSections,
  onToggle
}) => {
  if (!subSections || subSections.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-purple-500/10 dark:bg-[#A855F7]/15 text-purple-600 dark:text-[#A855F7]">
            <Layers className="w-4 h-4" />
          </div>
          <span>Sub-Sections & Clauses</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {subSections.map((sub, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs sm:text-sm text-slate-800 dark:text-[#FFFFFF]">
              <span className="w-5 h-5 rounded-full bg-purple-500/15 dark:bg-[#A855F7]/15 text-purple-700 dark:text-[#A855F7] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailSubSections.displayName = 'LawDetailSubSections';

// ==========================================
// 6D. Memoized Amendments & Legislative History
// ==========================================
interface LawDetailAmendmentsSectionProps {
  isExpanded: boolean;
  amendments?: string[];
  onToggle: () => void;
}

export const LawDetailAmendmentsSection = memo<LawDetailAmendmentsSectionProps>(({
  isExpanded,
  amendments,
  onToggle
}) => {
  if (!amendments || amendments.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-amber-500/10 dark:bg-[#F59E0B]/15 text-amber-600 dark:text-[#F59E0B]">
            <History className="w-4 h-4" />
          </div>
          <span>Key Amendments & Case Law History</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {amendments.map((amend, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 dark:bg-[#F59E0B]/10 border border-amber-500/20 dark:border-[#F59E0B]/25 text-xs sm:text-sm text-slate-800 dark:text-[#F3F4F6]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-[#F59E0B] shrink-0 mt-2" />
              <span className="leading-relaxed">{amend}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailAmendmentsSection.displayName = 'LawDetailAmendmentsSection';

// ==========================================
// 6E. Memoized Related Laws List
// ==========================================
interface LawDetailRelatedLawsSectionProps {
  isExpanded: boolean;
  relatedLaws?: string[];
  onToggle: () => void;
}

export const LawDetailRelatedLawsSection = memo<LawDetailRelatedLawsSectionProps>(({
  isExpanded,
  relatedLaws,
  onToggle
}) => {
  if (!relatedLaws || relatedLaws.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-[#3B82F6]/15 text-blue-600 dark:text-[#3B82F6]">
            <BookOpen className="w-4 h-4" />
          </div>
          <span>Related Acts & Statutory Codes</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {relatedLaws.map((lawName, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs sm:text-sm text-slate-800 dark:text-[#FFFFFF]">
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-[#3B82F6] shrink-0" />
              <span className="font-semibold">{lawName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailRelatedLawsSection.displayName = 'LawDetailRelatedLawsSection';

// ==========================================
// 7. Memoized Official Bare Act Text
// ==========================================
interface LawDetailOfficialTextSectionProps {
  isExpanded: boolean;
  officialText: string;
  onToggle: () => void;
}

export const LawDetailOfficialTextSection = memo<LawDetailOfficialTextSectionProps>(({
  isExpanded,
  officialText,
  onToggle
}) => {
  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-slate-500/10 dark:bg-[#181818] text-slate-600 dark:text-[#B3B3B3]">
            <Scale className="w-4 h-4" />
          </div>
          <span>Official Legal Text (Bare Act Statutory Wording)</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          <div className="p-4 rounded-xl bg-slate-950 dark:bg-[#050505] text-orange-200/95 dark:text-[#B3B3B3] font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 dark:border-[#292929] shadow-inner">
            <div className="text-[10px] uppercase font-bold text-orange-400 dark:text-[#7C5CFF] tracking-widest mb-2 flex items-center justify-between">
              <span>Authentic Statutory Formulation</span>
              <span>India Code / Gazette of India</span>
            </div>
            {officialText}
          </div>
        </div>
      )}
    </div>
  );
});

LawDetailOfficialTextSection.displayName = 'LawDetailOfficialTextSection';

// ==========================================
// 8. Memoized Related Sections
// ==========================================
interface LawDetailRelatedSectionsProps {
  isExpanded: boolean;
  relatedSections?: LawRelatedSection[];
  onToggle: () => void;
  onSelectRelated: (rel: LawRelatedSection) => void;
}

export const LawDetailRelatedSections = memo<LawDetailRelatedSectionsProps>(({
  isExpanded,
  relatedSections,
  onToggle,
  onSelectRelated
}) => {
  if (!relatedSections || relatedSections.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-500 dark:text-[#7C5CFF]">
            <BookOpen className="w-4 h-4" />
          </div>
          <span>Related Sections & Cross-References</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {relatedSections.map((rel, idx) => (
            <div
              key={idx}
              onClick={() => onSelectRelated(rel)}
              className="p-3 rounded-xl bg-white dark:bg-[#181818] hover:bg-slate-100 dark:hover:bg-[#202020] border border-slate-200 dark:border-[#292929] hover:border-orange-500/40 dark:hover:border-[#7C5CFF]/50 cursor-pointer transition-colors group flex items-center justify-between shadow-xs"
            >
              <div>
                <div className="font-bold text-xs text-orange-600 dark:text-[#7C5CFF] font-mono">
                  {rel.section_number}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-[#FFFFFF] group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF]">
                  {rel.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-[#777777]">
                  {rel.act_name}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-[#777777] group-hover:text-orange-500 dark:group-hover:text-[#7C5CFF] shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailRelatedSections.displayName = 'LawDetailRelatedSections';

// ==========================================
// 8.5 Memoized Statutory Hierarchy Section
// ==========================================
interface LawDetailHierarchySectionProps {
  isExpanded: boolean;
  law: LawItem;
  onToggle: () => void;
}

export const LawDetailHierarchySection = memo<LawDetailHierarchySectionProps>(({
  isExpanded,
  law,
  onToggle
}) => {
  const hierarchy = law.chapter_hierarchy;
  if (!hierarchy) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-[#3B82F6]/15 text-blue-600 dark:text-[#3B82F6]">
            <Layers className="w-4 h-4" />
          </div>
          <span>Statutory Hierarchy &amp; India Code Source Page</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          <div className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] space-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Act:</span>
              <span className="font-mono text-orange-600 dark:text-[#a78bfa]">{law.official_name || law.act_name}</span>
              {law.act_number_year && (
                <span className="text-[11px] font-mono text-slate-500">({law.act_number_year})</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Chapter:</span>
              <span className="font-mono text-slate-800 dark:text-white">{hierarchy.chapter_number} — {hierarchy.chapter_title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Provision:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{hierarchy.section_number}</span>
              {hierarchy.sub_section && (
                <span className="text-[11px] font-mono text-slate-500">[{hierarchy.sub_section}]</span>
              )}
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-[#262626] flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Official India Code Source Link:</span>
              <a
                href={hierarchy.source_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-[#60A5FA] hover:underline"
              >
                <span>India Code Section Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

LawDetailHierarchySection.displayName = 'LawDetailHierarchySection';

// ==========================================
// 8.6 Memoized Authoritative Amendment History Table
// ==========================================
interface LawDetailAuthoritativeAmendmentsProps {
  isExpanded: boolean;
  history?: import('../../types').AmendmentHistoryItem[];
  onToggle: () => void;
}

export const LawDetailAuthoritativeAmendmentsTable = memo<LawDetailAuthoritativeAmendmentsProps>(({
  isExpanded,
  history,
  onToggle
}) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-purple-500/10 dark:bg-[#C084FC]/15 text-purple-600 dark:text-[#C084FC]">
            <History className="w-4 h-4" />
          </div>
          <span>Official Amendment History &amp; Gazette Citations ({history.length})</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {history.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {item.amending_act}
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.what_changed}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-[#262626] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="text-slate-500 dark:text-slate-400">
                  Gazette Citation: <strong className="text-slate-700 dark:text-slate-300">{item.citation}</strong>
                </div>
                {item.gazette_url && (
                  <a
                    href={item.gazette_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-[#60A5FA] hover:underline"
                  >
                    <span>e-Gazette Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailAuthoritativeAmendmentsTable.displayName = 'LawDetailAuthoritativeAmendmentsTable';

// ==========================================
// 8.7 Memoized Subordinate Legislation Section
// ==========================================
interface LawDetailSubordinateLegislationSectionProps {
  isExpanded: boolean;
  subordinate?: import('../../types').SubordinateLegislation[];
  onToggle: () => void;
}

export const LawDetailSubordinateLegislationSection = memo<LawDetailSubordinateLegislationSectionProps>(({
  isExpanded,
  subordinate,
  onToggle
}) => {
  if (!subordinate || subordinate.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-[#22C55E]/15 text-emerald-600 dark:text-[#22C55E]">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <span>Related Subordinate Legislation (Rules &amp; Notifications)</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2.5 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
          {subordinate.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] space-y-1.5 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.title}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                  {item.type} {item.number}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Issued by {item.issuing_authority}</span>
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-[#60A5FA] hover:underline"
                  >
                    <span>Notification Gazette</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

LawDetailSubordinateLegislationSection.displayName = 'LawDetailSubordinateLegislationSection';

// ==========================================
// 9. Memoized Authoritative Source & Metadata
// ==========================================
interface LawDetailSourceMetadataProps {
  source: string;
  sourceUrl: string;
  effectiveDate: string;
  lastUpdated: string;
  updateNotes?: string;
  primarySourceName?: string;
  verificationStatus?: string;
  verificationMethod?: string;
}

export const LawDetailSourceMetadata = memo<LawDetailSourceMetadataProps>(({
  source,
  sourceUrl,
  effectiveDate,
  lastUpdated,
  updateNotes,
  primarySourceName,
  verificationStatus,
  verificationMethod
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] space-y-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#22C55E]" />
          <span>Statutory Authority &amp; Sourcing Registry:</span>
        </div>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-[#60A5FA] hover:underline"
        >
          <span>{primarySourceName || source || 'India Code (indiacode.nic.in)'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-[#222222] text-[11px] text-slate-600 dark:text-[#777777]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
          <span>Commencement Date: <strong className="text-slate-900 dark:text-[#FFFFFF]">{effectiveDate}</strong></span>
        </div>
        <div>
          Last Verified Date: <strong className="text-slate-900 dark:text-[#FFFFFF]">{lastUpdated}</strong>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-[#222222] text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <div>
          Verification Status: <strong className="text-emerald-600 dark:text-[#22C55E]">{verificationStatus || 'Verified'}</strong> • Method: {verificationMethod || 'Automated Diff against India Code Repository'}
        </div>
        <div className="text-[10px] text-slate-400 dark:text-[#666666]">
          Non-Negotiable Verification Protocol: Zero model inference. Verified against India Code (indiacode.nic.in) and Gazette of India (egazette.gov.in).
        </div>
      </div>

      {updateNotes && (
        <p className="text-[11px] text-emerald-700 dark:text-[#22C55E] pt-1">
          <strong>Recent Update Note:</strong> {updateNotes}
        </p>
      )}
    </div>
  );
});

LawDetailSourceMetadata.displayName = 'LawDetailSourceMetadata';
