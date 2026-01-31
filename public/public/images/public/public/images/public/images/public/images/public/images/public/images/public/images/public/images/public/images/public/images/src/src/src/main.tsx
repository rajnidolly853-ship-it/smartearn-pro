import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Context Providers
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { NavigationProvider } from './context/NavigationContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';

// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline use.');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Global State Providers */}
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <WalletProvider>
            <AppProvider>
              <NavigationProvider>
                <App />
              </NavigationProvider>
            </AppProvider>
          </WalletProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  </React.StrictMode>
);
