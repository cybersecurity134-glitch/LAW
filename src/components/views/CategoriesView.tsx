import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
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
    setAiInitialQuestion
  } = useApp();

  const [categorySearch, setCategorySearch] = useState('');

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  const filteredCategories = CATEGORIES.filter(cat => {
    return (
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      cat.description.toLowerCase().includes(categorySearch.toLowerCase()) ||
      (cat.primary_acts && cat.primary_acts.some(a => a.toLowerCase().includes(categorySearch.toLowerCase())))
    );
  });

  const categoryLaws = laws.filter(l => l.category_id === selectedCategory);

  return (
    <div className="space-y-6 pb-12 view-blur-open">
      
      {/* If category is selected, show category details & its laws */}
      {selectedCategory && currentCategory ? (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-[#181818] dark:hover:bg-[#222222] dark:border-[#292929] dark:text-[#B3B3B3] dark:hover:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All 22 Categories</span>
            </motion.button>
          </div>

          {/* Category Banner */}
          <div className="p-6 sm:p-8 rounded-3xl liquid-glass-card space-y-3 dark:border-[#292929]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/30 uppercase tracking-wide">
                Category
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-[#777777]">
                {categoryLaws.length} Active Database Sections
              </span>
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
                  setAiInitialQuestion(`Give me a detailed overview of major provisions in ${currentCategory.name} in India.`);
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
                  <LawCard key={law.id} law={law} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-3xl liquid-glass-card space-y-2 dark:border-[#292929]">
                <FileText className="w-8 h-8 text-slate-500 dark:text-[#777777] mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF]">
                  Sections being synchronized
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
                  You can consult our AI Legal Assistant for instant explanations of any specific section in this category.
                </p>
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
              All 22 Legal Categories
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3]">
              Browse Indian legislation organized into 22 specialized domains, from criminal and traffic laws to cybersecurity, consumer rights, and constitutional mandates.
            </p>
          </div>

          {/* Search categories */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 dark:text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              placeholder="Search categories or Act names..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full liquid-pill text-xs sm:text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:outline-none focus:border-orange-500/50 dark:focus:border-[#7C5CFF]/60 transition-colors dark:bg-[#151515] dark:border-[#292929]"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(cat => {
              const matchedCount = laws.filter(l => l.category_id === cat.id).length;
              return (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -3, scale: 1.012 }}
                  whileTap={{ scale: 0.985 }}
                  transition={MOTION_SPRINGS.gentle}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-5 rounded-2xl liquid-glass-card cursor-pointer flex flex-col justify-between group dark:border-[#292929]"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF] group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] transition-colors font-display">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/30 shrink-0">
                        {matchedCount > 0 ? `${matchedCount} Active` : `${cat.sections_count} Sec`}
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
