import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  RotateCcw, 
  History, 
  Trash2, 
  X, 
  Scale, 
  AlertCircle,
  Search,
  Clock
} from 'lucide-react';
import { LawCard } from '../LawCard';
import { CATEGORIES } from '../../data/categories';
import { INDIAN_STATES } from '../../data/laws';
import { LawItem, LawFilters, SearchHistoryItem } from '../../types';
import { MOTION_EASINGS } from '../../utils/motion';

// ==========================================
// 1. Memoized Search Suggestions Bar
// ==========================================
interface SearchSuggestionsBarProps {
  suggestions: string[];
  onSelectSuggestion: (term: string) => void;
}

export const SearchSuggestionsBar = memo<SearchSuggestionsBarProps>(({
  suggestions,
  onSelectSuggestion
}) => {
  return (
    <div className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
        Suggested Legal Queries
      </span>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <motion.button
            key={item}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectSuggestion(item)}
            className="min-h-[44px] px-4 py-2 rounded-full liquid-pill text-xs font-medium text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] dark:hover:border-[#7C5CFF]/40 transition-colors cursor-pointer flex items-center"
          >
            {item}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

SearchSuggestionsBar.displayName = 'SearchSuggestionsBar';

// ==========================================
// 2. Memoized Recent Searches Section
// ==========================================
interface RecentSearchesSectionProps {
  recentSearches: string[];
  searchHistory?: SearchHistoryItem[];
  onSelectSearch: (term: string) => void;
  onSelectLaw?: (lawId: string) => void;
  onRemoveSearch: (termOrId: string) => void;
  onClearAll: () => void;
}

function formatSearchTime(timestamp?: number): string {
  if (!timestamp) return '';
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export const RecentSearchesSection = memo<RecentSearchesSectionProps>(({
  recentSearches,
  searchHistory = [],
  onSelectSearch,
  onSelectLaw,
  onRemoveSearch,
  onClearAll
}) => {
  const [filterType, setFilterType] = useState<'all' | 'term' | 'law'>('all');

  const hasHistory = searchHistory.length > 0;
  const hasStrings = recentSearches.length > 0;
  if (!hasHistory && !hasStrings) return null;

  const filteredHistory = hasHistory
    ? searchHistory.filter(item => filterType === 'all' || item.type === filterType)
    : [];

  const termsCount = searchHistory.filter(i => i.type === 'term').length;
  const lawsCount = searchHistory.filter(i => i.type === 'law').length;

  return (
    <div className="p-4 rounded-2xl liquid-glass-card space-y-3 dark:border-[#292929]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#FFFFFF]">
            <History className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
            <span>Search History</span>
          </div>
          {hasHistory && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-[#151515] dark:border dark:border-[#292929] text-slate-600 dark:text-[#B3B3B3] font-mono">
              {searchHistory.length}
            </span>
          )}
        </div>

        {/* Filter Chips */}
        {hasHistory && (
          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-[#202020] p-1 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`min-h-[36px] px-3 py-1 rounded-full transition-all cursor-pointer flex items-center ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#121212] text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('term')}
              className={`min-h-[36px] px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'term'
                  ? 'bg-white dark:bg-[#121212] text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Terms ({termsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('law')}
              className={`min-h-[36px] px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'law'
                  ? 'bg-white dark:bg-[#121212] text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Queried Laws ({lawsCount})
            </button>
          </div>
        )}

        <button
          onClick={onClearAll}
          className="text-xs text-slate-500 hover:text-rose-500 dark:text-[#777777] dark:hover:text-[#EF4444] flex items-center gap-1.5 min-h-[44px] px-2.5 py-1.5 cursor-pointer transition-colors"
          title="Clear all saved search history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {hasHistory ? (
        filteredHistory.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 pt-0.5">
            {filteredHistory.map((item) => {
              const isLaw = item.type === 'law';
              const timeLabel = formatSearchTime(item.timestamp);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isLaw && item.law_id && onSelectLaw) {
                      onSelectLaw(item.law_id);
                    } else {
                      onSelectSearch(item.query);
                    }
                  }}
                  className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-full liquid-pill text-xs font-medium cursor-pointer group transition-all ${
                    isLaw
                      ? 'border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5'
                      : 'hover:border-orange-500/40 dark:hover:border-[#7C5CFF]/40'
                  }`}
                >
                  <span className={isLaw ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-[#777777] group-hover:text-orange-500'}>
                    {isLaw ? <Scale className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
                  </span>

                  <span className="text-slate-800 dark:text-[#FFFFFF] group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] transition-colors">
                    {item.query}
                  </span>

                  {timeLabel && (
                    <span className="text-[10px] text-slate-400 dark:text-[#666666] font-mono">
                      {timeLabel}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveSearch(item.id);
                    }}
                    className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-rose-500 dark:text-[#777777] dark:hover:text-[#EF4444] rounded-full cursor-pointer transition-colors"
                    title="Remove from history"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-[#777777] py-1">
            No search history found for this category.
          </p>
        )
      ) : (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {recentSearches.map((term, i) => (
            <div
              key={`${term}-${i}`}
              onClick={() => onSelectSearch(term)}
              className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-full liquid-pill text-xs font-medium text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] dark:hover:border-[#7C5CFF]/40 cursor-pointer group transition-colors"
            >
              <span>{term}</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onRemoveSearch(term);
                }}
                className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-rose-500 dark:text-[#777777] dark:hover:text-[#EF4444] rounded-full cursor-pointer"
                title="Remove search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

RecentSearchesSection.displayName = 'RecentSearchesSection';

// ==========================================
// 3. Memoized Search Filters Collapsible Panel
// ==========================================
interface SearchFiltersPanelProps {
  isOpen: boolean;
  filters: LawFilters;
  activeFiltersCount: number;
  onUpdateFilter: (key: keyof LawFilters, value: any) => void;
  onResetFilters: () => void;
  laws?: any[];
}

export const SearchFiltersPanel = memo<SearchFiltersPanelProps>(({
  isOpen,
  filters,
  activeFiltersCount,
  onUpdateFilter,
  onResetFilters,
  laws = []
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden p-4 sm:p-5 rounded-3xl liquid-glass-card space-y-4 dark:border-[#292929]"
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-[#222222]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#FFFFFF]">
              <Filter className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
              <span>Advanced Statutory Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="text-xs text-orange-600 dark:text-[#7C5CFF] hover:underline flex items-center gap-1.5 min-h-[44px] px-2.5 py-1 cursor-pointer font-semibold rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
            
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-[#B3B3B3]">
                Category
              </label>
              <select
                value={filters.category_id}
                onChange={e => onUpdateFilter('category_id', e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929] cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">All {CATEGORIES.length} Categories ({laws.length})</option>
                {CATEGORIES.map(cat => {
                  const catCount = laws.filter(l => l.category_id === cat.id).length;
                  return (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#151515] text-slate-900 dark:text-[#FFFFFF]">
                      {cat.name} ({catCount})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Bailable / Non-Bailable */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-[#B3B3B3]">
                Bail Status
              </label>
              <select
                value={filters.bailable}
                onChange={e => onUpdateFilter('bailable', e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929] cursor-pointer"
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
                onChange={e => onUpdateFilter('cognizable', e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929] cursor-pointer"
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
                onChange={e => onUpdateFilter('state', e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl liquid-pill text-xs text-slate-800 dark:text-[#FFFFFF] font-medium focus:outline-none dark:bg-[#151515] dark:border-[#292929] cursor-pointer"
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
  );
});

SearchFiltersPanel.displayName = 'SearchFiltersPanel';

// ==========================================
// 4. Memoized Penal Code Transitions (IPC -> BNS)
// ==========================================
interface PenalCodeTransitionsProps {
  onSelectTransition: (targetQuery: string) => void;
}

const TRANSITIONS = [
  { legacy: 'IPC 302 (Murder)', modern: 'Section 103 BNS' },
  { legacy: 'IPC 420 (Cheating)', modern: 'Section 318 BNS' },
  { legacy: 'IPC 378 (Theft)', modern: 'Section 303 BNS' },
  { legacy: 'IPC 354 (Molestation)', modern: 'Section 74 BNS' },
  { legacy: 'CrPC 154 (FIR)', modern: 'Section 173 BNSS' },
  { legacy: 'CrPC 436 (Bail)', modern: 'Section 478 BNSS' },
  { legacy: 'CrPC 438 (Anticipatory Bail)', modern: 'Section 482 BNSS' },
  { legacy: 'IPC 124A (Sedition)', modern: 'Section 152 BNS' },
];

export const PenalCodeTransitions = memo<PenalCodeTransitionsProps>(({
  onSelectTransition
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl liquid-glass-card space-y-3 dark:border-[#292929]">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
        <Scale className="w-4 h-4" />
        <span>Common Penal Code Transitions (Click to Search)</span>
      </div>
      <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
        The Indian Penal Code 1860 was replaced by Bharatiya Nyaya Sanhita 2023. Select any legacy provision to view its modern statutory section:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
        {TRANSITIONS.map((item) => (
          <button
            key={`${item.legacy}-${item.modern}`}
            onClick={() => onSelectTransition(item.modern)}
            className="min-h-[44px] p-3 rounded-xl liquid-pill text-left transition-all hover:border-orange-500/50 dark:hover:border-[#7C5CFF]/50 group cursor-pointer flex flex-col justify-center"
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
  );
});

PenalCodeTransitions.displayName = 'PenalCodeTransitions';

// ==========================================
// 5. Memoized Search Results Grid & Load More
// ==========================================
interface SearchResultsGridProps {
  displayedResults: LawItem[];
  totalCount: number;
  visibleCount: number;
  bookmarkSet: Set<string>;
  onLoadMore: () => void;
}

export const SearchResultsGrid = memo<SearchResultsGridProps>(({
  displayedResults,
  totalCount,
  visibleCount,
  bookmarkSet,
  onLoadMore
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {displayedResults.map((law) => (
          <div key={law.id} className="h-full flex flex-col">
            <LawCard law={law} isSaved={bookmarkSet.has(law.id)} className="h-full" />
          </div>
        ))}
      </div>

      {totalCount > visibleCount && (
        <div className="flex justify-center pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLoadMore}
            className="min-h-[44px] px-6 py-3 rounded-full liquid-pill text-xs sm:text-sm font-bold text-slate-800 dark:text-[#FFFFFF] hover:border-orange-500/40 dark:hover:border-[#7C5CFF]/40 transition-all cursor-pointer shadow-md flex items-center justify-center"
          >
            Load More Laws ({totalCount - visibleCount} remaining)
          </motion.button>
        </div>
      )}
    </div>
  );
});

SearchResultsGrid.displayName = 'SearchResultsGrid';

// ==========================================
// 6. Memoized Search Empty State
// ==========================================
interface SearchEmptyStateProps {
  query: string;
  onResetFilters: () => void;
  onConsultAI: () => void;
}

export const SearchEmptyState = memo<SearchEmptyStateProps>(({
  query,
  onResetFilters,
  onConsultAI
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-[#292929] space-y-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/15 dark:bg-[#F59E0B]/15 text-orange-400 dark:text-[#F59E0B] flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF]">
          No matching sections found for &ldquo;{query}&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] mt-1 max-w-md mx-auto">
          Try searching with broader terminology, checking section numerals, or checking the transition from old IPC/CrPC sections below.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onResetFilters}
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-white dark:bg-[#181818] hover:bg-slate-100 dark:hover:bg-[#202020] border border-slate-200 dark:border-[#292929] text-xs font-semibold text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center justify-center"
        >
          Reset Filters
        </button>
        <button
          onClick={onConsultAI}
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6b4ae0] text-white text-xs font-bold shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/30 transition-all cursor-pointer flex items-center justify-center"
        >
          Consult AI Assistant
        </button>
      </div>
    </div>
  );
});

SearchEmptyState.displayName = 'SearchEmptyState';
