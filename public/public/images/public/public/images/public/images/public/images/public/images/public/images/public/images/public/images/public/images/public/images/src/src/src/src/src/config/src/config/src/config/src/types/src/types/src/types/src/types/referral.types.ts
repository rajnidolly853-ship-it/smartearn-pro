export interface ReferralData {
  code: string;
  totalInvites: number;
  totalEarnings: number; // Coins earned from referrals
  link: string;
}

export interface ReferralUser {
  uid: string;
  displayName: string;
  photoURL: string | null;
  joinedAt: number;
  status: 'active' | 'inactive'; // Active if they completed at least 1 task
  earningsGenerated: number; // How much they made for the referrer
}

export interface ReferralTier {
  invitesRequired: number;
  bonusPerInvite: number;
  commissionPercent: number;
}
