export type BadgeCategory = 
  | "purchases" 
  | "social" 
  | "community" 
  | "achievement" 
  | "education" 
  | "milestone";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // SVG icon identifier
  requirement: {
    type: string; // e.g., "purchase_count", "referral_count", "review_count"
    value: number; // e.g., 1, 5, 10, 50
    description: string; // Human-readable requirement
  };
  pointsReward: number;
  color: string; // Primary badge color
  gradient: string[]; // Gradient colors for earned badge
}

export interface UserBadge {
  badgeId: string;
  userId: string;
  earnedAt: string;
  progress: number; // 0-100, for badges with progress
  isEarned: boolean;
}

// Badge definitions - all available badges in the system
export const BADGE_DEFINITIONS: Badge[] = [
  // First Actions (Milestone)
  {
    id: "first-purchase",
    name: "First Purchase",
    description: "Made your first purchase on BDN",
    category: "milestone",
    rarity: "common",
    icon: "shopping-bag",
    requirement: {
      type: "purchase_count",
      value: 1,
      description: "Make 1 purchase",
    },
    pointsReward: 100,
    color: "#ba9988",
    gradient: ["#ba9988", "#9d7f6f"],
  },
  {
    id: "first-review",
    name: "Voice Heard",
    description: "Left your first review for a business",
    category: "social",
    rarity: "common",
    icon: "rate-review",
    requirement: {
      type: "review_count",
      value: 1,
      description: "Write 1 review",
    },
    pointsReward: 50,
    color: "#ffd700",
    gradient: ["#ffd700", "#ffb300"],
  },
  {
    id: "first-referral",
    name: "Network Builder",
    description: "Invited your first friend to BDN",
    category: "social",
    rarity: "common",
    icon: "people",
    requirement: {
      type: "referral_count",
      value: 1,
      description: "Refer 1 friend",
    },
    pointsReward: 200,
    color: "#4caf50",
    gradient: ["#4caf50", "#388e3c"],
  },
  {
    id: "first-donation",
    name: "Heart of Gold",
    description: "Made your first donation",
    category: "community",
    rarity: "common",
    icon: "favorite",
    requirement: {
      type: "donation_count",
      value: 1,
      description: "Make 1 donation",
    },
    pointsReward: 150,
    color: "#e91e63",
    gradient: ["#e91e63", "#c2185b"],
  },
  {
    id: "first-event",
    name: "Event Goer",
    description: "Attended your first event",
    category: "community",
    rarity: "common",
    icon: "event",
    requirement: {
      type: "event_attendance",
      value: 1,
      description: "Attend 1 event",
    },
    pointsReward: 75,
    color: "#9c27b0",
    gradient: ["#9c27b0", "#7b1fa2"],
  },

  // Purchase Milestones
  {
    id: "purchaser-5",
    name: "Supporting Member",
    description: "Made 5 purchases",
    category: "purchases",
    rarity: "common",
    icon: "shopping-cart",
    requirement: {
      type: "purchase_count",
      value: 5,
      description: "Make 5 purchases",
    },
    pointsReward: 250,
    color: "#ba9988",
    gradient: ["#ba9988", "#9d7f6f"],
  },
  {
    id: "purchaser-25",
    name: "Loyal Customer",
    description: "Made 25 purchases",
    category: "purchases",
    rarity: "rare",
    icon: "store",
    requirement: {
      type: "purchase_count",
      value: 25,
      description: "Make 25 purchases",
    },
    pointsReward: 500,
    color: "#ba9988",
    gradient: ["#ba9988", "#9d7f6f"],
  },
  {
    id: "purchaser-100",
    name: "Black Dollar Champion",
    description: "Made 100 purchases",
    category: "purchases",
    rarity: "epic",
    icon: "emoji-events",
    requirement: {
      type: "purchase_count",
      value: 100,
      description: "Make 100 purchases",
    },
    pointsReward: 2000,
    color: "#ffd700",
    gradient: ["#ffd700", "#ffb300"],
  },

  // Referral Milestones
  {
    id: "referral-5",
    name: "Community Builder",
    description: "Referred 5 friends",
    category: "social",
    rarity: "rare",
    icon: "group",
    requirement: {
      type: "referral_count",
      value: 5,
      description: "Refer 5 friends",
    },
    pointsReward: 1000,
    color: "#4caf50",
    gradient: ["#4caf50", "#388e3c"],
  },
  {
    id: "referral-25",
    name: "Influencer",
    description: "Referred 25 friends",
    category: "social",
    rarity: "epic",
    icon: "trending-up",
    requirement: {
      type: "referral_count",
      value: 25,
      description: "Refer 25 friends",
    },
    pointsReward: 5000,
    color: "#4caf50",
    gradient: ["#4caf50", "#388e3c"],
  },

  // Review Milestones
  {
    id: "reviewer-10",
    name: "Opinion Leader",
    description: "Left 10 reviews",
    category: "social",
    rarity: "rare",
    icon: "rate-review",
    requirement: {
      type: "review_count",
      value: 10,
      description: "Write 10 reviews",
    },
    pointsReward: 500,
    color: "#ffd700",
    gradient: ["#ffd700", "#ffb300"],
  },
  {
    id: "reviewer-50",
    name: "Community Voice",
    description: "Left 50 reviews",
    category: "social",
    rarity: "epic",
    icon: "forum",
    requirement: {
      type: "review_count",
      value: 50,
      description: "Write 50 reviews",
    },
    pointsReward: 2500,
    color: "#ffd700",
    gradient: ["#ffd700", "#ffb300"],
  },

  // Donation Milestones
  {
    id: "donor-10",
    name: "Generous Heart",
    description: "Made 10 donations",
    category: "community",
    rarity: "rare",
    icon: "volunteer-activism",
    requirement: {
      type: "donation_count",
      value: 10,
      description: "Make 10 donations",
    },
    pointsReward: 1000,
    color: "#e91e63",
    gradient: ["#e91e63", "#c2185b"],
  },
  {
    id: "donor-50",
    name: "Philanthropist",
    description: "Made 50 donations",
    category: "community",
    rarity: "epic",
    icon: "handshake",
    requirement: {
      type: "donation_count",
      value: 50,
      description: "Make 50 donations",
    },
    pointsReward: 5000,
    color: "#e91e63",
    gradient: ["#e91e63", "#c2185b"],
  },

  // Token Purchases
  {
    id: "token-buyer",
    name: "Token Supporter",
    description: "Purchased BDN tokens",
    category: "purchases",
    rarity: "common",
    icon: "account-balance-wallet",
    requirement: {
      type: "token_purchase",
      value: 1,
      description: "Purchase BDN tokens",
    },
    pointsReward: 100,
    color: "#2196f3",
    gradient: ["#2196f3", "#1976d2"],
  },

  // Level Achievements
  {
    id: "level-bronze",
    name: "Bronze Member",
    description: "Reached Bronze level",
    category: "achievement",
    rarity: "common",
    icon: "workspace-premium",
    requirement: {
      type: "level",
      value: 1000,
      description: "Reach Bronze level (1,000 points)",
    },
    pointsReward: 0,
    color: "#cd7f32",
    gradient: ["#cd7f32", "#b87324"],
  },
  {
    id: "level-silver",
    name: "Silver Member",
    description: "Reached Silver level",
    category: "achievement",
    rarity: "rare",
    icon: "workspace-premium",
    requirement: {
      type: "level",
      value: 5000,
      description: "Reach Silver level (5,000 points)",
    },
    pointsReward: 0,
    color: "#c0c0c0",
    gradient: ["#c0c0c0", "#a8a8a8"],
  },
  {
    id: "level-gold",
    name: "Gold Member",
    description: "Reached Gold level",
    category: "achievement",
    rarity: "epic",
    icon: "workspace-premium",
    requirement: {
      type: "level",
      value: 15000,
      description: "Reach Gold level (15,000 points)",
    },
    pointsReward: 0,
    color: "#ffd700",
    gradient: ["#ffd700", "#ffb300"],
  },
  {
    id: "level-diamond",
    name: "Diamond Member",
    description: "Reached Diamond level",
    category: "achievement",
    rarity: "epic",
    icon: "workspace-premium",
    requirement: {
      type: "level",
      value: 50000,
      description: "Reach Diamond level (50,000 points)",
    },
    pointsReward: 0,
    color: "#b9f2ff",
    gradient: ["#b9f2ff", "#87ceeb"],
  },
  {
    id: "level-black-diamond",
    name: "Black Diamond",
    description: "Reached Black Diamond level",
    category: "achievement",
    rarity: "legendary",
    icon: "workspace-premium",
    requirement: {
      type: "level",
      value: 100000,
      description: "Reach Black Diamond level (100,000 points)",
    },
    pointsReward: 0,
    color: "#000000",
    gradient: ["#000000", "#333333"],
  },

  // Profile & Engagement
  {
    id: "profile-complete",
    name: "Profile Master",
    description: "Completed your profile",
    category: "milestone",
    rarity: "common",
    icon: "person",
    requirement: {
      type: "profile_completion",
      value: 100,
      description: "Complete 100% of your profile",
    },
    pointsReward: 50,
    color: "#9c27b0",
    gradient: ["#9c27b0", "#7b1fa2"],
  },
  {
    id: "demographics-study",
    name: "Data Contributor",
    description: "Completed demographics case study",
    category: "milestone",
    rarity: "common",
    icon: "analytics",
    requirement: {
      type: "demographics_completed",
      value: 1,
      description: "Complete demographics case study",
    },
    pointsReward: 100,
    color: "#9c27b0",
    gradient: ["#9c27b0", "#7b1fa2"],
  },

  // Education
  {
    id: "university-student",
    name: "BDN Student",
    description: "Completed a BDN University course",
    category: "education",
    rarity: "common",
    icon: "school",
    requirement: {
      type: "course_completion",
      value: 1,
      description: "Complete 1 BDN University course",
    },
    pointsReward: 200,
    color: "#4caf50",
    gradient: ["#4caf50", "#388e3c"],
  },
  {
    id: "university-graduate",
    name: "BDN Graduate",
    description: "Completed 5 BDN University courses",
    category: "education",
    rarity: "rare",
    icon: "school",
    requirement: {
      type: "course_completion",
      value: 5,
      description: "Complete 5 BDN University courses",
    },
    pointsReward: 1000,
    color: "#4caf50",
    gradient: ["#4caf50", "#388e3c"],
  },

  // Business Enrollment
  {
    id: "business-owner",
    name: "Business Owner",
    description: "Enrolled as a business on BDN",
    category: "milestone",
    rarity: "rare",
    icon: "store",
    requirement: {
      type: "business_enrollment",
      value: 1,
      description: "Enroll as a business",
    },
    pointsReward: 500,
    color: "#ba9988",
    gradient: ["#ba9988", "#9d7f6f"],
  },
  {
    id: "nonprofit-member",
    name: "Nonprofit Member",
    description: "Enrolled as a nonprofit on BDN",
    category: "community",
    rarity: "rare",
    icon: "handshake",
    requirement: {
      type: "nonprofit_enrollment",
      value: 1,
      description: "Enroll as a nonprofit",
    },
    pointsReward: 500,
    color: "#e91e63",
    gradient: ["#e91e63", "#c2185b"],
  },

  // Activity Streaks
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "7-day activity streak",
    category: "achievement",
    rarity: "rare",
    icon: "local-fire-department",
    requirement: {
      type: "streak_days",
      value: 7,
      description: "Maintain 7-day activity streak",
    },
    pointsReward: 300,
    color: "#ff6b35",
    gradient: ["#ff6b35", "#ff4500"],
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "30-day activity streak",
    category: "achievement",
    rarity: "epic",
    icon: "local-fire-department",
    requirement: {
      type: "streak_days",
      value: 30,
      description: "Maintain 30-day activity streak",
    },
    pointsReward: 2000,
    color: "#ff6b35",
    gradient: ["#ff6b35", "#ff4500"],
  },
];

