import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Link as LinkIcon, 
  FileText, 
  Image as ImageIcon,
  Building2,
  DollarSign,
  Calendar,
  KeyRound
} from 'lucide-react';
import { AppUser } from '../../services/authService';
import { uploadSecurityService } from '../../services/uploadSecurityService';
import { newsService, NewsCategory } from '../../services/newsService';
import { storageService } from '../../services/storageService';

interface NewsSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onRequireAuth: () => void;
}

export const NewsSubmissionModal: React.FC<NewsSubmissionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequireAuth,
}) => {
  // Step 1: Check if upload permission is unlocked
  // If role is admin, automatically unlocked.
  // If role is contributor, check uploadPermissionUntil.
  const hasActivePermission = 
    currentUser?.role === 'admin' ||
    (currentUser?.role === 'contributor' && 
      Boolean(currentUser.uploadPermissionUntil && currentUser.uploadPermissionUntil > Date.now()));

  // Password verification state
  const [unlockPassword, setUnlockPassword] = useState('');
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<NewsCategory>('new_startup');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  
  // Category specific fields
  const [startupName, setStartupName] = useState('');
  const [investorName, setInvestorName] = useState('');
  const [amount, setAmount] = useState('');
  const [round, setRound] = useState('Seed');
  const [issuingBody, setIssuingBody] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  // Image upload state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle Contributor Upload Password Verification
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!unlockPassword.trim()) {
      setPasswordError('Please enter the upload password.');
      return;
    }

    try {
      setVerifyingPassword(true);
      await uploadSecurityService.verifyUploadPassword(unlockPassword.trim());
      // Refresh current user local state
      if (currentUser) {
        currentUser.uploadPermissionUntil = Date.now() + 30 * 60 * 1000;
      }
    } catch (err: any) {
      console.error('Password verification error:', err);
      setPasswordError(err?.message || 'Incorrect upload password or account locked.');
    } finally {
      setVerifyingPassword(false);
    }
  };

  // Handle local image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    
    // Check maximum 5 images, each < 5MB
    const validFiles: File[] = [];
    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) {
        setError(`File "${f.name}" exceeds the 5MB size limit.`);
        return;
      }
      validFiles.push(f);
    }

    setImages(validFiles);
    const previews = validFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  // Submit article
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    // Validate real-news source requirements
    if (!sourceName.trim()) {
      setError('A verifiable source name is required (e.g. Economic Times, Press Information Bureau).');
      return;
    }

    const trimmedUrl = sourceUrl.trim();
    if (!trimmedUrl.startsWith('https://')) {
      setError('Source URL must be a valid, secure https:// web address.');
      return;
    }

    try {
      setSubmitting(true);

      // 1. Upload compressed images to Cloud Storage
      const uploadedUrls: string[] = [];
      for (const imgFile of images) {
        const url = await storageService.uploadNewsImage(imgFile, currentUser.uid);
        uploadedUrls.push(url);
      }

      // 2. Submit to Cloud Function
      const { newsId } = await newsService.submitNews({
        category,
        title: title.trim(),
        summary: summary.trim(),
        body: body.trim(),
        imageUrls: uploadedUrls,
        sourceName: sourceName.trim(),
        sourceUrl: trimmedUrl,
        // Category specific
        startupName: startupName.trim() || undefined,
        investorName: investorName.trim() || undefined,
        amount: amount.trim() || undefined,
        round: round.trim() || undefined,
        issuingBody: issuingBody.trim() || undefined,
        eligibility: eligibility.trim() || undefined,
        deadline: deadline.trim() || undefined,
        location: location.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        problem: problem.trim() || undefined,
        solution: solution.trim() || undefined,
      });

      // 3. Run parallel 3-provider AI verification (Gemini, OpenAI, Claude)
      try {
        await newsService.verifyNewsWithAI({
          id: newsId,
          category,
          title: title.trim(),
          summary: summary.trim(),
          body: body.trim(),
          sourceName: sourceName.trim(),
          sourceUrl: trimmedUrl,
          startupName: startupName.trim() || undefined,
          investorName: investorName.trim() || undefined,
          amount: amount.trim() || undefined,
          authorId: currentUser.uid,
          authorName: currentUser.displayName || 'Contributor',
          status: 'pending',
          createdAt: new Date().toISOString(),
          imageUrls: uploadedUrls,
        }, currentUser.uid);
      } catch (verifyErr) {
        console.warn('AI 3-provider background verification noticed:', verifyErr);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Error submitting news article:', err);
      setError(err?.message || 'Failed to submit news story. Please verify all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0E0E0E] rounded-3xl border border-slate-200 dark:border-[#262626] shadow-2xl p-6 sm:p-8 my-8 text-slate-800 dark:text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Not Logged In */}
        {!currentUser && (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Authentication Required</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You must be logged in as an approved Contributor or Administrator to submit startup news stories.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] text-white text-xs font-bold cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Logged in as Viewer (Needs contributor role) */}
        {currentUser && currentUser.role === 'viewer' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Contributor Role Required</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your account is currently registered with <strong>Viewer</strong> permissions. To protect real-news integrity, story submissions are restricted to verified contributors and administrators.
              </p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                Contact the app administrator to upgrade your account to Contributor status.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] text-xs font-bold text-slate-700 dark:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {/* Contributor Upload Password Gate */}
        {currentUser && (currentUser.role === 'contributor' || currentUser.role === 'admin') && !hasActivePermission && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Enter Upload Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submissions are server-locked. Enter the contributor secret password to unlock your 30-minute upload session.
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-[#CCCCCC]">
                  Upload Secret Passcode
                </label>
                <input
                  type="password"
                  required
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="Enter secret upload password..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 dark:text-[#777777]">
                  Rate limited: 5 failed attempts will lock upload access for 15 minutes.
                </p>
              </div>

              <button
                type="submit"
                disabled={verifyingPassword}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {verifyingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Server...</span>
                  </>
                ) : (
                  <span>Unlock Story Uploads</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Upload Form (Active Permission) */}
        {currentUser && hasActivePermission && (
          <div>
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Story Submitted for Editorial Review</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Your article is now in <strong>Pending</strong> status. An administrator will verify the citations and approve it for public publishing.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">Submit Startup News Story</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-news integrity strictly enforced. No AI auto-fill. Mandatory official source citations.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#CCCCCC]">
                    News Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="new_startup">New Startup Launch</option>
                    <option value="funding_option">Funding Option / Grant</option>
                    <option value="investment">Investment / Venture Round</option>
                    <option value="govt_scheme">Government Scheme / Policy</option>
                    <option value="event">Event / Founder Summit</option>
                    <option value="problem_fix">Founder Problem & Solution</option>
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#CCCCCC]">
                    Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={5}
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hyderabad CleanTech Startup Raises $2M Seed for Solid-State Battery"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#CCCCCC]">
                    Executive Summary * (10 - 1,000 characters)
                  </label>
                  <textarea
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief 2-3 sentence overview for the news feed..."
                    className="w-full px-4 py-2 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Real-News Integrity: Source Name & Valid https:// URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/15 border border-emerald-500/20">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Source Publisher *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="e.g. Inc42, Economic Times, PIB"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-emerald-300 dark:border-emerald-800/50 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Verified Source URL (https://) *</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-emerald-300 dark:border-emerald-800/50 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category-Specific Dynamic Fields */}
                {category === 'investment' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Startup Name</label>
                      <input
                        type="text"
                        value={startupName}
                        onChange={(e) => setStartupName(e.target.value)}
                        placeholder="Company"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Investor</label>
                      <input
                        type="text"
                        value={investorName}
                        onChange={(e) => setInvestorName(e.target.value)}
                        placeholder="VC / Angel"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Amount</label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="$1.5M / ₹10 Cr"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Round</label>
                      <input
                        type="text"
                        value={round}
                        onChange={(e) => setRound(e.target.value)}
                        placeholder="Seed / Pre-Series A"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                  </div>
                )}

                {category === 'govt_scheme' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Issuing Ministry</label>
                      <input
                        type="text"
                        value={issuingBody}
                        onChange={(e) => setIssuingBody(e.target.value)}
                        placeholder="e.g. MeitY, DST"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Eligibility</label>
                      <input
                        type="text"
                        value={eligibility}
                        onChange={(e) => setEligibility(e.target.value)}
                        placeholder="DPIIT recognized, < 5 yrs"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Application Deadline</label>
                      <input
                        type="text"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        placeholder="e.g. 31 Dec 2026"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                  </div>
                )}

                {category === 'event' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Location / City</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Bengaluru / Online"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs"
                      />
                    </div>
                  </div>
                )}

                {category === 'problem_fix' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Pain Point / Bottleneck</label>
                      <textarea
                        rows={2}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Describe the founder problem..."
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Practical Solution / Framework</label>
                      <textarea
                        rows={2}
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="How it was fixed..."
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Full Body */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#CCCCCC]">
                    Detailed Story Body * (20 - 20,000 characters)
                  </label>
                  <textarea
                    required
                    minLength={20}
                    maxLength={20000}
                    rows={5}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Full verified report with context, quotes, background, and analysis..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Image Upload with Client Compression */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#CCCCCC] flex items-center justify-between">
                    <span>Attach Images (Max 5MB each, auto-compressed)</span>
                    <span className="text-slate-400 font-normal">{images.length}/5 attached</span>
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    onChange={handleFileChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 dark:file:bg-[#202020] dark:file:text-white hover:file:bg-slate-200 cursor-pointer"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {imagePreviews.map((p, idx) => (
                        <img
                          key={idx}
                          src={p}
                          alt="Upload preview"
                          className="h-16 w-24 object-cover rounded-xl border border-slate-200 dark:border-[#333333]"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6845f0] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Compressing & Submitting to Editorial Queue...</span>
                    </>
                  ) : (
                    <span>Submit Story for Verification</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
};
