import { InternationalAddress, CountryCode, InternationalIncorporation, TaxIdentification } from "./international";
import { Currency } from "./international";

export type MerchantType = "local-shop" | "local-service" | "national-service" | "online-shopping" | "restaurant";

export type MerchantLevel = "basic" | "premier" | "platinum";

export type BlackOwnedVerificationStatus = "pending" | "verified" | "rejected" | "not-applicable";

export interface Merchant {
  id: string;
  userId: string;
  name: string;
  type: MerchantType;
  level: MerchantLevel;
  description: string;
  // International address support
  address?: InternationalAddress;
  // Legacy address fields (for backward compatibility)
  /** @deprecated Use address.postalCode instead */
  zipCode?: string;
  /** @deprecated Use address instead */
  city?: string;
  /** @deprecated Use address instead */
  state?: string;
  // Phone number (can be international format)
  phone?: string;
  phoneCountryCode?: CountryCode; // Country code for phone number
  email?: string;
  website?: string;
  category: string;
  isVerified: boolean;
  isActive: boolean;
  // Black-owned verification (must be verified first)
  blackOwnedVerificationStatus: BlackOwnedVerificationStatus;
  blackOwnedVerifiedAt?: string;
  blackOwnedVerificationDocuments?: string[]; // URLs to uploaded documents
  // International incorporation support
  incorporation?: InternationalIncorporation;
  // Legacy incorporation fields (for backward compatibility)
  /** @deprecated Use incorporation instead */
  isIncorporated?: boolean;
  /** @deprecated Use incorporation.incorporationType instead */
  incorporationType?: "llc" | "corporation" | "partnership" | "sole-proprietorship" | "nonprofit";
  /** @deprecated Use incorporation.incorporationState instead */
  incorporationState?: string;
  /** @deprecated Use incorporation.incorporationDate instead */
  incorporationDate?: string;
  // Tax identification (international support)
  taxIdentification?: TaxIdentification;
  /** @deprecated Use taxIdentification instead */
  ein?: string; // US-specific, kept for backward compatibility
  qrCodeUrl?: string;
  createdAt: string;
}

export type ProductType = "physical" | "digital" | "service";

export type InventoryTracking = "none" | "manual" | "automatic" | "integrated";

/**
 * Product variant option (e.g., "Size", "Color", "Material")
 */
export interface ProductVariantOption {
  id: string;
  name: string; // e.g., "Size", "Color", "Material"
  values: string[]; // e.g., ["Small", "Medium", "Large"] or ["Red", "Blue", "Green"]
}

/**
 * Product variant combination (specific variant instance)
 * Represents a specific combination of variant options (e.g., "Small/Red")
 */
export interface ProductVariant {
  id: string;
  name?: string; // Optional display name for the variant (e.g., "Small - Red")
  options: Record<string, string>; // Map of option name to value (e.g., { "Size": "Small", "Color": "Red" })
  price?: number; // Optional price override for this variant
  sku?: string; // Optional SKU for this variant
  barcode?: string; // Optional barcode for this variant
  inventory: number; // Inventory quantity for this specific variant
  imageUrl?: string; // Optional image for this variant
  weight?: number; // Optional weight override for this variant
  isActive: boolean; // Whether this variant is available for purchase
  lowStockThreshold?: number; // Low stock threshold for this variant
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  productType: ProductType;
  price: number; // Base price (can be overridden by variants)
  currency: Currency;
  category: string;
  sku?: string; // Base SKU (can be overridden by variants)
  barcode?: string; // Base barcode (can be overridden by variants)
  inventory: number; // Base inventory (used if no variants, or sum of variant inventories)
  inventoryTracking: InventoryTracking;
  lowStockThreshold?: number; // Base low stock threshold
  isActive: boolean;
  images?: string[];
  // Variant support
  variantOptions?: ProductVariantOption[]; // Available variant options (e.g., Size, Color)
  variants?: ProductVariant[]; // Specific variant combinations
  // Physical product fields
  weight?: number; // in lbs/kg (base weight, can be overridden by variants)
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "in" | "cm";
  };
  shippingRequired: boolean;
  shippingCost?: number;
  shippingMethods?: string[];
  returnPolicy?: string;
  // Digital product fields
  downloadUrl?: string;
  downloadLimit?: number; // -1 for unlimited
  expirationDate?: string;
  // Service product fields
  duration?: string; // e.g., "1 hour", "30 minutes"
  serviceLocation?: "in-store" | "remote" | "on-site" | "hybrid";
  bookingRequired?: boolean;
  // Common fields
  tags?: string[];
  taxCategory?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InventoryIntegration {
  id: string;
  merchantId: string;
  provider: "shopify" | "woocommerce" | "square" | "quickbooks" | "custom";
  name: string;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  isActive: boolean;
  syncFrequency: "realtime" | "hourly" | "daily";
  lastSyncAt?: string;
  createdAt: string;
}

export interface BulkUploadResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    product: string;
    error: string;
  }>;
}

export interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CustomerInsight {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageCustomerValue: number;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  change: number; // percentage change
  trend: "up" | "down" | "stable";
}

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  isComplete: boolean;
}

