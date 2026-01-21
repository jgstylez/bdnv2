import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/layouts/HeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';

const docCategories = [
  {
    title: "Getting Started",
    icon: "rocket-launch",
    docs: [
      { title: "Introduction to BDN", description: "Learn about the platform and its core features" },
      { title: "Creating Your Account", description: "Step-by-step guide to getting started" },
      { title: "Setting Up Your Profile", description: "Complete your profile to unlock features" },
    ],
  },
  {
    title: "For Consumers",
    icon: "person",
    docs: [
      { title: "Finding Businesses", description: "Discover Black-owned businesses near you" },
      { title: "Making Payments", description: "How to pay businesses through the platform" },
      { title: "Earning Rewards", description: "Understanding points, tiers, and benefits" },
      { title: "Digital Wallet", description: "Managing your wallet and transactions" },
    ],
  },
  {
    title: "For Businesses",
    icon: "store",
    docs: [
      { title: "Business Onboarding", description: "Get your business listed on BDN" },
      { title: "Managing Products", description: "Add and manage your products and services" },
      { title: "Payment Processing", description: "Accept payments from customers" },
      { title: "Analytics Dashboard", description: "Track your business performance" },
    ],
  },
  {
    title: "API & Integration",
    icon: "code",
    docs: [
      { title: "API Overview", description: "Introduction to the BDN API" },
      { title: "Authentication", description: "How to authenticate API requests" },
      { title: "Webhooks", description: "Set up webhooks for real-time updates" },
      { title: "SDKs", description: "Available SDKs and libraries" },
    ],
  },
];

const quickLinks = [
  { title: "FAQ", icon: "help", href: "/support" },
  { title: "Contact Support", icon: "support-agent", href: "/support" },
  { title: "Community Forum", icon: "forum", href: "/community" },
  { title: "Video Tutorials", icon: "play-circle", href: "/pages/university/videos" },
];

export default function Docs() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
        <HeroSection
          title="Documentation"
          subtitle="Everything you need to know about using and building on BDN."
        />

        {/* Quick Links */}
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
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 16,
                }}
              >
                {quickLinks.map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flex: 1,
                      backgroundColor: "#474747",
                      borderRadius: 12,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
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
                      }}
                    >
                      <MaterialIcons name={link.icon as any} size={20} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      {link.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Documentation Categories */}
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
                Browse Documentation
              </Text>

              <View style={{ gap: 20 }}>
                {docCategories.map((category, categoryIndex) => (
                  <View
                    key={categoryIndex}
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      overflow: "hidden",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedCategory(expandedCategory === category.title ? null : category.title)
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 24,
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
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          {category.title}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={expandedCategory === category.title ? "expand-less" : "expand-more"}
                        size={24}
                        color="#ba9988"
                      />
                    </TouchableOpacity>

                    {expandedCategory === category.title && (
                      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
                        {category.docs.map((doc, docIndex) => (
                          <TouchableOpacity
                            key={docIndex}
                            style={{
                              paddingVertical: 16,
                              paddingHorizontal: 16,
                              backgroundColor: "#232323",
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "rgba(186, 153, 136, 0.1)",
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
                              {doc.title}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: "rgba(255, 255, 255, 0.6)",
                                lineHeight: 20,
                              }}
                            >
                              {doc.description}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}

