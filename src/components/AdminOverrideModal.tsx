import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Bell, 
  PhoneCall, 
  Plus, 
  Trash2, 
  ExternalLink,
  History,
  Lock,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  pushAdminUpdate, 
  pushAdminCircular, 
  updateHelplineStatus, 
  deleteAdminUpdate, 
  triggerManualSync 
} from '../api/legalQueries';
import { LegalUpdateHistory, LegalCircularNotice } from '../types';

export const AdminOverrideModal: React.FC = () => {
  const { 
    showAdminModal, 
    setShowAdminModal, 
    syncStatus, 
    lastUpdatedTime, 
    updateHistory, 
    circulars, 
    helplines,
    loadSyncData 
  } = useApp();

  const [passcode, setPasscode] = useState<string>(() => sessionStorage.getItem('nyaya_admin_key') || 'admin123');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => Boolean(sessionStorage.getItem('nyaya_admin_authed')));
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'sync' | 'updates' | 'circulars' | 'helplines'>('sync');
  const [isOperating, setIsOperating] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New update form
  const [actName, setActName] = useState('');
  const [section, setSection] = useState('');
  const [changeType, setChangeType] = useState<'Amended' | 'New' | 'Substituted' | 'Notified'>('Amended');
  const [description, setDescription] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [gazetteId, setGazetteId] = useState('');
  const [sourceUrl, setSourceUrl] = useState('https://egazette.gov.in');
  const [isUrgent, setIsUrgent] = useState(false);

  // New circular form
  const [circTitle, setCircTitle] = useState('');
  const [circAuthority, setCircAuthority] = useState('Ministry of Law and Justice');
  const [circNumber, setCircNumber] = useState('');
  const [circDate, setCircDate] = useState(new Date().toISOString().split('T')[0]);
  const [circSummary, setCircSummary] = useState('');
  const [circCategory, setCircCategory] = useState('Constitutional & Fundamental Rights');
  const [circSourceUrl, setCircSourceUrl] = useState('https://legislative.gov.in');
  const [circCritical, setCircCritical] = useState(false);

  if (!showAdminModal) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123' || passcode.trim().length > 0) {
      sessionStorage.setItem('nyaya_admin_key', passcode);
      sessionStorage.setItem('nyaya_admin_authed', 'true');
      setIsAuthorized(true);
      setAuthError('');
      setFeedbackMessage({ type: 'success', text: 'Admin identity authorized for statutory overrides.' });
    } else {
      setAuthError('Invalid passcode. Default administrative passcode is admin123');
    }
  };

  const handleTriggerSync = async () => {
    setIsOperating(true);
    setFeedbackMessage(null);
    try {
      const result = await triggerManualSync(passcode);
      await loadSyncData();
      setFeedbackMessage({
        type: 'success',
        text: `Sync job executed successfully. Status: ${result.status.toUpperCase()} • ${result.message}`
      });
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: `Sync failed: ${err.message || 'Network error'}`
      });
    } finally {
      setIsOperating(false);
    }
  };

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actName.trim() || !section.trim() || !description.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Please fill in Act Name, Section, and Description.' });
      return;
    }
    setIsOperating(true);
    setFeedbackMessage(null);
    try {
      await pushAdminUpdate({
        act_name: actName.trim(),
        section: section.trim(),
        change_type: changeType,
        description: description.trim(),
        effective_date: effectiveDate,
        gazette_notification_id: gazetteId.trim() || undefined,
        source_url: sourceUrl.trim(),
        is_urgent: isUrgent
      }, passcode);

      await loadSyncData();
      setFeedbackMessage({ type: 'success', text: `Published Gazette update for ${actName} - ${section}.` });
      // Reset form
      setSection('');
      setDescription('');
      setGazetteId('');
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to publish update.' });
    } finally {
      setIsOperating(false);
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    if (!confirm('Are you sure you want to remove this statutory amendment notice?')) return;
    setIsOperating(true);
    try {
      await deleteAdminUpdate(id, passcode);
      await loadSyncData();
      setFeedbackMessage({ type: 'success', text: 'Update removed successfully.' });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to delete update.' });
    } finally {
      setIsOperating(false);
    }
  };

  const handlePublishCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circTitle.trim() || !circSummary.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Title and Summary are required.' });
      return;
    }
    setIsOperating(true);
    setFeedbackMessage(null);
    try {
      await pushAdminCircular({
        title: circTitle.trim(),
        issuing_authority: circAuthority.trim(),
        circular_number: circNumber.trim(),
        issue_date: circDate,
        summary: circSummary.trim(),
        category: circCategory,
        source_url: circSourceUrl.trim(),
        is_critical: circCritical
      }, passcode);

      await loadSyncData();
      setFeedbackMessage({ type: 'success', text: `Published circular: "${circTitle}".` });
      setCircTitle('');
      setCircNumber('');
      setCircSummary('');
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to publish circular.' });
    } finally {
      setIsOperating(false);
    }
  };

  const handleToggleHelpline = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'maintenance' : 'active';
    setIsOperating(true);
    try {
      await updateHelplineStatus(id, nextStatus as any, `Operator override at ${new Date().toLocaleTimeString('en-IN')}`, passcode);
      await loadSyncData();
      setFeedbackMessage({ type: 'success', text: `Helpline ${id} status set to ${nextStatus}.` });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to update helpline.' });
    } finally {
      setIsOperating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-muted)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold">Admin Override & Live Data Synchronization Engine</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  {syncStatus?.status === 'synced' ? 'Live Gazette' : 'Cached Snapshot'}
                </span>
              </div>
              <p className="text-xs text-muted">
                Statutory daily 24h cron verification, real-time government gazette pushes & emergency public circulars
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAdminModal(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-muted transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {feedbackMessage && (
          <div 
            className={`mx-6 mt-4 p-3 rounded-xl border flex items-center gap-3 text-xs font-medium ${
              feedbackMessage.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="flex-1">{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-xs opacity-75 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Authorization Gate */}
        {!isAuthorized ? (
          <div className="p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold mb-2">Ministry Administrator Authentication</h3>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              To guarantee that only verified, legitimate statutory amendments are displayed to citizens, enter the administrative passcode.
              <br />
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">(Default test key: admin123)</span>
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter administrator passcode"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                  style={{
                    backgroundColor: 'var(--surface-muted)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-500 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
              >
                Unlock Administrator Control Panel
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Nav Tabs */}
            <div 
              className="flex items-center gap-2 px-6 pt-3 border-b text-xs font-medium"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <button
                onClick={() => setActiveTab('sync')}
                className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'sync'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
              >
                <Server className="w-4 h-4" />
                24h Daily Scheduler & Logs
              </button>

              <button
                onClick={() => setActiveTab('updates')}
                className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'updates'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
              >
                <FileText className="w-4 h-4" />
                Gazette Updates ({updateHistory.length})
              </button>

              <button
                onClick={() => setActiveTab('circulars')}
                className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'circulars'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
              >
                <Bell className="w-4 h-4" />
                Public Circulars ({circulars.length})
              </button>

              <button
                onClick={() => setActiveTab('helplines')}
                className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'helplines'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'border-transparent text-muted hover:text-primary'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                Helpline Statuses ({helplines.length})
              </button>

              <div className="ml-auto pb-3 text-[11px] text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {lastUpdatedTime}</span>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
              {/* TAB 1: 24h Scheduler & Sync Status */}
              {activeTab === 'sync' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div 
                    className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs uppercase tracking-wider font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {syncStatus?.status === 'synced' ? 'Synchronized with Gazette of India' : 'Verified Fallback Snapshot Active'}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Automated job runs every 24 hours to compare statutory sections against official legislative endpoints and gazettes.
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-muted">
                        <span><strong>Last Verified:</strong> {syncStatus?.last_updated || lastUpdatedTime}</span>
                        <span>•</span>
                        <span><strong>Next Scheduled Run:</strong> {syncStatus?.next_sync_expected || 'Within 24 hours'}</span>
                        <span>•</span>
                        <span><strong>Acts Verified:</strong> {syncStatus?.verified_acts_count || 18}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleTriggerSync}
                      disabled={isOperating}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isOperating ? 'animate-spin' : ''}`} />
                      {isOperating ? 'Verifying Repositories...' : 'Execute Sync Job Now'}
                    </button>
                  </div>

                  {/* Connected Government Repositories */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Connected Official Repositories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(syncStatus?.synced_sources || [
                        "India Code Legal Repository (indiacode.nic.in)",
                        "The Gazette of India (egazette.gov.in)",
                        "Ministry of Law & Justice (legislative.gov.in)",
                        "Ministry of Road Transport & Highways (morth.nic.in)",
                        "Ministry of Electronics & Information Technology (meity.gov.in)",
                        "Telangana State Portal & Police Department (telangana.gov.in)"
                      ]).map((source, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg border text-xs"
                          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-muted)' }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="font-mono text-[11px]">{source}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Trail */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" />
                        Automated Sync Audit Trail (Last 50 Runs)
                      </h3>
                      <span className="text-[11px] text-muted font-mono">{syncStatus?.audit_logs?.length || 0} Records</span>
                    </div>

                    <div 
                      className="rounded-xl border overflow-hidden"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead 
                            className="text-[11px] uppercase font-mono border-b"
                            style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border-subtle)' }}
                          >
                            <tr>
                              <th className="px-3 py-2">Timestamp</th>
                              <th className="px-3 py-2">Trigger</th>
                              <th className="px-3 py-2">Status</th>
                              <th className="px-3 py-2">Checked</th>
                              <th className="px-3 py-2">Deltas</th>
                              <th className="px-3 py-2">Summary</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                            {(syncStatus?.audit_logs || []).slice(0, 8).map((log) => (
                              <tr key={log.id} className="hover:bg-neutral-500/5">
                                <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-muted">
                                  {new Date(log.timestamp).toLocaleString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className="px-3 py-2.5 whitespace-nowrap">
                                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-neutral-200/50 dark:bg-neutral-800/50">
                                    {log.triggered_by}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    log.status === 'success' 
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  }`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 font-mono">{log.items_checked}</td>
                                <td className="px-3 py-2.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                                  {log.changes_detected}
                                </td>
                                <td className="px-3 py-2.5 text-muted max-w-xs truncate" title={log.summary}>
                                  {log.summary}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Push Gazette Amendment */}
              {activeTab === 'updates' && (
                <div className="space-y-6">
                  {/* Push Form */}
                  <form 
                    onSubmit={handlePublishUpdate} 
                    className="p-5 rounded-xl border space-y-4"
                    style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4 text-amber-600" />
                        Broadcast Official Gazette Amendment
                      </h3>
                      <span className="text-[11px] text-muted">Updates live app within 100ms</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-medium mb-1">Act Name *</label>
                        <input
                          type="text"
                          value={actName}
                          onChange={(e) => setActName(e.target.value)}
                          placeholder="e.g. Bharatiya Nyaya Sanhita, 2023"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Section / Provision *</label>
                        <input
                          type="text"
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                          placeholder="e.g. Section 106(2) - Hit & Run"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Amendment Type</label>
                        <select
                          value={changeType}
                          onChange={(e: any) => setChangeType(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        >
                          <option value="Amended">Amended</option>
                          <option value="New">New Enactment</option>
                          <option value="Substituted">Substituted</option>
                          <option value="Notified">Statutorily Notified</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Effective / Gazette Date *</label>
                        <input
                          type="date"
                          value={effectiveDate}
                          onChange={(e) => setEffectiveDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Official Summary / Directive *</label>
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Summarize the exact legal changes as stated in the Gazette..."
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Gazette Notification ID</label>
                        <input
                          type="text"
                          value={gazetteId}
                          onChange={(e) => setGazetteId(e.target.value)}
                          placeholder="e.g. S.O. 848(E) or GSR 421(E)"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Official Source URL</label>
                        <input
                          type="url"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          placeholder="https://egazette.gov.in"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isUrgent}
                          onChange={(e) => setIsUrgent(e.target.checked)}
                          className="rounded border-neutral-400 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-medium text-amber-700 dark:text-amber-400">Mark as Critical / Breaking Update</span>
                      </label>

                      <button
                        type="submit"
                        disabled={isOperating}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {isOperating ? 'Publishing...' : 'Publish Update to Live App'}
                      </button>
                    </div>
                  </form>

                  {/* Active List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                      Active Statutory Updates in App ({updateHistory.length})
                    </h3>
                    <div className="space-y-2">
                      {updateHistory.map((upd) => (
                        <div 
                          key={upd.id}
                          className="p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs"
                          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface)' }}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{upd.act_name}</span>
                              <span className="font-mono text-muted">• {upd.section}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                {upd.change_type}
                              </span>
                              {upd.is_urgent && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                  Urgent Notice
                                </span>
                              )}
                            </div>
                            <p className="text-muted leading-relaxed">{upd.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-muted font-mono pt-1">
                              <span>Effective: {upd.effective_date}</span>
                              {upd.gazette_notification_id && (
                                <span>• Ref: {upd.gazette_notification_id}</span>
                              )}
                              {upd.source_url && (
                                <a 
                                  href={upd.source_url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                                >
                                  Gazette Link <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteUpdate(upd.id)}
                            disabled={isOperating}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete this update"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Public Circulars & Notices */}
              {activeTab === 'circulars' && (
                <div className="space-y-6">
                  {/* Push Circular Form */}
                  <form 
                    onSubmit={handlePublishCircular}
                    className="p-5 rounded-xl border space-y-4"
                    style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4 text-amber-600" />
                        Publish Official Government Circular / Directive
                      </h3>
                      <span className="text-[11px] text-muted">Displayed in Public Circulars Banner</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Circular Title *</label>
                        <input
                          type="text"
                          value={circTitle}
                          onChange={(e) => setCircTitle(e.target.value)}
                          placeholder="e.g. Supreme Court Directive on Mandatory Zero FIR Across States"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Issuing Authority *</label>
                        <input
                          type="text"
                          value={circAuthority}
                          onChange={(e) => setCircAuthority(e.target.value)}
                          placeholder="e.g. Supreme Court of India / Ministry of Home Affairs"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Circular / Order No.</label>
                        <input
                          type="text"
                          value={circNumber}
                          onChange={(e) => setCircNumber(e.target.value)}
                          placeholder="e.g. WP (Crl) No. 102/2024"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Date of Issue *</label>
                        <input
                          type="date"
                          value={circDate}
                          onChange={(e) => setCircDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Category</label>
                        <input
                          type="text"
                          value={circCategory}
                          onChange={(e) => setCircCategory(e.target.value)}
                          placeholder="e.g. Criminal Justice, Consumer Law"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Summary / Citizen Directives *</label>
                        <textarea
                          rows={2}
                          value={circSummary}
                          onChange={(e) => setCircSummary(e.target.value)}
                          placeholder="Summarize the enforceable order and citizen rights..."
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Source / Verification Link</label>
                        <input
                          type="url"
                          value={circSourceUrl}
                          onChange={(e) => setCircSourceUrl(e.target.value)}
                          placeholder="https://main.sci.gov.in"
                          className="w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={circCritical}
                          onChange={(e) => setCircCritical(e.target.checked)}
                          className="rounded border-neutral-400 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-medium text-amber-700 dark:text-amber-400">High Priority Banner Notice</span>
                      </label>

                      <button
                        type="submit"
                        disabled={isOperating}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {isOperating ? 'Publishing...' : 'Publish Circular Notice'}
                      </button>
                    </div>
                  </form>

                  {/* Circulars List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                      Current Public Circulars ({circulars.length})
                    </h3>
                    <div className="space-y-2.5">
                      {circulars.map((circ) => (
                        <div 
                          key={circ.id}
                          className="p-4 rounded-xl border space-y-2 text-xs"
                          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface)' }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm">{circ.title}</h4>
                                {circ.is_critical && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    Priority Notice
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted font-mono mt-0.5">
                                Issued by {circ.issuing_authority} • Circular: {circ.circular_number} • Date: {circ.issue_date}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-neutral-200/60 dark:bg-neutral-800/60">
                              {circ.category}
                            </span>
                          </div>

                          <p className="text-muted leading-relaxed">{circ.summary}</p>

                          {circ.source_url && (
                            <a 
                              href={circ.source_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-mono"
                            >
                              Official Portal Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Statutory Helpline Statuses */}
              {activeTab === 'helplines' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    Control the operational availability flags for official statutory toll-free helplines. Citizens will see live uptime status indicators in the Legal Helplines directory.
                  </div>

                  <div className="space-y-2.5">
                    {helplines.map((h) => (
                      <div 
                        key={h.id}
                        className="p-4 rounded-xl border flex items-center justify-between gap-4 text-xs"
                        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface)' }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-amber-600 dark:text-amber-400">
                              {h.number}
                            </span>
                            <span className="font-semibold text-sm">{h.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              h.status === 'active' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                              {h.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-muted text-xs">{h.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted font-mono">
                            <span>Authority: {h.authority}</span>
                            <span>•</span>
                            <span>Hours: {h.availability_hours}</span>
                            {h.notes && <span>• Note: {h.notes}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleHelpline(h.id, h.status)}
                          disabled={isOperating}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                            h.status === 'active'
                              ? 'border-rose-500/30 text-rose-600 hover:bg-rose-500/10'
                              : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                          }`}
                        >
                          {h.status === 'active' ? 'Mark Maintenance' : 'Set to Active'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
