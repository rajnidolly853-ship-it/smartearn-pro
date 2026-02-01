import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/navigation/Header';
import BottomNav from '../components/navigation/BottomNav';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { pageTransition } from '../utils/animations';

interface MainLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  headerRight?: ReactNode;
  fullScreen?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideHeader = false,
  hideBottomNav = false,
  headerTitle,
  showBackButton = false,
  headerRight,
  fullScreen = false
}) => {
  const { currentScreen } = useNavigation();
  const { userProfile } = useAuth();

  // Determine if we should show back button
  const shouldShowBack = showBackButton || !['home', 'earn', 'wallet', 'referral', 'settings'].includes(currentScreen);

  // Get header title based on current screen
  const getHeaderTitle = (): string => {
    if (headerTitle) return headerTitle;

    const titles: Record<string, string> = {
      home: `Hello, ${userProfile?.displayName?.split(' ')[0] || 'User'}`,
      earn: 'Earn Coins',
      wallet: 'My Wallet',
      referral: 'Refer & Earn',
      settings: 'Settings',
      spin: 'Spin & Win',
      checkin: 'Daily Check-In',
      ads: 'Watch & Earn',
      tasks: 'Complete Tasks',
      withdraw: 'Withdraw',
      history: 'Transaction History',
      profile: 'My Profile',
      notifications: 'Notifications',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      support: 'Contact Support'
    };

    return titles[currentScreen] || 'SmartEarn Pro';
  };

  return (
    <div className="main-layout min-h-screen bg-dark-950 text-white flex flex-col overflow-hidden">
      {/* Safe Area - Top */}
      <div className="safe-area-top bg-dark-950" style={{ paddingTop: 'env(safe-area-inset-top)' }} />

      {/* Header */}
      {!hideHeader && (
        <Header
          title={getHeaderTitle()}
          showBack={shouldShowBack}
          rightElement={headerRight}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`
          flex-1 overflow-y-auto overflow-x-hidden
          ${!hideHeader ? 'pt-0' : 'pt-safe-top'}
          ${!hideBottomNav ? 'pb-20' : 'pb-safe-bottom'}
          ${fullScreen ? '' : 'px-4'}
          scrollbar-hide
        `}
        style={{
          minHeight: fullScreen ? '100vh' : 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}

      {/* Safe Area - Bottom (when nav is hidden) */}
      {hideBottomNav && (
        <div className="safe-area-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      )}

      {/* Global Overlay for Modals */}
      <div id="modal-root" />

      {/* Floating Elements Container */}
      <div id="floating-root" />
    </div>
  );
};

export default MainLayout;
