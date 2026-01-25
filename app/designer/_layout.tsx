import React, { useState } from "react";
import { View, useWindowDimensions, Platform } from "react-native";
import { Stack } from "expo-router";
import { DesignerSidebar } from '@/components/DesignerSidebar';
import { DesignerHeader } from '@/components/DesignerHeader';
import { DesignerMenuPanel } from '@/components/DesignerMenuPanel';

export default function DesignerLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1, flexDirection: isDesktop ? "row" : "column" }}>
      {isDesktop && <DesignerSidebar />}
      <View style={{ flex: 1, flexDirection: "column", position: "relative" }}>
        <DesignerHeader onMenuPress={() => setMenuOpen(true)} />
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#232323" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="brand-identity" />
            <Stack.Screen name="logo" />
            <Stack.Screen name="ui-design" />
            <Stack.Screen name="color-palette" />
            <Stack.Screen name="typography" />
            <Stack.Screen name="components" />
            <Stack.Screen name="spacing" />
            <Stack.Screen name="icons" />
            <Stack.Screen name="imagery" />
          </Stack>
        </View>
      </View>
      <DesignerMenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
