import React from "react";
import { Stack } from "expo-router";
import { NonprofitProvider } from '@/contexts/NonprofitContext';

export default function NonprofitLayout() {
  return (
    <NonprofitProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#232323" },
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="campaigns" />
        <Stack.Screen name="campaigns/create" />
        <Stack.Screen name="campaigns/[id]" />
        <Stack.Screen name="account" />
        <Stack.Screen name="donations" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="products" />
        <Stack.Screen name="products/integrations" />
        <Stack.Screen name="qrcode" />
        <Stack.Screen name="invoices" />
      </Stack>
    </NonprofitProvider>
  );
}

