import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const FEATURES = [
  {
    title: "Connect",
    description: "Bridge the gap between consumers and Black businesses. Find Black-owned businesses near you.",
    icon: "handshake",
    gradient: ["#d4a574", "#c8965a"],
    iconColor: "#d4a574",
    iconBg: "rgba(212, 165, 116, 0.15)",
  },
  {
    title: "Circulate",
    description: "Keep Black dollars circulating within our community. Every transaction strengthens our collective economic power.",
    icon: "attach-money",
    gradient: ["#5ba3c7", "#4a8fb3"],
    iconColor: "#5ba3c7",
    iconBg: "rgba(91, 163, 199, 0.15)",
  },
  {
    title: "Empower",
    description: "Access resources, education, and tools designed to build stronger, self-sufficient communities.",
    icon: "trending-up",
    gradient: ["#a67bc9", "#8f66b3"],
    iconColor: "#a67bc9",
    iconBg: "rgba(166, 123, 201, 0.15)",
  },
  {
    title: "Grow",
    description: "Level up through our tiered system. From Basic to Black Diamond, unlock benefits as you support the community.",
    icon: "show-chart",
    gradient: ["#7fb87f", "#6aa36a"],
    iconColor: "#7fb87f",
    iconBg: "rgba(127, 184, 127, 0.15)",
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
            {/* Badge */}
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  letterSpacing: 1,
                }}
              >
                SELF-SUFFICIENCY
              </Text>
            </View>
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
              Group Economics
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
              flexWrap: "nowrap",
              gap: 20,
            }}
          >
            {FEATURES.map((feature, index) => {
              return (
                <TouchableOpacity
                  key={feature.title}
                  activeOpacity={0.9}
                  style={{
                    flex: isMobile ? undefined : 1,
                    width: isMobile ? "100%" : undefined,
                    minWidth: isMobile ? undefined : 0,
                    height: isMobile ? 280 : 320,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 24,
                      overflow: "hidden",
                      backgroundColor: "rgba(71, 71, 71, 0.4)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 8,
                    }}
                  >
                    <LinearGradient
                      colors={feature.gradient as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        opacity: 0.25,
                      }}
                    />
                    {/* Colored Header Section with Icon and Title */}
                    <View
                      style={{
                        paddingHorizontal: isMobile ? 24 : 32,
                        paddingTop: isMobile ? 24 : 32,
                        paddingBottom: isMobile ? 20 : 24,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          backgroundColor: feature.iconBg,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name={feature.icon as any} size={28} color={feature.iconColor} />
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: isMobile ? 24 : 28,
                          fontWeight: "700",
                          color: "#ffffff",
                          letterSpacing: -0.5,
                        }}
                      >
                        {feature.title}
                      </Text>
                    </View>
                    {/* Content Section */}
                    <View
                      style={{
                        paddingHorizontal: isMobile ? 24 : 32,
                        paddingTop: isMobile ? 32 : 40,
                        paddingBottom: isMobile ? 24 : 32,
                        flex: 1,
                        justifyContent: "space-between",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: isMobile ? 15 : 16,
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 24,
                            marginBottom: 12,
                          }}
                        >
                          {feature.description}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: feature.iconColor,
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
