/**
 * Order Confirmation Page
 * 
 * Displays order confirmation details after successful checkout
 */

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { formatCurrency } from "@/lib/international";
import { Currency } from "@/types/wallet";
import { ProductPlaceholder } from "@/components/ProductPlaceholder";
import { BackButton } from "@/components/navigation/BackButton";
import { OptimizedScrollView } from "@/components/optimized/OptimizedScrollView";
import { HeroSection } from "@/components/layouts/HeroSection";

const getTrackingStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return colors.status.success;
    case "shipped":
    case "in-transit":
    case "out-for-delivery":
      return colors.accent;
    case "processing":
    case "confirmed":
      return "#2196f3";
    case "cancelled":
      return colors.status.error;
    default:
      return colors.text.secondary;
  }
};

// Mock order data - in production, fetch from API using orderId
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  variantName?: string;
}

interface OrderTracking {
  status: "pending" | "confirmed" | "processing" | "shipped" | "in-transit" | "out-for-delivery" | "delivered" | "cancelled";
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
  events?: Array<{
    timestamp: string;
    location?: string;
    description: string;
    status: string;
  }>;
}

interface OrderData {
  id: string;
  orderNumber: string;
  transactionId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  serviceFee: number;
  total: number;
  currency: Currency;
  paymentMethod: string;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  merchantName?: string;
  tracking?: OrderTracking;
}

export default function OrderConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; transactionId?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch order from API
    // For now, use mock data or data from navigation params
    const loadOrder = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock order data - in production, fetch from API
      const mockOrder: OrderData = {
        id: params.id || `order-${Date.now()}`,
        orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
        transactionId: params.transactionId || `TXN-${Date.now()}`,
        items: [
          {
            id: "item-1",
            productId: "prod-1",
            name: "Sample Product",
            quantity: 1,
            price: 29.99,
            imageUrl: undefined,
          },
        ],
        subtotal: 29.99,
        shippingCost: 5.99,
        serviceFee: 2.99,
        total: 38.97,
        currency: "USD" as Currency,
        paymentMethod: "Primary Wallet",
        createdAt: new Date().toISOString(),
        merchantName: "Sample Business",
        tracking: {
          status: "confirmed",
          carrier: "USPS",
          trackingNumber: "9400111899223197428490",
          trackingUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223197428490",
          estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          events: [
            {
              timestamp: new Date().toISOString(),
              location: "New York, NY",
              description: "Order confirmed",
              status: "confirmed",
            },
          ],
        },
      };

      setOrder(mockOrder);
      setLoading(false);
    };

    loadOrder();
  }, [params.id, params.transactionId]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text.secondary }}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <OptimizedScrollView
          contentContainerStyle={{
            paddingHorizontal,
            paddingTop: spacing.lg,
            paddingBottom: scrollViewBottomPadding,
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <MaterialIcons name="error-outline" size={64} color={colors.text.tertiary} />
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
            }}
          >
            Order not found
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
              textAlign: "center",
            }}
          >
            We couldn't find this order. Please check your order history.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/pages/transactions")}
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
              View Orders
            </Text>
          </TouchableOpacity>
        </OptimizedScrollView>
      </View>
    );
  }

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
        <BackButton label="Back to Orders" to="/pages/transactions" />

        <HeroSection
          title="Order Confirmed!"
          subtitle={`Order #${order.orderNumber}`}
        />

        {/* Success Icon */}
        <View
          style={{
            alignItems: "center",
            marginBottom: spacing.xl,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.status.success + "20",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons name="check-circle" size={64} color={colors.status.success} />
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              maxWidth: 500,
            }}
          >
            Your order has been processed successfully. You will receive a confirmation email shortly.
          </Text>
        </View>

        {/* Order Items */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Order Items
          </Text>
          <View style={{ gap: spacing.md }}>
            {order.items.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  gap: spacing.md,
                  paddingBottom: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 60, height: 60, borderRadius: borderRadius.md }}
                    contentFit="cover"
                  />
                ) : (
                  <ProductPlaceholder width={60} height={60} aspectRatio={1} />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold as any,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.variantName && (
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {item.variantName}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                    }}
                  >
                    Quantity: {item.quantity} × {formatCurrency(item.price, order.currency)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold as any,
                    color: colors.text.primary,
                  }}
                >
                  {formatCurrency(item.price * item.quantity, order.currency)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Order Summary
          </Text>
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                Subtotal
              </Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                {formatCurrency(order.subtotal, order.currency)}
              </Text>
            </View>
            {order.shippingCost > 0 && (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                  Shipping
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {formatCurrency(order.shippingCost, order.currency)}
                </Text>
              </View>
            )}
            {order.serviceFee > 0 && (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                  Service Fee
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {formatCurrency(order.serviceFee, order.currency)}
                </Text>
              </View>
            )}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.border,
                marginTop: spacing.sm,
                paddingTop: spacing.sm,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold as any,
                  color: colors.text.primary,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold as any,
                  color: colors.accent,
                }}
              >
                {formatCurrency(order.total, order.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Order Details
          </Text>
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Order Number
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                {order.orderNumber}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Transaction ID
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                {order.transactionId}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Payment Method
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                {order.paymentMethod}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Order Date
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            {order.merchantName && (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Merchant
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                  {order.merchantName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Tracking */}
        {order.tracking && (
          <View
            style={{
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold as any,
                  color: colors.text.primary,
                }}
              >
                Order Tracking
              </Text>
              <View
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: borderRadius.sm,
                  backgroundColor: getTrackingStatusColor(order.tracking.status) + "20",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold as any,
                    color: getTrackingStatusColor(order.tracking.status),
                    textTransform: "capitalize",
                  }}
                >
                  {order.tracking.status.replace("-", " ")}
                </Text>
              </View>
            </View>

            {order.tracking.trackingNumber && (
              <View style={{ marginBottom: spacing.md }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Tracking Number
                  </Text>
                  {order.tracking.trackingUrl && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(order.tracking.trackingUrl!)}
                      style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}
                    >
                      <Text style={{ fontSize: typography.fontSize.sm, color: colors.accent }}>
                        Track on {order.tracking.carrier || "Carrier"} Website
                      </Text>
                      <MaterialIcons name="open-in-new" size={16} color={colors.accent} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                  {order.tracking.trackingNumber}
                </Text>
                {order.tracking.carrier && (
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 2 }}>
                    Carrier: {order.tracking.carrier}
                  </Text>
                )}
              </View>
            )}

            {order.tracking.estimatedDeliveryDate && (
              <View style={{ marginBottom: spacing.md }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                  Estimated Delivery
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                  {new Date(order.tracking.estimatedDeliveryDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            )}

            {order.tracking.events && order.tracking.events.length > 0 && (
              <View>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.sm }}>
                  Tracking History
                </Text>
                <View style={{ gap: spacing.sm }}>
                  {order.tracking.events.map((event, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        gap: spacing.md,
                        paddingLeft: spacing.md,
                        borderLeftWidth: 2,
                        borderLeftColor: index === order.tracking!.events!.length - 1 ? colors.accent : colors.border,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as any, color: colors.text.primary }}>
                          {event.description}
                        </Text>
                        {event.location && (
                          <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: 2 }}>
                            {event.location}
                          </Text>
                        )}
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginTop: 2 }}>
                          {new Date(event.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <View
            style={{
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Shipping Address
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
              {order.shippingAddress.name}
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
              {order.shippingAddress.street}
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
              {order.shippingAddress.country}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/transactions")}
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
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.textColors.onAccent,
              }}
            >
              View All Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/marketplace")}
            style={{
              backgroundColor: colors.secondary,
              paddingVertical: spacing.md + 2,
              paddingHorizontal: paddingHorizontal,
              borderRadius: borderRadius.md,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold as any,
                color: colors.text.primary,
              }}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </OptimizedScrollView>
    </View>
  );
}
