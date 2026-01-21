import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const IMPACT_STATS = [
  { value: "$2M+", label: "Dollars Circulated", icon: "attach-money" },
  { value: "10K+", label: "Active Members", icon: "people" },
  { value: "500+", label: "Black Businesses", icon: "store" },
  { value: "50+", label: "Cities Nationwide", icon: "location-city" },
];

export const CommunityImpactSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
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
          <View style={{ alignItems: "center", marginBottom: 48 }}>
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
              <MaterialIcons name="public" size={32} color="#ba9988" />
            </View>
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
              Real Community Impact
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: 26,
              }}
            >
              See how BDN is facilitating economic impact and building stronger Black communities across the nation.
            </Text>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: 40,
            }}
          >
            {IMPACT_STATS.map((stat, index) => (
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
                  alignItems: "center",
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
                    marginBottom: 16,
                  }}
                >
                  <MaterialIcons name={stat.icon as any} size={32} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 40 : 56,
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

          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 24,
              padding: isMobile ? 24 : 32,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              How We Measure Impact
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 26,
                textAlign: "center",
              }}
            >
              BDN tracks dollar circulation, business growth, job creation, and community development metrics to measure our collective economic impact. Every transaction on the platform contributes to building stronger Black communities.
            </Text>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/public_pages/learn/community-impact")}
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
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                View Impact Stories
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
              style={{
                borderWidth: 2,
                borderColor: "#ba9988",
                paddingVertical: 14,
                paddingHorizontal: 32,
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
                Join the Movement
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
