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
import { showSuccessToast, showErrorToast } from '@/lib/toast';

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
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<number>>(new Set());

  // Use centralized mock products - they now include all products with variants
  const productId = id || "prod-1";
  const product = getMockProduct(productId) || getMockProduct("prod-1") || centralizedMockProducts[0];
  
  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: "center", alignItems: "center", padding: spacing.lg }}>
        <MaterialIcons name="error-outline" size={64} color={colors.text.tertiary} />
        <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Product not found
        </Text>
        <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, textAlign: "center", marginBottom: spacing.lg }}>
          The product you're looking for doesn't exist.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/marketplace")}
          style={{
            backgroundColor: colors.accent,
            paddingHorizontal: paddingHorizontal,
            paddingVertical: spacing.md + 2,
            borderRadius: borderRadius.md,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textColors.onAccent }}>
            Browse Marketplace
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[selectedImageIndex];
  const hasValidImage = currentImage && currentImage.trim() !== "" && !imageError;

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
      showErrorToast("Selection Required", "Please select all variant options before adding to cart.");
      return;
    }

    // Validate inventory
    if (product.productType === "physical" && currentInventory > 0) {
      const cartItem = getCartItem(product.id, selectedVariantId);
      const currentCartQuantity = cartItem?.quantity || 0;
      if (currentCartQuantity + quantity > currentInventory) {
        showErrorToast(
          "Insufficient Inventory",
          `Only ${currentInventory} items available. Please adjust your quantity.`
        );
        return;
      }
    } else if (product.productType === "physical" && currentInventory <= 0) {
      showErrorToast("Out of Stock", "This item is currently out of stock.");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedVariantId);
      // Show success toast with option to view cart
      showSuccessToast(
        "Added to Cart",
        `${quantity}x ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ""}`,
        {
          position: "bottom",
          visibilityTime: 4000,
          onPress: () => {
            router.push("/pages/cart");
          },
        }
      );
    } catch (error) {
      showErrorToast("Error", "Failed to add item to cart. Please try again.");
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

  const handleSubscribe = () => {
    if (!subscriptionFrequency || !subscriptionDuration) {
      Alert.alert("Selection Required", "Please select the number of shipments before subscribing.");
      return;
    }

    // Navigate directly to subscription checkout
    router.push(`/pages/subscription-checkout?productId=${product.id}&frequency=${subscriptionFrequency}&duration=${subscriptionDuration}&quantity=${quantity}`);
  };

  const handleSubscriptionSelect = (frequency: SubscriptionFrequency, duration: SubscriptionDuration | null) => {
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
                      // Clear thumbnail error when selecting a new image
                      setThumbnailErrors((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(index);
                        return newSet;
                      });
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
                    {image && image.trim() !== "" && !thumbnailErrors.has(index) ? (
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        {...(Platform.OS !== 'web' && {
                          accessible: false,
                        })}
                        onError={() => {
                          setThumbnailErrors((prev) => new Set(prev).add(index));
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
                {isSubscriptionEnabled && (
                  <TouchableOpacity
                    onPress={handleSubscribe}
                    disabled={!subscriptionDuration}
                    style={{
                      marginTop: spacing.md,
                      backgroundColor: subscriptionDuration ? colors.accent : colors.text.tertiary,
                      paddingVertical: spacing.md + 2,
                      borderRadius: borderRadius.md,
                      alignItems: "center",
                      opacity: subscriptionDuration ? 1 : 0.6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textColors.onAccent,
                      }}
                    >
                      {subscriptionDuration ? "Subscribe & Save" : "Select # of Shipments"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Action Buttons - Only show when subscription is disabled */}
            {!isSubscriptionEnabled && (
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
                        paddingHorizontal: paddingHorizontal,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
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
                          Buy Now
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
                          {formatCurrency(finalTotal, product.currency)}
                        </Text>
                      </View>
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
                      accessibilityLabel={`Buy now for ${formatCurrency(finalTotal, product.currency)}`}
                      accessibilityHint="Double tap to buy now"
                      accessibilityState={{ disabled: variantRequired || (currentInventory <= 0 && product.productType === "physical") }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        flex: 1,
                        backgroundColor: colors.accent,
                        paddingVertical: spacing.md + 2,
                        paddingHorizontal: paddingHorizontal,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
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
                          Buy Now
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
                          {formatCurrency(finalTotal, product.currency)}
                        </Text>
                      </View>
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
                              : `Add ${product.name} to cart for ${formatCurrency(finalTotal, product.currency)}`
                      }
                      accessibilityHint="Double tap to add this product to your cart"
                      accessibilityState={{ disabled: isAddingToCart || variantRequired || (currentInventory <= 0 && product.productType === "physical") }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        flex: 1,
                        backgroundColor: colors.secondary.bg,
                        paddingVertical: spacing.md + 2,
                        paddingHorizontal: paddingHorizontal,
                        borderRadius: borderRadius.md,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.border.light,
                        opacity: isAddingToCart || variantRequired || (currentInventory <= 0 && product.productType === "physical") ? 0.6 : 1,
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
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
                        {!isAddingToCart && !variantRequired && !(currentInventory <= 0 && product.productType === "physical") && (
                          <Text
                            style={{
                              fontSize: typography.fontSize.sm,
                              fontWeight: typography.fontWeight.normal,
                              color: colors.text.secondary,
                              marginTop: spacing.xs / 2,
                            }}
                          >
                            {formatCurrency(finalTotal, product.currency)}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        {/* More from this Store */}
        {(() => {
          // Use centralized mock products
          const otherProducts = centralizedMockProducts.filter(
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
                      {otherProduct.images && otherProduct.images.length > 0 && otherProduct.images[0] && otherProduct.images[0].trim() !== "" ? (
                        <Image
                          source={{ uri: otherProduct.images[0] }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          cachePolicy="memory-disk"
                        />
                      ) : (
                        <ProductPlaceholder width="100%" height={isMobile ? 160 : 200} aspectRatio={1} />
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

