import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Layers, 
  Bookmark, 
  User, 
  Sparkles, 
  RotateCw, 
  BookOpen, 
  Scale, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { drawerVariants, modalBackdropVariants } from '../utils/motion';

interface SidebarNavItem {
  id: 'home' | 'search' | 'categories' | 'saved' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavTheme {
  activeBg: string;
  activeBorder: string;
  activeText: string;
  activeGlow: string;
  activeIconColor: string;
  inactiveIconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  indicatorBg: string;
  pingBg: string;
  hoverBg: string;
  hoverBorder: string;
  hoverText: string;
  accentBar: string;
}

const NAV_THEMES: Record<string, NavTheme> = {
  home: {
    activeBg: 'bg-gradient-to-r from-amber-500/25 via-orange-500/18 to-amber-500/5 dark:from-amber-500/30 dark:via-orange-500/22 dark:to-transparent',
    activeBorder: 'border-amber-500/60 dark:border-amber-400/60',
    activeText: 'text-amber-800 dark:text-amber-300 font-bold',
    activeGlow: 'shadow-[0_0_24px_-2px_rgba(245,158,11,0.35)] dark:shadow-[0_0_28px_-2px_rgba(245,158,11,0.45)]',
    activeIconColor: 'text-amber-600 dark:text-amber-400',
    inactiveIconColor: 'text-amber-500/70 group-hover:text-amber-500',
    badgeBg: 'bg-amber-500/25 dark:bg-amber-500/35',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-500/40',
    indicatorBg: 'bg-amber-500',
    pingBg: 'bg-amber-400',
    hoverBg: 'hover:bg-amber-500/10 dark:hover:bg-amber-500/15',
    hoverBorder: 'hover:border-amber-500/30',
    hoverText: 'hover:text-amber-700 dark:hover:text-amber-300',
    accentBar: 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.9)]'
  },
  search: {
    activeBg: 'bg-gradient-to-r from-cyan-500/25 via-sky-500/18 to-blue-500/5 dark:from-cyan-500/30 dark:via-sky-500/22 dark:to-transparent',
    activeBorder: 'border-cyan-500/60 dark:border-cyan-400/60',
    activeText: 'text-cyan-800 dark:text-cyan-300 font-bold',
    activeGlow: 'shadow-[0_0_24px_-2px_rgba(6,182,212,0.35)] dark:shadow-[0_0_28px_-2px_rgba(6,182,212,0.45)]',
    activeIconColor: 'text-cyan-600 dark:text-cyan-400',
    inactiveIconColor: 'text-cyan-500/70 group-hover:text-cyan-500',
    badgeBg: 'bg-cyan-500/25 dark:bg-cyan-500/35',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    indicatorBg: 'bg-cyan-500',
    pingBg: 'bg-cyan-400',
    hoverBg: 'hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15',
    hoverBorder: 'hover:border-cyan-500/30',
    hoverText: 'hover:text-cyan-700 dark:hover:text-cyan-300',
    accentBar: 'bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
  },
  categories: {
    activeBg: 'bg-gradient-to-r from-purple-500/25 via-fuchsia-500/18 to-pink-500/5 dark:from-purple-500/30 dark:via-fuchsia-500/22 dark:to-transparent',
    activeBorder: 'border-purple-500/60 dark:border-purple-400/60',
    activeText: 'text-purple-800 dark:text-purple-300 font-bold',
    activeGlow: 'shadow-[0_0_24px_-2px_rgba(168,85,247,0.35)] dark:shadow-[0_0_28px_-2px_rgba(168,85,247,0.45)]',
    activeIconColor: 'text-purple-600 dark:text-purple-400',
    inactiveIconColor: 'text-purple-500/70 group-hover:text-purple-500',
    badgeBg: 'bg-purple-500/25 dark:bg-purple-500/35',
    badgeText: 'text-purple-800 dark:text-purple-300',
    badgeBorder: 'border-purple-500/40',
    indicatorBg: 'bg-purple-500',
    pingBg: 'bg-purple-400',
    hoverBg: 'hover:bg-purple-500/10 dark:hover:bg-purple-500/15',
    hoverBorder: 'hover:border-purple-500/30',
    hoverText: 'hover:text-purple-700 dark:hover:text-purple-300',
    accentBar: 'bg-gradient-to-b from-purple-400 via-fuchsia-500 to-pink-600 shadow-[0_0_12px_rgba(168,85,247,0.9)]'
  },
  saved: {
    activeBg: 'bg-gradient-to-r from-rose-500/25 via-pink-500/18 to-red-500/5 dark:from-rose-500/30 dark:via-pink-500/22 dark:to-transparent',
    activeBorder: 'border-rose-500/60 dark:border-rose-400/60',
    activeText: 'text-rose-800 dark:text-rose-300 font-bold',
    activeGlow: 'shadow-[0_0_24px_-2px_rgba(244,63,94,0.35)] dark:shadow-[0_0_28px_-2px_rgba(244,63,94,0.45)]',
    activeIconColor: 'text-rose-600 dark:text-rose-400',
    inactiveIconColor: 'text-rose-500/70 group-hover:text-rose-500',
    badgeBg: 'bg-rose-500/25 dark:bg-rose-500/35',
    badgeText: 'text-rose-800 dark:text-rose-300',
    badgeBorder: 'border-rose-500/40',
    indicatorBg: 'bg-rose-500',
    pingBg: 'bg-rose-400',
    hoverBg: 'hover:bg-rose-500/10 dark:hover:bg-rose-500/15',
    hoverBorder: 'hover:border-rose-500/30',
    hoverText: 'hover:text-rose-700 dark:hover:text-rose-300',
    accentBar: 'bg-gradient-to-b from-rose-400 via-pink-500 to-red-600 shadow-[0_0_12px_rgba(244,63,94,0.9)]'
  },
  profile: {
    activeBg: 'bg-gradient-to-r from-emerald-500/25 via-teal-500/18 to-cyan-500/5 dark:from-emerald-500/30 dark:via-teal-500/22 dark:to-transparent',
    activeBorder: 'border-emerald-500/60 dark:border-emerald-400/60',
    activeText: 'text-emerald-800 dark:text-emerald-300 font-bold',
    activeGlow: 'shadow-[0_0_24px_-2px_rgba(16,185,129,0.35)] dark:shadow-[0_0_28px_-2px_rgba(16,185,129,0.45)]',
    activeIconColor: 'text-emerald-600 dark:text-emerald-400',
    inactiveIconColor: 'text-emerald-500/70 group-hover:text-emerald-500',
    badgeBg: 'bg-emerald-500/25 dark:bg-emerald-500/35',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    indicatorBg: 'bg-emerald-500',
    pingBg: 'bg-emerald-400',
    hoverBg: 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15',
    hoverBorder: 'hover:border-emerald-500/30',
    hoverText: 'hover:text-emerald-700 dark:hover:text-emerald-300',
    accentBar: 'bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_0_12px_rgba(16,185,129,0.9)]'
  }
};

const CATEGORY_COLOR_MAP: Record<string, { dot: string; ping: string; border: string; bg: string; text: string; glow: string; badge: string }> = {
  emerald: {
    dot: 'bg-emerald-500',
    ping: 'bg-emerald-400',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-[0_0_18px_rgba(16,185,129,0.35)]',
    badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
  },
  rose: {
    dot: 'bg-rose-500',
    ping: 'bg-rose-400',
    border: 'border-rose-500/50',
    bg: 'bg-rose-500/15 text-rose-800 dark:text-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-[0_0_18px_rgba(244,63,94,0.35)]',
    badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
  },
  blue: {
    dot: 'bg-blue-500',
    ping: 'bg-blue-400',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/15 text-blue-800 dark:text-blue-300',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_0_18px_rgba(59,130,246,0.35)]',
    badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30'
  },
  indigo: {
    dot: 'bg-indigo-500',
    ping: 'bg-indigo-400',
    border: 'border-indigo-500/50',
    bg: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'shadow-[0_0_18px_rgba(99,102,241,0.35)]',
    badge: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
  },
  purple: {
    dot: 'bg-purple-500',
    ping: 'bg-purple-400',
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/15 text-purple-800 dark:text-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    badge: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30'
  },
  amber: {
    dot: 'bg-amber-500',
    ping: 'bg-amber-400',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-[0_0_18px_rgba(245,158,11,0.35)]',
    badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
  },
  orange: {
    dot: 'bg-orange-500',
    ping: 'bg-orange-400',
    border: 'border-orange-500/50',
    bg: 'bg-orange-500/15 text-orange-800 dark:text-orange-300',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-[0_0_18px_rgba(249,115,22,0.35)]',
    badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30'
  },
  teal: {
    dot: 'bg-teal-500',
    ping: 'bg-teal-400',
    border: 'border-teal-500/50',
    bg: 'bg-teal-500/15 text-teal-800 dark:text-teal-300',
    text: 'text-teal-600 dark:text-teal-400',
    glow: 'shadow-[0_0_18px_rgba(20,184,166,0.35)]',
    badge: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30'
  }
};

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    bookmarks, 
    setShowAIAssistant, 
    lastUpdatedTime, 
    isRefreshing, 
    refreshLegalData,
    explanationMode,
    setExplanationMode,
    selectedCategory,
    setSelectedCategory,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useApp();

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, setIsMobileSidebarOpen]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  const handleNavClick = (tabId: SidebarNavItem['id']) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  const mainNav: SidebarNavItem[] = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'search', label: 'Search Laws & Sections', icon: Search },
    { id: 'categories', label: 'Categories (22)', icon: Layers },
    { id: 'saved', label: 'Saved Laws', icon: Bookmark, badge: bookmarks.length },
    { id: 'profile', label: 'Profile & Preferences', icon: User },
  ];

  // Selected quick categories
  const featuredCategories = CATEGORIES.slice(0, 7);

  const renderNavContent = (isMobile: boolean) => (
    <>
      {/* Primary Navigation */}
      <div className="space-y-2">
        <div className="px-3 pb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
            Navigation
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#151515] dark:border dark:border-[#292929] text-slate-500 dark:text-[#B3B3B3]">
            5 Views
          </span>
        </div>

        {mainNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const theme = NAV_THEMES[item.id] || NAV_THEMES.home;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick(item.id)}
              className={`relative w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm text-left cursor-pointer transition-colors duration-200 group overflow-hidden ${
                isActive
                  ? `${theme.activeText} dark:text-[#FFFFFF]`
                  : `text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF]`
              }`}
            >
              {/* Shared Flowing Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId={isMobile ? "activeNavPillMobile" : "activeNavPillDesktop"}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className={`absolute inset-0 rounded-2xl ${theme.activeBg} ${theme.activeBorder} ${theme.activeGlow} border`}
                />
              )}

              {/* Hover background for inactive */}
              {!isActive && (
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${theme.hoverBg} border border-transparent ${theme.hoverBorder} dark:group-hover:bg-[#181818]`} />
              )}

              {/* Synchronized Glowing Left Accent Pillar for Active Selection */}
              {isActive && (
                <div className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full ${theme.accentBar} z-10 animate-pulse`} />
              )}

              <div className="flex items-center gap-3 relative z-10 pl-1">
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive 
                      ? `${theme.activeIconColor} scale-110 drop-shadow-[0_0_8px_currentColor]` 
                      : `${theme.inactiveIconColor} group-hover:text-slate-900 dark:group-hover:text-[#FFFFFF]`
                  }`} />
                </div>
                <span className="font-semibold transition-transform duration-200 group-hover:translate-x-0.5">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                {/* Synchronized Radar Pulse Ping Beacon on Selected Item */}
                {isActive && (
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${theme.pingBg}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.indicatorBg}`} />
                  </span>
                )}

                {/* Dynamic Color-Matched Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border font-mono transition-transform duration-200 group-hover:scale-105 ${
                    isActive 
                      ? `${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} shadow-xs` 
                      : 'bg-slate-100 dark:bg-[#151515] text-slate-600 dark:text-[#B3B3B3] border-slate-200 dark:border-[#292929]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Colorful AI Assistant Special Action with Subtle Ambient Shimmer */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowAIAssistant(true);
            setIsMobileSidebarOpen(false);
          }}
          className="w-full mt-3 flex items-center justify-between px-4 py-3 rounded-2xl ai-assistant-glow-btn bg-gradient-to-r from-violet-600/15 via-fuchsia-600/15 via-pink-500/10 to-amber-500/15 hover:from-violet-600/25 hover:via-fuchsia-600/25 hover:to-amber-500/25 dark:from-[#7C5CFF]/15 dark:via-[#7C5CFF]/10 dark:to-transparent border border-fuchsia-500/30 dark:border-[#7C5CFF]/40 text-fuchsia-700 dark:text-[#a78bfa] text-sm font-semibold group cursor-pointer shadow-[0_0_16px_rgba(217,70,239,0.15)] hover:shadow-[0_0_24px_rgba(217,70,239,0.3)] transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30 dark:bg-[#7C5CFF]/20 dark:border-[#7C5CFF]/30">
              <Sparkles className="w-4 h-4 text-fuchsia-500 dark:text-[#7C5CFF] transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="font-bold dark:text-[#FFFFFF]">AI Legal Assistant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 bg-fuchsia-400 dark:bg-[#7C5CFF]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500 dark:bg-[#7C5CFF]" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-fuchsia-500/20 dark:bg-[#7C5CFF]/20 text-fuchsia-700 dark:text-[#a78bfa] border border-fuchsia-500/30 dark:border-[#7C5CFF]/40">
              Live
            </span>
          </div>
        </motion.button>
      </div>

      {/* Colorful Reading Mode Toggle */}
      <div className="p-3.5 rounded-2xl liquid-pill space-y-2.5 border border-slate-200/80 dark:border-[#292929] bg-gradient-to-b from-slate-500/5 to-transparent dark:bg-[#121212]">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-[#B3B3B3] font-medium">
          <span className="font-semibold dark:text-[#FFFFFF]">Reading Mode</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
            explanationMode === 'simple'
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-[#22C55E] border border-emerald-500/30'
              : 'bg-indigo-500/20 text-indigo-700 dark:text-[#7C5CFF] border border-indigo-500/30'
          }`}>
            {explanationMode === 'simple' ? 'Citizen Simple' : 'Statute Bare Act'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/5 dark:bg-[#151515] rounded-xl border border-black/5 dark:border-[#292929]">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setExplanationMode('simple')}
            className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ${
              explanationMode === 'simple'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_16px_rgba(16,185,129,0.45)] font-bold scale-[1.02]'
                : 'text-slate-600 dark:text-[#B3B3B3] hover:text-emerald-600 dark:hover:text-[#22C55E]'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${explanationMode === 'simple' ? 'text-white drop-shadow-sm' : 'text-emerald-500 dark:text-[#22C55E]'}`} />
            Simple
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setExplanationMode('detailed')}
            className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ${
              explanationMode === 'detailed'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-[#7C5CFF] dark:to-[#6366f1] text-white shadow-[0_0_16px_rgba(99,102,241,0.45)] font-bold scale-[1.02]'
                : 'text-slate-600 dark:text-[#B3B3B3] hover:text-indigo-600 dark:hover:text-[#7C5CFF]'
            }`}
          >
            <Scale className={`w-3.5 h-3.5 ${explanationMode === 'detailed' ? 'text-white drop-shadow-sm' : 'text-indigo-500 dark:text-[#7C5CFF]'}`} />
            Detailed
          </motion.button>
        </div>
      </div>

      {/* Quick Law Categories with Individual Vibrant Colors */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between px-3 pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
            Popular Categories
          </span>
          <button
            onClick={() => {
              setActiveTab('categories');
              setIsMobileSidebarOpen(false);
            }}
            className="text-xs text-purple-600 dark:text-[#7C5CFF] hover:text-fuchsia-500 dark:hover:text-[#a78bfa] hover:underline flex items-center gap-0.5 font-bold cursor-pointer transition-colors px-2 py-0.5 rounded-lg"
          >
            View All
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {featuredCategories.map(cat => {
          const catColor = CATEGORY_COLOR_MAP[cat.color] || CATEGORY_COLOR_MAP.amber;
          const isCatActive = activeTab === 'categories' && selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('categories');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left group cursor-pointer transition-all duration-200 border ${
                isCatActive
                  ? `${catColor.bg} ${catColor.border} ${catColor.glow} font-bold scale-[1.01] dark:bg-[#181818] dark:border-[#7C5CFF]/50 dark:text-[#FFFFFF]`
                  : 'text-slate-600 dark:text-[#B3B3B3] border-transparent hover:bg-black/5 dark:hover:bg-[#181818] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  {isCatActive && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${catColor.ping}`} />
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${catColor.dot}`} />
                </span>
                <span className="truncate font-medium group-hover:translate-x-0.5 transition-transform duration-200">{cat.name}</span>
              </div>

              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors shrink-0 ${
                isCatActive
                  ? catColor.badge
                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-[#FFFFFF] bg-slate-100/80 dark:bg-[#151515] dark:text-[#777777]'
              }`}>
                {cat.sections_count} sec
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Notice Card with Warm Sunset Amber-Rose Gradient */}
      <div className="p-4 rounded-2xl border border-amber-500/30 dark:border-[#292929] bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:bg-[#121212] backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#F59E0B] animate-pulse" />
          <p className="text-xs text-amber-700 dark:text-[#F59E0B] font-bold uppercase tracking-wider">
            Citizen Advisory
          </p>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-[#B3B3B3]">
          This app provides educational info only. Not a substitute for legal advice from a qualified advocate.
        </p>
      </div>

      {/* Database Verification Status & Refresh with Animated Emerald Chroma */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-[#222222] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-[#B3B3B3]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 bg-emerald-400 dark:bg-[#22C55E]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#22C55E]" />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#22C55E]" />
            <span className="text-emerald-700 dark:text-[#22C55E] font-bold">India Code Synced</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={refreshLegalData}
            disabled={isRefreshing}
            className="p-1.5 text-emerald-600 dark:text-[#22C55E] hover:text-emerald-700 dark:hover:text-[#4ade80] rounded-lg hover:bg-emerald-500/15 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-xs"
            title="Refresh database against official gazettes"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500 dark:text-[#22C55E]' : ''}`} />
          </motion.button>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-[#777777] leading-tight flex items-center justify-between">
          <span>Last verified:</span>
          <span className="font-semibold text-slate-800 dark:text-[#FFFFFF] font-mono text-[10px] bg-slate-100 dark:bg-[#151515] dark:border dark:border-[#292929] px-1.5 py-0.5 rounded">
            {lastUpdatedTime}
          </span>
        </div>

        <a
          href="https://www.indiacode.nic.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-[#777777] hover:text-orange-600 dark:hover:text-orange-400 transition-colors pt-0.5"
        >
          <span>India Code Repository</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Phone & Tablet Backdrop Overlay with Spring Fade */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            key="sidebar-backdrop"
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 modal-backdrop-blur z-40 lg:hidden cursor-pointer"
            aria-label="Close menu backdrop"
          />
        )}
      </AnimatePresence>

      {/* Phone & Tablet Slide-out Drawer with Spring Physics */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            key="mobile-drawer"
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            id="mobile-sidebar-drawer"
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] h-full overflow-y-auto shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col select-none border-r border-slate-200/90 dark:border-[#292929] bg-white dark:bg-[#0B0B0B] text-slate-800 dark:text-[#FFFFFF] p-5 space-y-6 shrink-0"
          >
            {/* Phone & Tablet Header with Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#222222]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-[#FFFFFF] font-display">
                    Nyaya<span className="text-orange-500 dark:text-orange-400">Setu</span>
                  </span>
                  <span className="ml-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    Menu
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl liquid-pill text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] cursor-pointer transition-colors"
                aria-label="Close sidebar menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Nav content for mobile drawer */}
            {renderNavContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop View (lg+): Static column layout */}
      <aside 
        id="sidebar-nav-desktop"
        className="hidden lg:flex flex-col select-none border-r border-slate-200/90 dark:border-[#292929] bg-white dark:bg-[#0B0B0B] text-slate-800 dark:text-[#FFFFFF] p-5 space-y-6 shrink-0 lg:w-64 lg:w-72 lg:min-h-[calc(100vh-4rem)] shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none"
      >
        {renderNavContent(false)}
      </aside>
    </>
  );
};
