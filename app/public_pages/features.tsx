import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { FintechFeaturesSection } from '@/components/sections/FintechFeaturesSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { DecorativePattern, DiamondPattern } from '@/components/placeholders/SVGPlaceholders';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

export default function Features() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedFilter, setSelectedFilter] = useState<"all" | "consumer" | "business" | "nonprofit">("all");

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
          title="Platform Features"
          subtitle="Everything you need to support Black businesses and build economic power in one powerful platform."
        />

        {/* User Type Filter */}
        <ScrollAnimatedView delay={100}>
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
              <Text
                style={{
                  fontSize: isMobile ? 18 : 20,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Filter by User Type
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { key: "all", label: "All Features" },
                  { key: "consumer", label: "For Consumers" },
                  { key: "business", label: "For Businesses" },
                  { key: "nonprofit", label: "For Nonprofits" },
                ].map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key as any)}
                    style={{
                      backgroundColor: selectedFilter === filter.key ? "#ba9988" : "#474747",
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: selectedFilter === filter.key ? 0 : 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: selectedFilter === filter.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <FintechFeaturesSection />
        <FeaturesSection />

        {/* CTA Section */}
        <ScrollAnimatedView delay={700}>
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: isMobile ? 60 : 80,
              backgroundColor: "#232323",
            }}
          >
            <View
              style={{
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
                backgroundColor: "#474747",
                borderRadius: 24,
                padding: isMobile ? 32 : 48,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative Patterns */}
              <View
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  opacity: 0.1,
                }}
              >
                <DecorativePattern size={200} opacity={0.1} />
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  opacity: 0.08,
                }}
              >
                <DiamondPattern size={150} opacity={0.08} />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Ready to Get Started?
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 32,
                  maxWidth: 600,
                }}
              >
                Explore our dedicated pages to see how BDN can help you achieve your goals.
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 16,
                  width: "100%",
                  maxWidth: 600,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push("/public_pages/for-consumers")}
                  style={{
                    flex: 1,
                    backgroundColor: "#ba9988",
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    For Consumers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/public_pages/for-businesses")}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: "#ba9988",
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    For Businesses
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Additional Features */}
        <ScrollAnimatedView delay={600}>
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
                  marginBottom: 16,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                More Features
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 48,
                  maxWidth: 700,
                  alignSelf: "center",
                }}
              >
                Discover additional tools and capabilities designed to empower our community.
              </Text>

              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 20,
                }}
              >
                {[
                  {
                    icon: "event",
                    title: "Events & Tickets",
                    description: "Discover and attend community events, purchase tickets, and support Black event organizers.",
                  },
                  {
                    icon: "subscriptions",
                    title: "Subscription Boxes",
                    description: "Subscribe to curated boxes from Black businesses. Recurring shipments, automated billing.",
                  },
                  {
                    icon: "card-giftcard",
                    title: "Gift Cards",
                    description: "Purchase and send gift cards to support Black businesses. Perfect for gifting and rewards.",
                  },
                  {
                    icon: "analytics",
                    title: "Impact Analytics",
                    description: "Track your economic impact. See how your spending circulates in the community.",
                  },
                  {
                    icon: "people",
                    title: "Referral Program",
                    description: "Invite friends and earn rewards. Build your network and grow the community together.",
                  },
                  {
                    icon: "workspace-premium",
                    title: "Badges & Achievements",
                    description: "Earn badges for milestones and achievements. Show your commitment to the community.",
                  },
                ].map((feature, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "30%",
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 24,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.1)",
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons name={feature.icon as any} size={24} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 22,
                      }}
                    >
                      {feature.description}
                    </Text>
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

