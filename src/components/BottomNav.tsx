import React from 'react';
import { Home, Search, Layers, Bookmark, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  id: 'home' | 'search' | 'categories' | 'saved' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const MOBILE_THEMES: Record<string, { activeText: string; indicator: string; badge: string; ping: string; glow: string }> = {
  home: {
    activeText: 'text-amber-600 dark:text-amber-400 font-bold',
    indicator: 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    badge: 'bg-amber-500 text-white',
    ping: 'bg-amber-400',
    glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
  },
  search: {
    activeText: 'text-cyan-600 dark:text-cyan-400 font-bold',
    indicator: 'bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    badge: 'bg-cyan-500 text-white',
    ping: 'bg-cyan-400',
    glow: 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
  },
  categories: {
    activeText: 'text-purple-600 dark:text-purple-400 font-bold',
    indicator: 'bg-gradient-to-r from-purple-400 to-fuchsia-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
    badge: 'bg-purple-500 text-white',
    ping: 'bg-purple-400',
    glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
  },
  saved: {
    activeText: 'text-rose-600 dark:text-rose-400 font-bold',
    indicator: 'bg-gradient-to-r from-rose-400 to-pink-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    badge: 'bg-rose-500 text-white',
    ping: 'bg-rose-400',
    glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
  },
  profile: {
    activeText: 'text-orange-600 dark:text-[#a78bfa] font-bold',
    indicator: 'bg-gradient-to-r from-orange-400 to-amber-500 dark:from-[#7C5CFF] dark:to-[#9B82FF] shadow-[0_0_8px_rgba(124,92,255,0.8)]',
    badge: 'bg-orange-500 text-white',
    ping: 'bg-orange-400',
    glow: 'drop-shadow-[0_0_8px_rgba(124,92,255,0.5)]'
  }
};

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, bookmarks } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: bookmarks.length },
    { id: 'profile', label: 'More', icon: Menu },
  ];

  return (
    <nav className="min-[600px]:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0B0B0B]/95 border-t border-slate-200/80 dark:border-[#292929] backdrop-blur-2xl transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-[env(safe-area-inset-bottom,4px)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const theme = MOBILE_THEMES[item.id] || MOBILE_THEMES.home;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 gap-1 transition-all duration-200 cursor-pointer ${
                isActive 
                  ? `${theme.activeText} scale-105 dark:text-[#7C5CFF]` 
                  : 'text-slate-500 dark:text-[#777777] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? `stroke-[2.5] ${theme.glow}` : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-bold ${theme.badge} rounded-full min-w-[15px] text-center shadow-xs font-mono`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -top-1 -left-1 flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${theme.ping}`} />
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${theme.badge}`} />
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight whitespace-nowrap font-medium">{item.label}</span>
              {isActive && (
                <div className={`absolute bottom-0.5 w-7 h-1 rounded-full ${theme.indicator} dark:bg-[#7C5CFF] dark:shadow-[0_0_8px_rgba(124,92,255,0.8)] animate-pulse`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
