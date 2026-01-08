import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Product } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { Platform } from "react-native";

// Mock products - in production, this would come from an API
const mockAllProducts: Product[] = [
  // Physical Products
  {
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
  {
    id: "prod-2",
    merchantId: "merchant-2",
    name: "Handcrafted Leather Wallet",
    description: "Genuine leather wallet with RFID blocking technology",
    productType: "physical",
    price: 89.99,
    currency: "USD",
    category: "Accessories",
    inventory: 45,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop"],
    shippingRequired: true,
    shippingCost: 0,
    tags: ["leather", "accessories", "premium"],
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "prod-3",
    merchantId: "merchant-3",
    name: "Natural Hair Care Bundle",
    description: "Complete hair care set for natural hair",
    productType: "physical",
    price: 49.99,
    currency: "USD",
    category: "Beauty & Personal Care",
    inventory: 200,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop"],
    shippingRequired: true,
    shippingCost: 6.99,
    tags: ["hair", "beauty", "natural"],
    createdAt: "2024-02-01T10:00:00Z",
  },
  // Digital Products
  {
    id: "prod-4",
    merchantId: "merchant-4",
    name: "Black History E-Book Collection",
    description: "Comprehensive collection of Black history e-books",
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
  {
    id: "prod-5",
    merchantId: "merchant-5",
    name: "Business Plan Template Pack",
    description: "Professional business plan templates and guides",
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
  // Services
  {
    id: "prod-6",
    merchantId: "merchant-6",
    name: "Professional Resume Review",
    description: "Expert resume review and optimization service",
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
  {
    id: "prod-7",
    merchantId: "merchant-7",
    name: "Virtual Fitness Coaching",
    description: "One-on-one virtual fitness coaching sessions",
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
  {
    id: "prod-8",
    merchantId: "merchant-8",
    name: "Custom Logo Design",
    description: "Professional logo design for your business",
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
];

const ITEMS_PER_PAGE = 20;

export default function ProductList() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest" | "rating">("newest");

  // Filter products based on section
  const filteredProducts = useMemo(() => {
    let products = [...mockAllProducts];

    switch (section) {
      case "featured":
        // Featured products (first 6)
        products = products.slice(0, 6);
        break;
      case "trending":
        // Trending products (products 2-8)
        products = products.slice(2, 8);
        break;
      case "physical":
        products = products.filter((p) => p.productType === "physical");
        break;
      case "digital":
        products = products.filter((p) => p.productType === "digital");
        break;
      case "services":
        products = products.filter((p) => p.productType === "service");
        break;
      default:
        // Show all products
        break;
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        // Mock rating sort (in production, use actual ratings)
        products.sort((a, b) => b.price - a.price); // Placeholder
        break;
    }

    return products;
  }, [section, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSectionTitle = () => {
    switch (section) {
      case "featured":
        return "Featured Products";
      case "trending":
        return "Trending Now";
      case "physical":
        return "Physical Products";
      case "digital":
        return "Digital Products";
      case "services":
        return "Services";
      default:
        return "All Products";
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/pages/products/${product.id}`);
  };

  const renderProductRow = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(product)}
      style={{
        flexDirection: "row",
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border.light,
        marginBottom: spacing.md,
      }}
    >
      {/* Product Image - Square, bleeding to top, left, bottom */}
      <View
        style={{
          width: isMobile ? 120 : 150,
          aspectRatio: 1,
          position: "relative",
          backgroundColor: colors.secondary.bg,
          overflow: "hidden",
          marginTop: -1,
          marginLeft: -1,
          marginBottom: -1,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        {product.images && product.images.length > 0 && product.images[0] ? (
          <Image
            source={{ uri: product.images[0] }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
cachePolicy="memory-disk"
            onError={() => {}}
          />
        ) : (
          <ProductPlaceholder width="100%" height="100%" aspectRatio={1} />
        )}
        {product.productType === "physical" && (
          <View
            style={{
              position: "absolute",
              top: spacing.xs,
              right: spacing.xs,
              backgroundColor: "#2196f3",
              borderRadius: borderRadius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
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
              top: spacing.xs,
              right: spacing.xs,
              backgroundColor: "#ba9988",
              borderRadius: borderRadius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
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
              top: spacing.xs,
              right: spacing.xs,
              backgroundColor: "#4caf50",
              borderRadius: borderRadius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
                color: "#ffffff",
              }}
            >
              SERVICE
            </Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={{ flex: 1, padding: spacing.md, justifyContent: "space-between" }}>
        <View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.xs,
              ...(Platform.OS === "web" && {
                // @ts-ignore - Web-only CSS properties
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 24,
              }),
            }}
          >
            {product.name}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.sm,
              ...(Platform.OS === "web" && {
                // @ts-ignore - Web-only CSS properties
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 18,
              }),
            }}
          >
            {product.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
            <MaterialIcons name="star" size={16} color={colors.accent} />
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginLeft: spacing.xs,
              }}
            >
              4.5
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.tertiary,
                marginLeft: spacing.sm,
              }}
            >
              (123)
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.accent,
              }}
            >
              ${product.price.toFixed(2)}
            </Text>
            {product.productType === "service" && product.duration && (
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.tertiary,
                  marginTop: spacing.xs,
                }}
              >
                {product.duration}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => handleProductPress(product)}
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
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
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        {/* Header */}
        <View style={{ marginBottom: spacing["2xl"] }}>
          <TouchableOpacity
            onPress={() => router.back()}
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
              Back to Marketplace
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: isMobile ? typography.fontSize["3xl"] : typography.fontSize["4xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            {getSectionTitle()}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
            }}
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </Text>
        </View>

        {/* Sort Options */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginBottom: spacing.lg,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Newest", value: "newest" as const },
            { label: "Price: Low to High", value: "price-asc" as const },
            { label: "Price: High to Low", value: "price-desc" as const },
            { label: "Rating", value: "rating" as const },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSortBy(option.value)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: sortBy === option.value ? colors.accent : colors.secondary.bg,
                borderWidth: 1,
                borderColor: sortBy === option.value ? colors.accent : colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: sortBy === option.value ? colors.textColors.onAccent : colors.text.secondary,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Product List */}
        <View>
          {paginatedProducts.map((product) => (
            <View key={product.id}>
              {renderProductRow({ item: product })}
            </View>
          ))}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.sm,
              marginTop: spacing["2xl"],
            }}
          >
            <TouchableOpacity
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: currentPage === 1 ? colors.secondary.bg : colors.accent,
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={currentPage === 1 ? colors.text.secondary : colors.text.primary}
              />
            </TouchableOpacity>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <TouchableOpacity
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: currentPage === page ? colors.accent : colors.secondary.bg,
                      borderWidth: 1,
                      borderColor: currentPage === page ? colors.accent : colors.border.light,
                      minWidth: 40,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: currentPage === page ? colors.text.primary : colors.text.secondary,
                      }}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <Text
                    key={page}
                    style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                      paddingHorizontal: spacing.sm,
                    }}
                  >
                    ...
                  </Text>
                );
              }
              return null;
            })}

            <TouchableOpacity
              onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: currentPage === totalPages ? colors.secondary.bg : colors.accent,
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={currentPage === totalPages ? colors.text.secondary : colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Page Info */}
        {totalPages > 1 && (
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.tertiary,
              textAlign: "center",
              marginTop: spacing.md,
            }}
          >
            Page {currentPage} of {totalPages}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

