import { Product } from "../types/merchant";
import {
  Wallet as WalletType,
  Currency,
  BankAccountWallet,
  CreditCardWallet,
} from "../types/wallet";

// Extended wallet type for mock data that allows additional properties
type MockWallet = {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
  provider: string;
  type?: string;
  name?: string;
  isActive?: boolean;
  isDefault?: boolean;
  [key: string]: any;
};

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
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&q=80",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&q=80",
    ], // Digital marketing course with diverse team
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
    price: 75.0,
    currency: "USD",
    category: "Beauty & Wellness",
    inventory: 10,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=400&h=400&fit=crop&q=80",
    ], // Hair styling with African American woman
    shippingRequired: false,
    tags: ["beauty", "service"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "new-prod-4",
    merchantId: "merchant-4",
    name: "Handcrafted Leather Wallet",
    description: "Genuine leather wallet with RFID blocking",
    productType: "physical",
    price: 89.99,
    currency: "USD",
    category: "Clothing, Shoes & Accessories",
    inventory: 45,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80",
    ],
    shippingRequired: true,
    shippingCost: 0,
    tags: ["leather", "accessories"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "new-prod-5",
    merchantId: "merchant-5",
    name: "Natural Hair Care Bundle",
    description: "Complete hair care set for natural hair",
    productType: "physical",
    price: 49.99,
    currency: "USD",
    category: "Beauty & Cosmetics",
    inventory: 200,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop&q=80",
    ],
    shippingRequired: true,
    shippingCost: 6.99,
    tags: ["hair", "beauty"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "new-prod-6",
    merchantId: "merchant-6",
    name: "Business Plan Template Pack",
    description: "Professional business plan templates and guides",
    productType: "digital",
    price: 29.99,
    currency: "USD",
    category: "Professional Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop&q=80",
    ],
    shippingRequired: false,
    tags: ["business", "template"],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: "new-prod-7",
    merchantId: "merchant-7",
    name: "Virtual Fitness Coaching",
    description: "One-on-one virtual fitness coaching sessions",
    productType: "service",
    price: 60.0,
    currency: "USD",
    category: "Exercise & Fitness",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80",
    ], // Fitness with African American person
    shippingRequired: false,
    tags: ["fitness", "health"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "new-prod-8",
    merchantId: "merchant-8",
    name: "Premium T-Shirt",
    description: "High-quality cotton t-shirt in multiple colors",
    productType: "physical",
    price: 29.99,
    currency: "USD",
    category: "Clothing, Shoes & Accessories",
    inventory: 100,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop&q=80",
    ],
    shippingRequired: true,
    shippingCost: 5.99,
    tags: ["clothing", "apparel"],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: "new-prod-9",
    merchantId: "merchant-9",
    name: "Custom Logo Design",
    description: "Professional logo design for your business",
    productType: "service",
    price: 299.99,
    currency: "USD",
    category: "Professional Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop&q=80",
    ],
    shippingRequired: false,
    tags: ["design", "logo"],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
  },
  {
    id: "new-prod-10",
    merchantId: "merchant-10",
    name: "Black History E-Book Collection",
    description: "Comprehensive collection of Black history e-books",
    productType: "digital",
    price: 19.99,
    currency: "USD",
    category: "Music, Movies & Books",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop&q=80",
    ],
    shippingRequired: false,
    tags: ["ebook", "education"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

// Mock carousel items - in production, these would come from admin CMS
export const carouselItems = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1573167101669-476636b96cea?w=800&h=400&fit=crop",
    title: "New Feature: Enhanced Business Discovery",
    description:
      "Discover local Black-owned businesses with our improved search",
    link: "/pages/search",
    linkText: "Explore Now",
  },
  {
    id: "2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1723809616710-32afb9dcd0ef?w=800&h=400&fit=crop",
    title: "Community Spotlight",
    description: "Celebrating Black excellence in entrepreneurship",
    link: "/pages/media",
    linkText: "Watch Now",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1653566031535-bcf33e1c2893?w=800&h=400&fit=crop",
    title: "Learn & Grow with BDN University",
    description: "Master the platform and unlock your potential",
    link: "/pages/university",
    linkText: "Start Learning",
  },
];

// Mock wallets
export const mockWallets: MockWallet[] = [
  {
    id: "1",
    userId: "user-1",
    provider: "bdn",
    type: "primary",
    name: "Primary Wallet",
    currency: "USD",
    balance: 1250.75,
    isActive: true,
    isDefault: true,
  },
  {
    id: "2",
    userId: "user-1",
    provider: "bdn",
    type: "myimpact",
    name: "MyImpact Rewards",
    currency: "BLKD",
    balance: 3420,
    isActive: true,
  },
  {
    id: "4",
    type: "bank",
    userId: "user-1",
    currency: "USD",
    balance: 5432.18,
    provider: "chase",
    accountNumber: "****4321",
    routingNumber: "021000021",
    isDefault: false,
    name: "Chase Checking",
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
    category: "Restaurants",
    imageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
  },
  "2": {
    id: "2",
    name: "Black Excellence Barbershop",
    category: "Services",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
  },
  "3": {
    id: "3",
    name: "African Heritage Books",
    category: "Retail",
    imageUrl:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
  },
  "4": {
    id: "4",
    name: "Black History E-Books",
    category: "Digital Products",
    imageUrl:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=600&fit=crop",
  },
  "5": {
    id: "5",
    name: "Crown Beauty Salon",
    category: "Beauty & Wellness",
    imageUrl:
      "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&h=600&fit=crop",
  },
  "6": {
    id: "6",
    name: "Urban Tech Solutions",
    category: "Technology",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  },
};

// All businesses list for search
export const allBusinesses = Object.values(mockBusinesses);
