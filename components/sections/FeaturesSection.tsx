import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const FEATURES = [
  {
    title: "Business Directory",
    description: "Discover and support Black-owned businesses. Find restaurants, services, products, and more in your area.",
    icon: "store",
  },
  {
    title: "Consumer Rewards",
    description: "Earn points and unlock benefits as you support Black businesses. Level up from Basic to Black Diamond.",
    icon: "star",
  },
  {
    title: "Group Economics",
    description: "Track how Black dollars circulate in your community. See the economic impact of supporting Black businesses.",
    icon: "diamond",
  },
  {
    title: "Education Hub",
    description: "Access resources, workshops, and tools to build financial literacy and business skills.",
    icon: "menu-book",
  },
  {
    title: "Business Tools",
    description: "Grow your Black-owned business with marketing tools, analytics, and customer management features.",
    icon: "build",
  },
  {
    title: "Community Impact",
    description: "Join a movement building economic power and creating healthier, self-sufficient communities.",
    icon: "public",
  },
];

export const FeaturesSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={600}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
        }}
      >
        <View
          style={{
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: isMobile ? 48 : 64 }}>
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
              Core Platform Features
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.75)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: 26,
              }}
            >
              Everything you need to connect with Black businesses, circulate Black dollars, and build economic power.
            </Text>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "space-between",
            }}
          >
            {FEATURES.map((feature, index) => (
              <View
                key={feature.title}
                style={{
                  width: isMobile ? "100%" : "31%",
                  minWidth: isMobile ? "100%" : 280,
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: isMobile ? 24 : 28,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "rgba(186, 153, 136, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <MaterialIcons name={feature.icon as any} size={24} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 20 : 22,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 10,
                    letterSpacing: -0.3,
                  }}
                >
                  {feature.title}
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 14 : 15,
                    color: "rgba(255, 255, 255, 0.75)",
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
  );
};

