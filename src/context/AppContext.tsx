import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LawItem, UserProfile, UserPreferences, SearchFilters, LegalUpdateHistory } from '../types';
import { LAWS_DATABASE, UPDATE_HISTORY } from '../data/laws';
import { CATEGORIES } from '../data/categories';

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
  addRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Theme & Mode
  theme: 'liquid-glass' | 'day' | 'night' | 'system';
  setTheme: (theme: 'liquid-glass' | 'day' | 'night' | 'system') => void;
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

  // Refresh & Updates
  lastUpdatedTime: string;
  isRefreshing: boolean;
  refreshLegalData: () => Promise<void>;
  updateHistory: LegalUpdateHistory[];
  refreshToast: { message: string; visible: boolean } | null;
  dismissRefreshToast: () => void;

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
  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(true);

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
    const saved = localStorage.getItem('nyaya_bookmarks');
    return saved ? JSON.parse(saved) : ['it-act-sec-66d', 'mva-sec-185', 'bns-sec-103'];
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

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('nyaya_recent_searches');
    return saved ? JSON.parse(saved) : ['cyber crime', 'drunk driving', 'Section 66', 'cheque bounce'];
  });

  // Theme & Mode: 'liquid-glass' (iOS 26 signature), 'day', 'night', 'system'
  const [theme, setThemeState] = useState<'liquid-glass' | 'day' | 'night' | 'system'>(() => {
    const saved = localStorage.getItem('nyaya_theme');
    return (saved as 'liquid-glass' | 'day' | 'night' | 'system') || 'day';
  });

  const [explanationMode, setExplanationModeState] = useState<'simple' | 'detailed'>(() => {
    const saved = localStorage.getItem('nyaya_mode');
    return (saved as 'simple' | 'detailed') || 'simple';
  });

  // AI Assistant
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string>('');

  // Refresh status
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('5 Sep 2026 at 02:30 PM IST');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [updateHistory] = useState<LegalUpdateHistory[]>(UPDATE_HISTORY);
  const [refreshToast, setRefreshToast] = useState<{ message: string; visible: boolean } | null>(null);

  // Apply Dark/Light theme and Liquid Glass class to document element
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      root.classList.remove('liquid-glass', 'theme-day', 'theme-night', 'theme-morrison', 'dark');
      
      let isDark = false;
      if (theme === 'liquid-glass') {
        root.classList.add('liquid-glass', 'theme-morrison');
        isDark = false;
      } else if (theme === 'night') {
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
      localStorage.setItem('nyaya_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nyaya_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('nyaya_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('nyaya_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nyaya_mode', explanationMode);
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

  const login = (email: string, name?: string) => {
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
  };

  const signUp = (email: string, name: string) => {
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
  };

  const continueAsGuest = () => {
    setUser(GUEST_PROFILE);
    setShowAuthModal(false);
  };

  const logout = () => {
    localStorage.removeItem('nyaya_user');
    setUser(null);
    setShowAuthModal(true);
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      preferences: {
        ...user.preferences,
        ...prefs
      }
    };
    setUser(updated);
    if (!user.is_guest) {
      saveAccountToRegistry(updated);
    }
    if (prefs.theme) setThemeState(prefs.theme);
    if (prefs.explanation_mode) setExplanationModeState(prefs.explanation_mode);
  };

  const completeOnboarding = (prefs: UserPreferences) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      preferences: prefs,
      onboarding_completed: true
    };
    setUser(updated);
    if (!user.is_guest) {
      saveAccountToRegistry(updated);
    }
    setThemeState(prefs.theme);
    setExplanationModeState(prefs.explanation_mode);
    setShowOnboardingModal(false);
    setActiveTab('home');
  };

  const setTheme = (t: 'day' | 'night' | 'system') => {
    setThemeState(t);
    if (user) {
      updatePreferences({ theme: t });
    }
  };

  const setExplanationMode = (m: 'simple' | 'detailed') => {
    setExplanationModeState(m);
    if (user) {
      updatePreferences({ explanation_mode: m });
    }
  };

  // Law interactions
  const openLawDetail = useCallback((lawId: string) => {
    const found = laws.find(l => l.id === lawId);
    if (found) {
      setSelectedLaw(found);
      // add to recently viewed
      setRecentlyViewed(prev => {
        const withoutCurrent = prev.filter(l => l.id !== lawId);
        const updated = [found, ...withoutCurrent].slice(0, 10);
        localStorage.setItem('nyaya_recent_laws', JSON.stringify(updated.map(l => l.id)));
        return updated;
      });
    }
  }, [laws]);

  const closeLawDetail = useCallback(() => {
    setSelectedLaw(null);
  }, []);

  const toggleBookmark = (lawId: string) => {
    setBookmarks(prev => {
      if (prev.includes(lawId)) {
        return prev.filter(id => id !== lawId);
      } else {
        return [...prev, lawId];
      }
    });
  };

  const isBookmarked = (lawId: string) => bookmarks.includes(lawId);

  const addRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      const nextList = [trimmed, ...filtered].slice(0, 12);
      try {
        localStorage.setItem('nyaya_recent_searches', JSON.stringify(nextList));
      } catch (e) {
        // Safe fallback
      }
      return nextList;
    });
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches(prev => {
      const nextList = prev.filter(t => t.toLowerCase() !== term.toLowerCase().trim());
      try {
        localStorage.setItem('nyaya_recent_searches', JSON.stringify(nextList));
      } catch (e) {
        // Safe fallback
      }
      return nextList;
    });
  };

  const clearRecentSearches = () => {
    try {
      localStorage.setItem('nyaya_recent_searches', JSON.stringify([]));
    } catch (e) {}
    setRecentSearches([]);
  };

  // Live Refresh handler
  const refreshLegalData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/refresh', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setLastUpdatedTime(data.last_updated);
        setRefreshToast({
          message: `Database synchronized with India Code & Official Gazette. Last updated: ${data.last_updated}`,
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
        message: `Database verified. Last updated: ${updatedStr}`,
        visible: true
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const dismissRefreshToast = () => setRefreshToast(null);

  return (
    <AppContext.Provider
      value={{
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
        addRecentSearch,
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
        lastUpdatedTime,
        isRefreshing,
        refreshLegalData,
        updateHistory,
        refreshToast,
        dismissRefreshToast,
        showCinematicIntro,
        setShowCinematicIntro,
        replayCinematicIntro
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
