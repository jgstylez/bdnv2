import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/layouts/HeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

const EDUCATIONAL_TOPICS = [
  {
    title: "Black Spending Power",
    icon: "trending-up",
    description: "Understand the $1.6+ trillion in annual Black spending power and how your spending decisions create impact.",
    href: "/public_pages/learn/black-spending-power",
    color: "#ba9988",
  },
  {
    title: "Group Economics",
    icon: "diamond",
    description: "Learn about group economics, the multiplier effect, and how circulating Black dollars strengthens communities.",
    href: "/public_pages/learn/group-economics",
    color: "#ba9988",
  },
  {
    title: "Community Impact",
    icon: "public",
    description: "See real-world examples of how supporting Black businesses creates lasting economic impact in communities.",
    href: "/public_pages/learn/community-impact",
    color: "#ba9988",
  },
  {
    title: "Financial Literacy",
    icon: "account-balance-wallet",
    description: "Build your financial knowledge with guides on budgeting, investing, and building wealth.",
    href: "/pages/university",
    color: "#ba9988",
  },
  {
    title: "Business Growth",
    icon: "store",
    description: "Resources for Black business owners: marketing, operations, scaling, and success strategies.",
    href: "/pages/university",
    color: "#ba9988",
  },
];

const FEATURED_RESOURCES = [
  {
    title: "The Power of $1.6 Trillion",
    type: "Article",
    description: "Deep dive into Black spending power and its potential impact.",
    href: "/public_pages/blog",
  },
  {
    title: "Group Economics 101",
    type: "Guide",
    description: "A comprehensive guide to understanding and practicing group economics.",
    href: "/public_pages/learn/group-economics",
  },
  {
    title: "BDN Impact Report 2024",
    type: "Report",
    description: "See how BDN has facilitated economic impact in Black communities.",
    href: "/public_pages/learn/community-impact",
  },
];

export default function LearnIndex() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMobile = width < 768;

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
          title="Educational Resources"
          subtitle="Learn about Black spending power, group economics, and how to build economic impact in our communities"
        />

        {/* Topics Grid */}
        <ScrollAnimatedView delay={200}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 60 : 80,
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
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 48,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Explore Topics
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 24,
                }}
              >
                {EDUCATIONAL_TOPICS.map((topic, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.push(topic.href as any)}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "30%",
                      backgroundColor: "#474747",
                      borderRadius: 24,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
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
                      <MaterialIcons name={topic.icon as any} size={32} color={topic.color} />
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 24 : 28,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                        letterSpacing: -0.5,
                      }}
                    >
                      {topic.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                        marginBottom: 20,
                      }}
                    >
                      {topic.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ba9988",
                        }}
                      >
                        Learn More
                      </Text>
                      <MaterialIcons name="arrow-forward" size={18} color="#ba9988" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Featured Resources */}
        <ScrollAnimatedView delay={400}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 60 : 80,
              backgroundColor: "#1a1a1a",
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
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 48,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Featured Resources
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                }}
              >
                {FEATURED_RESOURCES.map((resource, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.push(resource.href as any)}
                    style={{
                      flex: 1,
                      backgroundColor: "#474747",
                      borderRadius: 20,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        alignSelf: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#ba9988",
                          textTransform: "uppercase",
                        }}
                      >
                        {resource.type}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 20 : 24,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 12,
                      }}
                    >
                      {resource.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                        marginBottom: 20,
                      }}
                    >
                      {resource.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ba9988",
                        }}
                      >
                        Read More
                      </Text>
                      <MaterialIcons name="arrow-forward" size={18} color="#ba9988" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Newsletter Signup */}
        <ScrollAnimatedView delay={600}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 60 : 80,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 800,
                alignSelf: "center",
                width: "100%",
                backgroundColor: "#474747",
                borderRadius: 24,
                padding: isMobile ? 32 : 48,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="email" size={48} color="#ba9988" style={{ marginBottom: 24 }} />
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Stay Updated
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 32,
                  maxWidth: 600,
                }}
              >
                Get the latest educational content, resources, and insights delivered to your inbox.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/public_pages/contact")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingVertical: 14,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Subscribe to Newsletter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </OptimizedScrollView>
    </View>
  );
}
