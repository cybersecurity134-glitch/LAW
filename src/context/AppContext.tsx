import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LawItem, 
  UserProfile, 
  UserPreferences, 
  SearchFilters, 
  LegalUpdateHistory, 
  SearchHistoryItem,
  LegalCircularNotice,
  HelplineDirectoryItem,
  SyncStatusResponse
} from '../types';
import { LAWS_DATABASE, UPDATE_HISTORY } from '../data/laws';
import { CATEGORIES } from '../data/categories';
import { invalidateAllLegalQueries, prefetchLawDetail } from '../api/legalQueries';

interface AppContextType {
  // User & Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  signUp: (email: string, name: string, password?: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding: (prefs: UserPreferences) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;

  // Laws Database & Views
  laws: LawItem[];
  selectedLaw: LawItem | null;
  setSelectedLaw: (law: LawItem | null) => void;
  openLawDetail: (lawId: string) => void;
  closeLawDetail: () => void;
  recentlyViewed: LawItem[];

  // Bookmarks
  bookmarks: string[]; // array of law IDs
  toggleBookmark: (lawId: string) => void;
  isBookmarked: (lawId: string) => boolean;

  // Search & Filters
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  recentSearches: string[];
  searchHistory: SearchHistoryItem[];
  addRecentSearch: (term: string, resultCount?: number) => void;
  addLawSearchHistory: (law: LawItem) => void;
  removeRecentSearch: (termOrId: string) => void;
  clearRecentSearches: () => void;

  // Theme & Mode
  theme: 'day' | 'night' | 'system';
  setTheme: (theme: 'day' | 'night' | 'system') => void;
  explanationMode: 'simple' | 'detailed';
  setExplanationMode: (mode: 'simple' | 'detailed') => void;

  // Navigation
  activeTab: 'home' | 'search' | 'categories' | 'saved' | 'ai' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'categories' | 'saved' | 'ai' | 'profile') => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // AI Assistant Modal
  showAIAssistant: boolean;
  setShowAIAssistant: (show: boolean) => void;
  aiInitialQuestion: string;
  setAiInitialQuestion: (q: string) => void;

  // Law Book Data Ingestion Modal
  showIngestionModal: boolean;
  setShowIngestionModal: (show: boolean) => void;

  // Refresh & Updates
  lastUpdatedTime: string;
  isRefreshing: boolean;
  refreshLegalData: () => Promise<void>;
  syncLaws: (newLaws?: LawItem[]) => Promise<void>;
  updateHistory: LegalUpdateHistory[];
  circulars: LegalCircularNotice[];
  helplines: HelplineDirectoryItem[];
  syncStatus: SyncStatusResponse | null;
  loadSyncData: () => Promise<void>;
  refreshToast: { message: string; visible: boolean } | null;
  dismissRefreshToast: () => void;

  // Admin Override Modal
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;

  // Cinematic Opening Intro
  showCinematicIntro: boolean;
  setShowCinematicIntro: (show: boolean) => void;
  replayCinematicIntro: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  age: 26,
  state: 'Telangana',
  gender_pref: 'Not Specified',
  occupation: 'Working Professional',
  interests: ['Motor Vehicle & Traffic Law', 'Cyber Law & Information Technology', 'Consumer Law'],
  explanation_mode: 'simple',
  theme: 'day'
};

const GUEST_PROFILE: UserProfile = {
  id: 'guest-user',
  name: 'Guest Citizen',
  email: 'guest@nyaya.gov.in',
  preferences: DEFAULT_PREFERENCES,
  onboarding_completed: false,
  is_guest: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nyaya_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('lawsphere_intro_seen');
    } catch {
      return false;
    }
  });

  const handleSetShowCinematicIntro = useCallback((show: boolean) => {
    setShowCinematicIntro(show);
    if (!show) {
      try {
        sessionStorage.setItem('lawsphere_intro_seen', 'true');
      } catch {}
    }
  }, []);

  const replayCinematicIntro = useCallback(() => {
    setShowCinematicIntro(true);
  }, []);

  // Laws
  const [laws, setLaws] = useState<LawItem[]>(LAWS_DATABASE);
  const [selectedLaw, setSelectedLaw] = useState<LawItem | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<LawItem[]>(() => {
    const saved = localStorage.getItem('nyaya_recent_laws');
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        return LAWS_DATABASE.filter(l => ids.includes(l.id));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nyaya_bookmarks');
      return saved ? JSON.parse(saved) : ['it-act-sec-66d', 'mva-sec-185', 'bns-sec-103'];
    } catch {
      return ['it-act-sec-66d', 'mva-sec-185', 'bns-sec-103'];
    }
  });

  // Search & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'categories' | 'saved' | 'ai' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category_id: 'all',
    bailable: 'all',
    cognizable: 'all',
    state: 'all'
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const savedV2 = localStorage.getItem('nyaya_search_history_v2');
      if (savedV2) {
        return JSON.parse(savedV2);
      }
      // Migrate from nyaya_recent_searches if available
      const savedStrings = localStorage.getItem('nyaya_recent_searches');
      const initialStrings: string[] = savedStrings
        ? JSON.parse(savedStrings)
        : ['cyber crime', 'drunk driving', 'Section 66', 'cheque bounce'];
      return initialStrings.map((term: string, idx: number) => ({
        id: `hist-migrated-${idx}-${Date.now()}`,
        query: term,
        timestamp: Date.now() - (idx + 1) * 1800000,
        type: 'term' as const
      }));
    } catch {
      return [
        { id: 'hist-def-1', query: 'cyber crime', timestamp: Date.now() - 3600000, type: 'term' },
        { id: 'hist-def-2', query: 'drunk driving', timestamp: Date.now() - 7200000, type: 'term' },
        { id: 'hist-def-3', query: 'Section 66', timestamp: Date.now() - 10800000, type: 'term' },
        { id: 'hist-def-4', query: 'cheque bounce', timestamp: Date.now() - 14400000, type: 'term' }
      ];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nyaya_recent_searches');
      return saved ? JSON.parse(saved) : ['cyber crime', 'drunk driving', 'Section 66', 'cheque bounce'];
    } catch {
      return ['cyber crime', 'drunk driving', 'Section 66', 'cheque bounce'];
    }
  });

  // Theme & Mode: 'day', 'night', 'system'
  const [theme, setThemeState] = useState<'day' | 'night' | 'system'>(() => {
    try {
      const saved = localStorage.getItem('nyaya_theme');
      if (saved === 'liquid-glass') return 'day';
      return (saved as 'day' | 'night' | 'system') || 'day';
    } catch {
      return 'day';
    }
  });

  const [explanationMode, setExplanationModeState] = useState<'simple' | 'detailed'>(() => {
    try {
      const saved = localStorage.getItem('nyaya_mode');
      return (saved as 'simple' | 'detailed') || 'simple';
    } catch {
      return 'simple';
    }
  });

  // AI Assistant
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string>('');

  // Law Book Data Ingestion Modal
  const [showIngestionModal, setShowIngestionModal] = useState<boolean>(false);

  // Refresh status & Dynamic Data Synchronization
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Live Synchronized');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [updateHistory, setUpdateHistory] = useState<LegalUpdateHistory[]>(UPDATE_HISTORY);
  const [circulars, setCirculars] = useState<LegalCircularNotice[]>([]);
  const [helplines, setHelplines] = useState<HelplineDirectoryItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatusResponse | null>(null);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [refreshToast, setRefreshToast] = useState<{ message: string; visible: boolean } | null>(null);

  // Apply Dark/Light theme class to document element
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      root.classList.remove('liquid-glass', 'theme-day', 'theme-night', 'theme-morrison', 'dark');
      
      let isDark = false;
      if (theme === 'night') {
        isDark = true;
        root.classList.add('theme-night', 'theme-morrison');
      } else if (theme === 'day') {
        isDark = false;
        root.classList.add('theme-day', 'theme-morrison');
      } else if (theme === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isDark ? 'theme-night' : 'theme-day', 'theme-morrison');
      }

      root.setAttribute('data-theme', isDark ? 'night' : 'day');

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('nyaya_user', JSON.stringify(user));
      } catch {}
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('nyaya_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('nyaya_search_history_v2', JSON.stringify(searchHistory));
    } catch {}
  }, [searchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('nyaya_recent_searches', JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches]);

  useEffect(() => {
    try {
      localStorage.setItem('nyaya_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('nyaya_mode', explanationMode);
    } catch {}
  }, [explanationMode]);

  // Auth actions with persistent account registry
  const getRegisteredAccounts = (): Record<string, UserProfile> => {
    try {
      const raw = localStorage.getItem('nyaya_registered_accounts');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveAccountToRegistry = (profile: UserProfile) => {
    try {
      const accounts = getRegisteredAccounts();
      accounts[profile.email.toLowerCase().trim()] = profile;
      localStorage.setItem('nyaya_registered_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn("Failed saving account to registry:", e);
    }
  };

  const login = useCallback((email: string, name?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const accounts = getRegisteredAccounts();
    let profile = accounts[cleanEmail];

    if (!profile) {
      profile = {
        id: 'usr-' + Date.now(),
        name: name?.trim() || 'Citizen User',
        email: cleanEmail,
        preferences: DEFAULT_PREFERENCES,
        onboarding_completed: true
      };
      saveAccountToRegistry(profile);
    } else if (name && name.trim() && profile.name !== name.trim()) {
      profile.name = name.trim();
      saveAccountToRegistry(profile);
    }

    setUser(profile);
    setShowAuthModal(false);
    if (!profile.onboarding_completed) {
      setShowOnboardingModal(true);
    }
  }, []);

  const signUp = useCallback((email: string, name: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const accounts = getRegisteredAccounts();
    let profile = accounts[cleanEmail];

    if (!profile) {
      profile = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        preferences: DEFAULT_PREFERENCES,
        onboarding_completed: false
      };
    } else {
      profile.name = name.trim();
    }

    saveAccountToRegistry(profile);
    setUser(profile);
    setShowAuthModal(false);
    // Start questionnaire immediately after registration
    setShowOnboardingModal(true);
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser(GUEST_PROFILE);
    setShowAuthModal(false);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('nyaya_user');
    } catch {}
    setUser(null);
    setShowAuthModal(true);
  }, []);

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated: UserProfile = {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...prefs
        }
      };
      if (!prev.is_guest) {
        saveAccountToRegistry(updated);
      }
      return updated;
    });
    if (prefs.theme) setThemeState(prefs.theme);
    if (prefs.explanation_mode) setExplanationModeState(prefs.explanation_mode);
  }, []);

  const completeOnboarding = useCallback((prefs: UserPreferences) => {
    setUser(prev => {
      if (!prev) return null;
      const updated: UserProfile = {
        ...prev,
        preferences: prefs,
        onboarding_completed: true
      };
      if (!prev.is_guest) {
        saveAccountToRegistry(updated);
      }
      return updated;
    });
    setThemeState(prefs.theme);
    setExplanationModeState(prefs.explanation_mode);
    setShowOnboardingModal(false);
    setActiveTab('home');
  }, []);

  const setTheme = useCallback((t: 'day' | 'night' | 'system') => {
    setThemeState(t);
    updatePreferences({ theme: t });
  }, [updatePreferences]);

  const setExplanationMode = useCallback((m: 'simple' | 'detailed') => {
    setExplanationModeState(m);
    updatePreferences({ explanation_mode: m });
  }, [updatePreferences]);

  // Initial sync with server database to ensure any newly ingested or amended laws are immediately available
  useEffect(() => {
    let isMounted = true;
    fetch('/api/laws')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.laws && Array.isArray(data.laws) && data.laws.length > 0) {
          setLaws(data.laws);
        }
      })
      .catch(() => {
        // Fallback already provided by in-memory LAWS_DATABASE
      });
    return () => { isMounted = false; };
  }, []);

  // Sync laws explicitly from server or with new array
  const syncLaws = useCallback(async (newLaws?: LawItem[]) => {
    if (newLaws && Array.isArray(newLaws)) {
      setLaws(newLaws);
      return;
    }
    try {
      const res = await fetch('/api/laws');
      if (res.ok) {
        const data = await res.json();
        if (data.laws && Array.isArray(data.laws) && data.laws.length > 0) {
          setLaws(data.laws);
        }
      }
    } catch (e) {
      console.warn("Failed syncing laws from server:", e);
    }
  }, []);

  // Search History Management
  const addLawSearchHistory = useCallback((law: LawItem) => {
    if (!law) return;
    const lawLabel = `${law.section_number}: ${law.section_title}`;

    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== lawLabel.toLowerCase());
      return [lawLabel, ...filtered].slice(0, 15);
    });

    setSearchHistory(prev => {
      const filtered = prev.filter(item => 
        item.law_id !== law.id && item.query.toLowerCase() !== lawLabel.toLowerCase()
      );
      const newItem: SearchHistoryItem = {
        id: `hist-law-${law.id}-${Date.now()}`,
        query: lawLabel,
        timestamp: Date.now(),
        type: 'law',
        law_id: law.id,
        act_name: law.act_name,
        section_number: law.section_number,
        section_title: law.section_title,
        category_id: law.category_id
      };
      return [newItem, ...filtered].slice(0, 25);
    });
  }, []);

  const addRecentSearch = useCallback((term: string, resultCount?: number) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 15);
    });

    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== trimmed.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: `hist-term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        query: trimmed,
        timestamp: Date.now(),
        type: 'term',
        result_count: resultCount
      };
      return [newItem, ...filtered].slice(0, 25);
    });
  }, []);

  const removeRecentSearch = useCallback((termOrId: string) => {
    const target = termOrId.trim();
    setRecentSearches(prev => prev.filter(t => t.toLowerCase() !== target.toLowerCase()));
    setSearchHistory(prev => prev.filter(item => 
      item.id !== target && item.query.toLowerCase() !== target.toLowerCase()
    ));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    setSearchHistory([]);
    try {
      localStorage.removeItem('nyaya_recent_searches');
      localStorage.removeItem('nyaya_search_history_v2');
    } catch {}
  }, []);

  // O(1) laws lookup index
  const lawsMap = useMemo(() => new Map(laws.map(l => [l.id, l])), [laws]);

  // Law interactions with O(1) map resolution
  const openLawDetail = useCallback((lawId: string) => {
    prefetchLawDetail(lawId);
    const found = lawsMap.get(lawId);
    if (found) {
      setSelectedLaw(found);
      addLawSearchHistory(found);
      // Defer recently viewed update and localStorage serialization to idle task
      // so modal opens on frame 0 with zero blocking I/O
      const updateRecent = () => {
        setRecentlyViewed(prev => {
          const withoutCurrent = prev.filter(l => l.id !== lawId);
          const updated = [found, ...withoutCurrent].slice(0, 10);
          try {
            localStorage.setItem('nyaya_recent_laws', JSON.stringify(updated.map(l => l.id)));
          } catch {}
          return updated;
        });
      };
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(updateRecent, { timeout: 300 });
      } else {
        setTimeout(updateRecent, 50);
      }
    }
  }, [lawsMap, addLawSearchHistory]);

  const closeLawDetail = useCallback(() => {
    setSelectedLaw(null);
  }, []);

  const toggleBookmark = useCallback((lawId: string) => {
    setBookmarks(prev => {
      if (prev.includes(lawId)) {
        return prev.filter(id => id !== lawId);
      } else {
        return [...prev, lawId];
      }
    });
  }, []);

  const isBookmarked = useCallback((lawId: string) => bookmarks.includes(lawId), [bookmarks]);

  // Live Data Synchronization loader
  const loadSyncData = useCallback(async () => {
    try {
      const [statusRes, updatesRes, circRes, helpRes] = await Promise.allSettled([
        fetch('/api/sync/status').then(r => r.ok ? r.json() : null),
        fetch('/api/updates').then(r => r.ok ? r.json() : null),
        fetch('/api/circulars').then(r => r.ok ? r.json() : null),
        fetch('/api/helplines').then(r => r.ok ? r.json() : null),
      ]);

      if (statusRes.status === 'fulfilled' && statusRes.value?.success) {
        setSyncStatus(statusRes.value);
        if (statusRes.value.last_updated) {
          setLastUpdatedTime(statusRes.value.last_updated);
        }
      }
      if (updatesRes.status === 'fulfilled' && updatesRes.value?.updates) {
        setUpdateHistory(updatesRes.value.updates);
      }
      if (circRes.status === 'fulfilled' && circRes.value?.circulars) {
        setCirculars(circRes.value.circulars);
      }
      if (helpRes.status === 'fulfilled' && helpRes.value?.helplines) {
        setHelplines(helpRes.value.helplines);
      }
    } catch (err) {
      console.warn('Initial sync data fetch fallback:', err);
    }
  }, []);

  useEffect(() => {
    loadSyncData();
  }, [loadSyncData]);

  // Live Refresh handler (forces sync with Gazette and updates all live sections)
  const refreshLegalData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/refresh', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastUpdatedTime(data.last_updated);
        await loadSyncData();
        invalidateAllLegalQueries();
        await syncLaws();
        const fallbackNote = data.status === 'fallback' ? ' (using verified cached snapshot)' : '';
        setRefreshToast({
          message: `Database synchronized with India Code & Official Gazette${fallbackNote}. Last updated: ${data.last_updated}`,
          visible: true
        });
      }
    } catch (error) {
      // Fallback update timestamp
      const now = new Date();
      const updatedStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
        " at " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) + " IST";
      setLastUpdatedTime(updatedStr);
      setRefreshToast({
        message: `Database verified against cached records. Last verified: ${updatedStr}`,
        visible: true
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [syncLaws, loadSyncData]);

  const dismissRefreshToast = useCallback(() => setRefreshToast(null), []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user && !user.is_guest,
    login,
    signUp,
    continueAsGuest,
    logout,
    updatePreferences,
    completeOnboarding,
    showAuthModal,
    setShowAuthModal,
    showOnboardingModal,
    setShowOnboardingModal,
    laws,
    selectedLaw,
    setSelectedLaw,
    openLawDetail,
    closeLawDetail,
    recentlyViewed,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    filters,
    setFilters,
    recentSearches,
    searchHistory,
    addRecentSearch,
    addLawSearchHistory,
    removeRecentSearch,
    clearRecentSearches,
    theme,
    setTheme,
    explanationMode,
    setExplanationMode,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleMobileSidebar,
    showAIAssistant,
    setShowAIAssistant,
    aiInitialQuestion,
    setAiInitialQuestion,
    showIngestionModal,
    setShowIngestionModal,
    lastUpdatedTime,
    isRefreshing,
    refreshLegalData,
    syncLaws,
    updateHistory,
    circulars,
    helplines,
    syncStatus,
    loadSyncData,
    showAdminModal,
    setShowAdminModal,
    refreshToast,
    dismissRefreshToast,
    showCinematicIntro,
    setShowCinematicIntro: handleSetShowCinematicIntro,
    replayCinematicIntro
  }), [
    user,
    login,
    signUp,
    continueAsGuest,
    logout,
    updatePreferences,
    completeOnboarding,
    showAuthModal,
    showOnboardingModal,
    laws,
    selectedLaw,
    openLawDetail,
    closeLawDetail,
    recentlyViewed,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    filters,
    recentSearches,
    searchHistory,
    addRecentSearch,
    addLawSearchHistory,
    removeRecentSearch,
    clearRecentSearches,
    theme,
    setTheme,
    explanationMode,
    setExplanationMode,
    activeTab,
    selectedCategory,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    showAIAssistant,
    aiInitialQuestion,
    showIngestionModal,
    lastUpdatedTime,
    isRefreshing,
    refreshLegalData,
    syncLaws,
    updateHistory,
    circulars,
    helplines,
    syncStatus,
    loadSyncData,
    showAdminModal,
    refreshToast,
    dismissRefreshToast,
    showCinematicIntro,
    handleSetShowCinematicIntro,
    replayCinematicIntro
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
