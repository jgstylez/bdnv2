import React, { useState } from "react";
import { View, Text, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

const knowledgeCategories = [
  {
    title: "Getting Started",
    icon: "rocket-launch",
    articles: [
      { title: "What is BDN?", description: "Learn about the Black Dollar Network platform and its mission" },
      { title: "Creating Your Account", description: "Step-by-step guide to signing up and getting started" },
      { title: "Setting Up Your Profile", description: "Complete your profile to unlock all features" },
      { title: "Verifying Your Account", description: "How to verify your email and phone number" },
    ],
  },
  {
    title: "Account & Profile",
    icon: "account-circle",
    articles: [
      { title: "Managing Your Profile", description: "Update your personal information and preferences" },
      { title: "Privacy Settings", description: "Control who can see your information" },
      { title: "Notification Preferences", description: "Customize how you receive updates" },
      { title: "Account Security", description: "Keep your account safe with two-factor authentication" },
    ],
  },
  {
    title: "Payments & Transactions",
    icon: "payment",
    articles: [
      { title: "Making Payments", description: "How to pay businesses through the platform" },
      { title: "Digital Wallet Guide", description: "Managing your wallet and balance" },
      { title: "Transaction History", description: "View and download your transaction records" },
      { title: "Refunds & Disputes", description: "How to request refunds or resolve issues" },
    ],
  },
  {
    title: "Rewards & Points",
    icon: "stars",
    articles: [
      { title: "Earning Points", description: "How to earn impact points and rewards" },
      { title: "Membership Tiers", description: "Understanding Bronze, Silver, Gold, and Platinum levels" },
      { title: "Redeeming Rewards", description: "How to use your points and cashback" },
      { title: "Referral Program", description: "Earn rewards by referring friends and family" },
    ],
  },
  {
    title: "For Businesses",
    icon: "store",
    articles: [
      { title: "Business Onboarding", description: "Get your business listed on BDN" },
      { title: "Accepting Payments", description: "Set up payment processing for your business" },
      { title: "Managing Products", description: "Add and update your products and services" },
      { title: "Analytics Dashboard", description: "Track your business performance and sales" },
    ],
  },
  {
    title: "Troubleshooting",
    icon: "build",
    articles: [
      { title: "Login Issues", description: "Troubleshoot problems signing in to your account" },
      { title: "Payment Problems", description: "Resolve issues with payments and transactions" },
      { title: "App Not Working", description: "Fix common app issues and errors" },
      { title: "Contact Support", description: "Get help from our support team" },
    ],
  },
];

const popularArticles = [
  { title: "How do I earn impact points?", category: "Rewards & Points" },
  { title: "How to add a payment method?", category: "Payments & Transactions" },
  { title: "What are membership tiers?", category: "Rewards & Points" },
  { title: "How to list my business?", category: "For Businesses" },
  { title: "How to reset my password?", category: "Account & Profile" },
];

export default function KnowledgeBase() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMobile = width < 768;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = knowledgeCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.articles.length > 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <OptimizedScrollView
        showBackToTop={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="Knowledge Base"
          subtitle="Find answers to common questions and learn how to make the most of BDN."
        />

        {/* Popular Articles */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: 40,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 24 : 28,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 24,
                  letterSpacing: -0.5,
                }}
              >
                Popular Articles
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {popularArticles.map((article, index) => (
                  <TouchableOpacity
                    key={index}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Read article: ${article.title}`}
                    accessibilityHint={`Double tap to read article about ${article.title}`}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "45%",
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 12,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      minHeight: 44,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MaterialIcons name="help-outline" size={20} color="#ba9988" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {article.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {article.category}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Search Bar */}
        <ScrollAnimatedView delay={250}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 20,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  gap: 12,
                }}
              >
                <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Search articles...
                </Text>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Knowledge Categories */}
        <ScrollAnimatedView delay={300}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 80,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 32,
                  letterSpacing: -0.5,
                }}
              >
                Browse by Category
              </Text>

              <View style={{ gap: 20 }}>
                {filteredCategories.map((category, categoryIndex) => (
                  <View
                    key={categoryIndex}
                    style={{
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                      overflow: "hidden",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedCategory(expandedCategory === category.title ? null : category.title)
                      }
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`${expandedCategory === category.title ? "Collapse" : "Expand"} ${category.title} category`}
                      accessibilityHint={`Double tap to ${expandedCategory === category.title ? "collapse" : "expand"} ${category.title} category`}
                      accessibilityState={{ expanded: expandedCategory === category.title }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 24,
                        minHeight: 44,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, flex: 1 }}>
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: "rgba(186, 153, 136, 0.15)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MaterialIcons name={category.icon as any} size={24} color="#ba9988" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: "700",
                              color: "#ffffff",
                              marginBottom: 4,
                            }}
                          >
                            {category.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {category.articles.length} articles
                          </Text>
                        </View>
                      </View>
                      <MaterialIcons
                        name={expandedCategory === category.title ? "expand-less" : "expand-more"}
                        size={24}
                        color="#ba9988"
                      />
                    </TouchableOpacity>

                    {expandedCategory === category.title && (
                      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
                        {category.articles.map((article, articleIndex) => (
                          <TouchableOpacity
                            key={articleIndex}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={`Read article: ${article.title}`}
                            accessibilityHint={`Double tap to read article about ${article.title}`}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{
                              paddingVertical: 16,
                              paddingHorizontal: 16,
                              backgroundColor: "#232323",
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "rgba(186, 153, 136, 0.1)",
                              minHeight: 44,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#ffffff",
                                marginBottom: 6,
                              }}
                            >
                              {article.title}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.6)",
                                lineHeight: 20,
                              }}
                            >
                              {article.description}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {filteredCategories.length === 0 && (
                <View
                  style={{
                    backgroundColor: "rgba(71, 71, 71, 0.4)",
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                  }}
                >
                  <MaterialIcons name="search-off" size={48} color="rgba(186, 153, 136, 0.5)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.6)",
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    No articles found matching your search
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Contact Support CTA */}
        <ScrollAnimatedView delay={400}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: 40,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: isMobile ? 32 : 48,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="support-agent" size={48} color="#ba9988" style={{ marginBottom: 16 }} />
                <Text
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Still need help?
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    marginBottom: 24,
                    maxWidth: 600,
                  }}
                >
                  Our support team is here to help you with any questions or issues you may have.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/pages/support")}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Contact support team"
                  accessibilityHint="Double tap to contact support"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 12,
                    minHeight: 44,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}
