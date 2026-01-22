import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const FEATURES = [
  {
    title: "Connect",
    description: "Bridge the gap between Black consumers and Black business owners. Find and support Black-owned businesses in your community.",
    icon: "handshake",
    gradient: ["#ba9988", "#9d7f6f"],
  },
  {
    title: "Circulate",
    description: "Keep Black dollars circulating within our community. Every transaction strengthens our collective economic power.",
    icon: "attach-money",
    gradient: ["#6b8e9f", "#5a7a8a"],
  },
  {
    title: "Empower",
    description: "Access resources, education, and tools designed to build stronger, self-sufficient communities.",
    icon: "trending-up",
    gradient: ["#8b6f9d", "#745a83"],
  },
  {
    title: "Grow",
    description: "Level up through our tiered system. From Basic to Black Diamond, unlock benefits as you support the community.",
    icon: "show-chart",
    gradient: ["#9d8b6f", "#837a5a"],
  },
];

export const BentoGrid: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return (
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
          {/* Section Header */}
          <View
            style={{
              marginBottom: isMobile ? 40 : 60,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: isMobile ? 32 : 48,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Explore Features
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 650,
                lineHeight: 24,
              }}
            >
              Discover how BDN helps circulate Black dollars, build economic power, and create stronger communities.
            </Text>
          </View>

          {/* Bento Grid */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            {FEATURES.map((feature, index) => {
              const isLarge = index === 1; // Make "Grow" card larger
              const cardWidth = isMobile
                ? "100%"
                : isLarge
                ? "48%"
                : "48%";

              return (
                <TouchableOpacity
                  key={feature.title}
                  activeOpacity={0.9}
                  style={{
                    width: cardWidth,
                    minHeight: isMobile ? 200 : isLarge ? 280 : 240,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 24,
                      overflow: "hidden",
                      backgroundColor: "rgba(35, 35, 35, 0.4)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 8,
                    }}
                  >
                    <LinearGradient
                      colors={feature.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        opacity: 0.15,
                      }}
                    />
                    <View
                      style={{
                        padding: isMobile ? 24 : 32,
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            backgroundColor: "rgba(186, 153, 136, 0.1)",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 20,
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
                          }}
                        >
                          {feature.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: isMobile ? 15 : 16,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 24,
                          }}
                        >
                          {feature.description}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          marginTop: 20,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#ba9988",
                          }}
                        >
                          Learn more →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
