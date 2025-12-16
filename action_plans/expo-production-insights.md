# Expo Production Readiness Insights

**Based on Expo SDK 54 Documentation Review**  
**Date:** 2025-01-XX

---

## Key Expo Considerations for BDN 2.0

### 1. Environment Variables & Configuration

**Current State:** Basic environment variable usage exists (`lib/elasticsearch.ts`, `lib/currency.ts`)

**Expo Requirements:**
- Use `EXPO_PUBLIC_*` prefix for client-side environment variables
- Variables are inlined at build time (cannot be dynamic)
- Use EAS Secrets for sensitive build-time configuration
- Environment variables are NOT available in test environments

**Action Items:**
- [ ] Migrate to `EXPO_PUBLIC_*` naming convention
- [ ] Set up `.env` files for local development
- [ ] Configure EAS Secrets for production builds
- [ ] Document all environment variables

**Example:**
```typescript
// ✅ Correct
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// ❌ Wrong (won't work)
const apiUrl = process.env["EXPO_PUBLIC_API_URL"];
```

---

### 2. Build Configuration (EAS Build)

**Current State:** No `eas.json` exists

**Required Setup:**
- [ ] Create `eas.json` with build profiles
- [ ] Configure iOS build settings
- [ ] Configure Android build settings
- [ ] Set up build credentials
- [ ] Configure app signing

**Key Considerations:**
- iOS APNs entitlement is always set to 'development' in debug builds
- Xcode automatically changes to 'production' in release builds
- Android requires SHA-1 certificate fingerprint for Google services
- Build properties can be customized via `expo-build-properties` plugin

**Recommended `eas.json` Structure:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

### 3. Expo Updates (OTA Updates)

**Current State:** Not configured

**Benefits:**
- Push JavaScript updates without app store review
- Faster iteration cycles
- A/B testing capabilities
- Rollback capabilities

**Configuration Required:**
- [ ] Set runtime version policy (`appVersion`, `nativeVersion`, or `fingerprint`)
- [ ] Configure update channels
- [ ] Set up update checking logic
- [ ] Test OTA update flow

**Runtime Version Policies:**
- `appVersion`: Uses `version` field from app.json (good for public releases)
- `nativeVersion`: Uses `version` + `buildNumber`/`versionCode` (good for TestFlight/Internal Testing)
- `fingerprint`: Auto-calculated (good for automatic versioning)

**Recommendation:** Use `nativeVersion` policy for BDN 2.0 to ensure compatibility with app store submissions.

---

### 4. Push Notifications

**Current State:** Mock implementation in `lib/notifications.ts`

**Expo Requirements:**
- Must configure via app.json config plugin (for EAS Build)
- APNs configuration required for iOS
- FCM configuration required for Android
- Push notification tokens require EAS project ID

**Configuration Steps:**
1. [ ] Add notification config to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ba9988",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#ba9988"
    }
  }
}
```

2. [ ] Set up APNs certificates (iOS)
3. [ ] Configure FCM (Android)
4. [ ] Implement push token registration
5. [ ] Test on physical devices (notifications don't work in simulators)

**Important Notes:**
- Push tokens default to `Constants.expoConfig.extra.eas.projectId`
- Must have EAS project configured
- Notifications require native build (won't work in Expo Go)

---

### 5. Error Handling & Crash Reporting

**Current State:** Basic logger exists, production error tracking not set up

**Expo-Compatible Solutions:**
- **Sentry** (Recommended): `@sentry/react-native`
- **Bugsnag**: `@bugsnag/expo`
- **Firebase Crashlytics**: `@react-native-firebase/crashlytics`

**Sentry Setup:**
```bash
npx expo install @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

**Considerations:**
- Error tracking requires native builds
- Source maps needed for readable stack traces
- Configure release tracking for better error grouping

---

### 6. App Configuration Best Practices

**Current `app.json` Status:** Basic configuration exists

**Required Additions:**
- [ ] Add `extra.eas.projectId` for EAS services
- [ ] Configure notification settings
- [ ] Set up deep linking properly
- [ ] Configure app store metadata
- [ ] Set up proper versioning strategy

**Recommended Additions:**
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    },
    "scheme": "bdn",
    "ios": {
      "infoPlist": {
        "NSUserTrackingUsageDescription": "We use tracking to improve your experience"
      }
    },
    "android": {
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

---

### 7. Performance Considerations

**Expo-Specific Optimizations:**

**Image Loading:**
- Use `expo-image` instead of React Native's `Image` component
- Better caching and performance
- Supports more formats

**Bundle Size:**
- Use `npx expo-doctor` to check for issues
- Review unused dependencies
- Consider code splitting for admin pages

**Hermes Engine:**
- Enabled by default in Expo SDK 51+
- Provides better performance
- No action needed (already enabled)

---

### 8. Testing in Production-Like Environment

**Important Notes from Expo Docs:**

1. **Debug vs Release Builds:**
   - Debug builds always load from dev server
   - Release builds load from published updates
   - Test updates in release builds, not debug builds

2. **Testing Updates:**
   - Use `eas update` to publish updates
   - Test in development builds first
   - Then test in release builds
   - Updates API is mostly unavailable in Expo Go

3. **Testing Notifications:**
   - Must test on physical devices
   - Simulators don't support push notifications
   - APNs requires real iOS device
   - FCM can be tested on Android emulator with Google Play Services

---

### 9. Security Best Practices

**Expo-Specific Security:**

1. **Secure Storage:**
   - Use `expo-secure-store` for tokens, PINs, sensitive data
   - Never use AsyncStorage for sensitive information
   - SecureStore uses Keychain (iOS) and Keystore (Android)

2. **Environment Variables:**
   - Never commit `.env` files
   - Use EAS Secrets for build-time secrets
   - Use `EXPO_PUBLIC_*` only for non-sensitive config

3. **Deep Linking:**
   - Validate deep link URLs
   - Don't trust URL parameters without validation
   - Use URL scheme validation

---

### 10. App Store Submission Considerations

**iOS Specific:**
- APNs entitlement automatically switches to 'production' in release builds
- App Store requires updated `buildNumber` for each submission
- TestFlight builds can use same `buildNumber` with different runtime versions

**Android Specific:**
- Google Play requires updated `versionCode` for each submission
- SHA-1 fingerprint needed for Google services (Maps, etc.)
- Play App Signing generates different SHA-1 than local builds

**Recommendation:**
- Use `autoIncrement` in `eas.json` for automatic versioning
- Use `nativeVersion` runtime version policy
- Test builds before submission

---

### 11. Metro Bundler Configuration

**Current State:** Basic `metro.config.js` exists

**Considerations:**
- Metro injects build settings as environment variables
- All variables are inlined (cannot be dynamic)
- Can disable client env vars with `EXPO_NO_CLIENT_ENV_VARS=1`

**No Action Needed:** Current configuration is sufficient

---

### 12. Web Support

**Current State:** Web bundler configured (`"bundler": "metro"`)

**Considerations:**
- Expo Router supports web out of the box
- React Native Web is already installed
- Test web build before release
- Consider web-specific optimizations

**Action Items:**
- [ ] Test web build: `npx expo start --web`
- [ ] Verify responsive design on web
- [ ] Test web-specific features (if any)

---

## Critical Expo-Specific Action Items

### Immediate (Before Backend Integration):
1. [ ] Set up EAS account and project
2. [ ] Create `eas.json` configuration
3. [ ] Configure environment variables structure
4. [ ] Set up EAS Secrets for sensitive data

### Before First Build:
1. [ ] Configure app.json with EAS project ID
2. [ ] Set up notification configuration
3. [ ] Prepare app icons and splash screens
4. [ ] Configure build profiles

### Before Production Release:
1. [ ] Set up Expo Updates
2. [ ] Configure error tracking (Sentry)
3. [ ] Test release builds on physical devices
4. [ ] Set up app store accounts
5. [ ] Prepare store assets

---

## Expo Documentation References

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/)
- [Push Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [App Configuration](https://docs.expo.dev/versions/latest/config/app/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

---

## Summary

**Key Takeaways:**
1. EAS Build is required for production (cannot use Expo Go)
2. Environment variables must use `EXPO_PUBLIC_*` prefix
3. Push notifications require native builds and proper configuration
4. Expo Updates enable OTA updates without app store review
5. Error tracking (Sentry) requires native builds
6. App store submission requires proper versioning strategy

**Next Steps:**
1. Set up EAS account and project
2. Create `eas.json` configuration
3. Configure environment variables
4. Set up error tracking
5. Prepare for app store submission

---

**Last Updated:** 2025-01-XX

