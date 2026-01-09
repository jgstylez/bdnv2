import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Guide } from '@/types/education';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { BackButton } from '@/components/navigation/BackButton';
import InteractiveGuideViewer from '@/components/guides/InteractiveGuideViewer';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Enhanced mock guides with interactive elements
const mockGuides: Record<string, Guide> = {
  "1": {
    id: "1",
    title: "Getting Started with BDN",
    description: "Learn the basics of using BDN, from account setup to making your first purchase",
    category: "getting-started",
    learningObjectives: [
      "Create and set up your BDN account",
      "Navigate the platform effectively",
      "Make your first purchase",
      "Understand the impact of your support",
    ],
    prerequisites: ["An invite code", "Email address"],
    steps: [
      {
        stepNumber: 1,
        title: "Create Your Account",
        description: "Sign up with your email and invite code to join the BDN community",
        detailedContent:
          "To get started, you'll need an invite code from an existing BDN member. This helps us maintain a community-focused platform. Enter your email address and the invite code you received.",
        estimatedTime: "2 min",
        interactiveElements: [
          {
            type: "checkbox",
            id: "step1-check1",
            label: "I have my invite code ready",
            content: "Make sure you have received an invite code from a friend or community member",
            required: true,
          },
          {
            type: "checkbox",
            id: "step1-check2",
            label: "I have access to my email",
            content: "You'll need to verify your email address during signup",
            required: true,
          },
        ],
        tips: [
          "Invite codes are unique - each member gets codes to share with friends",
          "Check your spam folder if you don't see the verification email",
          "You can request a new verification email if needed",
        ],
        completionCriteria: "Have your invite code and email ready",
      },
      {
        stepNumber: 2,
        title: "Complete Your Profile",
        description: "Add your information and preferences to personalize your BDN experience",
        detailedContent:
          "Your profile helps us connect you with relevant businesses and track your impact. Add your location, interests, and payment preferences. Don't worry - you can update these anytime.",
        estimatedTime: "2 min",
        interactiveElements: [
          {
            type: "highlight",
            id: "step2-highlight1",
            label: "Why Profile Matters",
            content:
              "Your location helps us show you nearby Black-owned businesses. Your interests help us recommend products and services you'll love.",
          },
          {
            type: "checkbox",
            id: "step2-check1",
            label: "Add your location",
            content: "This helps us show you businesses in your area",
          },
          {
            type: "checkbox",
            id: "step2-check2",
            label: "Set payment preferences",
            content: "Add a payment method to make purchases faster",
          },
        ],
        tips: [
          "You can always update your profile later",
          "The more complete your profile, the better your recommendations",
          "Your data is secure and private",
        ],
        completionCriteria: "Profile is at least 50% complete",
      },
      {
        stepNumber: 3,
        title: "Explore Businesses",
        description: "Discover Black-owned businesses in your area and beyond",
        detailedContent:
          "Use the search and filter features to find businesses that match your interests. Browse by category, location, or search for specific products and services. Each business profile shows their story, products, and impact.",
        estimatedTime: "1 min",
        interactiveElements: [
          {
            type: "button",
            id: "step3-button1",
            label: "Explore Marketplace",
            action: {
              type: "navigate",
              target: "/pages/marketplace",
            },
          },
          {
            type: "highlight",
            id: "step3-highlight1",
            label: "Finding Businesses",
            content:
              "Use the map view to see businesses near you, or browse by category. Each business is verified as Black-owned.",
          },
        ],
        tips: [
          "Save your favorite businesses for quick access",
          "Read reviews from other community members",
          "Follow businesses to get updates on new products",
        ],
        completionCriteria: "Browse at least 3 businesses",
      },
    ],
    estimatedTime: "5 min",
    difficulty: "beginner",
    icon: "account-circle",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  "2": {
    id: "2",
    title: "How to Earn Impact Points",
    description: "Maximize your rewards by understanding how to earn impact points",
    category: "rewards",
    learningObjectives: [
      "Understand how Impact Points work",
      "Learn all ways to earn points",
      "Maximize your point earnings",
      "Redeem points for rewards",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Make Purchases",
        description: "Earn points with every purchase at Black-owned businesses",
        detailedContent:
          "Every dollar you spend at a Black-owned business on BDN earns you Impact Points. The more you support, the more points you earn. Points are automatically added to your account after purchase.",
        estimatedTime: "2 min",
        interactiveElements: [
          {
            type: "highlight",
            id: "points-highlight1",
            label: "Point Calculation",
            content: "You earn 1 Impact Point for every $1 spent. Some businesses offer bonus point promotions!",
          },
        ],
        tips: [
          "Points are added automatically after purchase",
          "Check for businesses offering bonus points",
          "Points never expire",
        ],
      },
      {
        stepNumber: 2,
        title: "Refer Friends",
        description: "Get bonus points when friends sign up and make purchases",
        detailedContent:
          "Share your unique referral code with friends. When they sign up and make their first purchase, you both earn bonus points. The more friends you refer, the more you earn!",
        estimatedTime: "1 min",
        interactiveElements: [
          {
            type: "button",
            id: "refer-button",
            label: "Get My Referral Code",
            action: {
              type: "navigate",
              target: "/pages/referrals",
            },
          },
        ],
        tips: [
          "Share your code on social media for maximum reach",
          "You earn points when friends make their first purchase",
          "There's no limit to how many friends you can refer",
        ],
      },
      {
        stepNumber: 3,
        title: "Leave Reviews",
        description: "Share feedback and earn points",
        detailedContent:
          "Help other community members by leaving honest reviews. You'll earn points for each review you write, and you're helping businesses grow.",
        estimatedTime: "1 min",
        tips: [
          "Detailed reviews earn more points",
          "Be honest and helpful in your feedback",
          "Reviews help other community members make decisions",
        ],
      },
    ],
    estimatedTime: "3 min",
    difficulty: "beginner",
    icon: "stars",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
};

export default function GuideDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [guideCompleted, setGuideCompleted] = useState(false);

  const guide = mockGuides[id || "1"] || mockGuides["1"];

  if (!guide) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text.primary }}>Guide not found</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return colors.status.success;
      case "intermediate":
        return "#ffd700";
      case "advanced":
        return colors.status.error;
      default:
        return colors.accent;
    }
  };

  const handleComplete = () => {
    setGuideCompleted(true);
    Alert.alert(
      "🎉 Guide Complete!",
      "Congratulations! You've completed this guide. Keep learning to maximize your BDN experience.",
      [
        {
          text: "View More Guides",
          onPress: () => router.push("/pages/university/guides"),
        },
        {
          text: "Continue Learning",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Back Button */}
        <BackButton label="Back to Guides" onPress={() => router.back()} marginBottom={spacing.lg} />

        {/* Guide Header */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing["2xl"],
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginBottom: spacing.lg }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.accentLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name={guide.icon as any} size={32} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                {guide.title}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginBottom: spacing.md,
                }}
              >
                {guide.description}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                <View
                  style={{
                    backgroundColor: `${getDifficultyColor(guide.difficulty)}20`,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: getDifficultyColor(guide.difficulty),
                      textTransform: "capitalize",
                    }}
                  >
                    {guide.difficulty}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.accentLight,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <MaterialIcons name="schedule" size={14} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.accent,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    {guide.estimatedTime}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.accentLight,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <MaterialIcons name="list" size={14} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.accent,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    {guide.steps.length} steps
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Learning Objectives */}
          {guide.learningObjectives && guide.learningObjectives.length > 0 && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                What You'll Learn
              </Text>
              {guide.learningObjectives.map((objective, index) => (
                <View key={index} style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }}>
                  <MaterialIcons name="check-circle" size={20} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      flex: 1,
                    }}
                  >
                    {objective}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Prerequisites */}
          {guide.prerequisites && guide.prerequisites.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Before You Start
              </Text>
              {guide.prerequisites.map((prereq, index) => (
                <View key={index} style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }}>
                  <MaterialIcons name="info" size={20} color={colors.text.secondary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      flex: 1,
                    }}
                  >
                    {prereq}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Interactive Guide Viewer */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing["2xl"],
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <InteractiveGuideViewer guide={guide} onComplete={handleComplete} />
        </View>
      </OptimizedScrollView>
    </View>
  );
}

