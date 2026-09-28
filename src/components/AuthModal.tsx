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
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginWithEmail, 
    signUpWithEmail, 
    signInWithGoogle,
    continueAsGuest 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'contributor' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        await signUpWithEmail(email, password, name.trim());
      } else if (mode === 'login' || mode === 'contributor') {
        if (!password) {
          setError('Please enter your password.');
          return;
        }
        await loginWithEmail(email, password);
      } else if (mode === 'forgot') {
        setResetSent(true);
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let msg = err?.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Incorrect email or password. Please try again.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email address already exists. Please log in.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err?.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
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
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 mb-3">
                {mode === 'contributor' ? <KeyRound className="w-6 h-6" /> : <Scale className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-[#FFFFFF] font-display">
                {mode === 'login' && 'Welcome to LawSphere'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'contributor' && 'Contributor Portal Login'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#777777] mt-1">
                {mode === 'login' && 'Access tailored Indian laws, bookmarks, and startup networking'}
                {mode === 'signup' && 'New accounts default to Viewer role. Upgrades managed by Admin.'}
                {mode === 'contributor' && 'Log in with your promoted contributor credentials to submit news'}
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
              <div className="space-y-4">
                
                {/* Google Sign-in button */}
                {mode !== 'forgot' && (
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2e2e2e] hover:bg-slate-50 dark:hover:bg-[#1f1f1f] text-xs font-bold text-slate-700 dark:text-white transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="relative my-3 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-[#222222]" />
                      </div>
                      <span className="relative bg-white dark:bg-[#0B0B0B] px-3 text-[11px] text-slate-400">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
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
                        {(mode === 'login' || mode === 'contributor') && (
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
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6c48f5] text-white font-bold text-sm shadow-lg shadow-orange-500/20 dark:shadow-[#7C5CFF]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>
                          {mode === 'login' && 'Sign In with Firebase'}
                          {mode === 'signup' && 'Create Account'}
                          {mode === 'contributor' && 'Log In as Contributor'}
                          {mode === 'forgot' && 'Send Reset Link'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Mode Switchers */}
                  <div className="text-center pt-2 space-y-1 text-xs text-slate-500 dark:text-[#777777]">
                    {mode === 'login' && (
                      <div className="flex flex-col gap-1">
                        <div>
                          Don't have an account?{' '}
                          <button
                            type="button"
                            onClick={() => setMode('signup')}
                            className="font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                          >
                            Sign Up
                          </button>
                        </div>
                        <div>
                          Are you a verified contributor?{' '}
                          <button
                            type="button"
                            onClick={() => setMode('contributor')}
                            className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                          >
                            Contributor Portal
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === 'contributor' && (
                      <div>
                        Looking for general reader login?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                        >
                          Standard Login
                        </button>
                      </div>
                    )}

                    {mode === 'signup' && (
                      <div>
                        Already registered?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                        >
                          Log In
                        </button>
                      </div>
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
                      className="w-full py-2 rounded-full bg-slate-100 dark:bg-[#181818] hover:bg-slate-200 dark:hover:bg-[#202020] border border-slate-200 dark:border-[#292929] text-xs font-semibold text-slate-700 dark:text-[#FFFFFF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#22C55E]" />
                      <span>Continue as Guest Citizen</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
