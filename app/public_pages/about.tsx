import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/layouts/HeroSection';
import { ScrollAnimatedView } from '@/components/ScrollAnimatedView';

export default function About() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;

  const values = [
    {
      icon: "school",
      title: "Educate",
      description: "Providing resources, knowledge, and tools to build financial literacy and business acumen within our community.",
    },
    {
      icon: "build",
      title: "Equip",
      description: "Empowering Black businesses and consumers with the technology, tools, and platform needed to succeed.",
    },
    {
      icon: "trending-up",
      title: "Empower",
      description: "Creating opportunities for economic growth, community building, and lasting change through group economics.",
    },
  ];

  const stats = [
    { value: "2016", label: "Founded" },
    { value: "10K+", label: "Active Members" },
    { value: "500+", label: "Black-Owned Businesses" },
    { value: "$2M+", label: "Circulated" },
  ];

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
          title="About Black Dollar Network"
          subtitle="Building economic power through innovation, collaboration, and community."
        />

        {/* Mission Section */}
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
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 24,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Our Mission
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: isMobile ? 26 : 30,
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                Black Dollar Network bridges the gap between Black consumers and Black business owners to incentivize group economics, build economic power, and create healthier self-sufficient communities. We're more than a platform—we're a movement dedicated to circulating Black dollars and empowering our community.
              </Text>

              {/* Values */}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 24,
                  marginBottom: 60,
                }}
              >
                {values.map((value, index) => (
                  <View
                    key={value.title}
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
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                      }}
                    >
                      <MaterialIcons name={value.icon as any} size={28} color="#ba9988" />
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
                      {value.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 24,
                      }}
                    >
                      {value.description}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Stats */}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-around",
                  gap: isMobile ? 32 : 0,
                  paddingVertical: 40,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: "#474747",
                }}
              >
                {stats.map((stat) => (
                  <View key={stat.label} style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: isMobile ? 36 : 48,
                        fontWeight: "800",
                        color: "#ba9988",
                        marginBottom: 8,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
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

        {/* Story Section */}
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
                maxWidth: 1000,
                alignSelf: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 24,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Our Story
              </Text>
              <View style={{ gap: 20 }}>
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: isMobile ? 26 : 30,
                  }}
                >
                  Founded in 2016, Black Dollar Network was born from a vision to strengthen Black economic power through technology and community. We recognized that while Black consumers wanted to support Black businesses, finding and connecting with them was challenging.
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: isMobile ? 26 : 30,
                  }}
                >
                  Today, BDN has grown into a comprehensive fintech platform that makes it easy to discover, support, and transact with Black-owned businesses. We've facilitated millions in transactions, connected thousands of businesses with customers, and created a thriving community dedicated to economic empowerment.
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 16 : 18,
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: isMobile ? 26 : 30,
                  }}
                >
                  Our platform combines cutting-edge financial technology with a deep commitment to community values. Every feature we build, every business we support, and every transaction we facilitate moves us closer to our goal: a stronger, more self-sufficient Black economy.
                </Text>
              </View>
            </View>
          </View>
        </ScrollAnimatedView>

        <Footer />
      </ScrollView>
    </View>
  );
}

