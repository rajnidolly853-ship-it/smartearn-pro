import React from 'react';
import MainLayout from '../layouts/MainLayout';
import LanguageSelector from '../components/settings/LanguageSelector';
import DisclaimerBanner from '../components/settings/DisclaimerBanner';
import SettingsItem from '../components/settings/SettingsItem';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../context/NavigationContext';

const SettingsScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { logout } = useAuth();

  return (
    <MainLayout headerTitle="Settings" showBackButton>
      <div className="p-4 pb-24 space-y-6">
        
        {/* Language */}
        <section>
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3 ml-1">
            Preferences
          </h3>
          <LanguageSelector />
        </section>

        {/* Account Actions */}
        <section>
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3 ml-1">
            Account
          </h3>
          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
            <SettingsItem 
              icon={<span>🔔</span>} 
              label="Notifications" 
              onClick={() => navigate('notifications')}
            />
            <SettingsItem 
              icon={<span>👤</span>} 
              label="Edit Profile" 
              onClick={() => navigate('profile')}
            />
          </div>
        </section>

        {/* Legal */}
        <section>
          <h3 className="text-xs text-gray-500 font-bold uppercase mb-3 ml-1">
            Legal & Support
          </h3>
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
              icon={<span>✉️</span>} 
              label="Help Center" 
              onClick={() => navigate('support')}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden mt-4">
            <SettingsItem 
              icon={<span>🚪</span>} 
              label="Log Out" 
              isDanger
              onClick={logout}
            />
          </div>
        </section>

        {/* Disclaimer */}
        <DisclaimerBanner />

        {/* Version Info */}
        <div className="text-center pb-8">
          <p className="text-[10px] text-gray-600">
            SmartEarn Pro v1.0.0 (Build 102)<br/>
            © 2024 SmartEarn Team
          </p>
        </div>

      </div>
    </MainLayout>
  );
};

export default SettingsScreen;
