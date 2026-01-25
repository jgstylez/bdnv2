import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/international';
import { Currency } from '@/types/wallet';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

export default function Cart() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { 
    items: cartItems, 
    savedItems,
    businessOrders, 
    updateQuantity, 
    removeFromCart, 
    clearBusinessCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    getSubtotal, 
    getShippingTotal, 
    getTotal, 
    itemCount 
  } = useCart();

  const subtotal = getSubtotal();
  const shippingTotal = getShippingTotal();
  const total = getTotal();

  const handleUpdateQuantity = async (productId: string, delta: number) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleRemoveBusiness = async (merchantId: string) => {
    await clearBusinessCart(merchantId);
  };

  const handleSaveForLater = async (productId: string, variantId?: string) => {
    await saveForLater(productId, variantId);
  };

  const handleMoveToCart = async (productId: string, variantId?: string) => {
    await moveToCart(productId, variantId);
  };

  const handleRemoveFromSaved = async (productId: string, variantId?: string) => {
    await removeFromSaved(productId, variantId);
  };

  const handleCheckout = () => {
    router.push("/pages/checkout");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Back Button */}
        <BackButton label="Back to Marketplace" to="/(tabs)/marketplace" />

        {/* Hero Section */}
        <HeroSection
          title="Shopping Cart"
          subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}
        />

        {cartItems.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: spacing["4xl"] }}>
            <MaterialIcons name="shopping-cart" size={64} color={colors.text.tertiary} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.text.primary,
                marginTop: spacing.lg,
                marginBottom: spacing.sm,
              }}
            >
              Your cart is empty
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                marginBottom: spacing.xl,
              }}
            >
              Start shopping to add items to your cart
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/marketplace")}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.textColors.onAccent,
                }}
              >
                Browse Marketplace
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Business Orders */}
            <View style={{ gap: spacing.xl, marginBottom: spacing.xl }}>
              {businessOrders.map((businessOrder) => (
                <View
                  key={businessOrder.merchantId}
                  style={{
                    backgroundColor: colors.secondary,
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {/* Business Header */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: spacing.md,
                      paddingBottom: spacing.md,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold as any,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {businessOrder.merchantName || `Business ${businessOrder.merchantId}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                        }}
                      >
                        {businessOrder.items.length} {businessOrder.items.length === 1 ? "item" : "items"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveBusiness(businessOrder.merchantId)}
                      style={{
                        padding: spacing.xs,
                      }}
                    >
                      <MaterialIcons name="close" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Business Items */}
                  <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
                    {businessOrder.items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    backgroundColor: colors.secondary,
                    borderRadius: borderRadius.lg,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {/* Product Image */}
                  <View
                    style={{
                      width: isMobile ? 100 : 120,
                      height: isMobile ? 100 : 120,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      backgroundColor: colors.secondary,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    {item.images && 
                     item.images.length > 0 && 
                     item.images[0] && 
                     item.images[0].trim() !== "" &&
                     !imageErrors.has(item.id) ? (
                      <Image
                        source={{ uri: item.images[0] }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(item.id));
                        }}
                      />
                    ) : (
                      <ProductPlaceholder width="100%" height={isMobile ? 100 : 120} aspectRatio={1} />
                    )}
                  </View>

                  {/* Product Details */}
                  <View style={{ flex: 1, padding: spacing.md, justifyContent: "space-between" }}>
                    <View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <View style={{ flex: 1 }}>
                          <Text
                            numberOfLines={2}
                            style={{
                              fontSize: typography.fontSize.base,
                              fontWeight: typography.fontWeight.semibold as any,
                              color: colors.text.primary,
                              marginBottom: spacing.xs,
                              ...(Platform.OS === "web" && {
                                // @ts-ignore - Web-only CSS properties
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                lineHeight: 20,
                              } as any),
                            } as any}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: typography.fontSize.sm,
                              color: colors.text.secondary,
                            }}
                          >
                            {formatCurrency(item.price, item.currency as Currency)} each
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveItem(item.id)}
                          accessible={true}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${item.name} from cart`}
                          accessibilityHint="Double tap to remove this item from your cart"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={{
                            padding: spacing.xs,
                          }}
                        >
                          <MaterialIcons name="close" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Quantity Controls */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.md }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                        <TouchableOpacity
                          onPress={() => handleUpdateQuantity(item.id, -1)}
                          accessible={true}
                          accessibilityRole="button"
                          accessibilityLabel={`Decrease quantity of ${item.name}`}
                          accessibilityHint="Double tap to decrease quantity by one"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: borderRadius.sm,
                            backgroundColor: colors.background,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <MaterialIcons name="remove" size={18} color={colors.text.primary} />
                        </TouchableOpacity>
                        <Text
                          accessible={true}
                          accessibilityRole="text"
                          accessibilityLabel={`Quantity: ${item.quantity}`}
                          style={{
                            fontSize: typography.fontSize.base,
                            fontWeight: typography.fontWeight.semibold as any,
                            color: colors.text.primary,
                            minWidth: 30,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleUpdateQuantity(item.id, 1)}
                          accessible={true}
                          accessibilityRole="button"
                          accessibilityLabel={`Increase quantity of ${item.name}`}
                          accessibilityHint="Double tap to increase quantity by one"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: borderRadius.sm,
                            backgroundColor: colors.background,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <MaterialIcons name="add" size={18} color={colors.text.primary} />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold as any,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(item.price * item.quantity, item.currency as Currency)}
                      </Text>
                    </View>
                    {/* Save for Later Button */}
                    <TouchableOpacity
                      onPress={() => handleSaveForLater(item.id, item.selectedVariantId)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Save ${item.name} for later`}
                      accessibilityHint="Double tap to save this item for later"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: spacing.xs,
                        marginTop: spacing.sm,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.sm,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                      }}
                    >
                      <MaterialIcons name="bookmark-border" size={16} color={colors.text.secondary} />
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.normal as any,
                          color: colors.text.secondary,
                        }}
                      >
                        Save for later
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                    ))}
                  </View>

                  {/* Business Order Subtotal */}
                  <View
                    style={{
                      marginTop: spacing.md,
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        Subtotal
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                        {formatCurrency(businessOrder.subtotal, businessOrder.currency as Currency)}
                      </Text>
                    </View>
                    {businessOrder.shippingTotal > 0 && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                          Shipping
                        </Text>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          {formatCurrency(businessOrder.shippingTotal, businessOrder.currency as Currency)}
                        </Text>
                      </View>
                    )}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xs }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold as any,
                          color: colors.text.primary,
                        }}
                      >
                        Business Total
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold as any,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(businessOrder.total, businessOrder.currency as Currency)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <View
              style={{
                backgroundColor: colors.secondary,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold as any,
                  color: colors.text.primary,
                  marginBottom: spacing.lg,
                }}
              >
                Order Summary
              </Text>
              <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {formatCurrency(subtotal, "USD")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Shipping
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {shippingTotal > 0 ? formatCurrency(shippingTotal, "USD" as Currency) : "Free"}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.border,
                    marginVertical: spacing.sm,
                  }}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold as any,
                      color: colors.text.primary,
                    }}
                  >
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold as any,
                      color: colors.accent,
                    }}
                  >
                    {formatCurrency(total, "USD" as Currency)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleCheckout}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Proceed to checkout"
                accessibilityHint="Double tap to proceed to checkout"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  backgroundColor: colors.accent,
                  paddingVertical: spacing.md + 2,
                  paddingHorizontal: paddingHorizontal,
                  borderRadius: borderRadius.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold as any,
                    color: colors.textColors.onAccent,
                  }}
                >
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>

            {/* Saved for Later Section */}
            {savedItems.length > 0 && (
              <View style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.md,
                  }}
                >
                  Saved for Later ({savedItems.length} {savedItems.length === 1 ? "item" : "items"})
                </Text>
                <View style={{ gap: spacing.md }}>
                  {savedItems.map((item) => (
                    <View
                      key={`${item.id}-${item.selectedVariantId || "default"}`}
                      style={{
                        flexDirection: "row",
                        backgroundColor: colors.secondary,
                        borderRadius: borderRadius.lg,
                        padding: spacing.md,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      {/* Product Image */}
                      <View
                        style={{
                          width: isMobile ? 80 : 100,
                          height: isMobile ? 80 : 100,
                          borderRadius: borderRadius.md,
                          overflow: "hidden",
                          backgroundColor: colors.secondary,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        {item.images && 
                         item.images.length > 0 && 
                         item.images[0] && 
                         item.images[0].trim() !== "" &&
                         !imageErrors.has(item.id) ? (
                          <Image
                            source={{ uri: item.images[0] }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            onError={() => {
                              setImageErrors((prev) => new Set(prev).add(item.id));
                            }}
                          />
                        ) : (
                          <ProductPlaceholder width="100%" height={isMobile ? 80 : 100} aspectRatio={1} />
                        )}
                      </View>

                      {/* Product Details */}
                      <View style={{ flex: 1, paddingLeft: spacing.md, justifyContent: "space-between" }}>
                        <View>
                          <Text
                            numberOfLines={2}
                            style={{
                              fontSize: typography.fontSize.base,
                              fontWeight: typography.fontWeight.semibold as any,
                              color: colors.text.primary,
                              marginBottom: spacing.xs,
                            }}
                          >
                            {item.name}
                          </Text>
                          {item.selectedVariant && (
                            <Text
                              style={{
                                fontSize: typography.fontSize.sm,
                                color: colors.text.secondary,
                                marginBottom: spacing.xs,
                              }}
                            >
                              {item.selectedVariant.name}
                            </Text>
                          )}
                          <Text
                            style={{
                              fontSize: typography.fontSize.base,
                              fontWeight: typography.fontWeight.bold as any,
                              color: colors.accent,
                            }}
                          >
                            {formatCurrency(item.price, item.currency as Currency)} each
                          </Text>
                          <Text
                            style={{
                              fontSize: typography.fontSize.sm,
                              color: colors.text.secondary,
                              marginTop: spacing.xs,
                            }}
                          >
                            Quantity: {item.quantity}
                          </Text>
                        </View>

                        {/* Actions */}
                        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
                          <TouchableOpacity
                            onPress={() => handleMoveToCart(item.id, item.selectedVariantId)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Move ${item.name} to cart`}
                            style={{
                              flex: 1,
                              backgroundColor: colors.accent,
                              paddingVertical: spacing.sm,
                              borderRadius: borderRadius.md,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: typography.fontSize.sm,
                                fontWeight: typography.fontWeight.semibold as any,
                                color: colors.textColors.onAccent,
                              }}
                            >
                              Move to Cart
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleRemoveFromSaved(item.id, item.selectedVariantId)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${item.name} from saved`}
                            style={{
                              padding: spacing.sm,
                              borderRadius: borderRadius.md,
                              borderWidth: 1,
                              borderColor: colors.border,
                            }}
                          >
                            <MaterialIcons name="close" size={20} color={colors.text.secondary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </OptimizedScrollView>
    </View>
  );
}

