import React from "react";
import { Stack } from "expo-router";

export default function MediaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="bdn-tv" />
      <Stack.Screen name="blog" />
      <Stack.Screen name="channels" />
    </Stack>
  );
}

