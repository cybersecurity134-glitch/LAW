import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Scale, 
  FileCheck2, 
  X,
  ChevronRight,
  Info
} from 'lucide-react';
import { VERIFICATION_METRICS, PHASE_ROADMAP } from '../../data/phaseTracking';

export const CoveragePhaseBanner = memo(() => {
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  return (
    <>
      {/* Top Banner Bar */}
      <div className="rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-[#0d0d0d] dark:via-[#141414] dark:to-[#171424] text-white border border-slate-700/60 dark:border-[#292929] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 font-mono">
                  Phase 1 Foundation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {VERIFICATION_METRICS.verified_central_acts_count} of {VERIFICATION_METRICS.total_central_acts_in_force} Central Acts Verified ({VERIFICATION_METRICS.central_acts_coverage_percentage}%)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hidden sm:inline">
                  Strict Zero-Inference Rule
                </span>
              </div>
              <p className="text-xs text-slate-300 dark:text-[#B3B3B3] leading-relaxed">
                Primary source: <strong className="text-white">India Code (indiacode.nic.in)</strong> &amp; <strong className="text-white">e-Gazette</strong>. Accuracy and verifiability outrank completeness at every step.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              type="button"
              onClick={() => setShowRoadmapModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Phase Roadmap &amp; Audit</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Roadmap & Verification Audit Modal */}
      <AnimatePresence>
        {showRoadmapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#292929] shadow-2xl p-5 sm:p-7 space-y-6 text-slate-900 dark:text-white"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#222222]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-[#60A5FA]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-display">
                      Verified Phase Roadmap &amp; Statutory Audit
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-[#777777]">
                      Transparent tracking of legal coverage and official source compliance
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e1e1e] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Strict Non-Negotiable Rules Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Non-Negotiable Rules of Verification</span>
                </div>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  <li><strong>Zero Memory Hallucination:</strong> No section number, penalty, or statutory wording is ever inferred from model memory.</li>
                  <li><strong>Mandatory Citation:</strong> Every law entry links to its exact source URL on <a href="https://www.indiacode.nic.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-amber-700 dark:text-amber-300">India Code</a> or the e-Gazette.</li>
                  <li><strong>Honest Completeness:</strong> Never claiming 100% statutory coverage prematurely. Currently shipping Phase 1 foundation.</li>
                  <li><strong>Clear Separation:</strong> Plain-language summaries are strictly labeled as unofficial explanations, never confused with official gazette text.</li>
                </ul>
              </div>

              {/* Coverage Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-center">
                  <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-[#60A5FA] font-mono">
                    {VERIFICATION_METRICS.verified_central_acts_count}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-[#777777]">
                    Central Acts Loaded
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-center">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {VERIFICATION_METRICS.total_central_acts_in_force}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-[#777777]">
                    Total In Force
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-center">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-[#22C55E] font-mono">
                    {VERIFICATION_METRICS.central_acts_coverage_percentage}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-[#777777]">
                    Coverage Shipped
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-center">
                  <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-[#A855F7] font-mono">
                    {VERIFICATION_METRICS.verified_state_acts_count}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-[#777777]">
                    State Rules Cataloged
                  </div>
                </div>
              </div>

              {/* Phase Roadmap Progression */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
                  <Layers className="w-4 h-4" />
                  <span>Phase Delivery Schedule</span>
                </div>

                <div className="space-y-3">
                  {PHASE_ROADMAP.map((item) => (
                    <div 
                      key={item.phase_number}
                      className={`p-4 rounded-2xl border ${
                        item.status === 'active'
                          ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30'
                          : item.status === 'in-progress'
                          ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-50 dark:bg-[#181818] border-slate-200 dark:border-[#292929]'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            item.status === 'active'
                              ? 'bg-emerald-500 text-white'
                              : item.status === 'in-progress'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-400 text-white'
                          }`}>
                            {item.status === 'active' ? 'Shipped & Verified' : item.status === 'in-progress' ? 'In Pipeline' : 'Scheduled'}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                          {item.verified_acts_count}/{item.total_targeted_acts} Acts ({item.completion_percentage}%)
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {item.scope_description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.key_statutes.slice(0, 6).map((statute, sIdx) => (
                          <span 
                            key={sIdx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white dark:bg-[#202020] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#333333]"
                          >
                            {statute}
                          </span>
                        ))}
                        {item.key_statutes.length > 6 && (
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 self-center">
                            +{item.key_statutes.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authoritative Repositories of Truth */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#222222]">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#777777]">
                  Primary Sourcing Repositories
                </div>
                <div className="space-y-2">
                  {VERIFICATION_METRICS.primary_sources.map((src, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <a 
                          href={src.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold text-blue-600 dark:text-[#60A5FA] hover:underline flex items-center gap-1"
                        >
                          <span>{src.name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="text-[11px] text-slate-500 dark:text-[#777777]">
                          {src.authority}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          {src.role}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                        Primary Source
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close Roadmap Overview
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

CoveragePhaseBanner.displayName = 'CoveragePhaseBanner';
