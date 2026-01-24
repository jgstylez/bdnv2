import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { HelpArticle } from '@/types/education';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { BackButton } from '@/components/navigation/BackButton';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

// Expanded mock help articles with detailed content
const mockArticles: Record<string, HelpArticle & { detailedContent?: string; steps?: string[] }> = {
  "1": {
    id: "1",
    title: "How do I reset my password?",
    content: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email.",
    detailedContent: "If you've forgotten your password or need to change it for security reasons, you can easily reset it through our secure password reset process. This process ensures that only you can access your account by verifying your email address.",
    category: "account",
    tags: ["password", "security", "account"],
    helpful: 45,
    notHelpful: 2,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    steps: [
      "Navigate to the login page",
      "Click on the 'Forgot Password' link below the login form",
      "Enter the email address associated with your BDN account",
      "Check your email inbox (and spam folder) for the password reset link",
      "Click the reset link in the email (valid for 1 hour)",
      "Enter your new password twice to confirm",
      "Click 'Reset Password' to complete the process",
    ],
  },
  "2": {
    id: "2",
    title: "How do I earn cashback?",
    content: "Cashback is automatically earned when you make purchases at Black-owned businesses. The percentage varies by merchant and is credited to your account after the transaction is processed.",
    detailedContent: "BDN's cashback program rewards you for supporting Black-owned businesses. Every purchase you make through the platform earns you cashback that can be used for future purchases or withdrawn to your wallet.",
    category: "rewards",
    tags: ["cashback", "rewards", "purchases"],
    helpful: 89,
    notHelpful: 5,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
    steps: [
      "Browse and shop at any Black-owned business on BDN",
      "Complete your purchase using any payment method",
      "Cashback is automatically calculated based on the merchant's rate (typically 2-10%)",
      "Your cashback appears as 'Pending' immediately after purchase",
      "After the transaction is processed (usually 24-48 hours), cashback becomes 'Available'",
      "Use your cashback for future purchases or withdraw it to your wallet",
    ],
  },
  "3": {
    id: "3",
    title: "How do I add a payment method?",
    content: "Go to the Pay section, tap 'Add Wallet', and select your payment method type. Follow the prompts to securely add your card or bank account.",
    detailedContent: "Adding a payment method makes checkout faster and easier. BDN supports credit cards, debit cards, and bank accounts. All payment information is securely encrypted and stored.",
    category: "payments",
    tags: ["payments", "wallet", "cards"],
    helpful: 67,
    notHelpful: 3,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
    steps: [
      "Open the Pay section from the bottom navigation",
      "Tap on 'Add Wallet' or the '+' button",
      "Select your payment method type (Credit Card, Debit Card, or Bank Account)",
      "Enter your payment details securely",
      "For cards: Enter card number, expiration date, CVV, and billing address",
      "For bank accounts: Enter account number and routing number",
      "Verify your payment method (may require a small test transaction)",
      "Set as default payment method if desired",
    ],
  },
  "4": {
    id: "4",
    title: "How do I enroll my business?",
    content: "Navigate to your profile, select 'Enroll Business', and complete the multi-step onboarding process. You'll need business information, tax ID, and verification documents.",
    detailedContent: "Enrolling your business on BDN connects you with customers who want to support Black-owned businesses. The enrollment process helps verify your business and set up your merchant account.",
    category: "merchant",
    tags: ["merchant", "business", "onboarding"],
    helpful: 34,
    notHelpful: 1,
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
    steps: [
      "Go to your Account profile",
      "Tap 'Enroll Business' or navigate to Merchant section",
      "Complete Step 1: Business Information (name, type, description)",
      "Complete Step 2: Business Details (address, phone, website)",
      "Complete Step 3: Tax Information (EIN or SSN)",
      "Upload verification documents (business license, tax documents)",
      "Set up your business profile and add products/services",
      "Wait for verification (typically 1-3 business days)",
      "Once approved, start accepting orders and payments",
    ],
  },
};

export default function HelpArticleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [hasVoted, setHasVoted] = useState<"helpful" | "notHelpful" | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [notHelpfulCount, setNotHelpfulCount] = useState(0);

  const article = id ? mockArticles[id] : null;

  React.useEffect(() => {
    if (article) {
      setHelpfulCount(article.helpful);
      setNotHelpfulCount(article.notHelpful);
    }
  }, [article]);

  if (!article) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <MaterialIcons name="error-outline" size={48} color={colors.text.secondary} />
        <Text style={{ fontSize: typography.fontSize.lg, color: colors.text.secondary, marginTop: spacing.md }}>
          Article not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: spacing.lg,
            backgroundColor: colors.accent,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
          }}
        >
          <Text style={{ color: colors.text.primary, fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleVote = (type: "helpful" | "notHelpful") => {
    if (hasVoted) {
      Alert.alert("Already Voted", "You've already provided feedback on this article.");
      return;
    }
    setHasVoted(type);
    if (type === "helpful") {
      setHelpfulCount(prev => prev + 1);
    } else {
      setNotHelpfulCount(prev => prev + 1);
    }
    // TODO: Send feedback to API
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton />

        {/* Article Header */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              marginBottom: spacing.md,
              lineHeight: isMobile ? 32 : 40,
            }}
          >
            {article.title}
          </Text>

          {/* Meta Information */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing.md, marginBottom: spacing.md }}>
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.sm,
              }}
            >
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, textTransform: "capitalize" }}>
                {article.category}
              </Text>
            </View>
            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary }}>
              Updated {formatDate(article.updatedAt)}
            </Text>
          </View>

          {/* Tags */}
          {article.tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {article.tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.accent + "20",
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                  }}
                >
                  <Text style={{ fontSize: typography.fontSize.xs, color: colors.accent, fontWeight: "600" }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Article Content */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
              lineHeight: 24,
              marginBottom: spacing.lg,
            }}
          >
            {article.detailedContent || article.content}
          </Text>

          {/* Steps */}
          {article.steps && article.steps.length > 0 && (
            <View style={{ marginTop: spacing.lg }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Step-by-Step Instructions:
              </Text>
              <View style={{ gap: spacing.md }}>
                {article.steps.map((step, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: spacing.md,
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.accent,
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "700", color: colors.text.primary }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: typography.fontSize.base,
                        color: colors.text.secondary,
                        lineHeight: 22,
                      }}
                    >
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Feedback Section */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Was this article helpful?
          </Text>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <TouchableOpacity
              onPress={() => handleVote("helpful")}
              disabled={hasVoted !== null}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                backgroundColor: hasVoted === "helpful" ? colors.status.success + "30" : colors.secondary.bg,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                borderWidth: 1,
                borderColor: hasVoted === "helpful" ? colors.status.success : colors.border.light,
                opacity: hasVoted && hasVoted !== "helpful" ? 0.5 : 1,
              }}
            >
              <MaterialIcons
                name="thumb-up"
                size={20}
                color={hasVoted === "helpful" ? colors.status.success : colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: "600",
                  color: hasVoted === "helpful" ? colors.status.success : colors.text.secondary,
                }}
              >
                Yes ({helpfulCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleVote("notHelpful")}
              disabled={hasVoted !== null}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                backgroundColor: hasVoted === "notHelpful" ? colors.status.error + "30" : colors.secondary.bg,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                borderWidth: 1,
                borderColor: hasVoted === "notHelpful" ? colors.status.error : colors.border.light,
                opacity: hasVoted && hasVoted !== "notHelpful" ? 0.5 : 1,
              }}
            >
              <MaterialIcons
                name="thumb-down"
                size={20}
                color={hasVoted === "notHelpful" ? colors.status.error : colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: "600",
                  color: hasVoted === "notHelpful" ? colors.status.error : colors.text.secondary,
                }}
              >
                No ({notHelpfulCount})
              </Text>
            </TouchableOpacity>
          </View>
          {hasVoted && (
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.tertiary,
                marginTop: spacing.md,
                textAlign: "center",
              }}
            >
              Thank you for your feedback!
            </Text>
          )}
        </View>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Related Articles
            </Text>
            <View style={{ gap: spacing.md }}>
              {article.relatedArticles.map((relatedId) => {
                const relatedArticle = mockArticles[relatedId];
                if (!relatedArticle) return null;
                return (
                  <TouchableOpacity
                    key={relatedId}
                    onPress={() => router.replace(`/pages/university/help/${relatedId}`)}
                    style={{
                      backgroundColor: colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      borderWidth: 1,
                      borderColor: colors.border.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: "600",
                        color: colors.accent,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {relatedArticle.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                      }}
                      numberOfLines={2}
                    >
                      {relatedArticle.content}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Contact Support */}
        <View
          style={{
            backgroundColor: colors.accent + "20",
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.accent + "40",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
            <MaterialIcons name="support-agent" size={24} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: "600",
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                Still need help?
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  marginBottom: spacing.md,
                }}
              >
                If this article didn't answer your question, contact our support team for personalized assistance.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to support/contact page
                  Alert.alert("Contact Support", "Support feature coming soon!");
                }}
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: colors.accent,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.md,
                }}
              >
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: "600", color: colors.text.primary }}>
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </OptimizedScrollView>
    </View>
  );
}
