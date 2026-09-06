import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { CategoriesView } from './components/views/CategoriesView';
import { SavedView } from './components/views/SavedView';
import { ProfileView } from './components/views/ProfileView';
import { LawDetailModal } from './components/LawDetailModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { RefreshStatusToast } from './components/RefreshStatusToast';
import { LawBackground } from './components/legal/LawBackground';
import { TabletLayout } from './components/tablet/TabletLayout';
import { CinematicOpening } from './components/cinematic/CinematicOpening';
import { useBreakpoint } from './utils/useBreakpoint';
import { pageVariants } from './utils/motion';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedLaw, 
    showAIAssistant, 
    showAuthModal, 
    showOnboardingModal,
    showCinematicIntro,
    setShowCinematicIntro
  } = useApp();

  const { isTablet, isTabletLandscape } = useBreakpoint();

  const isModalOpen = Boolean(
    (!isTablet && selectedLaw) || showAIAssistant || showAuthModal || showOnboardingModal || showCinematicIntro
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-[#FFFFFF] flex flex-col font-sans transition-colors duration-300 selection:bg-orange-500/30 dark:selection:bg-[#7C5CFF]/30 selection:text-orange-900 dark:selection:text-white overflow-x-hidden relative">
      
      {/* Law-Themed Jurisprudential Liquid Glass Background */}
      <LawBackground />

      {/* Main Page Layout Layer (Smoothly blurs into depth when any modal opens) */}
      <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${isModalOpen ? 'app-modal-blur-active' : 'app-modal-blur-inactive'}`}>
        {/* Top Navbar */}
        <Navbar />

        {/* Prominent Legal Disclaimer */}
        <DisclaimerBanner />

        {/* Main Layout Body: Adaptive Tablet 2/3-Column vs Standard Screen */}
        {isTablet ? (
          <div className="flex-1 w-full mx-auto flex flex-col z-10 relative">
            {activeTab === 'profile' ? (
              <main className="flex-1 p-6 lg:p-8 min-w-0 max-w-4xl mx-auto w-full pb-8">
                <ProfileView />
              </main>
            ) : (
              <TabletLayout isTabletLandscape={isTabletLandscape} />
            )}
          </div>
        ) : (
          <div className="flex-1 max-w-7xl w-full mx-auto flex z-10 relative">
            {/* Left Sidebar (Desktop & Mobile Drawer) */}
            <Sidebar />

            {/* Main View Screen Container with Shared Route Transitions */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full pb-24 md:pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  {activeTab === 'home' && <HomeView />}
                  {activeTab === 'search' && <SearchView />}
                  {activeTab === 'categories' && <CategoriesView />}
                  {activeTab === 'saved' && <SavedView />}
                  {activeTab === 'profile' && <ProfileView />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        )}

        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>

      {/* Interactive Modals & Overlays (Render above the blurred app layer) */}
      {!isTablet && <LawDetailModal />}
      <AIAssistantModal />
      <AuthModal />
      <OnboardingModal />
      <RefreshStatusToast />

      {/* Cinematic Opening Animation (Indian Legal / Ashoka Chakra & Scale of Justice) */}
      <AnimatePresence>
        {showCinematicIntro && (
          <CinematicOpening onComplete={() => setShowCinematicIntro(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
