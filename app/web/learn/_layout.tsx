import React from "react";
import { View, Platform, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LearnLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const isMobile = width < 768;
  
  const paddingTop = isDesktop ? 0 : insets.top;
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
        <Stack.Screen name="index" />
        <Stack.Screen name="black-spending-power" />
        <Stack.Screen name="group-economics" />
        <Stack.Screen name="community-impact" />
      </Stack>
    </View>
  );
}
