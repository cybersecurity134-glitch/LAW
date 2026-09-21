import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HomeView } from './components/views/HomeView';
import { RefreshStatusToast } from './components/RefreshStatusToast';
import { LawBackground } from './components/legal/LawBackground';
import { ViewSkeleton } from './components/ViewSkeleton';
import { useBreakpoint } from './utils/useBreakpoint';
import { tabSpringVariants } from './utils/motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Lazy-loaded views and components for minimum initial bundle size and instantaneous navigation
const SearchView = lazy(() => import('./components/views/SearchView').then(m => ({ default: m.SearchView })));
const CategoriesView = lazy(() => import('./components/views/CategoriesView').then(m => ({ default: m.CategoriesView })));
const SavedView = lazy(() => import('./components/views/SavedView').then(m => ({ default: m.SavedView })));
const ProfileView = lazy(() => import('./components/views/ProfileView').then(m => ({ default: m.ProfileView })));
const TabletLayout = lazy(() => import('./components/tablet/TabletLayout').then(m => ({ default: m.TabletLayout })));
const LawDetailModal = lazy(() => import('./components/LawDetailModal').then(m => ({ default: m.LawDetailModal })));
const AIAssistantModal = lazy(() => import('./components/AIAssistantModal').then(m => ({ default: m.AIAssistantModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const OnboardingModal = lazy(() => import('./components/OnboardingModal').then(m => ({ default: m.OnboardingModal })));
const LawBookIngestionModal = lazy(() => import('./components/LawBookIngestionModal').then(m => ({ default: m.LawBookIngestionModal })));
const AdminOverrideModal = lazy(() => import('./components/AdminOverrideModal').then(m => ({ default: m.AdminOverrideModal })));
const CinematicOpening = lazy(() => import('./components/cinematic/CinematicOpening').then(m => ({ default: m.CinematicOpening })));

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedLaw, 
    showAIAssistant, 
    showAuthModal, 
    showOnboardingModal, 
    showIngestionModal,
    showAdminModal,
    showCinematicIntro,
    setShowCinematicIntro
  } = useApp();

  const { isTablet, isTabletLandscape } = useBreakpoint();

  // Lazy retention flags: modals stay mounted after first trigger to ensure smooth exit animations
  const [hasLoadedDetail, setHasLoadedDetail] = useState(false);
  const [hasLoadedAI, setHasLoadedAI] = useState(false);
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false);
  const [hasLoadedOnboarding, setHasLoadedOnboarding] = useState(false);
  const [hasLoadedIngestion, setHasLoadedIngestion] = useState(false);
  const [hasLoadedAdmin, setHasLoadedAdmin] = useState(false);

  useEffect(() => {
    if (selectedLaw) setHasLoadedDetail(true);
  }, [selectedLaw]);

  useEffect(() => {
    if (showAIAssistant) setHasLoadedAI(true);
  }, [showAIAssistant]);

  useEffect(() => {
    if (showAuthModal) setHasLoadedAuth(true);
  }, [showAuthModal]);

  useEffect(() => {
    if (showOnboardingModal) setHasLoadedOnboarding(true);
  }, [showOnboardingModal]);

  useEffect(() => {
    if (showIngestionModal) setHasLoadedIngestion(true);
  }, [showIngestionModal]);

  useEffect(() => {
    if (showAdminModal) setHasLoadedAdmin(true);
  }, [showAdminModal]);

  const isModalOpen = Boolean(
    (!isTablet && selectedLaw) || showAIAssistant || showAuthModal || showOnboardingModal || showIngestionModal || showAdminModal || showCinematicIntro
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-[#FFFFFF] flex flex-col font-sans transition-colors duration-300 selection:bg-orange-500/30 dark:selection:bg-[#7C5CFF]/30 selection:text-orange-900 dark:selection:text-white overflow-x-hidden relative">
      
      {/* Law-Themed Jurisprudential Liquid Glass Background */}
      <LawBackground />

      {/* Main Page Layout Layer (Hardware-accelerated depth field) */}
      <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${isModalOpen ? 'app-modal-blur-active' : 'app-modal-blur-inactive'}`}>
        {/* Top Navbar */}
        <Navbar />

        {/* Prominent Legal Disclaimer */}
        <DisclaimerBanner />

        {/* Main Layout Body: Adaptive Tablet 2/3-Column vs Standard Screen */}
        {isTablet ? (
          <div className="flex-1 w-full mx-auto flex flex-col z-10 relative">
            <Suspense fallback={<div className="p-8 max-w-4xl mx-auto w-full"><ViewSkeleton type="search" /></div>}>
              {activeTab === 'profile' ? (
                <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-4xl mx-auto w-full pb-8">
                  <ProfileView />
                </main>
              ) : (
                <TabletLayout isTabletLandscape={isTabletLandscape} />
              )}
            </Suspense>
          </div>
        ) : (
          <div className="flex-1 max-w-7xl w-full mx-auto flex z-10 relative">
            {/* Left Sidebar (Desktop & Mobile Drawer) */}
            <Sidebar />

            {/* Main View Screen Container with Fluid Spring Tab Transitions */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full pb-24 md:pb-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  variants={tabSpringVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <Suspense fallback={<ViewSkeleton type={activeTab as any} />}>
                    {activeTab === 'home' && <HomeView />}
                    {activeTab === 'search' && <SearchView />}
                    {activeTab === 'categories' && <CategoriesView />}
                    {activeTab === 'saved' && <SavedView />}
                    {activeTab === 'profile' && <ProfileView />}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        )}

        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>

      {/* Interactive Modals & Overlays (Loaded on demand with exit animations intact) */}
      {!isTablet && hasLoadedDetail && (
        <Suspense fallback={null}>
          <LawDetailModal />
        </Suspense>
      )}

      {hasLoadedAI && (
        <Suspense fallback={null}>
          <AIAssistantModal />
        </Suspense>
      )}

      {hasLoadedAuth && (
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      )}

      {hasLoadedOnboarding && (
        <Suspense fallback={null}>
          <OnboardingModal />
        </Suspense>
      )}

      {hasLoadedIngestion && (
        <Suspense fallback={null}>
          <LawBookIngestionModal />
        </Suspense>
      )}

      {hasLoadedAdmin && (
        <Suspense fallback={null}>
          <AdminOverrideModal />
        </Suspense>
      )}

      <RefreshStatusToast />

      {/* Cinematic Opening Animation */}
      <AnimatePresence>
        {showCinematicIntro && (
          <Suspense fallback={null}>
            <CinematicOpening onComplete={() => setShowCinematicIntro(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </QueryClientProvider>
  );
}
