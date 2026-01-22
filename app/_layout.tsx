import "../nativewind-setup";
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext';
import { toastConfig } from '@/components/ToastConfig';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useDarkModeSetup } from '../nativewind-setup';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

function ToastWrapper() {
  const insets = useSafeAreaInsets();
  
  return (
    <Toast
      config={toastConfig}
      topOffset={Platform.OS === 'ios' ? Math.max(insets.top + 10, 60) : 60}
      bottomOffset={Platform.OS === 'ios' ? Math.max(insets.bottom + 10, 40) : 40}
      keyboardOffset={Platform.OS === 'ios' ? 10 : 0}
      avoidKeyboard={true}
    />
  );
}

export default function RootLayout() {
  // Ensure dark mode flag is set after mount
  useDarkModeSetup();

  useEffect(() => {
    // Hide splash screen once the app is ready
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // Splash screen might already be hidden or not available (e.g., on web)
        console.warn('Splash screen hide error:', e);
      }
    };

    // Small delay to ensure everything is loaded
    const timer = setTimeout(hideSplash, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider> 
            <FeatureFlagsProvider>
              <CartProvider>
                <StatusBar style="light" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#232323" },
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="pages" options={{ headerShown: false }} />
                  <Stack.Screen name="web" options={{ headerShown: false }} />
                  <Stack.Screen name="admin" options={{ headerShown: false }} />
                </Stack>
                <ToastWrapper />
              </CartProvider>
            </FeatureFlagsProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
