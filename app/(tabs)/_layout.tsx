import React, { useState } from "react";
import { View, useWindowDimensions, Platform } from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Sidebar } from '@/components/Sidebar';
import { AppHeader } from '@/components/AppHeader';
import { MenuPanel } from '@/components/MenuPanel';
import { CustomTabBar } from '@/components/CustomTabBar';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [menuOpen, setMenuOpen] = useState(false);

  const headerHeight = 64;
  const tabBarHeight = 56;
  const headerTotalHeight = headerHeight + (isDesktop ? 0 : insets.top);

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
        <View
          style={{
            flex: 1,
            paddingTop: headerTotalHeight,
            paddingBottom: 0,
          }}
        >
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: isDesktop
                ? { display: "none" }
                : {
                    position: "absolute",
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 56,
                  },
              tabBarActiveTintColor: "#ba9988",
              tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
            }}
            tabBar={(props) => (isDesktop ? null : <CustomTabBar {...props} />)}
          >
            <Tabs.Screen
              name="dashboard"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="home" size={20} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="marketplace"
              options={{
                title: "Shop",
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="shopping-bag" size={20} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="pay"
              options={{
                title: "Pay",
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="payment" size={20} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="account"
              options={{
                title: "Account",
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="person" size={20} color={color} />
                ),
              }}
            />
          </Tabs>
        </View>
      </View>
      <MenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
