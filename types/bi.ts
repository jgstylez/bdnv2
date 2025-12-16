export interface BusinessMetrics {
  businessId: string;
  businessName: string;
  period: {
    start: string;
    end: string;
  };
  revenue: {
    total: number;
    currency: "USD" | "BLKD";
    byCategory: {
      category: string;
      amount: number;
    }[];
    byProduct: {
      productId: string;
      productName: string;
      amount: number;
      quantity: number;
    }[];
  };
  transactions: {
    total: number;
    successful: number;
    failed: number;
    refunded: number;
    averageValue: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    averageOrderValue: number;
  };
  growth: {
    revenueGrowth: number; // percentage
    transactionGrowth: number; // percentage
    customerGrowth: number; // percentage
  };
}

export interface UserBehaviorAnalytics {
  userId?: string; // Optional for aggregate analytics
  period: {
    start: string;
    end: string;
  };
  interactions: {
    pageViews: number;
    uniquePages: number;
    averageSessionDuration: number; // seconds
    bounceRate: number; // percentage
  };
  actions: {
    searches: number;
    purchases: number;
    shares: number;
    reviews: number;
    referrals: number;
  };
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    retentionRate: number; // percentage
  };
  topPages: {
    path: string;
    views: number;
    uniqueViews: number;
  }[];
  topActions: {
    action: string;
    count: number;
  }[];
  deviceBreakdown: {
    device: "mobile" | "desktop" | "tablet";
    percentage: number;
  }[];
  locationBreakdown: {
    location: string;
    users: number;
    percentage: number;
  }[];
}

export interface TransactionReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalTransactions: number;
    totalRevenue: number;
    totalFees: number;
    netRevenue: number;
    currency: "USD" | "BLKD";
    averageTransactionValue: number;
  };
  byType: {
    type: string;
    count: number;
    revenue: number;
    percentage: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    revenue: number;
    percentage: number;
  }[];
  byBusiness: {
    businessId: string;
    businessName: string;
    transactionCount: number;
    revenue: number;
    fees: number;
  }[];
  trends: {
    date: string;
    transactions: number;
    revenue: number;
  }[];
  topTransactions: {
    id: string;
    type: string;
    amount: number;
    currency: string;
    businessName?: string;
    userName: string;
    date: string;
  }[];
}

export interface RevenueShare {
  id: string;
  businessId: string;
  businessName: string;
  period: {
    start: string;
    end: string;
  };
  totalRevenue: number;
  platformFee: number;
  platformFeePercentage: number;
  businessShare: number;
  businessSharePercentage: number;
  status: "pending" | "processing" | "completed" | "failed";
  scheduledDate: string;
  processedDate?: string;
  transactionId?: string;
  paymentMethod?: string;
  currency: "USD" | "BLKD";
  transactions: {
    transactionId: string;
    amount: number;
    fee: number;
    date: string;
  }[];
}

export interface RevenueShareSettings {
  platformFeePercentage: number;
  minimumPayout: number;
  payoutSchedule: "daily" | "weekly" | "bi-weekly" | "monthly";
  autoPayout: boolean;
  payoutMethod: "bank" | "wallet" | "both";
  holdPeriod: number; // days
}

