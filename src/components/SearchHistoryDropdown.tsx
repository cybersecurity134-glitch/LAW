import React, { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X, Trash2, ArrowUpRight, Sparkles, Search, Scale, Clock, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOTION_EASINGS } from '../utils/motion';
import { SearchHistoryItem } from '../types';

interface SearchHistoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuery: string;
  onSelectTerm: (term: string) => void;
  onSelectLaw?: (lawId: string) => void;
  className?: string;
  popularSuggestions?: string[];
}

const DEFAULT_POPULAR = [
  'Section 66D',
  'Drunk driving',
  'Section 103 BNS',
  'Cheque bounce',
  'Online UPI fraud',
  'Zero FIR',
  'Defective product',
  'Consumer court'
];

function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) return 'Recent';
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = memo(({
  isOpen,
  onClose,
  currentQuery,
  onSelectTerm,
  onSelectLaw,
  className = '',
  popularSuggestions = DEFAULT_POPULAR
}) => {
  const { searchHistory, removeRecentSearch, clearRecentSearches, openLawDetail } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'term' | 'law'>('all');

  const normalizedQuery = useMemo(() => currentQuery.trim().toLowerCase(), [currentQuery]);

  // Filter searches by query and type
  const filteredHistory = useMemo(() => {
    return searchHistory.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      if (!matchesType) return false;
      if (!normalizedQuery) return true;
      return (
        item.query.toLowerCase().includes(normalizedQuery) ||
        (item.act_name && item.act_name.toLowerCase().includes(normalizedQuery)) ||
        (item.section_number && item.section_number.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [searchHistory, normalizedQuery, filterType]);

  const hasHistory = searchHistory.length > 0;
  const termsCount = useMemo(() => searchHistory.filter(i => i.type === 'term').length, [searchHistory]);
  const lawsCount = useMemo(() => searchHistory.filter(i => i.type === 'law').length, [searchHistory]);

  if (!isOpen) {
    return null;
  }

  // Highlight matching text helper
  const renderHighlighted = (text: string) => {
    if (!normalizedQuery) return text;
    const idx = text.toLowerCase().indexOf(normalizedQuery);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-orange-600 dark:text-[#7C5CFF] font-bold underline decoration-orange-500/40 dark:decoration-[#7C5CFF]/40">
          {text.slice(idx, idx + normalizedQuery.length)}
        </span>
        {text.slice(idx + normalizedQuery.length)}
      </>
    );
  };

  const handleItemClick = (item: SearchHistoryItem) => {
    if (item.type === 'law' && item.law_id) {
      if (onSelectLaw) {
        onSelectLaw(item.law_id);
      } else {
        openLawDetail(item.law_id);
      }
    } else {
      onSelectTerm(item.query);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        id="search-history-dropdown"
        initial={{ opacity: 0, scale: 0.98, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -6 }}
        transition={{ duration: 0.18, ease: MOTION_EASINGS.appleDecel }}
        onMouseDown={e => {
          // Prevent search input from losing focus prematurely when clicking inside the dropdown
          e.stopPropagation();
        }}
        className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-[#292929] bg-white/95 dark:bg-[#121212] backdrop-blur-3xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.85)] dark:shadow-none ${className}`}
      >
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-200/80 dark:border-[#222222] bg-slate-50/70 dark:bg-[#181818]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
              <History className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#FFFFFF]">
              Search History
            </span>
            {hasHistory && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-[#151515] dark:border dark:border-[#292929] text-slate-600 dark:text-[#B3B3B3] font-mono">
                {searchHistory.length}
              </span>
            )}
          </div>

          {/* Type filter tabs */}
          {hasHistory && (
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-[#202020] p-0.5 rounded-full text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-[#121212] text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({searchHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('term')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  filterType === 'term'
                    ? 'bg-white dark:bg-[#121212] text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Terms ({termsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('law')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  filterType === 'law'
                    ? 'bg-white dark:bg-[#121212] text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Laws ({lawsCount})
              </button>
            </div>
          )}

          {hasHistory && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                clearRecentSearches();
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:text-[#777777] dark:hover:text-[#EF4444] flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-500/10 dark:hover:bg-[#EF4444]/10"
              title="Clear all saved search history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </motion.button>
          )}
        </div>

        {/* Main List of Recent Searches */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-[#222222] scrollbar-thin">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => {
              const isLaw = item.type === 'law';

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-orange-500/10 dark:hover:bg-[#181818] group cursor-pointer transition-colors"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      isLaw
                        ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 group-hover:bg-emerald-500/25'
                        : 'bg-slate-100 dark:bg-[#181818] dark:border dark:border-[#292929] text-slate-500 dark:text-[#777777] group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] group-hover:bg-orange-500/20 dark:group-hover:bg-[#7C5CFF]/15'
                    }`}>
                      {isLaw ? <Scale className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-[#FFFFFF] truncate group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] transition-colors">
                          {renderHighlighted(item.query)}
                        </span>
                        {isLaw && (
                          <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Law
                          </span>
                        )}
                        {item.result_count !== undefined && item.result_count > 0 && (
                          <span className="hidden sm:inline-flex shrink-0 text-[10px] text-slate-400 dark:text-[#666666]">
                            {item.result_count} {item.result_count === 1 ? 'result' : 'results'}
                          </span>
                        )}
                      </div>

                      {isLaw && item.act_name && (
                        <p className="text-[10px] text-slate-400 dark:text-[#777777] truncate">
                          {item.act_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium text-slate-400 dark:text-[#666666] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatRelativeTime(item.timestamp)}</span>
                    </span>

                    <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-slate-400 group-hover:text-orange-500/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-3 h-3" />
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.88 }}
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeRecentSearch(item.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-[#EF4444] hover:bg-rose-500/15 transition-all cursor-pointer"
                      title="Remove from history"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          ) : hasHistory ? (
            // When user is typing a query that doesn't match any recent searches
            <div className="p-4 text-center space-y-1">
              <p className="text-xs text-slate-500 dark:text-[#B3B3B3]">
                No recent searches matching &ldquo;{currentQuery}&rdquo; {filterType !== 'all' && `in ${filterType}s`}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-[#777777]">
                Press Enter or click Search to look up this law
              </p>
            </div>
          ) : (
            // When recent searches array is empty in local storage
            <div className="p-5 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#181818] text-slate-400 dark:text-[#777777] mx-auto flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-[#FFFFFF]">
                No recent searches yet
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#777777] max-w-xs mx-auto">
                Your queried legal terms and statutes will be safely saved in local storage for instant re-access.
              </p>
            </div>
          )}
        </div>

        {/* Suggested / Popular Quick Access Footer */}
        {popularSuggestions && popularSuggestions.length > 0 && (
          <div className="p-3.5 bg-slate-50/90 dark:bg-[#151515] border-t border-slate-200/80 dark:border-[#222222] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-[#777777] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-orange-500 dark:text-[#7C5CFF]" />
              <span>Popular Legal Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularSuggestions.slice(0, 6).map((pop) => (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  key={pop}
                  type="button"
                  onClick={() => {
                    onSelectTerm(pop);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#181818] text-slate-700 dark:text-[#B3B3B3] border border-slate-200/80 dark:border-[#292929] hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-[#7C5CFF] dark:hover:border-[#7C5CFF]/40 hover:bg-orange-500/10 transition-all cursor-pointer shadow-2xs"
                >
                  {pop}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

SearchHistoryDropdown.displayName = 'SearchHistoryDropdown';
