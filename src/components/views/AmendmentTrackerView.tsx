import React, { useState, useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  Search, 
  ExternalLink, 
  Calendar, 
  FileText, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UPDATE_HISTORY } from '../../data/laws';
import { MOTION_SPRINGS } from '../../utils/motion';

export const AmendmentTrackerView = memo(() => {
  const { laws, openLawDetail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Extract all amendments from laws database plus update history
  const allAmendments = useMemo(() => {
    const list: Array<{
      id: string;
      law_id: string;
      act_name: string;
      section_number: string;
      change_type: string;
      description: string;
      effective_date: string;
      source: string;
      source_url?: string;
      status?: string;
      is_new_replacement?: boolean;
    }> = [];

    // Add base updates
    UPDATE_HISTORY.forEach(upd => {
      list.push({
        ...upd,
        is_new_replacement: upd.change_type === 'New Section'
      });
    });

    // Add amendments logged in individual laws
    laws.forEach(law => {
      if (law.amendment_history && law.amendment_history.length > 0) {
        law.amendment_history.forEach((ah, idx) => {
          const uniqueId = `law-amend-${law.id}-${idx}`;
          if (!list.some(item => item.id === uniqueId)) {
            list.push({
              id: uniqueId,
              law_id: law.id,
              act_name: law.act_name,
              section_number: law.section_number,
              change_type: 'Statutory Amendment',
              description: ah.what_changed,
              effective_date: ah.date,
              source: ah.citation,
              source_url: ah.gazette_url || law.source_url,
              status: law.status,
              is_new_replacement: ah.what_changed.toLowerCase().includes('replaced')
            });
          }
        });
      }
    });

    return list;
  }, [laws]);

  const filteredAmendments = useMemo(() => {
    return allAmendments.filter(item => {
      const matchesSearch = 
        !searchTerm || 
        item.act_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.section_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = 
        selectedType === 'all' ||
        (selectedType === 'new' && item.is_new_replacement) ||
        (selectedType === 'amendment' && !item.is_new_replacement);

      return matchesSearch && matchesType;
    });
  }, [allAmendments, searchTerm, selectedType]);

  return (
    <div className="space-y-6 pb-12 view-blur-open">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-[#7C5CFF]">
          <History className="w-4 h-4" />
          <span>Statutory Audit Trail</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Statutory Amendment Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] max-w-3xl">
          Tracks legislative changes, gazette notifications, and commencement dates cross-checked against the Gazette of India (egazette.gov.in) and India Code. Flags when a source document has changed since last verification.
        </p>
      </div>

      {/* Verification Notice Card */}
      <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-[#60A5FA] shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-white">
            Official Gazette Cross-Check Active
          </div>
          <div>
            Every amendment listed below carries its official Ministry Gazette citation, enactment date, and diff summary. Landmark 2024 updates include the nationwide transition from IPC/CrPC/Evidence Act to the Bharatiya Nyaya Sanhita, BNSS, and BSA on 1 July 2024.
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search amendments by Act, Section, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full liquid-pill text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 dark:focus:border-[#7C5CFF] transition-colors dark:bg-[#151515] dark:border-[#292929]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'liquid-pill text-slate-600 dark:text-[#B3B3B3]'
            }`}
          >
            All Updates ({allAmendments.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('new')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'new'
                ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white'
                : 'liquid-pill text-slate-600 dark:text-[#B3B3B3]'
            }`}
          >
            New Codes / Replacements
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('amendment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedType === 'amendment'
                ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white'
                : 'liquid-pill text-slate-600 dark:text-[#B3B3B3]'
            }`}
          >
            Amendments
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredAmendments.map((amend) => (
          <motion.div
            key={amend.id}
            whileHover={{ y: -2 }}
            transition={MOTION_SPRINGS.gentle}
            className="p-4 sm:p-5 rounded-2xl liquid-glass-card border border-slate-200 dark:border-[#292929] space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#a78bfa] border border-orange-500/20 dark:border-[#7C5CFF]/30">
                    {amend.section_number}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {amend.act_name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    amend.is_new_replacement
                      ? 'bg-purple-500/15 text-purple-700 dark:text-[#C084FC] border-purple-500/25'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-[#22C55E] border-emerald-500/25'
                  }`}>
                    {amend.change_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-[#777777]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Effective: <strong className="text-slate-900 dark:text-white">{amend.effective_date}</strong></span>
              </div>
            </div>

            {/* Description of change */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {amend.description}
            </p>

            {/* Source & Actions */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-[#222222] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-[11px] text-slate-500 dark:text-[#777777] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#22C55E]" />
                <span>Official Citation: <strong>{amend.source}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                {amend.source_url && (
                  <a
                    href={amend.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#60A5FA] hover:underline"
                  >
                    <span>e-Gazette Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {amend.law_id && (
                  <button
                    type="button"
                    onClick={() => openLawDetail(amend.law_id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-[#7C5CFF] hover:underline cursor-pointer"
                  >
                    <span>View Section</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAmendments.length === 0 && (
          <div className="p-8 text-center rounded-2xl liquid-glass-card space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No matching amendments found
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#777777]">
              Try searching with a different keyword or view all updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

AmendmentTrackerView.displayName = 'AmendmentTrackerView';
