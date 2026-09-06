import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search as SearchIcon, 
  X, 
  Filter, 
  Trash2, 
  Sparkles, 
  History, 
  AlertCircle,
  MapPin,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LawCard } from '../LawCard';
import { SearchHistoryDropdown } from '../SearchHistoryDropdown';
import { CATEGORIES } from '../../data/categories';
import { INDIAN_STATES } from '../../data/laws';
import { CitizenRightsGuide } from '../legal/CitizenRightsGuide';
import { LegalMaxims } from '../legal/LegalMaxims';
import { LegalHelplines } from '../legal/LegalHelplines';
import { MOTION_EASINGS } from '../../utils/motion';

export const SearchView: React.FC = () => {
  const { 
    laws, 
    filters, 
    setFilters, 
    recentSearches, 
    addRecentSearch, 
    removeRecentSearch,
    clearRecentSearches,
    setShowAIAssistant,
    setAiInitialQuestion,
    user
  } = useApp();

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBarContainerRef = useRef<HTMLDivElement>(null);

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
    };
  }, []);

  const searchSuggestions = [
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

  // Perform multi-attribute filtering
  const searchResults = useMemo(() => {
    let list = [...laws];

    // Category filter
    if (filters.category_id && filters.category_id !== 'all') {
      list = list.filter(l => l.category_id === filters.category_id);
    }

    // State filter
    if (filters.state && filters.state !== 'all') {
      list = list.filter(l => l.state_applicability === 'All India' || l.state_applicability.includes(filters.state));
    }

    // Bailable filter
    if (filters.bailable && filters.bailable !== 'all') {
      if (filters.bailable === 'bailable') list = list.filter(l => l.is_bailable === true);
      if (filters.bailable === 'non-bailable') list = list.filter(l => l.is_bailable === false);
    }

    // Cognizable filter
    if (filters.cognizable && filters.cognizable !== 'all') {
      if (filters.cognizable === 'cognizable') list = list.filter(l => l.is_cognizable === true);
      if (filters.cognizable === 'non-cognizable') list = list.filter(l => l.is_cognizable === false);
    }

    // Keyword / Query search
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      list = list.filter(l => {
        return (
          l.section_number.toLowerCase().includes(q) ||
          l.section_title.toLowerCase().includes(q) ||
          l.act_name.toLowerCase().includes(q) ||
          (l.short_act && l.short_act.toLowerCase().includes(q)) ||
          l.keywords.some(k => k.toLowerCase().includes(q)) ||
          l.simple_explanation.toLowerCase().includes(q) ||
          l.actions_covered.some(a => a.toLowerCase().includes(q)) ||
          l.punishment.toLowerCase().includes(q) ||
          l.fine.toLowerCase().includes(q) ||
          (l.court_triable && l.court_triable.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [laws, filters]);

  const handleQueryChange = (val: string) => {
    setFilters(prev => ({ ...prev, query: val }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.query.trim()) {
      addRecentSearch(filters.query.trim());
    }
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (term: string) => {
    addRecentSearch(term);
    setFilters(prev => ({ ...prev, query: term }));
    setIsSearchFocused(false);
  };

  const handleSelectHistoryTerm = (term: string) => {
    addRecentSearch(term);
    setFilters(prev => ({ ...prev, query: term }));
    setIsSearchFocused(false);
  };

  const clearQuery = () => {
    setFilters(prev => ({ ...prev, query: '' }));
  };

  const resetAllFilters = () => {
    setFilters({
      query: '',
      category_id: 'all',
      bailable: 'all',
      cognizable: 'all',
      state: 'all'
    });
  };

  const activeFiltersCount = 
    (filters.category_id !== 'all' ? 1 : 0) +
    (filters.bailable !== 'all' ? 1 : 0) +
    (filters.cognizable !== 'all' ? 1 : 0) +
    (filters.state !== 'all' ? 1 : 0);

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
              value={filters.query}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Type section number (e.g. '66D', '185'), offence, or legal keyword..."
              className="w-full pl-12 pr-10 py-3.5 rounded-full liquid-pill text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-[#7C5CFF]/50 transition-all dark:bg-[#151515] dark:border-[#292929]"
            />
            {filters.query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute right-3.5 top-3.5 text-slate-400 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF] cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Quick-Access Search History Dropdown on Focus */}
          <SearchHistoryDropdown
            isOpen={isSearchFocused}
            onClose={() => setIsSearchFocused(false)}
            currentQuery={filters.query}
            onSelectTerm={handleSelectHistoryTerm}
            popularSuggestions={searchSuggestions}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowFiltersModal(!showFiltersModal)}
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

      {/* Filter Options Panel */}
      <AnimatePresence>
        {showFiltersModal && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: MOTION_EASINGS.appleDecel }}
            className="p-4 sm:p-6 rounded-3xl liquid-glass-card shadow-2xl space-y-4 overflow-hidden dark:border-[#292929] dark:bg-[#121212]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#FFFFFF]">
                Filter Database
              </span>
              <button
                onClick={resetAllFilters}
                className="text-xs text-orange-600 dark:text-[#7C5CFF] hover:underline font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-[#B3B3B3]">
                  Category
                </label>
                <select
                  value={filters.category_id}
                  onChange={e => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929]"
                >
                  <option value="all" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">All 22 Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Bailable / Non-Bailable */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-[#B3B3B3]">
                  Bail Status
                </label>
                <select
                  value={filters.bailable}
                  onChange={e => setFilters(prev => ({ ...prev, bailable: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929]"
                >
                  <option value="all" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">All Offences</option>
                  <option value="bailable" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">Bailable Only</option>
                  <option value="non-bailable" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">Non-Bailable Only</option>
                </select>
              </div>

              {/* Cognizable */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-[#B3B3B3]">
                  Arrest Classification
                </label>
                <select
                  value={filters.cognizable}
                  onChange={e => setFilters(prev => ({ ...prev, cognizable: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929]"
                >
                  <option value="all" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">All Classifications</option>
                  <option value="cognizable" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">Cognizable (Arrest without warrant)</option>
                  <option value="non-cognizable" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">Non-Cognizable</option>
                </select>
              </div>

              {/* State applicability */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-[#B3B3B3]">
                  State Applicability
                </label>
                <select
                  value={filters.state}
                  onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929]"
                >
                  <option value="all" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">All India & States</option>
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st} className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">{st}</option>
                  ))}
                </select>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions and Recent Searches */}
      {!filters.query && (
        <div className="space-y-4">
          
          {/* Quick Suggestions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
              Suggested Legal Queries
            </span>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3.5 py-1.5 rounded-full liquid-pill text-xs font-medium text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] dark:hover:border-[#7C5CFF]/40 transition-colors cursor-pointer"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4 rounded-2xl liquid-glass-card space-y-2 dark:border-[#292929]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#FFFFFF]">
                  <History className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-slate-500 hover:text-rose-500 dark:text-[#777777] dark:hover:text-[#EF4444] flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {recentSearches.map((term, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill text-xs font-medium text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] dark:hover:border-[#7C5CFF]/40 cursor-pointer group transition-colors"
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      className="text-slate-400 hover:text-rose-500 dark:text-[#777777] dark:hover:text-[#EF4444] p-0.5 rounded-full"
                      title="Remove search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            onClick={() => {
              setAiInitialQuestion(`Explain the legal aspects and consequences of "${filters.query}" in India.`);
              setShowAIAssistant(true);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI about &ldquo;{filters.query}&rdquo;</span>
          </button>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map(law => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>

          {/* Enrich bottom of search results with Citizen Rights & Helplines */}
          <div className="pt-6 border-t border-black/5 dark:border-[#222222] space-y-6">
            <CitizenRightsGuide limit={3} />
            <LegalHelplines />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-[#292929] space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/15 dark:bg-[#F59E0B]/15 text-orange-400 dark:text-[#F59E0B] flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF]">
                No matching sections found for &ldquo;{filters.query}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] mt-1 max-w-md mx-auto">
                Try searching with broader terminology, checking section numerals, or checking the transition from old IPC/CrPC sections below.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-full bg-white dark:bg-[#181818] hover:bg-slate-100 dark:hover:bg-[#202020] border border-slate-200 dark:border-[#292929] text-xs font-semibold text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={() => {
                  setAiInitialQuestion(filters.query || 'Indian legal provisions');
                  setShowAIAssistant(true);
                }}
                className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6b4ae0] text-white text-xs font-bold shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/30 transition-all cursor-pointer"
              >
                Consult AI Assistant
              </button>
            </div>
          </div>

          {/* Quick Transition Reference: IPC -> BNS and CrPC -> BNSS */}
          <div className="p-5 sm:p-6 rounded-3xl liquid-glass-card space-y-3 dark:border-[#292929]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
              <Scale className="w-4 h-4" />
              <span>Common Penal Code Transitions (Click to Search)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
              The Indian Penal Code 1860 was replaced by Bharatiya Nyaya Sanhita 2023. Select any legacy provision to view its modern statutory section:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
              {[
                { legacy: 'IPC 302 (Murder)', modern: 'Section 103 BNS' },
                { legacy: 'IPC 420 (Cheating)', modern: 'Section 318 BNS' },
                { legacy: 'IPC 378 (Theft)', modern: 'Section 303 BNS' },
                { legacy: 'IPC 354 (Molestation)', modern: 'Section 74 BNS' },
                { legacy: 'CrPC 154 (FIR)', modern: 'Section 173 BNSS' },
                { legacy: 'CrPC 436 (Bail)', modern: 'Section 478 BNSS' },
                { legacy: 'CrPC 438 (Anticipatory Bail)', modern: 'Section 482 BNSS' },
                { legacy: 'IPC 124A (Sedition)', modern: 'Section 152 BNS' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, query: item.modern }));
                  }}
                  className="p-2.5 rounded-xl liquid-pill text-left transition-all hover:border-orange-500/50 dark:hover:border-[#7C5CFF]/50 group cursor-pointer"
                >
                  <div className="text-[10px] text-slate-500 dark:text-[#777777] line-through">
                    {item.legacy}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#FFFFFF] group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] mt-0.5">
                    → {item.modern}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Rights Guide */}
          <div className="pt-2">
            <CitizenRightsGuide />
          </div>

          {/* Legal Helplines */}
          <div className="pt-2">
            <LegalHelplines />
          </div>
        </div>
      )}

    </div>
  );
};
