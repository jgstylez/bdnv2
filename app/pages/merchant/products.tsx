/**
 * Merchant Products Page (Legacy Route)
 * 
 * Redirects to shared products list page with business entity type
 * Maintained for backward compatibility
 */

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function MerchantProducts() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to shared products list page
    router.replace("/pages/products/list?entityType=business");
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#232323" }}>
      <Text style={{ color: "#ffffff" }}>Redirecting...</Text>
    </View>
  );
}
