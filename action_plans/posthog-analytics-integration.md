---
name: PostHog Analytics Integration
overview: Integrate PostHog analytics into the BDN platform for comprehensive user behavior tracking, conversion funnels, feature usage, and business intelligence. This includes setting up PostHog SDK, creating a centralized analytics service, implementing event tracking across all major user flows, and configuring user identification and properties.
todos:
  - id: install-posthog
    content: "Install PostHog SDK packages: posthog-react-native (iOS/Android via Expo) and posthog-js (web). Run pod install for iOS native dependencies."
    status: pending
  - id: create-analytics-service
    content: "Create analytics service layer with platform detection: posthog.ts (multi-platform init), events.ts, user-properties.ts, screen-tracking.ts, platform-adapter.ts"
    status: pending
  - id: setup-posthog-init
    content: Initialize PostHog in app/_layout.tsx with environment variables
    status: pending
  - id: implement-auth-tracking
    content: Add tracking to authentication flows (signup, login, onboarding) in contexts/AuthContext.tsx and auth pages
    status: pending
  - id: implement-ecommerce-tracking
    content: Add tracking to shopping flows (product views, cart, checkout) in CartContext and checkout pages
    status: pending
  - id: implement-payment-tracking
    content: Add tracking to all payment flows (C2B, invoices, tokens, BLKD, donations, events)
    status: pending
  - id: implement-search-tracking
    content: Add tracking to search and discovery flows (search queries, filters, results clicks)
    status: pending
  - id: implement-business-tracking
    content: Add tracking to business/merchant features (onboarding, product management, fulfillment)
    status: pending
  - id: implement-engagement-tracking
    content: Add tracking to user engagement features (referrals, rewards, subscriptions, content views)
    status: pending
  - id: implement-screen-tracking
    content: Set up automatic screen view tracking using Expo Router navigation state
    status: pending
  - id: implement-user-identification
    content: Set up user identification and property management in AuthContext
    status: pending
  - id: add-error-tracking
    content: Integrate error tracking with ErrorBoundary and API error handlers
    status: pending
  - id: update-config
    content: Add PostHog environment variables to config.ts and app.json
    status: pending
isProject: false
---

# PostHog Analytics Integration Plan

## Overview

Integrate PostHog for comprehensive analytics tracking across the BDN platform. PostHog provides product analytics, feature flags, session recordings, and user insights similar to Mixpanel and Google Analytics.

## Architecture

### 1. PostHog Setup - Multi-Platform Integration

**Platform Support:**

- **Web (Browser)**: Use `posthog-js` SDK
- **React Native/Expo Mobile (iOS & Android)**: Use `posthog-react-native` SDK
- **Native iOS**: PostHog React Native SDK includes native iOS module
- **Native Android**: PostHog React Native SDK includes native Android module

**Installation:**

```bash
# Install React Native SDK (works for iOS and Android via Expo)
npm install posthog-react-native

# Install Web SDK (for browser platform)
npm install posthog-js

# Optional: TypeScript types
npm install --save-dev @types/posthog-js
```

**Platform Detection:**

- Use `Platform.OS` from React Native to detect platform
- Initialize appropriate SDK based on platform (web vs native mobile)
- Both SDKs share the same API surface for consistent tracking

**Configuration Files:**

- `lib/analytics/posthog.ts` - PostHog client initialization with platform detection
- `lib/analytics/events.ts` - Event definitions and type-safe event tracking
- `lib/analytics/user-properties.ts` - User property management
- `lib/analytics/platform-adapter.ts` - Platform-specific adapter layer
- `hooks/useAnalytics.ts` - React hook for analytics tracking

**Environment Variables:**

- `EXPO_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `EXPO_PUBLIC_POSTHOG_HOST` - PostHog host URL (default: https://app.posthog.com)

**Native iOS Configuration:**

- PostHog React Native SDK automatically links native iOS dependencies via CocoaPods
- Run `cd ios && pod install` after installing package
- No additional native code required for basic tracking

**Native Android Configuration:**

- PostHog React Native SDK automatically links native Android dependencies via Gradle
- No additional native code required for basic tracking
- Permissions handled automatically (INTERNET permission)

### 2. Platform Architecture

**Multi-Platform SDK Selection:**

```
Platform Detection (Platform.OS)
├── "web" → posthog-js
│   └── Browser-based tracking
│   └── Session recordings (web)
│   └── Page view tracking
│
└── "ios" | "android" → posthog-react-native
    ├── iOS Native Module (via CocoaPods)
    │   └── Native iOS tracking
    │   └── App lifecycle events
    │   └── Deep linking
    │
    └── Android Native Module (via Gradle)
        └── Native Android tracking
        └── App lifecycle events
        └── Deep linking
```

**Unified API Layer:**

- Single API interface (`lib/analytics/posthog.ts`) handles platform detection
- Same tracking functions work across all platforms
- Platform-specific optimizations handled internally

### 3. Analytics Service Architecture

```
lib/analytics/
├── posthog.ts          # Multi-platform PostHog client setup
├── platform-adapter.ts # Platform-specific utilities
├── events.ts           # Event type definitions
├── user-properties.ts  # User property helpers
├── screen-tracking.ts  # Screen view tracking
└── index.ts            # Public API exports
```

## Event Tracking Categories

### Authentication & Onboarding

**Signup Flow:**

- `signup_started` - User initiated signup
- `signup_email_entered` - Email field completed
- `signup_password_entered` - Password field completed
- `signup_completed` - Account created successfully
- `signup_failed` - Signup error occurred
- `email_verification_sent` - Verification email sent
- `email_verification_completed` - Email verified
- `onboarding_started` - Onboarding flow initiated
- `onboarding_step_completed` - Each onboarding step (1-5)
- `onboarding_completed` - Full onboarding finished

**Login Flow:**

- `login_started` - Login attempt initiated
- `login_completed` - Successful login
- `login_failed` - Login error
- `biometric_login_attempted` - Biometric auth tried
- `biometric_login_success` - Biometric auth succeeded
- `biometric_login_failed` - Biometric auth failed
- `password_reset_initiated` - Password reset started
- `password_reset_completed` - Password reset finished

**User Properties:**

- `user_type` - consumer, business, nonprofit
- `user_level` - basic, bronze, silver, gold, diamond, black_diamond
- `onboarding_completed` - boolean
- `email_verified` - boolean
- `biometric_enabled` - boolean

### E-commerce & Shopping

**Product Discovery:**

- `product_viewed` - Product detail page viewed
- `product_searched` - Search query executed
- `search_filter_applied` - Filter used (category, price, rating, location)
- `search_results_viewed` - Search results page viewed
- `category_browsed` - Category page viewed
- `business_viewed` - Business profile viewed
- `map_view_toggled` - Map/list view switched
- `business_directions_requested` - Directions requested

**Shopping Cart:**

- `cart_viewed` - Cart page opened
- `product_added_to_cart` - Item added to cart
- `product_removed_from_cart` - Item removed
- `cart_quantity_changed` - Quantity updated
- `buy_now_clicked` - Buy now button clicked

**Checkout Flow:**

- `checkout_started` - Checkout initiated
- `checkout_step_viewed` - Shipping, payment, review steps
- `shipping_address_added` - Address entered
- `shipping_address_selected` - Existing address selected
- `payment_method_selected` - Payment method chosen
- `checkout_review_viewed` - Review step viewed
- `checkout_completed` - Order placed successfully
- `checkout_abandoned` - Checkout left incomplete
- `checkout_failed` - Payment processing error

**Order Tracking:**

- `order_viewed` - Order detail page viewed
- `order_tracking_viewed` - Tracking section viewed
- `order_tracking_link_clicked` - Carrier tracking link clicked
- `order_cancelled` - Order cancelled

**Event Properties:**

- `product_id`, `product_name`, `product_category`, `product_price`
- `business_id`, `business_name`
- `cart_value`, `cart_items_count`
- `order_id`, `order_total`, `order_items_count`
- `payment_method` - credit_card, blkd_wallet, bank_account
- `shipping_method`

### Payment Transactions

**Payment Types:**

- `c2b_payment_started` - Consumer-to-business payment initiated
- `c2b_payment_completed` - C2B payment successful
- `invoice_payment_started` - Invoice payment initiated
- `invoice_payment_completed` - Invoice paid
- `gift_card_purchased` - Gift card purchase completed
- `token_purchase_started` - Token purchase initiated
- `token_purchase_completed` - Tokens purchased
- `blkd_purchase_started` - BLKD currency purchase started
- `blkd_purchase_completed` - BLKD purchased
- `donation_started` - Nonprofit donation initiated
- `donation_completed` - Donation successful
- `event_ticket_purchased` - Event ticket purchased
- `subscription_purchased` - BDN+ subscription purchased

**Transaction Properties:**

- `transaction_id`, `transaction_type`, `transaction_amount`, `currency`
- `payment_method`, `payment_processor`
- `fee_amount`, `net_amount`
- `cashback_earned`
- `related_business_id`, `related_nonprofit_id`

### Business & Merchant Features

**Business Onboarding:**

- `business_onboarding_started` - Business signup initiated
- `business_onboarding_step_completed` - Each step (1-6)
- `business_onboarding_completed` - Onboarding finished
- `business_verification_submitted` - Verification application submitted
- `business_verification_approved` - Business verified

**Product Management:**

- `product_created` - New product added
- `product_edited` - Product updated
- `product_deleted` - Product removed
- `product_bulk_upload_started` - Bulk upload initiated
- `product_bulk_upload_completed` - Bulk upload finished
- `product_bulk_upload_failed` - Upload errors

**Order Fulfillment:**

- `order_fulfillment_viewed` - Fulfillment page opened
- `order_fulfillment_started` - Fulfillment initiated
- `tracking_added` - Tracking number added
- `order_shipped` - Order marked as shipped
- `order_delivered` - Order marked as delivered

**Business Analytics:**

- `business_analytics_viewed` - Analytics dashboard opened
- `business_analytics_filter_applied` - Date range/filter changed
- `business_report_exported` - Report downloaded

**Event Properties:**

- `business_id`, `business_name`, `business_category`
- `product_id`, `product_type` - product, service, subscription
- `order_id`, `order_status`

### Search & Discovery

**Search Events:**

- `search_initiated` - Search started
- `search_query_entered` - Query typed
- `search_results_viewed` - Results page viewed
- `search_result_clicked` - Result clicked
- `search_filter_applied` - Filter added
- `search_sort_changed` - Sort option changed
- `search_no_results` - No results found
- `search_suggestion_clicked` - Autocomplete suggestion selected

**Search Properties:**

- `search_query`, `search_type` - business, product, service, media
- `results_count`, `filters_applied`
- `sort_method` - relevance, distance, rating, price, newest
- `selected_result_id`, `selected_result_type`

### User Engagement & Rewards

**Referrals:**

- `referral_link_viewed` - Referral page opened
- `referral_link_copied` - Referral code copied
- `referral_link_shared` - Referral shared (method)
- `referral_signup` - User signed up via referral
- `referral_first_purchase` - Referred user made first purchase
- `referral_reward_earned` - Referral reward received

**Rewards & Points:**

- `points_earned` - Points awarded
- `level_up` - User progressed to new level
- `badge_earned` - Badge unlocked
- `reward_viewed` - Rewards page opened
- `cashback_earned` - Cashback received
- `impact_dashboard_viewed` - MyImpact page viewed

**Event Properties:**

- `points_amount`, `points_type` - purchase, referral, feedback, etc.
- `user_level`, `previous_level`, `new_level`
- `badge_id`, `badge_name`
- `cashback_amount`, `referral_code`

### Subscriptions (BDN+)

**Consumer Subscription:**

- `bdn_plus_viewed` - BDN+ page viewed
- `bdn_plus_signup_started` - Subscription initiated
- `bdn_plus_signup_completed` - Subscription active
- `bdn_plus_cancelled` - Subscription cancelled
- `bdn_plus_feature_used` - Premium feature accessed

**Business Subscription:**

- `bdn_plus_business_viewed` - Business subscription page viewed
- `bdn_plus_business_signup_started` - Business subscription initiated
- `bdn_plus_business_signup_completed` - Business subscription active
- `bdn_plus_business_cancelled` - Business subscription cancelled

**Event Properties:**

- `subscription_type` - consumer, business
- `subscription_tier`, `subscription_price`
- `subscription_duration` - monthly, annual

### Content & Media

**Events:**

- `event_viewed` - Event detail page viewed
- `event_ticket_selected` - Ticket type selected
- `event_shared` - Event shared
- `campaign_viewed` - Campaign page viewed
- `campaign_donation_started` - Donation initiated
- `campaign_donation_completed` - Donation successful
- `media_viewed` - Media/BDN TV content viewed
- `media_playback_started` - Video playback started
- `media_playback_completed` - Video finished
- `university_course_viewed` - BDN University course viewed
- `university_enrolled` - Course enrollment

**Event Properties:**

- `event_id`, `event_title`, `event_type`
- `campaign_id`, `campaign_name`, `nonprofit_id`
- `media_id`, `media_type`, `media_duration`
- `course_id`, `course_name`

### Admin & Developer Features

**Admin Actions:**

- `admin_dashboard_viewed` - Admin dashboard opened
- `admin_user_managed` - User created/updated/deleted
- `admin_business_managed` - Business created/updated/deleted
- `admin_feature_flag_toggled` - Feature flag changed
- `admin_analytics_viewed` - Admin analytics accessed

**Developer Actions:**

- `developer_dashboard_viewed` - Developer dashboard opened
- `api_key_created` - API key generated
- `api_key_revoked` - API key deleted
- `webhook_configured` - Webhook set up
- `sdk_downloaded` - SDK downloaded

### Error & Performance Tracking

**Errors:**

- `error_occurred` - Error caught (with error boundary)
- `api_error` - API request failed
- `payment_error` - Payment processing error
- `checkout_error` - Checkout flow error

**Performance:**

- `page_load_time` - Page load performance
- `api_response_time` - API call duration
- `image_load_failed` - Image loading error

**Event Properties:**

- `error_message`, `error_type`, `error_stack`
- `api_endpoint`, `api_method`, `status_code`
- `page_path`, `load_time_ms`

### Screen Views

**Automatic Screen Tracking:**

- Track all screen views using Expo Router navigation state
- Screen names: route paths (e.g., `/pages/businesses/[id]`, `/(tabs)/dashboard`)
- Include screen properties: `screen_name`, `screen_category`, `previous_screen`

## Implementation Details

### 1. PostHog Client Setup (`lib/analytics/posthog.ts`)

Multi-platform initialization with platform detection:

```typescript
import { Platform } from "react-native";
import Constants from "expo-constants";

// Platform-specific imports
let PostHogRN: any = null;
let PostHogWeb: any = null;

if (Platform.OS === "web") {
  // Dynamic import for web to avoid bundling React Native code
  PostHogWeb = require("posthog-js");
} else {
  // React Native SDK for iOS and Android
  PostHogRN = require("posthog-react-native");
}

const POSTHOG_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_POSTHOG_HOST ||
  "https://app.posthog.com";

let posthog: any = null;

export function initializePostHog() {
  if (!POSTHOG_KEY) {
    console.warn("PostHog key not configured");
    return;
  }

  if (Platform.OS === "web") {
    // Web platform - use posthog-js
    PostHogWeb.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "*",
      },
    });
    posthog = PostHogWeb;
  } else {
    // iOS and Android - use posthog-react-native
    posthog = new PostHogRN.default(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      enableSessionReplay: true,
      captureScreenViews: true,
      captureApplicationLifecycleEvents: true,
      captureDeepLinks: true,
      // iOS/Android specific options
      flushAt: 20, // Batch events
      flushInterval: 30, // Flush every 30 seconds
    });
  }

  return posthog;
}

export function getPostHog() {
  return posthog;
}

// Platform-agnostic wrapper functions
export function capture(eventName: string, properties?: Record<string, any>) {
  const client = getPostHog();
  if (!client) return;

  if (Platform.OS === "web") {
    client.capture(eventName, properties);
  } else {
    client.capture(eventName, properties);
  }
}

export function identify(userId: string, properties?: Record<string, any>) {
  const client = getPostHog();
  if (!client) return;

  if (Platform.OS === "web") {
    client.identify(userId, properties);
  } else {
    client.identify(userId, properties);
  }
}

export function reset() {
  const client = getPostHog();
  if (!client) return;

  if (Platform.OS === "web") {
    client.reset();
  } else {
    client.reset();
  }
}
```

### 2. Type-Safe Event Tracking (`lib/analytics/events.ts`)

```typescript
import { getPostHog } from './posthog';

export type EventName =
  | 'signup_started'
  | 'signup_completed'
  | 'login_completed'
  | 'product_viewed'
  | 'product_added_to_cart'
  | 'checkout_started'
  | 'checkout_completed'
  | // ... all event names

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export function trackEvent(
  eventName: EventName,
  properties?: EventProperties
) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.capture(eventName, properties);
}

export function identifyUser(userId: string, properties?: EventProperties) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.identify(userId, properties);
}

export function resetUser() {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.reset();
}
```

### 3. Screen Tracking (`lib/analytics/screen-tracking.ts`)

Integrate with Expo Router to automatically track screen views:

```typescript
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { trackEvent } from "./events";

export function useScreenTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackEvent("screen_viewed", {
        screen_name: pathname,
        screen_category: getScreenCategory(pathname),
      });
    }
  }, [pathname]);
}

function getScreenCategory(pathname: string): string {
  if (pathname.startsWith("/(tabs)")) return "main_navigation";
  if (pathname.startsWith("/pages/businesses")) return "business";
  if (pathname.startsWith("/pages/products")) return "product";
  if (pathname.startsWith("/pages/checkout")) return "checkout";
  if (pathname.startsWith("/pages/payments")) return "payment";
  if (pathname.startsWith("/admin")) return "admin";
  return "other";
}
```

### 4. User Properties Management (`lib/analytics/user-properties.ts`)

```typescript
import { getPostHog } from "./posthog";
import { User } from "@/types/user";

export function setUserProperties(user: User) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.identify(user.id, {
    email: user.email,
    user_type: user.type,
    user_level: user.level,
    onboarding_completed: user.onboardingCompleted,
    email_verified: user.emailVerified,
    created_at: user.createdAt,
  });
}

export function updateUserLevel(level: string) {
  const posthog = getPostHog();
  if (!posthog) return;

  posthog.setPersonProperties({
    user_level: level,
    level_updated_at: new Date().toISOString(),
  });
}
```

### 5. Integration Points

**Authentication Context (`contexts/AuthContext.tsx`):**

- Identify user on login
- Track login/signup events
- Reset on logout

**Cart Context (`contexts/CartContext.tsx`):**

- Track cart events (add, remove, view)
- Track checkout initiation

**Navigation (`app/_layout.tsx`):**

- Initialize PostHog on app start
- Set up screen tracking

**Payment Flows:**

- `app/pages/checkout.tsx` - Checkout events
- `app/pages/payments/c2b-payment.tsx` - C2B payment events
- `app/pages/payments/token-purchase.tsx` - Token purchase events
- `components/orders/OrderFulfillment.tsx` - Fulfillment events

**Search Components:**

- `app/pages/search/index.tsx` - Search events
- `app/pages/search/results.tsx` - Search results events
- `components/search/SearchFiltersPanel.tsx` - Filter events

## Configuration

### Environment Variables

Add to `app.json` or `.env`:

```json
{
  "extra": {
    "EXPO_PUBLIC_POSTHOG_KEY": "your-posthog-key",
    "EXPO_PUBLIC_POSTHOG_HOST": "https://app.posthog.com"
  }
}
```

### Feature Flag Integration

PostHog can also be used for feature flags. Integrate with existing `FeatureFlagsContext`:

```typescript
import { getPostHog } from "@/lib/analytics/posthog";

export function usePostHogFeatureFlag(flagName: string): boolean {
  const posthog = getPostHog();
  // Use PostHog feature flags API
}
```

## Testing

1. **Platform-Specific Testing:**
   - **Web**: Test in Chrome, Safari, Firefox browsers
   - **iOS**: Test on physical device and iOS Simulator
   - **Android**: Test on physical device and Android Emulator
   - Verify events appear in PostHog dashboard from all platforms

2. **Development Testing:**
   - Use PostHog test project key
   - Verify events appear in PostHog dashboard
   - Test user identification across platforms
   - Test screen tracking on each platform
   - Verify session recordings work (web and mobile)

3. **Event Validation:**
   - Ensure all critical events are tracked consistently across platforms
   - Verify event properties are consistent between web and mobile
   - Check user properties are set correctly
   - Test event batching and flushing

4. **Performance:**
   - Ensure PostHog doesn't impact app performance on any platform
   - Use batching for high-frequency events
   - Test on slow networks (3G simulation)
   - Monitor native module performance on iOS/Android

5. **Native Integration Testing:**
   - Verify iOS native module links correctly (check Podfile.lock)
   - Verify Android native module links correctly (check build.gradle)
   - Test deep linking tracking on native platforms
   - Test app lifecycle event tracking (foreground/background)

## Files to Create/Modify

**New Files:**

- `lib/analytics/posthog.ts` - Multi-platform PostHog initialization (web, iOS, Android)
- `lib/analytics/events.ts` - Event type definitions and tracking
- `lib/analytics/user-properties.ts` - User property management
- `lib/analytics/screen-tracking.ts` - Screen view tracking
- `lib/analytics/platform-adapter.ts` - Platform-specific adapter utilities
- `lib/analytics/index.ts` - Public API exports
- `hooks/useAnalytics.ts` - React hook for analytics tracking

**Files to Modify:**

- `package.json` - Add PostHog dependencies (posthog-react-native, posthog-js)
- `ios/Podfile` - CocoaPods will auto-link PostHog native dependencies (run `pod install`)
- `app.json` - Add PostHog environment variables to `extra` section
- `app/_layout.tsx` - Initialize PostHog with platform detection, add screen tracking
- `contexts/AuthContext.tsx` - User identification
- `contexts/CartContext.tsx` - Cart event tracking
- `app/pages/checkout.tsx` - Checkout events
- `app/pages/payments/*.tsx` - Payment events
- `app/pages/search/*.tsx` - Search events
- `app/(auth)/signup.tsx` - Signup events
- `app/(auth)/login.tsx` - Login events
- `app/(auth)/onboarding.tsx` - Onboarding events
- `app/pages/referrals.tsx` - Referral events
- `app/pages/tokens/index.tsx` - Token events
- `components/orders/OrderFulfillment.tsx` - Fulfillment events
- `lib/config.ts` - Add PostHog config

**Native Build Steps:**

1. **iOS:**

   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Android:**
   - No additional steps needed - Gradle auto-links dependencies
   - Ensure `minSdkVersion` is 21+ in `android/build.gradle`

## PostHog Dashboard Setup

1. **Create Funnels:**
   - Signup → Onboarding → First Purchase
   - Product View → Add to Cart → Checkout → Purchase
   - Search → Business View → C2B Payment

2. **Create Cohorts:**
   - New users (last 7 days)
   - Active purchasers
   - BDN+ subscribers
   - Business owners

3. **Set Up Dashboards:**
   - User acquisition metrics
   - E-commerce conversion metrics
   - Business performance metrics
   - Engagement metrics

4. **Configure Alerts:**
   - Drop in conversion rates
   - Increase in error rates
   - Significant changes in key metrics
