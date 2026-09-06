import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  RotateCw, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Layers, 
  ShieldAlert, 
  Clock, 
  Flame, 
  Bookmark, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LawCard } from '../LawCard';
import { SearchHistoryDropdown } from '../SearchHistoryDropdown';
import { CATEGORIES } from '../../data/categories';
import { CitizenRightsGuide } from '../legal/CitizenRightsGuide';
import { LegalMaxims } from '../legal/LegalMaxims';
import { LegalHelplines } from '../legal/LegalHelplines';
import { MOTION_EASINGS } from '../../utils/motion';

export const HomeView: React.FC = () => {
  const { 
    user, 
    laws, 
    bookmarks, 
    lastUpdatedTime, 
    isRefreshing, 
    refreshLegalData, 
    setActiveTab, 
    setSelectedCategory,
    setFilters,
    addRecentSearch,
    setShowOnboardingModal,
    setShowAIAssistant
  } = useApp();

  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarContainerRef.current && !searchBarContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Determine greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    addRecentSearch(searchInput.trim());
    setFilters(prev => ({ ...prev, query: searchInput.trim() }));
    setIsSearchFocused(false);
    setActiveTab('search');
  };

  const handleSuggestionClick = (term: string) => {
    addRecentSearch(term);
    setFilters(prev => ({ ...prev, query: term }));
    setIsSearchFocused(false);
    setActiveTab('search');
  };

  const handleSelectHistoryTerm = (term: string) => {
    addRecentSearch(term);
    setSearchInput(term);
    setFilters(prev => ({ ...prev, query: term }));
    setIsSearchFocused(false);
    setActiveTab('search');
  };

  // Recommended Laws based on user preferences (State, Interests)
  const userState = user?.preferences?.state || 'Telangana';
  const userInterests = user?.preferences?.interests || [];

  const recommendedLaws = laws.filter(l => {
    const matchesState = l.state_applicability === 'All India' || l.state_applicability.includes(userState);
    const catName = CATEGORIES.find(c => c.id === l.category_id)?.name || '';
    const matchesCategory = userInterests.length === 0 || userInterests.some(interest => 
      catName.toLowerCase().includes(interest.toLowerCase().slice(0, 5)) ||
      l.keywords.some(k => interest.toLowerCase().includes(k.toLowerCase())) ||
      l.category_id.toLowerCase().includes(interest.toLowerCase().slice(0, 5))
    );
    return matchesState && (matchesCategory || l.featured);
  }).slice(0, 4);

  // Recently updated/amended laws
  const recentlyUpdatedLaws = laws.filter(l => l.is_recently_updated).slice(0, 4);

  // Popular laws
  const popularLaws = laws.filter(l => l.featured || (l.view_count && l.view_count > 10000)).slice(0, 4);

  // Bookmarked laws
  const bookmarkedLaws = laws.filter(l => bookmarks.includes(l.id));

  // Quick suggestions
  const suggestions = [
    'Online UPI Fraud',
    'Drunk Driving Penalty',
    'Section 66 IT Act',
    'Section 103 BNS',
    'Cheque Bounce',
    'RTI Application'
  ];

  return (
    <div className="space-y-8 pb-12 view-blur-open">
      
      {/* Hero Welcome & Greeting with Liquid Glass Morrison Depth & Staggered Motion */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.07,
              delayChildren: 0.05
            }
          }
        }}
        className="relative overflow-hidden rounded-3xl morrison-panel p-6 sm:p-8"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            
            {/* 1. Greeting pill / status badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: MOTION_EASINGS.appleDecel } }
              }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/15 dark:bg-[#7C5CFF]/15 text-orange-600 dark:text-[#a78bfa] border border-orange-500/25 dark:border-[#7C5CFF]/30 shadow-xs">
                {getGreeting()}, {user?.name || 'Citizen'}
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowOnboardingModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] transition-colors cursor-pointer"
                title="Change preferences"
              >
                <MapPin className="w-3 h-3 text-rose-500 dark:text-[#EF4444]" />
                <span>{userState}</span>
                <span className="text-slate-400 dark:text-[#777777]">• {user?.preferences?.occupation || 'Citizen'}</span>
              </motion.button>
            </motion.div>

            {/* 2. Main Heading */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: MOTION_EASINGS.appleDecel } }
              }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#FFFFFF] tracking-tight font-display"
            >
              Know Your Laws, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-[#7C5CFF] dark:via-[#9B82FF] dark:to-[#7C5CFF]">Sections & Rights</span>
            </motion.h1>

            {/* 3. Subtitle Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: MOTION_EASINGS.appleDecel } }
              }}
              className="text-xs sm:text-sm text-slate-600 dark:text-[#B3B3B3] max-w-2xl leading-relaxed"
            >
              Explore verified Indian statutes, acts, penalties, and bailable provisions from official gazettes in simplified language.
            </motion.p>
          </div>

          {/* 4. Quick AI Trigger Card */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.97 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: MOTION_EASINGS.appleDecel } }
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 420, damping: 25 }}
            onClick={() => setShowAIAssistant(true)}
            className="shrink-0 p-4 rounded-2xl liquid-glass-card cursor-pointer group max-w-sm hover:shadow-xl hover:border-orange-500/30 dark:hover:border-[#7C5CFF]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#9B82FF] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/20 ring-1 ring-white/30 dark:ring-white/10 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FFFFFF] group-hover:text-orange-500 dark:group-hover:text-[#7C5CFF] flex items-center gap-1.5 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Nyaya AI Legal Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#777777] mt-0.5 font-medium">
                  Ask questions in plain English or Hinglish
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. Search Bar Container */}
        <motion.div
          ref={searchBarContainerRef}
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: MOTION_EASINGS.appleDecel } }
          }}
          className="mt-6 pt-6 border-t border-black/5 dark:border-[#222222] relative"
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className={`w-5 h-5 absolute left-4 top-3.5 z-10 transition-colors duration-200 ${
              isSearchFocused ? 'text-orange-500 dark:text-[#7C5CFF]' : 'text-slate-400 dark:text-[#777777]'
            }`} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search by law, section number (e.g. 'Section 66', 'BNS 103'), offence, or fine..."
              className={`w-full pl-12 pr-28 py-3.5 rounded-full liquid-pill text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-500 dark:placeholder-[#777777] focus:outline-none transition-all duration-200 dark:bg-[#151515] ${
                isSearchFocused 
                  ? 'ring-2 ring-orange-500/50 dark:ring-[#7C5CFF]/60 shadow-lg shadow-orange-500/10 dark:shadow-[#7C5CFF]/15 border-orange-500/40 dark:border-[#7C5CFF]/50'
                  : 'dark:border-[#292929]'
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="absolute right-2 top-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-[#7C5CFF] dark:to-[#6847ed] dark:hover:from-[#6b4ae0] dark:hover:to-[#5837db] text-white font-bold text-xs shadow-md shadow-orange-500/25 dark:shadow-[#7C5CFF]/30 cursor-pointer ring-1 ring-white/20 dark:ring-white/10 z-10"
            >
              Search
            </motion.button>
          </form>

          {/* Quick-Access Search History Dropdown on Focus */}
          <SearchHistoryDropdown
            isOpen={isSearchFocused}
            onClose={() => setIsSearchFocused(false)}
            currentQuery={searchInput}
            onSelectTerm={handleSelectHistoryTerm}
            popularSuggestions={suggestions}
          />

          {/* 6. Quick Suggestions Chips */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: MOTION_EASINGS.appleDecel } }
            }}
            className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs"
          >
            <span className="text-slate-500 dark:text-[#777777] text-[11px] font-bold shrink-0">Popular:</span>
            {suggestions.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                onClick={() => handleSuggestionClick(item)}
                className="whitespace-nowrap px-3 py-1 rounded-full liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] font-semibold transition-colors cursor-pointer dark:hover:border-[#7C5CFF]/40"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

      </motion.div>

      {/* 4 Feature Statutory Cards (Criminal, Cyber, Rights, Traffic) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <motion.div 
          whileHover={{ y: -3, scale: 1.012 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          onClick={() => {
            setFilters(prev => ({ ...prev, query: 'BNS 103' }));
            setActiveTab('search');
          }}
          className="liquid-glass-card statutory-card-indigo p-3.5 sm:p-5 rounded-3xl cursor-pointer group min-w-0 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <span className="text-xs font-extrabold text-indigo-600 dark:text-[#3B82F6] uppercase tracking-widest group-hover:underline block truncate">Criminal</span>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold mt-1 text-slate-900 dark:text-[#FFFFFF] font-display group-hover:text-indigo-600 dark:group-hover:text-[#3B82F6] transition-colors truncate max-w-full tracking-tight">IPC 1860 / BNS</h3>
          <p className="text-xs text-slate-600 dark:text-[#777777] mt-1 sm:mt-2 truncate">358 Sections • Bharatiya Nyaya</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -3, scale: 1.012 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          onClick={() => {
            setFilters(prev => ({ ...prev, query: 'IT Act 66' }));
            setActiveTab('search');
          }}
          className="liquid-glass-card statutory-card-orange p-3.5 sm:p-5 rounded-3xl cursor-pointer group min-w-0 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <span className="text-xs font-extrabold text-orange-600 dark:text-[#F59E0B] uppercase tracking-widest group-hover:underline block truncate">Cyber</span>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold mt-1 text-slate-900 dark:text-[#FFFFFF] font-display group-hover:text-orange-600 dark:group-hover:text-[#F59E0B] transition-colors truncate max-w-full tracking-tight">IT Act 2000</h3>
          <p className="text-xs text-slate-600 dark:text-[#777777] mt-1 sm:mt-2 truncate">94 Sections • Tech Crimes</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -3, scale: 1.012 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          onClick={() => {
            setSelectedCategory('constitutional-law');
            setActiveTab('categories');
          }}
          className="liquid-glass-card statutory-card-emerald p-3.5 sm:p-5 rounded-3xl cursor-pointer group min-w-0 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <span className="text-xs font-extrabold text-emerald-600 dark:text-[#22C55E] uppercase tracking-widest group-hover:underline block truncate">Rights</span>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold mt-1 text-slate-900 dark:text-[#FFFFFF] font-display group-hover:text-emerald-600 dark:group-hover:text-[#22C55E] transition-colors truncate max-w-full tracking-tight">Constitution</h3>
          <p className="text-xs text-slate-600 dark:text-[#777777] mt-1 sm:mt-2 truncate">Part III • Fundamental Rights</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -3, scale: 1.012 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          onClick={() => {
            setSelectedCategory('motor-vehicle-traffic-law');
            setActiveTab('categories');
          }}
          className="liquid-glass-card statutory-card-rose p-3.5 sm:p-5 rounded-3xl cursor-pointer group min-w-0 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <span className="text-xs font-extrabold text-rose-600 dark:text-[#EF4444] uppercase tracking-widest group-hover:underline block truncate">Traffic</span>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold mt-1 text-slate-900 dark:text-[#FFFFFF] font-display group-hover:text-rose-600 dark:group-hover:text-[#EF4444] transition-colors truncate max-w-full tracking-tight">MV Act 1988</h3>
          <p className="text-xs text-slate-600 dark:text-[#777777] mt-1 sm:mt-2 truncate">217 Sections • Regulations</p>
        </motion.div>
      </section>

      {/* Sync Status & Live Refresh Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl liquid-glass-card text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-[#B3B3B3]">
          <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-[#22C55E]" />
          <span>
            Database verified against <strong className="text-slate-900 dark:text-[#FFFFFF]">India Code & Gazette of India</strong>.
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-[#292929]">|</span>
          <span className="text-slate-500 dark:text-[#777777] text-[11px]">
            Last updated: <strong className="text-slate-700 dark:text-[#FFFFFF]">{lastUpdatedTime}</strong>
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshLegalData}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/10 dark:bg-[#7C5CFF]/15 hover:bg-orange-500/20 dark:hover:bg-[#7C5CFF]/25 text-orange-600 dark:text-[#7C5CFF] border border-orange-500/20 dark:border-[#7C5CFF]/30 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-500 dark:text-[#7C5CFF]' : ''}`} />
          <span>{isRefreshing ? 'Verifying Gazettes...' : 'Live Refresh'}</span>
        </motion.button>
      </div>

      {/* Top 6 Quick Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-[#FFFFFF] font-display">
            <Layers className="w-5 h-5 text-orange-500 dark:text-[#7C5CFF]" />
            <span>Legal Categories</span>
            <span className="text-xs font-normal text-slate-500 dark:text-[#777777]">(22 Enactments)</span>
          </div>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => setActiveTab('categories')}
            className="text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All 22</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.slice(0, 6).map(cat => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('categories');
              }}
              className="p-3.5 rounded-2xl liquid-glass-card cursor-pointer flex flex-col justify-between group hover:border-orange-500/30 dark:hover:border-[#7C5CFF]/30 transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FFFFFF] group-hover:text-orange-500 dark:group-hover:text-[#7C5CFF] transition-colors">
                  {cat.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#777777] mt-1 line-clamp-2">
                  {cat.description}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-orange-600 dark:text-[#7C5CFF]">
                <span>{cat.sections_count} Sections</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended For You (Personalized for user State & Profession) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-[#FFFFFF] font-display">
              <Sparkles className="w-5 h-5 text-orange-500 dark:text-[#7C5CFF]" />
              <span>Recommended For You</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#777777]">
              Curated for your profile: <strong className="text-slate-700 dark:text-[#FFFFFF]">{userState}</strong>, <strong className="text-slate-700 dark:text-[#FFFFFF]">{user?.preferences?.occupation || 'Citizen'}</strong>
            </p>
          </div>
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="text-xs text-slate-500 dark:text-[#777777] hover:text-orange-500 dark:hover:text-[#7C5CFF] underline cursor-pointer"
          >
            Update Preferences
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedLaws.map(law => (
            <LawCard key={law.id} law={law} />
          ))}
        </div>
      </div>

      {/* Recently Updated / Amended Laws (featuring BNS 2023, BNSS 2023) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-[#FFFFFF] font-display">
            <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-[#22C55E]" />
            <span>Recently Amended & New Enactments</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-[#22C55E]/15 text-emerald-700 dark:text-[#22C55E] border border-emerald-500/20 dark:border-[#22C55E]/30">
              2024–2026 Reforms
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentlyUpdatedLaws.map(law => (
            <LawCard key={law.id} law={law} />
          ))}
        </div>
      </div>

      {/* Popular Laws */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-[#FFFFFF] font-display">
            <Flame className="w-5 h-5 text-rose-500 dark:text-[#EF4444]" />
            <span>Most Consulted Provisions</span>
          </div>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, query: '' }));
              setActiveTab('search');
            }}
            className="text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Laws</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularLaws.map(law => (
            <LawCard key={law.id} law={law} />
          ))}
        </div>
      </div>

      {/* Saved / Bookmarked Laws quick row */}
      {bookmarkedLaws.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-[#FFFFFF] font-display">
              <Bookmark className="w-5 h-5 text-orange-500 dark:text-[#7C5CFF]" />
              <span>Your Saved Laws ({bookmarkedLaws.length})</span>
            </div>
            <button
              onClick={() => setActiveTab('saved')}
              className="text-xs font-semibold text-orange-600 dark:text-[#7C5CFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Bookmarks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedLaws.slice(0, 2).map(law => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>
        </div>
      )}

      {/* Citizen Rights & Fundamental Protections */}
      <div className="pt-6 border-t border-black/5 dark:border-[#222222]">
        <CitizenRightsGuide limit={3} />
      </div>

      {/* Foundational Jurisprudence & Legal Maxims */}
      <div className="pt-6 border-t border-black/5 dark:border-[#222222]">
        <LegalMaxims limit={4} />
      </div>

      {/* Official Government Helplines */}
      <div className="pt-6 border-t border-black/5 dark:border-[#222222]">
        <LegalHelplines />
      </div>

    </div>
  );
};
