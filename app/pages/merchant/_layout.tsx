import React from "react";
import { Stack } from "expo-router";
import { BusinessProvider } from '@/contexts/BusinessContext';

export default function MerchantLayout() {
  return (
    <BusinessProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#232323" },
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="verify-black-owned" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="products" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="analytics" />
        <Stack.Screen name="qrcode" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="menu/create" />
        <Stack.Screen name="products/integrations" />
        <Stack.Screen name="account" />
        <Stack.Screen name="invoices" />
        <Stack.Screen name="settings" />
      </Stack>
    </BusinessProvider>
  );
}

