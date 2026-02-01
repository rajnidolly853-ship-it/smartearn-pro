import React from 'react';
import MainLayout from '../layouts/MainLayout';

const PrivacyPolicyScreen: React.FC = () => {
  return (
    <MainLayout headerTitle="Privacy Policy" showBackButton>
      <div className="p-6 pb-24 text-gray-300 text-sm leading-relaxed space-y-6">
        <section>
          <h3 className="text-white font-bold mb-2">1. Introduction</h3>
          <p>
            Welcome to SmartEarn Pro. We respect your privacy and are committed to protecting your personal data.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">2. Data We Collect</h3>
          <p>
            We collect the following information:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Google Profile (Name, Email, Photo)</li>
            <li>Device Information (ID, Model) for fraud prevention</li>
            <li>Usage Data (Tasks completed, Ads watched)</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">3. How We Use Your Data</h3>
          <p>
            Your data is used to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Process rewards and withdrawals</li>
            <li>Prevent fraud and multiple accounts</li>
            <li>Improve app performance</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">4. Third-Party Services</h3>
          <p>
            We use Google AdMob for ads and Firebase for backend services. These services may collect their own data as per their privacy policies.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">5. Contact Us</h3>
          <p>
            If you have any questions, please contact us at support@smartearnpro.app
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyScreen;
