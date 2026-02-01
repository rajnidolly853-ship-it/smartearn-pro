import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import WithdrawalMethods from '../components/wallet/WithdrawalMethods';
import WithdrawalForm from '../components/wallet/WithdrawalForm';
import BalanceDisplay from '../components/wallet/BalanceDisplay';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';

const WithdrawScreen: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const { navigate } = useNavigation();
  const { showNotification } = useNotification();

  const handleSuccess = () => {
    showNotification('Withdrawal requested successfully!', 'success');
    navigate('wallet');
  };

  return (
    <MainLayout headerTitle="Withdraw Money" showBackButton headerRight={<BalanceDisplay />}>
      <div className="p-4 pb-24">
        
        {/* Step 1: Select Method */}
        <section className="mb-8">
          <h3 className="text-sm font-bold text-white mb-3">1. Select Payment Method</h3>
          <WithdrawalMethods 
            selectedId={selectedMethod} 
            onSelect={setSelectedMethod} 
          />
        </section>

        {/* Step 2: Enter Details */}
        {selectedMethod && (
          <section className="animate-fade-in">
            <h3 className="text-sm font-bold text-white mb-3">2. Enter Details</h3>
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-5">
              <WithdrawalForm 
                methodId={selectedMethod} 
                onSuccess={handleSuccess} 
              />
            </div>
          </section>
        )}

        {/* Instructions */}
        <div className="mt-8 text-xs text-gray-500 space-y-2">
          <p>• Minimum withdrawal amounts apply for each method.</p>
          <p>• Payments are processed within 24-48 hours.</p>
          <p>• Ensure your UPI ID / Phone Number is correct. We cannot refund incorrect transfers.</p>
        </div>

      </div>
    </MainLayout>
  );
};

export default WithdrawScreen;
