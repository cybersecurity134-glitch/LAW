import React from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  AlertCircle, 
  Coins, 
  ChevronRight, 
  Sparkles,
  Shield,
  MapPin
} from 'lucide-react';
import { LawItem } from '../types';
import { useApp } from '../context/AppContext';
import { MOTION_EASINGS } from '../utils/motion';

interface LawCardProps {
  law: LawItem;
  compact?: boolean;
}

export const LawCard: React.FC<LawCardProps> = ({ law, compact = false }) => {
  const { 
    openLawDetail, 
    isBookmarked, 
    toggleBookmark, 
    explanationMode,
    setShowAIAssistant,
    setAiInitialQuestion
  } = useApp();

  const saved = isBookmarked(law.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(law.id);
  };

  const handleAskAIClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAiInitialQuestion(`Explain ${law.act_name} ${law.section_number} (${law.section_title}) and its penalties.`);
    setShowAIAssistant(true);
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.988 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      onClick={() => openLawDetail(law.id)}
      className="group relative liquid-glass-card rounded-2xl p-3.5 sm:p-5 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:border-orange-500/30 dark:hover:border-[#7C5CFF]/40 transition-colors w-full min-w-0"
    >
      <div className="min-w-0">
        {/* Top Badges: Act, Section & Actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#a78bfa] border border-orange-500/25 dark:border-[#7C5CFF]/30 font-mono shadow-xs shrink-0">
              {law.section_number}
            </span>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-[#B3B3B3] liquid-pill px-2.5 py-0.5 rounded-full truncate max-w-[150px] sm:max-w-xs">
              {law.short_act || law.act_name}
            </span>
            {law.state_applicability !== 'All India' && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 dark:bg-[#EF4444]/15 text-rose-600 dark:text-[#EF4444] border border-rose-500/20 dark:border-[#EF4444]/30 shrink-0">
                <MapPin className="w-2.5 h-2.5" />
                {law.state_applicability}
              </span>
            )}
            {law.is_recently_updated && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-[#22C55E]/15 text-emerald-700 dark:text-[#22C55E] border border-emerald-500/25 dark:border-[#22C55E]/30 shrink-0">
                Amended
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 shrink-0 -mr-1">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.88 }}
              onClick={handleAskAIClick}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full text-slate-400 dark:text-[#777777] hover:text-orange-500 dark:hover:text-[#7C5CFF] hover:bg-black/5 dark:hover:bg-[#181818] transition-colors cursor-pointer"
              title="Ask AI about this law"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.88 }}
              onClick={handleBookmarkClick}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
                saved
                  ? 'text-orange-600 dark:text-[#7C5CFF] bg-orange-500/15 dark:bg-[#7C5CFF]/15 border border-orange-500/30 dark:border-[#7C5CFF]/30'
                  : 'text-slate-400 dark:text-[#777777] hover:text-slate-800 dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#181818]'
              }`}
              title={saved ? 'Remove Bookmark' : 'Save Law'}
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 fill-orange-500 dark:fill-[#7C5CFF] text-orange-600 dark:text-[#7C5CFF]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Section Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FFFFFF] leading-snug group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] transition-colors font-display break-words">
          {law.section_title}
        </h3>

        {/* Explanation text */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] mt-2 leading-relaxed line-clamp-2 font-normal break-words">
          {explanationMode === 'simple' ? law.simple_explanation : law.what_it_means}
        </p>

        {/* Punishment & Fine Preview Pills */}
        {!compact && (
          <div className="mt-3.5 pt-2.5 border-t border-black/5 dark:border-[#222222] flex flex-wrap gap-2 text-xs">
            {law.punishment && (
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-[#B3B3B3] liquid-pill px-2.5 py-1 rounded-full text-[11px] sm:text-xs">
                <Clock className="w-3.5 h-3.5 text-rose-500 dark:text-[#EF4444] shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-[200px] font-medium">{law.imprisonment || law.punishment}</span>
              </div>
            )}
            {law.fine && law.fine !== 'None' && (
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-[#B3B3B3] liquid-pill px-2.5 py-1 rounded-full text-[11px] sm:text-xs">
                <Coins className="w-3.5 h-3.5 text-orange-500 dark:text-[#F59E0B] shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[150px] font-medium">{law.fine}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Legal classification & view action */}
      <div className="mt-3 pt-2.5 flex items-center justify-between gap-2 border-t border-black/5 dark:border-[#222222] text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5">
          {law.is_bailable !== null && (
            <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] sm:text-[11px] ${
              law.is_bailable 
                ? 'bg-amber-500/15 text-amber-700 dark:text-[#F59E0B] border-amber-500/25 dark:border-[#F59E0B]/30' 
                : 'bg-rose-500/15 text-rose-700 dark:text-[#EF4444] border-rose-500/25 dark:border-[#EF4444]/30'
            }`}>
              {law.is_bailable ? 'Bailable' : 'Non-Bailable'}
            </span>
          )}
          {law.is_cognizable !== null && (
            <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] sm:text-[11px] ${
              law.is_cognizable 
                ? 'bg-indigo-500/15 text-indigo-700 dark:text-[#3B82F6] border-indigo-500/25 dark:border-[#3B82F6]/30' 
                : 'bg-slate-500/15 text-slate-700 dark:text-[#B3B3B3] border-slate-500/25 dark:border-[#292929]'
            }`}>
              {law.is_cognizable ? 'Cognizable' : 'Non-Cognizable'}
            </span>
          )}
        </div>

        <span className="text-orange-600 dark:text-[#7C5CFF] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform duration-200 shrink-0">
          Details
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
};
