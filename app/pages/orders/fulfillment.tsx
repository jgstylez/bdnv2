/**
 * Shared Orders Fulfillment Page
 * 
 * Displays orders for both businesses and nonprofits
 * Determines entity type from route params
 */

import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OrderFulfillment } from "@/components/orders/OrderFulfillment";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing } from "@/constants/theme";
import { BackButton } from "@/components/navigation/BackButton";

export default function OrdersFulfillmentPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ entityType?: string }>();
  const { paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  
  // Determine entity type from params, default to "business" for backward compatibility
  const entityType = (params.entityType === "nonprofit" ? "nonprofit" : "business") as "business" | "nonprofit";

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? spacing.lg : spacing.xl,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            // Route back to the appropriate dashboard based on entity type
            if (entityType === "nonprofit") {
              router.push("/pages/nonprofit/dashboard");
            } else {
              router.push("/pages/merchant/dashboard");
            }
          }}
        />
        <OrderFulfillment entityType={entityType} />
      </ScrollView>
    </View>
  );
}
