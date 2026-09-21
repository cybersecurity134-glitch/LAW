import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';
import { LawRelatedSection } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { LawDetailHeader } from './detail/LawDetailSections';
import { LawDetailMainContent } from './detail/LawDetailMainContent';

export const LawDetailModal: React.FC = memo(() => {
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

  // Memoized modal close handler
  const handleCloseModal = useCallback(() => {
    closeLawDetail();
  }, [closeLawDetail]);

  // Keyboard accessibility: close modal on Escape key press
  useEffect(() => {
    if (!selectedLaw) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLaw, handleCloseModal]);

  // Memoized bookmark state
  const saved = useMemo(() => {
    return selectedLaw ? isBookmarked(selectedLaw.id) : false;
  }, [selectedLaw, isBookmarked]);

  // Memoized category lookup
  const category = useMemo(() => {
    return selectedLaw ? CATEGORIES.find(c => c.id === selectedLaw.category_id) : undefined;
  }, [selectedLaw?.category_id]);

  // Memoized section toggling
  const toggleSection = useCallback((section: string) => {
    setExpandedSection(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleToggleMeaning = useCallback(() => toggleSection('meaning'), [toggleSection]);
  const handleToggleActions = useCallback(() => toggleSection('actions'), [toggleSection]);
  const handleTogglePenalties = useCallback(() => toggleSection('penalties'), [toggleSection]);
  const handleToggleExceptions = useCallback(() => toggleSection('exceptions'), [toggleSection]);
  const handleToggleDefinitions = useCallback(() => toggleSection('definitions'), [toggleSection]);
  const handleToggleSubSections = useCallback(() => toggleSection('subSections'), [toggleSection]);
  const handleToggleAmendments = useCallback(() => toggleSection('amendments'), [toggleSection]);
  const handleToggleRelatedLaws = useCallback(() => toggleSection('relatedLaws'), [toggleSection]);
  const handleToggleOfficialText = useCallback(() => toggleSection('officialText'), [toggleSection]);
  const handleToggleRelated = useCallback(() => toggleSection('related'), [toggleSection]);

  // Memoized clipboard share handler
  const handleShare = useCallback(async () => {
    if (!selectedLaw) return;
    const text = `${selectedLaw.act_name} - ${selectedLaw.section_number}: ${selectedLaw.section_title}\n\nExplanation: ${selectedLaw.simple_explanation}\n\nPunishment: ${selectedLaw.punishment}\nFine: ${selectedLaw.fine}\n\nVerified via LawSphere Indian Legal Information Guide`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [selectedLaw]);

  // Memoized AI question launcher
  const handleAskAI = useCallback(() => {
    if (!selectedLaw) return;
    setAiInitialQuestion(`Could you explain ${selectedLaw.act_name} ${selectedLaw.section_number} (${selectedLaw.section_title}) in simple terms with practical real-life examples and exceptions?`);
    setShowAIAssistant(true);
  }, [selectedLaw, setAiInitialQuestion, setShowAIAssistant]);

  // Memoized targeted AI question launcher with custom capability prompt
  const handleAskAIWithPrompt = useCallback((prompt: string) => {
    closeLawDetail();
    setAiInitialQuestion(prompt);
    setShowAIAssistant(true);
  }, [closeLawDetail, setAiInitialQuestion, setShowAIAssistant]);

  // Memoized bookmark toggle handler
  const handleToggleBookmark = useCallback(() => {
    if (selectedLaw) {
      toggleBookmark(selectedLaw.id);
    }
  }, [selectedLaw, toggleBookmark]);

  // Memoized data fetching & navigation logic for related legal sections
  const fetchAndSelectRelatedLaw = useCallback((rel: LawRelatedSection) => {
    if (rel.law_id) {
      openLawDetail(rel.law_id);
      return;
    }

    // High-performance search & resolution in laws database
    const normalizedNumber = rel.section_number.toLowerCase().trim();
    const normalizedTitle = rel.title.toLowerCase().trim();

    const matched = laws.find(l => 
      l.section_number.toLowerCase().trim() === normalizedNumber ||
      l.section_title.toLowerCase().includes(normalizedTitle)
    );

    if (matched) {
      openLawDetail(matched.id);
    } else {
      handleCloseModal();
      setFilters(prev => ({ ...prev, query: `${rel.section_number} ${rel.act_name}` }));
      setActiveTab('search');
    }
  }, [laws, openLawDetail, handleCloseModal, setFilters, setActiveTab]);

  // Memoized language explanation mode switchers
  const handleSetSimpleMode = useCallback(() => setExplanationMode('simple'), [setExplanationMode]);
  const handleSetDetailedMode = useCallback(() => setExplanationMode('detailed'), [setExplanationMode]);

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
          onClick={handleCloseModal}
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
            
            {/* Memoized Header Bar */}
            <LawDetailHeader
              categoryName={category?.name}
              isSaved={saved}
              copied={copied}
              onBack={handleCloseModal}
              onAskAI={handleAskAI}
              onShare={handleShare}
              onToggleBookmark={handleToggleBookmark}
              onClose={handleCloseModal}
            />

            {/* Memoized Main Content Container: Only re-renders when necessary */}
            <LawDetailMainContent
              law={selectedLaw}
              category={category}
              explanationMode={explanationMode}
              expandedSection={expandedSection}
              onSetSimpleMode={handleSetSimpleMode}
              onSetDetailedMode={handleSetDetailedMode}
              onToggleMeaning={handleToggleMeaning}
              onToggleActions={handleToggleActions}
              onTogglePenalties={handleTogglePenalties}
              onToggleExceptions={handleToggleExceptions}
              onToggleDefinitions={handleToggleDefinitions}
              onToggleSubSections={handleToggleSubSections}
              onToggleAmendments={handleToggleAmendments}
              onToggleRelatedLaws={handleToggleRelatedLaws}
              onToggleOfficialText={handleToggleOfficialText}
              onToggleRelated={handleToggleRelated}
              onSelectRelated={fetchAndSelectRelatedLaw}
              onAskAIWithPrompt={handleAskAIWithPrompt}
            />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LawDetailModal.displayName = 'LawDetailModal';
