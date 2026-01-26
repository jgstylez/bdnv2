import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PublicHeroSection } from "@/components/layouts/PublicHeroSection";
import { ScrollAnimatedView } from "@/components/ScrollAnimatedView";
import { OptimizedScrollView } from "@/components/optimized/OptimizedScrollView";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  { key: "all", label: "All Questions", icon: "help-outline" },
  { key: "about", label: "About BDN", icon: "info" },
  { key: "getting-started", label: "Getting Started", icon: "rocket-launch" },
  { key: "businesses", label: "For Businesses", icon: "store" },
  { key: "nonprofits", label: "For Nonprofits", icon: "volunteer-activism" },
  { key: "pricing", label: "Pricing & Plans", icon: "credit-card" },
];

const faqData: FAQItem[] = [
  // About BDN
  {
    category: "about",
    question: "What is the Black Dollar Network (BDN)?",
    answer:
      "BDN is a comprehensive economic empowerment platform designed to strengthen the Black economy. We connect consumers with Black-owned businesses, enable seamless payments, track community economic impact, and provide tools for businesses to grow. Our mission is to keep dollars circulating within the Black community longer, creating jobs, building wealth, and fostering economic independence.",
  },
  {
    category: "about",
    question: "Why was BDN created?",
    answer:
      "Studies show that a dollar circulates in the Black community for only 6 hours compared to 20+ days in other communities. BDN was created to change this by making it easier to discover and support Black-owned businesses, track your economic impact, and build a stronger community economy together.",
  },
  {
    category: "about",
    question: "How is BDN different from other business directories?",
    answer:
      "BDN goes far beyond a simple directory. We offer integrated payment processing, cashback rewards, impact tracking that shows exactly how your spending benefits the community, business growth tools, nonprofit partnerships, and a complete ecosystem designed to strengthen Black economic power. It's an economic empowerment platform, not just a listing site.",
  },
  {
    category: "about",
    question: "Is BDN available nationwide?",
    answer:
      "Yes! BDN is available throughout the United States. Our platform includes businesses from all 50 states, and we're continuously growing our network. Whether you're in a major city or a smaller community, you can discover and support Black-owned businesses through BDN.",
  },

  // Getting Started
  {
    category: "getting-started",
    question: "How do I sign up for BDN?",
    answer:
      "Signing up is free and takes just a minute. Click 'Get Started' or 'Sign Up' on our website, enter your email address, create a password, and verify your email. You can also sign up using your Google or Apple account for even faster registration. Once signed up, you'll have immediate access to our business directory and all consumer features.",
  },
  {
    category: "getting-started",
    question: "Is there a cost to use BDN as a consumer?",
    answer:
      "BDN is completely free for consumers to use. You can browse businesses, make purchases, and earn basic rewards at no cost. For enhanced features like increased cashback rates, exclusive deals, and premium analytics, we offer BDN+ subscriptions starting at $9.99/month.",
  },
  {
    category: "getting-started",
    question: "What features are available for free?",
    answer:
      "Free accounts include: full access to our business directory, ability to make payments to businesses, basic cashback rewards (up to 2%), impact tracking to see your community contribution, business reviews and ratings, and access to community events. BDN+ adds enhanced cashback (up to 5%), exclusive deals, priority support, and advanced analytics.",
  },
  {
    category: "getting-started",
    question: "Can I use BDN without downloading an app?",
    answer:
      "Yes! BDN works great on both web and mobile. You can access the full platform through any web browser at blackdollar.network. We also offer native mobile apps for iOS and Android for the best mobile experience, but they're not required to use BDN.",
  },

  // For Businesses
  {
    category: "businesses",
    question: "How can I list my business on BDN?",
    answer:
      "To list your business, create a free account and select 'Enroll Business' from your dashboard. You'll complete a simple onboarding process that includes your business details, verification of Black ownership, and payment setup. Our team reviews applications within 2-3 business days, and once approved, your business will be live on the platform.",
  },
  {
    category: "businesses",
    question: "What are the requirements to list my business?",
    answer:
      "To be listed on BDN, your business must be at least 51% Black-owned. You'll need to provide: basic business information (name, address, category), proof of Black ownership (varies by business type), a valid business license or registration, and bank account information for receiving payments. We work with businesses of all sizes, from sole proprietors to larger enterprises.",
  },
  {
    category: "businesses",
    question: "What does it cost for businesses to join BDN?",
    answer:
      "Basic business listings are free! This includes your business profile, customer discovery, and basic analytics. We charge a small transaction fee (2.9% + $0.30) only when you receive payments through our platform. For advanced features like marketing tools, detailed analytics, and promotional placements, we offer BDN+ Business plans.",
  },
  {
    category: "businesses",
    question: "What tools does BDN provide for business owners?",
    answer:
      "BDN provides a comprehensive merchant dashboard including: payment processing, inventory management, customer analytics, marketing tools, promotional campaigns, QR code payments, invoicing, appointment booking, and more. We're committed to giving Black business owners the tools they need to compete and thrive.",
  },

  // For Nonprofits
  {
    category: "nonprofits",
    question: "How can nonprofits partner with BDN?",
    answer:
      "Nonprofits focused on Black community empowerment can partner with BDN to receive donations, run fundraising campaigns, and connect with our community. Start by creating an account and selecting 'Nonprofit Enrollment'. Our partnership team will work with you to set up your organization's profile and donation capabilities.",
  },
  {
    category: "nonprofits",
    question: "What benefits do nonprofit partners receive?",
    answer:
      "Nonprofit partners receive: a dedicated profile page, donation processing with low fees, ability to run fundraising campaigns, connection to BDN's community of supporters, impact tracking and reporting tools, and marketing support. We're committed to supporting organizations that strengthen our community.",
  },
  {
    category: "nonprofits",
    question: "Can users donate their rewards to nonprofits?",
    answer:
      "Yes! BDN users can choose to donate their cashback rewards to any of our nonprofit partners. This is a unique feature that turns everyday shopping into community impact. Users can set up automatic donations or make one-time contributions from their rewards balance.",
  },

  // Pricing & Plans
  {
    category: "pricing",
    question: "What is BDN+ and is it worth it?",
    answer:
      "BDN+ is our premium subscription that enhances your BDN experience. Benefits include: increased cashback rates (up to 5% vs 2%), exclusive deals and early access to promotions, advanced impact analytics, priority customer support, and ad-free experience. At $9.99/month, most active users earn back more than the subscription cost through increased cashback alone.",
  },
  {
    category: "pricing",
    question: "Can I try BDN+ before committing?",
    answer:
      "Yes! We offer a 14-day free trial of BDN+ for new subscribers. You can experience all premium features risk-free. If you decide it's not for you, simply cancel before the trial ends and you won't be charged. No credit card is required to start your trial.",
  },
  {
    category: "pricing",
    question: "What's the difference between BDN+ and BDN+ Business?",
    answer:
      "BDN+ ($9.99/month) is designed for consumers and includes enhanced cashback, exclusive deals, and premium features. BDN+ Business ($29.99/month) is designed for business owners and includes advanced marketing tools, detailed business analytics, promotional placements, and priority support for merchant accounts.",
  },
  {
    category: "pricing",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. BDN+ subscriptions can be canceled at any time with no cancellation fees. Your premium benefits will continue until the end of your current billing period. We also offer a 30-day money-back guarantee if you're not satisfied with your subscription.",
  },
];

export default function FAQ() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group FAQs by category for display
  const groupedFAQs = faqCategories
    .filter((cat) => cat.key !== "all")
    .map((category) => ({
      ...category,
      faqs: filteredFAQs.filter((faq) => faq.category === category.key),
    }))
    .filter((group) => group.faqs.length > 0);

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
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about BDN. Can't find the answer you're looking for? Reach out to our support team."
        />

        {/* Search Section */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 40 : 60,
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
              {/* Search Bar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(71, 71, 71, 0.6)",
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  marginBottom: 24,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <MaterialIcons
                  name="search"
                  size={24}
                  color="rgba(186, 153, 136, 0.7)"
                />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search for answers..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    flex: 1,
                    paddingVertical: 18,
                    paddingHorizontal: 16,
                    fontSize: 16,
                    color: "#ffffff",
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <MaterialIcons
                      name="close"
                      size={24}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Category Filters */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 12,
                  paddingVertical: 4,
                }}
              >
                {faqCategories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    onPress={() => setSelectedCategory(category.key)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${category.label}`}
                    accessibilityState={{ selected: selectedCategory === category.key }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor:
                        selectedCategory === category.key
                          ? "#ba9988"
                          : "rgba(71, 71, 71, 0.6)",
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor:
                        selectedCategory === category.key
                          ? "#ba9988"
                          : "rgba(186, 153, 136, 0.2)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: selectedCategory === category.key ? 0.2 : 0.1,
                      shadowRadius: 4,
                      elevation: selectedCategory === category.key ? 3 : 1,
                    }}
                  >
                    <MaterialIcons
                      name={category.icon as any}
                      size={20}
                      color={
                        selectedCategory === category.key
                          ? "#ffffff"
                          : "rgba(186, 153, 136, 0.8)"
                      }
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color:
                          selectedCategory === category.key
                            ? "#ffffff"
                            : "rgba(255, 255, 255, 0.85)",
                      }}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* FAQ Content */}
        <ScrollAnimatedView delay={300}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: isMobile ? 60 : 80,
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
              {selectedCategory === "all" ? (
                // Grouped view when "All" is selected
                <View style={{ gap: isMobile ? 48 : 56 }}>
                  {groupedFAQs.map((group, groupIndex) => (
                    <View key={group.key}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 16,
                          marginBottom: 24,
                        }}
                      >
                        <View
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            backgroundColor: "rgba(186, 153, 136, 0.15)",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        >
                          <MaterialIcons
                            name={group.icon as any}
                            size={26}
                            color="#ba9988"
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: isMobile ? 26 : 32,
                            fontWeight: "700",
                            color: "#ffffff",
                            letterSpacing: -0.5,
                          }}
                        >
                          {group.label}
                        </Text>
                      </View>

                      <View style={{ gap: 16 }}>
                        {group.faqs.map((faq, faqIndex) => {
                          const globalIndex = faqData.findIndex(
                            (f) => f.question === faq.question
                          );
                          const isExpanded = expandedIndex === globalIndex;
                          return (
                            <View
                              key={faqIndex}
                              style={{
                                backgroundColor: "rgba(71, 71, 71, 0.6)",
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: isExpanded 
                                  ? "rgba(186, 153, 136, 0.4)" 
                                  : "rgba(186, 153, 136, 0.2)",
                                overflow: "hidden",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 2,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() =>
                                  setExpandedIndex(isExpanded ? null : globalIndex)
                                }
                                accessible={true}
                                accessibilityRole="button"
                                accessibilityLabel={faq.question}
                                accessibilityHint={
                                  isExpanded
                                    ? "Double tap to collapse"
                                    : "Double tap to expand"
                                }
                                accessibilityState={{ expanded: isExpanded }}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: 24,
                                  minHeight: 56,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: isMobile ? 16 : 18,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    flex: 1,
                                    paddingRight: 16,
                                    lineHeight: 26,
                                  }}
                                >
                                  {faq.question}
                                </Text>
                                <View
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    backgroundColor: isExpanded 
                                      ? "rgba(186, 153, 136, 0.2)" 
                                      : "rgba(186, 153, 136, 0.1)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <MaterialIcons
                                    name={isExpanded ? "expand-less" : "expand-more"}
                                    size={24}
                                    color="#ba9988"
                                  />
                                </View>
                              </TouchableOpacity>
                              {isExpanded && (
                                <View
                                  style={{
                                    paddingHorizontal: 24,
                                    paddingBottom: 24,
                                    borderTopWidth: 1,
                                    borderTopColor: "rgba(186, 153, 136, 0.2)",
                                    backgroundColor: "rgba(35, 35, 35, 0.5)",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: isMobile ? 15 : 16,
                                      color: "rgba(255, 255, 255, 0.75)",
                                      lineHeight: 26,
                                      paddingTop: 20,
                                    }}
                                  >
                                    {faq.answer}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                // Flat list when specific category is selected
                <View style={{ gap: 16 }}>
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => {
                      const globalIndex = faqData.findIndex(
                        (f) => f.question === faq.question
                      );
                      const isExpanded = expandedIndex === globalIndex;
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: "rgba(71, 71, 71, 0.6)",
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: isExpanded 
                              ? "rgba(186, 153, 136, 0.4)" 
                              : "rgba(186, 153, 136, 0.2)",
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 2,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              setExpandedIndex(isExpanded ? null : globalIndex)
                            }
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={faq.question}
                            accessibilityHint={
                              isExpanded
                                ? "Double tap to collapse"
                                : "Double tap to expand"
                            }
                            accessibilityState={{ expanded: isExpanded }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: 24,
                              minHeight: 56,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: isMobile ? 16 : 18,
                                fontWeight: "600",
                                color: "#ffffff",
                                flex: 1,
                                paddingRight: 16,
                                lineHeight: 26,
                              }}
                            >
                              {faq.question}
                            </Text>
                            <View
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                backgroundColor: isExpanded 
                                  ? "rgba(186, 153, 136, 0.2)" 
                                  : "rgba(186, 153, 136, 0.1)",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <MaterialIcons
                                name={isExpanded ? "expand-less" : "expand-more"}
                                size={24}
                                color="#ba9988"
                              />
                            </View>
                          </TouchableOpacity>
                          {isExpanded && (
                            <View
                              style={{
                                paddingHorizontal: 24,
                                paddingBottom: 24,
                                borderTopWidth: 1,
                                borderTopColor: "rgba(186, 153, 136, 0.2)",
                                backgroundColor: "rgba(35, 35, 35, 0.5)",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: isMobile ? 15 : 16,
                                  color: "rgba(255, 255, 255, 0.75)",
                                  lineHeight: 26,
                                  paddingTop: 20,
                                }}
                              >
                                {faq.answer}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <View
                      style={{
                        backgroundColor: "rgba(71, 71, 71, 0.6)",
                        borderRadius: 24,
                        padding: isMobile ? 48 : 64,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 3,
                      }}
                    >
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 16,
                          backgroundColor: "rgba(186, 153, 136, 0.15)",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 24,
                        }}
                      >
                        <MaterialIcons
                          name="search-off"
                          size={32}
                          color="rgba(186, 153, 136, 0.7)"
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: isMobile ? 20 : 24,
                          fontWeight: "700",
                          color: "#ffffff",
                          textAlign: "center",
                          marginBottom: 12,
                        }}
                      >
                        No results found
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.65)",
                          textAlign: "center",
                          maxWidth: 500,
                          lineHeight: 24,
                        }}
                      >
                        Try adjusting your search or filter to find what you're looking for.
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Still Need Help CTA */}
        <ScrollAnimatedView delay={400}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingBottom: isMobile ? 60 : 80,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1200,
                alignSelf: "center",
                width: "100%",
                backgroundColor: "rgba(71, 71, 71, 0.6)",
                borderRadius: 24,
                padding: isMobile ? 40 : 56,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="support-agent" size={36} color="#ba9988" />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 16,
                  letterSpacing: -0.5,
                }}
              >
                Still have questions?
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.75)",
                  textAlign: "center",
                  marginBottom: 32,
                  maxWidth: 600,
                  lineHeight: 28,
                }}
              >
                Can't find the answer you're looking for? Our team is here to help you get started with BDN.
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 16,
                  width: isMobile ? "100%" : undefined,
                  maxWidth: 500,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push("/web/contact")}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Contact us"
                  style={{
                    flex: isMobile ? 0 : 1,
                    backgroundColor: "#ba9988",
                    paddingHorizontal: 32,
                    paddingVertical: 18,
                    borderRadius: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Contact Us →
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/signup")}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Get started for free"
                  style={{
                    flex: isMobile ? 0 : 1,
                    backgroundColor: "transparent",
                    paddingHorizontal: 32,
                    paddingVertical: 18,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#ba9988",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    Get Started Free →
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
