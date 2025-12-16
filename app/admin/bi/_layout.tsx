import React from "react";
import { Stack } from "expo-router";

export default function BILayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="business-model" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="user-behavior" />
      <Stack.Screen name="revenue-sharing" />
    </Stack>
  );
}

