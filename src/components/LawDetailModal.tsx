import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Coins, 
  AlertTriangle, 
  Shield, 
  Scale, 
  ExternalLink, 
  BookOpen, 
  FileText,
  Calendar,
  CheckCircle2,
  Copy,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';

export const LawDetailModal: React.FC = () => {
  const { 
    selectedLaw, 
    closeLawDetail, 
    openLawDetail,
    isBookmarked, 
    toggleBookmark, 
    setShowAIAssistant, 
    setAiInitialQuestion,
    explanationMode,
    setExplanationMode,
    laws,
    setFilters,
    setActiveTab
  } = useApp();

  const [expandedSection, setExpandedSection] = useState<{ [key: string]: boolean }>({
    meaning: true,
    actions: true,
    penalties: true,
    exceptions: true,
    officialText: false,
    related: true,
    source: true
  });

  const [copied, setCopied] = useState(false);

  const saved = selectedLaw ? isBookmarked(selectedLaw.id) : false;
  const category = selectedLaw ? CATEGORIES.find(c => c.id === selectedLaw.category_id) : undefined;

  const toggleSection = (section: string) => {
    setExpandedSection(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleShare = async () => {
    if (!selectedLaw) return;
    const text = `${selectedLaw.act_name} - ${selectedLaw.section_number}: ${selectedLaw.section_title}\n\nExplanation: ${selectedLaw.simple_explanation}\n\nPunishment: ${selectedLaw.punishment}\nFine: ${selectedLaw.fine}\n\nVerified via NyayaSetu Indian Legal Information Guide`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAskAI = () => {
    if (!selectedLaw) return;
    setAiInitialQuestion(`Could you explain ${selectedLaw.act_name} ${selectedLaw.section_number} (${selectedLaw.section_title}) in simple terms with practical real-life examples and exceptions?`);
    setShowAIAssistant(true);
  };

  return (
    <AnimatePresence>
      {selectedLaw && (
        <motion.div 
          key="law-detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: MOTION_EASINGS.appleDecel }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 modal-backdrop-blur overflow-y-auto cursor-pointer"
          onClick={closeLawDetail}
        >
          <motion.div 
            key="law-detail-card"
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl h-[94vh] sm:h-auto sm:max-h-[92vh] flex flex-col liquid-glass-card text-slate-900 dark:text-[#FFFFFF] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden cursor-default dark:bg-[#0B0B0B] dark:border-[#292929]"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 sm:px-6 py-3.5 liquid-header dark:bg-[#0B0B0B]/95 dark:border-b dark:border-[#222222]">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeLawDetail}
                  className="flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-xl liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </motion.button>
                <span className="text-xs text-slate-400 dark:text-[#292929] hidden sm:inline">|</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-[#777777] hidden sm:inline truncate max-w-xs">
                  {category?.name || 'Indian Law'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Ask AI about this law */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAskAI}
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
                  onClick={handleShare}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929] transition-colors cursor-pointer"
                  title="Copy citation & summary"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                </motion.button>

                {/* Bookmark */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleBookmark(selectedLaw.id)}
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    saved 
                      ? 'bg-orange-500/20 dark:bg-[#7C5CFF]/20 text-orange-600 dark:text-[#7C5CFF] border-orange-500/30 dark:border-[#7C5CFF]/40 shadow-xs' 
                      : 'liquid-pill text-slate-600 dark:text-[#777777] dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929]'
                  }`}
                  title={saved ? 'Remove Bookmark' : 'Save Law'}
                >
                  {saved ? <BookmarkCheck className="w-4 h-4 fill-orange-500 dark:fill-[#7C5CFF] text-orange-600 dark:text-[#7C5CFF]" /> : <Bookmark className="w-4 h-4" />}
                </motion.button>

                {/* Close */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={closeLawDetail}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl liquid-pill text-slate-500 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#181818] dark:border-[#292929] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Law Title & Metadata Banner */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/30 text-xs font-bold font-mono">
                {selectedLaw.section_number}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3] text-xs font-semibold">
                {category?.name || 'Law'}
              </span>
              {selectedLaw.state_applicability !== 'All India' && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 dark:bg-[#EF4444]/15 text-rose-700 dark:text-[#EF4444] border border-rose-500/20 dark:border-[#EF4444]/30 text-xs font-semibold">
                  <MapPin className="w-3 h-3" />
                  {selectedLaw.state_applicability}
                </span>
              )}
              {selectedLaw.is_recently_updated && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 dark:bg-[#22C55E]/15 text-emerald-700 dark:text-[#22C55E] border border-emerald-500/20 dark:border-[#22C55E]/30 text-xs font-semibold">
                  Recently Amended
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] tracking-tight font-display">
              {selectedLaw.section_title}
            </h1>

            <div className="text-sm font-semibold text-orange-600 dark:text-[#7C5CFF]">
              {selectedLaw.act_name}
            </div>

            {/* Classification Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedLaw.is_bailable !== null && (
                <div className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  selectedLaw.is_bailable 
                    ? 'bg-amber-500/15 dark:bg-[#22C55E]/15 text-amber-700 dark:text-[#22C55E] border-amber-500/30 dark:border-[#22C55E]/30' 
                    : 'bg-rose-500/15 dark:bg-[#EF4444]/15 text-rose-700 dark:text-[#EF4444] border-rose-500/30 dark:border-[#EF4444]/30'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  {selectedLaw.is_bailable ? 'Bailable Offence' : 'Non-Bailable Offence'}
                </div>
              )}

              {selectedLaw.is_cognizable !== null && (
                <div className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  selectedLaw.is_cognizable 
                    ? 'bg-indigo-500/15 dark:bg-[#3B82F6]/15 text-indigo-700 dark:text-[#3B82F6] border-indigo-500/30 dark:border-[#3B82F6]/30' 
                    : 'bg-slate-500/15 dark:bg-[#181818] text-slate-700 dark:text-[#B3B3B3] border-slate-500/30 dark:border-[#292929]'
                }`}>
                  <Scale className="w-3.5 h-3.5" />
                  {selectedLaw.is_cognizable ? 'Cognizable (Arrest without warrant)' : 'Non-Cognizable'}
                </div>
              )}

              {selectedLaw.court_triable && (
                <div className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-[#151515] text-slate-700 dark:text-[#B3B3B3] border border-slate-200 dark:border-[#292929]">
                  Triable: <span className="font-semibold text-slate-900 dark:text-[#FFFFFF]">{selectedLaw.court_triable}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher Banner: Citizen Friendly vs Official Statutory Text */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#292929]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-500 dark:text-[#7C5CFF]" />
              <span className="text-xs font-semibold text-slate-700 dark:text-[#B3B3B3]">
                Explanation Language
              </span>
            </div>
            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/60 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-xs font-medium">
              <button
                onClick={() => setExplanationMode('simple')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  explanationMode === 'simple'
                    ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                }`}
              >
                Simple Citizen Mode
              </button>
              <button
                onClick={() => setExplanationMode('detailed')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  explanationMode === 'detailed'
                    ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                }`}
              >
                Detailed Legal Text
              </button>
            </div>
          </div>

          {/* 1. What does this law mean? */}
          <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
            <button
              onClick={() => toggleSection('meaning')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
                <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-500 dark:text-[#7C5CFF]">
                  <FileText className="w-4 h-4" />
                </div>
                <span>What does this law mean?</span>
              </div>
              {expandedSection.meaning ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
            </button>

            {expandedSection.meaning && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
                <div className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-sm text-slate-800 dark:text-[#FFFFFF] leading-relaxed font-normal shadow-xs">
                  <div className="text-xs uppercase font-bold text-orange-600 dark:text-[#7C5CFF] tracking-wider mb-1">
                    Simplified Plain Language
                  </div>
                  {selectedLaw.simple_explanation}
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-700 dark:text-[#B3B3B3] leading-relaxed">
                  <div className="text-xs uppercase font-bold text-slate-500 dark:text-[#777777] tracking-wider mb-1">
                    In-Depth Legal Scope
                  </div>
                  {selectedLaw.what_it_means}
                </div>
              </div>
            )}
          </div>

          {/* 2. What action or behavior does it cover? (Causes / Why this law applies) */}
          <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
            <button
              onClick={() => toggleSection('actions')}
              className="w-full min-h-[48px] flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
                <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-[#EF4444]/15 text-rose-500 dark:text-[#EF4444]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span>Causes & When This Law Applies</span>
              </div>
              {expandedSection.actions ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
            </button>

            {expandedSection.actions && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
                <div className="grid gap-2">
                  {selectedLaw.actions_covered.map((action, idx) => (
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

          {/* 3. Punishment, Fine, and Other Consequences */}
          <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
            <button
              onClick={() => toggleSection('penalties')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-[#3B82F6]/15 text-indigo-500 dark:text-[#3B82F6]">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Punishment, Fine & Consequences</span>
              </div>
              {expandedSection.penalties ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
            </button>

            {expandedSection.penalties && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Punishment */}
                  <div className="p-4 rounded-xl bg-rose-500/10 dark:bg-[#EF4444]/10 border border-rose-500/20 dark:border-[#EF4444]/25 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-[#EF4444]">
                      <Clock className="w-3.5 h-3.5" />
                      Imprisonment & Penalty
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-[#FFFFFF]">
                      {selectedLaw.punishment}
                    </div>
                    {selectedLaw.imprisonment && (
                      <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
                        Term: {selectedLaw.imprisonment}
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
                      {selectedLaw.fine || 'Discretion of the Court'}
                    </div>
                  </div>
                </div>

                {/* Other consequences */}
                {selectedLaw.other_consequences && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs sm:text-sm text-slate-700 dark:text-[#B3B3B3]">
                    <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">Additional Legal Consequences: </span>
                    {selectedLaw.other_consequences}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Important Exceptions */}
          {selectedLaw.exceptions && selectedLaw.exceptions.length > 0 && (
            <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
              <button
                onClick={() => toggleSection('exceptions')}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-[#22C55E]/15 text-emerald-500 dark:text-[#22C55E]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span>Important Exceptions & Defenses</span>
                </div>
                {expandedSection.exceptions ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
              </button>

              {expandedSection.exceptions && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-2 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
                  {selectedLaw.exceptions.map((exc, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 dark:bg-[#22C55E]/10 border border-emerald-500/20 dark:border-[#22C55E]/25 text-xs sm:text-sm text-slate-700 dark:text-[#FFFFFF]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Official Legal Text (Authentic Gazette/Statute) */}
          <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
            <button
              onClick={() => toggleSection('officialText')}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
                <div className="p-1.5 rounded-lg bg-slate-500/10 dark:bg-[#181818] text-slate-600 dark:text-[#B3B3B3]">
                  <Scale className="w-4 h-4" />
                </div>
                <span>Official Legal Text (Bare Act Statutory Wording)</span>
              </div>
              {expandedSection.officialText ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
            </button>

            {expandedSection.officialText && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
                <div className="p-4 rounded-xl bg-slate-950 dark:bg-[#050505] text-orange-200/95 dark:text-[#B3B3B3] font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 dark:border-[#292929] shadow-inner">
                  <div className="text-[10px] uppercase font-bold text-orange-400 dark:text-[#7C5CFF] tracking-widest mb-2 flex items-center justify-between">
                    <span>Authentic Statutory Formulation</span>
                    <span>India Code / Gazette of India</span>
                  </div>
                  {selectedLaw.official_text}
                </div>
              </div>
            )}
          </div>

          {/* 6. Clickable Related Laws & Sections */}
          {selectedLaw.related_sections && selectedLaw.related_sections.length > 0 && (
            <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#292929]">
              <button
                onClick={() => toggleSection('related')}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-base sm:text-lg font-display">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-500 dark:text-[#7C5CFF]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Related Sections & Cross-References</span>
                </div>
                {expandedSection.related ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-[#777777]" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-[#777777]" />}
              </button>

              {expandedSection.related && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200 dark:border-[#222222] accordion-open-blur">
                  {selectedLaw.related_sections.map((rel, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (rel.law_id) {
                          openLawDetail(rel.law_id);
                        } else {
                          const matched = laws.find(l => 
                            l.section_number.toLowerCase().trim() === rel.section_number.toLowerCase().trim() ||
                            l.section_title.toLowerCase().includes(rel.title.toLowerCase())
                          );
                          if (matched) {
                            openLawDetail(matched.id);
                          } else {
                            closeLawDetail();
                            setFilters(prev => ({ ...prev, query: `${rel.section_number} ${rel.act_name}` }));
                            setActiveTab('search');
                          }
                        }
                      }}
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
          )}

          {/* 7. Official Source & Verification Metadata */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold text-slate-700 dark:text-[#B3B3B3] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#22C55E]" />
                <span>Authoritative Legal Source:</span>
              </div>
              <a
                href={selectedLaw.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline"
              >
                <span>{selectedLaw.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-[#222222] text-[11px] text-slate-600 dark:text-[#777777]">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
                <span>Effective Date: <strong className="text-slate-900 dark:text-[#FFFFFF]">{selectedLaw.effective_date}</strong></span>
              </div>
              <div>
                Last Updated: <strong className="text-slate-900 dark:text-[#FFFFFF]">{selectedLaw.last_updated}</strong>
              </div>
            </div>

            {selectedLaw.update_notes && (
              <p className="text-[11px] text-emerald-700 dark:text-[#22C55E] pt-1">
                <strong>Recent Update Note:</strong> {selectedLaw.update_notes}
              </p>
            )}
          </div>

        </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
