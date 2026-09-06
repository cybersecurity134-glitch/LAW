import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Filter, 
  Bookmark, 
  Sparkles, 
  Scale, 
  Clock, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Shield, 
  Layers, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  Info,
  Calendar,
  Check,
  PanelLeft,
  PanelLeftClose,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { INDIAN_STATES } from '../../data/laws';
import { LawItem } from '../../types';
import { MOTION_EASINGS, MOTION_SPRINGS } from '../../utils/motion';

interface TabletLayoutProps {
  isTabletLandscape: boolean; // 900px - 1199px
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({ isTabletLandscape }) => {
  const { 
    laws, 
    selectedLaw, 
    setSelectedLaw, 
    bookmarks, 
    toggleBookmark, 
    isBookmarked,
    setShowAIAssistant,
    setAiInitialQuestion,
    filters,
    setFilters,
    activeTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [selectedCatId, setSelectedCatId] = useState<string>(filters.category_id || 'all');
  const [bailFilter, setBailFilter] = useState<'all' | 'bailable' | 'non-bailable'>(filters.bailable || 'all');
  const [cognizableFilter, setCognizableFilter] = useState<'all' | 'cognizable' | 'non-cognizable'>(filters.cognizable || 'all');
  const [stateFilter, setStateFilter] = useState<string>(filters.state || 'all');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(activeTab === 'saved');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Landscape sidebar toggle (iPadOS style)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Portrait filter sheet modal
  const [isPortraitFilterSheetOpen, setIsPortraitFilterSheetOpen] = useState(false);

  // Detail container ref to smoothly scroll to top on law selection change
  const detailContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize if activeTab changes to 'saved'
  useEffect(() => {
    if (activeTab === 'saved') {
      setShowSavedOnly(true);
    }
  }, [activeTab]);

  // Sync search query and filters with global state
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      query: searchQuery,
      category_id: selectedCatId,
      bailable: bailFilter,
      cognizable: cognizableFilter,
      state: stateFilter
    }));
  }, [searchQuery, selectedCatId, bailFilter, cognizableFilter, stateFilter, setFilters]);

  // Compute filtered laws
  const filteredLaws = useMemo(() => {
    let list = [...laws];

    if (showSavedOnly) {
      list = list.filter(l => bookmarks.includes(l.id));
    }

    if (selectedCatId && selectedCatId !== 'all') {
      list = list.filter(l => l.category_id === selectedCatId);
    }

    if (stateFilter && stateFilter !== 'all') {
      list = list.filter(l => l.state_applicability === 'All India' || l.state_applicability.includes(stateFilter));
    }

    if (bailFilter !== 'all') {
      if (bailFilter === 'bailable') list = list.filter(l => l.is_bailable === true);
      if (bailFilter === 'non-bailable') list = list.filter(l => l.is_bailable === false);
    }

    if (cognizableFilter !== 'all') {
      if (cognizableFilter === 'cognizable') list = list.filter(l => l.is_cognizable === true);
      if (cognizableFilter === 'non-cognizable') list = list.filter(l => l.is_cognizable === false);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(l => {
        return (
          l.section_number.toLowerCase().includes(q) ||
          l.section_title.toLowerCase().includes(q) ||
          l.act_name.toLowerCase().includes(q) ||
          (l.short_act && l.short_act.toLowerCase().includes(q)) ||
          l.keywords.some(k => k.toLowerCase().includes(q)) ||
          l.simple_explanation.toLowerCase().includes(q) ||
          l.punishment.toLowerCase().includes(q) ||
          l.fine.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [laws, selectedCatId, stateFilter, bailFilter, cognizableFilter, searchQuery, showSavedOnly, bookmarks]);

  // Always maintain an active law selection when laws exist
  useEffect(() => {
    if (filteredLaws.length > 0) {
      if (!selectedLaw || !filteredLaws.some(l => l.id === selectedLaw.id)) {
        setSelectedLaw(filteredLaws[0]);
      }
    }
  }, [filteredLaws, selectedLaw, setSelectedLaw]);

  // Smoothly scroll detail pane to top whenever active law changes
  useEffect(() => {
    if (detailContainerRef.current) {
      detailContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedLaw?.id]);

  const activeLaw = selectedLaw || (filteredLaws.length > 0 ? filteredLaws[0] : null);

  const handleShare = async (law: LawItem) => {
    const shareText = `⚖️ ${law.act_name} - ${law.section_number}: ${law.section_title}\n\nPunishment: ${law.punishment}\nFine: ${law.fine}\n\nRead on NyayaSetu: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${law.section_number}: ${law.section_title}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled share
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCatId('all');
    setBailFilter('all');
    setCognizableFilter('all');
    setStateFilter('all');
    setShowSavedOnly(false);
  };

  const activeFilterCount = 
    (selectedCatId !== 'all' ? 1 : 0) +
    (bailFilter !== 'all' ? 1 : 0) +
    (cognizableFilter !== 'all' ? 1 : 0) +
    (stateFilter !== 'all' ? 1 : 0) +
    (showSavedOnly ? 1 : 0);

  // Common Filter Content Component (rendered in Landscape Sidebar & Portrait Modal Sheet)
  const renderFilterControls = (isSheet: boolean = false) => (
    <div className="space-y-4">
      {/* Saved Filter Switch */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
          Saved Bookmarks
        </label>
        <button
          onClick={() => setShowSavedOnly(prev => !prev)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            showSavedOnly
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-xs'
              : 'bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#262626] text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
            <span>Only Saved Laws</span>
          </div>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-[#222222] border border-black/5 dark:border-white/5">
            {bookmarks.length}
          </span>
        </button>
      </div>

      {/* Bail Filter */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
          Bail Classification
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100/90 dark:bg-[#161616] p-1 rounded-xl border border-slate-200/80 dark:border-[#262626] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
          {(['all', 'bailable', 'non-bailable'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setBailFilter(mode)}
              className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize cursor-pointer text-center truncate ${
                bailFilter === mode
                  ? 'bg-white dark:bg-[#252525] text-orange-600 dark:text-[#7C5CFF] shadow-xs ring-1 ring-black/5 dark:ring-white/10 font-bold'
                  : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode === 'non-bailable' ? 'Non-Bail' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Arrest Power Classification */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
          Police Arrest Power
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100/90 dark:bg-[#161616] p-1 rounded-xl border border-slate-200/80 dark:border-[#262626] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
          {(['all', 'cognizable', 'non-cognizable'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setCognizableFilter(mode)}
              className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize cursor-pointer text-center truncate ${
                cognizableFilter === mode
                  ? 'bg-white dark:bg-[#252525] text-orange-600 dark:text-[#7C5CFF] shadow-xs ring-1 ring-black/5 dark:ring-white/10 font-bold'
                  : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode === 'non-cognizable' ? 'Non-Cog' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* State Applicability */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
          State Jurisdiction
        </label>
        <select
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
          className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#262626] text-slate-800 dark:text-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-[#7C5CFF]/40 cursor-pointer shadow-xs"
        >
          <option value="all">All India & Central Acts</option>
          {INDIAN_STATES.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Categories List */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-[#222222]">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777] mb-1">
          <span>Categories</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-[#222222]">
            {CATEGORIES.length}
          </span>
        </div>

        <button
          onClick={() => {
            setSelectedCatId('all');
            if (isSheet) setIsPortraitFilterSheetOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
            selectedCatId === 'all'
              ? 'bg-orange-500/15 dark:bg-[#7C5CFF]/20 text-orange-600 dark:text-[#a78bfa] border border-orange-500/30 dark:border-[#7C5CFF]/30 font-bold shadow-xs'
              : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-slate-100 dark:hover:bg-[#181818]'
          }`}
        >
          <span>All Legal Categories</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-[#222222]">
            {laws.length}
          </span>
        </button>

        {CATEGORIES.map(cat => {
          const count = laws.filter(l => l.category_id === cat.id).length;
          const isSelected = selectedCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                if (isSheet) setIsPortraitFilterSheetOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-orange-500/15 dark:bg-[#7C5CFF]/20 text-orange-600 dark:text-[#a78bfa] border border-orange-500/30 dark:border-[#7C5CFF]/30 font-bold shadow-xs'
                  : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-slate-100 dark:hover:bg-[#181818]'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-[#222222] shrink-0">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 h-[calc(100vh-4rem)] overflow-hidden bg-slate-100/70 dark:bg-[#070707]">
      
      {/* Main Balanced Split-View Container */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden divide-x divide-slate-200/80 dark:divide-[#222222]">
        
        {/* ==================================================================== */}
        {/* COLUMN 1 (Landscape only): Categories & Filters Sidebar              */}
        {/* Balanced: 220px on compact landscape / 240px on full landscape        */}
        {/* Collapsible via iPadOS-style toggle button in List Header            */}
        {/* ==================================================================== */}
        {isTabletLandscape && isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isTabletLandscape ? (window.innerWidth >= 1024 ? 240 : 220) : 0, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: MOTION_EASINGS.appleDecel }}
            className="shrink-0 flex flex-col min-h-0 bg-white/90 dark:bg-[#0D0D0D]/95 backdrop-blur-2xl overflow-hidden border-r border-slate-200/80 dark:border-[#222222] z-10"
          >
            {/* Sidebar Frosted Header */}
            <div className="px-4 py-3.5 border-b border-slate-200/80 dark:border-[#222222] flex items-center justify-between bg-slate-50/50 dark:bg-[#111111]/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Categories & Filters
                </span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
              {renderFilterControls(false)}
            </div>
          </motion.aside>
        )}

        {/* ==================================================================== */}
        {/* COLUMN 2: Master List (Search & Laws Stream)                          */}
        {/* Balanced Grid Proportions:                                           */}
        {/* - Landscape: 300px–330px when sidebar open, 350px when collapsed     */}
        {/* - Portrait: exactly 38% (min 260px, max 340px) leaving 62% for detail*/}
        {/* ==================================================================== */}
        <section 
          className={`flex flex-col min-h-0 bg-white dark:bg-[#101010] overflow-hidden border-r border-slate-200/80 dark:border-[#222222] shrink-0 ${
            isTabletLandscape 
              ? isSidebarOpen 
                ? 'w-[300px] lg:w-[325px]' 
                : 'w-[340px] lg:w-[360px]' 
              : 'w-[38%] min-w-[260px] max-w-[340px]'
          }`}
        >
          {/* List Pane Header: Search Bar, Sidebar Toggle & Quick Category Pills */}
          <div className="p-3 sm:p-3.5 border-b border-slate-200/80 dark:border-[#222222] space-y-2.5 bg-slate-50/80 dark:bg-[#121212]/90 backdrop-blur-2xl">
            
            {/* Top Row: Search Input + Toggle / Filter Button */}
            <div className="flex items-center gap-2">
              {/* Landscape Sidebar Collapse / Expand Toggle Button */}
              {isTabletLandscape && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSidebarOpen 
                      ? 'bg-orange-500/10 dark:bg-[#7C5CFF]/15 border-orange-500/25 dark:border-[#7C5CFF]/30 text-orange-600 dark:text-[#7C5CFF]' 
                      : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#292929] text-slate-600 dark:text-[#999999] hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isSidebarOpen ? "Hide sidebar for wide reader view" : "Show categories and filter sidebar"}
                >
                  {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                </motion.button>
              )}

              {/* Portrait Filter Drawer Trigger */}
              {!isTabletLandscape && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setIsPortraitFilterSheetOpen(true)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 relative ${
                    activeFilterCount > 0 
                      ? 'bg-orange-500/15 dark:bg-[#7C5CFF]/20 border-orange-500/30 dark:border-[#7C5CFF]/40 text-orange-600 dark:text-[#7C5CFF]' 
                      : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#292929] text-slate-600 dark:text-[#999999]'
                  }`}
                  title="Open full categories & filter options"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </motion.button>
              )}

              {/* Search Bar with iOS 26 refinement */}
              <div className="relative flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#777777] absolute left-3 top-3 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search section, offense, fine..."
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2D2D2D] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#777777] focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-[#7C5CFF]/60 shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Horizontal Filter Pills for Portrait Tablet Mode */}
            {!isTabletLandscape && (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedCatId('all')}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      selectedCatId === 'all'
                        ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white shadow-xs'
                        : 'bg-slate-200/80 dark:bg-[#202020] text-slate-700 dark:text-[#B3B3B3]'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.slice(0, 7).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer truncate max-w-[120px] ${
                        selectedCatId === cat.id
                          ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white font-bold shadow-xs'
                          : 'bg-slate-200/80 dark:bg-[#202020] text-slate-700 dark:text-[#B3B3B3]'
                      }`}
                    >
                      {cat.name.split('&')[0]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#777777] px-0.5">
                  <div className="flex items-center gap-1">
                    {(['all', 'bailable', 'non-bailable'] as const).map(b => (
                      <button
                        key={b}
                        onClick={() => setBailFilter(b)}
                        className={`px-1.5 py-0.5 rounded-md font-semibold text-[10px] capitalize cursor-pointer ${
                          bailFilter === b
                            ? 'bg-orange-500/20 text-orange-600 dark:bg-[#7C5CFF]/25 dark:text-[#a78bfa] font-bold'
                            : 'hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {b === 'non-bailable' ? 'Non-Bail' : b}
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {filteredLaws.length} found
                  </span>
                </div>
              </div>
            )}

            {/* Results Count Bar for Landscape Mode */}
            {isTabletLandscape && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#777777] px-1">
                <span>
                  Showing <strong className="text-slate-900 dark:text-white">{filteredLaws.length}</strong> laws
                </span>
                {selectedCatId !== 'all' && (
                  <span className="truncate max-w-[140px] font-semibold text-orange-600 dark:text-[#7C5CFF]">
                    {CATEGORIES.find(c => c.id === selectedCatId)?.name}
                  </span>
                )}
              </div>
            )}

          </div>

          {/* Laws List Scroll Area with iOS 26 Inset Cards */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1.5 scrollbar-thin">
            {filteredLaws.length === 0 ? (
              <div className="p-6 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white font-display">
                  No laws matched
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#777777] leading-relaxed">
                  Try clearing your filters or search with another legal phrase.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-1 px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredLaws.map(law => {
                const isSelected = activeLaw?.id === law.id;
                const bookmarked = isBookmarked(law.id);

                return (
                  <motion.div
                    key={law.id}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedLaw(law)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 relative border ${
                      isSelected
                        ? 'bg-orange-500/10 dark:bg-[#7C5CFF]/15 border-orange-500/40 dark:border-[#7C5CFF]/50 shadow-[0_4px_16px_rgba(249,115,22,0.1)] dark:shadow-[0_4px_16px_rgba(124,92,255,0.15)] ring-1 ring-orange-500/20 dark:ring-[#7C5CFF]/20'
                        : 'bg-white dark:bg-[#141414] border-slate-200/80 dark:border-[#222222] hover:bg-slate-50/90 dark:hover:bg-[#181818]'
                    }`}
                  >
                    {/* iOS 26 Active Pill Accent Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-r-full bg-gradient-to-b from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#9B82FF] shadow-[0_0_8px_rgba(124,92,255,0.6)]" />
                    )}

                    <div className="flex items-start justify-between gap-1.5">
                      <div className="space-y-1 min-w-0 flex-1">
                        {/* Section Number and Act Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-orange-500 text-white dark:bg-[#7C5CFF] shadow-xs'
                              : 'bg-slate-100 dark:bg-[#202020] text-slate-900 dark:text-white border border-slate-200 dark:border-[#303030]'
                          }`}>
                            {law.section_number}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-[#888888] truncate max-w-[130px]">
                            {law.short_act || law.act_name}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug font-display">
                          {law.section_title}
                        </h4>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleBookmark(law.id);
                        }}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                          bookmarked
                            ? 'text-amber-500 bg-amber-500/10'
                            : 'text-slate-400 dark:text-[#666666] hover:text-slate-700 dark:hover:text-white'
                        }`}
                        title={bookmarked ? 'Remove bookmark' : 'Bookmark law'}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Summary Snippet */}
                    <p className="text-[11px] text-slate-600 dark:text-[#999999] line-clamp-2 mt-1 leading-relaxed">
                      {law.simple_explanation}
                    </p>

                    {/* Footer Status Badges */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100 dark:border-[#1E1E1E] text-[10px]">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded-md font-bold ${
                          law.is_bailable
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#22C55E]'
                            : 'bg-rose-500/10 text-rose-700 dark:text-[#EF4444]'
                        }`}>
                          {law.is_bailable ? 'Bailable' : 'Non-Bail'}
                        </span>
                        {law.punishment && (
                          <span className="text-slate-500 dark:text-[#777777] truncate max-w-[90px]">
                            {law.punishment}
                          </span>
                        )}
                      </div>

                      <span className="text-orange-600 dark:text-[#7C5CFF] font-bold flex items-center gap-0.5 shrink-0">
                        <span>Read</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>

        </section>

        {/* ==================================================================== */}
        {/* COLUMN 3: Detail Reader (Comprehensive Legal Document View)           */}
        {/* Takes all remaining space (50%-65% of screen width) for pristine      */}
        {/* legibility, spacious padding, and high-contrast typography            */}
        {/* ==================================================================== */}
        <main className="flex-1 flex flex-col min-h-0 bg-slate-50/70 dark:bg-[#080808] overflow-hidden">
          {activeLaw ? (
            <div 
              ref={detailContainerRef}
              className="tablet-typography-wrapper flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-thin"
            >
              
              {/* Sticky Top Control Header (iOS 26 Liquid Frosted Header) */}
              <div className="sticky top-0 z-20 bg-white/85 dark:bg-[#0E0E0E]/90 backdrop-blur-2xl px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-[#222222] shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Left Badges: Section & Legal Classification */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs sm:text-sm font-extrabold px-3 py-1 rounded-xl bg-orange-500 dark:bg-[#7C5CFF] text-white shadow-xs tablet-badge">
                      {activeLaw.section_number}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#1C1C1C] text-slate-800 dark:text-[#DDDDDD] border border-slate-200 dark:border-[#2A2A2A] tablet-badge">
                      {activeLaw.act_name}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border tablet-badge ${
                      activeLaw.is_bailable
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#22C55E] border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-700 dark:text-[#EF4444] border-rose-500/20'
                    }`}>
                      {activeLaw.is_bailable ? 'Bailable Offence' : 'Non-Bailable Offence'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 dark:bg-[#181818] text-slate-600 dark:text-[#999999] tablet-badge">
                      {activeLaw.is_cognizable ? 'Cognizable' : 'Non-Cognizable'}
                    </span>
                  </div>

                  {/* Right Actions: Ask AI, Bookmark, Share, Official Source */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAiInitialQuestion(`Explain ${activeLaw.section_number} of ${activeLaw.act_name} (${activeLaw.section_title}) in simple citizen language with practical everyday examples.`);
                        setShowAIAssistant(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#9B82FF] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                      title="Ask AI Guide about this section"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleBookmark(activeLaw.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isBookmarked(activeLaw.id)
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={isBookmarked(activeLaw.id) ? 'Bookmarked' : 'Save bookmark'}
                    >
                      <Bookmark className="w-4 h-4" fill={isBookmarked(activeLaw.id) ? 'currentColor' : 'none'} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleShare(activeLaw)}
                      className="p-2 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                      title="Share section"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                    </motion.button>

                    {activeLaw.source_url && (
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        href={activeLaw.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1C1C1C] dark:hover:bg-[#252525] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-[#CCCCCC] text-xs font-semibold transition-colors"
                        title="View Official Government Source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </motion.a>
                    )}
                  </div>

                </div>

                {/* Section Title with Responsive Fluid Typography */}
                <h2 className="tablet-section-title font-extrabold text-slate-900 dark:text-white font-display mt-3 leading-snug">
                  {activeLaw.section_title}
                </h2>
              </div>

              {/* Detail Content Stream with iOS 26 Liquid Cards */}
              <div className="p-5 sm:p-6 space-y-5 max-w-4xl">
                
                {/* 1. Fine & Punishment Section - Visually Prominent Dual-Column Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Imprisonment */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-[#EF4444]/10 border border-rose-500/20 dark:border-[#EF4444]/25 space-y-1.5 shadow-xs">
                    <div className="tablet-stat-label flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-[#EF4444]">
                      <Clock className="w-4 h-4" />
                      <span>Imprisonment & Penalty</span>
                    </div>
                    <div className="tablet-stat-value font-bold text-slate-900 dark:text-white font-display">
                      {activeLaw.punishment}
                    </div>
                    {activeLaw.imprisonment && (
                      <p className="tablet-stat-note text-slate-600 dark:text-[#B3B3B3]">
                        Statutory Term: <strong>{activeLaw.imprisonment}</strong>
                      </p>
                    )}
                  </div>

                  {/* Fine Amount */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-[#F59E0B]/10 border border-amber-500/20 dark:border-[#F59E0B]/25 space-y-1.5 shadow-xs">
                    <div className="tablet-stat-label flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-[#F59E0B]">
                      <Coins className="w-4 h-4" />
                      <span>Fine Amount</span>
                    </div>
                    <div className="tablet-stat-value font-bold text-slate-900 dark:text-white font-display">
                      {activeLaw.fine || 'Court Discretion'}
                    </div>
                    <p className="tablet-stat-note text-slate-600 dark:text-[#B3B3B3]">
                      Subject to judicial statutory sentencing guidelines
                    </p>
                  </div>

                </div>

                {/* 2. What is this law? Plain Citizen Summary with iOS Glass Panel */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] shadow-xs space-y-3">
                  <div className="tablet-card-title flex items-center gap-2 font-bold text-slate-900 dark:text-white font-display">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
                      <Info className="w-4 h-4" />
                    </div>
                    <span>What is this Law? (Citizen Summary)</span>
                  </div>

                  <p className="tablet-body-lead text-slate-800 dark:text-[#E0E0E0] leading-relaxed font-normal">
                    {activeLaw.simple_explanation}
                  </p>

                  {activeLaw.detailed_explanation && (
                    <div className="tablet-body-secondary pt-3 border-t border-slate-100 dark:border-[#1E1E1E] text-slate-600 dark:text-[#A0A0A0] leading-relaxed">
                      <strong className="text-slate-900 dark:text-white block mb-1">Legal Analysis:</strong>
                      {activeLaw.detailed_explanation}
                    </div>
                  )}
                </div>

                {/* 3. Causes & Triggers (Actions Covered) */}
                {activeLaw.actions_covered && activeLaw.actions_covered.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] shadow-xs space-y-3">
                    <div className="tablet-card-title flex items-center gap-2 font-bold text-slate-900 dark:text-white font-display">
                      <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-[#EF4444]/15 text-rose-600 dark:text-[#EF4444]">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span>Causes & What Triggers This Law (Actions Covered)</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {activeLaw.actions_covered.map((action, idx) => (
                        <div
                          key={idx}
                          className="tablet-list-item-text flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#262626] text-slate-800 dark:text-[#EAEAEA]"
                        >
                          <span className="w-5 h-5 rounded-full bg-rose-500/15 dark:bg-[#EF4444]/20 text-rose-700 dark:text-[#EF4444] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Important Exceptions & Defenses */}
                {activeLaw.exceptions && activeLaw.exceptions.length > 0 && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] shadow-xs space-y-3">
                    <div className="tablet-card-title flex items-center gap-2 font-bold text-slate-900 dark:text-white font-display">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-[#22C55E]/15 text-emerald-600 dark:text-[#22C55E]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span>Important Exceptions & Defenses</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {activeLaw.exceptions.map((exc, idx) => (
                        <div
                          key={idx}
                          className="tablet-list-item-text flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 dark:bg-[#22C55E]/10 border border-emerald-500/20 dark:border-[#22C55E]/20 text-slate-800 dark:text-[#FFFFFF]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#22C55E] shrink-0 mt-0.5" />
                          <span>{exc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Official Bare Act Legal Text */}
                {activeLaw.official_text && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] shadow-xs space-y-3">
                    <div className="tablet-card-title flex items-center gap-2 font-bold text-slate-900 dark:text-white font-display">
                      <div className="p-1.5 rounded-lg bg-slate-500/10 dark:bg-[#222222] text-slate-700 dark:text-[#CCCCCC]">
                        <Scale className="w-4 h-4" />
                      </div>
                      <span>Official Statutory Text (India Code Bare Act)</span>
                    </div>

                    <div className="tablet-official-text p-4 rounded-xl bg-slate-950 text-slate-100 font-mono leading-relaxed border border-slate-800 shadow-inner overflow-x-auto whitespace-pre-wrap break-words">
                      <div className="text-[10px] uppercase font-bold text-orange-400 dark:text-[#a78bfa] tracking-wider mb-2 flex items-center justify-between">
                        <span>Authentic Bare Act Language</span>
                        <span>Official Gazette</span>
                      </div>
                      {activeLaw.official_text}
                    </div>
                  </div>
                )}

                {/* 6. Authoritative Source & Verification Info */}
                <div className="tablet-source-info p-4 rounded-2xl bg-slate-100/90 dark:bg-[#141414] border border-slate-200 dark:border-[#252525] text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 dark:text-[#B3B3B3]">
                      Authoritative Legal Source:
                    </span>
                    <a
                      href={activeLaw.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline"
                    >
                      <span>{activeLaw.source}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-[#222222] text-[11px] text-slate-500 dark:text-[#777777]">
                    <div>Effective Date: <strong className="text-slate-900 dark:text-white">{activeLaw.effective_date}</strong></div>
                    <div>Last Verified: <strong className="text-slate-900 dark:text-white">{activeLaw.last_updated}</strong></div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="tablet-typography-wrapper flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <div className="w-14 h-14 rounded-3xl bg-slate-200/50 dark:bg-[#1A1A1A] flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                <Scale className="w-7 h-7 text-slate-400 dark:text-[#555555]" />
              </div>
              <div className="text-base font-bold text-slate-800 dark:text-white font-display">
                Select a law to read
              </div>
              <p className="tablet-body-secondary text-xs text-slate-500 dark:text-[#777777] mt-1 max-w-xs leading-relaxed">
                Choose any section on the left to read its full legal explanation, fines, penalties, and exceptions.
              </p>
            </div>
          )}
        </main>

      </div>

      {/* ==================================================================== */}
      {/* PORTRAIT FILTER MODAL SHEET (iOS 26 Liquid Glass Modal)             */}
      {/* Accessible from the Filter button on Tablet Portrait (600px - 899px)  */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isPortraitFilterSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: MOTION_EASINGS.appleDecel }}
              className="w-full max-w-md max-h-[85vh] flex flex-col bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-[#292929] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between bg-slate-50/70 dark:bg-[#161616]/70 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Filter & Categories
                  </h3>
                </div>
                <button
                  onClick={() => setIsPortraitFilterSheetOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                {renderFilterControls(true)}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-200 dark:border-[#222222] flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#141414]/50">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#2A2A2A] text-xs font-semibold text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsPortraitFilterSheetOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-orange-500 dark:bg-[#7C5CFF] text-white text-xs font-bold shadow-xs cursor-pointer text-center"
                >
                  Apply & View {filteredLaws.length} Laws
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

