import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Copy, 
  CheckCircle2, 
  Shield, 
  Phone 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LawCard } from '../LawCard';
import { CitizenRightsGuide } from '../legal/CitizenRightsGuide';
import { LegalMaxims } from '../legal/LegalMaxims';
import { LegalHelplines } from '../legal/LegalHelplines';

export const SavedView: React.FC = () => {
  const { 
    laws, 
    bookmarks, 
    setActiveTab, 
    setFilters,
    setShowAIAssistant,
    setAiInitialQuestion
  } = useApp();

  const [savedSearch, setSavedSearch] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const bookmarkedLaws = laws.filter(l => bookmarks.includes(l.id));

  const filteredBookmarks = bookmarkedLaws.filter(l => {
    const q = savedSearch.toLowerCase();
    return (
      l.section_number.toLowerCase().includes(q) ||
      l.section_title.toLowerCase().includes(q) ||
      l.act_name.toLowerCase().includes(q) ||
      l.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const handleCopyAll = async () => {
    if (bookmarkedLaws.length === 0) return;
    const text = bookmarkedLaws.map(l => (
      `• ${l.act_name} - ${l.section_number}: ${l.section_title}\nPunishment: ${l.punishment} | Fine: ${l.fine}\nSource: ${l.source} (${l.source_url})`
    )).join('\n\n');

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12 view-blur-open">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
            <Bookmark className="w-4 h-4" />
            <span>Personal Legal Bookmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
            Saved Laws & Provisions ({bookmarkedLaws.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3]">
            Quickly reference your bookmarked sections, punishments, and exceptions.
          </p>
        </div>

        {bookmarkedLaws.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
          >
            {copiedAll ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Copied to Clipboard' : 'Copy All Citations'}</span>
          </motion.button>
        )}
      </div>

      {bookmarkedLaws.length > 0 ? (
        <>
          {/* Search within bookmarks */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 dark:text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={savedSearch}
              onChange={e => setSavedSearch(e.target.value)}
              placeholder="Search within your saved laws..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full liquid-pill text-xs sm:text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:outline-none focus:border-orange-500/50 dark:focus:border-[#7C5CFF]/50 transition-colors"
            />
          </div>

          {/* Grid of Saved Laws */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookmarks.map(law => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>

          {/* Legal Helplines & Maxims for Bookmarks View */}
          <div className="pt-8 border-t border-black/5 dark:border-[#222222] space-y-8">
            <LegalHelplines />
            <LegalMaxims limit={4} />
          </div>
        </>
      ) : (
        <div className="space-y-8">
          {/* Friendly prompt card */}
          <div className="p-6 sm:p-8 text-center rounded-3xl liquid-glass-card space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] flex items-center justify-center">
              <Bookmark className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
                No personal bookmarks saved yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] leading-relaxed">
                When reading any section or provision, tap the bookmark icon to keep it saved on your device for instant offline reference.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab('home')}
                className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6c48f5] text-white text-xs font-bold shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25 cursor-pointer transition-all"
              >
                Explore Popular Provisions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setFilters(prev => ({ ...prev, query: 'Fundamental Rights' }));
                  setActiveTab('search');
                }}
                className="px-5 py-2.5 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] text-xs font-semibold cursor-pointer transition-all"
              >
                Search Constitutional Rights
              </motion.button>
            </div>
          </div>

          {/* Fill the empty space with Citizen Rights Guide */}
          <div className="space-y-4 pt-2">
            <CitizenRightsGuide />
          </div>

          {/* Fill with Legal Maxims */}
          <div className="space-y-4 pt-2">
            <LegalMaxims />
          </div>

          {/* Fill with Emergency Legal Helplines */}
          <div className="space-y-4 pt-2">
            <LegalHelplines />
          </div>
        </div>
      )}

    </div>
  );
};
