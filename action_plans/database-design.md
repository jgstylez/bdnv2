# BDN 2.0 Firestore Database Design

**Date:** 2025-01-XX  
**Purpose:** Comprehensive Firestore database schema design for all BDN platform features  
**Database:** Firebase Firestore (NoSQL)

---

## Table of Contents

1. [Overview](#overview)
2. [Collection Structure](#collection-structure)
3. [Core Collections](#core-collections)
4. [Business Collections](#business-collections)
5. [Transaction & Payment Collections](#transaction--payment-collections)
6. [Community Collections](#community-collections)
7. [User Engagement Collections](#user-engagement-collections)
8. [Admin & Analytics Collections](#admin--analytics-collections)
9. [Indexes](#indexes)
10. [Security Rules](#security-rules)

---

## Overview

### Design Principles

1. **PCI Compliance**: NEVER store sensitive payment data (full card numbers, CVV, full account numbers). Only store tokenized references from PCI-compliant payment processors (Stripe, Square, etc.)
2. **Denormalization for Performance**: Store frequently accessed data together
3. **Subcollections for Hierarchical Data**: Use subcollections for one-to-many relationships
4. **Composite Indexes**: Create indexes for common query patterns
5. **Timestamp Fields**: Use ISO 8601 strings for all dates
6. **Status Fields**: Use enums for status tracking
7. **Soft Deletes**: Use `deletedAt` field instead of hard deletes
8. **Audit Trail**: Track `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

### PCI Compliance Requirements

**CRITICAL**: This database design is PCI DSS compliant. The following rules MUST be followed:

**NEVER STORE:**
- Full Primary Account Numbers (PAN) - card numbers
- CVV/CVC codes
- Full bank account numbers
- Full routing numbers
- PINs or passwords
- Any sensitive authentication data

**ONLY STORE:**
- Tokenized payment method references (e.g., Stripe `payment_method_id`)
- Last 4 digits of cards/accounts (for display only)
- Card brand, expiry month/year (safe to store)
- Payment processor transaction IDs
- Display names and labels

**Payment Processing:**
- All sensitive payment data must be handled by PCI-compliant payment processors (Stripe, Square, PayPal, etc.)
- Use payment processor tokens/references instead of storing raw payment data
- Payment methods are tokenized at the processor level before storage

### Data Types

- **String**: IDs, emails, names, descriptions
- **Number**: Prices, quantities, ratings, counts
- **Boolean**: Flags, enabled/disabled states
- **Timestamp**: ISO 8601 strings (e.g., "2025-01-15T10:30:00Z")
- **GeoPoint**: For location data (lat/lng)
- **Map/Object**: Nested objects (addresses, metadata)
- **Array**: Lists (tags, categories, IDs)

---

## Collection Structure

### Top-Level Collections

```
users/
businesses/
nonprofits/
products/
orders/
transactions/
wallets/
events/
campaigns/
reviews/
badges/
subscriptions/
subscriptionBoxes/
invoices/
messages/
notifications/
referrals/
courses/
videos/
guides/
blogPosts/
helpArticles/
directory/
admin/
analytics/
```

---

## Core Collections

### 1. `users` Collection

**Purpose:** User accounts (consumers, business owners, nonprofit admins)

```typescript
users/{userId}
{
  // Identity
  id: string; // Same as document ID
  email: string; // Unique, indexed
  phone?: string;
  phoneCountryCode?: string;
  
  // Profile
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  
  // User Type & Role
  userType: "consumer" | "business" | "nonprofit" | "admin";
  role: "user" | "admin" | "moderator"; // For admin users
  isAdmin: boolean;
  
  // Tier System
  tier: "basic" | "bronze" | "silver" | "gold" | "diamond" | "black-diamond";
  points: number; // Total lifetime points
  level: number; // Calculated from points
  
  // Authentication
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  
  // Demographics Case Study (for tracking Black dollar circulation)
  demographics?: {
    // Basic Demographics
    ethnicity?: "african-american" | "afro-caribbean" | "afro-latino" | "african" | "multiracial-black" | "other" | "prefer-not-to-say";
    ageRange?: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
    gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
    
    // Professional & Educational
    industry?: string; // Technology, Healthcare, Finance, Education, etc.
    employmentStatus?: "employed" | "self-employed" | "unemployed" | "student" | "retired" | "prefer-not-to-say";
    educationalBackground?: "high-school" | "some-college" | "bachelors" | "masters" | "doctorate" | "prefer-not-to-say";
    hbcu?: string; // HBCU attended (if applicable)
    
    // Economic
    incomeRange?: "under-25k" | "25k-50k" | "50k-75k" | "75k-100k" | "100k-150k" | "150k-200k" | "200k+" | "prefer-not-to-say";
    householdSize?: number;
    
    // Location & Community
    location?: {
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    preferredLanguage?: string;
    
    // Case Study Participation
    completed: boolean; // Whether user completed demographics case study
    completedAt?: string; // When demographics were completed
    consentGiven: boolean; // User consent for data use in case study
    consentDate?: string; // When consent was given
  };
  
  // Preferences
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      channels: Record<string, boolean>;
    };
    privacy: {
      profileVisibility: "public" | "private" | "friends";
      showEmail: boolean;
      showPhone: boolean;
    };
    language: string;
    currency: "USD" | "BLKD";
    timezone: string;
  };
  
  // Shopping & Shipping Preferences
  shopping: {
    // Default shipping address (ID of default address)
    defaultShippingAddressId?: string;
    // Default billing address (ID of default address)
    defaultBillingAddressId?: string;
    // Preferred shipping method
    preferredShippingMethod?: string;
    // Save payment methods for faster checkout
    savePaymentMethods: boolean;
    // Auto-fill shipping information
    autoFillShipping: boolean;
    // Email order confirmations
    emailOrderConfirmations: boolean;
    // Email shipping updates
    emailShippingUpdates: boolean;
  };
  
  // Referral System
  referralCode: string; // Unique code for this user
  referredBy?: string; // userId of referrer
  referralCount: number; // Total referrals made
  
  // Activity Tracking
  lastActiveAt: string;
  activityStreak: number; // Days of consecutive activity
  lastActivityDate: string; // Last date of activity (YYYY-MM-DD)
  
  // Status
  status: "active" | "suspended" | "deleted";
  suspendedAt?: string;
  suspendedReason?: string;
  deletedAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  
  // Metadata
  metadata?: {
    signupSource?: string; // "web" | "ios" | "android"
    signupCampaign?: string;
    deviceIds?: string[];
  };
}
```

**Subcollections:**
- `users/{userId}/badges` - User badges
- `users/{userId}/notifications` - User notifications
- `users/{userId}/referrals` - Referral records
- `users/{userId}/shippingAddresses` - User shipping addresses
- `users/{userId}/billingAddresses` - User billing addresses
- `users/{userId}/orderHistory` - User order history (denormalized for quick access)

**Shipping Addresses Subcollection:**
```typescript
users/{userId}/shippingAddresses/{addressId}
{
  id: string; // Same as document ID
  userId: string;
  // Address Details
  fullName: string;
  company?: string; // Company name (if applicable)
  street: string;
  street2?: string; // Apartment, suite, unit, etc.
  city: string;
  state?: string; // State/province
  postalCode: string;
  country: string; // ISO country code
  phone?: string;
  phoneCountryCode?: string;
  // Address Preferences
  isDefault: boolean; // Default shipping address
  label?: string; // "Home", "Work", "Mom's House", etc.
  // Delivery Instructions
  deliveryInstructions?: string; // "Leave at door", "Ring bell", "Gate code: 1234"
  // Address Validation
  validated: boolean; // Whether address has been validated
  validationDate?: string;
  validationService?: string; // "usps", "google", "custom"
  // Usage Tracking
  lastUsedAt?: string; // Last time this address was used
  usageCount: number; // Number of times address has been used
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Billing Addresses Subcollection:**
```typescript
users/{userId}/billingAddresses/{addressId}
{
  id: string; // Same as document ID
  userId: string;
  // Address Details (same structure as shipping addresses)
  fullName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  phoneCountryCode?: string;
  // Address Preferences
  isDefault: boolean; // Default billing address
  label?: string;
  // Tax Information (for business addresses)
  taxId?: string; // Tax ID if business address
  // Address Validation
  validated: boolean;
  validationDate?: string;
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Indexes:**
- `email` (unique)
- `referralCode` (unique)
- `tier`, `points` (composite)
- `status`, `createdAt` (composite)
- `userType`, `status` (composite)

---

### 2. `businesses` Collection

**Purpose:** Black-owned business profiles

```typescript
businesses/{businessId}
{
  // Identity
  id: string; // Same as document ID
  userId: string; // Owner's user ID
  name: string;
  slug: string; // URL-friendly name, unique
  
  // Business Details
  type: "local-shop" | "local-service" | "national-service" | "online-shopping" | "restaurant";
  level: "basic" | "premier" | "platinum";
  category: string;
  description: string;
  shortDescription?: string; // For cards/previews
  
  // Contact Information
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  website?: string;
  
  // Location (International Support)
  address: {
    street: string;
    city: string;
    state?: string; // State/province
    postalCode: string;
    country: string; // ISO country code
    latitude?: number;
    longitude?: number;
  };
  
  // Legacy fields (for backward compatibility)
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Media
  logoUrl?: string;
  coverImageUrl?: string;
  images?: string[]; // Array of image URLs
  qrCodeUrl?: string; // QR code for check-ins
  
  // Verification
  isVerified: boolean;
  verifiedAt?: string;
  blackOwnedVerificationStatus: "pending" | "verified" | "rejected" | "not-applicable";
  blackOwnedVerifiedAt?: string;
  blackOwnedVerificationDocuments?: string[]; // Document URLs
  
  // Business Information
  incorporation?: {
    isIncorporated: boolean;
    incorporationType?: "llc" | "corporation" | "partnership" | "sole-proprietorship" | "nonprofit";
    incorporationState?: string;
    incorporationDate?: string;
    incorporationCountry?: string;
  };
  
  // Tax Identification (International)
  taxIdentification?: {
    type: "ein" | "ssn" | "vat" | "gst" | "other";
    number: string;
    country: string;
  };
  ein?: string; // Legacy, US-specific
  
  // Business Hours
  hours?: {
    [day: string]: { // "monday", "tuesday", etc.
      open: string; // "09:00"
      close: string; // "17:00"
      closed?: boolean;
    };
  };
  
  // Social Media
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  
  // Statistics (denormalized for performance)
  stats: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    averageRating: number;
    reviewCount: number;
    totalRevenue: number; // Lifetime revenue
  };
  
  // Status
  status: "pending" | "approved" | "rejected" | "suspended" | "active";
  isActive: boolean;
  approvedAt?: string;
  approvedBy?: string; // Admin user ID
  rejectedAt?: string;
  rejectionReason?: string;
  suspendedAt?: string;
  suspendedReason?: string;
  
  // Subscription
  hasBDNPlusBusiness: boolean; // Reduces platform fees to 5%
  subscriptionId?: string; // Link to subscription document
  
  // Shipping & Fulfillment Settings
  shipping: {
    // Shipping origin address (where orders ship from)
    originAddress: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      contactName?: string;
      contactPhone?: string;
      contactEmail?: string;
    };
    // Available shipping methods
    shippingMethods: {
      id: string;
      name: string; // "Standard Shipping", "Express", "Overnight"
      carrier?: string; // "USPS", "UPS", "FedEx", "DHL", "Custom"
      cost: number; // Base cost
      costType: "fixed" | "calculated" | "free"; // How cost is determined
      estimatedDays?: number; // Estimated delivery days
      isActive: boolean;
    }[];
    // Default shipping method
    defaultShippingMethodId?: string;
    // Free shipping threshold (optional)
    freeShippingThreshold?: number;
    // Handling time (days to process before shipping)
    handlingTimeDays: number; // Default: 1-2 business days
    // Packaging preferences
    packaging?: {
      defaultBoxSize?: string;
      requireSignature?: boolean;
      requireInsurance?: boolean;
      insuranceThreshold?: number; // Value threshold for insurance
    };
  };
  
  // Payment Processing Settings
  paymentProcessing: {
    // Payment processor integration
    processor?: "stripe" | "square" | "paypal" | "custom";
    processorAccountId?: string;
    // Payment methods accepted
    acceptedPaymentMethods: ("card" | "bank_transfer" | "wallet" | "blkd" | "cash" | "crypto")[];
    // Auto-transfer settings (for payouts)
    autoTransfer: {
      enabled: boolean;
      frequency: "daily" | "weekly" | "monthly";
      threshold?: number; // Minimum balance before auto-transfer
      bankAccountId?: string; // Bank account for transfers
    };
    // Payment terms
    paymentTerms?: {
      netDays?: number; // Net 30, Net 15, etc.
      requireDeposit?: boolean;
      depositPercentage?: number;
    };
  };
  
  // Fulfillment Settings
  fulfillment: {
    // Fulfillment type
    type: "self" | "dropship" | "fulfillment-center" | "hybrid";
    // Fulfillment center details (if using fulfillment center)
    fulfillmentCenter?: {
      name: string;
      provider?: string; // "shipbob", "fulfillment-by-amazon", "custom"
      address: {
        street: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
      };
      contactInfo?: {
        email?: string;
        phone?: string;
      };
    };
    // Order processing workflow
    workflow: {
      autoConfirm?: boolean; // Auto-confirm orders
      requireManualApproval?: boolean; // Require manual approval for orders
      notifyOnNewOrder: boolean; // Email/SMS notification on new orders
      notifyOnLowStock: boolean; // Notify when inventory is low
    };
    // Return & Refund Policy
    returnPolicy: {
      acceptsReturns: boolean;
      returnWindowDays?: number; // Days within which returns are accepted
      returnShippingPaidBy?: "customer" | "business" | "both";
      refundPolicy: "full-refund" | "partial-refund" | "store-credit" | "no-refund";
      returnInstructions?: string;
    };
  };
  
  // Inventory Management
  inventory: {
    // Low stock alerts
    lowStockAlerts: {
      enabled: boolean;
      threshold?: number; // Alert when inventory falls below this
      notifyEmail?: string;
    };
    // Inventory tracking
    trackingEnabled: boolean;
    // Allow backorders
    allowBackorders: boolean;
    // Out of stock behavior
    outOfStockBehavior: "hide" | "show-unavailable" | "show-preorder";
  };
  
  // Tax Settings
  tax: {
    // Tax collection enabled
    collectTax: boolean;
    // Tax calculation method
    calculationMethod: "manual" | "automatic" | "by-location";
    // Tax ID (for tax-exempt businesses)
    taxId?: string;
    // Tax rates by location (if manual)
    taxRates?: {
      [location: string]: number; // e.g., "US-CA": 0.0825
    };
  };
  
  // Business Analytics & Reporting
  analytics: {
    // Sales reporting frequency
    salesReportFrequency?: "daily" | "weekly" | "monthly";
    // Custom reporting preferences
    customReports?: {
      enabled: boolean;
      reportTypes?: string[];
    };
  };
  
  // Dates
  createdAt: string;
  updatedAt: string;
  submittedAt?: string; // When application was submitted
}
```

**Subcollections:**
- `businesses/{businessId}/products` - Business products
- `businesses/{businessId}/orders` - Business orders
- `businesses/{businessId}/reviews` - Business reviews
- `businesses/{businessId}/analytics` - Business analytics

**Indexes:**
- `slug` (unique)
- `userId` (indexed)
- `status`, `createdAt` (composite)
- `category`, `status` (composite)
- `address.country`, `address.city` (composite)
- `isActive`, `isVerified` (composite)
- Geo: `address.latitude`, `address.longitude`

---

### 3. `nonprofits` Collection

**Purpose:** Nonprofit organization profiles

```typescript
nonprofits/{nonprofitId}
{
  // Identity
  id: string; // Same as document ID
  userId: string; // Admin/owner's user ID
  name: string;
  slug: string; // URL-friendly name
  
  // Organization Details
  type: "nonprofit" | "charity" | "foundation" | "community-organization";
  description: string;
  mission: string;
  
  // Contact Information
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  website?: string;
  
  // Location (International Support)
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Media
  logoUrl?: string;
  images?: string[];
  
  // Tax Identification (International)
  taxIdentification?: {
    type: "ein" | "charity-number" | "vat" | "other";
    number: string;
    country: string;
  };
  ein?: string; // Legacy, US-specific
  
  // Verification
  verified: boolean;
  verifiedAt?: string;
  
  // Statistics (denormalized)
  stats: {
    totalRaised: {
      usd: number;
      blkd: number;
    };
    totalDonations: number;
    activeCampaigns: number;
    contributors: number;
  };
  
  // Status
  status: "pending" | "approved" | "rejected" | "suspended" | "active";
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  
  // Subscription
  hasBDNPlusBusiness: boolean; // Reduces platform fees to 5%
  
  // Dates
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}
```

**Subcollections:**
- `nonprofits/{nonprofitId}/campaigns` - Nonprofit campaigns
- `nonprofits/{nonprofitId}/donations` - Donations received
- `nonprofits/{nonprofitId}/orders` - Donation orders

**Indexes:**
- `slug` (unique)
- `userId` (indexed)
- `status`, `createdAt` (composite)
- `type`, `status` (composite)
- `verified`, `status` (composite)

---

## Business Collections

### 4. `products` Collection

**Purpose:** Products sold by businesses

```typescript
products/{productId}
{
  // Identity
  id: string; // Same as document ID
  merchantId: string; // Business ID
  name: string;
  slug: string; // URL-friendly name
  
  // Product Details
  description: string;
  productType: "physical" | "digital" | "service";
  category: string;
  tags?: string[];
  
  // Pricing
  price: number; // Base price
  currency: "USD" | "BLKD";
  sku?: string; // Base SKU
  barcode?: string; // Base barcode
  
  // Inventory
  inventory: number; // Base inventory (or sum of variants)
  inventoryTracking: "none" | "basic" | "advanced";
  lowStockThreshold?: number;
  
  // Variants
  variantOptions?: { // Available options (e.g., Size, Color)
    name: string; // "Size"
    values: string[]; // ["Small", "Medium", "Large"]
  }[];
  variants?: { // Specific variant combinations
    id: string;
    name: string; // "Small - Red"
    sku?: string;
    barcode?: string;
    price?: number; // Override base price
    inventory: number;
    lowStockThreshold?: number;
  }[];
  
  // Physical Product Fields
  weight?: number; // in lbs/kg
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
  
  // Digital Product Fields
  downloadUrl?: string;
  downloadLimit?: number; // -1 for unlimited
  expirationDate?: string;
  
  // Service Product Fields
  duration?: string; // "1 hour", "30 minutes"
  serviceLocation?: "in-store" | "remote" | "on-site" | "hybrid";
  bookingRequired?: boolean;
  
  // Media
  images?: string[]; // Array of image URLs
  videoUrl?: string;
  
  // Status
  isActive: boolean;
  
  // Statistics
  stats: {
    totalSales: number;
    totalOrders: number;
    views: number;
  };
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Subcollections:**
- `products/{productId}/reviews` - Product reviews (if applicable)

**Indexes:**
- `merchantId`, `isActive` (composite)
- `category`, `isActive` (composite)
- `productType`, `isActive` (composite)
- `merchantId`, `createdAt` (composite)

---

### 5. `orders` Collection

**Purpose:** Customer orders (products, donations, event tickets, etc.)

```typescript
orders/{orderId}
{
  // Identity
  id: string; // Same as document ID
  orderNumber: string; // Human-readable: "ORD-2024-001234"
  
  // Entity Information
  entityId: string; // Business or nonprofit ID
  entityType: "business" | "nonprofit";
  entityName: string;
  
  // Order Type
  orderType: "product" | "donation" | "subscription-box" | "event-ticket" | "c2b-payment" | "service";
  
  // Customer Information
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Order Items
  items: {
    id: string;
    productId: string;
    productName: string;
    productType: "physical" | "digital" | "service";
    variantId?: string;
    variantName?: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: "USD" | "BLKD";
    imageUrl?: string;
    downloadUrl?: string; // For digital products
    downloadLimit?: number;
    serviceDate?: string; // For service products
    serviceLocation?: string;
  }[];
  
  // Pricing
  subtotal: number;
  tax: number;
  shippingCost: number;
  serviceFee: number; // Consumer service fee (10% or 0% with BDN+)
  discount: number;
  total: number;
  currency: "USD" | "BLKD";
  
  // Payment Details
  payment: {
    status: "pending" | "processing" | "completed" | "failed" | "refunded" | "partially-refunded";
    method: {
      type: "card" | "bank_transfer" | "wallet" | "blkd" | "cash" | "crypto" | "other";
      id?: string; // Payment method ID
      walletId?: string; // Wallet ID if using wallet
      // Card details (if card payment)
      card?: {
        last4?: string;
        brand?: string; // "visa", "mastercard", etc.
        expiryMonth?: number;
        expiryYear?: number;
      };
      // Bank details (if bank transfer)
      bank?: {
        last4?: string;
        bankName?: string;
        accountType?: string;
      };
    };
    // Transaction details
    transactionId?: string; // Link to transaction document
    transactionNumber?: string; // Human-readable transaction number
    // Payment processing details
    processing?: {
      processor?: string; // "stripe", "square", etc.
      processorTransactionId?: string; // External processor transaction ID
      processorFee?: number; // Processing fee charged by processor
      authorizationCode?: string; // Payment authorization code
      captureId?: string; // Payment capture ID
    };
    // Payment timeline
    authorizedAt?: string; // When payment was authorized
    capturedAt?: string; // When payment was captured
    paidAt?: string; // When payment was completed
    failedAt?: string; // When payment failed
    failureReason?: string; // Reason for failure
    // Refund details
    refunds?: {
      id: string;
      amount: number;
      reason?: string;
      refundedAt: string;
      refundTransactionId?: string;
      status: "pending" | "completed" | "failed";
    }[];
    totalRefunded?: number; // Total amount refunded
  };
  
  // Order Status & Fulfillment
  status: "pending" | "confirmed" | "processing" | "ready-to-ship" | "shipped" | "delivered" | "completed" | "cancelled" | "refunded" | "failed";
  fulfillmentStatus: "unfulfilled" | "partial" | "fulfilled" | "shipped" | "delivered";
  
  // Detailed Fulfillment Information
  fulfillment: {
    // Fulfillment workflow
    workflow: {
      confirmedAt?: string; // When order was confirmed
      processingStartedAt?: string; // When processing began
      readyToShipAt?: string; // When order was ready to ship
      shippedAt?: string; // When order was shipped
      deliveredAt?: string; // When order was delivered
      completedAt?: string; // When order was completed
    };
    // Item-level fulfillment tracking
    items: {
      itemId: string; // Order item ID
      productId: string;
      quantity: number;
      fulfilledQuantity: number; // How many have been fulfilled
      status: "pending" | "processing" | "fulfilled" | "shipped" | "delivered" | "cancelled";
      fulfilledAt?: string;
      shippedAt?: string;
      deliveredAt?: string;
    }[];
    // Fulfillment notes
    notes?: {
      type: "internal" | "customer" | "fulfillment";
      message: string;
      createdAt: string;
      createdBy?: string; // User ID who added note
    }[];
    // Pick list / packing slip
    pickList?: {
      items: {
        itemId: string;
        productName: string;
        sku?: string;
        location?: string; // Warehouse location
        quantity: number;
        picked?: boolean;
        pickedAt?: string;
        pickedBy?: string; // User ID who picked item
      }[];
      generatedAt?: string;
      printedAt?: string;
    };
  };
  
  // Shipping Address (from user's saved addresses)
  shippingAddressId?: string; // Reference to user's shipping address
  shippingAddress: {
    id?: string; // Address ID from user's addresses
    fullName: string;
    company?: string; // Company name (if applicable)
    street: string;
    street2?: string; // Apartment, suite, etc.
    city: string;
    state?: string; // State/province
    postalCode: string;
    country: string; // ISO country code
    phone?: string;
    phoneCountryCode?: string;
    isDefault?: boolean;
    // Address validation
    validated?: boolean;
    validationDate?: string;
    // Special instructions
    deliveryInstructions?: string; // "Leave at door", "Ring bell", etc.
  };
  
  // Billing Address (may differ from shipping)
  billingAddressId?: string;
  billingAddress?: {
    id?: string;
    fullName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
    phoneCountryCode?: string;
  };
  
  // Detailed Shipping Information
  shippingInfo: {
    // Shipping method details
    method: {
      id: string;
      name: string; // "Standard Shipping", "Express", "Overnight"
      carrier: string; // "USPS", "UPS", "FedEx", "DHL", "Custom"
      serviceLevel?: string; // "Ground", "Air", "Express", etc.
      cost: number;
      estimatedDays?: number; // Estimated delivery days
    };
    // Tracking information
    tracking: {
      number?: string; // Tracking number
      carrier?: string; // Carrier name
      carrierTrackingUrl?: string; // URL to track on carrier website
      status?: "pending" | "in-transit" | "out-for-delivery" | "delivered" | "exception";
      lastUpdate?: string; // Last tracking update timestamp
      events?: { // Tracking events/history
        timestamp: string;
        location?: string;
        description: string;
        status: string;
      }[];
    };
    // Shipping dates
    estimatedShipDate?: string; // When order is expected to ship
    shippedAt?: string; // Actual ship date
    estimatedDeliveryDate?: string; // Estimated delivery date
    deliveredAt?: string; // Actual delivery date
    // Delivery confirmation
    deliveryConfirmation?: {
      signedBy?: string; // Name of person who signed
      signatureUrl?: string; // Image of signature
      deliveryPhotoUrl?: string; // Photo of delivered package
      deliveryNotes?: string;
    };
    // Shipping label
    label?: {
      url?: string; // URL to shipping label
      format?: string; // "pdf", "png", etc.
      createdAt?: string;
    };
    // Package details
    package?: {
      weight?: number; // Weight in lbs/kg
      dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: "in" | "cm";
      };
      packageCount?: number; // Number of packages in shipment
    };
  };
  
  // Notes
  customerNotes?: string;
  internalNotes?: string;
  
  // Related Entities
  subscriptionBoxId?: string; // For subscription box orders
  eventId?: string; // For event ticket orders
  campaignId?: string; // For donation orders
  
  // Refunds & Returns
  refunds: {
    id: string;
    amount: number;
    reason: string;
    type: "full" | "partial";
    status: "pending" | "processing" | "completed" | "failed";
    requestedAt: string;
    requestedBy?: string; // User ID who requested refund
    processedAt?: string;
    processedBy?: string; // User ID who processed refund
    refundTransactionId?: string; // Link to refund transaction
    notes?: string;
  }[];
  totalRefunded: number; // Total amount refunded
  
  // Returns
  returns?: {
    id: string;
    items: {
      itemId: string;
      quantity: number;
      reason: string;
      condition: "new" | "used" | "damaged" | "defective";
      status: "pending" | "approved" | "rejected" | "received" | "processed";
    }[];
    returnAuthorizationNumber?: string; // RMA number
    returnLabelUrl?: string; // Return shipping label
    status: "pending" | "approved" | "rejected" | "in-transit" | "received" | "processed";
    requestedAt: string;
    approvedAt?: string;
    receivedAt?: string;
    processedAt?: string;
  }[];
  
  // Dates
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
}
```

**Indexes:**
- `orderNumber` (unique)
- `customerId`, `createdAt` (composite)
- `entityId`, `entityType`, `createdAt` (composite)
- `status`, `createdAt` (composite)
- `paymentStatus`, `createdAt` (composite)
- `orderType`, `status` (composite)

---

## Transaction & Payment Collections

### 6. `transactions` Collection

**Purpose:** All financial transactions (payments, fees, refunds, etc.)

```typescript
transactions/{transactionId}
{
  // Identity
  id: string; // Same as document ID
  transactionNumber: string; // Human-readable: "TXN-2024-001234"
  
  // User Information
  userId: string; // User who made/received transaction
  userName?: string; // Denormalized for performance
  
  // Transaction Details
  type: "payment" | "transfer" | "refund" | "token-purchase" | "event-ticket" | "donation" | "cashback" | "withdrawal" | "deposit" | "fee";
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  
  // Amounts
  amount: number; // Transaction amount
  currency: "USD" | "BLKD";
  fee: number; // Fee amount
  feeType?: "service" | "platform" | "processing";
  feePercentage?: number; // Fee percentage applied
  netAmount: number; // Amount after fees
  
  // For business/nonprofit transactions
  grossAmount?: number; // Original amount before platform fee
  platformFee?: number; // Platform fee deducted
  hasBDNPlusBusiness?: boolean; // Whether entity had BDN+ Business
  
  // Description
  description: string;
  
  // Related Entities
  relatedEntityId?: string; // Business/nonprofit ID
  relatedEntityType?: "business" | "nonprofit";
  orderId?: string;
  invoiceId?: string;
  
  // Payment Method Details
  paymentMethod: {
    type: "card" | "bank_transfer" | "wallet" | "blkd" | "cash" | "crypto" | "other";
    id?: string; // Payment method ID
    walletId?: string; // Wallet ID if using wallet
    // PCI COMPLIANCE: Only store tokenized references and display info
    // Payment method token from PCI-compliant processor
    paymentMethodToken?: string; // Tokenized reference (Stripe payment_method_id, etc.)
    processor?: string; // "stripe", "square", "paypal", etc.
    
    // Display-only information (safe to store)
    displayInfo?: {
      // Card display info (last 4 digits only)
      cardLast4?: string; // Last 4 digits only - NEVER full card number
      cardBrand?: string; // "visa", "mastercard", "amex", "discover"
      expiryMonth?: number; // Safe to store
      expiryYear?: number; // Safe to store
      funding?: "credit" | "debit" | "prepaid" | "unknown";
      
      // Bank display info (last 4 digits only)
      accountLast4?: string; // Last 4 digits only - NEVER full account number
      bankName?: string; // Display name only
      accountType?: "checking" | "savings";
    };
    
    // NEVER STORE:
    // - Full card numbers (PAN)
    // - CVV/CVC codes
    // - Full account numbers
    // - Full routing numbers
    // Wallet details
    wallet?: {
      walletId: string;
      walletType: string;
      currency: "USD" | "BLKD";
    };
  };
  
  // Payment Processing Details
  processing: {
    processor?: string; // "stripe", "square", "paypal", "custom"
    processorTransactionId?: string; // External processor transaction ID
    processorFee?: number; // Processing fee charged by processor
    // Authorization details
    authorization?: {
      code?: string; // Authorization code
      authorizedAt?: string;
      expiresAt?: string;
    };
    // Capture details (for card payments)
    capture?: {
      id?: string;
      capturedAt?: string;
      amount?: number;
    };
    // Settlement details
    settlement?: {
      settledAt?: string;
      settlementId?: string;
      netAmount?: number; // Amount after processor fees
    };
    // Dispute/chargeback information
    dispute?: {
      id?: string;
      reason?: string;
      status?: "pending" | "won" | "lost" | "warning_needs_response";
      openedAt?: string;
      resolvedAt?: string;
    };
  };
  
  // Metadata
  metadata?: {
    [key: string]: any;
    hasBDNPlus?: boolean; // Whether user had BDN+ at transaction time
    hasBDNPlusBusiness?: boolean;
    originalTransactionId?: string; // For refunds
    refundReason?: string;
    // IP address and device info (for fraud detection)
    ipAddress?: string;
    deviceInfo?: {
      userAgent?: string;
      deviceId?: string;
      platform?: string;
    };
    // Risk assessment
    riskScore?: number; // 0-100 risk score
    riskLevel?: "low" | "medium" | "high";
    flaggedForReview?: boolean;
  };
  
  // Dates
  createdAt: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
}
```

**Indexes:**
- `transactionNumber` (unique)
- `userId`, `createdAt` (composite)
- `type`, `status`, `createdAt` (composite)
- `relatedEntityId`, `relatedEntityType`, `createdAt` (composite)
- `status`, `createdAt` (composite)

---

### 7. `wallets` Collection

**Purpose:** User payment methods and balances

```typescript
wallets/{walletId}
{
  // Identity
  id: string; // Same as document ID
  userId: string;
  
  // Wallet Type
  type: "bank" | "card" | "giftcard" | "blkd" | "external";
  currency: "USD" | "BLKD";
  
  // Balance
  balance: number;
  availableBalance?: number; // Available after holds
  
  // Provider Information
  provider: string; // "stripe", "square", "bank-name", etc.
  
  // PCI COMPLIANCE: Only store tokenized references, NEVER full payment data
  // All sensitive payment data must be stored with PCI-compliant payment processor (Stripe, Square, etc.)
  
  // Payment Method Token (from PCI-compliant processor)
  paymentMethodToken?: string; // Tokenized reference from payment processor (Stripe payment_method_id, etc.)
  processor?: string; // "stripe", "square", "paypal", etc.
  
  // Display-only information (safe to store)
  displayInfo?: {
    // Bank Account Display Info (last 4 digits only)
    accountLast4?: string; // Last 4 digits only - NEVER full account number
    bankName?: string; // Display name only
    accountType?: "checking" | "savings";
    
    // Card Display Info (last 4 digits only)
    cardLast4?: string; // Last 4 digits only - NEVER full card number
    cardBrand?: string; // "visa", "mastercard", "amex", "discover"
    expiryMonth?: number; // Expiry month (safe)
    expiryYear?: number; // Expiry year (safe)
    funding?: "credit" | "debit" | "prepaid" | "unknown";
  };
  
  // NEVER STORE:
  // - Full card numbers (PAN)
  // - CVV/CVC codes
  // - Full account numbers
  // - Full routing numbers
  // - PINs or passwords
  // All sensitive data must be handled by PCI-compliant payment processor
  
  // Gift Card Details
  giftCardCode?: string; // For gift card wallets
  
  // Status
  isDefault: boolean;
  isActive: boolean;
  isVerified: boolean;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}
```

**Indexes:**
- `userId`, `currency` (composite)
- `userId`, `type` (composite)
- `userId`, `isDefault` (composite)

---

### 8. `subscriptions` Collection

**Purpose:** BDN+ subscription plans

```typescript
subscriptions/{subscriptionId}
{
  // Identity
  id: string; // Same as document ID
  userId: string;
  
  // Subscription Details
  tier: "free" | "plus" | "premium" | "enterprise";
  status: "active" | "cancelled" | "expired" | "trial" | "pending";
  
  // Pricing
  price: number;
  currency: "USD" | "BLKD";
  billingCycle: "monthly" | "yearly";
  
  // Dates
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  cancelledAt?: string;
  
  // Settings
  autoRenew: boolean;
  paymentMethodId?: string;
  
  // Features
  features: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    category: "analytics" | "marketing" | "support" | "features" | "rewards";
  }[];
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Indexes:**
- `userId`, `status` (composite)
- `tier`, `status` (composite)
- `nextBillingDate` (indexed for billing jobs)

---

### 9. `subscriptionBoxes` Collection

**Purpose:** Subscription box subscriptions (recurring product shipments)

```typescript
subscriptionBoxes/{subscriptionBoxId}
{
  // Identity
  id: string; // Same as document ID
  userId: string;
  productId: string;
  merchantId: string;
  planId: string; // Link to subscription box plan
  
  // Subscription Details
  quantity: number;
  frequency: "weekly" | "bi-weekly" | "monthly" | "bi-monthly" | "quarterly";
  duration: number; // Number of shipments (-1 for indefinite)
  
  // Status
  status: "active" | "paused" | "cancelled" | "expired" | "pending";
  
  // Pricing
  pricePerShipment: number;
  shippingCostPerShipment: number;
  currency: "USD" | "BLKD";
  discountPercentage?: number;
  
  // Billing
  paymentMethodId: string;
  nextBillingDate: string;
  nextShipmentDate: string;
  
  // Tracking
  shipmentsCompleted: number;
  shipmentsRemaining: number; // -1 for indefinite
  
  // Dates
  startDate: string;
  endDate?: string; // Only if duration is finite
  pausedUntil?: string; // If paused
  cancelledAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Subcollections:**
- `subscriptionBoxes/{subscriptionBoxId}/shipments` - Individual shipments

**Indexes:**
- `userId`, `status` (composite)
- `merchantId`, `status` (composite)
- `nextBillingDate` (indexed for billing jobs)
- `nextShipmentDate` (indexed for shipment jobs)

---

### 10. `invoices` Collection

**Purpose:** Invoices for businesses/nonprofits to send to customers

```typescript
invoices/{invoiceId}
{
  // Identity
  id: string; // Same as document ID
  invoiceNumber: string; // Human-readable: "INV-2024-001"
  
  // Issuer Information
  issuerId: string; // Business or nonprofit ID
  issuerType: "business" | "nonprofit";
  issuerName: string;
  
  // Recipient Information
  recipientId: string; // User ID
  recipientName: string;
  recipientEmail: string;
  recipientAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  
  // Billing Details
  billingType: "one-time" | "recurring";
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled" | "refunded";
  currency: "USD" | "BLKD";
  
  // Amounts
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  
  // Line Items
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    tax?: number;
    discount?: number;
    total: number;
  }[];
  
  // Recurring Settings
  recurringSettings?: {
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
    startDate: string;
    endDate?: string;
    nextBillingDate: string;
    billingCycleCount?: number;
    currentCycle: number;
  };
  
  // Dates
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Additional Info
  notes?: string;
  terms?: string;
  paymentTerms?: string; // "Net 30", "Due on receipt"
  
  // Payments
  payments?: {
    id: string;
    amount: number;
    currency: "USD" | "BLKD";
    paymentMethod: "card" | "bank_transfer" | "wallet" | "crypto" | "other";
    transactionId?: string;
    paidAt: string;
    status: "pending" | "completed" | "failed" | "refunded";
  }[];
}
```

**Indexes:**
- `invoiceNumber` (unique)
- `issuerId`, `issuerType`, `createdAt` (composite)
- `recipientId`, `status` (composite)
- `status`, `dueDate` (composite)
- `billingType`, `status` (composite)

---

## Community Collections

### 11. `events` Collection

**Purpose:** Community events

```typescript
events/{eventId}
{
  // Identity
  id: string; // Same as document ID
  organizerId: string; // User ID (business/nonprofit/individual)
  organizerName: string;
  organizerType: "business" | "nonprofit" | "individual";
  
  // Event Details
  title: string;
  description: string;
  category: "music" | "sports" | "business" | "community" | "education" | "arts" | "food" | "other";
  imageUrl?: string;
  
  // Location
  venue: {
    name: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Schedule
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  timezone: string;
  
  // Status
  status: "draft" | "published" | "cancelled" | "completed";
  isPublic: boolean;
  
  // Capacity
  maxAttendees?: number;
  currentAttendees: number;
  
  // Ticket Types
  ticketTypes: {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: "USD" | "BLKD";
    quantity: number;
    availableQuantity: number;
    salesStartDate?: string;
    salesEndDate?: string;
    isTransferable: boolean;
    maxPerOrder: number;
    minPerOrder: number;
  }[];
  
  // Tags
  tags: string[];
  
  // Statistics
  stats: {
    totalTicketsSold: number;
    totalRevenue: number;
    views: number;
    shares: number;
  };
  
  // Dates
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
```

**Subcollections:**
- `events/{eventId}/tickets` - Individual tickets sold
- `events/{eventId}/registrations` - Event registrations

**Indexes:**
- `organizerId`, `status` (composite)
- `status`, `startDate` (composite)
- `category`, `status` (composite)
- Geo: `venue.latitude`, `venue.longitude`

---

### 12. `campaigns` Collection

**Purpose:** Nonprofit fundraising campaigns

```typescript
campaigns/{campaignId}
{
  // Identity
  id: string; // Same as document ID
  organizationId: string; // Nonprofit ID
  organizationName: string;
  slug: string; // URL-friendly name
  
  // Campaign Details
  title: string;
  description: string;
  shortDescription?: string; // For cards/previews
  imageUrl?: string;
  videoUrl?: string; // Campaign video
  
  // Campaign Type
  type: "donation" | "sponsorship" | "volunteer" | "fundraiser";
  
  // Goals
  targetAmount?: number; // Optional target amount
  currentAmount: number; // Current amount raised
  currency: "USD" | "BLKD";
  contributors: number; // Number of unique contributors
  
  // Campaign Settings
  allowRecurring: boolean; // Allow recurring donations
  recurringFrequencies?: ("weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually")[];
  allowAnonymous: boolean; // Allow anonymous donations
  allowMessages: boolean; // Allow donor messages
  minimumDonation?: number; // Minimum donation amount
  
  // Status
  status: "draft" | "active" | "completed" | "cancelled" | "paused";
  
  // Dates
  startDate: string;
  endDate?: string; // Optional end date
  publishedAt?: string; // When campaign was published
  
  // Statistics (denormalized for performance)
  stats: {
    totalDonations: number;
    totalContributors: number;
    averageDonation: number;
    largestDonation: number;
    recurringDonations: number;
    views: number;
    shares: number;
  };
  
  // Tags & Categories
  tags: string[];
  category?: string; // Campaign category
  
  // Impact Tracking
  impactDescription?: string; // How funds will be used
  impactUpdates?: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
  }[];
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Subcollections:**
- `campaigns/{campaignId}/donations` - Individual donations
- `campaigns/{campaignId}/updates` - Campaign impact updates

**Indexes:**
- `slug` (unique)
- `organizationId`, `status` (composite)
- `status`, `createdAt` (composite)
- `type`, `status` (composite)
- `category`, `status` (composite)

---

### 13. `reviews` Collection

**Purpose:** Business reviews and ratings

```typescript
reviews/{reviewId}
{
  // Identity
  id: string; // Same as document ID
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Review Content
  rating: number; // 1-5 stars
  npsScore?: number; // 0-10 (Net Promoter Score)
  selectedReasons: string[]; // Review reason IDs
  comment?: string;
  
  // Verification
  verifiedPurchase: boolean;
  visitDate?: string;
  
  // Engagement
  helpfulCount: number;
  reported: boolean;
  
  // Business Response
  businessResponse?: {
    id: string;
    message: string;
    createdAt: string;
  };
  
  // Dates
  createdAt: string;
  updatedAt?: string;
}
```

**Indexes:**
- `businessId`, `createdAt` (composite)
- `userId`, `createdAt` (composite)
- `businessId`, `rating` (composite)
- `verifiedPurchase`, `createdAt` (composite)

---

### 14. `badges` Collection

**Purpose:** Badge definitions (system-wide)

```typescript
badges/{badgeId}
{
  // Identity
  id: string; // Same as document ID
  name: string;
  description: string;
  
  // Badge Details
  category: "purchases" | "social" | "community" | "achievement" | "education" | "milestone";
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string; // SVG icon identifier
  
  // Requirements
  requirement: {
    type: string; // "purchase_count", "referral_count", etc.
    value: number;
    description: string;
  };
  
  // Rewards
  pointsReward: number;
  
  // Visual
  color: string;
  gradient: string[];
}
```

**Subcollection:**
- `users/{userId}/badges` - User badge progress

```typescript
users/{userId}/badges/{badgeId}
{
  badgeId: string;
  userId: string;
  earnedAt?: string;
  progress: number; // 0-100
  isEarned: boolean;
}
```

---

### 15. `referrals` Collection

**Purpose:** Referral tracking

```typescript
referrals/{referralId}
{
  // Identity
  id: string; // Same as document ID
  referrerId: string; // User who made the referral
  referredUserId: string; // User who was referred
  
  // Referral Details
  referralCode: string; // Code used
  status: "pending" | "completed" | "expired";
  
  // Rewards
  rewardEarned: boolean;
  rewardAmount?: number;
  rewardType?: "points" | "cashback" | "discount";
  
  // Dates
  createdAt: string;
  completedAt?: string; // When referred user completed signup/first purchase
  expiredAt?: string;
}
```

**Indexes:**
- `referrerId`, `status` (composite)
- `referredUserId` (unique)
- `referralCode`, `status` (composite)

---

## User Engagement Collections

### 16. `messages` Collection

**Purpose:** Direct messages between users

```typescript
conversations/{conversationId}
{
  // Identity
  id: string; // Same as document ID
  participantIds: string[]; // Array of user IDs
  participantNames: string[];
  participantAvatars?: string[];
  
  // Conversation Details
  type: "direct" | "group" | "support";
  lastMessage?: {
    id: string;
    senderId: string;
    text: string;
    createdAt: string;
  };
  
  // Status
  unreadCount: number; // Per participant
  unreadBy: string[]; // User IDs with unread messages
  
  // Dates
  updatedAt: string;
  createdAt: string;
}
```

**Subcollection:**
- `conversations/{conversationId}/messages` - Individual messages

```typescript
conversations/{conversationId}/messages/{messageId}
{
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  text: string;
  attachments?: {
    id: string;
    type: "image" | "video" | "document" | "audio";
    url: string;
    thumbnailUrl?: string;
    fileName?: string;
    fileSize?: number;
  }[];
  read: boolean;
  createdAt: string;
  readAt?: string;
}
```

**Indexes:**
- `participantIds` (array-contains)
- `updatedAt` (indexed)

---

### 17. `notifications` Collection

**Purpose:** User notifications

```typescript
notifications/{notificationId}
{
  // Identity
  id: string; // Same as document ID
  userId: string;
  
  // Notification Details
  type: "transaction" | "promotion" | "event" | "system" | "social" | "achievement" | "reminder";
  channel: "wallet" | "promotions" | "events" | "system" | "social" | "merchant";
  priority: "low" | "normal" | "high" | "urgent";
  
  // Content
  title: string;
  message: string;
  imageUrl?: string;
  icon?: string;
  
  // Data
  data?: {
    [key: string]: any;
    transactionId?: string;
    businessId?: string;
    eventId?: string;
    link?: string;
    actionUrl?: string;
  };
  
  // Status
  read: boolean;
  readAt?: string;
  
  // Expiration
  expiresAt?: string;
  
  // Dates
  createdAt: string;
}
```

**Indexes:**
- `userId`, `read`, `createdAt` (composite)
- `userId`, `channel`, `createdAt` (composite)
- `userId`, `type`, `createdAt` (composite)

---

### 18. `education` Collection

**Purpose:** BDN University courses and content

```typescript
courses/{courseId}
{
  // Identity
  id: string; // Same as document ID
  title: string;
  description: string;
  slug: string; // URL-friendly name
  
  // Course Details
  category: "getting-started" | "features" | "merchant" | "payments" | "rewards" | "community";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string; // e.g., "15 min", "1 hour"
  icon: string;
  
  // Content
  learningObjectives?: string[]; // What users will learn
  prerequisites?: string[]; // What users should know before starting
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    detailedContent?: string; // Expanded content for the step
    imageUrl?: string;
    videoUrl?: string; // Optional video for step
    tips?: string[];
    interactiveElements?: {
      type: "checkbox" | "button" | "code-snippet" | "highlight" | "tooltip" | "video" | "image-annotation";
      id: string;
      label?: string;
      content?: string;
      action?: {
        type: "navigate" | "open-modal" | "copy-code" | "highlight-element";
        target?: string;
      };
    }[];
    codeExample?: {
      language: string;
      code: string;
    };
    completionCriteria?: string; // What needs to be done to complete this step
    estimatedTime?: string; // Time for this specific step
  }[];
  
  // Statistics
  stats: {
    enrollments: number;
    completions: number;
    averageRating: number;
    averageCompletionTime?: number; // Average time to complete in minutes
  };
  
  // Status
  isPublished: boolean;
  publishedAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Subcollections:**
- `courses/{courseId}/enrollments` - User course enrollments
- `courses/{courseId}/completions` - User course completions

**Indexes:**
- `slug` (unique)
- `category`, `isPublished` (composite)
- `difficulty`, `isPublished` (composite)

---

### 18a. `videos` Collection

**Purpose:** BDN University video tutorials

```typescript
videos/{videoId}
{
  // Identity
  id: string; // Same as document ID
  title: string;
  description: string;
  slug: string;
  
  // Video Details
  thumbnailUrl: string;
  videoUrl: string; // Video file URL or embed URL
  duration: string; // e.g., "5:30"
  category: "tutorial" | "feature" | "tips" | "community" | "business";
  tags: string[];
  
  // Statistics
  views: number;
  likes?: number;
  
  // Status
  isPublished: boolean;
  publishedAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt?: string;
}
```

**Indexes:**
- `slug` (unique)
- `category`, `isPublished` (composite)
- `views` (indexed for popular videos)

---

### 18b. `guides` Collection

**Purpose:** Interactive step-by-step guides

```typescript
guides/{guideId}
{
  // Identity
  id: string; // Same as document ID
  title: string;
  description: string;
  slug: string;
  
  // Guide Details
  category: "getting-started" | "features" | "merchant" | "payments" | "rewards" | "community";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  icon: string;
  
  // Content
  learningObjectives?: string[];
  prerequisites?: string[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    detailedContent?: string;
    imageUrl?: string;
    tips?: string[];
    interactiveElements?: {
      type: "checkbox" | "button" | "code-snippet" | "highlight" | "tooltip" | "video" | "image-annotation";
      id: string;
      label?: string;
      content?: string;
      action?: {
        type: "navigate" | "open-modal" | "copy-code" | "highlight-element";
        target?: string;
      };
      checked?: boolean;
      required?: boolean;
    }[];
    completionCriteria?: string;
    estimatedTime?: string;
  }[];
  
  // Statistics
  stats: {
    completions: number;
    averageRating: number;
  };
  
  // Status
  isPublished: boolean;
  publishedAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Indexes:**
- `slug` (unique)
- `category`, `isPublished` (composite)

---

### 18c. `blogPosts` Collection

**Purpose:** BDN blog posts and articles

```typescript
blogPosts/{postId}
{
  // Identity
  id: string; // Same as document ID
  title: string;
  excerpt: string;
  slug: string;
  
  // Content
  content: string; // Plain text or markdown fallback
  contentBlocks?: {
    type: "paragraph" | "heading" | "image" | "list" | "code" | "quote" | "divider" | "callout";
    content?: string;
    level?: 1 | 2 | 3 | 4; // For headings
    url?: string; // For images
    alt?: string; // For images
    caption?: string; // For images
    ordered?: boolean; // For lists
    items?: string[]; // For lists
    language?: string; // For code
    code?: string; // For code
    author?: string; // For quotes
    variant?: "info" | "warning" | "success" | "error"; // For callouts
  }[];
  
  // Author
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  
  // Metadata
  category: "news" | "tips" | "community" | "business" | "updates";
  featuredImage?: string;
  tags: string[];
  relatedPosts?: string[]; // IDs of related posts
  
  // Statistics
  readTime: number; // minutes
  views: number;
  likes?: number;
  
  // Status
  isPublished: boolean;
  publishedAt: string;
  updatedAt?: string;
  
  // Dates
  createdAt: string;
}
```

**Indexes:**
- `slug` (unique)
- `category`, `publishedAt` (composite)
- `publishedAt` (indexed for recent posts)

---

### 18d. `helpArticles` Collection

**Purpose:** Help center articles and FAQs

```typescript
helpArticles/{articleId}
{
  // Identity
  id: string; // Same as document ID
  title: string;
  content: string;
  slug: string;
  
  // Metadata
  category: "account" | "payments" | "merchant" | "rewards" | "troubleshooting" | "faq";
  tags: string[];
  relatedArticles?: string[]; // IDs of related articles
  
  // Feedback
  helpful: number;
  notHelpful: number;
  
  // Status
  isPublished: boolean;
  publishedAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}
```

**Indexes:**
- `slug` (unique)
- `category`, `isPublished` (composite)
- `helpful` (indexed for popular articles)

---

### 19. `directory` Collection

**Purpose:** Business directory search and discovery

```typescript
directory/{entryId}
{
  // Identity
  id: string; // Same as document ID
  businessId: string; // Reference to business document
  businessName: string; // Denormalized for search performance
  
  // Search Metadata
  searchableText: string; // Combined searchable text (name, description, category, tags)
  category: string;
  tags: string[];
  
  // Location (for geo-search)
  location: {
    address: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Business Details (denormalized for search)
  type: "local-shop" | "local-service" | "national-service" | "online-shopping" | "restaurant";
  isVerified: boolean;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  
  // Search Ranking
  relevanceScore: number; // Calculated relevance score
  popularityScore: number; // Based on views, clicks, orders
  
  // Dates
  createdAt: string;
  updatedAt: string;
  lastIndexedAt: string; // When search index was last updated
}
```

**Note:** This collection is optimized for search. Consider using Elasticsearch or Algolia for advanced search capabilities.

**Indexes:**
- `businessId` (unique)
- `category`, `isActive` (composite)
- `location.coordinates` (geo index)
- `isVerified`, `isActive` (composite)
- `relevanceScore` (indexed)
- `popularityScore` (indexed)

---

### 20. `searchHistory` Collection

**Purpose:** User search history and analytics

```typescript
searchHistory/{searchId}
{
  // Identity
  id: string; // Same as document ID
  userId: string;
  
  // Search Details
  query: string;
  filters?: {
    category?: string;
    location?: {
      lat: number;
      lng: number;
      radius: number;
    };
    priceRange?: {
      min: number;
      max: number;
    };
    rating?: number;
    type?: string[];
    tags?: string[];
  };
  
  // Results
  resultCount: number;
  clickedResults?: string[]; // IDs of results user clicked
  
  // Dates
  createdAt: string;
}
```

**Indexes:**
- `userId`, `createdAt` (composite)
- `query` (indexed for popular searches)

---

## Admin & Analytics Collections

### 21. `admin` Collection

**Purpose:** Admin operations and settings

```typescript
admin/{documentId}
{
  // Various admin documents:
  // - settings: Platform settings
  // - disputes: Dispute records
  // - auditLogs: Admin action logs
}
```

**Subcollections:**
- `admin/disputes/{disputeId}` - User disputes
- `admin/auditLogs/{logId}` - Admin action logs
- `admin/settings` - Platform settings

---

### 22. `analytics` Collection

**Purpose:** Aggregated analytics data

```typescript
analytics/{documentId}
{
  // Various analytics documents:
  // - dailyStats: Daily platform statistics
  // - businessMetrics: Business performance metrics
  // - userMetrics: User engagement metrics
}
```

**Example: Daily Stats**
```typescript
analytics/dailyStats/{date} // Date: "2025-01-15"
{
  date: string; // "2025-01-15"
  users: {
    total: number;
    new: number;
    active: number;
  };
  businesses: {
    total: number;
    new: number;
    active: number;
  };
  transactions: {
    total: number;
    totalAmount: number;
    averageAmount: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
  };
  // ... more metrics
}
```

---

## Indexes

### Required Composite Indexes

```javascript
// Users
users: [
  { fields: ["email"], unique: true },
  { fields: ["referralCode"], unique: true },
  { fields: ["tier", "points"] },
  { fields: ["status", "createdAt"] },
  { fields: ["userType", "status"] },
]

// Businesses
businesses: [
  { fields: ["slug"], unique: true },
  { fields: ["userId"] },
  { fields: ["status", "createdAt"] },
  { fields: ["category", "status"] },
  { fields: ["address.country", "address.city"] },
  { fields: ["isActive", "isVerified"] },
]

// Orders
orders: [
  { fields: ["orderNumber"], unique: true },
  { fields: ["customerId", "createdAt"] },
  { fields: ["entityId", "entityType", "createdAt"] },
  { fields: ["status", "createdAt"] },
  { fields: ["paymentStatus", "createdAt"] },
  { fields: ["orderType", "status"] },
]

// Transactions
transactions: [
  { fields: ["transactionNumber"], unique: true },
  { fields: ["userId", "createdAt"] },
  { fields: ["type", "status", "createdAt"] },
  { fields: ["relatedEntityId", "relatedEntityType", "createdAt"] },
]

// Events
events: [
  { fields: ["organizerId", "status"] },
  { fields: ["status", "startDate"] },
  { fields: ["category", "status"] },
]

// Reviews
reviews: [
  { fields: ["businessId", "createdAt"] },
  { fields: ["userId", "createdAt"] },
  { fields: ["businessId", "rating"] },
]

// Notifications
notifications: [
  { fields: ["userId", "read", "createdAt"] },
  { fields: ["userId", "channel", "createdAt"] },
]

// Subscriptions
subscriptions: [
  { fields: ["userId", "status"] },
  { fields: ["nextBillingDate"] },
]

// Subscription Boxes
subscriptionBoxes: [
  { fields: ["userId", "status"] },
  { fields: ["nextBillingDate"] },
  { fields: ["nextShipmentDate"] },
]
```

---

## Security Rules

### General Principles

1. **Authentication Required**: Most collections require authentication
2. **User Ownership**: Users can only read/write their own data
3. **Business Ownership**: Business owners can manage their business data
4. **Public Read**: Some collections allow public read (businesses, events)
5. **Admin Only**: Admin operations require admin role

### Example Security Rules

```javascript
// Users
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Businesses
match /businesses/{businessId} {
  allow read: if true; // Public read
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
  allow delete: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Orders
match /orders/{orderId} {
  allow read: if request.auth != null && 
    (resource.data.customerId == request.auth.uid ||
     resource.data.entityId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.businessIds);
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
    (resource.data.entityId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.businessIds ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
}

// Transactions
match /transactions/{transactionId} {
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null;
  allow update: if false; // Transactions are immutable
}

// Reviews
match /reviews/{reviewId} {
  allow read: if true; // Public read
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow update: if request.auth != null && resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

---

## Data Migration Considerations

### Initial Data Setup

1. **Badge Definitions**: Seed `badges` collection with all badge definitions
2. **Subscription Plans**: Seed subscription plan templates
3. **Categories**: Seed business/product categories
4. **Review Reasons**: Seed review reason configurations

### Migration Scripts

- User migration from existing auth system
- Business data migration
- Order history migration
- Transaction history migration

---

## Performance Optimization

### Denormalization Strategy

1. **User Names**: Store `userName` in transactions, orders, reviews (denormalized)
2. **Business Names**: Store `businessName` in orders, transactions
3. **Statistics**: Maintain `stats` objects in business/nonprofit documents
4. **Last Message**: Store `lastMessage` in conversation documents

### Caching Strategy

1. **Badge Definitions**: Cache in memory (rarely changes)
2. **Subscription Plans**: Cache in memory
3. **Categories**: Cache in memory
4. **User Profiles**: Cache frequently accessed profiles

### Query Optimization

1. **Limit Results**: Always use `.limit()` on queries
2. **Pagination**: Use cursor-based pagination
3. **Composite Indexes**: Create indexes for all query patterns
4. **Batch Reads**: Use `getAll()` for multiple document reads

---

## Backup & Recovery

### Backup Strategy

1. **Daily Backups**: Automated daily backups
2. **Point-in-Time Recovery**: Enable point-in-time recovery
3. **Export Scripts**: Regular exports to Cloud Storage

### Recovery Procedures

1. **Document Recovery**: Restore individual documents
2. **Collection Recovery**: Restore entire collections
3. **Full Database Recovery**: Restore from backup

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Read/Write Operations**: Track operation counts
2. **Query Performance**: Monitor slow queries
3. **Index Usage**: Track index usage
4. **Document Size**: Monitor large documents
5. **Collection Size**: Monitor collection growth

### Alerts

1. **High Read/Write Rates**: Alert on unusual activity
2. **Slow Queries**: Alert on queries > 1 second
3. **Large Documents**: Alert on documents > 1MB
4. **Failed Operations**: Alert on operation failures

---

## Conclusion

This database design provides a comprehensive foundation for the BDN platform, supporting all features including:

- User management and authentication
- Business and nonprofit management
- Product catalog and inventory
- Order processing and fulfillment
- Payment processing and transactions
- Events and ticketing
- Campaigns and donations
- Reviews and ratings
- Badges and achievements
- Subscriptions and recurring billing
- Messaging and notifications
- Education and learning
- Analytics and reporting

The design follows Firestore best practices for scalability, performance, and maintainability.

