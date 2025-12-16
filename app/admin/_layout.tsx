import React, { useState } from "react";
import { View, useWindowDimensions, Platform } from "react-native";
import { Stack } from "expo-router";
import { AdminSidebar } from "../../components/AdminSidebar";
import { AdminHeader } from "../../components/AdminHeader";
import { AdminMenuPanel } from "../../components/AdminMenuPanel";

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1, flexDirection: isDesktop ? "row" : "column" }}>
      {isDesktop && <AdminSidebar />}
      <View style={{ flex: 1, flexDirection: "column", position: "relative" }}>
        <AdminHeader onMenuPress={() => setMenuOpen(true)} />
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#232323" },
            }}
          >
          <Stack.Screen name="index" />
          <Stack.Screen name="users" />
          <Stack.Screen name="businesses" />
          <Stack.Screen name="nonprofits" />
          <Stack.Screen name="token-holders" />
          <Stack.Screen name="transactions" />
          <Stack.Screen name="gift-cards" />
          <Stack.Screen name="blkd-purchases" />
          <Stack.Screen name="subscription-boxes" />
          <Stack.Screen name="disputes" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="emails" />
          <Stack.Screen name="content" />
          <Stack.Screen name="analytics" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="bi" />
          </Stack>
        </View>
      </View>
      <AdminMenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

