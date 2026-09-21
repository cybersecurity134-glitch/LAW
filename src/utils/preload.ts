/**
 * Resource Preloader & Cache Warming
 * Pre-fetches lazy component chunks and primes data caches on hover/pointer-down
 * so transitions and modals open instantaneously with 0ms latency.
 */

// Cache of preloaded module promises
const preloadedModules = new Set<string>();

export function preloadChunk(name: string, importFn: () => Promise<unknown>): void {
  if (preloadedModules.has(name)) return;
  preloadedModules.add(name);
  // Schedule fetch during idle/microtask to never interrupt current frame
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        importFn().catch(() => {
          preloadedModules.delete(name);
        });
      }, { timeout: 1500 });
    } else {
      setTimeout(() => {
        importFn().catch(() => {
          preloadedModules.delete(name);
        });
      }, 50);
    }
  }
}

// Preload specific views
export const preloadSearchView = () => 
  preloadChunk('search', () => import('../components/views/SearchView'));

export const preloadCategoriesView = () => 
  preloadChunk('categories', () => import('../components/views/CategoriesView'));

export const preloadSavedView = () => 
  preloadChunk('saved', () => import('../components/views/SavedView'));

export const preloadProfileView = () => 
  preloadChunk('profile', () => import('../components/views/ProfileView'));

export const preloadTabletLayout = () => 
  preloadChunk('tablet', () => import('../components/tablet/TabletLayout'));

export const preloadLawDetail = () => 
  preloadChunk('lawDetail', () => import('../components/LawDetailModal'));

export const preloadAIAssistant = () => 
  preloadChunk('aiAssistant', () => import('../components/AIAssistantModal'));

export const preloadAuthModal = () => 
  preloadChunk('auth', () => import('../components/AuthModal'));

export const preloadOnboarding = () => 
  preloadChunk('onboarding', () => import('../components/OnboardingModal'));

export const preloadTab = (tab: 'home' | 'search' | 'categories' | 'saved' | 'profile' | string) => {
  switch (tab) {
    case 'search':
      preloadSearchView();
      break;
    case 'categories':
      preloadCategoriesView();
      break;
    case 'saved':
      preloadSavedView();
      break;
    case 'profile':
      preloadProfileView();
      break;
  }
};
