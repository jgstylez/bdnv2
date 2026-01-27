# Expo Setup & Configuration - Consolidated Plan

**Date:** 2026-01-27  
**Status:** 📋 **Consolidated Planning Document**  
**Purpose:** Unified Expo setup plan consolidating all Expo-related documentation and ensuring alignment with Expo SDK 54 and current best practices

---

## Executive Summary

This document consolidates all Expo-related planning documents and ensures cohesive setup planning with Expo SDK 54 and other technologies. It resolves conflicts, identifies gaps, and provides a unified strategy for:

- **Expo Configuration** (app.json, eas.json)
- **Environment Variables** (EXPO_PUBLIC_* convention)
- **EAS Build** (development, preview, production profiles)
- **EAS Updates** (OTA updates)
- **Push Notifications** (APNs, FCM)
- **Error Tracking** (Sentry integration)
- **App Store Deployment** (iOS, Android)
- **Infrastructure Alignment** (EAS Build vs Docker/Cloud Run)

---

## Current State Assessment

### ✅ What's Already Configured

1. **Expo SDK 54** - Latest version installed (`package.json`)
2. **EAS Project** - Project ID configured in `app.json` (`5dec71d3-e780-438e-97a4-b749b0c72c0e`)
3. **eas.json** - Build profiles configured (development, preview, production)
4. **app.json** - Basic configuration exists with:
   - Bundle identifiers (iOS: `com.blackdollarnetwork.mobile`, Android: `com.blackdollarnetwork.mobile`)
   - Version management (version: `3.19.0`, buildNumber: `223`)
   - Updates enabled (`updates.enabled: true`)
   - Deep linking scheme (`bdn`)
5. **Expo Router** - File-based routing configured
6. **Expo Image** - Migration guide exists, some components migrated
7. **NativeCN** - UI component library set up

### ⚠️ What Needs Updates

1. **Environment Variables** - Mixed usage (some use `EXPO_PUBLIC_*`, some use `Constants.expoConfig.extra`)
2. **Push Notifications** - Mock implementation exists, needs real configuration
3. **Error Tracking** - Not configured (Sentry mentioned but not set up)
4. **EAS Updates** - Enabled but runtime version policy not configured
5. **Build Configuration** - `eas.json` exists but needs enhancement
6. **Infrastructure Docs** - Docker/Cloud Run docs don't mention EAS Build for mobile

---

## Consolidated Expo Configuration

### 1. Environment Variables Strategy

**Current State:** Mixed implementation
- `lib/firebase.ts` - Uses helper function supporting both `EXPO_PUBLIC_*` and `Constants.expoConfig.extra`
- `lib/config.ts` - Uses `Constants.expoConfig.extra` with fallback to `process.env`
- Some files use direct `process.env.EXPO_PUBLIC_*` access

**Standardized Approach:**

#### For Client-Side Variables (JavaScript Bundle)

**Use `EXPO_PUBLIC_*` prefix exclusively:**

```typescript
// ✅ Correct - Will be inlined at build time
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// ❌ Wrong - Won't be inlined
const apiUrl = process.env["EXPO_PUBLIC_API_URL"];
const { EXPO_PUBLIC_API_URL } = process.env;
```

**Environment Files:**

```bash
# .env (committed, default values)
EXPO_PUBLIC_API_URL=https://api-sandbox.blackdollarnetwork.com
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# .env.local (gitignored, local overrides)
EXPO_PUBLIC_API_URL=http://localhost:8080
EXPO_PUBLIC_ENVIRONMENT=development
```

**EAS Secrets (for sensitive/production values):**

```bash
# Set secrets via EAS CLI
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value your-key
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://api.blackdollarnetwork.com
```

**Migration Steps:**

1. [ ] Update `lib/config.ts` to use `process.env.EXPO_PUBLIC_*` directly
2. [ ] Update `lib/firebase.ts` to use `process.env.EXPO_PUBLIC_*` directly
3. [ ] Create `.env.example` template
4. [ ] Document all environment variables
5. [ ] Set up EAS Secrets for production

---

### 2. EAS Build Configuration

**Current State:** `eas.json` exists with basic profiles

**Enhanced Configuration:**

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      },
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "sandbox"
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "${APPLE_ID}",
        "ascAppId": "${APP_STORE_CONNECT_APP_ID}",
        "appleTeamId": "${APPLE_TEAM_ID}"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

**Action Items:**

- [x] `eas.json` exists (basic configuration)
- [ ] Add environment-specific env vars to build profiles
- [ ] Configure app signing credentials
- [ ] Set up EAS Secrets for build-time secrets
- [ ] Document build process

---

### 3. app.json Configuration

**Current State:** Basic configuration exists

**Recommended Enhancements:**

```json
{
  "expo": {
    "name": "BDN | Black Dollar Network® | Educate. Equip. Empower®",
    "slug": "bdn",
    "version": "3.19.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#232323"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.blackdollarnetwork.mobile",
      "buildNumber": "223",
      "infoPlist": {
        "NSUserTrackingUsageDescription": "We use tracking to improve your experience and provide personalized content.",
        "NSCameraUsageDescription": "We need access to your camera to scan QR codes and upload business documents.",
        "NSPhotoLibraryUsageDescription": "We need access to your photo library to upload business documents and profile pictures."
      },
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#232323"
      },
      "package": "com.blackdollarnetwork.mobile",
      "versionCode": 223,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash.png",
          "imageWidth": 2000,
          "resizeMode": "contain",
          "backgroundColor": "#232323"
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ba9988",
          "sounds": []
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "13.4"
          },
          "android": {
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "minSdkVersion": 23
          }
        }
      ]
    ],
    "scheme": "bdn",
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/5dec71d3-e780-438e-97a4-b749b0c72c0e"
    },
    "runtimeVersion": {
      "policy": "nativeVersion"
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "5dec71d3-e780-438e-97a4-b749b0c72c0e"
      }
    }
  }
}
```

**Key Changes:**

1. **Runtime Version Policy** - Set to `nativeVersion` (uses `version` + `buildNumber`/`versionCode`)
2. **Push Notifications Plugin** - Configured with app colors
3. **Build Properties Plugin** - Set minimum SDK versions
4. **iOS Info.plist** - Added usage descriptions
5. **Android Permissions** - Explicitly declared

**Action Items:**

- [ ] Add `runtimeVersion` policy
- [ ] Add `expo-notifications` plugin configuration
- [ ] Add `expo-build-properties` plugin
- [ ] Add iOS usage descriptions
- [ ] Add Android permissions
- [ ] Verify all asset paths exist

---

### 4. Expo Updates (OTA Updates)

**Current State:** Updates enabled but runtime version policy not configured

**Configuration:**

```json
{
  "updates": {
    "enabled": true,
    "checkAutomatically": "ON_LOAD",
    "fallbackToCacheTimeout": 0,
    "url": "https://u.expo.dev/5dec71d3-e780-438e-97a4-b749b0c72c0e"
  },
  "runtimeVersion": {
    "policy": "nativeVersion"
  }
}
```

**Runtime Version Policy Options:**

- `nativeVersion` (Recommended) - Uses `version` + `buildNumber`/`versionCode`
  - Good for: App store submissions, TestFlight, Internal Testing
  - Ensures compatibility with native code changes
  
- `appVersion` - Uses only `version` field
  - Good for: Public releases with same native code
  
- `fingerprint` - Auto-calculated from native dependencies
  - Good for: Automatic versioning

**Update Channels:**

```bash
# Publish to production channel
eas update --branch production --message "Bug fixes"

# Publish to preview channel
eas update --branch preview --message "New features"

# Publish to development channel
eas update --branch development --message "Dev updates"
```

**Action Items:**

- [ ] Configure `runtimeVersion` policy in `app.json`
- [ ] Set up update channels (production, preview, development)
- [ ] Implement update checking logic in app
- [ ] Test OTA update flow
- [ ] Document update publishing process

---

### 5. Push Notifications

**Current State:** Mock implementation exists (`lib/notifications.ts`)

**Configuration Steps:**

1. **Add Notification Plugin to app.json** (see app.json section above)

2. **Configure APNs (iOS):**
   ```bash
   # Generate APNs key in Apple Developer Portal
   # Upload to EAS
   eas credentials
   ```

3. **Configure FCM (Android):**
   ```bash
   # Generate FCM server key
   # Add to EAS Secrets
   eas secret:create --scope project --name FCM_SERVER_KEY --value your-key
   ```

4. **Implement Push Token Registration:**
   ```typescript
   import * as Notifications from 'expo-notifications';
   import Constants from 'expo-constants';

   async function registerForPushNotifications() {
     const { status: existingStatus } = await Notifications.getPermissionsAsync();
     let finalStatus = existingStatus;
     
     if (existingStatus !== 'granted') {
       const { status } = await Notifications.requestPermissionsAsync();
       finalStatus = status;
     }
     
     if (finalStatus !== 'granted') {
       return null;
     }
     
     const token = await Notifications.getExpoPushTokenAsync({
       projectId: Constants.expoConfig?.extra?.eas?.projectId,
     });
     
     // Send token to backend
     await registerPushToken(token.data);
     
     return token.data;
   }
   ```

**Action Items:**

- [ ] Configure `expo-notifications` plugin in `app.json`
- [ ] Set up APNs certificates (iOS)
- [ ] Configure FCM (Android)
- [ ] Implement push token registration
- [ ] Create backend endpoint for token registration
- [ ] Test notifications on physical devices

---

### 6. Error Tracking (Sentry)

**Current State:** Not configured

**Setup:**

```bash
# Install Sentry
npx expo install @sentry/react-native

# Initialize Sentry
npx @sentry/wizard -i reactNative -p ios android
```

**Configuration:**

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  enableInExpoDevelopment: false,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

**Action Items:**

- [ ] Install Sentry SDK
- [ ] Configure Sentry DSN
- [ ] Set up error boundaries
- [ ] Configure release tracking
- [ ] Test error reporting

---

### 7. Infrastructure Alignment

**Conflict Resolution:** Infrastructure deployment strategy focuses on Docker/Cloud Run for backend, but doesn't mention EAS Build for mobile apps.

**Clarification:**

- **Backend API** → Docker/Cloud Run (as documented in `infrastructure-deployment-strategy.md`)
- **Mobile Apps (iOS/Android)** → EAS Build (this document)
- **Web App** → Can use EAS Build or Docker/Cloud Run

**Deployment Strategy:**

```
┌─────────────────────────────────────────────────────────┐
│                    BDN 2.0 Deployment                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Mobile Apps (iOS/Android)                             │
│  └─ EAS Build (this document)                          │
│     ├─ Development builds                               │
│     ├─ Preview builds (TestFlight/Internal)            │
│     └─ Production builds (App Stores)                  │
│                                                         │
│  Backend API                                            │
│  └─ Docker/Cloud Run (infrastructure-deployment-strategy.md)│
│     ├─ Development (local Docker)                      │
│     ├─ Sandbox (Cloud Run)                             │
│     └─ Production (Cloud Run)                         │
│                                                         │
│  Web App                                                │
│  └─ EAS Build or Cloud Run                            │
│     └─ Static export via Expo                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Action Items:**

- [ ] Update `infrastructure-deployment-strategy.md` to clarify mobile vs backend deployment
- [ ] Document EAS Build workflow for mobile apps
- [ ] Document Docker/Cloud Run workflow for backend
- [ ] Create unified deployment guide

---

## Document Consolidation

### Documents to Update

1. **expo-production-insights.md**
   - ✅ Update: `eas.json` exists (not "No eas.json exists")
   - ✅ Update: Current SDK version (54, not outdated)
   - ✅ Add: Current state assessment
   - ✅ Add: Link to this consolidated plan

2. **infrastructure-deployment-strategy.md**
   - ✅ Add: Clarification about EAS Build for mobile apps
   - ✅ Add: Separation of concerns (backend vs mobile)
   - ✅ Add: Link to this consolidated plan

3. **pre-release-checklist.md**
   - ✅ Update: EAS Build setup (already configured)
   - ✅ Update: Environment variables (standardize approach)
   - ✅ Add: Link to this consolidated plan

4. **bdn-2.0-comprehensive-technical-plan.md**
   - ✅ Update: Environment variable section
   - ✅ Add: Link to this consolidated plan

### Documents to Reference

- `expo-image-migration-guide.md` - Image migration (keep as-is)
- `nativecn-setup.md` - UI component setup (keep as-is)
- `pre-release-analysis.md` - Detailed pre-release analysis (keep as-is)

---

## Implementation Checklist

### Phase 1: Environment Variables (Week 1)

- [ ] Standardize all env vars to use `EXPO_PUBLIC_*` prefix
- [ ] Update `lib/config.ts` to use `process.env.EXPO_PUBLIC_*`
- [ ] Update `lib/firebase.ts` to use `process.env.EXPO_PUBLIC_*`
- [ ] Create `.env.example` template
- [ ] Document all environment variables
- [ ] Set up EAS Secrets for production

### Phase 2: Build Configuration (Week 1)

- [ ] Enhance `eas.json` with environment-specific configs
- [ ] Configure app signing credentials
- [ ] Test development build
- [ ] Test preview build
- [ ] Document build process

### Phase 3: App Configuration (Week 2)

- [ ] Add `runtimeVersion` policy to `app.json`
- [ ] Add `expo-notifications` plugin
- [ ] Add `expo-build-properties` plugin
- [ ] Add iOS usage descriptions
- [ ] Add Android permissions
- [ ] Verify all assets exist

### Phase 4: Updates & Notifications (Week 2-3)

- [ ] Configure update channels
- [ ] Implement update checking logic
- [ ] Test OTA update flow
- [ ] Set up APNs (iOS)
- [ ] Configure FCM (Android)
- [ ] Implement push token registration
- [ ] Test notifications

### Phase 5: Error Tracking (Week 3)

- [ ] Install and configure Sentry
- [ ] Set up error boundaries
- [ ] Configure release tracking
- [ ] Test error reporting

### Phase 6: Documentation (Week 3-4)

- [ ] Update `expo-production-insights.md`
- [ ] Update `infrastructure-deployment-strategy.md`
- [ ] Update `pre-release-checklist.md`
- [ ] Create deployment runbook
- [ ] Document troubleshooting guide

---

## Expo Documentation References

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/)
- [Push Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [App Configuration](https://docs.expo.dev/versions/latest/config/app/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)

---

## Related Documents

- `action_plans/expo-production-insights.md` - Production insights (needs update)
- `action_plans/expo-image-migration-guide.md` - Image migration guide
- `action_plans/infrastructure-deployment-strategy.md` - Backend deployment (needs clarification)
- `action_plans/pre-release-checklist.md` - Pre-release checklist (needs update)
- `action_plans/bdn-2.0-comprehensive-technical-plan.md` - Master technical plan

---

## Summary

**Key Consolidations:**

1. ✅ **Environment Variables** - Standardized to `EXPO_PUBLIC_*` prefix
2. ✅ **Build Configuration** - Enhanced `eas.json` with environment-specific configs
3. ✅ **App Configuration** - Added runtime version policy, plugins, permissions
4. ✅ **Infrastructure** - Clarified separation between mobile (EAS Build) and backend (Docker/Cloud Run)
5. ✅ **Documentation** - Identified conflicts and update requirements

**Next Steps:**

1. Implement Phase 1-6 checklist items
2. Update referenced documents
3. Test all configurations
4. Document deployment process

---

**Last Updated:** 2026-01-27  
**Status:** 📋 Consolidated Plan Ready for Implementation
