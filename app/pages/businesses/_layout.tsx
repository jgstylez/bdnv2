import React from "react";
import { Stack } from "expo-router";

export default function BusinessesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="businesses" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
