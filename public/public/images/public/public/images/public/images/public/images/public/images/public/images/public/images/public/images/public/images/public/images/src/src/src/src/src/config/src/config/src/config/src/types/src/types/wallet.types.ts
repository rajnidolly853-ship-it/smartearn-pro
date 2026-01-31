export type TransactionType = 
  | 'daily_checkin' 
  | 'spin_wheel' 
  | 'watch_ad' 
  | 'task_offer' 
  | 'referral_bonus' 
  | 'withdrawal'
  | 'admin_adjustment';

export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'failed';

export interface WalletBalance {
  coins: number;      // Current available coins
  pendingCoins: number; // Earnings under review
  currencyValue: number; // Converted real money value (e.g., in INR)
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // Positive for earning, negative for withdrawal
  description: string;
  status: TransactionStatus;
  timestamp: number;
  metadata?: {
    taskId?: string;
    adNetwork?: string;
    referralUser?: string;
    paymentMethod?: string;
    rejectionReason?: string;
    transactionId?: string; // UPI/Bank Ref ID
  };
}

export interface WithdrawalMethod {
  id: string;
  name: string; // e.g., "UPI", "Paytm"
  icon: string;
  minAmount: number;
  maxAmount?: number;
  fields: WithdrawalField[];
}

export interface WithdrawalField {
  name: string; // e.g., "upi_id"
  label: string; // e.g., "Enter UPI ID"
  type: 'text' | 'number' | 'email';
  placeholder: string;
  regex?: string; // Validation pattern
}

export interface WithdrawalRequest {
  userId: string;
  methodId: string;
  amount: number; // In coins
  currencyAmount: number; // In real money
  details: Record<string, string>; // { upi_id: "user@upi" }
  status: TransactionStatus;
  createdAt: number;
  processedAt?: number;
  }
