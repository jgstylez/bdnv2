import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PayItForward } from '@/types/nonprofit';
import { HeroSection } from '@/components/layouts/HeroSection';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Mock fundraisers data
const mockFundraisers: PayItForward[] = [
  {
    id: "1",
    userId: "user1",
    organizationId: "org1",
    type: "fundraiser",
    title: "Community Food Drive 2024",
    description: "Help us provide meals for families in need this holiday season. Your donation will help us purchase fresh ingredients and prepare nutritious meals for over 500 families in our community.",
    amount: 0,
    currency: "USD",
    targetAmount: 10000,
    currentAmount: 7500,
    contributors: 45,
    status: "active",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-03-01T00:00:00Z",
    tags: ["food", "community", "holiday"],
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    userId: "user2",
    organizationId: "org2",
    type: "fundraiser",
    title: "Youth Education Scholarship Fund",
    description: "Support promising students from underserved communities by contributing to our scholarship fund. Help us provide educational opportunities and break the cycle of poverty.",
    amount: 0,
    currency: "USD",
    targetAmount: 50000,
    currentAmount: 32500,
    contributors: 128,
    status: "active",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-06-30T00:00:00Z",
    tags: ["education", "youth", "scholarship"],
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    userId: "user3",
    organizationId: "org3",
    type: "fundraiser",
    title: "Mental Health Support Initiative",
    description: "Fund free counseling services and mental health resources for Black communities. Your contribution helps provide accessible, culturally competent mental health care.",
    amount: 0,
    currency: "USD",
    targetAmount: 25000,
    currentAmount: 18200,
    contributors: 67,
    status: "active",
    startDate: "2024-02-10T00:00:00Z",
    endDate: "2024-05-10T00:00:00Z",
    tags: ["mental-health", "wellness", "community"],
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=400&fit=crop",
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "4",
    userId: "user4",
    organizationId: "org4",
    type: "fundraiser",
    title: "Small Business Startup Grants",
    description: "Empower Black entrepreneurs by providing seed funding and mentorship. Help launch the next generation of Black-owned businesses in our community.",
    amount: 0,
    currency: "USD",
    targetAmount: 75000,
    currentAmount: 48900,
    contributors: 203,
    status: "active",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T00:00:00Z",
    tags: ["business", "entrepreneurship", "grants"],
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    userId: "user5",
    organizationId: "org5",
    type: "fundraiser",
    title: "Housing Assistance Program",
    description: "Provide emergency housing assistance and rental support for families facing eviction. Help keep families in their homes during difficult times.",
    amount: 0,
    currency: "USD",
    targetAmount: 40000,
    currentAmount: 26750,
    contributors: 94,
    status: "active",
    startDate: "2024-02-05T00:00:00Z",
    endDate: "2024-04-05T00:00:00Z",
    tags: ["housing", "emergency", "community"],
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    createdAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "6",
    userId: "user6",
    organizationId: "org6",
    type: "fundraiser",
    title: "Community Garden Expansion",
    description: "Expand our community garden to provide fresh produce and gardening education. Help us grow food security and community connections.",
    amount: 0,
    currency: "USD",
    targetAmount: 15000,
    currentAmount: 11200,
    contributors: 56,
    status: "active",
    startDate: "2024-02-20T00:00:00Z",
    endDate: "2024-04-20T00:00:00Z",
    tags: ["garden", "food-security", "sustainability"],
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=400&fit=crop",
    createdAt: "2024-02-20T00:00:00Z",
  },
];

const categories = ["food", "education", "mental-health", "business", "housing", "garden", "other"];

export default function Fundraisers() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Calculate card width for 3-column layout
  const getCardWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return "calc(50% - 8px)"; // 2 columns on tablet
    return "calc(33.333% - 11px)"; // 3 columns on desktop
  };

  const filteredFundraisers = mockFundraisers.filter((fundraiser) => {
    if (selectedCategory !== "all" && !fundraiser.tags.includes(selectedCategory)) return false;
    if (searchQuery && !fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return fundraiser.status === "active" && fundraiser.type === "fundraiser";
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Make Donations"
          subtitle="Support causes and fundraisers from Black-owned nonprofits and community organizations"
        />

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 12 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory("all")}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Show all fundraisers"
            accessibilityState={{ selected: selectedCategory === "all" }}
            style={{
              backgroundColor: selectedCategory === "all" ? "#ba9988" : "#474747",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: selectedCategory === "all" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: selectedCategory === "all" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedCategory === category ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  textTransform: "capitalize",
                }}
              >
                {category.replace("-", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Fundraisers Grid */}
        {filteredFundraisers.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {filteredFundraisers.map((fundraiser) => {
              const progressPercentage = getProgressPercentage(fundraiser.currentAmount, fundraiser.targetAmount || 1);
              return (
                <TouchableOpacity
                  key={fundraiser.id}
                  onPress={() => router.push(`/pages/nonprofit/campaigns/${fundraiser.id}`)}
                  style={{
                    width: getCardWidth(),
                    maxWidth: isMobile ? "100%" : "calc(33.333% - 11px)",
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ width: "100%", height: 200, overflow: "hidden", backgroundColor: "#232323", position: "relative" }}>
                    {fundraiser.imageUrl && fundraiser.imageUrl.trim() !== "" ? (
                      imageErrors.has(fundraiser.id) ? (
                        <View style={{ width: "100%", height: 200, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
                          <MaterialIcons name="image" size={48} color="rgba(186, 153, 136, 0.3)" />
                        </View>
                      ) : (
                        <Image
                          source={{ uri: fundraiser.imageUrl }}
                          style={{ 
                            width: "100%", 
                            height: "100%",
                          }}
                          contentFit="cover"
                          cachePolicy="memory-disk"
                          transition={200}
                          priority="high"
                          {...(Platform.OS !== 'web' && {
                            accessible: false,
                          })}
                          onError={() => {
                            setImageErrors((prev) => new Set(prev).add(fundraiser.id));
                          }}
                        />
                      )
                    ) : (
                      <View style={{ width: "100%", height: 200, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
                        <MaterialIcons name="favorite" size={48} color="rgba(186, 153, 136, 0.3)" />
                      </View>
                    )}
                  </View>
                  <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <View
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#ba9988",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          Fundraiser
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {fundraiser.contributors} contributors
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {fundraiser.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 12,
                      }}
                    >
                      {fundraiser.description}
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={{ marginBottom: 12 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
                          {formatCurrency(fundraiser.currentAmount, fundraiser.currency)}
                        </Text>
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)" }}>
                          of {formatCurrency(fundraiser.targetAmount || 0, fundraiser.currency)}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 8,
                          backgroundColor: "rgba(186, 153, 136, 0.2)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${progressPercentage}%`,
                            backgroundColor: "#ba9988",
                            borderRadius: 4,
                          }}
                        />
                      </View>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                        {Math.round(progressPercentage)}% funded
                      </Text>
                    </View>

                    {fundraiser.endDate && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)" }}>
                          Ends {formatDate(fundraiser.endDate)}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => router.push(`/pages/nonprofit/campaigns/${fundraiser.id}`)}
                      style={{
                        backgroundColor: "#ba9988",
                        paddingHorizontal: isMobile ? 12 : 16,
                        paddingVertical: isMobile ? 6 : 8,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: isMobile ? 13 : 14, fontWeight: "600", color: "#ffffff" }}>
                        Donate Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="favorite-border" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No fundraisers found. Try adjusting your filters.
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
