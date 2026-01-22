import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Rect, Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
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
    imageType: "article",
  },
  {
    title: "Group Economics 101",
    type: "Guide",
    description: "A comprehensive guide to understanding and practicing group economics.",
    href: "/public_pages/learn/group-economics",
    imageType: "guide",
  },
  {
    title: "BDN Impact Report 2024",
    type: "Report",
    description: "See how BDN has facilitated economic impact in Black communities.",
    href: "/public_pages/learn/community-impact",
    imageType: "report",
  },
];

// SVG Placeholder Components
const ArticlePlaceholder = ({ width = 200, height = 120 }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="articleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#articleGrad)" rx="8" />
    <Path
      d="M40 35 L160 35 M40 50 L160 50 M40 65 L120 65 M40 80 L140 80"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
    />
    <Circle cx="170" cy="35" r="8" fill="#ba9988" opacity="0.3" />
  </Svg>
);

const GuidePlaceholder = ({ width = 200, height = 120 }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="guideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#guideGrad)" rx="8" />
    <Path
      d="M50 30 L150 30 L150 90 L50 90 Z"
      fill="none"
      stroke="#ba9988"
      strokeWidth="2"
      opacity="0.4"
    />
    <Path
      d="M60 45 L140 45 M60 60 L130 60 M60 75 L120 75"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
    <Circle cx="70" cy="30" r="4" fill="#ba9988" opacity="0.3" />
  </Svg>
);

const ReportPlaceholder = ({ width = 200, height = 120 }) => (
  <Svg width={width} height={height} viewBox="0 0 200 120">
    <Defs>
      <SvgLinearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#ba9988" stopOpacity="0.05" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="200" height="120" fill="url(#reportGrad)" rx="8" />
    <Rect x="50" y="30" width="100" height="60" fill="none" stroke="#ba9988" strokeWidth="2" opacity="0.4" />
    <Path
      d="M60 50 L140 50 M60 65 L130 65 M60 80 L120 80"
      stroke="#ba9988"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.3"
    />
    <Circle cx="55" cy="45" r="3" fill="#ba9988" opacity="0.3" />
    <Circle cx="55" cy="60" r="3" fill="#ba9988" opacity="0.3" />
    <Circle cx="55" cy="75" r="3" fill="#ba9988" opacity="0.3" />
  </Svg>
);

const getResourceImage = (imageType: string) => {
  switch (imageType) {
    case "article":
      return <ArticlePlaceholder width={200} height={120} />;
    case "guide":
      return <GuidePlaceholder width={200} height={120} />;
    case "report":
      return <ReportPlaceholder width={200} height={120} />;
    default:
      return <ArticlePlaceholder width={200} height={120} />;
  }
};

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
        <PublicHeroSection
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
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      borderRadius: 24,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    {/* Decorative Background Pattern */}
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 120,
                        height: 120,
                        opacity: 0.05,
                      }}
                    >
                      <Svg width={120} height={120} viewBox="0 0 120 120">
                        <Circle cx="60" cy="60" r="50" fill="#ba9988" />
                        <Circle cx="60" cy="60" r="30" fill="none" stroke="#ba9988" strokeWidth="2" />
                      </Svg>
                    </View>
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 24,
                        position: "relative",
                        zIndex: 1,
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
                        position: "relative",
                        zIndex: 1,
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
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {topic.description}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
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
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      borderRadius: 20,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.3)",
                    }}
                  >
                    {/* Image Placeholder */}
                    <View
                      style={{
                        width: "100%",
                        height: 120,
                        marginBottom: 16,
                        borderRadius: 12,
                        overflow: "hidden",
                        backgroundColor: "rgba(186, 153, 136, 0.05)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getResourceImage(resource.imageType)}
                    </View>
                    <View
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        alignSelf: "flex-start",
                        marginBottom: 12,
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
                backgroundColor: "rgba(71, 71, 71, 0.6)",
                borderRadius: 24,
                padding: isMobile ? 32 : 48,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative Background Pattern */}
              <View
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  opacity: 0.1,
                }}
              >
                <Svg width={200} height={200} viewBox="0 0 200 200">
                  <Circle cx="100" cy="100" r="80" fill="#ba9988" />
                  <Circle cx="100" cy="100" r="50" fill="none" stroke="#ba9988" strokeWidth="2" />
                </Svg>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  opacity: 0.08,
                }}
              >
                <Svg width={150} height={150} viewBox="0 0 150 150">
                  <Path
                    d="M75 20 L130 75 L75 130 L20 75 Z"
                    fill="#ba9988"
                  />
                </Svg>
              </View>
              {/* Email Icon with Decorative Background */}
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <MaterialIcons name="email" size={48} color="#ba9988" />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
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
                  position: "relative",
                  zIndex: 1,
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
                  position: "relative",
                  zIndex: 1,
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
