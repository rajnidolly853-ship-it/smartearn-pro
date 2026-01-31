import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_CONFIG } from '../config/app.config';

interface AppContextType {
  theme: 'dark' | 'light';
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  version: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<'dark'>('dark'); // Force Dark Mode for this app
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial app setup checks can go here
    console.log(`🚀 ${APP_CONFIG.NAME} v${APP_CONFIG.VERSION} Initialized`);
  }, []);

  return (
    <AppContext.Provider value={{ theme, isLoading, setLoading, version: APP_CONFIG.VERSION }}>
      <div className={`${theme} min-h-screen bg-gray-900 text-white`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
