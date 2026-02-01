import React, { useEffect, useState } from 'react';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { getSystemConfig } from './services/admin.service';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EarnScreen from './screens/EarnScreen';
import WalletScreen from './screens/WalletScreen';
import ReferralScreen from './screens/ReferralScreen';
import SettingsScreen from './screens/SettingsScreen';
import SpinWheelScreen from './screens/SpinWheelScreen';
import DailyCheckInScreen from './screens/DailyCheckInScreen';
import WatchAdsScreen from './screens/WatchAdsScreen';
import TasksScreen from './screens/TasksScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsScreen from './screens/TermsScreen';
import SupportScreen from './screens/SupportScreen';

// Admin Screens
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminWithdrawals from './screens/admin/AdminWithdrawals';
import AdminUsers from './screens/admin/AdminUsers';
import AdminEvents from './screens/admin/AdminEvents';

// Components
import Toast from './components/common/Toast';
import ExitHandler from './components/navigation/ExitHandler';
import AdminRoute from './components/auth/AdminRoute';
import Modal from './components/common/Modal';

const App: React.FC = () => {
  const { currentScreen, history, navigate } = useNavigation();
  const { isAuthenticated, isGuest } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);
  
  // Event Popup State
  const [eventPopup, setEventPopup] = useState<{ show: boolean; title: string } | null>(null);

  // Handle Splash Screen Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      checkEvents(); // Check for festival offers after splash
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Check for active admin events
  const checkEvents = async () => {
    try {
      const config = await getSystemConfig();
      if (config && config.announcement) {
        // Show popup only once per session
        if (!sessionStorage.getItem('event_seen')) {
          setEventPopup({ show: true, title: config.announcement });
          sessionStorage.setItem('event_seen', 'true');
        }
      }
    } catch (e) {
      console.error("Event check failed", e);
    }
  };

  // If Splash is active, show it
  if (showSplash) {
    return <SplashScreen />;
  }

  // Routing Logic
  const renderScreen = () => {
    // Public Routes
    if (!isAuthenticated && !isGuest) {
      switch (currentScreen) {
        case 'onboarding':
          return <OnboardingScreen />;
        case 'login':
        default:
          return <LoginScreen />;
      }
    }

    // Protected Routes (Authenticated)
    switch (currentScreen) {
      // User Routes
      case 'home': return <HomeScreen />;
      case 'earn': return <EarnScreen />;
      case 'wallet': return <WalletScreen />;
      case 'referral': return <ReferralScreen />;
      case 'settings': return <SettingsScreen />;
      case 'spin': return <SpinWheelScreen />;
      case 'checkin': return <DailyCheckInScreen />;
      case 'ads': return <WatchAdsScreen />;
      case 'tasks': return <TasksScreen />;
      case 'withdraw': return <WithdrawScreen />;
      case 'history': return <TransactionHistoryScreen />;
      case 'profile': return <ProfileScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'privacy': return <PrivacyPolicyScreen />;
      case 'terms': return <TermsScreen />;
      case 'support': return <SupportScreen />;

      // Admin Routes (Wrapped in AdminRoute)
      case 'admin-dashboard': 
        return <AdminRoute><AdminDashboard /></AdminRoute>;
      case 'admin-withdrawals': 
        return <AdminRoute><AdminWithdrawals /></AdminRoute>;
      case 'admin-users': 
        return <AdminRoute><AdminUsers /></AdminRoute>;
      case 'admin-events': 
        return <AdminRoute><AdminEvents /></AdminRoute>;

      default:
        return <HomeScreen />;
    }
  };

  // Determine Layout based on authentication state
  const Layout = (isAuthenticated || isGuest) ? MainLayout : AuthLayout;

  // For Admin screens, we might want to hide standard layout sometimes, 
  // but MainLayout adapts well.
  
  // Hack to access admin panel (Triple tap logic could be added here in future)
  // For now, assume a hidden button or direct link logic exists.

  return (
    <>
      <Layout hideHeader={currentScreen === 'home'} hideBottomNav={!['home', 'earn', 'spin', 'wallet', 'profile'].includes(currentScreen)}>
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </Layout>

      {/* Global Overlays */}
      <Toast />
      <ExitHandler />

      {/* Festival Event Popup */}
      {eventPopup && (
        <Modal 
          isOpen={eventPopup.show} 
          onClose={() => setEventPopup(null)}
          title="🎉 Special Offer!"
          type="center"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-neon-400 mb-2">{eventPopup.title}</h3>
            <p className="text-gray-300 text-sm mb-6">
              Complete tasks today to earn <strong>Double Rewards!</strong>
            </p>
            <button 
              onClick={() => { setEventPopup(null); navigate('earn'); }}
              className="w-full py-3 bg-neon-500 text-dark-950 font-bold rounded-xl"
            >
              Start Earning Now
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default App;
