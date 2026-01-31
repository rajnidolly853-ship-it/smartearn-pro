import React, { createContext, useContext, useState, useEffect } from 'react';

type ScreenName = 
  | 'onboarding' | 'login' | 'home' | 'earn' | 'wallet' 
  | 'referral' | 'settings' | 'spin' | 'checkin' | 'ads' 
  | 'tasks' | 'withdraw' | 'history' | 'profile';

interface NavigationContextType {
  currentScreen: ScreenName;
  history: ScreenName[];
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  activeTab: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ScreenName[]>(['home']);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [activeTab, setActiveTab] = useState<string>('home');

  const navigate = (screen: ScreenName) => {
    // Prevent adding duplicates to history stack top
    if (currentScreen === screen) return;

    setHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    
    // Update active tab for bottom nav
    if (['home', 'earn', 'wallet', 'referral', 'settings'].includes(screen)) {
      setActiveTab(screen);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevScreen = newHistory[newHistory.length - 1];
      
      setHistory(newHistory);
      setCurrentScreen(prevScreen);
      
      if (['home', 'earn', 'wallet', 'referral', 'settings'].includes(prevScreen)) {
        setActiveTab(prevScreen);
      }
    }
  };

  // Browser Back Button Support
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      goBack();
    };
    
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [history]);

  return (
    <NavigationContext.Provider value={{ currentScreen, history, navigate, goBack, activeTab }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
