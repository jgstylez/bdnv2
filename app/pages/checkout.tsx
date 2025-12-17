/**
 * Checkout Page
 * 
 * Handles both Buy Now (single product) and Cart checkout flows
 * Includes service fee calculation and payment processing
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { useCart } from '@/contexts/CartContext';
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '@/lib/fees';
import { formatCurrency } from '@/lib/international';
import { Product } from '@/types/merchant';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { Wallet, BankAccountWallet, CreditCardWallet } from '@/types/wallet';
import { useEffect } from "react";
import { getMerchantName } from '@/lib/merchant-lookup';
import { BackButton } from '@/components/navigation/BackButton';

// Mock product data - in production, fetch by ID
const mockProducts: Record<string, Product> = {
  "prod-1": {
    id: "prod-1",
    merchantId: "merchant-1",
    name: "Premium Black-Owned Coffee Blend",
    description: "Artisan roasted coffee beans from Black-owned farms",
    productType: "physical",
    price: 24.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 150,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop"],
    shippingRequired: true,
    shippingCost: 5.99,
    tags: ["coffee", "beverage", "premium"],
    createdAt: "2024-01-15T10:00:00Z",
  },
};

type CheckoutStep = "review" | "shipping" | "payment" | "processing" | "success";

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams<{ buyNow?: string; productId?: string; quantity?: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();
  const { items: cartItems, businessOrders, getSubtotal, getShippingTotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("review");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [useBLKD, setUseBLKD] = useState(true); // Preselected as true
  const [wallets, setWallets] = useState<Wallet[]>([]);

  // Mock wallets - in production, fetch from API/context
  useEffect(() => {
    const mockWallets: Wallet[] = [
      {
        id: "1",
        type: "primary",
        name: "Primary Wallet",
        currency: "USD",
        balance: 1250.75,
        isActive: true,
        isDefault: true,
      },
      {
        id: "2",
        type: "myimpact",
        name: "MyImpact Rewards",
        currency: "BLKD",
        balance: 3420,
        isActive: true,
      },
      {
        id: "4",
        type: "bankaccount",
        name: "Chase Checking",
        currency: "USD",
        balance: 5432.18,
        availableBalance: 5432.18,
        isActive: true,
        bankName: "Chase",
        accountType: "checking" as const,
        last4: "4321",
      } as BankAccountWallet,
      {
        id: "5",
        type: "creditcard",
        name: "Visa Card",
        currency: "USD",
        balance: 0,
        availableBalance: 5000,
        isActive: true,
        cardBrand: "Visa",
        last4: "8765",
        expirationDate: "12/25",
        cardholderName: "John Doe",
      } as CreditCardWallet,
    ];
    setWallets(mockWallets);

    // Pre-select default wallet
    const defaultWallet = mockWallets.find((w) => w.isDefault && w.currency === "USD");
    if (defaultWallet) {
      setSelectedWalletId(defaultWallet.id);
    }
  }, []);

  const isBuyNow = params?.buyNow === "true";
  const buyNowProductId = params?.productId;
  const buyNowQuantity = parseInt(params?.quantity || "1", 10);

  // Get buy now product if exists
  const buyNowProduct = buyNowProductId && mockProducts[buyNowProductId] 
    ? mockProducts[buyNowProductId] 
    : null;

  // Get items to checkout
  const checkoutItems = isBuyNow && buyNowProduct
    ? [{ ...buyNowProduct, quantity: buyNowQuantity }]
    : cartItems;

  // Determine back button destination
  const getBackDestination = () => {
    if (isBuyNow && buyNowProductId && buyNowProduct) {
      return `/pages/products/${buyNowProductId}`;
    }
    return "/pages/cart";
  };

  const getBackLabel = () => {
    if (isBuyNow && buyNowProduct) {
      return "Back to Product";
    }
    return "Back to Cart";
  };

  // Get business orders for checkout (only if not Buy Now)
  const checkoutBusinessOrders = isBuyNow && buyNowProduct ? [] : businessOrders;

  // Calculate totals
  const subtotal = isBuyNow && buyNowProduct
    ? buyNowProduct.price * buyNowQuantity
    : getSubtotal();

  const shippingTotal = isBuyNow && buyNowProduct
    ? (buyNowProduct.shippingRequired && buyNowProduct.shippingCost
      ? buyNowProduct.shippingCost!
      : 0)
    : getShippingTotal();

  const orderSubtotal = subtotal + shippingTotal;

  // Calculate service fee
  const hasBDNPlus = checkBDNPlusSubscription("current-user-id");
  const feeCalculation = calculateConsumerTotalWithFee(orderSubtotal, "USD", hasBDNPlus);
  const serviceFee = feeCalculation.serviceFee;
  const finalTotal = feeCalculation.total;

  // Get BLKD balance
  const blkdWallet = wallets.find((w) => w.type === "myimpact" && w.currency === "BLKD");
  const blkdBalance = blkdWallet?.balance || 0;

  // Calculate remaining amount after BLKD
  const blkdCoverage = useBLKD && blkdBalance > 0 ? Math.min(blkdBalance, finalTotal) : 0;
  const remainingAfterBLKD = finalTotal - blkdCoverage;

  // Check if user has payment methods before allowing checkout
  useEffect(() => {
    if (wallets.length > 0 && step === "review") {
      const paymentWallets = wallets.filter(
        (w) => w.type !== "myimpact" && w.currency === "USD" && w.isActive
      );
      const blkdWallet = wallets.find((w) => w.type === "myimpact" && w.currency === "BLKD");
      const hasBLKD = blkdWallet && (blkdWallet.balance || 0) >= finalTotal;

      // If no payment methods and BLKD can't cover the full amount, redirect to add payment method
      if (paymentWallets.length === 0 && !hasBLKD) {
        Alert.alert(
          "Payment Method Required",
          "Please add a payment method before checkout.",
          [
            {
              text: "Add Payment Method",
              onPress: () => router.push("/(tabs)/pay"),
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => router.back(),
            },
          ]
        );
      }
    }
  }, [wallets, step, finalTotal, router]);

  const itemCount = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToPayment = () => {
    setStep("payment");
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setStep("processing");

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // TODO: Process payment via API
        // - Create order
        // - Process payment with service fee
        // - Deduct platform fee for businesses
        // - Update inventory
        // - Send confirmation emails

        // Clear cart if not Buy Now
        if (!isBuyNow) {
          await clearCart();
        }

        setStep("success");
      } catch (error) {
        Alert.alert("Payment Failed", "There was an error processing your payment. Please try again.");
        setStep("payment");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleComplete = () => {
    router.push("/pages/transactions");
  };

  // If buy now but product doesn't exist, show error
  if (isBuyNow && !buyNowProduct) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal,
            paddingTop: spacing.lg,
            paddingBottom: spacing["4xl"],
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <MaterialIcons name="error-outline" size={64} color={colors.text.tertiary} />
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
            }}
          >
            Product not found
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
              textAlign: "center",
            }}
          >
            The product you're trying to purchase is no longer available.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/marketplace")}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              marginTop: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Browse Marketplace
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (checkoutItems.length === 0 && !isBuyNow) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal,
            paddingTop: spacing.lg,
            paddingBottom: spacing["4xl"],
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <MaterialIcons name="shopping-cart" size={64} color={colors.text.tertiary} />
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
            }}
          >
            Your cart is empty
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/marketplace")}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              marginTop: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Browse Marketplace
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Back Button */}
        <BackButton label={getBackLabel()} to={getBackDestination()} />

        <HeroSection
          title="Checkout"
          subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        />

        {step === "review" && (
          <View style={{ gap: spacing.xl }}>
            {/* Order Items */}
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.lg,
                }}
              >
                Order Summary
              </Text>

              <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
                {checkoutItems.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: "row",
                      gap: spacing.md,
                      paddingBottom: spacing.md,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.light,
                    }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: borderRadius.md,
                        overflow: "hidden",
                        backgroundColor: colors.secondary.bg,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                      }}
                    >
                      {item.images && item.images.length > 0 && item.images[0] ? (
                        <Image
                          source={{ uri: item.images[0] }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          cachePolicy="memory-disk"
                          onError={() => { }}
                        />
                      ) : (
                        <ProductPlaceholder width="100%" height={80} aspectRatio={1} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {getMerchantName(item.merchantId)} • Quantity: {item.quantity}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(item.price * item.quantity, item.currency)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Price Breakdown */}
              <View style={{ gap: spacing.md }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {formatCurrency(subtotal, "USD")}
                  </Text>
                </View>
                {shippingTotal > 0 && (
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                      Shipping
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                      {formatCurrency(shippingTotal, "USD")}
                    </Text>
                  </View>
                )}
                <View style={{ height: 1, backgroundColor: colors.border.light, marginVertical: spacing.sm }} />

                {/* Service Fee */}
                <FeeBreakdown
                  amount={orderSubtotal}
                  fee={serviceFee}
                  currency="USD"
                  feeType="service"
                  hasBDNPlus={hasBDNPlus}
                  showTotal={false}
                  showTooltip={true}
                />

                {/* BDN+ Savings Banner */}
                {!hasBDNPlus && serviceFee > 0 && (
                  <TouchableOpacity
                    onPress={() => router.push("/pages/bdn-plus")}
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.1)",
                      borderWidth: 1,
                      borderColor: colors.accent,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginTop: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: spacing.md,
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                      <MaterialIcons name="workspace-premium" size={24} color={colors.accent} />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.bold,
                            color: colors.accent,
                            marginBottom: 2,
                          }}
                        >
                          Save {formatCurrency(serviceFee, "USD")} with BDN+
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.secondary,
                          }}
                        >
                          Get 0% service fees on all orders
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push("/pages/bdn-plus")}
                      style={{
                        backgroundColor: colors.accent,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                        }}
                      >
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}

                <View style={{ height: 1, backgroundColor: colors.border.light, marginVertical: spacing.sm }} />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.accent,
                    }}
                  >
                    {formatCurrency(finalTotal, "USD")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Proceed Button */}
            <TouchableOpacity
              onPress={handleProceedToPayment}
              style={{
                backgroundColor: colors.accent,
                paddingVertical: spacing.md + 2,
                borderRadius: borderRadius.md,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Proceed to Payment
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "payment" && (
          <View style={{ gap: spacing.xl }}>
            <PaymentMethodSelector
              wallets={wallets}
              selectedWalletId={selectedWalletId}
              onSelectWallet={setSelectedWalletId}
              totalAmount={remainingAfterBLKD}
              currency="USD"
              blkdBalance={blkdBalance}
              useBLKD={useBLKD}
              onToggleBLKD={setUseBLKD}
              onAddPaymentMethod={() => router.push("/(tabs)/pay")}
            />

            {/* Payment Summary */}
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
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
                }}
              >
                Payment Summary
              </Text>
              <View style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Order Total
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    {formatCurrency(finalTotal, "USD")}
                  </Text>
                </View>
                {useBLKD && blkdCoverage > 0 && (
                  <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                        BLKD Applied
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.base, color: colors.accent }}>
                        -{formatCurrency(blkdCoverage, "BLKD")}
                      </Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: colors.border.light, marginVertical: spacing.sm }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                        }}
                      >
                        Amount to Pay
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(remainingAfterBLKD, "USD")}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Complete Purchase Button */}
            <TouchableOpacity
              onPress={handleProcessPayment}
              disabled={!selectedWalletId && remainingAfterBLKD > 0}
              style={{
                backgroundColor: selectedWalletId || remainingAfterBLKD === 0 ? colors.accent : colors.secondary.bg,
                paddingVertical: spacing.md + 2,
                borderRadius: borderRadius.md,
                alignItems: "center",
                opacity: selectedWalletId || remainingAfterBLKD === 0 ? 1 : 0.5,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                {remainingAfterBLKD === 0
                  ? "Complete Purchase (Fully Paid with BLKD)"
                  : `Complete Purchase - ${formatCurrency(remainingAfterBLKD, "USD")}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "processing" && (
          <View style={{ alignItems: "center", paddingVertical: spacing["4xl"] }}>
            <MaterialIcons name="hourglass-empty" size={64} color={colors.accent} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginTop: spacing.lg,
              }}
            >
              Processing your order...
            </Text>
          </View>
        )}

        {step === "success" && (
          <View style={{ alignItems: "center", paddingVertical: spacing["4xl"] }}>
            <MaterialIcons name="check-circle" size={64} color={colors.status.success} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginTop: spacing.lg,
                marginBottom: spacing.sm,
              }}
            >
              Order Confirmed!
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                marginBottom: spacing.xl,
                textAlign: "center",
              }}
            >
              Your order has been processed successfully. You will receive a confirmation email shortly.
            </Text>
            <TouchableOpacity
              onPress={handleComplete}
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
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                View Order History
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

