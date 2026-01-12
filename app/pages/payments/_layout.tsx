import React from "react";
import { Stack } from "expo-router";

export default function PaymentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#232323" },
      }}
    >
      <Stack.Screen name="token-purchase" />
      <Stack.Screen name="c2b-payment" />
      <Stack.Screen name="invoice" />
    </Stack>
  );
}

