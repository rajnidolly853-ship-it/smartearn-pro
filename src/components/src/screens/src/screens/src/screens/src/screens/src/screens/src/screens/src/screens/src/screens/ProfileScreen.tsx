import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ProfileSection from '../components/settings/ProfileSection';
import SettingsItem from '../components/settings/SettingsItem';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../context/NavigationContext';

const ProfileScreen: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { navigate } = useNavigation();

  return (
    <MainLayout headerTitle="Profile">
      <div className="pb-24">
        
        {/* Profile Header */}
        <div className="bg-dark-900 border-b border-white/5 pb-4">
          <ProfileSection profile={userProfile} />
        </div>

        {/* Menu Items */}
        <div className="mt-4 px-4 space-y-3">
          
          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
            <SettingsItem 
              icon={<span>⚙️</span>} 
              label="App Settings" 
              onClick={() => navigate('settings')}
            />
            <SettingsItem 
              icon={<span>📜</span>} 
              label="Transaction History" 
              onClick={() => navigate('history')}
            />
          </div>

          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
            <SettingsItem 
              icon={<span>🔒</span>} 
              label="Privacy Policy" 
              onClick={() => navigate('privacy')}
            />
            <SettingsItem 
              icon={<span>📄</span>} 
              label="Terms of Service" 
              onClick={() => navigate('terms')}
            />
            <SettingsItem 
              icon={<span>💬</span>} 
              label="Contact Support" 
              onClick={() => navigate('support')}
            />
          </div>

          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
            <SettingsItem 
              icon={<span>🚪</span>} 
              label="Logout" 
              isDanger
              onClick={logout}
            />
          </div>

        </div>

        {/* Version */}
        <div className="text-center mt-8">
          <p className="text-[10px] text-gray-600">SmartEarn Pro v1.0.0</p>
        </div>

      </div>
    </MainLayout>
  );
};

export default ProfileScreen;
