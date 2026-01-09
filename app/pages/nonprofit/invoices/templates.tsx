/**
 * Nonprofit Invoice Templates Page (Legacy Route)
 * 
 * Redirects to shared invoice templates page with nonprofit entity type
 * Maintained for backward compatibility
 */

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { colors } from "@/constants/theme";

export default function NonprofitInvoiceTemplates() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pages/invoices/templates?entityType=nonprofit");
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary.bg }}>
      <Text style={{ color: colors.text.primary }}>Redirecting...</Text>
    </View>
  );
}
