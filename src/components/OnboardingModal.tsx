import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  HeartHandshake, 
  BookOpen, 
  Check, 
  ArrowRight, 
  Sparkles,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES } from '../data/laws';
import { UserPreferences } from '../types';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';

export const OnboardingModal: React.FC = () => {
  const { 
    showOnboardingModal, 
    setShowOnboardingModal, 
    user, 
    completeOnboarding 
  } = useApp();

  const [age, setAge] = useState<number>(user?.preferences?.age || 26);
  const [state, setState] = useState<string>(user?.preferences?.state || 'Telangana');
  const [genderPref, setGenderPref] = useState<string>(user?.preferences?.gender_pref || 'Not Specified');
  const [occupation, setOccupation] = useState<string>(user?.preferences?.occupation || 'Working Professional');
  const [interests, setInterests] = useState<string[]>(
    user?.preferences?.interests || ['Motor Vehicle & Traffic Law', 'Cyber Law & Information Technology', 'Consumer Law']
  );
  const [mode, setMode] = useState<'simple' | 'detailed'>(user?.preferences?.explanation_mode || 'simple');
  const [theme, setTheme] = useState<'day' | 'night'>(user?.preferences?.theme === 'night' ? 'night' : 'day');

  const occupations = [
    'Student',
    'Working Professional',
    'Business Owner / Entrepreneur',
    'Driver / Vehicle Owner',
    'Law Student / Advocate',
    'Homemaker',
    'Senior Citizen',
    'Citizen'
  ];

  const availableInterests = [
    'Motor Vehicle & Traffic Law',
    'Cyber Law & Information Technology',
    'Consumer Law',
    'Criminal Law',
    'Family Law',
    'Labour Law',
    'Property Law',
    'Banking & Cheque Bounce',
    'Women Protection Laws',
    'Constitutional Rights'
  ];

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleSave = () => {
    const updatedPrefs: UserPreferences = {
      age,
      state,
      gender_pref: genderPref,
      occupation,
      interests,
      explanation_mode: mode,
      theme
    };
    completeOnboarding(updatedPrefs);
  };

  return (
    <AnimatePresence>
      {showOnboardingModal && (
        <motion.div 
          key="onboarding-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: MOTION_EASINGS.appleDecel }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop-blur overflow-y-auto cursor-pointer"
          onClick={() => setShowOnboardingModal(false)}
        >
          <motion.div 
            key="onboarding-modal-card"
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0B0B0B] rounded-3xl border border-slate-200/90 dark:border-[#292929] shadow-2xl backdrop-blur-2xl p-6 sm:p-8 my-6 cursor-default text-slate-800 dark:text-[#FFFFFF]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 dark:text-[#777777] hover:text-slate-700 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Personalized Legal Experience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
            Tell Us About You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#777777] mt-1">
            Customize which Indian laws, state provisions, and legal updates appear first on your dashboard.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* 1. State / Union Territory Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-[#7C5CFF]" />
              <span>Your State / Union Territory</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-[#777777]">
              State-specific rules (like Telangana Motor Vehicle Rules or Police Acts) will be highlighted for you.
            </p>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-800 dark:text-[#FFFFFF] font-medium focus:bg-white dark:focus:bg-[#151515] focus:border-orange-500 dark:focus:border-[#7C5CFF] focus:outline-none"
            >
              {INDIAN_STATES.map(st => (
                <option key={st} value={st} className="bg-white dark:bg-[#121212] text-slate-900 dark:text-[#FFFFFF]">
                  {st} {st === 'Telangana' ? '★ (Active User State)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Age & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF] uppercase tracking-wider">
                Age
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={14}
                  max={100}
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 25)}
                  className="w-24 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm font-bold text-slate-800 dark:text-[#FFFFFF] focus:bg-white dark:focus:bg-[#151515] focus:outline-none focus:border-orange-500 dark:focus:border-[#7C5CFF]"
                />
                <span className="text-xs text-slate-500 dark:text-[#777777]">
                  Used to highlight juvenile, driving, or senior citizen provisions.
                </span>
              </div>
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-orange-600 dark:text-[#7C5CFF]" />
                <span>Occupation / Status</span>
              </label>
              <select
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-800 dark:text-[#FFFFFF] font-medium focus:bg-white dark:focus:bg-[#151515] focus:border-orange-500 dark:focus:border-[#7C5CFF] focus:outline-none"
              >
                {occupations.map(occ => (
                  <option key={occ} value={occ} className="bg-white dark:bg-[#121212] text-slate-900 dark:text-[#FFFFFF]">{occ}</option>
                ))}
              </select>
            </div>

          </div>

          {/* 3. Gender preference (optional, for specific laws) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF]">
                Gender-Specific Law Filter (Optional)
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#777777]">Respectful Preference</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#777777] leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-orange-600 dark:text-[#7C5CFF] shrink-0 mt-0.5" />
              <span>
                Used strictly to present laws with statutory gender-specific provisions (e.g. Maternity Benefit Act, Domestic Violence Act, or Poshan schemes), never for assumptions.
              </span>
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Female', 'Male', 'Non-Binary / Third Gender', 'Prefer not to say'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderPref(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    genderPref === g
                      ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white font-bold shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                      : 'bg-white dark:bg-[#181818] text-slate-600 dark:text-[#B3B3B3] border border-slate-200 dark:border-[#292929] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#202020]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Areas of Interest */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-orange-600 dark:text-[#7C5CFF]" />
              <span>Areas of Legal Interest</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selected
                        ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white border border-orange-500 dark:border-[#7C5CFF] font-semibold shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                        : 'bg-white dark:bg-[#181818] text-slate-600 dark:text-[#B3B3B3] border border-slate-200 dark:border-[#292929] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#202020]'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-white" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Reading Mode & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Reading Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF] uppercase tracking-wider">
                Explanation Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('simple')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                    mode === 'simple'
                      ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white border-orange-500 dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                      : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#292929] text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#202020]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Beginner Plain Language</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('detailed')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                    mode === 'detailed'
                      ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white border-orange-500 dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                      : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#292929] text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#202020]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Detailed Legal Text</span>
                </button>
              </div>
            </div>

            {/* Theme Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-[#FFFFFF] uppercase tracking-wider">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('day')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                    theme === 'day'
                      ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white border-orange-500 dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                      : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#292929] text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#202020]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500 dark:text-white" />
                  <span>Day Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('night')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                    theme === 'night'
                      ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white border-orange-500 dark:border-[#7C5CFF] shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                      : 'bg-white dark:bg-[#181818] border-slate-200 dark:border-[#292929] text-slate-600 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#202020]'
                  }`}
                >
                  <Moon className="w-4 h-4 text-orange-500 dark:text-white" />
                  <span>Night Mode</span>
                </button>
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#222222]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6c48f5] text-white font-bold text-sm shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save & Personalize My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
