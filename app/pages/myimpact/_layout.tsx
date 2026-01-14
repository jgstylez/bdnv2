import React from "react";
import { Stack } from "expo-router";

export default function MyImpactLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="points" />
      <Stack.Screen name="cashback" />
      <Stack.Screen name="earnings" />
      <Stack.Screen name="donations" />
      <Stack.Screen name="leaderboard" />
      <Stack.Screen name="badges" />
    </Stack>
  );
}

