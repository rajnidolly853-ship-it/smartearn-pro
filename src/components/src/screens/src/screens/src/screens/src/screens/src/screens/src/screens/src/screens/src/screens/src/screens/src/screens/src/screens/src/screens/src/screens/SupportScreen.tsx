import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { APP_CONFIG } from '../config/app.config';

const SupportScreen: React.FC = () => {
  const handleEmail = () => {
    window.location.href = `mailto:${APP_CONFIG.SUPPORT_EMAIL}`;
  };

  return (
    <MainLayout headerTitle="Support" showBackButton>
      <div className="p-6 pb-24 flex flex-col items-center text-center">
        
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-4xl mb-6">
          📬
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          How can we help?
        </h2>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          If you are facing issues with withdrawals, tasks, or login, please reach out to us.
        </p>

        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 w-full mb-6">
          <h4 className="text-sm font-semibold text-white mb-2">Email Us</h4>
          <p className="text-neon-400 font-mono text-sm mb-4">
            {APP_CONFIG.SUPPORT_EMAIL}
          </p>
          <Button fullWidth onClick={handleEmail}>
            Send Email
          </Button>
        </div>

        <div className="text-xs text-gray-600">
          <p>Please include your User ID in the email.</p>
          <p className="mt-1">Response time: 24-48 hours</p>
        </div>

      </div>
    </MainLayout>
  );
};

export default SupportScreen;
