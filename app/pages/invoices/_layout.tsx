import React from "react";
import { Stack } from "expo-router";

export default function InvoicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="user" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit/[id]" />
    </Stack>
  );
}
