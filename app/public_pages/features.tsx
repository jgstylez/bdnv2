import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/layouts/HeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { FintechFeaturesSection } from '@/components/sections/FintechFeaturesSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';

export default function Features() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom + 40 : 40,
        }}
      >
        <HeroSection
          title="Platform Features"
          subtitle="Everything you need to support Black businesses and build economic power in one powerful platform."
        />

        <FintechFeaturesSection />
        <FeaturesSection />

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
      </ScrollView>
    </View>
  );
}

