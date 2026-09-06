import React, { useState } from 'react';
import { Landmark, BookOpen, ChevronDown, ChevronUp, Sparkles, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConstitutionalPreambleCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setShowAIAssistant, setAiInitialQuestion } = useApp();
  const [showDuties, setShowDuties] = useState(false);

  const fundamentalDuties = [
    'To abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem;',
    'To cherish and follow the noble ideals which inspired our national struggle for freedom;',
    'To uphold and protect the sovereignty, unity and integrity of India;',
    'To defend the country and render national service when called upon to do so;',
    'To promote harmony and the spirit of common brotherhood amongst all the people of India transcending religious, linguistic and regional diversities; to renounce practices derogatory to the dignity of women;',
    'To value and preserve the rich heritage of our composite culture;',
    'To protect and improve the natural environment including forests, lakes, rivers and wildlife, and to have compassion for living creatures;',
    'To develop the scientific temper, humanism and the spirit of inquiry and reform;',
    'To safeguard public property and to abjure violence;',
    'To strive towards excellence in all spheres of individual and collective activity;',
    'Duty of a parent or guardian to provide opportunities for education to their child between the age of six and fourteen years.'
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl liquid-glass-card space-y-6 border border-amber-500/20 dark:border-[#292929] bg-gradient-to-b from-amber-500/[0.04] dark:from-[#181818]/60 to-transparent ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 dark:border-[#222222] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-[#F59E0B]">
              Supreme Law of the Land
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#FFFFFF] font-serif tracking-tight">
              Constitution of India
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            setAiInitialQuestion('Explain the legal importance and basic structure doctrine derived from the Preamble to the Constitution of India.');
            setShowAIAssistant(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 dark:bg-[#181818] dark:border-[#292929] text-amber-700 dark:text-[#F59E0B] text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-[#F59E0B]" />
          <span>Ask AI about Constitution</span>
        </button>
      </div>

      {/* The Preamble Text in traditional stately typesetting */}
      <div className="space-y-4 max-w-3xl mx-auto text-center px-2 sm:px-6">
        <div className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-[#F59E0B]">
          The Preamble
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-[#FFFFFF] font-serif italic">
          &ldquo;WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a{' '}
          <strong className="font-bold text-amber-700 dark:text-[#F59E0B] not-italic">
            SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC
          </strong>{' '}
          and to secure to all its citizens:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-left">
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#121212] border border-amber-500/20 dark:border-[#292929]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#F59E0B] block mb-1">
              JUSTICE
            </span>
            <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
              Social, economic and political
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#121212] border border-amber-500/20 dark:border-[#292929]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#F59E0B] block mb-1">
              LIBERTY
            </span>
            <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
              Of thought, expression, belief, faith and worship
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#121212] border border-amber-500/20 dark:border-[#292929]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#F59E0B] block mb-1">
              EQUALITY
            </span>
            <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
              Of status and of opportunity, and to promote among them all
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#121212] border border-amber-500/20 dark:border-[#292929]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#F59E0B] block mb-1">
              FRATERNITY
            </span>
            <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
              Assuring the dignity of the individual and the unity and integrity of the Nation
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#777777] font-serif italic pt-2">
          IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.&rdquo;
        </p>
      </div>

      {/* Fundamental Duties Toggle */}
      <div className="pt-2 border-t border-black/5 dark:border-[#222222]">
        <button
          type="button"
          onClick={() => setShowDuties(!showDuties)}
          className="w-full flex items-center justify-between p-3 rounded-2xl liquid-pill text-xs font-bold text-slate-800 dark:text-[#FFFFFF] cursor-pointer hover:text-amber-600 dark:hover:text-[#F59E0B] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 dark:text-[#F59E0B]" />
            <span>Article 51A: Fundamental Duties of Every Citizen of India (11 Duties)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-[#777777]">
            <span>{showDuties ? 'Hide' : 'View'}</span>
            {showDuties ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDuties && (
          <div className="mt-3 p-4 rounded-2xl bg-white/50 dark:bg-[#121212] border border-slate-200/70 dark:border-[#292929] space-y-2.5 animate-in fade-in">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777] block">
              Article 51A (Part IVA) — It shall be the duty of every citizen of India:
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-[#B3B3B3] leading-relaxed">
              {fundamentalDuties.map((duty, idx) => (
                <li key={idx} className="pl-1">
                  <span>{duty}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

    </div>
  );
};
