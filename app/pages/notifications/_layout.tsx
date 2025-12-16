import React from "react";
import { Stack } from "expo-router";

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

