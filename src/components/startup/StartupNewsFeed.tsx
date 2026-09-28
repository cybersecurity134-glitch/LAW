import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ExternalLink, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Clock, 
  Lock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Tag,
  Share2,
  Bot,
  Cpu
} from 'lucide-react';
import { newsService, NewsItemDoc, NewsCategory } from '../../services/newsService';
import { AppUser } from '../../services/authService';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface StartupNewsFeedProps {
  currentUser: AppUser | null;
  onOpenSubmitModal: () => void;
  onOpenChatWithAuthor?: (authorId: string, authorName: string) => void;
  onOpenAdminModal?: () => void;
}

const CATEGORIES: { id: NewsCategory | 'all'; label: string; icon: any; color: string }[] = [
  { id: 'all', label: 'All News', icon: Sparkles, color: 'from-orange-500 to-amber-500' },
  { id: 'new_startup', label: 'New Startups', icon: Building2, color: 'from-blue-500 to-indigo-500' },
  { id: 'funding_option', label: 'Funding Options', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
  { id: 'investment', label: 'Investments', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  { id: 'govt_scheme', label: 'Govt Schemes', icon: ShieldCheck, color: 'from-amber-500 to-orange-500' },
  { id: 'event', label: 'Events & Summits', icon: Calendar, color: 'from-cyan-500 to-blue-500' },
  { id: 'problem_fix', label: 'Problem & Solutions', icon: FileText, color: 'from-rose-500 to-red-500' },
];

export const StartupNewsFeed: React.FC<StartupNewsFeedProps> = ({
  currentUser,
  onOpenSubmitModal,
  onOpenChatWithAuthor,
  onOpenAdminModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItemDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Quick Article Summarizer State (Requirement 2 & 5)
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [articleSummaries, setArticleSummaries] = useState<Record<string, { summary: string; modelUsed: string }>>({});

  const handleSummarizeArticle = async (item: NewsItemDoc) => {
    if (articleSummaries[item.id]) return; // Already cached locally

    try {
      setSummarizingId(item.id);
      const res = await fetch('/api/ai/summarize-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.uid || 'guest'}`,
        },
        body: JSON.stringify({
          title: item.title,
          text: item.body,
          source: item.sourceName,
          userId: currentUser?.uid,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Summarization unavailable' }));
        throw new Error(err.error || 'Failed to generate summary');
      }

      const data = await res.json();
      setArticleSummaries((prev) => ({
        ...prev,
        [item.id]: {
          summary: data.summary,
          modelUsed: data.modelUsed,
        },
      }));
    } catch (err: any) {
      console.warn('Article summary error:', err);
    } finally {
      setSummarizingId(null);
    }
  };

  // Debounce search query by 300 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial and category-filtered load
  const loadNews = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const currentCursor = reset ? null : lastVisibleDoc;
      const result = await newsService.getApprovedNews(selectedCategory, currentCursor, 20);

      if (reset) {
        setNewsItems(result.items);
      } else {
        setNewsItems((prev) => [...prev, ...result.items]);
      }

      setLastVisibleDoc(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err: any) {
      console.error('Failed to load startup news feed:', err);
      setError('Unable to load verified news feed at this time. Please check network connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, lastVisibleDoc]);

  useEffect(() => {
    setLastVisibleDoc(null);
    loadNews(true);
  }, [selectedCategory]);

  // Client-side instant filter on debounced search
  const filteredItems = newsItems.filter((item) => {
    if (!debouncedSearch) return true;
    const matchTitle = item.title.toLowerCase().includes(debouncedSearch);
    const matchSummary = item.summary.toLowerCase().includes(debouncedSearch);
    const matchSource = item.sourceName.toLowerCase().includes(debouncedSearch);
    const matchStartup = item.startupName?.toLowerCase().includes(debouncedSearch);
    const matchInvestor = item.investorName?.toLowerCase().includes(debouncedSearch);
    return matchTitle || matchSummary || matchSource || matchStartup || matchInvestor;
  });

  const getCategoryBadge = (cat: NewsCategory) => {
    switch (cat) {
      case 'new_startup':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">New Startup</span>;
      case 'funding_option':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Funding</span>;
      case 'investment':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Investment</span>;
      case 'govt_scheme':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Govt Scheme</span>;
      case 'event':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">Event / Summit</span>;
      case 'problem_fix':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Problem Fix</span>;
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-News Integrity Verified &bull; Strict Source Enforcement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Startup Pulse & Networking
            </h1>
            <p className="text-sm text-slate-300">
              Curated founder news, govt funding schemes, startup investments, and verified founder networking. Every post requires official verified citation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdminModal}
                className="px-4 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Review</span>
              </button>
            )}

            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] dark:hover:bg-[#6845f0] text-white text-xs font-bold shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit News Story</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#181818] dark:hover:bg-[#222222] text-slate-600 dark:text-[#A0A0A0] border border-slate-200/60 dark:border-[#292929]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar (300 ms debounced) */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search startup news, investors, schemes, or keywords (e.g. Seed round, NIDHI, EV)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#262626] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#666666] focus:outline-none focus:border-orange-500 dark:focus:border-[#7C5CFF] shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadNews(true)}
            className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-[#222222] animate-pulse space-y-3"
            >
              <div className="h-5 bg-slate-200 dark:bg-[#202020] rounded-md w-1/4" />
              <div className="h-7 bg-slate-200 dark:bg-[#202020] rounded-md w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-[#202020] rounded-md w-full" />
              <div className="h-4 bg-slate-200 dark:bg-[#202020] rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 dark:bg-[#101010] border border-slate-200 dark:border-[#222222] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No Approved Stories in this Category Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Be the first to submit a verified startup breakthrough, govt scheme, or funding news item with authentic sources.
            </p>
          </div>
          <button
            onClick={onOpenSubmitModal}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 dark:bg-[#7C5CFF] text-white text-xs font-bold cursor-pointer"
          >
            Submit First Story
          </button>
        </div>
      ) : (
        /* News List */
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111111] border border-slate-200/90 dark:border-[#252525] shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-[#383838] transition-all space-y-4"
            >
              {/* Category & Date Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(item.category)}
                  {item.aiVerification?.status === 'ai_verified' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI-Verified</span>
                    </span>
                  )}
                  <span className="text-slate-400 dark:text-[#666666] flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Real-News Verified Source Badge */}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-semibold hover:underline"
                  title={`Source verified from ${item.sourceName}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[160px] sm:max-w-[220px]">{item.sourceName}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                </a>
              </div>

              {/* Title & Summary */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Category-Specific Visual Badges */}
              {(item.category === 'investment' || item.amount || item.investorName || item.startupName || item.issuingBody || item.deadline || item.location || item.startDate) && (
                <div className="flex flex-wrap gap-2 pt-1 pb-1">
                  {item.startupName && (
                    <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-indigo-400" />
                      <span>Startup: <strong>{item.startupName}</strong></span>
                    </div>
                  )}

                  {item.investorName && (
                    <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span>Investor: <strong>{item.investorName}</strong></span>
                    </div>
                  )}

                  {item.amount && (
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      Round: {item.round ? `${item.round} • ` : ''}{item.amount}
                    </div>
                  )}

                  {item.issuingBody && (
                    <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Ministry/Body: {item.issuingBody}</span>
                    </div>
                  )}

                  {item.deadline && (
                    <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                      Deadline: {item.deadline}
                    </div>
                  )}

                  {item.location && (
                    <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Images preview if present */}
              {item.imageUrls && item.imageUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {item.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="News asset"
                      className="h-28 w-44 object-cover rounded-xl border border-slate-200 dark:border-[#222222]"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {/* AI Generated 3-Bullet Summary Box (Requirement 2: Long-text model specialization) */}
              {articleSummaries[item.id] && (
                <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-500/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>AI Key Insights & Summary</span>
                    </span>
                    {currentUser?.role === 'admin' && (
                      <span className="text-[10px] opacity-75 font-mono">{articleSummaries[item.id].modelUsed}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {articleSummaries[item.id].summary}
                  </div>
                </div>
              )}

              {/* Full Body Snippet */}
              <div className="text-xs text-slate-500 dark:text-[#888888] line-clamp-3 bg-slate-50 dark:bg-[#0a0a0a] p-3 rounded-2xl border border-slate-100 dark:border-[#1a1a1a]">
                {item.body}
              </div>

              {/* Author & Networking Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#202020] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {item.authorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-700 dark:text-[#AAAAAA]">
                    Posted by <strong className="text-slate-900 dark:text-white">{item.authorName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* AI Quick 3-Bullet Summary Button (Requirement 2 & 5) */}
                  <button
                    onClick={() => handleSummarizeArticle(item)}
                    disabled={summarizingId === item.id}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {summarizingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                    <span>{articleSummaries[item.id] ? 'AI Summary' : 'Summarize'}</span>
                  </button>

                  {/* Founder 1-on-1 Networking Chat Button */}
                  {currentUser && currentUser.uid !== item.authorId && (
                    <button
                      onClick={() => onOpenChatWithAuthor?.(item.authorId, item.authorName)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Founder</span>
                    </button>
                  )}

                  {/* External official source link */}
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors"
                    title="Open official verified source"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </article>
          ))}

          {/* Cursor Pagination "Load More" */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => loadNews(false)}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#181818] dark:hover:bg-[#222222] border border-slate-200 dark:border-[#292929] text-xs font-bold text-slate-700 dark:text-[#CCCCCC] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading Older Stories...</span>
                  </>
                ) : (
                  <span>Load More Stories</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
