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
 */
function isLocalhost(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:');
}

export default function DeveloperRedirect() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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

      // Case 1: Already on developer subdomain - don't redirect, just show content
      if (isDeveloperSubdomain()) {
        setShouldRedirect(false);
        setIsRedirecting(false);
        if (__DEV__) {
          console.log('[DeveloperRedirect] Already on developer subdomain, no redirect needed');
        }
        return;
      }

      // Case 2: On localhost - don't redirect, keep it local
      if (isLocalhost()) {
        setShouldRedirect(false);
        setIsRedirecting(false);
        if (__DEV__) {
          console.log('[DeveloperRedirect] On localhost, keeping local');
        }
        return;
      }

      // Case 3: On sandbox or any other domain - redirect to developer.blackdollarnetwork.com
      setIsRedirecting(true);
      setShouldRedirect(true);
      
      try {
        if (__DEV__) {
          console.log('[DeveloperRedirect] Redirecting from', hostname, 'to', DEVELOPER_URL);
        }
        window.location.href = DEVELOPER_URL;
      } catch (error) {
        console.error('Failed to redirect to developer site:', error);
        setIsRedirecting(false);
      }
    };

    checkAndRedirect();
  }, []);

  // If we're on developer subdomain or localhost, show a message (or you could render the actual developer dashboard here)
  if (!shouldRedirect && !isRedirecting) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            textAlign: 'center',
            paddingHorizontal: spacing.lg,
          }}
        >
          {isLocalhost() 
            ? 'Developer portal (local development)' 
            : 'Developer portal'}
        </Text>
      </View>
    );
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

