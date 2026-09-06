import React, { useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RefreshStatusToast: React.FC = () => {
  const { refreshToast, dismissRefreshToast } = useApp();

  useEffect(() => {
    if (refreshToast?.visible) {
      const timer = setTimeout(() => {
        dismissRefreshToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [refreshToast, dismissRefreshToast]);

  if (!refreshToast?.visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md bg-white/95 dark:bg-[#121212]/95 border border-emerald-500/30 dark:border-[#22C55E]/30 rounded-2xl p-4 shadow-xl glass-panel backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/15 dark:bg-[#22C55E]/15 text-emerald-600 dark:text-[#22C55E] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#22C55E]">
            Official Sources Verified
          </div>
          <p className="text-xs text-slate-700 dark:text-[#B3B3B3] mt-1 leading-relaxed">
            {refreshToast.message}
          </p>
        </div>
        <button
          onClick={dismissRefreshToast}
          className="text-slate-400 dark:text-[#777777] hover:text-slate-700 dark:hover:text-[#FFFFFF] p-1 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
