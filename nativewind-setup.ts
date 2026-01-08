/**
 * NativeWind Dark Mode Setup
 * This file configures NativeWind to use class-based dark mode
 * Must run BEFORE react-native-css-interop modules initialize
 */

import { Platform } from "react-native";

// Execute immediately when module loads (before React)
if (Platform.OS === "web" && typeof window !== "undefined" && typeof document !== "undefined") {
  // 1. Add dark class to HTML element immediately
  document.documentElement.classList.add("dark");
  
  // 2. Patch colorScheme.set to handle the error gracefully
  // This prevents the error from breaking the app while we set the flag
  try {
    const colorSchemeModule = require("react-native-css-interop/dist/runtime/web/color-scheme");
    if (colorSchemeModule?.colorScheme) {
      const originalSet = colorSchemeModule.colorScheme.set;
      colorSchemeModule.colorScheme.set = function(value: any) {
        try {
          // Try to set the flag first
          const styleSheetModule = require("react-native-css-interop/dist/runtime/web/style-sheet");
          if (styleSheetModule?.StyleSheet?.setFlag) {
            styleSheetModule.StyleSheet.setFlag("darkMode", "class");
          }
          // Now call original set
          return originalSet.call(this, value);
        } catch (e) {
          // If flag setting failed, try to set it and retry
          try {
            const styleSheetModule = require("react-native-css-interop/dist/runtime/web/style-sheet");
            if (styleSheetModule?.StyleSheet?.setFlag) {
              styleSheetModule.StyleSheet.setFlag("darkMode", "class");
              return originalSet.call(this, value);
            }
          } catch (err) {
            // Silently fail - app will still work
          }
          // If all else fails, just call original (might throw, but that's okay)
          return originalSet.call(this, value);
        }
      };
    }
  } catch (e) {
    // Module not loaded yet - that's okay
  }
  
  // 3. Set the flag directly (try multiple times)
  const setFlag = () => {
    try {
      const styleSheetModule = require("react-native-css-interop/dist/runtime/web/style-sheet");
      if (styleSheetModule?.StyleSheet?.setFlag) {
        styleSheetModule.StyleSheet.setFlag("darkMode", "class");
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };
  
  // Try immediately
  if (!setFlag()) {
    // Try after microtask
    Promise.resolve().then(setFlag);
    // Try after delays
    setTimeout(setFlag, 0);
    setTimeout(setFlag, 10);
    setTimeout(setFlag, 50);
  }
}

// React hook for additional setup after mount
export function useDarkModeSetup() {
  // This runs after React mounts, ensuring flag is set
  if (Platform.OS === "web" && typeof window !== "undefined") {
    try {
      const styleSheetModule = require("react-native-css-interop/dist/runtime/web/style-sheet");
      if (styleSheetModule?.StyleSheet?.setFlag) {
        styleSheetModule.StyleSheet.setFlag("darkMode", "class");
      }
    } catch (e) {
      // Ignore
    }
  }
}
