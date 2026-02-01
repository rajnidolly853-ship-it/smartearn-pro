import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { WithdrawalMethod } from '../../types/wallet.types';
import { APP_CONFIG } from '../../config/app.config';
import { useWallet } from '../../hooks/useWallet';

interface WithdrawalFormProps {
  methodId: string;
  onSuccess: () => void;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ methodId, onSuccess }) => {
  const { withdraw, isLoading, canWithdraw } = useWallet('user_id_placeholder'); // In real app, pass current user ID
  const [amount, setAmount] = useState<string>('');
  const [details, setDetails] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Get method config
  const method = (APP_CONFIG.WITHDRAWAL.METHODS as WithdrawalMethod[]).find(m => m.id === methodId);

  // Reset form when method changes
  useEffect(() => {
    setAmount('');
    setDetails({});
    setError(null);
  }, [methodId]);

  if (!method) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const coins = parseInt(amount);
    
    // Client-side validation
    if (!coins || isNaN(coins)) {
      setError('Please enter a valid amount');
      return;
    }

    if (coins < method.minAmount) {
      setError(`Minimum withdrawal is ${method.minAmount} coins`);
      return;
    }

    // Call hook
    const success = await withdraw(coins, methodId, details);
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Dynamic Fields based on Method */}
      {/* 
         Note: In a real app, 'fields' would come from method config.
         Here we hardcode basic fields based on ID for simplicity.
      */}
      {method.id === 'upi' && (
        <Input
          label="UPI ID"
          placeholder="username@bank"
          value={details.upiId || ''}
          onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
          required
        />
      )}

      {method.id === 'paytm' && (
        <Input
          label="Paytm Number"
          type="tel"
          placeholder="10-digit mobile number"
          value={details.phone || ''}
          onChange={(e) => setDetails({ ...details, phone: e.target.value })}
          required
        />
      )}

      {method.id === 'gplay' && (
        <Input
          label="Email Address"
          type="email"
          placeholder="Receive code via email"
          value={details.email || ''}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          required
        />
      )}

      {/* Amount Input */}
      <Input
        label="Amount (Coins)"
        type="number"
        placeholder={`Min ${method.minAmount}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        rightIcon={<span className="text-xs text-gray-400">🪙</span>}
        required
      />

      {/* Conversion Hint */}
      {amount && !isNaN(parseInt(amount)) && (
        <div className="text-xs text-center text-gray-400">
          You will receive: <span className="text-white font-bold">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: APP_CONFIG.CURRENCY.CODE }).format(parseInt(amount) / APP_CONFIG.CURRENCY.COIN_RATE)}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={!amount || Object.keys(details).length === 0}
      >
        Withdraw Now
      </Button>
    </form>
  );
};

export default WithdrawalForm;
