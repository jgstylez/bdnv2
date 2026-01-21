import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PublicHeroSection } from '@/components/layouts/PublicHeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';
import { DecorativePattern } from '@/components/placeholders/SVGPlaceholders';

export default function Community() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMobile = width < 768;

  const communityFeatures = [
    {
      icon: "groups",
      title: "Join the Movement",
      description: "Connect with thousands of members dedicated to supporting Black businesses and building economic power.",
      action: "Sign Up",
      href: "/(auth)/signup",
    },
    {
      icon: "store",
      title: "Support Businesses",
      description: "Discover and support Black-owned businesses in your area. Every purchase strengthens our community.",
      action: "Browse Directory",
      href: "/pages/businesses/businesses",
    },
    {
      icon: "trending-up",
      title: "Track Impact",
      description: "See how your spending circulates in the community. Track your economic impact in real-time.",
      action: "View Impact",
      href: "/pages/myimpact",
    },
    {
      icon: "event",
      title: "Attend Events",
      description: "Join community events, workshops, and networking opportunities designed to empower and connect.",
      action: "View Events",
      href: "/pages/events",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isMobile ? insets.bottom : 0,
        }}
      >
        <PublicHeroSection
          title="Join Our Community"
          subtitle="Together, we're building economic power and creating lasting change in Black communities."
        />

        {/* Community Features */}
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
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  gap: 24,
                }}
              >
                {communityFeatures.map((feature, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      minWidth: isMobile ? "100%" : "45%",
                      backgroundColor: "#474747",
                      borderRadius: 20,
                      padding: isMobile ? 24 : 32,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative Pattern */}
                    <View
                      style={{
                        position: "absolute",
                        top: -30,
                        right: -30,
                        opacity: 0.05,
                      }}
                    >
                      <DecorativePattern size={120} opacity={0.05} />
                    </View>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <MaterialIcons name={feature.icon as any} size={28} color="#ba9988" />
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
                      {feature.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                        marginBottom: 24,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {feature.description}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push(feature.href as any)}
                      style={{
                        backgroundColor: "#ba9988",
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        {feature.action} →
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Community Stats */}
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
                Community Impact
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  gap: isMobile ? 40 : 60,
                }}
              >
                {[
                  { value: "10K+", label: "Active Members", icon: "people" },
                  { value: "500+", label: "Black-Owned Businesses", icon: "store" },
                  { value: "$2M+", label: "Dollars Circulated", icon: "attach-money" },
                  { value: "50+", label: "Cities Nationwide", icon: "location-city" },
                ].map((stat, index) => (
                  <View key={index} style={{ alignItems: "center", flex: isMobile ? 1 : 0 }}>
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons name={stat.icon as any} size={32} color="#ba9988" />
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 40 : 52,
                        fontWeight: "800",
                        color: "#ba9988",
                        marginBottom: 8,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.7)",
                        textAlign: "center",
                      }}
                    >
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        {/* Get Involved CTA */}
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
                maxWidth: 1000,
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
              <Text
                style={{
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Get Involved Today
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
                Join thousands of members building economic power and creating lasting change.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 48,
                  paddingVertical: 16,
                  borderRadius: 12,
                  minWidth: 200,
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
                  Join the Community
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </ScrollView>
    </View>
  );
}

