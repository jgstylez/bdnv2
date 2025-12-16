import React from "react";
import { Stack } from "expo-router";

export default function PayItForwardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

