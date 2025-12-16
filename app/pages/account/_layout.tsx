import React from "react";
import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="manage" />
      <Stack.Screen name="about-legal" />
    </Stack>
  );
}

