import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search as SearchIcon, 
  X, 
  Filter, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SearchHistoryDropdown } from '../SearchHistoryDropdown';
import { VoiceSearchButton } from '../VoiceSearchButton';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { CitizenRightsGuide } from '../legal/CitizenRightsGuide';
import { LegalHelplines } from '../legal/LegalHelplines';
import { searchIndexedLaws } from '../../utils/searchIndex';
import { LawFilters } from '../../types';
import { getEffectiveVoiceLanguage } from '../../data/languages';
import {
  SearchSuggestionsBar,
  RecentSearchesSection,
  SearchFiltersPanel,
  PenalCodeTransitions,
  SearchResultsGrid,
  SearchEmptyState
} from './SearchComponents';

const SEARCH_SUGGESTIONS = [
  'Section 66',
  'Drunk driving',
  'Section 103 BNS',
  'Cheque bounce',
  'Online UPI fraud',
  'Defective product',
  'Maternity benefit',
  'Zero FIR',
  'Wrong side driving'
];

export const SearchView: React.FC = memo(() => {
  const { 
    laws, 
    filters, 
    setFilters, 
    recentSearches, 
    searchHistory,
    addRecentSearch, 
    removeRecentSearch,
    clearRecentSearches,
    openLawDetail,
    setShowAIAssistant,
    setAiInitialQuestion,
    bookmarks,
    user,
    updatePreferences
  } = useApp();

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query || '');
  const [visibleCount, setVisibleCount] = useState(16);
  const searchBarContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  // Dynamically resolve regional Indian voice search language from user profile settings
  const activeVoiceLanguage = useMemo(() => {
    return getEffectiveVoiceLanguage(user?.preferences);
  }, [user?.preferences]);

  // Sync local query when global filters.query changes externally
  useEffect(() => {
    setLocalQuery(filters.query || '');
  }, [filters.query]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(16);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarContainerRef.current && !searchBarContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // High-performance indexed multi-attribute search
  const searchResults = useMemo(() => {
    return searchIndexedLaws(laws, filters);
  }, [laws, filters]);

  const displayedResults = useMemo(() => {
    return searchResults.slice(0, visibleCount);
  }, [searchResults, visibleCount]);

  const activeFiltersCount = useMemo(() => {
    return (filters.category_id !== 'all' ? 1 : 0) +
      (filters.bailable !== 'all' ? 1 : 0) +
      (filters.cognizable !== 'all' ? 1 : 0) +
      (filters.state !== 'all' ? 1 : 0);
  }, [filters.category_id, filters.bailable, filters.cognizable, filters.state]);

  const handleQueryChange = useCallback((val: string) => {
    setLocalQuery(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // 100ms debounce for ultra-responsive typing without UI freezes
    debounceTimerRef.current = window.setTimeout(() => {
      setFilters(prev => ({ ...prev, query: val }));
    }, 100);
  }, [setFilters]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const trimmed = localQuery.trim();
    setFilters(prev => ({ ...prev, query: trimmed }));
    if (trimmed) {
      addRecentSearch(trimmed);
    }
    setIsSearchFocused(false);
  }, [localQuery, setFilters, addRecentSearch]);

  const handleSuggestionClick = useCallback((term: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalQuery(term);
    addRecentSearch(term);
    setFilters(prev => ({ ...prev, query: term }));
    setIsSearchFocused(false);
  }, [addRecentSearch, setFilters]);

  const handleSelectHistoryTerm = useCallback((term: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalQuery(term);
    addRecentSearch(term);
    setFilters(prev => ({ ...prev, query: term }));
    setIsSearchFocused(false);
  }, [addRecentSearch, setFilters]);

  const clearQuery = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalQuery('');
    setFilters(prev => ({ ...prev, query: '' }));
  }, [setFilters]);

  // Voice Search integration using browser SpeechRecognition API
  const handleVoiceResult = useCallback((transcriptText: string, isFinal: boolean) => {
    const lower = transcriptText.toLowerCase().trim();
    // Voice shortcut to clear search
    if (lower === 'clear' || lower === 'clear search' || lower === 'reset search') {
      clearQuery();
      return;
    }

    setLocalQuery(transcriptText);

    if (isFinal) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      const trimmed = transcriptText.trim();
      setFilters(prev => ({ ...prev, query: trimmed }));
      if (trimmed) {
        addRecentSearch(trimmed);
      }
      setIsSearchFocused(false);
    }
  }, [clearQuery, setFilters, addRecentSearch]);

  const {
    isListening: isVoiceListening,
    isSupported: isVoiceSupported,
    error: voiceError,
    toggleListening: toggleVoiceSearch,
    clearError: clearVoiceError
  } = useSpeechRecognition({
    onResult: handleVoiceResult,
    lang: activeVoiceLanguage.code
  });

  const resetAllFilters = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalQuery('');
    setFilters({
      query: '',
      category_id: 'all',
      bailable: 'all',
      cognizable: 'all',
      state: 'all'
    });
  }, [setFilters]);

  const handleUpdateFilter = useCallback((key: keyof LawFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, [setFilters]);

  const handleSelectTransition = useCallback((modernQuery: string) => {
    setFilters(prev => ({ ...prev, query: modernQuery }));
  }, [setFilters]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + 16);
  }, []);

  const handleConsultAI = useCallback(() => {
    setAiInitialQuestion(filters.query || 'Indian legal provisions');
    setShowAIAssistant(true);
  }, [filters.query, setAiInitialQuestion, setShowAIAssistant]);

  const handleAskAIAboutQuery = useCallback(() => {
    setAiInitialQuestion(`Explain the legal aspects and consequences of "${filters.query}" in India.`);
    setShowAIAssistant(true);
  }, [filters.query, setAiInitialQuestion, setShowAIAssistant]);

  const handleToggleFiltersModal = useCallback(() => {
    setShowFiltersModal(prev => !prev);
  }, []);

  const handleCloseSearchFocus = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  return (
    <div className="space-y-6 pb-12 view-blur-open">
      
      {/* Search Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
          Search Indian Laws & Sections
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3]">
          Find provisions by section number, Act name, offence description, fine, or punishment.
        </p>
      </div>

      {/* Main Search Bar & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div ref={searchBarContainerRef} className="relative flex-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <SearchIcon className="w-5 h-5 text-slate-400 dark:text-[#777777] absolute left-4 top-3.5 z-10" />
            <input
              type="text"
              value={localQuery}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={
                isVoiceListening
                  ? `Listening in ${activeVoiceLanguage.nativeName} (${activeVoiceLanguage.name})... Speak law or section`
                  : `Search laws or speak in ${activeVoiceLanguage.nativeName} (e.g. '66D', 'धारा 420', 'Bail rules')...`
              }
              className="w-full pl-12 pr-24 py-3.5 rounded-full liquid-pill text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-[#7C5CFF]/50 transition-all dark:bg-[#151515] dark:border-[#292929]"
            />
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 z-10">
              {localQuery && (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="p-1 rounded-full text-slate-400 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <VoiceSearchButton
                isListening={isVoiceListening}
                isSupported={isVoiceSupported}
                onToggle={toggleVoiceSearch}
                error={voiceError}
                onDismissError={clearVoiceError}
                activeLanguage={activeVoiceLanguage}
                onLanguageChange={(code) => updatePreferences({ voice_language: code })}
                showLanguageSelector={true}
                size="sm"
              />
            </div>
          </form>

          {/* Quick-Access Search History Dropdown on Focus */}
          <SearchHistoryDropdown
            isOpen={isSearchFocused}
            onClose={handleCloseSearchFocus}
            currentQuery={localQuery}
            onSelectTerm={handleSelectHistoryTerm}
            onSelectLaw={openLawDetail}
            popularSuggestions={SEARCH_SUGGESTIONS}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleToggleFiltersModal}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeFiltersCount > 0
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#6847ed] text-white shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 border border-orange-400/40 dark:border-[#7C5CFF]/40'
              : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white dark:bg-black text-orange-600 dark:text-[#7C5CFF] font-bold text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Filter Options Panel - Memoized */}
      <SearchFiltersPanel
        isOpen={showFiltersModal}
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        onUpdateFilter={handleUpdateFilter}
        onResetFilters={resetAllFilters}
        laws={laws}
      />

      {/* Suggestions and Recent Searches - Memoized */}
      {!filters.query && (
        <div className="space-y-4">
          <SearchSuggestionsBar
            suggestions={SEARCH_SUGGESTIONS}
            onSelectSuggestion={handleSuggestionClick}
          />

          <RecentSearchesSection
            recentSearches={recentSearches}
            searchHistory={searchHistory}
            onSelectSearch={handleSuggestionClick}
            onSelectLaw={openLawDetail}
            onRemoveSearch={removeRecentSearch}
            onClearAll={clearRecentSearches}
          />
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF]">
          Found <span className="text-orange-600 dark:text-[#7C5CFF]">{searchResults.length}</span> {searchResults.length === 1 ? 'Legal Section' : 'Legal Sections'}
          {filters.query && <span> for &ldquo;{filters.query}&rdquo;</span>}
        </div>

        {/* AI Assistant query prompt */}
        {filters.query && (
          <button
            onClick={handleAskAIAboutQuery}
            className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI about &ldquo;{filters.query}&rdquo;</span>
          </button>
        )}
      </div>

      {/* Results Grid or Empty State - Memoized */}
      <AnimatePresence mode="wait">
        {searchResults.length > 0 ? (
          <motion.div
            key="results-populated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            <SearchResultsGrid
              displayedResults={displayedResults}
              totalCount={searchResults.length}
              visibleCount={visibleCount}
              bookmarkSet={bookmarkSet}
              onLoadMore={handleLoadMore}
            />

            {/* Enrich bottom of search results with Citizen Rights & Helplines */}
            <div className="pt-6 border-t border-black/5 dark:border-[#222222] space-y-6">
              <CitizenRightsGuide limit={3} />
              <LegalHelplines />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results-empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            <SearchEmptyState
              query={filters.query}
              onResetFilters={resetAllFilters}
              onConsultAI={handleConsultAI}
            />

            {/* Penal Code Transitions - Memoized */}
            <PenalCodeTransitions onSelectTransition={handleSelectTransition} />

            {/* Citizen Rights Guide */}
            <div className="pt-2">
              <CitizenRightsGuide />
            </div>

            {/* Legal Helplines */}
            <div className="pt-2">
              <LegalHelplines />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
});

SearchView.displayName = 'SearchView';
