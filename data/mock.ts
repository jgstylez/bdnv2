import { Product } from '../types/merchant';
import { Wallet as WalletType, Currency, BankAccountWallet, CreditCardWallet } from "../types/wallet";


// Mock user data - will be replaced with actual state management
export const mockUser = {
  name: "John Doe",
  level: "Bronze",
  points: 1250,
  nextLevelPoints: 5000,
  userType: "consumer",
};

export const USER_LEVELS = {
  Basic: { color: "#8d8d8d", minPoints: 0 },
  Bronze: { color: "#cd7f32", minPoints: 1000 },
  Silver: { color: "#c0c0c0", minPoints: 5000 },
  Gold: { color: "#ffd700", minPoints: 15000 },
  Diamond: { color: "#b9f2ff", minPoints: 50000 },
  "Black Diamond": { color: "#000000", minPoints: 100000 },
};

// Mock newly added products (mixed types)
export const mockNewProducts: Product[] = [
  {
    id: "new-prod-1",
    merchantId: "merchant-1",
    name: "Artisan Coffee Blend",
    description: "Premium roasted coffee from Black-owned farms",
    productType: "physical",
    price: 24.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 150,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop"],
    shippingRequired: true,
    shippingCost: 5.99,
    tags: ["coffee", "beverage"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "new-prod-2",
    merchantId: "merchant-2",
    name: "Digital Marketing Course",
    description: "Learn digital marketing strategies for your business",
    productType: "digital",
    price: 99.99,
    currency: "USD",
    category: "Education",
    inventory: 999,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["education", "digital"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "new-prod-3",
    merchantId: "merchant-3",
    name: "Hair Styling Service",
    description: "Professional hair styling and consultation",
    productType: "service",
    price: 75.00,
    currency: "USD",
    category: "Beauty & Wellness",
    inventory: 10,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["beauty", "service"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

// Mock carousel items - in production, these would come from admin CMS
export const carouselItems = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop",
      title: "New Feature: Enhanced Business Discovery",
      description: "Discover local Black-owned businesses with our improved search",
      link: "/pages/search",
      linkText: "Explore Now",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
      title: "Community Spotlight",
      description: "Celebrating Black excellence in entrepreneurship",
      link: "/pages/media",
      linkText: "Watch Now",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
      title: "Learn & Grow with BDN University",
      description: "Master the platform and unlock your potential",
      link: "/pages/university",
      linkText: "Start Learning",
    },
  ];

  // Mock wallets
export const mockWallets: WalletType[] = [
  {
    id: "1",
    type: "primary",
    name: "Primary Wallet",
    currency: "USD",
    balance: 1250.75,
    isActive: true,
    isDefault: true,
  },
  {
    id: "2",
    type: "myimpact",
    name: "MyImpact Rewards",
    currency: "BLKD",
    balance: 3420,
    isActive: true,
  },
  {
    id: "4",
    type: "bankaccount",
    name: "Chase Checking",
    currency: "USD",
    balance: 5432.18,
    availableBalance: 5432.18,
    isActive: true,
    bankName: "Chase",
    accountType: "checking" as const,
    last4: "4321",
  } as BankAccountWallet,
];

// Mock business data
export const mockBusinesses: Record<string, any> = {
  "1": {
    id: "1",
    name: "Soul Food Kitchen",
    category: "Restaurant",
    imageUrl: null,
  },
  "2": {
    id: "2",
    name: "Black Excellence Barbershop",
    category: "Services",
    imageUrl: null,
  },
  "3": {
    id: "3",
    name: "African Heritage Books",
    category: "Retail",
    imageUrl: null,
  },
  "4": {
    id: "4",
    name: "Black History E-Books",
    category: "Digital",
    imageUrl: null,
  },
  "5": {
    id: "5",
    name: "Crown Beauty Salon",
    category: "Beauty & Wellness",
    imageUrl: null,
  },
  "6": {
    id: "6",
    name: "Urban Tech Solutions",
    category: "Technology",
    imageUrl: null,
  },
};

// All businesses list for search
export const allBusinesses = Object.values(mockBusinesses);
