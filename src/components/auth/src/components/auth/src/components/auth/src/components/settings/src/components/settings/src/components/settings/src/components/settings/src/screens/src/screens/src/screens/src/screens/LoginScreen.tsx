import React, { useState, useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import GuestModeButton from '../components/auth/GuestModeButton';
import Input from '../components/common/Input';

const LoginScreen: React.FC = () => {
  const [referralCode, setReferralCode] = useState('');
  
  // Auto-fill referral from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, []);

  return (
    <AuthLayout backgroundVariant="pattern">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">Welcome Back!</h2>
          <p className="text-gray-400 text-sm mt-1">
            Login to start earning rewards
          </p>
        </div>

        {/* Optional Referral Code Input */}
        <div className="bg-dark-900/50 p-4 rounded-2xl border border-white/5">
          <Input
            label="Have a referral code? (Optional)"
            placeholder="Enter Code (e.g. ABC123)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center font-mono tracking-widest uppercase"
          />
        </div>

        {/* Login Buttons */}
        <div className="pt-2">
          <GoogleLoginButton referralCode={referralCode} />
          <GuestModeButton />
        </div>

        {/* Footer Terms */}
        <p className="text-[10px] text-center text-gray-600 mt-8 px-8">
          By logging in, you confirm that you are using this app on a single device and agree to our <span className="text-gray-500">Fair Usage Policy</span>.
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;
