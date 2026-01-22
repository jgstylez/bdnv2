/**
 * Checkout Page
 * 
 * Handles both Buy Now (single product) and Cart checkout flows
 * Includes service fee calculation and payment processing
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
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
import { Currency } from '@/types/wallet';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { Wallet, BankAccountWallet, CreditCardWallet } from '@/types/wallet';
import { getMerchantName } from '@/lib/merchant-lookup';
import { BackButton } from '@/components/navigation/BackButton';
import { mockProducts as centralizedMockProducts, getMockProduct } from '@/data/mocks/products';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Extended wallet type for mock data with additional properties
type MockWallet = Wallet & {
  type?: string;
  name?: string;
  isActive?: boolean;
  isDefault?: boolean;
  availableBalance?: number;
  [key: string]: any;
};

// Use centralized mock products - convert array to Record for lookup
const mockProducts: Record<string, Product> = {};
centralizedMockProducts.forEach((product) => {
  mockProducts[product.id] = product;
});

type CheckoutStep = "review" | "shipping" | "payment" | "processing" | "success" | "error";

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams<{ buyNow?: string; productId?: string; quantity?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { items: cartItems, businessOrders, getSubtotal, getShippingTotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("review");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [useBLKD, setUseBLKD] = useState(true); // Preselected as true
  const [wallets, setWallets] = useState<MockWallet[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Mock wallets - in production, fetch from API/context
  useEffect(() => {
    const mockWallets: MockWallet[] = [
      {
        id: "1",
        userId: "user-1",
        provider: "bdn",
        type: "primary",
        name: "Primary Wallet",
        currency: "USD",
        balance: 1250.75,
        isActive: true,
        isDefault: true,
      },
      {
        id: "2",
        userId: "user-1",
        provider: "bdn",
        type: "myimpact",
        name: "MyImpact Rewards",
        currency: "BLKD",
        balance: 3420,
        isActive: true,
      },
      {
        id: "4",
        userId: "user-1",
        provider: "bdn",
        type: "bankaccount",
        name: "Chase Checking",
        currency: "USD",
        balance: 5432.18,
        availableBalance: 5432.18,
        isActive: true,
        bankName: "Chase",
        accountType: "checking" as const,
        last4: "4321",
      } as MockWallet,
      {
        id: "5",
        userId: "user-1",
        provider: "bdn",
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
      } as MockWallet,
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

  // Get buy now product if exists - try centralized first, then local fallback
  const buyNowProduct = buyNowProductId 
    ? (getMockProduct(buyNowProductId) || mockProducts[buyNowProductId] || null)
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
    setErrorMessage(null);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // TODO: Process payment via API
        // - Create order
        // - Process payment with service fee
        // - Deduct platform fee for businesses
        // - Update inventory
        // - Send confirmation emails

        // Simulate potential errors (for testing - remove in production)
        const shouldFail = false; // Set to true to test error handling
        
        if (shouldFail) {
          throw new Error("Payment processing failed");
        }

        // Generate transaction ID
        const newTransactionId = `TXN-${Date.now()}`;
        setTransactionId(newTransactionId);

        // Clear cart if not Buy Now
        if (!isBuyNow) {
          await clearCart();
        }

        setStep("success");
      } catch (error) {
        // Set user-friendly error message
        setErrorMessage(
          "We couldn't complete your payment right now. Please check your payment method and try again, or contact support if the issue persists."
        );
        setStep("error");
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
      <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Browse Marketplace"
            accessibilityHint="Navigate to marketplace to browse products"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: paddingHorizontal,
              paddingVertical: spacing.md + 2,
              borderRadius: borderRadius.md,
              marginTop: spacing.lg,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textColors.onAccent,
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
      <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Browse Marketplace"
            accessibilityHint="Navigate to marketplace to browse products"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: paddingHorizontal,
              paddingVertical: spacing.md + 2,
              borderRadius: borderRadius.md,
              marginTop: spacing.lg,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textColors.onAccent,
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
                backgroundColor: colors.input,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                borderWidth: 1,
                borderColor: colors.border,
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
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: borderRadius.md,
                        overflow: "hidden",
                        backgroundColor: colors.input,
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
                        {formatCurrency(item.price * item.quantity, item.currency as Currency)}
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
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />

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
                          color: colors.textColors.onAccent,
                        }}
                      >
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}

                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />
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
                  color: colors.textColors.onAccent,
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
                backgroundColor: colors.input,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                borderWidth: 1,
                borderColor: colors.border,
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
                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />
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
                backgroundColor: selectedWalletId || remainingAfterBLKD === 0 ? colors.accent : colors.input,
                paddingVertical: spacing.md + 2,
                paddingHorizontal: paddingHorizontal,
                borderRadius: borderRadius.md,
                alignItems: "center",
                opacity: selectedWalletId || remainingAfterBLKD === 0 ? 1 : 0.5,
              }}
            >
              {remainingAfterBLKD === 0 ? (
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.textColors.onAccent,
                    }}
                  >
                    Complete Purchase
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.normal,
                      color: colors.textColors.onAccent,
                      opacity: 0.9,
                      marginTop: spacing.xs / 2,
                    }}
                  >
                    Fully Paid with BLKD
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.textColors.onAccent,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textColors.onAccent,
                      }}
                    >
                      Complete Purchase
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.normal,
                        color: colors.textColors.onAccent,
                        opacity: 0.9,
                        marginTop: spacing.xs / 2,
                      }}
                    >
                      {formatCurrency(remainingAfterBLKD, "USD")}
                    </Text>
                  </View>
                </Text>
              )}
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
          <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], paddingHorizontal: paddingHorizontal }}>
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
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.sm,
                textAlign: "center",
              }}
            >
              Order Confirmed!
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                marginBottom: spacing.lg,
                textAlign: "center",
              }}
            >
              Your order has been processed successfully. You will receive a confirmation email shortly.
            </Text>
            
            {/* Transaction Details */}
            {transactionId && (
              <View
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.lg,
                  width: "100%",
                  marginBottom: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Transaction ID
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                    {transactionId}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Total Amount
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
                    {formatCurrency(finalTotal, "USD")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Items
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={handleComplete}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View Order History"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: paddingHorizontal,
                paddingVertical: spacing.md + 2,
                borderRadius: borderRadius.md,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textColors.onAccent,
                }}
              >
                View Order History
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "error" && (
          <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], paddingHorizontal: paddingHorizontal }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.status.errorLight,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.lg,
              }}
            >
              <MaterialIcons name="info-outline" size={48} color={colors.status.error} />
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.sm,
                textAlign: "center",
              }}
            >
              Payment Not Completed
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                marginBottom: spacing.lg,
                textAlign: "center",
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {errorMessage || "We couldn't complete your payment right now. Please check your payment method and try again."}
            </Text>
            
            <View style={{ flexDirection: "row", gap: spacing.md, width: "100%" }}>
              <TouchableOpacity
                onPress={() => {
                  setStep("payment");
                  setErrorMessage(null);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Try Again"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  flex: 1,
                  backgroundColor: colors.accent,
                  paddingHorizontal: paddingHorizontal,
                  paddingVertical: spacing.md + 2,
                  borderRadius: borderRadius.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textColors.onAccent,
                  }}
                >
                  Try Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.back()}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Go Back"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  flex: 1,
                  backgroundColor: colors.input,
                  paddingHorizontal: paddingHorizontal,
                  paddingVertical: spacing.md + 2,
                  borderRadius: borderRadius.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

