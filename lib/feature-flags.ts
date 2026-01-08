/**
 * Feature Flags Service
 * 
 * Handles Firestore operations for feature flags.
 * Feature flags are stored in a single document: `admin/featureFlags`
 */

import { FeatureFlags, defaultFeatureFlags } from '@/types/feature-flags';
import { db, FIREBASE_ENABLED } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

const FEATURE_FLAGS_DOC_PATH = 'admin/featureFlags';

/**
 * Get feature flags from Firestore
 * Falls back to default flags if document doesn't exist or Firebase is not configured
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (!FIREBASE_ENABLED || !db) {
    console.warn('Firebase not configured, using default feature flags');
    return defaultFeatureFlags;
  }

  try {
    const docRef = doc(db, FEATURE_FLAGS_DOC_PATH);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Merge with defaults to ensure all flags are present
      return {
        ...defaultFeatureFlags,
        ...data,
      } as FeatureFlags;
    }

    // Document doesn't exist, create it with defaults
    await setDoc(docRef, defaultFeatureFlags);
    return defaultFeatureFlags;
  } catch (error) {
    console.error('Error getting feature flags:', error);
    // Return defaults on error
    return defaultFeatureFlags;
  }
}

/**
 * Update feature flags in Firestore
 */
export async function updateFeatureFlags(flags: Partial<FeatureFlags>): Promise<void> {
  if (!FIREBASE_ENABLED || !db) {
    console.warn('Firebase not configured, cannot update feature flags');
    return;
  }

  try {
    const docRef = doc(db, FEATURE_FLAGS_DOC_PATH);
    const currentFlags = await getFeatureFlags();
    
    // Merge with current flags
    const updatedFlags = {
      ...currentFlags,
      ...flags,
    };

    await setDoc(docRef, updatedFlags, { merge: true });
  } catch (error) {
    console.error('Error updating feature flags:', error);
    throw error;
  }
}

/**
 * Subscribe to feature flags changes in real-time
 * @param callback - Called with flags on each update
 * @param onError - Optional error callback for handling subscription errors
 */
export function subscribeToFeatureFlags(
  callback: (flags: FeatureFlags) => void,
  onError?: (error: Error) => void
): Unsubscribe | null {
  if (!FIREBASE_ENABLED || !db) {
    // Return defaults immediately if Firebase is not configured
    callback(defaultFeatureFlags);
    return null;
  }

  try {
    const docRef = doc(db, FEATURE_FLAGS_DOC_PATH);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const flags = {
            ...defaultFeatureFlags,
            ...data,
          } as FeatureFlags;
          callback(flags);
        } else {
          // Document doesn't exist, use defaults
          callback(defaultFeatureFlags);
        }
      },
      (error) => {
        console.error('Error subscribing to feature flags:', error);
        // Call error handler if provided
        if (onError) {
          onError(error);
        } else {
          // Fallback: call callback with defaults if no error handler
          callback(defaultFeatureFlags);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up feature flags subscription:', error);
    // Call error handler if provided
    if (onError && error instanceof Error) {
      onError(error);
    }
    // Return null if subscription fails
    return null;
  }
}

/**
 * Check if a specific feature flag is enabled
 */
export async function isFeatureEnabled(flag: keyof FeatureFlags): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[flag] === true;
}

