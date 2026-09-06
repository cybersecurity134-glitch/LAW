import React, { useState } from 'react';
import { Gavel, Building2, ChevronRight, Layers, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CourtHierarchyGuide: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setShowAIAssistant, setAiInitialQuestion, setFilters, setActiveTab } = useApp();
  const [activeTab, setActiveHierarchyTab] = useState<'courts' | 'codes'>('courts');

  return (
    <div className={`p-6 sm:p-8 rounded-3xl liquid-glass-card space-y-6 ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
            <Gavel className="w-4 h-4" />
            <span>Structural Jurisprudence</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
            The Indian Judicial & Statutory Framework
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3]">
            Understand how Indian courts function and how the three foundational criminal codes interconnect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveHierarchyTab('courts')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'courts'
                ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
            }`}
          >
            Court Hierarchy
          </button>
          <button
            onClick={() => setActiveHierarchyTab('codes')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'codes'
                ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                : 'liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
            }`}
          >
            The 3 New Codes
          </button>
        </div>
      </div>

      {activeTab === 'courts' ? (
        /* Court Hierarchy Breakdown */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Level 1: Supreme Court */}
          <div className="p-4 rounded-2xl bg-orange-500/10 dark:bg-[#181818] border border-orange-500/30 dark:border-[#292929] flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
                Level 1 • Apex Judicial Authority
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF] font-display mt-0.5">
                Supreme Court of India
              </h4>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#777777]">
                Article 124–147
              </span>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-2 leading-relaxed">
                Highest constitutional and appellate court. Law declared by the Supreme Court is binding on all courts within India (Article 141).
              </p>
            </div>
            <div className="pt-2 border-t border-orange-500/20 dark:border-[#222222] text-[11px] font-semibold text-orange-600 dark:text-[#7C5CFF]">
              Writs (Art 32) • Special Leave (Art 136)
            </div>
          </div>

          {/* Level 2: High Courts */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-[#181818] border border-amber-500/30 dark:border-[#292929] flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#F59E0B]">
                Level 2 • State Apex Court
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF] font-display mt-0.5">
                High Courts (25 in India)
              </h4>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#777777]">
                Article 214–231
              </span>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-2 leading-relaxed">
                Superintends all subordinate courts in the state. Possesses wider writ powers under Article 226 for any legal or fundamental right.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-500/20 dark:border-[#222222] text-[11px] font-semibold text-amber-700 dark:text-[#F59E0B]">
              Writ Petitions (Art 226) • Appeals
            </div>
          </div>

          {/* Level 3: District & Sessions Courts */}
          <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-[#181818] border border-blue-500/30 dark:border-[#292929] flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-[#3B82F6]">
                Level 3 • Principal Trial Court
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF] font-display mt-0.5">
                District & Sessions Courts
              </h4>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#777777]">
                Civil & Criminal Divisions
              </span>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-2 leading-relaxed">
                Principal civil court of original jurisdiction, and Sessions Court for grave criminal trials (offences punishable with &gt;7 years or death).
              </p>
            </div>
            <div className="pt-2 border-t border-blue-500/20 dark:border-[#222222] text-[11px] font-semibold text-blue-600 dark:text-[#3B82F6]">
              Anticipatory Bail • Major Trials
            </div>
          </div>

          {/* Level 4: Magistrates & Tribunals */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-[#181818] border border-emerald-500/30 dark:border-[#292929] flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#22C55E]">
                Level 4 • First Instance & Quasi-Judicial
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF] font-display mt-0.5">
                Magistrates & Tribunals
              </h4>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#777777]">
                CJM, JMFC & Tribunals (NCLT/NGT)
              </span>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-2 leading-relaxed">
                Judicial Magistrates conduct initial remand, bail, and summary trials. Specialized tribunals handle corporate, green, and consumer disputes.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-500/20 dark:border-[#222222] text-[11px] font-semibold text-emerald-600 dark:text-[#22C55E]">
              Remand • Bail • Consumer Forums
            </div>
          </div>

        </div>
      ) : (
        /* The 3 New Criminal Codes Comparison */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#121212] border border-slate-200/80 dark:border-[#292929] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:bg-[#7C5CFF]/15 dark:text-[#7C5CFF]">
                Substantive Law
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-[#777777]">Replaced IPC 1860</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
                Bharatiya Nyaya Sanhita (BNS) 2023
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-1 leading-relaxed">
                Defines what constitutes a crime and sets the statutory punishments, fines, and general exceptions.
              </p>
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-slate-100 dark:border-[#222222]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#777777]">Total Sections:</span>
                <strong className="text-slate-800 dark:text-[#FFFFFF]">358 Sections</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#777777]">Key Modernization:</span>
                <strong className="text-slate-800 dark:text-[#FFFFFF]">Community service, organized crime</strong>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#121212] border border-slate-200/80 dark:border-[#292929] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:bg-[#3B82F6]/15 dark:text-[#3B82F6]">
                Procedural Law
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-[#777777]">Replaced CrPC 1973</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
                Bharatiya Nagarik Suraksha Sanhita (BNSS)
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-1 leading-relaxed">
                Regulates police investigation, Zero FIR, arrest protocols, search and seizure, bail, and court trials.
              </p>
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-slate-100 dark:border-[#222222]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#777777]">Total Sections:</span>
                <strong className="text-slate-800 dark:text-[#FFFFFF]">531 Sections</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#777777]">Key Modernization:</span>
                <strong className="text-slate-800 dark:text-[#FFFFFF]">Mandatory videography, timelines</strong>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#121212] border border-slate-200/80 dark:border-[#292929] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-[#22C55E]/15 dark:text-[#22C55E]">
                Evidentiary Law
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-[#777777]">Replaced IEA 1872</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-[#FFFFFF] font-display">
                Bharatiya Sakshya Adhiniyam (BSA) 2023
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B3B3B3] mt-1 leading-relaxed">
                Governs the admissibility of facts, witness examination, electronic records, forensics, and burden of proof.
              </p>
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-slate-100 dark:border-[#222222]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#777777]">Total Sections:</span>
                <strong className="text-slate-800 dark:text-[#FFFFFF]">170 Sections</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#777777]">Key Modernization:</span>
                <strong className="text-slate-800 dark:text-[#FFFFFF]">Electronic & digital records parity</strong>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Footer link to AI */}
      <div className="pt-2 border-t border-black/5 dark:border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 dark:text-[#B3B3B3]">
          Need help determining which court has jurisdiction over your dispute?
        </span>
        <button
          onClick={() => {
            setAiInitialQuestion('Explain the court jurisdiction and procedure for filing a legal dispute in India.');
            setShowAIAssistant(true);
          }}
          className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Legal Jurisdiction Assistant</span>
        </button>
      </div>

    </div>
  );
};
