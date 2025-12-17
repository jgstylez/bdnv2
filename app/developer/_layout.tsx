import React, { useState } from "react";
import { View, useWindowDimensions, Platform } from "react-native";
import { Stack } from "expo-router";
import { DeveloperSidebar } from '@/components/DeveloperSidebar';
import { DeveloperHeader } from '@/components/DeveloperHeader';
import { DeveloperMenuPanel } from '@/components/DeveloperMenuPanel';

export default function DeveloperLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1, flexDirection: isDesktop ? "row" : "column" }}>
      {isDesktop && <DeveloperSidebar />}
      <View style={{ flex: 1, flexDirection: "column", position: "relative" }}>
        <DeveloperHeader onMenuPress={() => setMenuOpen(true)} />
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#232323" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="api-docs" />
            <Stack.Screen name="api-keys" />
            <Stack.Screen name="api-playground" />
            <Stack.Screen name="webhooks" />
            <Stack.Screen name="sdks" />
            <Stack.Screen name="logs" />
            <Stack.Screen name="testing" />
          </Stack>
        </View>
      </View>
      <DeveloperMenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

