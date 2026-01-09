/**
 * Nonprofit Invoices Page (Legacy Route)
 * 
 * Redirects to shared invoices list page with nonprofit entity type
 * Maintained for backward compatibility
 */

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { colors } from "@/constants/theme";

export default function NonprofitInvoices() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pages/invoices/index?entityType=nonprofit");
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary.bg }}>
      <Text style={{ color: colors.text.primary }}>Redirecting...</Text>
    </View>
  );
}
