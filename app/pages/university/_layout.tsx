import React from "react";
import { Stack } from "expo-router";

export default function UniversityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="guides" />
      <Stack.Screen name="guides/[id]" />
      <Stack.Screen name="videos" />
      <Stack.Screen name="videos/[id]" />
      <Stack.Screen name="help" />
      <Stack.Screen name="blog" />
      <Stack.Screen name="blog/[id]" />
    </Stack>
  );
}

