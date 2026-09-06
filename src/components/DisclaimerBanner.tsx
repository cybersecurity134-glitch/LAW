import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 dark:bg-[#121212] dark:from-transparent dark:to-transparent border-y sm:border sm:rounded-2xl border-amber-500/30 dark:border-[#292929] px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-2xl transition-all shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4)] dark:shadow-none sm:my-2 max-w-7xl sm:mx-auto">
      <div className="flex items-start justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-orange-500/20 dark:bg-[#F59E0B]/15 text-orange-400 dark:text-[#F59E0B] shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-orange-600 dark:text-[#F59E0B] tracking-wider uppercase">
                Legal Information & Educational Notice
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 dark:bg-[#F59E0B]/15 text-orange-700 dark:text-[#F59E0B]">
                <ShieldCheck className="w-3 h-3" />
                Govt. Reference Grounded
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3B3B3] mt-0.5 leading-relaxed">
              This application provides verified statutory legal information and simplified educational explanations. It is <strong className="text-slate-950 dark:text-[#FFFFFF] font-semibold">not a substitute for professional legal advice or representation from a qualified advocate</strong>. In specific disputes or court proceedings, please consult an advocate enrolled with the Bar Council of India.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-orange-400/60 dark:text-[#777777] hover:text-orange-300 dark:hover:text-[#FFFFFF] hover:bg-orange-500/10 dark:hover:bg-[#181818] rounded-lg transition-colors shrink-0"
          aria-label="Dismiss disclaimer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
