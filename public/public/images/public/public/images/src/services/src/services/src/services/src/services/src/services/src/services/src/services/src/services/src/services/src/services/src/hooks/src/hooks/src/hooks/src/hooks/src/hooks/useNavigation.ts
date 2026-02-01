import { useCallback } from 'react';
import { useNavigation as useNavigationContext } from '../context/NavigationContext';

type ScreenName = 
  | 'onboarding' | 'login' | 'home' | 'earn' | 'wallet' 
  | 'referral' | 'settings' | 'spin' | 'checkin' | 'ads' 
  | 'tasks' | 'withdraw' | 'history' | 'profile'
  | 'privacy' | 'terms' | 'support' | 'notifications';

interface UseNavigationReturn {
  currentScreen: ScreenName;
  history: ScreenName[];
  activeTab: string;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  goHome: () => void;
  goToEarn: () => void;
  goToWallet: () => void;
  goToReferral: () => void;
  goToSettings: () => void;
  goToSpin: () => void;
  goToCheckIn: () => void;
  goToAds: () => void;
  goToTasks: () => void;
  goToWithdraw: () => void;
  goToHistory: () => void;
  goToProfile: () => void;
  canGoBack: boolean;
  isOnHomeScreen: boolean;
}

export const useNav = (): UseNavigationReturn => {
  const { currentScreen, history, navigate, goBack, activeTab } = useNavigationContext();

  // Quick navigation helpers
  const goHome = useCallback(() => navigate('home'), [navigate]);
  const goToEarn = useCallback(() => navigate('earn'), [navigate]);
  const goToWallet = useCallback(() => navigate('wallet'), [navigate]);
  const goToReferral = useCallback(() => navigate('referral'), [navigate]);
  const goToSettings = useCallback(() => navigate('settings'), [navigate]);
  const goToSpin = useCallback(() => navigate('spin'), [navigate]);
  const goToCheckIn = useCallback(() => navigate('checkin'), [navigate]);
  const goToAds = useCallback(() => navigate('ads'), [navigate]);
  const goToTasks = useCallback(() => navigate('tasks'), [navigate]);
  const goToWithdraw = useCallback(() => navigate('withdraw'), [navigate]);
  const goToHistory = useCallback(() => navigate('history'), [navigate]);
  const goToProfile = useCallback(() => navigate('profile'), [navigate]);

  return {
    currentScreen: currentScreen as ScreenName,
    history: history as ScreenName[],
    activeTab,
    navigate,
    goBack,
    goHome,
    goToEarn,
    goToWallet,
    goToReferral,
    goToSettings,
    goToSpin,
    goToCheckIn,
    goToAds,
    goToTasks,
    goToWithdraw,
    goToHistory,
    goToProfile,
    canGoBack: history.length > 1,
    isOnHomeScreen: currentScreen === 'home'
  };
};

export default useNav;
