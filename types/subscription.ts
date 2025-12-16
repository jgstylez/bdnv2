export type SubscriptionTier = "free" | "plus" | "premium" | "enterprise";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "trial" | "pending";

export interface BDNPlusSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  price: number;
  currency: "USD" | "BLKD";
  billingCycle: "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  paymentMethodId?: string;
  features: SubscriptionFeature[];
  createdAt: string;
  cancelledAt?: string;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "analytics" | "marketing" | "support" | "features" | "rewards";
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  currency: "USD" | "BLKD";
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    tier: "free",
    name: "Free",
    description: "Basic features for all users",
    price: { monthly: 0, yearly: 0 },
    currency: "USD",
    features: [
      "Basic wallet functionality",
      "Access to business directory",
      "Basic search",
      "Community features",
      "Standard support",
    ],
  },
  {
    id: "plus",
    tier: "plus",
    name: "BDN+",
    description: "Enhanced features for consumers",
    price: { monthly: 9.99, yearly: 99.99 },
    currency: "USD",
    popular: true,
    features: [
      "All Free features",
      "Advanced analytics",
      "Priority support",
      "Enhanced cashback rates",
      "Exclusive events access",
      "Ad-free experience",
      "Early access to new features",
      "0% service fees on all orders",
    ],
  },
  {
    id: "premium",
    tier: "premium",
    name: "BDN+ Business",
    description: "All BDN+ features plus business tools and resources",
    price: { monthly: 29.99, yearly: 299.99 },
    currency: "USD",
    features: [
      "All BDN+ features",
      "Advanced business analytics",
      "Marketing tools",
      "Multi-user accounts",
      "API access",
      "Custom integrations",
      "Business resources & tools",
      "Priority business support",
      "Reduced platform fees (5% instead of 10%)",
      "Subscription box recurring shipments & automated billing",
    ],
  },
];

