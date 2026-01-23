import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";
import { usePathname } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';

const DEVELOPER_URL = "https://developer.blackdollarnetwork.com";
const MAIN_DOMAIN = "https://blackdollarnetwork.com";

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
 * - Developer subdomain: Redirects to blackdollarnetwork.com/developer
 * - Sandbox/Other domains with /developer: Redirects to blackdollarnetwork.com/developer
 * - Main domain with /developer: Shows developer dashboard (no redirect)
 */
export function DeveloperRedirect({ children }: DeveloperRedirectProps) {
  const pathname = usePathname();
  
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
    // On main domain /developer path, show content. Otherwise redirect.
    const isOnMainDomainPath = hostname === 'blackdollarnetwork.com' || hostname === 'www.blackdollarnetwork.com' || hostname.includes('sandbox.blackdollarnetwork.com');
    
    return {
      shouldShowContent: isLocal || (isOnMainDomainPath && window.location.pathname.startsWith('/developer')),
      shouldRedirect: !isLocal && (isDeveloper || !isOnMainDomainPath || !window.location.pathname.startsWith('/developer')),
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

      // Case 1: Already on developer subdomain - redirect to main domain path
      if (isDeveloperSubdomain()) {
        setIsRedirecting(true);
        setShouldRedirect(true);
        setShouldShowContent(false);
        try {
          if (__DEV__) {
            console.log('[DeveloperRedirect] Redirecting from developer subdomain to main domain');
          }
          window.location.href = `${MAIN_DOMAIN}/developer${window.location.pathname === '/' ? '' : window.location.pathname}${window.location.search}`;
        } catch (error) {
          console.error('Failed to redirect:', error);
          setIsRedirecting(false);
          setShouldShowContent(true); // Fallback to showing content on error
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

      // Case 3: On sandbox or any other domain with /developer path - redirect to main domain /developer path
      // Only redirect if we're actually on the /developer route
      if (pathname?.startsWith('/developer')) {
        setIsRedirecting(true);
        setShouldRedirect(true);
        setShouldShowContent(false);
        
        try {
          if (__DEV__) {
            console.log('[DeveloperRedirect] Redirecting from', hostname, 'to', `${MAIN_DOMAIN}/developer`);
          }
          const remainingPath = pathname === '/developer' ? '' : pathname.replace('/developer', '');
          window.location.href = `${MAIN_DOMAIN}/developer${remainingPath}${window.location.search}`;
        } catch (error) {
          console.error('Failed to redirect to developer site:', error);
          setIsRedirecting(false);
          setShouldShowContent(true); // Fallback to showing content on error
        }
        return;
      }
      
      // Not on /developer path, show content (or let app handle routing)
      setShouldShowContent(true);
      setShouldRedirect(false);
      setIsRedirecting(false);
    };

    checkAndRedirect();
  }, [pathname]);

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
