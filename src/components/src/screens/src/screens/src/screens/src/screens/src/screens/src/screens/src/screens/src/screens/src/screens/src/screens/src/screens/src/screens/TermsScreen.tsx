import React from 'react';
import MainLayout from '../layouts/MainLayout';

const TermsScreen: React.FC = () => {
  return (
    <MainLayout headerTitle="Terms of Service" showBackButton>
      <div className="p-6 pb-24 text-gray-300 text-sm leading-relaxed space-y-6">
        <section>
          <h3 className="text-white font-bold mb-2">1. Acceptance of Terms</h3>
          <p>
            By using SmartEarn Pro, you agree to these terms. If you do not agree, please do not use the app.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">2. Earning Rules</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Users must not use VPNs, proxies, or emulators.</li>
            <li>Multiple accounts on the same device are strictly prohibited.</li>
            <li>Ad blocking software is not allowed.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">3. Withdrawals</h3>
          <p>
            Withdrawals are processed within 24-48 hours. We reserve the right to reject withdrawals if suspicious activity is detected.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">4. Account Termination</h3>
          <p>
            We may ban accounts that violate these terms without prior notice. Banned accounts forfeit all earnings.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold mb-2">5. Disclaimer</h3>
          <p>
            SmartEarn Pro does not guarantee any specific income. Earnings depend on ad availability and user engagement.
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default TermsScreen;
