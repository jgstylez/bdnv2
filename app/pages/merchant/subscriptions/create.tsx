import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { BackButton } from "@/components/navigation/BackButton";
import { HeroSection } from "@/components/layouts/HeroSection";
import { BusinessSwitcher } from "@/components/BusinessSwitcher";
import { FormInput, FormTextArea } from "@/components/forms";
import { useBusiness } from "@/contexts/BusinessContext";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { formatCurrency } from "@/lib/international";
import { Product } from "@/types/merchant";
import { SubscriptionFrequency, SubscriptionDuration, getFrequencyLabel, getDurationLabel } from "@/types/subscription-box";
import { ProductPlaceholder } from "@/components/ProductPlaceholder";
import { checkMerchantHasBDNPlusBusiness } from "@/lib/subscription-box";

// Mock products - in production, fetch from API filtered by physical products with shipping
const getMockPhysicalProducts = (merchantId: string): Product[] => {
  return [
    {
      id: "1",
      merchantId: merchantId,
      name: "Soul Food Platter",
      description: "Fried chicken, mac & cheese, collard greens, cornbread",
      productType: "physical",
      price: 24.99,
      currency: "USD",
      category: "Food",
      sku: "SFP-001",
      inventory: 50,
      inventoryTracking: "manual",
      isActive: true,
      shippingRequired: true,
      shippingCost: 5.99,
      images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"],
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      merchantId: merchantId,
      name: "BBQ Ribs",
      description: "Slow-cooked ribs with signature sauce",
      productType: "physical",
      price: 32.99,
      currency: "USD",
      category: "Food",
      sku: "BBQ-002",
      inventory: 30,
      inventoryTracking: "manual",
      isActive: true,
      shippingRequired: true,
      shippingCost: 7.99,
      images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=800&fit=crop"],
      createdAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "3",
      merchantId: merchantId,
      name: "Gourmet Coffee Beans",
      description: "Premium roasted coffee beans, 1lb bag",
      productType: "physical",
      price: 18.99,
      currency: "USD",
      category: "Food",
      sku: "GCB-001",
      inventory: 100,
      inventoryTracking: "manual",
      isActive: true,
      shippingRequired: true,
      shippingCost: 4.99,
      images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop"],
      createdAt: "2024-01-25T00:00:00Z",
    },
  ];
};

const frequencies: SubscriptionFrequency[] = ["weekly", "bi-weekly", "monthly", "bi-monthly", "quarterly"];
const durations: SubscriptionDuration[] = [4, 8, 12, 24, -1]; // -1 for ongoing

export default function CreateSubscription() {
  const router = useRouter();
  const { selectedBusiness } = useBusiness();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");
  const [duration, setDuration] = useState<SubscriptionDuration>(12);
  const [discount, setDiscount] = useState("5"); // Default 5% discount
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get physical products with shipping
  const availableProducts = useMemo(() => {
    if (!selectedBusiness?.id) return [];
    return getMockPhysicalProducts(selectedBusiness.id).filter(
      (p) => p.productType === "physical" && p.shippingRequired && p.isActive
    );
  }, [selectedBusiness?.id]);

  // Check if merchant has BDN+ Business
  const hasBDNPlusBusiness = selectedBusiness?.id 
    ? checkMerchantHasBDNPlusBusiness(selectedBusiness.id)
    : false;

  // Update plan name when product is selected
  React.useEffect(() => {
    if (selectedProduct) {
      const frequencyLabel = getFrequencyLabel(frequency);
      setPlanName(`${selectedProduct.name} - ${frequencyLabel}`);
      setDescription(selectedProduct.description || `Recurring delivery of ${selectedProduct.name}`);
    }
  }, [selectedProduct, frequency]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    const frequencyLabel = getFrequencyLabel(frequency);
    setPlanName(`${product.name} - ${frequencyLabel}`);
    setDescription(product.description || `Recurring delivery of ${product.name}`);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      Alert.alert("Product Required", "Please select a product from your inventory.");
      return;
    }

    if (!hasBDNPlusBusiness) {
      Alert.alert(
        "BDN+ Business Required",
        "You need an active BDN+ Business subscription to create subscription plans. Upgrade to continue."
      );
      return;
    }

    if (!planName.trim()) {
      Alert.alert("Plan Name Required", "Please enter a plan name.");
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    Alert.alert(
      "Success",
      `Subscription plan "${planName}" created successfully!`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );

    setIsSubmitting(false);
  };

  const discountPercentage = parseFloat(discount) || 0;
  const discountedPrice = selectedProduct
    ? selectedProduct.price * (1 - discountPercentage / 100)
    : 0;
  const shippingCost = selectedProduct?.shippingCost || 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton />

        <HeroSection
          title="Create Subscription Plan"
          subtitle="Set up recurring deliveries for your physical products"
        />

        {/* Business Switcher */}
        <BusinessSwitcher />

        {/* BDN+ Business Check */}
        {!hasBDNPlusBusiness && (
          <View
            style={{
              backgroundColor: colors.status.warning + "20",
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.status.warning,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="info" size={20} color={colors.status.warning} />
            <Text
              style={{
                flex: 1,
                fontSize: typography.fontSize.sm,
                color: colors.status.warning,
              }}
            >
              BDN+ Business subscription required to create subscription plans.
            </Text>
          </View>
        )}

        {/* Select Product Section */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Select Product
          </Text>
          {availableProducts.length > 0 ? (
            <View style={{ gap: spacing.md }}>
              {availableProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleProductSelect(product)}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${product.name} product, ${formatCurrency(product.price, product.currency)}`}
                  accessibilityState={{ selected: selectedProduct?.id === product.id }}
                  accessibilityHint="Double tap to select this product for subscription"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{
                    backgroundColor:
                      selectedProduct?.id === product.id
                        ? colors.accent + "20"
                        : colors.secondary.bg,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    borderWidth: 2,
                    borderColor:
                      selectedProduct?.id === product.id
                        ? colors.accent
                        : colors.border.light,
                    flexDirection: "row",
                    gap: spacing.md,
                    minHeight: 100, // Ensure proper touch target for product cards
                  }}
                >
                  {/* Product Image */}
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      backgroundColor: colors.input,
                    }}
                  >
                    {product.images && product.images[0] ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                      />
                    ) : (
                      <ProductPlaceholder width="100%" height="100%" />
                    )}
                  </View>

                  {/* Product Info */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {product.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                      numberOfLines={2}
                    >
                      {product.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(product.price, product.currency)}
                      </Text>
                      {product.shippingCost && (
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                          }}
                        >
                          + {formatCurrency(product.shippingCost, product.currency)} shipping
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Selection Indicator */}
                  {selectedProduct?.id === product.id && (
                    <MaterialIcons 
                      name="check-circle" 
                      size={24} 
                      color={colors.accent}
                      accessible={false}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <MaterialIcons name="inventory-2" size={48} color={colors.text.tertiary} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginTop: spacing.md,
                  marginBottom: spacing.xs,
                }}
              >
                No Physical Products Available
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  textAlign: "center",
                  marginBottom: spacing.md,
                }}
              >
                Add physical products with shipping enabled to create subscription plans
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/pages/products/create")}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Add new product"
                accessibilityHint="Opens the form to create a new product"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: borderRadius.md,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  minHeight: 40, // Ensure proper touch target
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: "#ffffff",
                  }}
                >
                  Add Product
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Plan Configuration */}
        {selectedProduct && (
          <>
            <FormInput
              label="Plan Name"
              value={planName}
              onChangeText={setPlanName}
              placeholder="Enter plan name"
              containerStyle={{ marginBottom: spacing.md }}
            />

            <FormTextArea
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe this subscription plan"
              containerStyle={{ marginBottom: spacing.md }}
            />

            {/* Frequency Selection */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Delivery Frequency
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: spacing.sm,
                }}
              >
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    onPress={() => setFrequency(freq)}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${getFrequencyLabel(freq)} delivery frequency`}
                    accessibilityState={{ selected: frequency === freq }}
                    accessibilityHint="Double tap to select this delivery frequency"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{
                      backgroundColor:
                        frequency === freq ? colors.accent : colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      minHeight: 40, // Ensure proper touch target
                      borderWidth: 1,
                      borderColor:
                        frequency === freq ? colors.accent : colors.border.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: frequency === freq ? "#ffffff" : colors.text.primary,
                      }}
                    >
                      {getFrequencyLabel(freq)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration Selection */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Subscription Duration
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: spacing.sm,
                }}
              >
                {durations.map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    onPress={() => setDuration(dur)}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${getDurationLabel(dur)} subscription duration`}
                    accessibilityState={{ selected: duration === dur }}
                    accessibilityHint="Double tap to select this subscription duration"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{
                      backgroundColor:
                        duration === dur ? colors.accent : colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      minHeight: 40, // Ensure proper touch target
                      borderWidth: 1,
                      borderColor:
                        duration === dur ? colors.accent : colors.border.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: duration === dur ? "#ffffff" : colors.text.primary,
                      }}
                    >
                      {getDurationLabel(dur)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Discount */}
            <FormInput
              label="Discount Percentage (Optional)"
              value={discount}
              onChangeText={setDiscount}
              placeholder="5"
              keyboardType="numeric"
              containerStyle={{ marginBottom: spacing.md }}
            />

            {/* Pricing Summary */}
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: colors.border.light,
                marginBottom: spacing.xl,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Pricing Summary
              </Text>
              <View style={{ gap: spacing.sm }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Product Price
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                    {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                  </Text>
                </View>
                {discountPercentage > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Discount ({discountPercentage}%)
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.status.success,
                      }}
                    >
                      -{formatCurrency(
                        selectedProduct.price - discountedPrice,
                        selectedProduct.currency
                      )}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Shipping
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                    {formatCurrency(shippingCost, selectedProduct.currency)}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.border.light,
                    marginVertical: spacing.sm,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Per Shipment
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.accent,
                    }}
                  >
                    {formatCurrency(discountedPrice + shippingCost, selectedProduct.currency)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !hasBDNPlusBusiness}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isSubmitting ? "Creating subscription plan" : "Create subscription plan"}
              accessibilityState={{ disabled: isSubmitting || !hasBDNPlusBusiness }}
              accessibilityHint={!hasBDNPlusBusiness ? "BDN+ Business subscription required" : "Double tap to create the subscription plan"}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                backgroundColor:
                  isSubmitting || !hasBDNPlusBusiness
                    ? colors.text.tertiary
                    : colors.accent,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                minHeight: 48, // Ensure proper touch target
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.xl,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: "#ffffff",
                  }}
                >
                  Creating...
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: "#ffffff",
                  }}
                >
                  Create Subscription Plan
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
