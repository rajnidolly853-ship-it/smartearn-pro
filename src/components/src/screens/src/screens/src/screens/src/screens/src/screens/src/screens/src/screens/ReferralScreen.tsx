import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ReferralCard from '../components/referral/ReferralCard';
import ReferralStats from '../components/referral/ReferralStats';
import InviteButton from '../components/referral/InviteButton';
import { useReferral } from '../hooks/useReferral';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ReferralScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { 
    referralData, 
    copyCode, 
    shareNative, 
    isLoading 
  } = useReferral(userProfile?.uid);

  return (
    <MainLayout headerTitle="Refer & Earn">
      <div className="p-4 pb-24">
        
        {isLoading || !referralData ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Banner Image (Optional) */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-neon-sm">
                <span className="text-5xl">🤝</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Invite Friends, Earn Money
              </h2>
              <p className="text-sm text-gray-400">
                Get <span className="text-green-400 font-bold">50 Coins</span> for every friend who joins and completes their first task.
              </p>
            </div>

            {/* Code Card */}
            <ReferralCard 
              code={referralData.code} 
              onCopy={copyCode} 
              onShare={shareNative}
            />

            {/* Stats */}
            <ReferralStats 
              inviteCount={referralData.totalInvites} 
              totalEarned={referralData.totalEarnings} 
            />

            {/* Floating Invite Button */}
            <InviteButton onInvite={shareNative} fixed />

            {/* Rules */}
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 mt-6">
              <h4 className="text-sm font-bold text-white mb-3">How it works:</h4>
              <ul className="text-xs text-gray-500 space-y-2">
                <li className="flex gap-2">
                  <span>1️⃣</span> Share your unique code with friends.
                </li>
                <li className="flex gap-2">
                  <span>2️⃣</span> Friend signs up using your code.
                </li>
                <li className="flex gap-2">
                  <span>3️⃣</span> Friend completes their first task.
                </li>
                <li className="flex gap-2">
                  <span>4️⃣</span> You get 50 coins instantly!
                </li>
              </ul>
            </div>
          </>
        )}

      </div>
    </MainLayout>
  );
};

export default ReferralScreen;
