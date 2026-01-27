import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";
import { usePathname } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';

const DESIGNER_URL = "https://designer.blackdollarnetwork.com";
const MAIN_DOMAIN = "https://blackdollarnetwork.com";

/**
 * Checks if we're currently on the designer subdomain (production/sandbox only, not localhost)
 */
function isDesignerSubdomain(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  
  // Exclude localhost subdomains - they should be handled by isLocalhost()
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return false;
  }
  
  return hostname === 'designer.blackdollarnetwork.com' ||
         (hostname.startsWith('designer.') && !hostname.includes('localhost'));
}

/**
 * Checks if we're on localhost (development environment)
 * Also checks for designer.localhost to simulate subdomain behavior
 */
function isLocalhost(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  // Check for localhost, 127.0.0.1, or designer.localhost (simulating subdomain)
  return (
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('localhost:') ||
    hostname === 'designer.localhost' ||
    hostname.startsWith('designer.localhost:')
  );
}

interface DesignerRedirectProps {
  children: React.ReactNode;
}

/**
 * DesignerRedirect component that handles context-aware redirects for /designer route
 * - Localhost: Shows designer dashboard locally (no redirect)
 * - Designer subdomain: Redirects to blackdollarnetwork.com/designer
 * - Sandbox/Other domains with /designer: Redirects to blackdollarnetwork.com/designer
 * - Main domain with /designer: Shows designer dashboard (no redirect)
 */
export function DesignerRedirect({ children }: DesignerRedirectProps) {
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
                    hostname === 'designer.localhost' ||
                    hostname.startsWith('designer.localhost:');
    const isDesigner = hostname === 'designer.blackdollarnetwork.com' || 
                       (hostname.startsWith('designer.') && !hostname.includes('localhost'));
    // On main domain /designer path, show content. Otherwise redirect.
    const isOnMainDomainPath = hostname === 'blackdollarnetwork.com' || hostname === 'www.blackdollarnetwork.com' || hostname.includes('sandbox.blackdollarnetwork.com');
    
    return {
      shouldShowContent: isLocal || (isOnMainDomainPath && window.location.pathname.startsWith('/designer')),
      shouldRedirect: !isLocal && (isDesigner || !isOnMainDomainPath || !window.location.pathname.startsWith('/designer')),
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
          const canOpen = await Linking.canOpenURL(DESIGNER_URL);
          if (canOpen) {
            await Linking.openURL(DESIGNER_URL);
          }
        } catch (error) {
          console.error('Failed to redirect to designer site:', error);
          setIsRedirecting(false);
        }
        return;
      }

      // Web platform logic
      if (typeof window === 'undefined' || !window.location) {
        return;
      }

      const hostname = window.location.hostname.toLowerCase();

      // Case 1: On localhost (including designer.localhost) - don't redirect, show content
      // Check this FIRST to prevent localhost subdomains from being treated as production subdomains
      if (isLocalhost()) {
        setShouldRedirect(false);
        setIsRedirecting(false);
        setShouldShowContent(true);
        if (__DEV__) {
          console.log('[DesignerRedirect] On localhost, keeping local');
        }
        return;
      }

      // Case 2: Already on designer subdomain (production/sandbox) - redirect to main domain path
      if (isDesignerSubdomain()) {
        setIsRedirecting(true);
        setShouldRedirect(true);
        setShouldShowContent(false);
        try {
          if (__DEV__) {
            console.log('[DesignerRedirect] Redirecting from designer subdomain to main domain');
          }
          window.location.href = `${MAIN_DOMAIN}/designer${window.location.pathname === '/' ? '' : window.location.pathname}${window.location.search}`;
        } catch (error) {
          console.error('Failed to redirect:', error);
          setIsRedirecting(false);
          setShouldShowContent(true); // Fallback to showing content on error
        }
        return;
      }

      // Case 3: On sandbox or any other domain with /designer path - redirect to main domain /designer path
      // (This handles cases where someone accesses /designer on a non-subdomain URL)
      // Only redirect if we're actually on the /designer route
      if (pathname?.startsWith('/designer')) {
        setIsRedirecting(true);
        setShouldRedirect(true);
        setShouldShowContent(false);
        
        try {
          if (__DEV__) {
            console.log('[DesignerRedirect] Redirecting from', hostname, 'to', `${MAIN_DOMAIN}/designer`);
          }
          const remainingPath = pathname === '/designer' ? '' : pathname.replace('/designer', '');
          window.location.href = `${MAIN_DOMAIN}/designer${remainingPath}${window.location.search}`;
        } catch (error) {
          console.error('Failed to redirect to designer site:', error);
          setIsRedirecting(false);
          setShouldShowContent(true); // Fallback to showing content on error
        }
        return;
      }
      
      // Not on /designer path, show content (or let app handle routing)
      setShouldShowContent(true);
      setShouldRedirect(false);
      setIsRedirecting(false);
    };

    checkAndRedirect();
  }, [pathname]);

  // If we're on designer subdomain or localhost, show the designer dashboard
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
        Redirecting to designer portal...
      </Text>
    </View>
  );
}
