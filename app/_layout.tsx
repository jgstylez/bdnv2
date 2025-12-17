import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext';
import { toastConfig } from '@/components/ToastConfig';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
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
                  <Stack.Screen name="public_pages" options={{ headerShown: false }} />
                  <Stack.Screen name="admin" options={{ headerShown: false }} />
                </Stack>
                <Toast config={toastConfig} />
              </CartProvider>
            </FeatureFlagsProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
