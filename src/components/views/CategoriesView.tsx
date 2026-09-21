import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  FileText,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { useCategoriesQuery } from '../../api/legalQueries';
import { LawCard } from '../LawCard';
import { CourtHierarchyGuide } from '../legal/CourtHierarchyGuide';
import { LegalHelplines } from '../legal/LegalHelplines';
import { MOTION_SPRINGS } from '../../utils/motion';

export const CategoriesView: React.FC = () => {
  const { 
    laws, 
    selectedCategory, 
    setSelectedCategory,
    setShowAIAssistant,
    setAiInitialQuestion,
    bookmarks
  } = useApp();

  const { data: categories = CATEGORIES } = useCategoriesQuery();

  const [categorySearch, setCategorySearch] = useState('');
  const [showZeroMatches, setShowZeroMatches] = useState(true);

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const currentCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategory);
  }, [categories, selectedCategory]);

  // Helper to check if a law matches the search requirement
  const checkLawMatchesReq = (law: any, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      law.act_name.toLowerCase().includes(q) ||
      law.short_act.toLowerCase().includes(q) ||
      law.section_number.toLowerCase().includes(q) ||
      (law.section_title && law.section_title.toLowerCase().includes(q)) ||
      (law.simple_explanation && law.simple_explanation.toLowerCase().includes(q)) ||
      (law.official_text && law.official_text.toLowerCase().includes(q)) ||
      (law.keywords && law.keywords.some((k: string) => k.toLowerCase().includes(q))) ||
      (law.offences && law.offences.some((o: string) => o.toLowerCase().includes(q)))
    );
  };

  // Map category to matching laws count based on requirement
  const categoryMatchStats = useMemo(() => {
    const q = categorySearch.trim();
    const stats: Record<string, { count: number; totalInCat: number }> = {};
    categories.forEach(cat => {
      const lawsInCat = laws.filter(l => l.category_id === cat.id);
      const matching = q ? lawsInCat.filter(l => checkLawMatchesReq(l, q)) : lawsInCat;
      stats[cat.id] = {
        count: matching.length,
        totalInCat: lawsInCat.length
      };
    });
    return stats;
  }, [categories, laws, categorySearch]);

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(cat => {
      const catMatchesName = (
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        (cat.primary_acts && cat.primary_acts.some(a => a.toLowerCase().includes(q)))
      );
      const hasLawMatches = (categoryMatchStats[cat.id]?.count || 0) > 0;
      // If user toggles showZeroMatches, we can still show all or only matching
      if (!showZeroMatches) {
        return catMatchesName || hasLawMatches;
      }
      return true; // Show all categories with their respective count (0 if no law for requirement)
    });
  }, [categories, categorySearch, categoryMatchStats, showZeroMatches]);

  const categoryLaws = useMemo(() => {
    if (!selectedCategory) return [];
    const q = categorySearch.trim();
    const baseLaws = laws.filter(l => l.category_id === selectedCategory);
    if (!q) return baseLaws;
    return baseLaws.filter(l => checkLawMatchesReq(l, q));
  }, [laws, selectedCategory, categorySearch]);

  const totalLawsInSelectedCat = useMemo(() => {
    if (!selectedCategory) return 0;
    return laws.filter(l => l.category_id === selectedCategory).length;
  }, [laws, selectedCategory]);

  return (
    <div className="space-y-6 pb-12 view-blur-open">
      
      {/* If category is selected, show category details & its laws */}
      {selectedCategory && currentCategory ? (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-[#181818] dark:hover:bg-[#222222] dark:border-[#292929] dark:text-[#B3B3B3] dark:hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All {categories.length} Categories</span>
            </motion.button>

            {categorySearch && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Filter: <strong className="text-slate-800 dark:text-white">"{categorySearch}"</strong>
                </span>
                <button
                  onClick={() => setCategorySearch('')}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#222222] text-slate-500 dark:text-slate-400"
                  title="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Category Banner */}
          <div className="p-6 sm:p-8 rounded-3xl liquid-glass-card space-y-3 dark:border-[#292929]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/30 uppercase tracking-wide">
                Category
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                categoryLaws.length > 0 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
              }`}>
                {categoryLaws.length} {categoryLaws.length === 1 ? 'Law' : 'Laws'} {categorySearch ? 'Matching Requirement' : 'Available'}
              </span>
              {categorySearch && totalLawsInSelectedCat > categoryLaws.length && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  (out of {totalLawsInSelectedCat} total in category)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
              {currentCategory.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3B3B3] max-w-3xl leading-relaxed">
              {currentCategory.description}
            </p>

            {/* Primary Enactments / Acts */}
            {currentCategory.primary_acts && currentCategory.primary_acts.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-[#777777]">
                  Governing Acts:
                </span>
                {currentCategory.primary_acts.map((act, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-medium px-2.5 py-1 rounded-lg liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:bg-[#151515] dark:border-[#292929]"
                  >
                    {act}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Laws in this Category */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
                Key Sections & Provisions ({categoryLaws.length})
              </h2>

              <button
                onClick={() => {
                  setAiInitialQuestion(
                    categorySearch
                      ? `What are the Indian laws and provisions regarding "${categorySearch}" under ${currentCategory.name}?`
                      : `Give me a detailed overview of major provisions in ${currentCategory.name} in India.`
                  );
                  setShowAIAssistant(true);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI about {currentCategory.name}</span>
              </button>
            </div>

            {categoryLaws.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryLaws.map(law => (
                  <LawCard key={law.id} law={law} isSaved={bookmarkSet.has(law.id)} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-3xl liquid-glass-card space-y-3 dark:border-[#292929] border border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF]">
                  0 Laws Found in This Category
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#B3B3B3] max-w-md mx-auto leading-relaxed">
                  {categorySearch ? (
                    <>
                      No laws in <strong>{currentCategory.name}</strong> matched your requirement: <span className="font-semibold text-orange-600 dark:text-[#7C5CFF]">"{categorySearch}"</span>.
                    </>
                  ) : (
                    <>
                      There are currently 0 cataloged laws in this specific category in the primary reference index.
                    </>
                  )}
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch('')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#202020] text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Clear Search & View All in Category ({totalLawsInSelectedCat})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setAiInitialQuestion(`Are there specific Indian laws or sections governing "${categorySearch || currentCategory.name}"?`);
                      setShowAIAssistant(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 dark:bg-[#7C5CFF] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Search with AI Legal Assistant</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Categories Index Grid */
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
              <Layers className="w-4 h-4" />
              <span>Full Statutory Coverage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
              All {categories.length} Legal Categories
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3]">
              Browse Indian legislation organized into {categories.length} specialized domains. If there is no law in a category matching your requirement, it will explicitly display 0.
            </p>
          </div>

          {/* Search categories & requirement filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 dark:text-[#777777] absolute left-3.5 top-3" />
              <input
                type="text"
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                placeholder="Search requirement, keyword, or category name..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full liquid-pill text-xs sm:text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:outline-none focus:border-orange-500/50 dark:focus:border-[#7C5CFF]/60 transition-colors dark:bg-[#151515] dark:border-[#292929]"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {categorySearch && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowZeroMatches(prev => !prev)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium cursor-pointer ${
                    showZeroMatches 
                      ? 'bg-slate-200/80 dark:bg-[#222222] border-slate-300 dark:border-[#333333] text-slate-800 dark:text-white' 
                      : 'bg-transparent border-slate-300 dark:border-[#292929] text-slate-500 dark:text-[#888888]'
                  }`}
                >
                  {showZeroMatches ? 'Showing All (Including 0)' : 'Only Categories with Matches'}
                </button>
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(cat => {
              const stats = categoryMatchStats[cat.id] || { count: 0, totalInCat: 0 };
              const displayCount = stats.count;
              const hasZero = displayCount === 0;

              return (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -3, scale: 1.012 }}
                  whileTap={{ scale: 0.985 }}
                  transition={MOTION_SPRINGS.gentle}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-5 rounded-2xl liquid-glass-card cursor-pointer flex flex-col justify-between group dark:border-[#292929] ${
                    hasZero ? 'opacity-85 hover:opacity-100' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF] group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] transition-colors font-display">
                        {cat.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 font-mono border ${
                        hasZero
                          ? 'bg-slate-100 dark:bg-[#1f1f1f] text-slate-500 dark:text-slate-400 border-slate-300 dark:border-[#333333]'
                          : 'bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] border-orange-500/20 dark:border-[#7C5CFF]/30'
                      }`}>
                        {hasZero ? '0' : `${displayCount} Active`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#B3B3B3] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-[#222222] flex items-center justify-between text-xs font-semibold text-orange-600 dark:text-[#7C5CFF]">
                    <span className="text-[11px] text-slate-500 dark:text-[#777777] truncate max-w-[180px]">
                      {cat.primary_acts?.[0] || 'Central & State Acts'}
                    </span>
                    <div className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Fill empty space with Court Hierarchy & Statutory Framework Guide */}
          <div className="pt-6">
            <CourtHierarchyGuide />
          </div>

        </div>
      )}

    </div>
  );
};

