import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Scale, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    login, 
    signUp, 
    continueAsGuest 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      signUp(email, name);
    } else if (mode === 'login') {
      if (!password) {
        setError('Please enter your password.');
        return;
      }
      login(email, name || 'Citizen User');
    } else if (mode === 'forgot') {
      setResetSent(true);
    }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div 
          key="auth-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: MOTION_EASINGS.appleDecel }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop-blur cursor-pointer"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div 
            key="auth-modal-card"
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white/95 dark:bg-[#0B0B0B] rounded-3xl border border-slate-200/90 dark:border-[#292929] shadow-2xl backdrop-blur-2xl p-6 sm:p-8 cursor-default text-slate-800 dark:text-[#FFFFFF]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 dark:text-[#777777] hover:text-slate-700 dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 mb-3">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
            {mode === 'login' && 'Welcome to NyayaSetu'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#777777] mt-1">
            {mode === 'login' && 'Access tailored Indian laws, bookmarks, and legal updates'}
            {mode === 'signup' && 'Personalize legal recommendations for your state and profession'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-[#EF4444]/10 border border-rose-200 dark:border-[#EF4444]/25 text-rose-700 dark:text-[#EF4444] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-[#22C55E]/15 text-emerald-600 dark:text-[#22C55E] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF]">Instructions Sent</h3>
              <p className="text-xs text-slate-500 dark:text-[#B3B3B3] mt-1">
                Password reset instructions have been dispatched to <strong>{email}</strong>.
              </p>
            </div>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="w-full py-2.5 rounded-full bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs font-semibold text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-200 dark:hover:bg-[#222222] cursor-pointer transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-[#B3B3B3]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-[#777777] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:bg-white dark:focus:bg-[#151515] focus:outline-none focus:border-orange-500 dark:focus:border-[#7C5CFF]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#B3B3B3]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#777777] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:bg-white dark:focus:bg-[#151515] focus:outline-none focus:border-orange-500 dark:focus:border-[#7C5CFF]"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#B3B3B3]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-[#777777] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#292929] text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] focus:bg-white dark:focus:bg-[#151515] focus:outline-none focus:border-orange-500 dark:focus:border-[#7C5CFF]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6c48f5] text-white font-bold text-sm shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mode Switcher */}
            <div className="text-center pt-2 text-xs text-slate-500 dark:text-[#777777]">
              {mode === 'login' && (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              )}
            </div>

            {/* Continue as Guest option */}
            <div className="pt-3 border-t border-slate-200 dark:border-[#222222] text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={continueAsGuest}
                className="w-full py-2.5 rounded-full bg-slate-100 dark:bg-[#181818] hover:bg-slate-200 dark:hover:bg-[#202020] border border-slate-200 dark:border-[#292929] text-xs font-semibold text-slate-700 dark:text-[#FFFFFF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#22C55E]" />
                <span>Continue as Guest Citizen</span>
              </motion.button>
              <p className="text-[10px] text-slate-500 dark:text-[#777777] mt-2">
                All statutory legal content is fully accessible without an account.
              </p>
            </div>

          </form>
        )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
