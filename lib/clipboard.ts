import { Platform } from 'react-native';
import { logError } from './logger';

// Try to import Clipboard - it may not be available in all React Native versions
let RNClipboard: any = null;
try {
  // React Native 0.81.5 and earlier had Clipboard as a separate import
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RNClipboard = require('react-native').Clipboard;
} catch (e) {
  // Clipboard not available, will use web-only implementation
}

/**
 * Copy text to clipboard
 * Works on web (using Clipboard API) and native (using React Native Clipboard if available)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      // Use modern Clipboard API for web
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback for older browsers
      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          return successful;
        } catch (err) {
          document.body.removeChild(textarea);
          return false;
        }
      }
      
      return false;
    }

    // Native platforms (iOS/Android)
    // React Native's Clipboard API was available in RN 0.81.5 and earlier
    if (RNClipboard && typeof RNClipboard.setString === 'function') {
      RNClipboard.setString(text);
      return true;
    }

    // If Clipboard API is not available, log a warning
    logError('Clipboard API not available on native platform', new Error('Clipboard not found'), { platform: Platform.OS });
    return false;
  } catch (error) {
    logError('Error copying to clipboard', error, { textLength: text.length });
    return false;
  }
}
