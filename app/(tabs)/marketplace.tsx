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

// Mock products data
const mockProducts: Product[] = [
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
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=800&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=800&fit=crop",
    ],
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
    price: 75.0,
    currency: "USD",
    category: "Professional Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=800&fit=crop",
    ],
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
    price: 60.0,
    currency: "USD",
    category: "Health & Fitness",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "5-7 business days",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["design", "logo", "branding"],
    createdAt: "2024-02-15T10:00:00Z",
  },
  // More Physical Products
  {
    id: "prod-9",
    merchantId: "merchant-1",
    name: "Artisan Hot Sauce Collection",
    description: "Three-pack of handcrafted hot sauces with unique flavor profiles",
    productType: "physical",
    price: 34.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 80,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1609501676725-7186f70aab5e?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 6.99,
    tags: ["food", "sauce", "spicy"],
    createdAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "prod-10",
    merchantId: "merchant-2",
    name: "African Print Tote Bag",
    description: "Stylish tote bag featuring authentic African print patterns",
    productType: "physical",
    price: 45.99,
    currency: "USD",
    category: "Accessories",
    inventory: 120,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 4.99,
    tags: ["bag", "fashion", "african"],
    createdAt: "2024-01-22T10:00:00Z",
  },
  {
    id: "prod-11",
    merchantId: "merchant-3",
    name: "Shea Butter Body Lotion",
    description: "Moisturizing body lotion made with pure shea butter",
    productType: "physical",
    price: 28.99,
    currency: "USD",
    category: "Beauty & Personal Care",
    inventory: 150,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 5.99,
    tags: ["beauty", "skincare", "natural"],
    createdAt: "2024-02-03T10:00:00Z",
  },
  {
    id: "prod-12",
    merchantId: "merchant-1",
    name: "Gourmet Chocolate Box",
    description: "Premium selection of handcrafted chocolates",
    productType: "physical",
    price: 39.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 60,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1606312619070-d48b4bc0b1d0?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 7.99,
    tags: ["chocolate", "gourmet", "gift"],
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "prod-13",
    merchantId: "merchant-2",
    name: "Handwoven Basket Set",
    description: "Set of three handwoven baskets in various sizes",
    productType: "physical",
    price: 65.99,
    currency: "USD",
    category: "Home & Decor",
    inventory: 40,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 8.99,
    tags: ["home", "decor", "handmade"],
    createdAt: "2024-01-28T10:00:00Z",
  },
  // More Digital Products
  {
    id: "prod-14",
    merchantId: "merchant-4",
    name: "Digital Marketing Masterclass",
    description: "Comprehensive online course covering all aspects of digital marketing",
    productType: "digital",
    price: 149.99,
    currency: "USD",
    category: "Education",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    downloadUrl: "https://example.com/download",
    downloadLimit: -1,
    tags: ["education", "marketing", "course"],
    createdAt: "2024-01-08T10:00:00Z",
  },
  {
    id: "prod-15",
    merchantId: "merchant-5",
    name: "Financial Planning Spreadsheet Suite",
    description: "Complete set of Excel templates for personal and business finance",
    productType: "digital",
    price: 24.99,
    currency: "USD",
    category: "Business Tools",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    downloadUrl: "https://example.com/download",
    downloadLimit: -1,
    tags: ["finance", "spreadsheet", "tools"],
    createdAt: "2024-01-30T10:00:00Z",
  },
  {
    id: "prod-16",
    merchantId: "merchant-4",
    name: "Entrepreneurship E-Book Series",
    description: "Five-book series on starting and growing a business",
    productType: "digital",
    price: 39.99,
    currency: "USD",
    category: "Books & Media",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    downloadUrl: "https://example.com/download",
    downloadLimit: -1,
    tags: ["ebook", "business", "entrepreneurship"],
    createdAt: "2024-02-08T10:00:00Z",
  },
  // More Services
  {
    id: "prod-17",
    merchantId: "merchant-6",
    name: "Career Coaching Session",
    description: "One-on-one career guidance and strategy session",
    productType: "service",
    price: 125.0,
    currency: "USD",
    category: "Professional Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "1 hour",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["career", "coaching", "professional"],
    createdAt: "2024-02-12T10:00:00Z",
  },
  {
    id: "prod-18",
    merchantId: "merchant-7",
    name: "Personal Training Package",
    description: "Package of 5 personal training sessions",
    productType: "service",
    price: 250.0,
    currency: "USD",
    category: "Health & Fitness",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "5 sessions",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["fitness", "training", "health"],
    createdAt: "2024-02-14T10:00:00Z",
  },
  {
    id: "prod-19",
    merchantId: "merchant-8",
    name: "Brand Identity Package",
    description: "Complete brand identity design including logo, colors, and typography",
    productType: "service",
    price: 599.99,
    currency: "USD",
    category: "Design Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "2-3 weeks",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["design", "branding", "identity"],
    createdAt: "2024-02-18T10:00:00Z",
  },
  {
    id: "prod-20",
    merchantId: "merchant-1",
    name: "Catering Service",
    description: "Full-service catering for events and gatherings",
    productType: "service",
    price: 500.0,
    currency: "USD",
    category: "Food & Beverage",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "Event day",
    serviceLocation: "on-site",
    bookingRequired: true,
    tags: ["catering", "food", "events"],
    createdAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "prod-21",
    merchantId: "merchant-2",
    name: "Custom Jewelry Design",
    description: "Handcrafted custom jewelry piece designed to your specifications",
    productType: "physical",
    price: 199.99,
    currency: "USD",
    category: "Accessories",
    inventory: 25,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 9.99,
    tags: ["jewelry", "custom", "handmade"],
    createdAt: "2024-02-22T10:00:00Z",
  },
  {
    id: "prod-22",
    merchantId: "merchant-3",
    name: "Hair Styling Service",
    description: "Professional hair styling and consultation",
    productType: "service",
    price: 75.0,
    currency: "USD",
    category: "Beauty & Wellness",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "2 hours",
    serviceLocation: "on-site",
    bookingRequired: true,
    tags: ["hair", "beauty", "styling"],
    createdAt: "2024-02-25T10:00:00Z",
  },
  {
    id: "prod-23",
    merchantId: "merchant-4",
    name: "Social Media Content Templates",
    description: "100+ customizable social media post templates",
    productType: "digital",
    price: 49.99,
    currency: "USD",
    category: "Business Tools",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    downloadUrl: "https://example.com/download",
    downloadLimit: -1,
    tags: ["social media", "templates", "marketing"],
    createdAt: "2024-02-28T10:00:00Z",
  },
  {
    id: "prod-24",
    merchantId: "merchant-5",
    name: "Website Audit Service",
    description: "Comprehensive website analysis and optimization recommendations",
    productType: "service",
    price: 199.99,
    currency: "USD",
    category: "Professional Services",
    inventory: -1,
    inventoryTracking: "none",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop",
    ],
    shippingRequired: false,
    duration: "3-5 business days",
    serviceLocation: "remote",
    bookingRequired: true,
    tags: ["website", "audit", "seo"],
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod-25",
    merchantId: "merchant-1",
    name: "Spice Blend Collection",
    description: "Set of six premium spice blends for authentic flavors",
    productType: "physical",
    price: 42.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 90,
    inventoryTracking: "manual",
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
    ],
    shippingRequired: true,
    shippingCost: 6.99,
    tags: ["spices", "cooking", "gourmet"],
    createdAt: "2024-03-05T10:00:00Z",
  },
];

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
  const { isMobile } = useResponsive();
  const router = useRouter();

  if (products.length === 0) return null;

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
              color: colors.accent,
              fontWeight: typography.weights.semibold as any,
            }}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.lg, paddingRight: spacing.lg }}
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
                width: isMobile ? 160 : 200,
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
                    backgroundColor: colors.secondary,
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
                    product.images[0] ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        accessible={false}
                        onError={() => {}}
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
                      fontSize: typography.sizes.xs,
                      color: colors.accent,
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
                {product.productType === "service" && product.duration && (
                  <Text
                    style={{
                      fontSize: typography.sizes.xs,
                      color: colors.text.tertiary,
                      marginTop: spacing.xs,
                    }}
                  >
                    {product.duration}
                  </Text>
                )}
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

  const physicalProducts = mockProducts.filter(
    (p) => p.productType === "physical"
  );
  const digitalProducts = mockProducts.filter(
    (p) => p.productType === "digital"
  );
  const services = mockProducts.filter((p) => p.productType === "service");
  const featuredProducts = mockProducts.slice(0, 6);
  const trendingProducts = mockProducts.slice(2, 8);

  const handleProductPress = (product: Product) => {
    // Navigate to product detail page
    router.push(`/pages/products/${product.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacing.sm,
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
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.full,
                backgroundColor:
                  selectedCategory === category ||
                  (category === "All" && selectedCategory === null)
                    ? colors.accent
                    : colors.secondary,
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
                  fontSize: typography.sizes.md,
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
                    backgroundColor: colors.secondary,
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
                      backgroundColor: colors.secondary,
                    }}
                  >
                    {product.images &&
                    product.images.length > 0 &&
                    product.images[0] ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        accessible={false}
                        onError={() => {}}
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
                          color: colors.accent,
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
