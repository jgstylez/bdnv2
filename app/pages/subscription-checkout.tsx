import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { getMockProduct } from "@/data/mocks/products";
import { formatCurrency } from "@/lib/international";
import { getMerchantName } from "@/lib/merchant-lookup";
import { createSubscriptionBoxPlan, calculateSubscriptionBoxPricing } from "@/lib/subscription-box";
import { getFrequencyLabel, getDurationLabel, SubscriptionFrequency, SubscriptionDuration } from "@/types/subscription-box";
import { ProductPlaceholder } from "@/components/ProductPlaceholder";
import { Image } from "expo-image";

type CheckoutStep = "review" | "payment" | "processing" | "success";

export default function SubscriptionCheckout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { productId, frequency, duration, quantity: quantityParam } = useLocalSearchParams<{
    productId: string;
    frequency: string;
    duration: string;
    quantity: string;
  }>();

  const [step, setStep] = useState<CheckoutStep>("review");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>("card-1");

  // Get product and calculate pricing
  const product = getMockProduct(productId || "prod-1");
  const quantity = parseInt(quantityParam || "1", 10);
  const subscriptionFrequency = (frequency || "monthly") as SubscriptionFrequency;
  const subscriptionDuration = parseInt(duration || "12", 10) as SubscriptionDuration;

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: "center", alignItems: "center", padding: spacing.lg }}>
        <MaterialIcons name="error-outline" size={64} color={colors.text.tertiary} />
        <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginTop: spacing.lg }}>
          Product not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: spacing.lg, backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md }}
        >
          <Text style={{ color: colors.textColors.onAccent, fontWeight: typography.fontWeight.semibold }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const subscriptionPlan = createSubscriptionBoxPlan(product, subscriptionFrequency, subscriptionDuration, 5);
  const pricing = calculateSubscriptionBoxPricing(subscriptionPlan, quantity, "current-user-id");

  // Mock payment methods
  const paymentMethods = [
    { id: "card-1", type: "card", label: "Visa ending in 4242", icon: "credit-card" },
    { id: "wallet-1", type: "wallet", label: "BDN Wallet ($245.00)", icon: "account-balance-wallet" },
  ];

  const handleConfirmSubscription = async () => {
    setIsProcessing(true);
    setStep("processing");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsProcessing(false);
    setStep("success");
  };

  const renderReviewStep = () => (
    <>
      {/* Product Summary Card */}
      <View style={{ backgroundColor: colors.secondary.bg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.light }}>
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {/* Product Image */}
          <View style={{ width: 80, height: 80, borderRadius: borderRadius.md, overflow: "hidden", backgroundColor: colors.background.primary }}>
            {product.images && 
             product.images.length > 0 && 
             product.images[0] && 
             product.images[0].trim() !== "" ? (
              <Image 
                source={{ uri: product.images[0] }} 
                style={{ width: "100%", height: "100%" }} 
                contentFit="cover"
                cachePolicy="memory-disk"
                onError={() => {
                  // Error handled by showing placeholder
                }}
              />
            ) : (
              <ProductPlaceholder width={80} height={80} />
            )}
          </View>

          {/* Product Details */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.xs }}>
              {product.name}
            </Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.sm }}>
              {getMerchantName(product.merchantId)}
            </Text>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
              Qty: {quantity}
            </Text>
          </View>
        </View>
      </View>

      {/* Subscription Details */}
      <View style={{ backgroundColor: colors.secondary.bg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.light }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
          <MaterialIcons name="repeat" size={24} color={colors.accent} />
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginLeft: spacing.sm }}>
            Subscription Details
          </Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Delivery Frequency</Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.medium }}>
              {getFrequencyLabel(subscriptionFrequency)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Number of Shipments</Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.medium }}>
              {getDurationLabel(subscriptionDuration)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>First Delivery</Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, fontWeight: typography.fontWeight.medium }}>
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Savings Badge */}
        {pricing.discountAmount && pricing.discountAmount > 0 && (
          <View style={{ marginTop: spacing.md, padding: spacing.sm, backgroundColor: colors.status.success + "15", borderRadius: borderRadius.sm, flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="savings" size={18} color={colors.textColors.success} />
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.textColors.success, marginLeft: spacing.xs, fontWeight: typography.fontWeight.semibold }}>
              You save {formatCurrency(pricing.discountAmount, pricing.currency)} per shipment!
            </Text>
          </View>
        )}
      </View>

      {/* Pricing Breakdown */}
      <View style={{ backgroundColor: colors.secondary.bg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.light }}>
        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
          Pricing Summary
        </Text>

        <View style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Price per shipment</Text>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>{formatCurrency(pricing.pricePerShipment, pricing.currency)}</Text>
          </View>

          {pricing.shippingPerShipment > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Shipping</Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>{formatCurrency(pricing.shippingPerShipment, pricing.currency)}</Text>
            </View>
          )}

          {pricing.discountAmount && pricing.discountAmount > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.textColors.success }}>Subscription Discount (5%)</Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.textColors.success }}>-{formatCurrency(pricing.discountAmount, pricing.currency)}</Text>
            </View>
          )}

          {pricing.serviceFeePerShipment > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Service Fee</Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>{formatCurrency(pricing.serviceFeePerShipment, pricing.currency)}</Text>
            </View>
          )}

          <View style={{ borderTopWidth: 1, borderTopColor: colors.border.light, marginTop: spacing.sm, paddingTop: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>Per Shipment</Text>
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.accent }}>{formatCurrency(pricing.totalPerShipment, pricing.currency)}</Text>
            </View>
            {subscriptionDuration !== -1 && (
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, textAlign: "right", marginTop: spacing.xs }}>
                Total for {subscriptionDuration} shipments: {formatCurrency(pricing.totalPerShipment * subscriptionDuration, pricing.currency)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Payment Method Selection */}
      <View style={{ backgroundColor: colors.secondary.bg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.light }}>
        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md }}>
          Payment Method
        </Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => setSelectedPaymentMethod(method.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: spacing.md,
              borderRadius: borderRadius.md,
              borderWidth: 2,
              borderColor: selectedPaymentMethod === method.id ? colors.accent : colors.border.light,
              backgroundColor: selectedPaymentMethod === method.id ? colors.accent + "10" : "transparent",
              marginBottom: spacing.sm,
            }}
          >
            <MaterialIcons name={method.icon as any} size={24} color={selectedPaymentMethod === method.id ? colors.accent : colors.text.secondary} />
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, marginLeft: spacing.md, flex: 1 }}>{method.label}</Text>
            {selectedPaymentMethod === method.id && <MaterialIcons name="check-circle" size={24} color={colors.accent} />}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border.light, borderStyle: "dashed" }}
        >
          <MaterialIcons name="add" size={24} color={colors.accent} />
          <Text style={{ fontSize: typography.fontSize.base, color: colors.accent, marginLeft: spacing.md }}>Add New Payment Method</Text>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <View style={{ padding: spacing.md, marginBottom: spacing.lg }}>
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, textAlign: "center", lineHeight: typography.lineHeight.relaxed }}>
          By subscribing, you agree to be charged {formatCurrency(pricing.totalPerShipment, pricing.currency)} {getFrequencyLabel(subscriptionFrequency).toLowerCase()} for{" "}
          {subscriptionDuration === -1 ? "ongoing deliveries" : `${subscriptionDuration} shipments`}. You can cancel or modify your subscription at any time from your account settings.
        </Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        onPress={handleConfirmSubscription}
        disabled={!selectedPaymentMethod}
        style={{
          backgroundColor: selectedPaymentMethod ? colors.accent : colors.text.tertiary,
          paddingVertical: spacing.lg,
          borderRadius: borderRadius.md,
          alignItems: "center",
          opacity: selectedPaymentMethod ? 1 : 0.6,
        }}
      >
        <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textColors.onAccent }}>
          Confirm Subscription
        </Text>
        <Text style={{ fontSize: typography.fontSize.sm, color: colors.textColors.onAccent, opacity: 0.9, marginTop: spacing.xs }}>
          First charge: {formatCurrency(pricing.totalPerShipment, pricing.currency)}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderProcessingStep = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginTop: spacing.xl, textAlign: "center" }}>
        Setting up your subscription...
      </Text>
      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, marginTop: spacing.sm, textAlign: "center" }}>
        Please wait while we process your order
      </Text>
    </View>
  );

  const renderSuccessStep = () => (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: paddingHorizontal,
        paddingTop: Platform.OS === "web" ? 20 : 36,
        paddingBottom: scrollViewBottomPadding,
        alignItems: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: "center", marginTop: spacing["2xl"], marginBottom: spacing.xl, width: "100%", maxWidth: 500 }}>
        {/* Success Icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.status.success,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.lg,
          }}
        >
          <MaterialIcons name="check" size={48} color={colors.text.primary} />
        </View>

        {/* Success Message */}
        <Text
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
            textAlign: "center",
          }}
        >
          Subscription Created!
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            textAlign: "center",
            marginBottom: spacing.xl,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          Your subscription for {product.name} has been successfully set up. You'll receive your first shipment within 3-5 business days.
        </Text>

        {/* Subscription Summary Card */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            width: "100%",
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
              textAlign: "center",
            }}
          >
            Subscription Details
          </Text>

          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <MaterialIcons name="inventory" size={18} color={colors.accent} />
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Product</Text>
              </View>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                {product.name}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <MaterialIcons name="repeat" size={18} color={colors.accent} />
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Frequency</Text>
              </View>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                {getFrequencyLabel(subscriptionFrequency)}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <MaterialIcons name="local-shipping" size={18} color={colors.accent} />
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Shipments</Text>
              </View>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                {getDurationLabel(subscriptionDuration)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: spacing.sm,
                borderTopWidth: 1,
                borderTopColor: colors.border.light,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <MaterialIcons name="attach-money" size={18} color={colors.accent} />
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Per Shipment</Text>
              </View>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
                {formatCurrency(pricing.totalPerShipment, pricing.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Confirmation Number */}
        <View
          style={{
            backgroundColor: colors.accent + "10",
            borderRadius: borderRadius.md,
            padding: spacing.md,
            width: "100%",
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.accent + "30",
          }}
        >
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.accent, textAlign: "center" }}>Subscription ID</Text>
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.accent, textAlign: "center", marginTop: spacing.xs }}>
            SUB-{Date.now().toString(36).toUpperCase()}
          </Text>
        </View>

        {/* Info Box */}
        <View
          style={{
            backgroundColor: colors.status.success + "15",
            borderRadius: borderRadius.md,
            padding: spacing.md,
            width: "100%",
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.status.success + "30",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: spacing.sm,
          }}
        >
          <MaterialIcons name="info" size={20} color={colors.textColors.success} />
          <Text
            style={{
              flex: 1,
              fontSize: typography.fontSize.sm,
              color: colors.text.primary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            You can manage, pause, or cancel your subscription anytime from your account settings.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ width: "100%", gap: spacing.md }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/account/subscriptions")}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              alignItems: "center",
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.textColors.onAccent,
              }}
            >
              Manage Subscriptions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/marketplace")}
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />

      {/* Header */}
      {step !== "success" && step !== "processing" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: Platform.OS === "ios" ? insets.top : spacing.md,
            paddingBottom: spacing.md,
            paddingHorizontal: paddingHorizontal,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.light,
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: spacing.md }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary, flex: 1 }}>Subscribe & Save</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="lock" size={16} color={colors.textColors.success} />
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.textColors.success, marginLeft: spacing.xs }}>Secure</Text>
          </View>
        </View>
      )}

      {step === "processing" ? (
        renderProcessingStep()
      ) : step === "success" ? (
        renderSuccessStep()
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: paddingHorizontal,
            paddingTop: spacing.lg,
            paddingBottom: insets.bottom + spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderReviewStep()}
        </ScrollView>
      )}
    </View>
  );
}
