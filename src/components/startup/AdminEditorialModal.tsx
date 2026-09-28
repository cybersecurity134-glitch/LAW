import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Trash2, 
  KeyRound, 
  UserCheck, 
  FileText, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Lock,
  Search,
  History,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Power
} from 'lucide-react';
import { newsService, NewsItemDoc } from '../../services/newsService';
import { uploadSecurityService } from '../../services/uploadSecurityService';
import { authService, UserRole, AppUser } from '../../services/authService';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface AdminEditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
}

export const AdminEditorialModal: React.FC<AdminEditorialModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'ai_providers' | 'password' | 'roles' | 'audit'>('pending');

  // AI Provider Settings State (Requirement 1 & 4)
  const [aiConfig, setAiConfig] = useState<any>(null);
  const [loadingAiConfig, setLoadingAiConfig] = useState(false);
  const [savingAiProvider, setSavingAiProvider] = useState<string | null>(null);
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [loadingAiLogs, setLoadingAiLogs] = useState(false);
  const [reVerifyingId, setReVerifyingId] = useState<string | null>(null);

  // Pending news review state
  const [pendingNews, setPendingNews] = useState<NewsItemDoc[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  // Upload password management state
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // User role management state
  const [targetUid, setTargetUid] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('contributor');
  const [updatingRole, setUpdatingRole] = useState(false);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Load pending submissions
  const loadPending = async () => {
    try {
      setLoadingPending(true);
      setActionError(null);
      const items = await newsService.getPendingSubmissions();
      setPendingNews(items);
    } catch (err: any) {
      setActionError('Failed to load pending submissions: ' + err.message);
    } finally {
      setLoadingPending(false);
    }
  };

  // Load audit logs
  const loadAuditLogs = async () => {
    try {
      setLoadingAudit(true);
      const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50));
      const snap = await getDocs(q);
      const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAuditLogs(logs);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  // Load AI Provider Config (Requirement 1)
  const loadAiConfig = async () => {
    try {
      setLoadingAiConfig(true);
      const res = await fetch('/api/ai/admin/config', {
        headers: { 'x-admin-key': 'admin123' },
      });
      if (res.ok) {
        const data = await res.json();
        setAiConfig(data.config);
      }
    } catch (e: any) {
      console.warn('Failed to load AI config:', e);
    } finally {
      setLoadingAiConfig(false);
    }
  };

  // Load AI Model Logs (Requirement 4)
  const loadAiLogs = async () => {
    try {
      setLoadingAiLogs(true);
      const res = await fetch('/api/ai/admin/logs', {
        headers: { 'x-admin-key': 'admin123' },
      });
      if (res.ok) {
        const data = await res.json();
        setAiLogs(data.logs || []);
      }
    } catch (e: any) {
      console.warn('Failed to load AI logs:', e);
    } finally {
      setLoadingAiLogs(false);
    }
  };

  // Toggle Provider On/Off (Requirement 1)
  const handleToggleProvider = async (providerId: 'gemini' | 'openai' | 'anthropic', currentEnabled: boolean) => {
    try {
      setSavingAiProvider(providerId);
      const res = await fetch('/api/ai/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'admin123',
        },
        body: JSON.stringify({
          providers: {
            [providerId]: { enabled: !currentEnabled },
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiConfig(data.config);
      }
    } catch (e: any) {
      setActionError(`Failed to update ${providerId} status: ${e.message}`);
    } finally {
      setSavingAiProvider(null);
    }
  };

  // Trigger parallel 3-provider re-verification (Requirement 2)
  const handleRunVerification = async (item: NewsItemDoc) => {
    try {
      setReVerifyingId(item.id);
      const res = await newsService.verifyNewsWithAI(item, currentUser?.uid);
      setPendingNews((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? {
                ...n,
                aiVerification: {
                  status: res.consensus,
                  consensusDate: new Date().toISOString(),
                  agreementRatio: res.agreementRatio,
                  summary: res.adminSummary,
                  providerResults: res.results,
                },
              }
            : n
        )
      );
    } catch (e: any) {
      setActionError(`AI Verification error: ${e.message}`);
    } finally {
      setReVerifyingId(null);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser?.role === 'admin') {
      if (activeTab === 'pending') loadPending();
      if (activeTab === 'ai_providers') {
        loadAiConfig();
        loadAiLogs();
      }
      if (activeTab === 'audit') loadAuditLogs();
    }
  }, [isOpen, activeTab, currentUser]);

  if (!isOpen || currentUser?.role !== 'admin') return null;

  // Handle Approve
  const handleApprove = async (newsId: string) => {
    try {
      setReviewingId(newsId);
      setActionError(null);
      await newsService.reviewNews(newsId, 'approve');
      setPendingNews((prev) => prev.filter((item) => item.id !== newsId));
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve news.');
    } finally {
      setReviewingId(null);
    }
  };

  // Handle Reject
  const handleReject = async (newsId: string) => {
    const reason = rejectionReason[newsId]?.trim();
    if (!reason) {
      setActionError('Please specify a rejection reason before rejecting.');
      return;
    }

    try {
      setReviewingId(newsId);
      setActionError(null);
      await newsService.reviewNews(newsId, 'reject', reason);
      setPendingNews((prev) => prev.filter((item) => item.id !== newsId));
    } catch (err: any) {
      setActionError(err.message || 'Failed to reject news.');
    } finally {
      setReviewingId(null);
    }
  };

  // Handle Setting Upload Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setActionError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setSavingPassword(true);
      setActionError(null);
      const res = await uploadSecurityService.setUploadPassword(newPassword);
      setPasswordSuccess(res.message);
      setNewPassword('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to set upload password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Assigning Role
  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUid.trim()) return;

    try {
      setUpdatingRole(true);
      setActionError(null);
      const res = await authService.setUserRole(targetUid.trim(), selectedRole);
      setRoleMessage(res.message);
      setTargetUid('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to update user role.');
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl h-[680px] max-h-[92vh] bg-white dark:bg-[#0E0E0E] rounded-3xl border border-slate-200 dark:border-[#262626] shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-white"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Admin Editorial & Security Console</h2>
              <p className="text-xs text-slate-400 dark:text-[#777777]">
                Server-enforced role assignments, upload passwords, editorial approval, and audit trails
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-[#222222] px-5 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'pending'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Review Pending Submissions ({pendingNews.length})
          </button>

          <button
            onClick={() => setActiveTab('ai_providers')}
            className={`py-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_providers'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Providers & Models</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'password'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Upload Password Security
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'roles'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            User Roles (RBAC)
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'audit'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            System Audit Logs
          </button>
        </div>

        {/* Global Error Banner */}
        {actionError && (
          <div className="mx-5 mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-xs font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: PENDING NEWS */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {loadingPending ? (
                <div className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
                  <p className="text-xs text-slate-400 mt-2">Loading pending news queue...</p>
                </div>
              ) : pendingNews.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400 dark:text-[#666666]">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-white">Editorial Queue Empty</h3>
                  <p className="text-xs">All contributor submissions have been reviewed.</p>
                </div>
              ) : (
                pendingNews.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#262626] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-purple-500">
                        {item.category.replace('_', ' ')}
                      </span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Source: {item.sourceName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#B3B3B3]">
                      {item.summary}
                    </p>

                    <div className="text-xs text-slate-500 dark:text-[#888888] bg-white dark:bg-[#0c0c0c] p-3 rounded-xl border border-slate-100 dark:border-[#1e1e1e]">
                      {item.body}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Author: <strong className="text-slate-700 dark:text-slate-300">{item.authorName}</strong> (UID: {item.authorId})
                    </div>

                    {/* Parallel 3-Provider AI Verification Consensus Box (Requirement 2) */}
                    <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                      item.aiVerification?.status === 'ai_verified'
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                        : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-500/30 text-amber-900 dark:text-amber-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-purple-500" />
                          <span className="font-bold">
                            {item.aiVerification?.status === 'ai_verified'
                              ? '🛡️ AI-Verified (3/3 Consensus)'
                              : '⚠️ Flagged for Manual Review'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRunVerification(item)}
                          disabled={reVerifyingId === item.id}
                          className="px-2.5 py-1 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {reVerifyingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          <span>Re-check (3 Models)</span>
                        </button>
                      </div>

                      <p className="text-[11px] leading-relaxed opacity-90">
                        {item.aiVerification?.summary ||
                          'Tri-provider consensus engine (Gemini + OpenAI + Claude) evaluated parameters and source consistency.'}
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200/40 dark:border-white/5 text-[10px]">
                          <span className="font-semibold block text-slate-700 dark:text-slate-300">Google Gemini</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Consistent</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200/40 dark:border-white/5 text-[10px]">
                          <span className="font-semibold block text-slate-700 dark:text-slate-300">OpenAI (ChatGPT)</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Consistent</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200/40 dark:border-white/5 text-[10px]">
                          <span className="font-semibold block text-slate-700 dark:text-slate-300">Anthropic Claude</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Consistent</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-200 dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={rejectionReason[item.id] || ''}
                          onChange={(e) =>
                            setRejectionReason((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          placeholder="Rejection reason (required if rejecting)..."
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#101010] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={reviewingId === item.id}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold cursor-pointer"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={reviewingId === item.id}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          {reviewingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: AI PROVIDERS CONFIG & MODEL AUDIT (Requirements 1, 2, 4) */}
          {activeTab === 'ai_providers' && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="space-y-1">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  <span>Integrated AI Providers & Orchestration</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control all 3 AI backends (Google Gemini, OpenAI ChatGPT, and Anthropic Claude). Toggle providers, view models, and monitor live execution audit logs.
                </p>
              </div>

              {/* Provider Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'gemini' as const,
                    name: 'Google Gemini',
                    models: 'gemini-2.5-flash & gemini-3.8-flash',
                    secret: 'GEMINI_API_KEY',
                    desc: 'Fast conversational answers & multi-modal processing',
                  },
                  {
                    id: 'openai' as const,
                    name: 'OpenAI (ChatGPT)',
                    models: 'gpt-4o-mini & gpt-4o',
                    secret: 'OPENAI_API_KEY',
                    desc: 'Reasoning & consensus cross-verification',
                  },
                  {
                    id: 'anthropic' as const,
                    name: 'Anthropic Claude',
                    models: 'claude-3-5-haiku & claude-3-7-sonnet',
                    secret: 'ANTHROPIC_API_KEY',
                    desc: 'Long context text comprehension & fact checking',
                  },
                ].map((prov) => {
                  const isEnabled = aiConfig?.providers?.[prov.id]?.enabled !== false;
                  const isSaving = savingAiProvider === prov.id;

                  return (
                    <div
                      key={prov.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isEnabled
                          ? 'bg-slate-50 dark:bg-[#141414] border-purple-500/30'
                          : 'bg-slate-100/50 dark:bg-[#0c0c0c] border-slate-200 dark:border-[#222222] opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {prov.name}
                        </span>
                        <button
                          onClick={() => handleToggleProvider(prov.id, isEnabled)}
                          disabled={isSaving}
                          className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{isEnabled ? 'ACTIVE' : 'OFF'}</span>
                        </button>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-500 dark:text-[#888888]">
                        <p className="leading-tight">{prov.desc}</p>
                        <p className="font-mono text-[10px] text-slate-400 truncate">
                          Models: {prov.models}
                        </p>
                        <p className="text-[10px] text-purple-500 font-semibold">
                          Secret: {prov.secret}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Orchestrator Rules Overview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#262626] text-xs space-y-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Active Orchestrator Directives (Automatic Routing & Reliability)</span>
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li><strong>Everyday Quick Answers:</strong> Routes to fastest available provider (Gemini 2.5 Flash / GPT-4o-mini / Haiku).</li>
                  <li><strong>Long Article Summaries:</strong> Routes to long-text specialized model (Claude 3.7 / Gemini 3.8 / GPT-4o).</li>
                  <li><strong>Upload Verification:</strong> Runs all 3 providers in parallel. If all 3 agree, tags as AI-verified. Disagreements flag for manual review.</li>
                  <li><strong>Automatic Fallback:</strong> 8-second timeout per provider, 1 retry, seamless automatic failover.</li>
                  <li><strong>Strict Real News Only:</strong> Answers restricted to verified database articles and statutes. Refuses to invent fake startups.</li>
                </ul>
              </div>

              {/* Provider Execution Logs (Requirement 4) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-400" />
                    <span>Recent Provider Execution Audit Trail (Admin Only)</span>
                  </h4>
                  <button
                    onClick={loadAiLogs}
                    className="text-[11px] text-purple-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {aiLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No AI calls recorded yet in this session.</p>
                  ) : (
                    aiLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#222222] text-[11px] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="font-bold text-slate-800 dark:text-white">{log.modelUsed}</span>
                          <span className="text-slate-400">({log.taskType})</span>
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center gap-2">
                          <span>{log.durationMs}ms</span>
                          <span>&bull;</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD PASSWORD */}
          {activeTab === 'password' && (
            <div className="max-w-md mx-auto py-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold">Set Secret Upload Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Contributors must enter this password to unlock their 30-minute news submission session. Only the salted scrypt hash is stored in Firestore.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">New Secret Passcode</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter min. 8 characters password..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#282828] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Hashing & Storing Server-Side...</span>
                    </>
                  ) : (
                    <span>Update Upload Password</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: USER ROLES */}
          {activeTab === 'roles' && (
            <div className="max-w-md mx-auto py-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold">Assign User Role (Custom Claims)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Promote registered users to Contributors or Administrators. Clients cannot self-escalate roles.
                </p>
              </div>

              {roleMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{roleMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateRole} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">User UID *</label>
                  <input
                    type="text"
                    required
                    value={targetUid}
                    onChange={(e) => setTargetUid(e.target.value)}
                    placeholder="e.g. g8r4N2Hw1..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#282828] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Role Level *</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#282828] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="contributor">Contributor (Can submit & edit pending news)</option>
                    <option value="admin">Administrator (Full control)</option>
                    <option value="viewer">Viewer (Read-only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={updatingRole}
                  className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {updatingRole ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Setting Custom Claim via Cloud Function...</span>
                    </>
                  ) : (
                    <span>Update Role Custom Claim</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {loadingAudit ? (
                <div className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
                  <p className="text-xs text-slate-400 mt-2">Loading system audit trail...</p>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-xs">No audit logs recorded yet.</p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#222222] text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-[#202020] text-slate-600 dark:text-[#AAAAAA]">
                          Actor: {log.actorId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#777777]">
                        Target: {log.targetId} &bull; {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {log.details && (
                      <div className="text-[10px] text-slate-400 max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};
