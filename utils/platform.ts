import { Platform } from "react-native";

/**
 * Platform detection utilities for cross-platform development
 * 
 * React Native Platform.OS values:
 * - "ios" - iPhone, iPad
 * - "android" - Android phones, tablets
 * - "web" - All browsers (Mac, Windows, Linux)
 * - "windows" - Windows native (rare)
 * - "macos" - macOS native (rare)
 */

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";
export const isMobile = isIOS || isAndroid;
export const isNative = isIOS || isAndroid;

/**
 * Platform-specific values using Platform.select
 * More readable and maintainable than ternary operators
 */
export const platformSelect = Platform.select;

/**
 * Common platform-specific values
 */
export const platformValues = {
  // ScrollView padding top
  scrollViewPaddingTop: Platform.select({
    web: 20,
    ios: 36,
    android: 36,
    default: 36,
  }),

  // ScrollView bounces (iOS has native bounce, Android doesn't, web doesn't support)
  scrollViewBounces: Platform.select({
    web: false,
    ios: true,
    android: false,
    default: false,
  }),

  // Touch feedback opacity
  touchOpacity: Platform.select({
    web: 0.8,
    ios: 0.7,
    android: 0.7,
    default: 0.7,
  }),

  // Hit slop for touch targets (larger on mobile for better UX)
  hitSlop: Platform.select({
    web: { top: 5, bottom: 5, left: 5, right: 5 },
    ios: { top: 10, bottom: 10, left: 10, right: 10 },
    android: { top: 10, bottom: 10, left: 10, right: 10 },
    default: { top: 10, bottom: 10, left: 10, right: 10 },
  }),

  // Font family for monospace (iOS uses Menlo, others use monospace)
  monospaceFont: Platform.select({
    ios: "Menlo",
    default: "monospace",
  }),
};

