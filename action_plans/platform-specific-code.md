# Platform-Specific Code Guide

## Overview

This guide explains how to handle platform-specific code for iOS, Android, and Web in BDN 2.0.

## Platform Detection

React Native's `Platform.OS` returns:
- **"ios"** - iPhone, iPad (all iOS devices)
- **"android"** - Android phones, tablets (all Android devices)
- **"web"** - All browsers (Mac, Windows, Linux, Chrome, Safari, Firefox, etc.)
- **"windows"** - Windows native (rare, usually use web)
- **"macos"** - macOS native (rare, usually use web)

## Key Differences

### iOS vs Android vs Web

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| **Scroll Bounce** | ✅ Native bounce | ❌ No bounce | ❌ Not supported |
| **Nested Scrolling** | ✅ Works by default | ⚠️ Needs `nestedScrollEnabled` | ✅ Works by default |
| **Safe Area Insets** | ⚠️ Notch/status bar | ⚠️ Status bar only | ❌ Not applicable |
| **Touch Feedback** | ✅ Haptic feedback | ✅ Ripple effect | ⚠️ CSS hover |
| **Font Rendering** | Menlo for monospace | monospace | monospace |
| **Keyboard Behavior** | Slides up content | Resizes viewport | Varies by browser |

## Best Practices

### ✅ DO: Use Platform Utilities

```tsx
import { platformValues, isIOS, isAndroid, isWeb } from "../../../utils/platform";

// Use platform-specific values
<ScrollView
  bounces={platformValues.scrollViewBounces}
  nestedScrollEnabled={isAndroid}
  contentContainerStyle={{
    paddingTop: platformValues.scrollViewPaddingTop,
  }}
/>

// Use platform-specific touch feedback
<TouchableOpacity
  activeOpacity={platformValues.touchOpacity}
  hitSlop={platformValues.hitSlop}
/>
```

### ✅ DO: Use Platform.select() for Complex Cases

```tsx
import { Platform } from "react-native";

const styles = Platform.select({
  ios: { paddingTop: 44 }, // Account for notch
  android: { paddingTop: 24 }, // Account for status bar
  web: { paddingTop: 0 },
  default: { paddingTop: 24 },
});
```

### ✅ DO: Group iOS + Android When Behavior is Same

```tsx
// When iOS and Android behave the same, group them
const paddingTop = Platform.OS === "web" ? 20 : 36;

// Or use the utility
const paddingTop = platformValues.scrollViewPaddingTop;
```

### ❌ DON'T: Assume iOS = Android

```tsx
// ❌ Bad - Android doesn't have bounce by default
<ScrollView bounces={true} />

// ✅ Good - Explicit platform handling
<ScrollView bounces={platformValues.scrollViewBounces} />
```

### ❌ DON'T: Hardcode Platform Checks Everywhere

```tsx
// ❌ Bad - Repeated platform checks
paddingTop: Platform.OS === "web" ? 20 : 36
paddingTop: Platform.OS === "web" ? 20 : 36
paddingTop: Platform.OS === "web" ? 20 : 36

// ✅ Good - Use utility
paddingTop: platformValues.scrollViewPaddingTop
```

## Common Patterns

### 1. ScrollView Configuration

```tsx
<ScrollView
  scrollEventThrottle={16}
  showsVerticalScrollIndicator={false}
  nestedScrollEnabled={isAndroid} // Only needed on Android
  bounces={platformValues.scrollViewBounces} // iOS only
  contentContainerStyle={{
    paddingTop: platformValues.scrollViewPaddingTop,
  }}
>
```

### 2. TouchableOpacity Configuration

```tsx
<TouchableOpacity
  onPress={handlePress}
  activeOpacity={platformValues.touchOpacity}
  hitSlop={platformValues.hitSlop}
>
```

### 3. Safe Area Handling

```tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();
// iOS: insets.top includes notch (44px on iPhone X+)
// Android: insets.top is status bar height (24-48px)
// Web: insets.top is 0
```

### 4. Font Family

```tsx
// Use platform-specific monospace font
<Text style={{ fontFamily: platformValues.monospaceFont }}>
  Code snippet
</Text>
```

## When to Use Platform-Specific Code

### Use iOS-Specific Code When:
- ✅ You need iOS-specific features (HapticFeedback, etc.)
- ✅ You need to handle notch/safe areas differently
- ✅ You need iOS-specific UI patterns (pull-to-refresh, etc.)

### Use Android-Specific Code When:
- ✅ You need Android-specific features (Vibration, etc.)
- ✅ You need to handle system UI differently
- ✅ You need Android-specific UI patterns (Material Design, etc.)

### Use Web-Specific Code When:
- ✅ You need browser-specific features (localStorage, etc.)
- ✅ You need to handle window resizing
- ✅ You need web-specific optimizations (lazy loading, etc.)

### Group iOS + Android When:
- ✅ Behavior is identical (most common case)
- ✅ Both are mobile platforms
- ✅ Both need safe area handling

## Testing Checklist

- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] Test on web (Chrome, Safari, Firefox)
- [ ] Test on Windows PC (web browser)
- [ ] Test on Mac (web browser)
- [ ] Test safe area insets (notch on iOS)
- [ ] Test keyboard behavior
- [ ] Test touch interactions
- [ ] Test scroll performance
- [ ] Test nested ScrollViews

## Migration Guide

### Before (Inconsistent)

```tsx
<ScrollView
  bounces={Platform.OS !== "web"}
  contentContainerStyle={{
    paddingTop: Platform.OS === "web" ? 20 : 36,
  }}
>
```

### After (Consistent)

```tsx
import { platformValues } from "../../../utils/platform";

<ScrollView
  bounces={platformValues.scrollViewBounces}
  nestedScrollEnabled={isAndroid}
  contentContainerStyle={{
    paddingTop: platformValues.scrollViewPaddingTop,
  }}
>
```

## Files Updated

- ✅ `app/pages/merchant/settings.tsx` - Updated to use platform utilities
- ✅ `utils/platform.ts` - Created platform utility functions

## Files That Need Updates

All files using `Platform.OS` checks should migrate to use `utils/platform.ts`:
- `app/pages/university/videos/[id].tsx`
- `app/pages/university/videos.tsx`
- `app/pages/university/blog.tsx`
- `app/pages/merchant/analytics.tsx`
- `app/pages/university/blog/[id].tsx`
- `app/pages/university/guides/[id].tsx`
- `app/pages/university/index.tsx`
- `app/pages/university/guides.tsx`
- `app/pages/products/create.tsx`

## Resources

- [React Native Platform API](https://reactnative.dev/docs/platform-specific-code)
- [Expo Platform Detection](https://docs.expo.dev/versions/latest/sdk/device/)
- [Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)

