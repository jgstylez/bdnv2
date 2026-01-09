/**
 * Shared Products List Page
 * 
 * Displays products for both businesses and nonprofits
 * Determines entity type from route params
 */

import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { ProductList } from "@/components/products/ProductList";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing } from "@/constants/theme";

export default function ProductsListPage() {
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
        <ProductList entityType={entityType} />
      </ScrollView>
    </View>
  );
}
