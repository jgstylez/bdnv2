import React from "react";
import { Stack } from "expo-router";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="create" />
      <Stack.Screen name="my-events" />
    </Stack>
  );
}

