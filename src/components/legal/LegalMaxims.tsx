import React, { useState } from 'react';
import { Scale, BookOpen, ChevronRight, Sparkles, Quote } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface LegalMaxim {
  latin: string;
  pronunciation?: string;
  translation: string;
  meaning: string;
  courtApplication: string;
  relevantLaw: string;
}

export const LEGAL_MAXIMS: LegalMaxim[] = [
  {
    latin: 'Ignorantia juris non excusat',
    translation: 'Ignorance of the law excuses no one',
    meaning: 'A person who is unaware of a law may not escape liability for violating that law merely by being unaware of its existence.',
    courtApplication: 'Consistently affirmed by the Supreme Court of India: every citizen is presumed to know the statutory law of the land.',
    relevantLaw: 'Foundational Principle of Criminal Law (BNS 2023)'
  },
  {
    latin: 'Audi alteram partem',
    translation: 'Listen to the other side (Hear both sides)',
    meaning: 'No person shall be judged unheard or condemned without being given a fair opportunity to present their case and defence.',
    courtApplication: 'Core pillar of Natural Justice under Article 14 and Article 21 of the Constitution of India (Maneka Gandhi v. Union of India).',
    relevantLaw: 'Article 14 & 21 Constitution of India'
  },
  {
    latin: 'Ubi jus ibi remedium',
    translation: 'Where there is a right, there is a remedy',
    meaning: 'If an individual has a legal right, the legal system must provide a procedural mechanism or forum to enforce that right and seek redress.',
    courtApplication: 'Foundation of writ jurisdiction under Article 32 (Supreme Court) and Article 226 (High Courts) of the Indian Constitution.',
    relevantLaw: 'Article 32 & 226 Constitution of India'
  },
  {
    latin: 'Nemo debet bis vexari pro una et eadem causa',
    translation: 'No one should be twice vexed for the same cause',
    meaning: 'The doctrine of Double Jeopardy: an individual cannot be tried, prosecuted, or punished more than once for the same specific offence.',
    courtApplication: 'Guaranteed as a Fundamental Right under Article 20(2) and codified in Section 337 BNSS 2023 (formerly Section 300 CrPC).',
    relevantLaw: 'Article 20(2) & Section 337 BNSS'
  },
  {
    latin: 'Actus non facit reum nisi mens sit rea',
    translation: 'An act does not make one guilty unless the mind is also guilty',
    meaning: 'To constitute a criminal offence, both a physical wrongful act (actus reus) and a culpable guilty state of mind (mens rea) must coincide.',
    courtApplication: 'Underlying framework for General Exceptions under Chapter III of the Bharatiya Nyaya Sanhita (BNS 2023).',
    relevantLaw: 'Chapter III Bharatiya Nyaya Sanhita 2023'
  },
  {
    latin: 'Res ipsa loquitur',
    translation: 'The thing speaks for itself',
    meaning: 'A doctrine in law of torts and negligence where the very nature of an accident implies that negligence must have caused it without direct proof.',
    courtApplication: 'Applied extensively in medical negligence and public utility accidents by Indian High Courts and Consumer Forums.',
    relevantLaw: 'Law of Torts & Consumer Protection Act 2019'
  },
  {
    latin: 'Damnum sine injuria',
    translation: 'Damage without legal injury',
    meaning: 'Actual financial or physical loss suffered without the infringement of a legally recognized legal right creates no cause of action.',
    courtApplication: 'Established principle in competition and business law: fair competition causing trade loss is not actionable under tort.',
    relevantLaw: 'Principles of Civil Law and Jurisprudence'
  },
  {
    latin: 'Injuria sine damno',
    translation: 'Legal injury without actual financial damage',
    meaning: 'The violation of an absolute legal right (such as the right to vote or right to personal liberty) is actionable even if no monetary loss occurred.',
    courtApplication: 'Supreme Court holds that unauthorized detention or denial of fundamental liberties warrants constitutional compensation.',
    relevantLaw: 'Article 21 & Public Law Remedies'
  }
];

export const LegalMaxims: React.FC<{ limit?: number; className?: string }> = ({ limit, className = '' }) => {
  const { setFilters, setActiveTab, setShowAIAssistant, setAiInitialQuestion } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const displayList = limit ? LEGAL_MAXIMS.slice(0, limit) : LEGAL_MAXIMS;
  const current = displayList[selectedIdx] || displayList[0];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
          <Scale className="w-4 h-4" />
          <span>Foundational Jurisprudence</span>
        </div>
        <button
          onClick={() => {
            setAiInitialQuestion('Explain the most important legal maxims used in Indian courts and their practical impact on citizens.');
            setShowAIAssistant(true);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Legal Maxims with AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Maxim selector chips/buttons */}
        <div className="lg:col-span-5 space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {displayList.map((maxim, idx) => (
            <button
              key={maxim.latin}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-gradient-to-r from-orange-500/15 to-amber-500/10 dark:from-[#181818] dark:to-[#181818] border-orange-500/40 dark:border-[#7C5CFF]/50 text-slate-900 dark:text-[#FFFFFF] shadow-sm'
                  : 'bg-white/60 dark:bg-[#121212] border-slate-200/80 dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3] hover:bg-slate-100/80 dark:hover:bg-[#181818]'
              }`}
            >
              <div className="text-xs font-bold font-serif italic text-orange-600 dark:text-[#7C5CFF]">
                {maxim.latin}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-[#B3B3B3] line-clamp-1 mt-0.5">
                {maxim.translation}
              </div>
            </button>
          ))}
        </div>

        {/* Right: Detailed Maxim Spotlight */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl liquid-glass-card flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#7C5CFF]">
                <Quote className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-[#181818] border border-transparent dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3]">
                Latin Legal Doctrine
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold font-serif italic text-slate-900 dark:text-[#FFFFFF] tracking-tight">
                &ldquo;{current.latin}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-[#7C5CFF] mt-1">
                Translation: {current.translation}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200/70 dark:border-[#292929] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
                Legal Principle & Scope
              </span>
              <p className="text-xs text-slate-700 dark:text-[#B3B3B3] leading-relaxed">
                {current.meaning}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-800 dark:text-[#FFFFFF]">
                Application in Indian Courts:
              </span>
              <p className="text-slate-600 dark:text-[#B3B3B3] text-xs leading-relaxed">
                {current.courtApplication}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-black/5 dark:border-[#222222] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-[#777777]">
              Statutory Basis: <strong className="text-slate-800 dark:text-[#FFFFFF]">{current.relevantLaw}</strong>
            </span>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, query: current.relevantLaw }));
                setActiveTab('search');
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
            >
              <span>Search Provisions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
