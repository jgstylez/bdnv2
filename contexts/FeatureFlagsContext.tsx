/**
 * Feature Flags Context
 * 
 * Provides feature flags throughout the application.
 * Flags are loaded from Firestore and cached for performance.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { FeatureFlags, defaultFeatureFlags } from '@/types/feature-flags';
import { getFeatureFlags, subscribeToFeatureFlags } from '@/lib/feature-flags';

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isEnabled: (flag: keyof FeatureFlags) => boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

interface FeatureFlagsProviderProps {
  children: ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Subscribe to real-time updates - onSnapshot fires immediately with current data
    // so we don't need a separate initial load
    const unsubscribe = subscribeToFeatureFlags(
      (updatedFlags) => {
        setFlags(updatedFlags);
        // Only clear loading on first successful load
        if (!initializedRef.current) {
          initializedRef.current = true;
          setLoading(false);
          setError(null);
        }
      },
      (subscriptionError) => {
        // Handle subscription errors
        console.error('Feature flags subscription error:', subscriptionError);
        if (!initializedRef.current) {
          initializedRef.current = true;
          setError(subscriptionError instanceof Error ? subscriptionError.message : 'Failed to load feature flags');
          setFlags(defaultFeatureFlags);
          setLoading(false);
        }
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedFlags = await getFeatureFlags();
      setFlags(loadedFlags);
    } catch (err) {
      console.error('Failed to refresh feature flags:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh feature flags');
    } finally {
      setLoading(false);
    }
  }, []);

  const isEnabled = (flag: keyof FeatureFlags): boolean => {
    return flags[flag] === true;
  };

  return (
    <FeatureFlagsContext.Provider
      value={{
        flags,
        loading,
        error,
        refresh,
        isEnabled,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagsContextType {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}

