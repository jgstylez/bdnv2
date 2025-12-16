import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { DashboardPlaceholder } from "../../components/DashboardPlaceholder";
import { ImageCarousel } from "../../components/ImageCarousel";
import { Product } from "../../types/merchant";
import { ProductPlaceholder } from "../../components/ProductPlaceholder";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

// Mock user data - will be replaced with actual state management
const mockUser = {
  name: "John Doe",
  level: "Bronze",
  points: 1250,
  nextLevelPoints: 5000,
  userType: "consumer",
};

const USER_LEVELS = {
  Basic: { color: "#8d8d8d", minPoints: 0 },
  Bronze: { color: "#cd7f32", minPoints: 1000 },
  Silver: { color: "#c0c0c0", minPoints: 5000 },
  Gold: { color: "#ffd700", minPoints: 15000 },
  Diamond: { color: "#b9f2ff", minPoints: 50000 },
  "Black Diamond": { color: "#000000", minPoints: 100000 },
};

// Mock newly added products (mixed types)
const mockNewProducts: Product[] = [
  {
    id: "new-prod-1",
    merchantId: "merchant-1",
    name: "Artisan Coffee Blend",
    description: "Premium roasted coffee from Black-owned farms",
    productType: "physical",
    price: 24.99,
    currency: "USD",
    category: "Food & Beverage",
    inventory: 150,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop"],
    shippingRequired: true,
    shippingCost: 5.99,
    tags: ["coffee", "beverage"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "new-prod-2",
    merchantId: "merchant-2",
    name: "Digital Marketing Course",
    description: "Learn digital marketing strategies for your business",
    productType: "digital",
    price: 99.99,
    currency: "USD",
    category: "Education",
    inventory: 999,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["education", "digital"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "new-prod-3",
    merchantId: "merchant-3",
    name: "Hair Styling Service",
    description: "Professional hair styling and consultation",
    productType: "service",
    price: 75.00,
    currency: "USD",
    category: "Beauty & Wellness",
    inventory: 10,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["beauty", "service"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "new-prod-4",
    merchantId: "merchant-4",
    name: "Handmade Jewelry Set",
    description: "Beautiful handcrafted jewelry collection",
    productType: "physical",
    price: 89.99,
    currency: "USD",
    category: "Fashion & Accessories",
    inventory: 45,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"],
    shippingRequired: true,
    shippingCost: 8.99,
    tags: ["jewelry", "fashion"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "new-prod-5",
    merchantId: "merchant-5",
    name: "Fitness Training Program",
    description: "Personalized online fitness coaching",
    productType: "service",
    price: 149.99,
    currency: "USD",
    category: "Health & Fitness",
    inventory: 20,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["fitness", "health"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "new-prod-6",
    merchantId: "merchant-6",
    name: "Organic Skincare Set",
    description: "Natural skincare products for all skin types",
    productType: "physical",
    price: 64.99,
    currency: "USD",
    category: "Beauty & Wellness",
    inventory: 80,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop"],
    shippingRequired: true,
    shippingCost: 6.99,
    tags: ["skincare", "beauty"],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: "new-prod-7",
    merchantId: "merchant-7",
    name: "Business Plan Template",
    description: "Professional business plan templates and guides",
    productType: "digital",
    price: 49.99,
    currency: "USD",
    category: "Business Tools",
    inventory: 999,
    inventoryTracking: "none",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["business", "digital"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "new-prod-8",
    merchantId: "merchant-8",
    name: "Graphic Design Consultation",
    description: "Expert graphic design advice and portfolio review",
    productType: "service",
    price: 125.00,
    currency: "USD",
    category: "Creative Services",
    inventory: 15,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["design", "creative"],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: "new-prod-9",
    merchantId: "merchant-9",
    name: "Handcrafted Leather Wallet",
    description: "Premium leather wallet with RFID blocking",
    productType: "physical",
    price: 79.99,
    currency: "USD",
    category: "Fashion & Accessories",
    inventory: 60,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop"],
    shippingRequired: true,
    shippingCost: 7.99,
    tags: ["leather", "accessories"],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
  },
  {
    id: "new-prod-10",
    merchantId: "merchant-10",
    name: "Virtual Bookkeeping Service",
    description: "Monthly bookkeeping and financial reporting",
    productType: "service",
    price: 199.99,
    currency: "USD",
    category: "Business Services",
    inventory: 30,
    inventoryTracking: "manual",
    isActive: true,
    images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop"],
    shippingRequired: false,
    tags: ["business", "finance"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const isDesktop = width >= 1024 && Platform.OS === "web";

  const levelInfo = USER_LEVELS[mockUser.level as keyof typeof USER_LEVELS];
  const progress = ((mockUser.points - levelInfo.minPoints) / (mockUser.nextLevelPoints - levelInfo.minPoints)) * 100;
  
  // Tab bar height is 56px on mobile, 0 on desktop
  const tabBarHeight = isDesktop ? 0 : 56;
  const bottomPadding = 40 + tabBarHeight + (isMobile ? insets.bottom : 0);

  // Get personalized greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const greeting = getTimeBasedGreeting();
  const firstName = mockUser.name.split(" ")[0];

  // Mock carousel items - in production, these would come from admin CMS
  const carouselItems = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop",
      title: "New Feature: Enhanced Business Discovery",
      description: "Discover local Black-owned businesses with our improved search",
      link: "/pages/search",
      linkText: "Explore Now",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
      title: "Community Spotlight",
      description: "Celebrating Black excellence in entrepreneurship",
      link: "/pages/media",
      linkText: "Watch Now",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
      title: "Learn & Grow with BDN University",
      description: "Master the platform and unlock your potential",
      link: "/pages/university",
      linkText: "Start Learning",
    },
  ];

  // Swipe gesture handlers (mobile only)
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate on horizontal movement
    .failOffsetY([-5, 5]) // Fail if vertical movement is too large
    .onEnd((event) => {
      if (!isMobile) return;
      
      const { translationX, velocityX } = event;
      const swipeThreshold = 100;
      const velocityThreshold = 500;

      // Swipe left to right (opens QR scanner)
      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        router.push("/pages/scanner");
      }
      // Swipe right to left (opens account page)
      else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        router.push("/(tabs)/account");
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={{ flex: 1, backgroundColor: "#232323" }}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingTop: 20,
            paddingBottom: bottomPadding,
          }}
        >
        {/* Carousel & Level Card Container - Two Columns on Desktop */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 24 : 24,
            marginBottom: 24,
            alignItems: "stretch",
          }}
        >
          {/* Column 1: Image Carousel */}
          <View
            style={{
              flex: isMobile ? undefined : 1,
            }}
          >
            <ImageCarousel
              items={carouselItems}
              height={isMobile ? 180 : 220}
              autoPlay={true}
              autoPlayInterval={5000}
              showIndicators={true}
              showControls={true}
              onItemPress={(item) => {
                if (item.link) {
                  router.push(item.link as any);
                }
              }}
            />
          </View>

          {/* Column 2: Level Card */}
          <View
            style={{
              flex: isMobile ? undefined : 1,
              minWidth: isMobile ? undefined : 300,
            }}
          >
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                height: isMobile ? undefined : 220,
                justifyContent: "space-between",
              }}
            >
              {/* Personalized Greeting */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: isMobile ? 18 : 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  {greeting}, {firstName}!
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/account")}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: "rgba(186, 153, 136, 0.15)",
                    paddingHorizontal: isMobile ? 12 : 16,
                    paddingVertical: isMobile ? 6 : 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: isMobile ? 12 : 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    {isMobile ? "My Account" : "Manage My Account"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Current Level
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: levelInfo.color,
                    }}
                  >
                    {mockUser.level}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Points
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    {mockUser.points.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                    {mockUser.points.toLocaleString()} / {mockUser.nextLevelPoints.toLocaleString()} points
                  </Text>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                    {Math.round(progress)}% to Silver
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "#232323",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: "#ba9988",
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions - Enhanced Bento Grid */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {[
              {
                title: "Search",
                description: "Discover businesses to shop",
                icon: "search" as const,
                onPress: () => router.push("/pages/search"),
              },
              {
                title: "Wallet",
                description: "Manage accounts & balances",
                icon: "account-balance-wallet" as const,
                onPress: () => router.push("/(tabs)/pay"),
              },
              {
                title: "Invite",
                description: "Share BDN with your network",
                icon: "people" as const,
                onPress: () => router.push("/pages/referrals"),
              },
              {
                title: "Media",
                description: "Watch videos & read articles",
                icon: "video-library" as const,
                onPress: () => router.push("/pages/media"),
              },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                style={{
                  flex: isMobile ? undefined : 1,
                  width: isMobile ? "48%" : undefined,
                  minWidth: isMobile ? undefined : 200,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name={action.icon} size={24} color="#ba9988" style={{ marginBottom: 8 }} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  {action.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Newly Added Products */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Newly Added Products
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/marketplace")}
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                View All
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#ba9988" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: isMobile ? 8 : 10, paddingRight: 20 }}
          >
            {mockNewProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => router.push(`/pages/products/${product.id}`)}
                style={{
                  width: isMobile ? 110 : 140,
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Product Image - Square, bleeding to top, left, bottom */}
                <View
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#232323",
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
                    <ProductPlaceholder
                      width="100%"
                      height={isMobile ? 110 : 140}
                      aspectRatio={1}
                    />
                  )}
                  
                  {/* Product Type Badge */}
                  {product.productType === "physical" && (
                    <View
                      style={{
                        position: "absolute",
                        top: isMobile ? 4 : 6,
                        right: isMobile ? 4 : 6,
                        backgroundColor: "#2196f3",
                        borderRadius: 4,
                        paddingHorizontal: isMobile ? 4 : 6,
                        paddingVertical: isMobile ? 2 : 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isMobile ? 7 : 9,
                          fontWeight: "700",
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
                        top: isMobile ? 4 : 6,
                        right: isMobile ? 4 : 6,
                        backgroundColor: "#ba9988",
                        borderRadius: 4,
                        paddingHorizontal: isMobile ? 4 : 6,
                        paddingVertical: isMobile ? 2 : 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isMobile ? 7 : 9,
                          fontWeight: "700",
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
                        top: isMobile ? 4 : 6,
                        right: isMobile ? 4 : 6,
                        backgroundColor: "#4caf50",
                        borderRadius: 4,
                        paddingHorizontal: isMobile ? 4 : 6,
                        paddingVertical: isMobile ? 2 : 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isMobile ? 7 : 9,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        SERVICE
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Product Info */}
                <View style={{ padding: isMobile ? 6 : 10 }}>
                  <Text
                    style={{
                      fontSize: isMobile ? 10 : 12,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: isMobile ? 2 : 4,
                    }}
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 12 : 14,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Features */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Explore Features
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {[
              {
                title: "Events",
                description: "Discover & engage with community",
                icon: "event" as const,
                onPress: () => router.push("/pages/events"),
                color: "#ba9988",
              },
              {
                title: "Buy Tokens",
                description: "Gain exclusive access & earnings",
                icon: "account-balance-wallet" as const,
                onPress: () => router.push("/pages/tokens"),
                color: "#ffd700",
              },
              {
                title: "Gift Cards",
                description: "Send gift cards to loved ones",
                icon: "card-giftcard" as const,
                onPress: () => router.push("/(tabs)/pay"),
                color: "#e91e63",
              },
              {
                title: "BDN University",
                description: "Learn & master the platform",
                icon: "school" as const,
                onPress: () => router.push("/pages/university"),
                color: "#9c27b0",
              },
            ].map((feature, index) => (
              <TouchableOpacity
                key={index}
                onPress={feature.onPress}
                style={{
                  flex: isMobile ? undefined : 1,
                  width: isMobile ? "48%" : undefined,
                  minWidth: isMobile ? undefined : 200,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${feature.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <MaterialIcons name={feature.icon} size={24} color={feature.color} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  {feature.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {feature.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Overview & Recent Activity - Two Columns on Desktop */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 0 : 24,
            marginBottom: 32,
            alignItems: "stretch",
          }}
        >
          {/* Column 1: Activity Overview */}
          <View
            style={{
              flex: isMobile ? undefined : 1,
              marginBottom: isMobile ? 32 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Activity Overview
            </Text>
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                justifyContent: "center",
                height: isMobile ? undefined : 400,
              }}
            >
              <DashboardPlaceholder width={isMobile ? 300 : 500} height={isMobile ? 225 : 375} />
            </View>
          </View>

          {/* Column 2: Recent Activity */}
          <View
            style={{
              flex: isMobile ? undefined : 1,
              minWidth: isMobile ? undefined : 300,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Recent Activity
            </Text>
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                height: isMobile ? undefined : 400,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  paddingVertical: 20,
                }}
              >
                No recent activity. Start supporting Black businesses to see your impact!
              </Text>
            </View>
          </View>
        </View>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}

