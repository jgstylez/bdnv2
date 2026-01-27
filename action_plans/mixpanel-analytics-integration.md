---
name: Mixpanel Analytics Integration
overview: Integrate Mixpanel analytics across web, Expo, and native mobile platforms with a unified service layer, automatic user identification, and easy-to-use tracking hooks.
todos:
  - id: install-mixpanel
    content: Install mixpanel-react-native package
    status: pending
  - id: create-mixpanel-service
    content: Create lib/mixpanel.ts service wrapper with platform detection
    status: pending
  - id: create-mixpanel-context
    content: Create contexts/MixpanelContext.tsx provider
    status: pending
  - id: create-mixpanel-hooks
    content: Create hooks/useMixpanel.ts and hooks/useTrackScreenView.ts
    status: pending
  - id: update-config
    content: Add EXPO_PUBLIC_MIXPANEL_TOKEN to lib/config.ts
    status: pending
  - id: update-root-layout
    content: Add MixpanelProvider to app/_layout.tsx
    status: pending
  - id: sync-user-identification
    content: Sync user identification with AuthContext in MixpanelProvider
    status: pending
  - id: add-env-docs
    content: Document EXPO_PUBLIC_MIXPANEL_TOKEN in README or env example
    status: pending
---

# Mixpanel Analytics Integration Plan

## Overview

Integrate Mixpanel analytics across all platforms (web, Expo iOS/Android, native mobile) with a unified API that respects feature flags and provides automatic user identification.

## Architecture

```
┌─────────────────────────────────────────┐
│         App Components                  │
│  (useMixpanel hook, track events)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      MixpanelProvider Context           │
│  (initialization, user sync)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      lib/mixpanel.ts Service            │
│  (platform detection, unified API)      │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────┐    ┌──────────┐
│  Web     │    │  Native  │
│  SDK     │    │  SDK     │
└──────────┘    └──────────┘
```

## Implementation Steps

### 1. Install Dependencies

Add Mixpanel React Native SDK (supports web, iOS, Android):

- `mixpanel-react-native` - Unified SDK for all platforms

### 2. Create Mixpanel Service (`lib/mixpanel.ts`)

Create a platform-agnostic wrapper that:

- Initializes Mixpanel with token from `EXPO_PUBLIC_MIXPANEL_TOKEN`
- Detects platform (web vs native) and uses appropriate initialization
- Respects `EXPO_PUBLIC_ENABLE_ANALYTICS` feature flag
- Provides unified API:
  - `track(eventName, properties)` - Track events
  - `identify(userId)` - Identify users
  - `setUserProperties(properties)` - Set user properties
  - `reset()` - Reset user identity (on logout)
  - `timeEvent(eventName)` - Start timing an event
  - `registerSuperProperties(properties)` - Set super properties

### 3. Create Mixpanel Context (`contexts/MixpanelContext.tsx`)

Create a React context provider that:

- Initializes Mixpanel on mount (if analytics enabled)
- Syncs user identification with AuthContext
- Provides `useMixpanel` hook for components
- Handles user property updates when user data changes

### 4. Update Configuration (`lib/config.ts`)

Add Mixpanel token to config:

- `EXPO_PUBLIC_MIXPANEL_TOKEN` - Mixpanel project token

### 5. Update Root Layout (`app/_layout.tsx`)

Wrap app with `MixpanelProvider`:

- Place inside `AuthProvider` to access user data
- Initialize before other providers that might track events

### 6. Create Tracking Hooks (`hooks/useMixpanel.ts`, `hooks/useTrackScreenView.ts`)

- `useMixpanel()` - Returns Mixpanel instance and helper methods
- `useTrackScreenView(screenName)` - Automatically tracks screen views using Expo Router

### 7. Environment Variables

Add to `.env` and EAS Secrets:

- `EXPO_PUBLIC_MIXPANEL_TOKEN` - Your Mixpanel project token

## Files to Create/Modify

### New Files

- `lib/mixpanel.ts` - Mixpanel service wrapper
- `contexts/MixpanelContext.tsx` - React context provider
- `hooks/useMixpanel.ts` - Hook for accessing Mixpanel
- `hooks/useTrackScreenView.ts` - Hook for automatic screen tracking

### Modified Files

- `package.json` - Add `mixpanel-react-native` dependency
- `lib/config.ts` - Add Mixpanel token configuration
- `app/_layout.tsx` - Add `MixpanelProvider`
- `contexts/AuthContext.tsx` or `hooks/useAuth.ts` - Sync user identification with Mixpanel

## Key Features

1. **Platform Detection**: Automatically uses correct SDK for web vs native
2. **Feature Flag Support**: Respects `EXPO_PUBLIC_ENABLE_ANALYTICS` flag
3. **User Identification**: Automatically identifies users when they log in
4. **Screen Tracking**: Optional automatic screen view tracking via Expo Router
5. **Type Safety**: TypeScript types for common events and properties
6. **Error Handling**: Graceful degradation if Mixpanel fails to initialize

## Usage Example

```typescript
// In any component
const { track, identify } = useMixpanel();

// Track an event
track("purchase_completed", {
  product_id: "123",
  amount: 29.99,
  currency: "USD",
});

// Screen tracking (automatic)
useTrackScreenView("Dashboard");
```

## Testing Considerations

- Test initialization with/without token
- Test feature flag disabling analytics
- Test user identification sync
- Test event tracking on web and native platforms
- Verify events appear in Mixpanel dashboard
