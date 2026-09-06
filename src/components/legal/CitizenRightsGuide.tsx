import React from 'react';
import { Shield, CheckCircle2, Bookmark, ArrowUpRight, Scale, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface CitizenRight {
  id: string;
  title: string;
  provision: string;
  tag: string;
  summary: string;
  keyProtections: string[];
  searchQuery: string;
}

export const CITIZEN_RIGHTS: CitizenRight[] = [
  {
    id: 'zero-fir',
    title: 'Right to File a Zero FIR',
    provision: 'Section 173(1) BNSS 2023',
    tag: 'Criminal Procedure',
    summary: 'Any police station is legally mandated to register an FIR irrespective of where the crime occurred. It is subsequently transferred to the competent territorial police station.',
    keyProtections: [
      'Police cannot refuse registration citing territorial jurisdiction',
      'Immediate medical examination and evidence recording initiated',
      'Complainant receives a free copy of the registered Zero FIR immediately'
    ],
    searchQuery: 'Zero FIR Section 173 BNSS'
  },
  {
    id: 'arrest-rights',
    title: 'Right of Arrested Person & Legal Consultation',
    provision: 'Section 37 BNSS 2023 / Article 22(1)',
    tag: 'Constitutional Rights',
    summary: 'Any person arrested has the inalienable right to know grounds of arrest, nominate one relative or friend to be immediately notified, and consult an advocate of choice.',
    keyProtections: [
      'Police officer must display clear identification badge and name tag',
      'Information of arrest must be entered into the district digital register',
      'Right to meet an advocate during interrogation (Section 38 BNSS)'
    ],
    searchQuery: 'Section 37 BNSS arrest rights'
  },
  {
    id: 'women-arrest',
    title: 'Arrest of Women Guidelines & Timing',
    provision: 'Section 43 BNSS 2023',
    tag: 'Women Protections',
    summary: 'No woman can be arrested after sunset and before sunrise except in exceptional circumstances with prior written sanction of a Judicial Magistrate.',
    keyProtections: [
      'Only a female police officer may arrest and search a woman',
      'Medical examination of female accused must be done by or under supervision of female medical officer',
      'Right to maintain privacy and dignity at all stages of custodial process'
    ],
    searchQuery: 'Section 43 BNSS arrest woman'
  },
  {
    id: 'free-legal-aid',
    title: 'Right to Free Legal Services (NALSA)',
    provision: 'Article 39A & Legal Services Authorities Act 1987',
    tag: 'Equal Justice',
    summary: 'The State provides free competent legal services to women, children, SC/ST citizens, custody victims, industrial workmen, and persons earning under statutory income ceilings.',
    keyProtections: [
      'Free representation by empanelled legal aid advocate in all trial courts & High Courts',
      'Free court fees, process charges, and document preparation funded by DLSA',
      'Access via National Legal Aid Toll-Free helpline 15100'
    ],
    searchQuery: 'Legal Aid NALSA Article 39A'
  },
  {
    id: 'remand-limit',
    title: 'Production Before Magistrate Within 24 Hours',
    provision: 'Article 22(2) & Section 58 BNSS 2023',
    tag: 'Personal Liberty',
    summary: 'No arrested person may be detained in police custody for more than 24 hours (excluding journey time) without explicit judicial remand authorized by a Magistrate.',
    keyProtections: [
      'Unlawful detention beyond 24 hours is unconstitutional under Article 21',
      'Enables right to file Habeas Corpus petition under Article 32 or Article 226',
      'Right to mandatory medical examination before judicial remand'
    ],
    searchQuery: 'Article 22 Section 58 BNSS 24 hours'
  },
  {
    id: 'self-incrimination',
    title: 'Protection Against Self-Incrimination',
    provision: 'Article 20(3) Constitution of India',
    tag: 'Fundamental Rights',
    summary: 'No person accused of an offence shall be compelled to be a witness against themselves. Confessions made solely in police custody are inadmissible in evidence without judicial safeguards.',
    keyProtections: [
      'Right to remain silent during police interrogation',
      'Involuntary narco-analysis and lie-detector tests violate Article 20(3) (Selvi v. State of Karnataka)',
      'Confession must be recorded under Section 183 BNSS before a Magistrate'
    ],
    searchQuery: 'Article 20 self incrimination evidence'
  }
];

export const CitizenRightsGuide: React.FC<{ limit?: number; className?: string }> = ({ limit, className = '' }) => {
  const { setFilters, setActiveTab, toggleBookmark, isBookmarked, setShowAIAssistant, setAiInitialQuestion } = useApp();

  const rightsList = limit ? CITIZEN_RIGHTS.slice(0, limit) : CITIZEN_RIGHTS;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
          <Shield className="w-4 h-4" />
          <span>Fundamental Citizen Protections</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-[#777777]">
          Enforceable rights under BNSS 2023 & the Constitution
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rightsList.map(right => (
          <div
            key={right.id}
            className="p-5 rounded-3xl liquid-glass-card flex flex-col justify-between space-y-4 hover:border-orange-500/40 dark:hover:border-[#7C5CFF]/50 transition-all group"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/25">
                  {right.tag}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-[#777777] font-mono">
                  {right.provision}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF] font-display group-hover:text-orange-600 dark:group-hover:text-[#7C5CFF] transition-colors">
                {right.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] leading-relaxed">
                {right.summary}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-[#222222] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
                  Guaranteed Protections:
                </span>
                <ul className="space-y-1">
                  {right.keyProtections.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-[#B3B3B3]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-[#222222] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setAiInitialQuestion(`Explain my rights and legal remedies regarding "${right.title}" under ${right.provision} in India.`);
                  setShowAIAssistant(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Explain Rights</span>
              </button>

              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, query: right.searchQuery }));
                  setActiveTab('search');
                }}
                className="px-3 py-1.5 rounded-full liquid-pill text-xs font-semibold text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                Find Laws
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
