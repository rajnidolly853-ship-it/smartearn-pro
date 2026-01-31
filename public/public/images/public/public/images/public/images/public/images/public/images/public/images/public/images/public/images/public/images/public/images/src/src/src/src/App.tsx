import React, { useEffect } from 'react';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

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

// Components
import Toast from './components/common/Toast';
import ExitHandler from './components/navigation/ExitHandler';

const App: React.FC = () => {
  const { currentScreen, history } = useNavigation();
  const { isLoading, isAuthenticated, isGuest } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);

  // Handle Splash Screen Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5s Splash Duration
    return () => clearTimeout(timer);
  }, []);

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
      case 'home':
        return <HomeScreen />;
      case 'earn':
        return <EarnScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'referral':
        return <ReferralScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'spin':
        return <SpinWheelScreen />;
      case 'checkin':
        return <DailyCheckInScreen />;
      case 'ads':
        return <WatchAdsScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'withdraw':
        return <WithdrawScreen />;
      case 'history':
        return <TransactionHistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Determine Layout based on authentication state
  const Layout = (isAuthenticated || isGuest) ? MainLayout : AuthLayout;

  return (
    <>
      <Layout>
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </Layout>

      {/* Global Overlays */}
      <Toast />
      <ExitHandler />
    </>
  );
};

export default App;
