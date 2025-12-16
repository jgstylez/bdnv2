export interface BusinessReview {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  npsScore?: number; // 0-10 (Net Promoter Score)
  selectedReasons: ReviewReason[]; // Pre-filled reasons selected via pills
  comment?: string; // Optional elaboration
  verifiedPurchase: boolean; // Whether user made a purchase
  visitDate?: string; // When they visited
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  reported: boolean;
  businessResponse?: BusinessReviewResponse;
}

export interface BusinessReviewResponse {
  id: string;
  reviewId: string;
  businessId: string;
  message: string;
  createdAt: string;
}

export type ReviewReason =
  | "excellent-service"
  | "great-quality"
  | "friendly-staff"
  | "good-value"
  | "fast-service"
  | "clean-environment"
  | "convenient-location"
  | "unique-products"
  | "good-atmosphere"
  | "recommend-to-friends"
  | "slow-service"
  | "poor-quality"
  | "unfriendly-staff"
  | "overpriced"
  | "dirty-environment"
  | "inconvenient-location"
  | "limited-selection"
  | "poor-atmosphere"
  | "would-not-recommend";

export interface ReviewReasonConfig {
  id: ReviewReason;
  label: string;
  category: "positive" | "negative";
  icon?: string;
}

export const REVIEW_REASONS: ReviewReasonConfig[] = [
  // Positive reasons
  { id: "excellent-service", label: "Excellent Service", category: "positive", icon: "star" },
  { id: "great-quality", label: "Great Quality", category: "positive", icon: "check-circle" },
  { id: "friendly-staff", label: "Friendly Staff", category: "positive", icon: "people" },
  { id: "good-value", label: "Good Value", category: "positive", icon: "attach-money" },
  { id: "fast-service", label: "Fast Service", category: "positive", icon: "speed" },
  { id: "clean-environment", label: "Clean Environment", category: "positive", icon: "cleaning-services" },
  { id: "convenient-location", label: "Convenient Location", category: "positive", icon: "location-on" },
  { id: "unique-products", label: "Unique Products", category: "positive", icon: "inventory" },
  { id: "good-atmosphere", label: "Good Atmosphere", category: "positive", icon: "mood" },
  { id: "recommend-to-friends", label: "Would Recommend", category: "positive", icon: "thumb-up" },
  // Negative reasons
  { id: "slow-service", label: "Slow Service", category: "negative", icon: "schedule" },
  { id: "poor-quality", label: "Poor Quality", category: "negative", icon: "cancel" },
  { id: "unfriendly-staff", label: "Unfriendly Staff", category: "negative", icon: "person-off" },
  { id: "overpriced", label: "Overpriced", category: "negative", icon: "money-off" },
  { id: "dirty-environment", label: "Dirty Environment", category: "negative", icon: "delete" },
  { id: "inconvenient-location", label: "Inconvenient Location", category: "negative", icon: "location-off" },
  { id: "limited-selection", label: "Limited Selection", category: "negative", icon: "remove-shopping-cart" },
  { id: "poor-atmosphere", label: "Poor Atmosphere", category: "negative", icon: "mood-bad" },
  { id: "would-not-recommend", label: "Would Not Recommend", category: "negative", icon: "thumb-down" },
];

export interface ReviewAnalytics {
  businessId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  npsScore: number; // Net Promoter Score (-100 to 100)
  npsBreakdown: {
    promoters: number; // 9-10
    passives: number; // 7-8
    detractors: number; // 0-6
  };
  topPositiveReasons: { reason: ReviewReason; count: number }[];
  topNegativeReasons: { reason: ReviewReason; count: number }[];
  responseRate: number; // Percentage of reviews with business responses
  averageResponseTime?: number; // Hours
  recentTrends: {
    period: string;
    averageRating: number;
    reviewCount: number;
  }[];
}

