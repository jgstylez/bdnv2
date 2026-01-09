import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Product } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/constants/theme';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { HeroSection } from '@/components/layouts/HeroSection';
import { getMerchantName } from '@/lib/merchant-lookup';
import { mockProducts as centralizedMockProducts, getProductsByType, getFeaturedProducts, getTrendingProducts } from '@/data/mocks/products';

// Use centralized mock products
const mockProducts: Product[] = centralizedMockProducts;

interface ProductCarouselProps {
  title: string;
  products: Product[];
  onProductPress: (product: Product) => void;
  section?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  products,
  onProductPress,
  section,
}) => {
  const { isMobile, paddingHorizontal } = useResponsive();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  if (products.length === 0) return null;

  // Calculate card width to show at least 2.5 cards on mobile
  const getCardWidth = () => {
    if (!isMobile) return 200;
    
    // Available width = screen width - left padding - right padding (spacing.md)
    const availableWidth = width - paddingHorizontal - spacing.md;
    // For 2.5 cards: 2.5 * cardWidth + 1.5 * gap = availableWidth
    // gap = spacing.sm (typically 8px)
    const gap = spacing.sm;
    const cardWidth = (availableWidth - (1.5 * gap)) / 2.5;
    
    // Ensure minimum width and round to avoid fractional pixels
    return Math.max(120, Math.floor(cardWidth));
  };

  const cardWidth = getCardWidth();

  const handleSeeAll = () => {
    router.push(`/pages/products/list?section=${section || "all"}`);
  };

  return (
    <View style={{ marginBottom: spacing["2xl"] }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.lg,
        }}
      >
        <Text
          style={{
            fontSize: typography.sizes["2xl"],
            fontWeight: typography.weights.bold as any,
            color: colors.text.primary,
          }}
        >
          {title}
        </Text>
        <TouchableOpacity 
          onPress={handleSeeAll}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title.toLowerCase()} products`}
          accessibilityHint="Double tap to view all products in this category"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={{
              fontSize: typography.sizes.md,
              color: colors.textColors.accent,
              fontWeight: typography.weights.semibold as any,
            }}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        nestedScrollEnabled={Platform.OS === 'android'}
        bounces={Platform.OS !== 'web'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: isMobile ? spacing.sm : spacing.md, paddingRight: spacing.md }}
      >
        {products.map((product) => {
          const handleBusinessPress = () => {
            const businessId = product.merchantId.replace("merchant-", "");
            router.push(`/pages/businesses/${businessId}`);
          };

          return (
            <View
              key={product.id}
              style={{
                width: cardWidth,
                backgroundColor: colors.secondary,
                borderRadius: borderRadius.lg,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {/* Product Image - Square, bleeding to top, left, bottom */}
              <TouchableOpacity
                onPress={() => onProductPress(product)}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`View ${product.name} product details`}
                accessibilityHint="Double tap to view product details"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#474747",
                    marginTop: -1,
                    marginLeft: -1,
                    marginBottom: -1,
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {/* Image Layer - z-index 5 to be above background */}
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      zIndex: 5,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    {product.images &&
                    product.images.length > 0 &&
                    product.images[0] &&
                    product.images[0].trim() !== "" &&
                    !imageErrors.has(product.id) ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        {...(Platform.OS !== 'web' && {
                          accessible: false,
                        })}
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(product.id));
                        }}
                      />
                    ) : (
                      <ProductPlaceholder
                        aspectRatio={1}
                      />
                    )}
                  </View>

                  {/* Badge Overlays - z-index 10 to be above image */}
                  {product.productType === "physical" && (
                    <View
                      style={{
                        position: "absolute",
                        top: spacing.sm,
                        right: spacing.sm,
                        backgroundColor: "#2196f3",
                        borderRadius: borderRadius.sm,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.xs,
                          fontWeight: typography.weights.bold as any,
                          color: "#ffffff",
                        }}
                      >
                        PHYSICAL
                      </Text>
                    </View>
                  )}
                  {product.productType === "digital" && (
                    <View
                      style={{
                        position: "absolute",
                        top: spacing.sm,
                        right: spacing.sm,
                        backgroundColor: "#ba9988",
                        borderRadius: borderRadius.sm,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.xs,
                          fontWeight: typography.weights.bold as any,
                          color: "#ffffff",
                        }}
                      >
                        DIGITAL
                      </Text>
                    </View>
                  )}
                  {product.productType === "service" && (
                    <View
                      style={{
                        position: "absolute",
                        top: spacing.sm,
                        right: spacing.sm,
                        backgroundColor: "#4caf50",
                        borderRadius: borderRadius.sm,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        zIndex: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.xs,
                          fontWeight: typography.weights.bold as any,
                          color: "#ffffff",
                        }}
                      >
                        SERVICE
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Product Info */}
              <View style={{ padding: spacing.md }}>
                <TouchableOpacity
                  onPress={() => onProductPress(product)}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${product.name} product details`}
                  accessibilityHint="Double tap to view product details"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: typography.sizes.md,
                      fontWeight: typography.weights.semibold as any,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                      height: 40,
                      overflow: "hidden",
                      ...(Platform.OS === "web" && {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "20px",
                      }),
                    } as any}
                  >
                    {product.name}
                  </Text>
                </TouchableOpacity>
                {/* Business/Merchant Link */}
                <TouchableOpacity
                  onPress={handleBusinessPress}
                  activeOpacity={0.7}
                  style={{ marginBottom: spacing.xs }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${getMerchantName(product.merchantId)} business page`}
                  accessibilityHint="Double tap to view business details"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9f9fb0",
                      fontWeight: typography.weights.semibold as any,
                    }}
                  >
                    {getMerchantName(product.merchantId)} • {product.category}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: spacing.xs,
                  }}
                >
                  <MaterialIcons name="star" size={16} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: typography.sizes.sm,
                      color: colors.text.secondary,
                      marginLeft: spacing.xs,
                    }}
                  >
                    4.5
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.sizes.xs,
                      color: colors.text.tertiary,
                      marginLeft: spacing.sm,
                    }}
                  >
                    (123)
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginTop: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.sizes.lg,
                      fontWeight: typography.weights.bold as any,
                      color: colors.accent,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function Marketplace() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Tab bar height is 56px on mobile, 0 on desktop
  const tabBarHeight = isDesktop ? 0 : 56;
  const bottomPadding =
    spacing["4xl"] + tabBarHeight + (isMobile ? insets.bottom : 0);

  const categories = [
    "All",
    "Physical Products",
    "Digital Products",
    "Services",
    "Food & Beverage",
    "Beauty & Personal Care",
    "Accessories",
    "Books & Media",
    "Business Tools",
    "Professional Services",
    "Health & Fitness",
    "Design Services",
  ];

  const filteredProducts = selectedCategory
    ? mockProducts.filter((p) => {
        if (selectedCategory === "Physical Products")
          return p.productType === "physical";
        if (selectedCategory === "Digital Products")
          return p.productType === "digital";
        if (selectedCategory === "Services") return p.productType === "service";
        return p.category === selectedCategory;
      })
    : mockProducts;

  const physicalProducts = getProductsByType("physical");
  const digitalProducts = getProductsByType("digital");
  const services = getProductsByType("service");
  const featuredProducts = getFeaturedProducts();
  const trendingProducts = getTrendingProducts();

  const handleProductPress = (product: Product) => {
    // Navigate to product detail page
    router.push(`/pages/products/${product.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        nestedScrollEnabled={Platform.OS === 'android'}
        bounces={Platform.OS !== 'web'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: bottomPadding,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="BDN Marketplace"
          subtitle="Discover products and services from Black-owned businesses"
        />

        {/* Category Filters */}
        <ScrollView
          horizontal
          scrollEventThrottle={16}
          nestedScrollEnabled={Platform.OS === 'android'}
          bounces={Platform.OS !== 'web'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: isMobile ? spacing.xs : spacing.sm,
            marginBottom: spacing["2xl"],
          }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() =>
                setSelectedCategory(category === "All" ? null : category)
              }
              style={{
                paddingHorizontal: isMobile ? spacing.md : spacing.lg,
                paddingVertical: isMobile ? spacing.xs : spacing.sm,
                borderRadius: borderRadius.full,
                backgroundColor:
                  selectedCategory === category ||
                  (category === "All" && selectedCategory === null)
                    ? colors.accent
                    : "#232323",
                borderWidth: 1,
                borderColor:
                  selectedCategory === category ||
                  (category === "All" && selectedCategory === null)
                    ? colors.accent
                    : colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? typography.sizes.sm : typography.sizes.md,
                  fontWeight: typography.weights.semibold as any,
                  color:
                    selectedCategory === category ||
                    (category === "All" && selectedCategory === null)
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Carousels */}
        {selectedCategory === null || selectedCategory === "All" ? (
          <>
            <ProductCarousel
              title="Featured Products"
              products={featuredProducts}
              onProductPress={handleProductPress}
              section="featured"
            />
            <ProductCarousel
              title="Trending Now"
              products={trendingProducts}
              onProductPress={handleProductPress}
              section="trending"
            />
            <ProductCarousel
              title="Physical Products"
              products={physicalProducts}
              onProductPress={handleProductPress}
              section="physical"
            />
            <ProductCarousel
              title="Digital Products"
              products={digitalProducts}
              onProductPress={handleProductPress}
              section="digital"
            />
            <ProductCarousel
              title="Services"
              products={services}
              onProductPress={handleProductPress}
              section="services"
            />
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: spacing.md,
            }}
          >
            {filteredProducts.map((product) => {
              const handleBusinessPress = () => {
                const businessId = product.merchantId.replace("merchant-", "");
                router.push(`/pages/businesses/${businessId}`);
              };

              // Calculate width for 3 columns: (100% - 2 gaps) / 3
              // spacing.md = 12px, so 2 gaps = 24px
              const gapTotal = spacing.md * 2; // 24px
              const cardWidth =
                Platform.OS === "web"
                  ? `calc((100% - ${gapTotal}px) / 3)`
                  : undefined;

              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleProductPress(product)}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${product.name} product details`}
                  accessibilityHint="Double tap to view product details"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    width: cardWidth,
                    flex: Platform.OS === "web" ? 1 : undefined,
                    flexBasis: cardWidth,
                    maxWidth: cardWidth,
                    minWidth: 0,
                    backgroundColor: "#474747",
                    borderRadius: borderRadius.lg,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: colors.border,
                  } as any}
                >
                  {/* Product Image */}
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      overflow: "hidden",
                      backgroundColor: "#474747",
                      position: "relative",
                    }}
                  >
                    {product.images &&
                    product.images.length > 0 &&
                    product.images[0] &&
                    product.images[0].trim() !== "" &&
                    !imageErrors.has(product.id) ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={{ 
                          width: "100%", 
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        {...(Platform.OS !== 'web' && {
                          accessible: false,
                        })}
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(product.id));
                        }}
                      />
                    ) : (
                      <ProductPlaceholder
                        width="100%"
                        aspectRatio={1}
                      />
                    )}
                  </View>

                  {/* Product Info */}
                  <View
                    style={{
                      padding: spacing.md,
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: typography.sizes.md,
                        fontWeight: typography.weights.bold as any,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {product.name}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: typography.sizes.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {product.description}
                    </Text>
                    {/* Business/Merchant Link */}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleBusinessPress();
                      }}
                      activeOpacity={0.7}
                      style={{ marginBottom: spacing.xs }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${getMerchantName(product.merchantId)} business page`}
                      accessibilityHint="Double tap to view business details"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.xs,
                          color: colors.textColors.accent,
                          fontWeight: typography.weights.semibold as any,
                        }}
                      >
                        {getMerchantName(product.merchantId)} •{" "}
                        {product.category}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: spacing.xs,
                      }}
                    >
                      <MaterialIcons
                        name="star"
                        size={14}
                        color={colors.accent}
                      />
                      <Text
                        style={{
                          fontSize: typography.sizes.xs,
                          color: colors.text.secondary,
                          marginLeft: spacing.xs,
                        }}
                      >
                        4.5 (123)
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.sizes.lg,
                          fontWeight: typography.weights.bold as any,
                          color: colors.accent,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
