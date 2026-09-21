import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  HeartHandshake, 
  BookOpen, 
  Sun, 
  Moon, 
  RotateCw, 
  LogOut, 
  Trash2, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  Film,
  Mic,
  Languages,
  Check,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LawCard } from '../LawCard';
import { ConstitutionalPreambleCard } from '../legal/ConstitutionalPreambleCard';
import { LegalHelplines } from '../legal/LegalHelplines';
import { 
  SUPPORTED_REGIONAL_LANGUAGES, 
  getEffectiveVoiceLanguage 
} from '../../data/languages';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    logout, 
    setShowOnboardingModal,
    setShowAuthModal,
    theme, 
    setTheme, 
    explanationMode, 
    setExplanationMode,
    recentlyViewed,
    lastUpdatedTime,
    isRefreshing,
    refreshLegalData,
    clearRecentSearches,
    replayCinematicIntro,
    updatePreferences,
    setShowAdminModal,
    syncStatus
  } = useApp();

  const currentVoiceLang = getEffectiveVoiceLanguage(user?.preferences);

  const [historyCleared, setHistoryCleared] = useState(false);

  const handleClearHistory = () => {
    localStorage.removeItem('nyaya_recent_laws');
    clearRecentSearches();
    setHistoryCleared(true);
    setTimeout(() => setHistoryCleared(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 view-blur-open">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 dark:border-[#292929]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
                {user?.name || 'Guest Citizen'}
              </h1>
              {user?.is_guest && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:bg-[#151515] dark:border-[#292929]">
                  Guest Mode
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#777777]">
              {user?.email || 'guest@nyaya.gov.in'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-[#B3B3B3]">
                <MapPin className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
                {user?.preferences?.state || 'Telangana'}
              </span>
              <span className="text-slate-400 dark:text-[#777777]">•</span>
              <span className="text-slate-600 dark:text-[#B3B3B3]">
                {user?.preferences?.occupation || 'Citizen'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowOnboardingModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6847ed] text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Update My Preferences</span>
          </motion.button>

          {user && !user.is_guest ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-rose-600 dark:hover:text-[#EF4444] text-xs font-semibold transition-colors cursor-pointer dark:border-[#292929]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full liquid-pill text-slate-800 dark:text-[#FFFFFF] text-xs font-semibold transition-colors cursor-pointer dark:bg-[#151515] dark:border-[#292929]"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* App Preferences & Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Explanation Language Mode */}
        <div className="p-6 rounded-3xl liquid-glass-card space-y-4 dark:border-[#292929]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#FFFFFF] font-display">
                Explanation Language
              </h3>
            </div>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:bg-[#151515] dark:border-[#292929]">
              Active: {explanationMode}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#777777] leading-relaxed">
            Choose how laws and offences are presented by default throughout the app.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExplanationMode('simple')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                explanationMode === 'simple'
                  ? 'bg-orange-500 text-white border-orange-500 dark:bg-[#7C5CFF] dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                  : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929]'
              }`}
            >
              <span className="font-bold">Beginner Friendly</span>
              <span className="text-[10px] opacity-80">Everyday plain English</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExplanationMode('detailed')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                explanationMode === 'detailed'
                  ? 'bg-orange-500 text-white border-orange-500 dark:bg-[#7C5CFF] dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                  : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929]'
              }`}
            >
              <span className="font-bold">Detailed Legal</span>
              <span className="text-[10px] opacity-80">Bare Act phrasing</span>
            </motion.button>
          </div>
        </div>

        {/* Day / Night Theme */}
        <div className="p-6 rounded-3xl liquid-glass-card space-y-4 dark:border-[#292929]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#FFFFFF] font-display">
                Theme Display
              </h3>
            </div>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] dark:bg-[#151515] dark:border-[#292929]">
              {theme}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#777777] leading-relaxed">
            Switch between Day light theme, Night eye-comfort theme, or follow system default.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme('day')}
              className={`py-2.5 px-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'day'
                  ? 'bg-orange-500 text-white border-orange-500 dark:bg-[#7C5CFF] dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                  : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Day</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme('night')}
              className={`py-2.5 px-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'night'
                  ? 'bg-orange-500 text-white border-orange-500 dark:bg-[#7C5CFF] dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                  : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Night</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme('system')}
              className={`py-2.5 px-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-orange-500 text-white border-orange-500 dark:bg-[#7C5CFF] dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                  : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929]'
              }`}
            >
              <span>System</span>
            </motion.button>
          </div>
        </div>

        {/* Regional Indian Voice Search Language */}
        <div className="p-6 rounded-3xl liquid-glass-card space-y-4 md:col-span-2 dark:border-[#292929]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#FFFFFF] font-display flex items-center gap-2">
                  <span>Voice Search Regional Language</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Indian Languages Supported
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#777777] mt-0.5">
                  Dynamically sets the browser SpeechRecognition language and Indic numeral parser for voice law queries.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full liquid-pill text-orange-600 dark:text-[#7C5CFF] border-orange-500/30 dark:border-[#7C5CFF]/30 dark:bg-[#151515]">
                {currentVoiceLang.nativeName} ({currentVoiceLang.name})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-[#151515] border border-orange-200/60 dark:border-[#292929] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-[#CCCCCC]">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF] shrink-0" />
              <span>
                Try speaking in <strong>{currentVoiceLang.name}</strong>: <span className="font-semibold text-orange-700 dark:text-[#A78BFA]">"{currentVoiceLang.sampleVoicePrompt}"</span>
              </span>
            </div>
            {user?.preferences?.state && (
              <button
                type="button"
                onClick={() => {
                  const stateLang = getEffectiveVoiceLanguage({ state: user.preferences.state });
                  updatePreferences({ voice_language: stateLang.code });
                }}
                className="text-[11px] font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Auto-sync with my state ({user.preferences.state})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
            {SUPPORTED_REGIONAL_LANGUAGES.map((lang) => {
              const isSelected = lang.code.toLowerCase() === currentVoiceLang.code.toLowerCase();
              return (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updatePreferences({ voice_language: lang.code })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 dark:bg-[#7C5CFF] dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                      : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-[#666666]'}`}>
                      {lang.code.slice(0, 2)}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs truncate">{lang.name}</div>
                    <div className={`text-[11px] font-medium truncate ${isSelected ? 'text-white/90' : 'text-slate-500 dark:text-[#888888]'}`}>
                      {lang.nativeName}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Cinematic Opening Animation Replay Card */}
      <div className="p-6 rounded-3xl liquid-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:border-[#292929]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-[#FFFFFF] font-display">
              LawSphere Opening Intro
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#777777]">
            Watch the official LawSphere opening animation with the Ashoka Chakra, Scales of Justice, and sovereign tricolor header.
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Featuring 24-spoke Dharma wheel rotation, orbital jurisprudence shield, and typewriter statutory branding.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={replayCinematicIntro}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 self-start sm:self-auto cursor-pointer"
        >
          <Film className="w-4 h-4" />
          <span>Play LawSphere Intro</span>
        </motion.button>
      </div>

      {/* Database Verification Status & Gazette Refresh */}
      <div className="p-6 rounded-3xl liquid-glass-card space-y-4 dark:border-[#292929]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-[#22C55E]" />
              <h3 className="font-bold text-base text-slate-900 dark:text-[#FFFFFF] font-display">
                Official Legal Database Status
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#777777]">
              Verified against India Code (<a href="https://www.indiacode.nic.in" target="_blank" rel="noopener noreferrer" className="underline text-orange-600 dark:text-[#7C5CFF]">indiacode.nic.in</a>) and Official Gazette notifications.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-[#777777]">
              Last synchronized: <strong className="text-slate-800 dark:text-[#B3B3B3]">{lastUpdatedTime}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAdminModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-[#1f1f1f] dark:hover:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Admin Console & Override</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={refreshLegalData}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 dark:bg-[#7C5CFF]/15 dark:hover:bg-[#7C5CFF]/25 border border-orange-500/20 dark:border-[#7C5CFF]/30 text-orange-600 dark:text-[#7C5CFF] text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500 dark:text-[#7C5CFF]' : ''}`} />
              <span>{isRefreshing ? 'Verifying Gazettes...' : 'Live Check for Amendments'}</span>
            </motion.button>
          </div>
        </div>

        {/* 24-Hour Automated Cron Sync Details */}
        <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
              Automated 24h Gazette Ingestion Cycle
            </span>
          </div>
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
            <span>Next run in ~{syncStatus?.nextSyncEstimatedHours || 24}h</span>
            <span>•</span>
            <span>Total updates logged: {syncStatus?.totalUpdatesLogged || 3}</span>
          </div>
        </div>

        {/* Cache & History clear */}
        <div className="pt-4 border-t border-black/5 dark:border-[#222222] flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-[#777777]">
            Clear local search and recently viewed laws
          </span>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-xs text-rose-600 dark:text-[#EF4444] hover:underline font-semibold cursor-pointer"
          >
            {historyCleared ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{historyCleared ? 'History Cleared' : 'Clear History'}</span>
          </button>
        </div>
      </div>

      {/* Recently Viewed Laws */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-[#FFFFFF] font-display">
            <History className="w-5 h-5 text-orange-500 dark:text-[#7C5CFF]" />
            <span>Recently Viewed Laws ({recentlyViewed.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentlyViewed.slice(0, 4).map(law => (
              <LawCard key={law.id} law={law} compact />
            ))}
          </div>
        </div>
      )}

      {/* Constitutional Anchor: Preamble & Fundamental Duties (Article 51A) */}
      <ConstitutionalPreambleCard />

      {/* Official Government Helplines */}
      <LegalHelplines />

    </div>
  );
};
