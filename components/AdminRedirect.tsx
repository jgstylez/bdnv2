import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";
import { usePathname } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';

const OPERATOR_URL = "https://operator.blackdollarnetwork.com";
const MAIN_DOMAIN = "https://blackdollarnetwork.com";

/**
 * Checks if we're currently on the operator subdomain
 */
function isOperatorSubdomain(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  return hostname === 'operator.blackdollarnetwork.com' || hostname.startsWith('operator.');
}

/**
 * Checks if we're on localhost (development environment)
 * Also checks for operator.localhost to simulate subdomain behavior
 */
function isLocalhost(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  // Check for localhost, 127.0.0.1, or operator.localhost (simulating subdomain)
  return (
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('localhost:') ||
    hostname === 'operator.localhost' ||
    hostname.startsWith('operator.localhost:')
  );
}

interface AdminRedirectProps {
  children: React.ReactNode;
}

/**
 * AdminRedirect component that handles context-aware redirects for /admin route
 * - Localhost: Shows admin dashboard locally (no redirect)
 * - Operator subdomain: Redirects to blackdollarnetwork.com/admin
 * - Sandbox/Other domains with /admin: Redirects to blackdollarnetwork.com/admin
 * - Main domain with /admin: Shows admin dashboard (no redirect)
 */
export function AdminRedirect({ children }: AdminRedirectProps) {
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
                    hostname === 'operator.localhost' ||
                    hostname.startsWith('operator.localhost:');
    const isOperator = hostname === 'operator.blackdollarnetwork.com' || hostname.startsWith('operator.');
    // On main domain /admin path, show content. Otherwise redirect.
    const isOnMainDomainPath = hostname === 'blackdollarnetwork.com' || hostname === 'www.blackdollarnetwork.com' || hostname.includes('sandbox.blackdollarnetwork.com');
    
    return {
      shouldShowContent: isLocal || (isOnMainDomainPath && window.location.pathname.startsWith('/admin')),
      shouldRedirect: !isLocal && (isOperator || !isOnMainDomainPath || !window.location.pathname.startsWith('/admin')),
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
          const canOpen = await Linking.canOpenURL(OPERATOR_URL);
          if (canOpen) {
            await Linking.openURL(OPERATOR_URL);
          }
        } catch (error) {
          console.error('Failed to redirect to operator site:', error);
          setIsRedirecting(false);
        }
        return;
      }

      // Web platform logic
      if (typeof window === 'undefined' || !window.location) {
        return;
      }

      const hostname = window.location.hostname.toLowerCase();

      // Case 1: Already on operator subdomain - redirect to main domain path
      if (isOperatorSubdomain()) {
        setIsRedirecting(true);
        setShouldRedirect(true);
        setShouldShowContent(false);
        try {
          if (__DEV__) {
            console.log('[AdminRedirect] Redirecting from operator subdomain to main domain');
          }
          window.location.href = `${MAIN_DOMAIN}/admin${window.location.pathname === '/' ? '' : window.location.pathname}${window.location.search}`;
        } catch (error) {
          console.error('Failed to redirect:', error);
          setIsRedirecting(false);
          setShouldShowContent(true); // Fallback to showing content on error
        }
        return;
      }

      // Case 2: On localhost (including operator.localhost) - don't redirect, show content
      if (isLocalhost()) {
        setShouldRedirect(false);
        setIsRedirecting(false);
        setShouldShowContent(true);
        if (__DEV__) {
          console.log('[AdminRedirect] On localhost, keeping local');
        }
        return;
      }

      // Case 3: On sandbox or any other domain with /admin path - redirect to main domain /admin path
      // Only redirect if we're actually on the /admin route
      if (pathname?.startsWith('/admin')) {
        setIsRedirecting(true);
        setShouldRedirect(true);
        setShouldShowContent(false);
        
        try {
          if (__DEV__) {
            console.log('[AdminRedirect] Redirecting from', hostname, 'to', `${MAIN_DOMAIN}/admin`);
          }
          const remainingPath = pathname === '/admin' ? '' : pathname.replace('/admin', '');
          window.location.href = `${MAIN_DOMAIN}/admin${remainingPath}${window.location.search}`;
        } catch (error) {
          console.error('Failed to redirect to operator site:', error);
          setIsRedirecting(false);
          setShouldShowContent(true); // Fallback to showing content on error
        }
        return;
      }
      
      // Not on /admin path, show content (or let app handle routing)
      setShouldShowContent(true);
      setShouldRedirect(false);
      setIsRedirecting(false);
    };

    checkAndRedirect();
  }, [pathname]);

  // If we're on operator subdomain or localhost, show the admin dashboard
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
        Redirecting to operator portal...
      </Text>
    </View>
  );
}
