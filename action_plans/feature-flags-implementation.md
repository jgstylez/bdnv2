# Feature Flags Implementation

**Date:** 2025-01-XX  
**Purpose:** Comprehensive feature flag system for controlling platform features from admin dashboard

---

## Overview

A complete feature flag system has been implemented to allow admin operators to control what features are available in the MVP. Features can be enabled/disabled from the admin dashboard, and the app will automatically show/hide features based on these flags.

---

## Architecture

### 1. Type Definitions (`types/feature-flags.ts`)

- **FeatureFlags Interface**: Comprehensive type definition for all feature flags
- **Default Feature Flags**: All flags default to `false` for MVP safety
- **Feature Flag Metadata**: Metadata for admin UI including descriptions, categories, dependencies, and impact levels

### 2. Context & Hook (`contexts/FeatureFlagsContext.tsx`)

- **FeatureFlagsProvider**: React context provider that loads flags from Firestore
- **Real-time Updates**: Subscribes to Firestore changes for instant updates
- **Error Handling**: Falls back to default flags on error
- **useFeatureFlags Hook**: Convenience hook for accessing flags throughout the app

### 3. Firestore Service (`lib/feature-flags.ts`)

- **Storage**: Feature flags stored in `admin/featureFlags` document
- **CRUD Operations**: Get, update, and subscribe to feature flags
- **Auto-initialization**: Creates document with defaults if it doesn't exist
- **Real-time Subscriptions**: Supports real-time updates via Firestore listeners

### 4. Admin Dashboard Integration (`app/admin/settings.tsx`)

- **Feature Flags UI**: Comprehensive admin interface for managing flags
- **Categorized Display**: Flags grouped by category (core, subscriptions, nonprofit, etc.)
- **Dependency Warnings**: Shows when flags require other flags to be enabled
- **Impact Indicators**: Visual indicators for high-impact features
- **Save/Load**: Full integration with Firestore for persistence

### 5. Navigation Integration

- **Navigation Utils** (`lib/navigation-utils.ts`): Utility functions for filtering navigation
- **MenuPanel** (`components/MenuPanel.tsx`): Mobile menu filtered by feature flags
- **Sidebar** (`components/Sidebar.tsx`): Desktop sidebar filtered by feature flags
- **Automatic Filtering**: Navigation items automatically hidden when their feature flags are disabled

---

## Feature Flags

### Core Features
- `subscriptionBoxes` - Subscription box feature for businesses
- `giftCards` - Gift card purchases
- `events` - Event creation, ticketing, and management
- `myImpact` - MyImpact rewards program
- `university` - BDN University education features
- `media` - Media content features
- `referrals` - Referral program
- `blkdPurchases` - BLKD token bulk purchases

### Subscription Tiers
- `bdnPlus` - BDN+ consumer subscriptions
- `bdnPlusBusiness` - BDN+ Business subscriptions

### Nonprofit Features
- `campaigns` - Nonprofit fundraising campaigns

### Token & Wallet Features
- `tokens` - BDN token system and wallet
- `badges` - Achievement badges system

### Business Features
- `businessDirectory` - Business directory and search
- `search` - Platform-wide search functionality
- `reviews` - Business/product reviews and ratings

### Payment Features
- `c2bPayments` - Consumer-to-business direct payments
- `invoices` - Invoice generation and management

### Dashboard Features
- `analytics` - Analytics dashboards
- `merchantDashboard` - Merchant dashboard and management tools
- `nonprofitDashboard` - Nonprofit dashboard and management tools

### Sub-features
- `universityGuides`, `universityVideos`, `universityHelp`, `universityBlog`
- `mediaBDNTV`, `mediaChannels`
- `myImpactPoints`, `myImpactCashback`, `myImpactSponsorship`, `myImpactDonations`, `myImpactLeaderboard`
- `eventCreation`, `eventTicketing`, `eventManagement`

---

## Usage

### In Components

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

function MyComponent() {
  const { isEnabled, flags } = useFeatureFlags();
  
  if (!isEnabled('events')) {
    return null; // Hide component if events are disabled
  }
  
  return <EventsComponent />;
}
```

### In Navigation

Navigation items are automatically filtered based on feature flags. No manual filtering needed - the system handles it automatically.

### In Admin Dashboard

1. Navigate to Admin → Settings → Feature Flags
2. Toggle features on/off
3. Save changes
4. Features are immediately updated across the app

---

## Default Behavior

**All feature flags default to `false`** for MVP safety. Admin operators must explicitly enable features they want to test or make live.

---

## Dependencies

Some features require other features to be enabled:

- `badges` requires `myImpact`
- `blkdPurchases` requires `tokens`
- `events` requires `eventCreation`, `eventTicketing`, `eventManagement`
- `myImpact` requires `myImpactPoints`, `myImpactCashback`, `myImpactLeaderboard`
- `university` requires `universityGuides`, `universityVideos`, `universityHelp`, `universityBlog`
- `media` requires `mediaBDNTV`, `mediaChannels`

The admin UI shows warnings when dependencies are not met.

---

## Testing Checklist

- [ ] Feature flags load correctly on app start
- [ ] Admin can enable/disable features
- [ ] Changes persist to Firestore
- [ ] Navigation items hide/show based on flags
- [ ] Pages/components respect feature flags
- [ ] Real-time updates work when flags change
- [ ] Error handling works (falls back to defaults)
- [ ] Dependency warnings show correctly

---

## Future Enhancements

1. **User-level Feature Flags**: Allow enabling features for specific users/groups
2. **A/B Testing**: Support for percentage-based rollouts
3. **Feature Flag Analytics**: Track feature usage and adoption
4. **Feature Flag History**: Audit log of flag changes
5. **Scheduled Changes**: Schedule feature flag changes for future dates

---

## Files Created/Modified

### Created
- `types/feature-flags.ts`
- `contexts/FeatureFlagsContext.tsx`
- `lib/feature-flags.ts`
- `lib/navigation-utils.ts`
- `hooks/useFeatureFlags.ts`
- `action_plans/feature-flags-implementation.md`

### Modified
- `app/_layout.tsx` - Added FeatureFlagsProvider
- `app/admin/settings.tsx` - Integrated feature flags UI
- `components/MenuPanel.tsx` - Added feature flag filtering
- `components/Sidebar.tsx` - Added feature flag filtering

---

## References

- **Firestore Collection**: `admin/featureFlags`
- **Admin UI**: `/admin/settings` → Feature Flags tab
- **Hook**: `useFeatureFlags()` from `@/hooks/useFeatureFlags`

