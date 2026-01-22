import { useAuth } from '../hooks/useAuth';
import { useRouter, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/theme';

// Allow admin access in development mode
const ALLOW_DEV_ADMIN = __DEV__;

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasNavigatedRef = useRef(false);

  // In dev mode, allow admin access
  const canAccessAdmin = isAdmin || ALLOW_DEV_ADMIN;

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    if (__DEV__) {
      console.log('[AdminGuard] Auth state:', { isAdmin, isLoading, canAccessAdmin, pathname });
    }

    // Only navigate if we're not already navigating and user is not admin (and not in dev mode)
    if (!canAccessAdmin && !hasNavigatedRef.current && pathname?.startsWith('/admin')) {
      hasNavigatedRef.current = true;
      if (__DEV__) {
        console.log('[AdminGuard] Redirecting non-admin user away from admin route');
      }
      // Use setTimeout to ensure router is fully mounted and ready
      const timer = setTimeout(() => {
        try {
          // Use replace to avoid adding to history
          router.replace('/(tabs)/dashboard');
        } catch (error) {
          console.error('Navigation error:', error);
          hasNavigatedRef.current = false; // Reset on error so we can retry
        }
      }, 200); // Slightly longer delay to ensure router is ready
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAdmin, canAccessAdmin, router, pathname]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // If not admin (and not in dev mode), show loading (navigation is happening)
  if (!canAccessAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
}
