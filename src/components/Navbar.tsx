import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Sun, 
  Moon, 
  Sparkles, 
  MapPin, 
  User as UserIcon, 
  Search,
  BookOpen,
  Droplets,
  Laptop,
  Menu,
  X,
  Film
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOTION_EASINGS } from '../utils/motion';

export const Navbar: React.FC = () => {
  const { 
    user, 
    theme, 
    setTheme, 
    explanationMode, 
    setExplanationMode, 
    setActiveTab, 
    setShowAuthModal,
    setShowOnboardingModal,
    setShowAIAssistant,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    replayCinematicIntro
  } = useApp();

  const handleLogoClick = () => {
    // In phone view and tab only (< lg breakpoint, e.g. < 1024px)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      setActiveTab('home');
    }
  };

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeToggle = () => {
    if (theme === 'liquid-glass') setTheme('day');
    else if (theme === 'day') setTheme('night');
    else if (theme === 'night') setTheme('system');
    else setTheme('liquid-glass');
  };

  const getThemeIcon = () => {
    if (theme === 'liquid-glass') return <Droplets className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />;
    if (theme === 'night') return <Moon className="w-4 h-4 text-[#7C5CFF]" />;
    if (theme === 'day') return <Sun className="w-4 h-4 text-amber-500" />;
    return <Laptop className="w-4 h-4 text-emerald-500" />;
  };

  const getThemeLabel = () => {
    if (theme === 'liquid-glass') return 'iOS 26 Liquid Glass';
    if (theme === 'day') return 'Morrison Day Glass';
    if (theme === 'night') return 'Night Theme';
    return 'System Adaptive';
  };

  return (
    <header className="sticky top-0 z-30 liquid-header backdrop-blur-3xl w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo with Morrison Precision */}
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: MOTION_EASINGS.appleDecel }}
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group min-w-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLogoClick();
            }
          }}
          title="NyayaSetu Home"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25 ring-1 ring-white/40 dark:ring-white/20 shrink-0"
          >
            <Scale className="w-5 h-5 text-white transition-transform duration-200 group-hover:scale-110" />
          </motion.div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-[#FFFFFF] font-display">
                Nyaya<span className="text-orange-500 dark:text-orange-400">Setu</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25 liquid-pill shrink-0">
                India
              </span>
              {theme === 'liquid-glass' && (
                <span className="hidden lg:inline-flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  iOS 26 Liquid Glass
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#777777] hidden sm:block -mt-0.5 font-medium truncate">
              Indian Laws & Legal Information Guide
            </p>
          </div>
        </motion.div>

        {/* Middle / Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* Simple | Detailed Mode Toggle with Liquid Glass Pill */}
          <div className="hidden md:flex items-center p-1 rounded-2xl liquid-pill text-xs font-medium">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setExplanationMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer liquid-select-item transition-all duration-200 ${
                explanationMode === 'simple'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-[#FFFFFF] shadow-sm font-semibold liquid-select-item-active'
                  : 'text-slate-600 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
              }`}
              title="Beginner-friendly citizen phrasing"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 transition-transform duration-200 group-hover:scale-110" />
              Citizen
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setExplanationMode('detailed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer liquid-select-item transition-all duration-200 ${
                explanationMode === 'detailed'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-[#FFFFFF] shadow-sm font-semibold liquid-select-item-active'
                  : 'text-slate-600 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
              }`}
              title="Official Bare Act phrasing"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 transition-transform duration-200 group-hover:scale-110" />
              Bare Act
            </motion.button>
          </div>

          {/* State / UT selector chip */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowOnboardingModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-pill text-xs font-semibold text-slate-700 dark:text-[#B3B3B3] cursor-pointer liquid-select-item group transition-all"
            title="Click to update state-specific legal preferences"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="truncate max-w-[120px]">{user?.preferences?.state || 'Telangana'}</span>
          </motion.button>

          {/* Replay Cinematic Opening Intro */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={replayCinematicIntro}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full liquid-pill text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer border border-amber-500/25"
            title="Play Cinematic Opening Animation"
          >
            <Film className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden lg:inline text-[11px]">Intro</span>
          </motion.button>

          {/* AI Legal Assistant Button with Subtle Premium Glow */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 22px rgba(249, 115, 22, 0.45)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => setShowAIAssistant(true)}
            className="flex items-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 ring-1 ring-white/30 cursor-pointer liquid-select-item"
            title="Ask AI about any Indian law or legal scenario"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden text-xs font-bold">AI</span>
          </motion.button>

          {/* Liquid Glass Theme Switcher Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowThemeMenu(prev => !prev)}
              className={`min-h-[44px] min-w-[44px] p-2.5 sm:px-3 sm:py-2 rounded-full liquid-pill flex items-center justify-center gap-1.5 text-slate-700 dark:text-[#B3B3B3] cursor-pointer liquid-select-item ${
                theme === 'liquid-glass' ? 'ring-2 ring-cyan-500/40' : ''
              }`}
              aria-label="Toggle theme"
              title={`Theme: ${getThemeLabel()} (Click to change)`}
            >
              {getThemeIcon()}
              <span className="hidden lg:inline text-xs font-semibold">
                {theme === 'liquid-glass' ? 'iOS 26' : theme === 'day' ? 'Day' : theme === 'night' ? 'Night' : 'System'}
              </span>
            </motion.button>

            {/* Theme Selector Popover with AnimatePresence */}
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: MOTION_EASINGS.appleDecel }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl liquid-glass-card p-2 shadow-2xl z-50 popover-blur-open"
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 text-slate-500 dark:text-[#777777]">
                    Select Design Theme
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setTheme('liquid-glass'); setShowThemeMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer liquid-select-item transition-colors duration-150 ${
                        theme === 'liquid-glass'
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 liquid-select-item-active'
                          : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-500" />
                        <span>iOS 26 Liquid Glass</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
                        Flagship
                      </span>
                    </button>

                    <button
                      onClick={() => { setTheme('day'); setShowThemeMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer liquid-select-item transition-colors duration-150 ${
                        theme === 'day'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 liquid-select-item-active'
                          : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Glass Morrison Day</span>
                    </button>

                    <button
                      onClick={() => { setTheme('night'); setShowThemeMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer liquid-select-item transition-colors duration-150 ${
                        theme === 'night'
                          ? 'bg-[#7C5CFF]/15 text-[#7C5CFF] dark:text-[#a78bfa] border border-[#7C5CFF]/30 liquid-select-item-active'
                          : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-[#7C5CFF]" />
                      <span>Night Theme</span>
                    </button>

                    <button
                      onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer liquid-select-item transition-colors duration-150 ${
                        theme === 'system'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 liquid-select-item-active'
                          : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <Laptop className="w-4 h-4 text-emerald-500" />
                      <span>System Dynamic</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search trigger on mobile */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveTab('search')}
            className="sm:hidden p-2 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3]"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Profile / Login */}
          {user ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full liquid-pill cursor-pointer"
              title="Open Profile & Settings"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-1 ring-white/40">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-[#FFFFFF] hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6c48f5] text-white font-medium text-xs shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25 transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Log In</span>
            </motion.button>
          )}

        </div>
      </div>
    </header>
  );
};
