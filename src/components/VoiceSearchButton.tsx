import React, { memo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, AlertCircle, ChevronDown, Check, Globe } from 'lucide-react';
import { MOTION_EASINGS } from '../utils/motion';
import { SupportedLanguage, SUPPORTED_REGIONAL_LANGUAGES } from '../data/languages';

export interface VoiceSearchButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  error?: string | null;
  onDismissError?: () => void;
  className?: string;
  size?: 'sm' | 'md';
  activeLanguage?: SupportedLanguage;
  onLanguageChange?: (langCode: string) => void;
  showLanguageSelector?: boolean;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = memo(({
  isListening,
  isSupported,
  onToggle,
  error,
  onDismissError,
  className = '',
  size = 'md',
  activeLanguage = SUPPORTED_REGIONAL_LANGUAGES[0],
  onLanguageChange,
  showLanguageSelector = false
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  if (!isSupported) {
    return null; // Gracefully omit button if browser completely lacks Web Speech API
  }

  const iconSizes = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const buttonSizes = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';

  return (
    <div ref={dropdownRef} className={`relative flex items-center gap-1 ${className}`}>
      {/* Optional Regional Language Quick-Badge Selector */}
      {showLanguageSelector && onLanguageChange && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDropdown(prev => !prev);
          }}
          title={`Active voice recognition language: ${activeLanguage.name} (${activeLanguage.nativeName}). Click to switch language.`}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="font-sans font-medium text-[10px] uppercase text-orange-600 dark:text-[#7C5CFF]">
            {activeLanguage.code.slice(0, 2)}
          </span>
          <span className="truncate max-w-[55px] font-medium hidden sm:inline">
            {activeLanguage.nativeName}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}

      {/* Listening Wave Ping Background */}
      {isListening && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-rose-500/30 dark:bg-rose-500/40 pointer-events-none"
        />
      )}

      {/* Main Mic Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        aria-label={isListening ? 'Stop voice recognition' : `Search laws by voice in ${activeLanguage.name}`}
        title={isListening ? 'Listening... click to stop' : `Search laws by voice (${activeLanguage.nativeName} / ${activeLanguage.name})`}
        className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${buttonSizes} ${
          isListening
            ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400 animate-pulse'
            : 'text-slate-400 dark:text-[#888888] hover:text-orange-600 dark:hover:text-[#7C5CFF] hover:bg-orange-500/10 dark:hover:bg-[#7C5CFF]/15'
        }`}
      >
        {isListening ? (
          <div className="flex items-center gap-0.5 justify-center">
            {/* Animated Audio Wave Bars */}
            <motion.span
              animate={{ height: ['4px', '12px', '4px'] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="w-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={{ height: ['8px', '16px', '8px'] }}
              transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse', delay: 0.1 }}
              className="w-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={{ height: ['5px', '13px', '5px'] }}
              transition={{ duration: 0.45, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
              className="w-0.5 bg-white rounded-full"
            />
          </div>
        ) : (
          <Mic className={iconSizes} />
        )}
      </motion.button>

      {/* Voice Listening Active Float Indicator Banner */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: MOTION_EASINGS.appleDecel }}
            className="absolute right-0 top-12 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/95 dark:bg-[#1C1C1E]/95 text-white shadow-xl border border-white/10 backdrop-blur-md whitespace-nowrap pointer-events-none"
          >
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <div className="text-xs font-medium">
              <span className="font-bold text-rose-400">
                Listening in {activeLanguage.nativeName} ({activeLanguage.name})...
              </span>{' '}
              <span className="opacity-80">Speak section or legal topic</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Language Switcher Dropdown */}
      <AnimatePresence>
        {showDropdown && onLanguageChange && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-40 w-64 p-2 rounded-2xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border border-slate-200 dark:border-[#2E2E32] shadow-2xl space-y-1"
          >
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-500 dark:text-[#888888]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
                Voice Recognition Language
              </span>
              <span className="text-[10px] text-orange-600 dark:text-[#7C5CFF]">
                {activeLanguage.name}
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5 pt-1 pr-0.5">
              {SUPPORTED_REGIONAL_LANGUAGES.map(lang => {
                const isSelected = lang.code.toLowerCase() === activeLanguage.code.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/10 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF] font-bold'
                        : 'text-slate-700 dark:text-[#B3B3B3] hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-[10px] font-mono font-bold text-slate-400 dark:text-[#666666]">
                        {lang.code.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <div className="text-xs">{lang.name}</div>
                        <div className="text-[10px] opacity-70">{lang.nativeName}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-orange-500 dark:text-[#7C5CFF]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Floating Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: MOTION_EASINGS.appleDecel }}
            className="absolute right-0 top-12 z-30 max-w-xs flex items-start gap-2 p-3 rounded-2xl bg-rose-950/95 dark:bg-rose-950/95 text-rose-200 shadow-2xl border border-rose-800/60 backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug flex-1">
              {error}
            </div>
            {onDismissError && (
              <button
                type="button"
                onClick={onDismissError}
                className="text-rose-400 hover:text-white text-xs font-bold px-1 ml-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

VoiceSearchButton.displayName = 'VoiceSearchButton';
