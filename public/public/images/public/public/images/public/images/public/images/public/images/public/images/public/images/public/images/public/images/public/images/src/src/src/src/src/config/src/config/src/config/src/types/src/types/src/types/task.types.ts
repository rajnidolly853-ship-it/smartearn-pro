export type TaskCategory = 'app_install' | 'survey' | 'register' | 'game';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number; // Coins
  icon: string;
  category: TaskCategory;
  url: string; // Link to offer
  isFeatured?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToComplete: string; // e.g., "5 mins"
  
  // Requirements
  instructions: string[];
  requiredProof?: boolean; // If screenshot upload is needed
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  status: 'started' | 'submitted' | 'approved' | 'rejected';
  submittedAt: number;
  proofUrl?: string;
}

export interface AdStatus {
  isLoaded: boolean;
  lastWatchedAt?: number;
  dailyCount: number;
  remainingLimit: number;
}

export interface SpinWheelState {
  lastSpinTime?: number;
  spinsUsedToday: number;
  nextFreeSpin: number; // Timestamp
  isSpinning: boolean;
}

export interface DailyReward {
  day: number;
  reward: number;
  isClaimed: boolean;
  isLocked: boolean;
  }
