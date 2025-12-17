import React, { useState, useMemo } from "react";
import { View, useWindowDimensions, Platform } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import { Sidebar } from '@/components/Sidebar';
import { AppHeader } from '@/components/AppHeader';
import { MenuPanel } from '@/components/MenuPanel';
import { CustomTabBar } from '@/components/CustomTabBar';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function PagesLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  
  const headerHeight = 64;
  const headerTotalHeight = headerHeight + (isDesktop ? 0 : insets.top);

  // Determine active tab index based on current pathname
  const activeTabIndex = useMemo(() => {
    if (pathname === "/(tabs)/dashboard" || pathname?.startsWith("/(tabs)/dashboard")) {
      return 0; // Dashboard
    }
    if (pathname === "/(tabs)/marketplace" || pathname?.startsWith("/(tabs)/marketplace")) {
      return 1; // Marketplace
    }
    if (pathname === "/(tabs)/pay" || pathname?.startsWith("/(tabs)/pay") || pathname?.startsWith("/pages/payments")) {
      return 2; // Pay
    }
    if (pathname === "/(tabs)/account" || pathname?.startsWith("/(tabs)/account")) {
      return 3; // Account
    }
    // Default to no tab active if on a pages route
    return -1;
  }, [pathname]);

  // Create navigation state for tab bar based on actual route
  const createTabBarState = () => ({
    index: activeTabIndex >= 0 ? activeTabIndex : 0,
    routes: [
      { key: "dashboard", name: "dashboard", params: {} },
      { key: "marketplace", name: "marketplace", params: {} },
      { key: "pay", name: "pay", params: {} },
      { key: "account", name: "account", params: {} },
    ],
  });

  const createTabBarDescriptors = () => ({
    dashboard: {
      options: {
        title: "Home",
        tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="home" size={20} color={color} />,
      },
      navigation: {} as any,
    },
    marketplace: {
      options: {
        title: "Shop",
        tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="shopping-bag" size={20} color={color} />,
      },
      navigation: {} as any,
    },
    pay: {
      options: {
        title: "Pay",
        tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="payment" size={20} color={color} />,
      },
      navigation: {} as any,
    },
    account: {
      options: {
        title: "Account",
        tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="person" size={20} color={color} />,
      },
      navigation: {} as any,
    },
  });

  const createTabBarNavigation = () => ({
    navigate: (name: string) => {
      if (name === "dashboard") router.push("/(tabs)/dashboard");
      else if (name === "marketplace") router.push("/(tabs)/marketplace");
      else if (name === "pay") router.push("/(tabs)/pay");
      else if (name === "account") router.push("/(tabs)/account");
    },
    emit: () => ({ defaultPrevented: false }),
  } as any);

  return (
    <View 
      style={{ 
        flex: 1, 
        flexDirection: isDesktop ? "row" : "column", 
        overflow: isDesktop ? "visible" : "hidden",
        ...(isDesktop && Platform.OS === "web" && {
          // @ts-ignore - Web-only CSS properties
          overflow: "visible",
          isolation: "isolate",
        }),
      }}
    >
      {isDesktop && (
        <View 
          style={{ 
            overflow: "visible",
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              overflow: "visible",
              position: "relative" as any,
            }),
          }}
        >
          <Sidebar />
        </View>
      )}
      <View style={{ flex: 1, flexDirection: "column", position: "relative" }}>
        <AppHeader onMenuPress={() => setMenuOpen(true)} />
        <View style={{ flex: 1, paddingTop: headerTotalHeight, paddingBottom: isMobile ? 86 : 0 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#232323" },
            }}
          >
              <Stack.Screen name="tokens" />
              <Stack.Screen name="referrals" />
              <Stack.Screen name="merchant" />
              <Stack.Screen name="myimpact" />
              <Stack.Screen name="university" />
              <Stack.Screen name="media" />
              <Stack.Screen name="search" />
              <Stack.Screen name="businesses" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="nonprofit" />
              <Stack.Screen name="pay-it-forward" />
              <Stack.Screen name="events" />
              <Stack.Screen name="transactions" />
              <Stack.Screen name="bdn-plus" />
              <Stack.Screen name="pricing" />
              <Stack.Screen name="support" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="payments" />
              <Stack.Screen name="cart" />
              <Stack.Screen name="products" />
              <Stack.Screen name="invoices" />
              <Stack.Screen name="account" />
          </Stack>
        </View>
        {!isDesktop && (
          <CustomTabBar
            state={createTabBarState()}
            descriptors={createTabBarDescriptors()}
            navigation={createTabBarNavigation()}
          />
        )}
      </View>
      <MenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

