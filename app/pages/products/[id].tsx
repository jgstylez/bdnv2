import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Product } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { useCart } from '@/contexts/CartContext';
import { calculateConsumerTotalWithFee, checkBDNPlusSubscription } from '@/lib/fees';
import { formatCurrency } from '@/lib/international';
import { getMerchantName } from '@/lib/merchant-lookup';
import { checkMerchantHasBDNPlusBusiness, createSubscriptionBoxPlan, calculateSubscriptionBoxPricing } from '@/lib/subscription-box';
import SubscriptionBoxSelector from '@/components/subscription/SubscriptionBoxSelector';
import { SubscriptionFrequency, SubscriptionDuration, getFrequencyLabel } from '@/types/subscription-box';
import VariantSelector from '@/components/products/VariantSelector';
import { mockProducts as centralizedMockProducts, getMockProduct } from '@/data/mocks/products';

// Use centralized mock products, fallback to local mock for products not in centralized data
const localMockProducts: Record<string, Product> = {
  "prod-1": {
    id: "prod-1",
    merchantId: "merchant-1",
    name: "Premium Black-Owned Coffee Blend",
    description: "Artisan roasted coffee beans from Black-owned farms. This premium blend features notes of chocolate, caramel, and a smooth finish. Perfect for coffee enthusiasts who appreciate quality and support Black-owned businesses.",
    productType: "physical",
    price: 24.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 150,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 5.99,
    weight: 1.5,
    tags: ["coffee", "beverage", "premium"],
    createdAt: "2024-01-15T10:00:00Z",
  },
  "prod-2": {
    id: "prod-2",
    merchantId: "merchant-2",
    name: "Handcrafted Leather Wallet",
    description: "Genuine leather wallet with RFID blocking technology. Handcrafted with attention to detail, this premium wallet features multiple card slots, cash compartment, and a sleek design perfect for everyday use.",
    productType: "physical",
    price: 89.99,
    currency: "USD",
    category: "Accessories",
    inventory: 45,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 0,
    weight: 0.3,
    tags: ["leather", "accessories", "premium"],
    createdAt: "2024-01-20T10:00:00Z",
  },
  "prod-3": {
    id: "prod-3",
    merchantId: "merchant-3",
    name: "Natural Hair Care Bundle",
    description: "Complete hair care set for natural hair. Includes shampoo, conditioner, leave-in treatment, and styling products. Made with natural ingredients specifically formulated for curly and coily hair textures.",
    productType: "physical",
    price: 49.99,
    currency: "USD",
    category: "Beauty & Personal Care",
    inventory: 200,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 6.99,
    weight: 1.2,
    tags: ["hair", "beauty", "natural"],
    createdAt: "2024-02-01T10:00:00Z",
  },
  "prod-4": {
    id: "prod-4",
    merchantId: "merchant-4",
    name: "Black History E-Book Collection",
    description: "Comprehensive collection of Black history e-books covering important events, figures, and movements. Includes biographies, historical accounts, and educational materials.",
    productType: "digital",
    price: 19.99,
    currency: "USD",
    category: "Books & Media",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=800&fit=crop"],
    shippingRequired: false,
    downloadUrl: "https://example.com/download",
    downloadLimit: -1,
    tags: ["ebook", "education", "history"],
    createdAt: "2024-01-10T10:00:00Z",
  },
  "prod-5": {
    id: "prod-5",
    merchantId: "merchant-5",
    name: "Business Plan Template Pack",
    description: "Professional business plan templates and guides. Includes financial projections, market analysis templates, and step-by-step guides to help you create a comprehensive business plan.",
    productType: "digital",
    price: 29.99,
    currency: "USD",
    category: "Business Tools",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=800&fit=crop"],
    shippingRequired: false,
    downloadUrl: "https://example.com/download",
    downloadLimit: 5,
    tags: ["business", "template", "digital"],
    createdAt: "2024-01-25T10:00:00Z",
  },
  "prod-6": {
    id: "prod-6",
    merchantId: "merchant-6",
    name: "Professional Resume Review",
    description: "Expert resume review and optimization service. Our professional career coaches will review your resume, provide detailed feedback, and help optimize it for your target positions.",
    productType: "service",
    price: 75.00,
    currency: "USD",
    category: "Professional Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=800&fit=crop"],
    shippingRequired: false,
    duration: "2-3 business days",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["career", "professional", "service"],
    createdAt: "2024-02-05T10:00:00Z",
  },
  "prod-7": {
    id: "prod-7",
    merchantId: "merchant-7",
    name: "Virtual Fitness Coaching",
    description: "One-on-one virtual fitness coaching sessions. Personalized workout plans, nutrition guidance, and ongoing support to help you reach your fitness goals from the comfort of your home.",
    productType: "service",
    price: 60.00,
    currency: "USD",
    category: "Health & Fitness",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop"],
    shippingRequired: false,
    duration: "1 hour",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["fitness", "health", "coaching"],
    createdAt: "2024-02-10T10:00:00Z",
  },
  "prod-8": {
    id: "prod-8",
    merchantId: "merchant-8",
    name: "Custom Logo Design",
    description: "Professional logo design for your business. Our experienced designers will work with you to create a unique, memorable logo that represents your brand identity and resonates with your target audience.",
    productType: "service",
    price: 299.99,
    currency: "USD",
    category: "Design Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=800&fit=crop"],
    shippingRequired: false,
    duration: "5-7 business days",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["design", "logo", "branding"],
    createdAt: "2024-02-15T10:00:00Z",
  },
  "prod-9": {
    id: "prod-9",
    merchantId: "merchant-2",
    name: "Premium T-Shirt",
    description: "High-quality cotton t-shirt available in multiple sizes and colors. Made with sustainable materials and featuring a comfortable fit perfect for everyday wear.",
    productType: "physical",
    price: 29.99,
    currency: "USD",
    category: "Clothing & Apparel",
    inventory: 0, // Base inventory (variants handle actual inventory)
    inventoryTracking: "manual",
    lowStockThreshold: 10,
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 5.99,
    weight: 0.5,
    tags: ["clothing", "apparel", "t-shirt"],
    variantOptions: [
      {
        id: "opt-size",
        name: "Size",
        values: ["Small", "Medium", "Large", "X-Large"],
      },
      {
        id: "opt-color",
        name: "Color",
        values: ["Black", "White", "Navy", "Red"],
      },
    ],
    variants: [
      {
        id: "var-small-black",
        name: "Small / Black",
        options: { Size: "Small", Color: "Black" },
        inventory: 25,
        isActive: true,
        sku: "TSH-S-BLK",
      },
      {
        id: "var-small-white",
        name: "Small / White",
        options: { Size: "Small", Color: "White" },
        inventory: 30,
        isActive: true,
        sku: "TSH-S-WHT",
      },
      {
        id: "var-small-navy",
        name: "Small / Navy",
        options: { Size: "Small", Color: "Navy" },
        inventory: 15,
        isActive: true,
        sku: "TSH-S-NVY",
      },
      {
        id: "var-small-red",
        name: "Small / Red",
        options: { Size: "Small", Color: "Red" },
        inventory: 8,
        isActive: true,
        sku: "TSH-S-RED",
        lowStockThreshold: 10,
      },
      {
        id: "var-medium-black",
        name: "Medium / Black",
        options: { Size: "Medium", Color: "Black" },
        inventory: 45,
        isActive: true,
        sku: "TSH-M-BLK",
      },
      {
        id: "var-medium-white",
        name: "Medium / White",
        options: { Size: "Medium", Color: "White" },
        inventory: 50,
        isActive: true,
        sku: "TSH-M-WHT",
      },
      {
        id: "var-medium-navy",
        name: "Medium / Navy",
        options: { Size: "Medium", Color: "Navy" },
        inventory: 35,
        isActive: true,
        sku: "TSH-M-NVY",
      },
      {
        id: "var-medium-red",
        name: "Medium / Red",
        options: { Size: "Medium", Color: "Red" },
        inventory: 20,
        isActive: true,
        sku: "TSH-M-RED",
      },
      {
        id: "var-large-black",
        name: "Large / Black",
        options: { Size: "Large", Color: "Black" },
        inventory: 40,
        isActive: true,
        sku: "TSH-L-BLK",
      },
      {
        id: "var-large-white",
        name: "Large / White",
        options: { Size: "Large", Color: "White" },
        inventory: 42,
        isActive: true,
        sku: "TSH-L-WHT",
      },
      {
        id: "var-large-navy",
        name: "Large / Navy",
        options: { Size: "Large", Color: "Navy" },
        inventory: 28,
        isActive: true,
        sku: "TSH-L-NVY",
      },
      {
        id: "var-large-red",
        name: "Large / Red",
        options: { Size: "Large", Color: "Red" },
        inventory: 18,
        isActive: true,
        sku: "TSH-L-RED",
      },
      {
        id: "var-xlarge-black",
        name: "X-Large / Black",
        options: { Size: "X-Large", Color: "Black" },
        inventory: 22,
        isActive: true,
        sku: "TSH-XL-BLK",
      },
      {
        id: "var-xlarge-white",
        name: "X-Large / White",
        options: { Size: "X-Large", Color: "White" },
        inventory: 25,
        isActive: true,
        sku: "TSH-XL-WHT",
      },
      {
        id: "var-xlarge-navy",
        name: "X-Large / Navy",
        options: { Size: "X-Large", Color: "Navy" },
        inventory: 12,
        isActive: true,
        sku: "TSH-XL-NVY",
      },
      {
        id: "var-xlarge-red",
        name: "X-Large / Red",
        options: { Size: "X-Large", Color: "Red" },
        inventory: 0,
        isActive: false,
        sku: "TSH-XL-RED",
      },
    ],
    createdAt: "2024-02-20T10:00:00Z",
  },
};

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { addToCart, isInCart, getCartItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<SubscriptionFrequency | null>(null);
  const [subscriptionDuration, setSubscriptionDuration] = useState<SubscriptionDuration | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Try centralized mock products first, then fallback to local mock
  const productId = id || "prod-1";
  const centralizedProduct = getMockProduct(productId);
  const localProduct = localMockProducts[productId] || localMockProducts["prod-1"];
  const product = centralizedProduct || localProduct;
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const hasValidImage = images.length > 0 && images[selectedImageIndex] && !imageError;

  // Get selected variant
  const selectedVariant = selectedVariantId
    ? product.variants?.find((v) => v.id === selectedVariantId)
    : undefined;

  // Get current price (variant price or base price)
  const currentPrice = selectedVariant?.price ?? product.price;

  // Get current inventory (variant inventory or base inventory)
  const currentInventory = selectedVariant
    ? selectedVariant.inventory
    : product.inventory;

  // Check if variant is required
  const hasVariants = product.variants && product.variants.length > 0;
  const variantRequired = hasVariants && !selectedVariant;

  const handleAddToCart = async () => {
    // Validate variant selection
    if (variantRequired) {
      Alert.alert("Selection Required", "Please select all variant options before adding to cart.");
      return;
    }

    // Validate inventory
    if (product.productType === "physical" && currentInventory > 0) {
      const cartItem = getCartItem(product.id, selectedVariantId);
      const currentCartQuantity = cartItem?.quantity || 0;
      if (currentCartQuantity + quantity > currentInventory) {
        Alert.alert(
          "Insufficient Inventory",
          `Only ${currentInventory} items available. Please adjust your quantity.`
        );
        return;
      }
    } else if (product.productType === "physical" && currentInventory <= 0) {
      Alert.alert("Out of Stock", "This item is currently out of stock.");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedVariantId);
      Alert.alert("Success", "Item added to cart!", [
        { text: "OK", onPress: () => router.push("/pages/cart") },
        { text: "Continue Shopping", style: "cancel" },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Navigate directly to checkout with this product
    router.push(`/pages/checkout?buyNow=true&productId=${product.id}&quantity=${quantity}`);
  };

  const handleBookService = () => {
    // TODO: Navigate to booking page for services
    router.push(`/pages/book-service?productId=${product.id}`);
  };

  const handleDownload = () => {
    if (product.downloadUrl) {
      Linking.openURL(product.downloadUrl);
    }
  };

  const incrementQuantity = () => {
    if (product.productType === "physical" && currentInventory > 0) {
      setQuantity(Math.min(quantity + 1, currentInventory));
    } else {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const totalPrice = currentPrice * quantity;
  const shippingCost = product.shippingRequired && product.shippingCost ? product.shippingCost : 0;
  const subtotal = totalPrice + shippingCost;

  // Calculate service fee for Buy Now display
  const hasBDNPlus = checkBDNPlusSubscription("current-user-id");
  const feeCalculation = calculateConsumerTotalWithFee(subtotal, product.currency, hasBDNPlus);
  const finalTotal = feeCalculation.total;

  // Check if merchant has BDN+ Business (required for subscription boxes)
  const merchantHasBDNPlusBusiness = checkMerchantHasBDNPlusBusiness(product.merchantId);
  const canSubscribe = product.productType === "physical" && product.shippingRequired && merchantHasBDNPlusBusiness;

  // Create subscription box plan if applicable
  const subscriptionPlan = canSubscribe && subscriptionFrequency && subscriptionDuration
    ? createSubscriptionBoxPlan(product, subscriptionFrequency, subscriptionDuration, 5) // 5% discount
    : null;

  // Calculate subscription pricing if enabled
  let subscriptionTotal = finalTotal;
  if (isSubscriptionEnabled && subscriptionPlan && subscriptionFrequency && subscriptionDuration) {
    const subscriptionPricing = calculateSubscriptionBoxPricing(
      subscriptionPlan,
      quantity,
      "current-user-id"
    );
    subscriptionTotal = subscriptionPricing.totalPerShipment;
  }

  const handleSubscribe = async () => {
    if (!subscriptionPlan || !subscriptionFrequency || !subscriptionDuration) {
      Alert.alert("Error", "Please select subscription options");
      return;
    }

    setIsSubscribing(true);
    try {
      // TODO: Navigate to subscription checkout/setup page
      // For now, show alert
      Alert.alert(
        "Subscribe & Save",
        `You'll receive ${subscriptionDuration === -1 ? "ongoing" : subscriptionDuration} shipments of ${product.name} ${getFrequencyLabel(subscriptionFrequency).toLowerCase()}.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              // TODO: Navigate to subscription checkout
              router.push(`/pages/subscription-checkout?productId=${product.id}&frequency=${subscriptionFrequency}&duration=${subscriptionDuration}&quantity=${quantity}`);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create subscription. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubscriptionSelect = (frequency: SubscriptionFrequency, duration: SubscriptionDuration) => {
    setSubscriptionFrequency(frequency);
    setSubscriptionDuration(duration);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={Platform.OS === 'android'}
        bounces={Platform.OS !== 'web'}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding + spacing["2xl"], // Extra bottom padding for product detail page
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to previous page"
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.lg,
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
              marginLeft: spacing.sm,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing["2xl"] }}>
          {/* Product Images */}
          <View style={{ flex: isMobile ? undefined : 1 }}>
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: borderRadius.lg,
                overflow: "hidden",
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
                backgroundColor: colors.secondary.bg,
              }}
            >
              {hasValidImage ? (
                <Image
                  source={{ uri: images[selectedImageIndex] }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  {...(Platform.OS !== 'web' && {
                    accessible: true,
                    accessibilityRole: "image" as const,
                    accessibilityLabel: `${product.name} - Main product image ${selectedImageIndex + 1} of ${images.length}`,
                  })}
                  onError={() => setImageError(true)}
                />
              ) : (
                <ProductPlaceholder width="100%" aspectRatio={1} />
              )}
            </View>

            {/* Image Thumbnails */}
            {hasMultipleImages && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={Platform.OS === 'android'}
                scrollEventThrottle={16}
                contentContainerStyle={{ gap: spacing.sm }}
              >
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedImageIndex(index);
                      setImageError(false);
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`View product image ${index + 1} of ${images.length}`}
                    accessibilityState={{ selected: selectedImageIndex === index }}
                    accessibilityHint="Double tap to view this image"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      borderWidth: 2,
                      borderColor: selectedImageIndex === index ? colors.accent : colors.border.light,
                      backgroundColor: colors.secondary.bg,
                    }}
                  >
                    {image ? (
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        accessible={false}
                        onError={() => {
                          if (selectedImageIndex === index) {
                            setImageError(true);
                          }
                        }}
                      />
                    ) : (
                      <ProductPlaceholder width={80} height={80} aspectRatio={1} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Product Info */}
          <View style={{ flex: isMobile ? undefined : 1 }}>
            {/* Product Type Badge */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <View
                style={{
                  backgroundColor:
                    product.productType === "digital"
                      ? colors.status.info
                      : product.productType === "service"
                        ? colors.status.warning
                        : colors.accent,
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
                    textTransform: "uppercase",
                  }}
                >
                  {product.productType === "digital" ? "Digital Product" : product.productType === "service" ? "Service" : "Physical Product"}
                </Text>
              </View>
            </View>

            {/* Product Name */}
            <Text
              style={{
                fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.xs,
              }}
            >
              {product.name}
            </Text>

            {/* Merchant Name */}
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.secondary,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: spacing.md,
              }}
            >
              {getMerchantName(product.merchantId)}
            </Text>

            {/* Rating */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.lg }}>
              <MaterialIcons name="star" size={20} color={colors.accent} />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  marginLeft: spacing.xs,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                4.5
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginLeft: spacing.sm,
                }}
              >
                (123 reviews)
              </Text>
            </View>

            {/* Price */}
            <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", marginBottom: spacing.lg, gap: spacing.xs }}>
              <Text
                style={{
                  fontSize: typography.fontSize["3xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.accent,
                }}
              >
                ${currentPrice.toFixed(2)}
              </Text>
              {selectedVariant && selectedVariant.price !== undefined && selectedVariant.price !== product.price && (
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    textDecorationLine: "line-through",
                }}
              >
                ${product.price.toFixed(2)}
              </Text>
              )}
              {product.shippingCost !== undefined && product.shippingCost > 0 && (
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                  }}
                >
                  + ${product.shippingCost.toFixed(2)} shipping
                </Text>
              )}
              {product.shippingRequired === false && (
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.textColors.success, // Use lighter green for better contrast
                  }}
                >
                  Free shipping
                </Text>
              )}
            </View>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg }}>
                {product.tags.map((tag) => (
                  <View
                    key={tag}
                    style={{
                      backgroundColor: colors.accentLight,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xs,
                      borderRadius: borderRadius.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.accent,
                        fontWeight: typography.fontWeight.semibold,
                      }}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Description */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {product.description}
              </Text>
            </View>

            {/* Variant Selector */}
            {hasVariants && (
              <View style={{ marginBottom: spacing.lg }}>
                <VariantSelector
                  product={product}
                  selectedVariantId={selectedVariantId}
                  onVariantSelect={setSelectedVariantId}
                  showInventory={true}
                />
              </View>
            )}

            {/* Product Type Specific Info */}
            {product.productType === "physical" && !hasVariants && (
              <>
                {currentInventory > 0 && (
                  <View style={{ marginBottom: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.textColors.success, // Use lighter green for better contrast
                        fontWeight: typography.fontWeight.semibold,
                      }}
                    >
                      In Stock ({currentInventory} available)
                    </Text>
                  </View>
                )}
                {product.weight && (
                  <View style={{ marginBottom: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.secondary,
                      }}
                    >
                      Weight: {product.weight} lbs
                    </Text>
                  </View>
                )}
              </>
            )}

            {product.productType === "digital" && (
              <>
                <View style={{ marginBottom: spacing.md }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                    }}
                  >
                    Instant download
                  </Text>
                  {product.downloadLimit && product.downloadLimit > 0 && (
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.secondary,
                        marginTop: spacing.xs,
                      }}
                    >
                      Download limit: {product.downloadLimit} times
                    </Text>
                  )}
                </View>
              </>
            )}

            {product.productType === "service" && (
              <>
                {product.duration && (
                  <View style={{ marginBottom: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.secondary,
                      }}
                    >
                      Duration: {product.duration}
                    </Text>
                  </View>
                )}
                {product.serviceLocation && (
                  <View style={{ marginBottom: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        color: colors.text.secondary,
                      }}
                    >
                      Location: {product.serviceLocation === "remote" ? "Remote" : product.serviceLocation === "in-store" ? "In-Store" : product.serviceLocation === "on-site" ? "On-Site" : "Hybrid"}
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Quantity Selector (for physical products) */}
            {product.productType === "physical" && (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.lg, gap: spacing.md }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Quantity:
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <TouchableOpacity
                    onPress={decrementQuantity}
                    disabled={quantity <= 1}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: borderRadius.sm,
                      backgroundColor: colors.secondary.bg,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      opacity: quantity <= 1 ? 0.5 : 1,
                    }}
                  >
                    <MaterialIcons name="remove" size={20} color={colors.text.primary} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                      minWidth: 40,
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={incrementQuantity}
                    disabled={currentInventory > 0 && quantity >= currentInventory}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: borderRadius.sm,
                      backgroundColor: colors.secondary.bg,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      opacity: currentInventory > 0 && quantity >= currentInventory ? 0.5 : 1,
                    }}
                  >
                    <MaterialIcons name="add" size={20} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Subscription Box Option (BDN+ Business feature) */}
            {canSubscribe && (
              <View style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
                <SubscriptionBoxSelector
                  plan={subscriptionPlan || createSubscriptionBoxPlan(product, "monthly", 12, 5)}
                  quantity={quantity}
                  userId="current-user-id"
                  onSelect={handleSubscriptionSelect}
                  selectedFrequency={subscriptionFrequency || undefined}
                  selectedDuration={subscriptionDuration || undefined}
                  onSubscriptionToggle={setIsSubscriptionEnabled}
                  isSubscriptionEnabled={isSubscriptionEnabled}
                />
                {isSubscriptionEnabled && subscriptionFrequency && subscriptionDuration && (
                  <TouchableOpacity
                    onPress={handleSubscribe}
                    disabled={isSubscribing}
                    style={{
                      marginTop: spacing.md,
                      backgroundColor: colors.accent,
                      paddingVertical: spacing.md + 2,
                      borderRadius: borderRadius.md,
                      alignItems: "center",
                      opacity: isSubscribing ? 0.6 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textColors.onAccent,
                      }}
                    >
                      {isSubscribing ? "Processing..." : "Subscribe & Save"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
              {product.productType === "service" ? (
                <TouchableOpacity
                  onPress={handleBookService}
                  style={{
                    flex: 1,
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
                    Book Service
                  </Text>
                </TouchableOpacity>
              ) : product.productType === "digital" ? (
                <>
                  <TouchableOpacity
                    onPress={handleBuyNow}
                    style={{
                      flex: 1,
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
                      Buy Now - {formatCurrency(finalTotal, product.currency)}
                    </Text>
                  </TouchableOpacity>
                  {product.downloadUrl && (
                    <TouchableOpacity
                      onPress={handleDownload}
                      style={{
                        flex: 1,
                        backgroundColor: colors.secondary.bg,
                        paddingVertical: spacing.md + 2,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.border.light,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                        }}
                      >
                        Preview Download
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleBuyNow}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Buy now for ${formatCurrency(isSubscriptionEnabled ? subscriptionTotal : finalTotal, product.currency)}`}
                    accessibilityHint={isSubscriptionEnabled ? "Double tap to buy now with subscription" : "Double tap to buy now"}
                    accessibilityState={{ disabled: variantRequired || (currentInventory <= 0 && product.productType === "physical") }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      flex: 1,
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
                      Buy Now - {formatCurrency(isSubscriptionEnabled ? subscriptionTotal : finalTotal, product.currency)}
                    </Text>
                    {isSubscriptionEnabled && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                          marginTop: spacing.xs / 2,
                        }}
                      >
                        Per shipment
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddToCart}
                    disabled={isAddingToCart || variantRequired || (currentInventory <= 0 && product.productType === "physical")}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isAddingToCart
                        ? "Adding to cart"
                        : variantRequired
                          ? "Select options to add to cart"
                          : currentInventory <= 0 && product.productType === "physical"
                            ? "Out of stock"
                            : `Add ${product.name} to cart`
                    }
                    accessibilityHint="Double tap to add this product to your cart"
                    accessibilityState={{ disabled: isAddingToCart || variantRequired || (currentInventory <= 0 && product.productType === "physical") }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      flex: 1,
                      backgroundColor: colors.secondary.bg,
                      paddingVertical: spacing.md + 2,
                      borderRadius: borderRadius.md,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: colors.border.light,
                      opacity: isAddingToCart || variantRequired || (currentInventory <= 0 && product.productType === "physical") ? 0.6 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                      }}
                    >
                      {isAddingToCart
                        ? "Adding..."
                        : variantRequired
                          ? "Select Options"
                          : currentInventory <= 0 && product.productType === "physical"
                            ? "Out of Stock"
                            : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {/* More from this Store */}
        {(() => {
          // Get other products from the same merchant
          const otherProducts = Object.values(mockProducts).filter(
            (p) => p.merchantId === product.merchantId && p.id !== product.id && p.isActive
          ).slice(0, 6); // Limit to 6 products

          if (otherProducts.length === 0) return null;

          // Extract business ID from merchantId (merchant-1 -> 1)
          const businessId = product.merchantId.replace("merchant-", "");

          return (
            <View 
              style={{ 
                marginTop: isMobile ? spacing.xl * 2 : spacing.xl * 3,
                paddingTop: isMobile ? spacing.xl : spacing.xl * 1.5,
                paddingBottom: isMobile ? spacing.lg : spacing.xl,
                borderTopWidth: 1,
                borderTopColor: colors.border.light,
              }}
            >
              {/* Section Header */}
              <View 
                style={{ 
                  paddingHorizontal: 0,
                  marginBottom: isMobile ? spacing.lg : spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  More from {getMerchantName(product.merchantId)}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                  }}
                >
                  Discover more products from this business
                </Text>
              </View>

              {/* Products Grid */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={Platform.OS === 'android'}
                scrollEventThrottle={16}
                contentContainerStyle={{ 
                  gap: isMobile ? spacing.md : spacing.lg, 
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                {otherProducts.map((otherProduct) => (
                  <TouchableOpacity
                    key={otherProduct.id}
                    onPress={() => router.push(`/pages/products/${otherProduct.id}`)}
                    style={{
                      width: isMobile ? 160 : 200,
                      backgroundColor: colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: colors.border.light,
                    }}
                  >
                    {/* Product Image */}
                    <View style={{ width: "100%", height: isMobile ? 160 : 200, backgroundColor: colors.secondary.bg }}>
                      {otherProduct.images && otherProduct.images.length > 0 ? (
                        <Image
                          source={{ uri: otherProduct.images[0] }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
cachePolicy="memory-disk"
                        />
                      ) : (
                        <ProductPlaceholder width="100%" height="100%" />
                      )}
                    </View>

                    {/* Product Info */}
                    <View style={{ padding: isMobile ? spacing.md : spacing.lg }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                          minHeight: isMobile ? 36 : 40,
                          lineHeight: isMobile ? 18 : 20,
                        }}
                      >
                        {otherProduct.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(otherProduct.price, otherProduct.currency)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Bottom Action Buttons */}
              <View 
                style={{ 
                  flexDirection: "row",
                  gap: spacing.md,
                  paddingHorizontal: 0,
                  marginTop: isMobile ? spacing.lg : spacing.xl,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/pages/businesses/${businessId}`)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.xs,
                    paddingVertical: isMobile ? spacing.md : spacing.lg,
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.accent,
                    }}
                  >
                    Visit Business Details
                  </Text>
                  <MaterialIcons name="arrow-forward" size={18} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push(`/pages/products/list?merchant=${product.merchantId}`)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.xs,
                    paddingVertical: isMobile ? spacing.md : spacing.lg,
                    backgroundColor: colors.accent,
                    borderRadius: borderRadius.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.textColors.onAccent,
                    }}
                  >
                    View All Products
                  </Text>
                  <MaterialIcons name="arrow-forward" size={18} color={colors.textColors.onAccent} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })()}
      </ScrollView>
    </View>
  );
}

