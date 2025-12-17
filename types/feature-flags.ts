/**
 * Feature Flags Type Definitions
 * 
 * Comprehensive feature flag system for controlling platform features
 * from the admin dashboard. All flags default to false for MVP safety.
 */

export interface FeatureFlags {
  // Core Features
  subscriptionBoxes: boolean;
  giftCards: boolean;
  events: boolean;
  myImpact: boolean;
  university: boolean;
  media: boolean;
  referrals: boolean;
  blkdPurchases: boolean;
  
  // Subscription Tiers
  bdnPlus: boolean;
  bdnPlusBusiness: boolean;
  
  // Nonprofit Features
  campaigns: boolean;
  
  // Token & Wallet Features
  tokens: boolean;
  badges: boolean;
  
  // Business Features
  businessDirectory: boolean;
  search: boolean;
  reviews: boolean;
  
  // Payment Features
  c2bPayments: boolean;
  invoices: boolean;
  
  // Dashboard Features
  analytics: boolean;
  merchantDashboard: boolean;
  nonprofitDashboard: boolean;
  
  // University Sub-features
  universityGuides: boolean;
  universityVideos: boolean;
  universityHelp: boolean;
  universityBlog: boolean;
  
  // Media Sub-features
  mediaBDNTV: boolean;
  mediaChannels: boolean;
  
  // MyImpact Sub-features
  myImpactPoints: boolean;
  myImpactCashback: boolean;
  myImpactSponsorship: boolean;
  myImpactDonations: boolean;
  myImpactLeaderboard: boolean;
  
  // Event Sub-features
  eventCreation: boolean;
  eventTicketing: boolean;
  eventManagement: boolean;
}

/**
 * Default feature flags - all enabled for development
 * Set to false for production MVP safety
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Core Features
  subscriptionBoxes: true,
  giftCards: true,
  events: true,
  myImpact: true,
  university: true,
  media: true,
  referrals: true,
  blkdPurchases: true,
  
  // Subscription Tiers
  bdnPlus: true,
  bdnPlusBusiness: true,
  
  // Nonprofit Features
  campaigns: true,
  
  // Token & Wallet Features
  tokens: true,
  badges: true,
  
  // Business Features
  businessDirectory: true,
  search: true,
  reviews: true,
  
  // Payment Features
  c2bPayments: true,
  invoices: true,
  
  // Dashboard Features
  analytics: true,
  merchantDashboard: true,
  nonprofitDashboard: true,
  
  // University Sub-features
  universityGuides: true,
  universityVideos: true,
  universityHelp: true,
  universityBlog: true,
  
  // Media Sub-features
  mediaBDNTV: true,
  mediaChannels: true,
  
  // MyImpact Sub-features
  myImpactPoints: true,
  myImpactCashback: true,
  myImpactSponsorship: true,
  myImpactDonations: true,
  myImpactLeaderboard: true,
  
  // Event Sub-features
  eventCreation: true,
  eventTicketing: true,
  eventManagement: true,
};

/**
 * Feature flag metadata for admin UI
 */
export interface FeatureFlagMetadata {
  key: keyof FeatureFlags;
  label: string;
  description: string;
  category: 'core' | 'subscriptions' | 'nonprofit' | 'tokens' | 'business' | 'payments' | 'dashboards' | 'sub-features';
  requires?: (keyof FeatureFlags)[]; // Other features that must be enabled
  impact: 'high' | 'medium' | 'low';
}

export const featureFlagMetadata: FeatureFlagMetadata[] = [
  // Core Features
  {
    key: 'subscriptionBoxes',
    label: 'Subscription Boxes',
    description: 'Enable subscription box feature for businesses (recurring product shipments)',
    category: 'core',
    impact: 'high',
  },
  {
    key: 'giftCards',
    label: 'Gift Cards',
    description: 'Enable gift card purchases (universal and merchant-specific)',
    category: 'core',
    impact: 'high',
  },
  {
    key: 'events',
    label: 'Events',
    description: 'Enable event creation, ticketing, and management',
    category: 'core',
    impact: 'high',
    requires: ['eventCreation', 'eventTicketing', 'eventManagement'],
  },
  {
    key: 'myImpact',
    label: 'MyImpact',
    description: 'Enable MyImpact rewards program (points, cashback, badges)',
    category: 'core',
    impact: 'high',
    requires: ['myImpactPoints', 'myImpactCashback', 'myImpactLeaderboard'],
  },
  {
    key: 'university',
    label: 'BDN University',
    description: 'Enable BDN University education features (guides, videos, help, blog)',
    category: 'core',
    impact: 'medium',
    requires: ['universityGuides', 'universityVideos', 'universityHelp', 'universityBlog'],
  },
  {
    key: 'media',
    label: 'Media',
    description: 'Enable media content features (BDN TV, channels, blog)',
    category: 'core',
    impact: 'medium',
    requires: ['mediaBDNTV', 'mediaChannels'],
  },
  {
    key: 'referrals',
    label: 'Referrals',
    description: 'Enable referral program for user acquisition',
    category: 'core',
    impact: 'high',
  },
  {
    key: 'blkdPurchases',
    label: 'BLKD Purchases',
    description: 'Enable BLKD token bulk purchases',
    category: 'core',
    impact: 'high',
    requires: ['tokens'],
  },
  
  // Subscription Tiers
  {
    key: 'bdnPlus',
    label: 'BDN+ Consumer',
    description: 'Enable BDN+ consumer subscription tier',
    category: 'subscriptions',
    impact: 'high',
  },
  {
    key: 'bdnPlusBusiness',
    label: 'BDN+ Business',
    description: 'Enable BDN+ Business subscription tier (required for subscription boxes)',
    category: 'subscriptions',
    impact: 'high',
  },
  
  // Nonprofit Features
  {
    key: 'campaigns',
    label: 'Nonprofit Campaigns',
    description: 'Enable nonprofit fundraising campaigns',
    category: 'nonprofit',
    impact: 'medium',
  },
  
  // Token & Wallet Features
  {
    key: 'tokens',
    label: 'BDN Tokens',
    description: 'Enable BDN token system and wallet',
    category: 'tokens',
    impact: 'high',
  },
  {
    key: 'badges',
    label: 'Badges',
    description: 'Enable achievement badges system',
    category: 'tokens',
    impact: 'low',
    requires: ['myImpact'],
  },
  
  // Business Features
  {
    key: 'businessDirectory',
    label: 'Business Directory',
    description: 'Enable business directory and search',
    category: 'business',
    impact: 'high',
  },
  {
    key: 'search',
    label: 'Search',
    description: 'Enable platform-wide search functionality',
    category: 'business',
    impact: 'high',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    description: 'Enable business/product reviews and ratings',
    category: 'business',
    impact: 'medium',
  },
  
  // Payment Features
  {
    key: 'c2bPayments',
    label: 'C2B Payments',
    description: 'Enable consumer-to-business direct payments',
    category: 'payments',
    impact: 'high',
  },
  {
    key: 'invoices',
    label: 'Invoices',
    description: 'Enable invoice generation and management',
    category: 'payments',
    impact: 'medium',
  },
  
  // Dashboard Features
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Enable analytics dashboards for businesses and nonprofits',
    category: 'dashboards',
    impact: 'medium',
  },
  {
    key: 'merchantDashboard',
    label: 'Merchant Dashboard',
    description: 'Enable merchant dashboard and management tools',
    category: 'dashboards',
    impact: 'high',
  },
  {
    key: 'nonprofitDashboard',
    label: 'Nonprofit Dashboard',
    description: 'Enable nonprofit dashboard and management tools',
    category: 'dashboards',
    impact: 'high',
  },
  
  // University Sub-features
  {
    key: 'universityGuides',
    label: 'University: Guides',
    description: 'Enable step-by-step guides in BDN University',
    category: 'sub-features',
    impact: 'low',
    requires: ['university'],
  },
  {
    key: 'universityVideos',
    label: 'University: Videos',
    description: 'Enable video tutorials in BDN University',
    category: 'sub-features',
    impact: 'low',
    requires: ['university'],
  },
  {
    key: 'universityHelp',
    label: 'University: Help Center',
    description: 'Enable help center and FAQ in BDN University',
    category: 'sub-features',
    impact: 'low',
    requires: ['university'],
  },
  {
    key: 'universityBlog',
    label: 'University: Blog',
    description: 'Enable blog articles in BDN University',
    category: 'sub-features',
    impact: 'low',
    requires: ['university'],
  },
  
  // Media Sub-features
  {
    key: 'mediaBDNTV',
    label: 'Media: BDN TV',
    description: 'Enable BDN TV video content',
    category: 'sub-features',
    impact: 'low',
    requires: ['media'],
  },
  {
    key: 'mediaChannels',
    label: 'Media: Channels',
    description: 'Enable media channels and subscriptions',
    category: 'sub-features',
    impact: 'low',
    requires: ['media'],
  },
  
  // MyImpact Sub-features
  {
    key: 'myImpactPoints',
    label: 'MyImpact: Points',
    description: 'Enable impact points tracking',
    category: 'sub-features',
    impact: 'low',
    requires: ['myImpact'],
  },
  {
    key: 'myImpactCashback',
    label: 'MyImpact: Cashback',
    description: 'Enable cashback rewards',
    category: 'sub-features',
    impact: 'low',
    requires: ['myImpact'],
  },
  {
    key: 'myImpactSponsorship',
    label: 'MyImpact: Sponsorship',
    description: 'Enable sponsorship rewards',
    category: 'sub-features',
    impact: 'low',
    requires: ['myImpact'],
  },
  {
    key: 'myImpactDonations',
    label: 'MyImpact: Donations',
    description: 'Enable donation tracking',
    category: 'sub-features',
    impact: 'low',
    requires: ['myImpact'],
  },
  {
    key: 'myImpactLeaderboard',
    label: 'MyImpact: Leaderboard',
    description: 'Enable impact leaderboard',
    category: 'sub-features',
    impact: 'low',
    requires: ['myImpact'],
  },
  
  // Event Sub-features
  {
    key: 'eventCreation',
    label: 'Events: Creation',
    description: 'Enable event creation by users/businesses',
    category: 'sub-features',
    impact: 'low',
    requires: ['events'],
  },
  {
    key: 'eventTicketing',
    label: 'Events: Ticketing',
    description: 'Enable ticket sales for events',
    category: 'sub-features',
    impact: 'low',
    requires: ['events'],
  },
  {
    key: 'eventManagement',
    label: 'Events: Management',
    description: 'Enable event management tools',
    category: 'sub-features',
    impact: 'low',
    requires: ['events'],
  },
];

