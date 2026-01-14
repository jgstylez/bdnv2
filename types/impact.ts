export interface ImpactPoint {
  id: string;
  userId: string;
  points: number;
  source:
    | "purchase"
    | "referral"
    | "feedback"
    | "donation"
    | "earnings"
    | "achievement";
  description: string;
  relatedTransactionId?: string;
  relatedUserId?: string; // For referrals/earnings
  createdAt: string;
}

export interface Cashback {
  id: string;
  userId: string;
  amount: number;
  currency: "USD" | "BLKD";
  percentage: number;
  purchaseAmount: number;
  merchantId: string;
  merchantName: string;
  transactionId: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  processedAt?: string;
}

export interface EarningsReward {
  id: string;
  sponsorId: string; // User who referred
  referredUserId: string;
  rewardType: "purchase" | "signup" | "referral" | "activity";
  points: number;
  cashback?: number;
  description: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  amount: number;
  currency: "USD" | "BLKD";
  recipientType: "nonprofit" | "community" | "scholarship" | "business";
  recipientId: string;
  recipientName: string;
  impactCategory: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface CommunityImpact {
  totalDonations: number;
  totalDonors: number;
  impactCategories: {
    category: string;
    amount: number;
    donorCount: number;
  }[];
  recentDonations: Donation[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userLevel: string;
  totalPoints: number;
  rank: number;
  change: number; // Position change from previous period
  achievements: string[];
  avatarUrl?: string; // Optional avatar image URL
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
  category: "purchase" | "referral" | "donation" | "community" | "milestone";
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface ImpactSummary {
  totalPoints: number;
  lifetimeCashback: number;
  totalDonations: number;
  referralCount: number;
  earnings: number;
  currentLevel: string;
  pointsToNextLevel: number;
}
