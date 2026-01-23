import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";
import { colors, spacing, typography } from '@/constants/theme';

const DEVELOPER_URL = "https://developer.blackdollarnetwork.com";

/**
 * Checks if we're currently on the developer subdomain
 */
function isDeveloperSubdomain(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  return hostname === 'developer.blackdollarnetwork.com' || hostname.startsWith('developer.');
}

/**
 * Checks if we're on localhost (development environment)
 * Also checks for developer.localhost to simulate subdomain behavior
 */
function isLocalhost(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  // Check for localhost, 127.0.0.1, or developer.localhost (simulating subdomain)
  return (
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('localhost:') ||
    hostname === 'developer.localhost' ||
    hostname.startsWith('developer.localhost:')
  );
}

interface DeveloperRedirectProps {
  children: React.ReactNode;
}

/**
 * DeveloperRedirect component that handles context-aware redirects for /developer route
 * - Localhost: Shows developer dashboard locally (no redirect)
 * - Developer subdomain: Shows developer dashboard (no redirect)
 * - Sandbox/Other domains: Redirects to developer.blackdollarnetwork.com
 */
export function DeveloperRedirect({ children }: DeveloperRedirectProps) {
  // Initialize shouldShowContent based on synchronous check to avoid flash
  const getInitialState = () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
      return { shouldShowContent: false, shouldRedirect: false, isRedirecting: false };
    }
    
    const hostname = window.location.hostname.toLowerCase();
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.startsWith('localhost:') ||
                    hostname === 'developer.localhost' ||
                    hostname.startsWith('developer.localhost:');
    const isDeveloper = hostname === 'developer.blackdollarnetwork.com' || hostname.startsWith('developer.');
    
    return {
      shouldShowContent: isLocal || isDeveloper,
      shouldRedirect: !isLocal && !isDeveloper,
      isRedirecting: false,
    };
  };

  const initialState = getInitialState();
  const [shouldRedirect, setShouldRedirect] = useState(initialState.shouldRedirect);
  const [isRedirecting, setIsRedirecting] = useState(initialState.isRedirecting);
  const [shouldShowContent, setShouldShowContent] = useState(initialState.shouldShowContent);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // On native platforms, always redirect to external URL
      if (Platform.OS !== 'web') {
        setIsRedirecting(true);
        try {
          const canOpen = await Linking.canOpenURL(DEVELOPER_URL);
          if (canOpen) {
            await Linking.openURL(DEVELOPER_URL);
          }
        } catch (error) {
          console.error('Failed to redirect to developer site:', error);
          setIsRedirecting(false);
        }
        return;
      }

      // Web platform logic
      if (typeof window === 'undefined' || !window.location) {
        return;
      }

      const hostname = window.location.hostname.toLowerCase();

      // Case 1: Already on developer subdomain - don't redirect, show content
      if (isDeveloperSubdomain()) {
        setShouldRedirect(false);
        setIsRedirecting(false);
        setShouldShowContent(true);
        if (__DEV__) {
          console.log('[DeveloperRedirect] Already on developer subdomain, no redirect needed');
        }
        return;
      }

      // Case 2: On localhost (including developer.localhost) - don't redirect, show content
      if (isLocalhost()) {
        setShouldRedirect(false);
        setIsRedirecting(false);
        setShouldShowContent(true);
        if (__DEV__) {
          console.log('[DeveloperRedirect] On localhost, keeping local');
        }
        return;
      }

      // Case 3: On sandbox or any other domain - redirect to developer.blackdollarnetwork.com
      setIsRedirecting(true);
      setShouldRedirect(true);
      setShouldShowContent(false);
      
      try {
        if (__DEV__) {
          console.log('[DeveloperRedirect] Redirecting from', hostname, 'to', DEVELOPER_URL);
        }
        window.location.href = DEVELOPER_URL;
      } catch (error) {
        console.error('Failed to redirect to developer site:', error);
        setIsRedirecting(false);
        setShouldShowContent(true); // Fallback to showing content on error
      }
    };

    checkAndRedirect();
  }, []);

  // If we're on developer subdomain or localhost, show the developer dashboard
  if (shouldShowContent && !shouldRedirect && !isRedirecting) {
    return <>{children}</>;
  }

  // Show loading state while redirecting
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar style="light" />
      <ActivityIndicator size="large" color={colors.accent} />
      <Text
        style={{
          marginTop: spacing.lg,
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
        }}
      >
        Redirecting to developer portal...
      </Text>
    </View>
  );
}
