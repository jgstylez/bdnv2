import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Guide } from '@/types/education';
import { useResponsive } from '@/hooks/useResponsive';
import { platformValues, isAndroid } from "../../../utils/platform";
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';
import { BackButton } from '@/components/navigation/BackButton';

// Mock guides
const mockGuides: Guide[] = [
  {
    id: "1",
    title: "Getting Started with BDN",
    description: "Learn the basics of using BDN, from account setup to making your first purchase",
    category: "getting-started",
    steps: [
      { stepNumber: 1, title: "Create Your Account", description: "Sign up with your email and invite code" },
      { stepNumber: 2, title: "Complete Your Profile", description: "Add your information and preferences" },
      { stepNumber: 3, title: "Explore Businesses", description: "Discover Black-owned businesses in your area" },
    ],
    estimatedTime: "5 min",
    difficulty: "beginner",
    icon: "account-circle",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    title: "How to Earn Impact Points",
    description: "Maximize your rewards by understanding how to earn impact points",
    category: "rewards",
    steps: [
      { stepNumber: 1, title: "Make Purchases", description: "Earn points with every purchase at Black-owned businesses" },
      { stepNumber: 2, title: "Refer Friends", description: "Get bonus points when friends sign up and make purchases" },
      { stepNumber: 3, title: "Leave Reviews", description: "Share feedback and earn points" },
    ],
    estimatedTime: "3 min",
    difficulty: "beginner",
    icon: "stars",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "3",
    title: "Setting Up Your Merchant Account",
    description: "Complete guide for businesses joining BDN",
    category: "merchant",
    steps: [
      { stepNumber: 1, title: "Enroll Your Business", description: "Start the enrollment process" },
      { stepNumber: 2, title: "Complete Onboarding", description: "Fill out all required business information" },
      { stepNumber: 3, title: "Add Products", description: "List your products and services" },
      { stepNumber: 4, title: "Get Your QR Code", description: "Generate QR code for customer access" },
    ],
    estimatedTime: "10 min",
    difficulty: "intermediate",
    icon: "store",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
];

const categories = [
  { key: "all", label: "All Guides" },
  { key: "getting-started", label: "Getting Started" },
  { key: "features", label: "Features" },
  { key: "merchant", label: "Merchant" },
  { key: "payments", label: "Payments" },
  { key: "rewards", label: "Rewards" },
  { key: "community", label: "Community" },
];

export default function Guides() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredGuides = selectedCategory === "all"
    ? mockGuides
    : mockGuides.filter((guide) => guide.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#4caf50";
      case "intermediate":
        return "#ffd700";
      case "advanced":
        return "#ff4444";
      default:
        return "#ba9988";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Back Button */}
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={isAndroid}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              activeOpacity={platformValues.touchOpacity}
              hitSlop={platformValues.hitSlop}
              style={{
                backgroundColor: selectedCategory === category.key ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedCategory === category.key ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedCategory === category.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Guides List */}
        {filteredGuides.length > 0 ? (
          <View style={{ gap: 16 }}>
            {filteredGuides.map((guide) => (
              <TouchableOpacity
                key={guide.id}
                onPress={() => router.push(`/pages/university/guides/${guide.id}`)}
                activeOpacity={platformValues.touchOpacity}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name={guide.icon as any} size={24} color="#ba9988" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {guide.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 12,
                      }}
                    >
                      {guide.description}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                      <View
                        style={{
                          backgroundColor: `${getDifficultyColor(guide.difficulty)}20`,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "600",
                            color: getDifficultyColor(guide.difficulty),
                            textTransform: "capitalize",
                          }}
                        >
                          {guide.difficulty}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MaterialIcons name="schedule" size={12} color="#ba9988" />
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#ba9988",
                            fontWeight: "600",
                          }}
                        >
                          {guide.estimatedTime}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MaterialIcons name="list" size={12} color="#ba9988" />
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#ba9988",
                            fontWeight: "600",
                          }}
                        >
                          {guide.steps.length} steps
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    Read Guide →
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
            <MaterialIcons name="menu-book" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No guides found for this category
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

