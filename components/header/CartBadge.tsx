import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { useCart } from '../../contexts/CartContext';

interface CartBadgeProps {
  isDesktop: boolean;
  itemCount?: number; // Optional override, defaults to cart context
}

/**
 * CartBadge Component
 * Displays shopping cart icon with item count badge
 * Matches the styling of NotificationBadge for consistency
 */
export const CartBadge: React.FC<CartBadgeProps> = ({ isDesktop, itemCount: overrideItemCount }) => {
  const router = useRouter();
  const { itemCount: cartItemCount } = useCart();
  const itemCount = overrideItemCount !== undefined ? overrideItemCount : cartItemCount;

  // Mobile: smaller icon but maintain 44x44 touch target for accessibility
  // Desktop: larger icon with 40x40 container
  const iconSize = isDesktop ? 22 : 20;
  const containerSize = isDesktop ? 40 : 44;
  const badgeSize = isDesktop ? 18 : 16;
  const badgeFontSize = isDesktop ? 10 : 9;

  return (
    <TouchableOpacity
      onPress={() => router.push("/pages/cart")}
      style={{
        position: "relative",
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: isDesktop ? "rgba(71, 71, 71, 0.4)" : "rgba(40, 40, 45, 0.8)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      accessibilityHint="Double tap to view cart"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <MaterialIcons name="shopping-cart" size={iconSize} color="rgba(255, 255, 255, 0.9)" />
      {/* Badge */}
      {itemCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: isDesktop ? 4 : 2,
            right: isDesktop ? 4 : 2,
            minWidth: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xs,
            borderWidth: 2,
            borderColor: colors.primary.bg,
          }}
        >
          <Text
            style={{
              fontSize: badgeFontSize,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

