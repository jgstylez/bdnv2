# Microsoft Clarity Integration Plan

## Overview

Microsoft Clarity provides session recordings, heatmaps, and user behavior analytics. This plan integrates Clarity for both web (via script injection) and native mobile (via React Native SDK), following existing platform detection and configuration patterns.

## Architecture

The integration uses a unified service layer (`lib/clarity.ts`) that:

- Detects platform (web vs native)
- Initializes appropriate Clarity implementation
- Respects feature flags and environment configuration
- Handles privacy/compliance requirements

## Implementation Steps

### 1. Install Dependencies

**Native Mobile SDK:**

```bash
npm install @microsoft/react-native-clarity
```

**Note:** For iOS, run `cd ios && pod install` after installation.

**Web:** No additional package needed - uses script injection.

### 2. Configuration Setup

**Update `lib/config.ts`:**

- Add `EXPO_PUBLIC_CLARITY_PROJECT_ID` environment variable
- Add `EXPO_PUBLIC_CLARITY_ENABLED` feature flag (default: false)
- Add Clarity config to exported config object

**Environment Variables:**

- `EXPO_PUBLIC_CLARITY_PROJECT_ID`: Microsoft Clarity project ID (get from Clarity dashboard)
- `EXPO_PUBLIC_CLARITY_ENABLED`: Enable/disable Clarity (set to 'true' for production)

### 3. Create Clarity Service (`lib/clarity.ts`)

Create a unified Clarity service that:

- Exports `initializeClarity()` function
- Handles web initialization (script injection)
- Handles native initialization (SDK setup)
- Includes error handling and platform detection
- Respects feature flags and environment checks
- Provides helper functions for custom events and user identification

**Key Functions:**

- `initializeClarity()`: Main initialization function
- `identifyUser(userId: string)`: Identify users for session tracking
- `trackEvent(eventName: string, properties?: object)`: Track custom events
- `pauseRecording()`: Pause session recording (privacy)
- `resumeRecording()`: Resume session recording

### 4. Web Implementation

**Script Injection Pattern:**

- Create `components/ClarityScript.tsx` component (web-only)
- Inject Clarity script into document head (similar to `SEOHead` pattern)
- Use `useEffect` with platform check (`Platform.OS === 'web'`)
- Ensure script loads only once (check for existing script)
- Use unique script ID to avoid conflicts

**Implementation Location:** `components/ClarityScript.tsx`

### 5. Native Mobile Implementation

**SDK Integration:**

- Import `@microsoft/react-native-clarity` in `lib/clarity.ts`
- Initialize Clarity SDK in native initialization function
- Handle iOS and Android platform differences
- Ensure initialization happens early in app lifecycle

**Important:** Clarity SDK requires EAS Build (not Expo Go). Document this requirement.

### 6. Root Layout Integration

**Update `app/_layout.tsx`:**

- Import and render `ClarityScript` component (web only)
- Call `initializeClarity()` in `useEffect` for native platforms
- Place initialization after providers but before main content
- Wrap in feature flag check

### 7. Privacy & Compliance

**GDPR/CCPA Compliance:**

- Respect user consent preferences
- Provide pause/resume functionality
- Document data collection in privacy policy
- Add opt-out mechanism if required

**Implementation:**

- Check for user consent before initializing
- Store consent preference in secure storage
- Provide settings UI to control Clarity tracking

### 8. User Identification

**Integration Points:**

- Call `identifyUser()` after successful authentication
- Pass user ID from `AuthContext` when user logs in
- Clear identification on logout

**Update `contexts/AuthContext.tsx`:**

- Add Clarity user identification on login
- Clear identification on logout

### 9. Custom Event Tracking

**Key Events to Track:**

- Page views (automatic on web, manual on native)
- User actions (button clicks, form submissions)
- Conversion events (signups, purchases)
- Error events (for debugging)

**Create `hooks/useClarityTracking.ts`:**

- Custom hook for easy event tracking
- Provides `trackEvent()` function
- Handles platform differences automatically

### 10. Testing Strategy

**Web Testing:**

- Test script injection in browser dev tools
- Verify Clarity dashboard receives data
- Test on production domain (respects existing domain checks)

**Native Testing:**

- Test on physical devices (SDK doesn't work in Expo Go)
- Use EAS Build for testing
- Verify session recordings appear in dashboard
- Test on both iOS and Android

**Development vs Production:**

- Disable Clarity in development by default
- Enable via environment variable for production
- Use feature flag to toggle without rebuild

## File Structure

```
lib/
  └── clarity.ts              # Unified Clarity service
components/
  └── ClarityScript.tsx       # Web script injection component
hooks/
  └── useClarityTracking.ts   # Custom hook for event tracking
app/
  └── _layout.tsx             # Root layout (integration point)
contexts/
  └── AuthContext.tsx         # User identification integration
```

## Configuration Files

**Update:**

- `lib/config.ts` - Add Clarity configuration
- `app.json` - No changes needed
- `.env.example` - Document new environment variables

## Documentation

**Create `action_plans/clarity-integration.md`:**

- Setup instructions
- Environment variable documentation
- Testing guide
- Privacy compliance notes
- Troubleshooting guide

## Considerations

**Platform Limitations:**

- Native SDK requires EAS Build (not Expo Go)
- Web script must load in production environment
- Both implementations need internet connection

**Performance:**

- Script injection is lightweight (async loading)
- Native SDK has minimal performance impact
- Both respect user's network conditions

**Privacy:**

- Clarity is GDPR/CCPA compliant
- Provides pause/resume functionality
- Respects user consent preferences
- Document in privacy policy

## Rollout Strategy

1. **Phase 1:** Install dependencies and create service layer
2. **Phase 2:** Implement web integration and test
3. **Phase 3:** Implement native integration and test
4. **Phase 4:** Add user identification and custom events
5. **Phase 5:** Enable in production with feature flag
6. **Phase 6:** Monitor and optimize

## Success Criteria

- Clarity dashboard shows web sessions
- Clarity dashboard shows mobile sessions (iOS & Android)
- User identification works correctly
- Custom events are tracked
- Privacy controls function properly
- No performance degradation
- Feature flag controls work as expected

## Implementation Checklist

- [ ] Install `@microsoft/react-native-clarity` package and run pod install for iOS
- [ ] Add Clarity configuration to `lib/config.ts` with environment variables and feature flags
- [ ] Create `lib/clarity.ts` with unified service for web and native initialization
- [ ] Create `components/ClarityScript.tsx` for web script injection
- [ ] Integrate Clarity initialization in `app/_layout.tsx` for both platforms
- [ ] Add user identification to `AuthContext` for tracking authenticated users
- [ ] Create `hooks/useClarityTracking.ts` for easy event tracking
- [ ] Implement privacy controls (pause/resume) and consent management
- [ ] Create documentation with setup and troubleshooting guide
- [ ] Test web and native implementations, verify data appears in Clarity dashboard
