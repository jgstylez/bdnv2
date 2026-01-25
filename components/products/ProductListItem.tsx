/**
 * Product List Item Component
 * 
 * Compact horizontal list item for displaying products in list view
 * Reusable across different product listing pages
 */

import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Product } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/constants/theme';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { getMerchantName } from '@/lib/merchant-lookup';

interface ProductListItemProps {
  product: Product;
  onPress?: (product: Product) => void;
  imageErrors?: Set<string>;
  onImageError?: (productId: string) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onPress,
  imageErrors = new Set(),
  onImageError,
}) => {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const handleProductPress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push(`/pages/products/${product.id}`);
    }
  };

  const handleBusinessPress = (e: any) => {
    e.stopPropagation();
    const businessId = product.merchantId.replace("merchant-", "");
    router.push(`/pages/businesses/${businessId}`);
  };

  const getProductTypeColor = () => {
    switch (product.productType) {
      case "physical":
        return "#2196f3";
      case "digital":
        return "#ba9988";
      case "service":
        return "#4caf50";
      default:
        return colors.accent;
    }
  };

  const getProductTypeLabel = () => {
    switch (product.productType) {
      case "physical":
        return "PHYSICAL";
      case "digital":
        return "DIGITAL";
      case "service":
        return "SERVICE";
      default:
        return "";
    }
  };

  const hasImage = product.images &&
    product.images.length > 0 &&
    product.images[0] &&
    product.images[0].trim() !== "" &&
    !imageErrors.has(product.id);

  return (
    <TouchableOpacity
      onPress={handleProductPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name} product details`}
      accessibilityHint="Double tap to view product details"
      style={{
        flexDirection: "row",
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        marginBottom: spacing.sm,
      }}
    >
      {/* Product Image */}
      <View
        style={{
          width: isMobile ? 100 : 120,
          alignSelf: "stretch",
          backgroundColor: "#474747",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {hasImage ? (
          <Image
            source={{ uri: product.images![0] }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
            {...(Platform.OS !== 'web' && {
              accessible: false,
            })}
            onError={() => {
              if (onImageError) {
                onImageError(product.id);
              }
            }}
          />
        ) : (
          <View style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <ProductPlaceholder
              width="100%"
              height="100%"
            />
          </View>
        )}

        {/* Product Type Badge */}
        {getProductTypeLabel() && (
          <View
            style={{
              position: "absolute",
              top: spacing.xs,
              right: spacing.xs,
              backgroundColor: getProductTypeColor(),
              borderRadius: borderRadius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
              zIndex: 10,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: typography.weights.bold as any,
                color: "#ffffff",
              }}
            >
              {getProductTypeLabel()}
            </Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View
        style={{
          flex: 1,
          padding: spacing.md,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Product Name */}
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.semibold as any,
              color: colors.text.primary,
              marginBottom: spacing.xs / 2,
            }}
          >
            {product.name}
          </Text>

          {/* Business/Merchant Link */}
          <TouchableOpacity
            onPress={handleBusinessPress}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`View ${getMerchantName(product.merchantId)} business page`}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: typography.sizes.xs,
                color: colors.textColors.accent,
                fontWeight: typography.weights.semibold as any,
              }}
            >
              {getMerchantName(product.merchantId)}
            </Text>
            {product.category && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: typography.sizes.xs,
                  color: colors.text.tertiary,
                  marginTop: 2,
                }}
              >
                {product.category}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Rating and Price */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: spacing.xs,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="star" size={14} color={colors.accent} />
            <Text
              style={{
                fontSize: typography.sizes.xs,
                color: colors.text.secondary,
                marginLeft: spacing.xs / 2,
              }}
            >
              4.5 (123)
            </Text>
          </View>
          <Text
            style={{
              fontSize: typography.sizes.lg,
              fontWeight: typography.weights.bold as any,
              color: colors.accent,
            }}
          >
            ${product.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
