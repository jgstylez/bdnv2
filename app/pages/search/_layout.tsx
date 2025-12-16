import React from "react";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="results" />
      <Stack.Screen name="location" />
    </Stack>
  );
}

