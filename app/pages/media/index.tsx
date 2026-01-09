import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Carousel } from '@/components/layouts/Carousel';
import { EnhancedBentoGrid } from '@/components/layouts/EnhancedBentoGrid';
import { HeroSection } from '@/components/layouts/HeroSection';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

const mediaSections = [
  {
    id: "bdtv",
    name: "BDN TV",
    description: "Video content and channels",
    icon: "tv",
    color: "#ba9988",
    route: "/pages/media/bdn-tv",
  },
  {
    id: "blog",
    name: "Blog & News",
    description: "Articles and platform updates",
    icon: "article",
    color: "#4caf50",
    route: "/pages/media/blog",
  },
  {
    id: "channels",
    name: "Media Channels",
    description: "Subscription-based content",
    icon: "subscriptions",
    color: "#2196f3",
    route: "/pages/media/channels",
  },
];

export default function Media() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

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
          title="BDN Media"
          subtitle="Discover videos, articles, and content from the Black community"
        />
        {/* Media Sections - 3 Column Grid Layout */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {mediaSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => router.push(section.route as any)}
              style={{
                width: isMobile ? "100%" : "32%",
                flex: isMobile ? undefined : 1,
                minWidth: isMobile ? undefined : 280,
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                minHeight: 200,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: `${section.color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <MaterialIcons name={section.icon as any} size={28} color={section.color} />
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                {section.name}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: 16,
                  lineHeight: 24,
                }}
              >
                {section.description}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: section.color,
                  }}
                >
                  Learn more →
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Content Carousel */}
        {!isMobile && (
          <View style={{ marginTop: 48 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 24,
              }}
            >
              Featured Content
            </Text>
            <Carousel itemsPerView={3} showControls={true} showIndicators={true}>
              {[
                {
                  title: "Success Stories",
                  description: "Inspiring stories from Black entrepreneurs",
                  icon: "emoji-events" as const,
                  color: "#ffd700",
                },
                {
                  title: "Business Tips",
                  description: "Expert advice for growing your business",
                  icon: "lightbulb" as const,
                  color: "#4caf50",
                },
                {
                  title: "Community Spotlight",
                  description: "Celebrating community achievements",
                  icon: "people" as const,
                  color: "#2196f3",
                },
                {
                  title: "Financial Education",
                  description: "Learn about money management",
                  icon: "account-balance-wallet" as const,
                  color: "#ba9988",
                },
                {
                  title: "Tech Innovation",
                  description: "Technology trends and innovations",
                  icon: "computer" as const,
                  color: "#9c27b0",
                },
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    minHeight: 200,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: `${item.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <MaterialIcons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              ))}
            </Carousel>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}

