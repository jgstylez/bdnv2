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

  const iconSize = isDesktop ? 22 : 24;
  const containerSize = isDesktop ? 40 : 44;
  const badgeSize = isDesktop ? 18 : 20;
  const badgeFontSize = isDesktop ? 10 : 11;

  return (
    <TouchableOpacity
      onPress={() => router.push("/pages/cart")}
      style={{
        position: "relative",
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: isDesktop ? "rgba(71, 71, 71, 0.4)" : "rgba(71, 71, 71, 0.6)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
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

