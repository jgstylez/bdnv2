/**
 * Product Edit Page
 * 
 * Allows editing existing products/items for both businesses and nonprofits
 * Redirects to create page with edit mode enabled (create page handles both create and edit)
 */

import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@/constants/theme";

export default function EditProduct() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  
  useEffect(() => {
    // Redirect to create page with id parameter for editing
    if (id) {
      router.replace({
        pathname: "/pages/products/create",
        params: { id, type },
      });
    }
  }, [id, type, router]);
  
  // Show loading while redirecting
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}
