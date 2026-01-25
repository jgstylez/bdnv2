/**
 * Marketplace Products Browse Page
 * 
 * Displays paginated products for marketplace browsing
 * Handles section filtering (featured, trending, physical, digital, services)
 * Uses compact list view for better space efficiency
 */

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Product } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import {
  colors,
  spacing,
  typography,
} from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { 
  mockProducts, 
  getProductsByType, 
  getFeaturedProducts, 
  getTrendingProducts 
} from '@/data/mocks/products';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/admin/Pagination';
import { ProductListItem } from '@/components/products/ProductListItem';
import { BackButton } from '@/components/navigation/BackButton';

export default function ProductsBrowsePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  const handleProductPress = (product: Product) => {
    router.push(`/pages/products/${product.id}`);
  };

  // Tab bar height is 56px on mobile, 0 on desktop
  const tabBarHeight = isDesktop ? 0 : 56;
  const bottomPadding =
    spacing["4xl"] + tabBarHeight + (isMobile ? insets.bottom : 0);

  // Get products based on section
  const allProducts = useMemo(() => {
    const section = params.section || "all";
    
    switch (section) {
      case "featured":
        // For browse page, show all products (featured are just highlighted in carousel)
        // But we can show a subset or all - let's show all for now
        return mockProducts;
      case "trending":
        // For browse page, show all products except featured ones
        const featured = getFeaturedProducts();
        const featuredIds = new Set(featured.map(p => p.id));
        return mockProducts.filter(p => !featuredIds.has(p.id));
      case "physical":
        return getProductsByType("physical");
      case "digital":
        return getProductsByType("digital");
      case "services":
        return getProductsByType("service");
      default:
        return mockProducts;
    }
  }, [params.section]);

  // Get section title
  const sectionTitle = useMemo(() => {
    const section = params.section || "all";
    switch (section) {
      case "featured":
        return "Featured Products";
      case "trending":
        return "Trending Now";
      case "physical":
        return "Physical Products";
      case "digital":
        return "Digital Products";
      case "services":
        return "Services";
      default:
        return "All Products";
    }
  }, [params.section]);

  // Pagination - more items per page for list view
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  } = usePagination<Product>(allProducts, { itemsPerPage: 20 });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: bottomPadding,
        }}
      >
        {/* Back Button */}
        <BackButton 
          label="Back to Marketplace"
          to="/(tabs)/marketplace"
          marginBottom={spacing.md}
        />

        {/* Hero Section */}
        <HeroSection
          title={sectionTitle}
          subtitle={`Browse ${allProducts.length} ${sectionTitle.toLowerCase()}`}
        />

        {/* Products List */}
        {paginatedItems.length > 0 ? (
          <>
            <View style={{ marginBottom: spacing.lg }}>
              {paginatedItems.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onPress={handleProductPress}
                  imageErrors={imageErrors}
                  onImageError={handleImageError}
                />
              ))}
            </View>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={allProducts.length}
              itemsPerPage={20}
              onPageChange={goToPage}
              alwaysShow={true}
            />
          </>
        ) : (
          <View
            style={{
              padding: spacing.xl,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="inventory" size={64} color={colors.text.tertiary} />
            <Text
              style={{
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.semibold as any,
                color: colors.text.secondary,
                marginTop: spacing.md,
              }}
            >
              No products found
            </Text>
            <Text
              style={{
                fontSize: typography.sizes.sm,
                color: colors.text.tertiary,
                marginTop: spacing.xs,
              }}
            >
              Try browsing other sections
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
