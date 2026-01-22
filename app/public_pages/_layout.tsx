import React from "react";
import { View, Platform, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PublicPagesLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const isMobile = width < 768;
  
  // Add padding for status bar on mobile
  const paddingTop = isDesktop ? 0 : insets.top;
  // Add padding for bottom safe area on mobile
  const paddingBottom = isMobile ? insets.bottom : 0;

  return (
    <View style={{ flex: 1 }}>
      {paddingTop > 0 && (
        <View style={{ height: paddingTop, backgroundColor: "transparent" }} pointerEvents="none" />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: "#232323",
            paddingBottom: paddingBottom,
          },
        }}
      >
        <Stack.Screen name="about" />
        <Stack.Screen name="features" />
        <Stack.Screen name="community" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="blog" />
        <Stack.Screen name="updates" />
        <Stack.Screen name="careers" />
        <Stack.Screen name="docs" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="security" />
        <Stack.Screen name="pricing" />
        <Stack.Screen name="for-consumers" />
        <Stack.Screen name="for-businesses" />
        <Stack.Screen name="learn" />
        <Stack.Screen name="roadmap" />
      </Stack>
    </View>
  );
}

