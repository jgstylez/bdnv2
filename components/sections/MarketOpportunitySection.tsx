import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const MarketOpportunitySection: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={300}>
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
          <View style={{ alignItems: "center", marginBottom: 40 }}>
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
              <MaterialIcons name="trending-up" size={32} color="#ba9988" />
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
              Tap Into $1.6 Trillion Market
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
              Black consumers are actively seeking Black-owned businesses. Join the platform where engaged consumers discover and support businesses like yours.
            </Text>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 24,
              marginBottom: 40,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 40 : 56,
                  fontWeight: "800",
                  color: "#ba9988",
                  marginBottom: 8,
                }}
              >
                $1.6T+
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 16,
                }}
              >
                Annual Black Consumer Spending
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: 20,
                }}
              >
                Growing at 5.4% annually, outpacing the general market
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 40 : 56,
                  fontWeight: "800",
                  color: "#ba9988",
                  marginBottom: 8,
                }}
              >
                73%
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 16,
                }}
              >
                Prefer Supporting Black Businesses
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: 20,
                }}
              >
                Black consumers actively seek out Black-owned businesses when making purchasing decisions
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/pages/merchant/onboarding")}
            style={{
              backgroundColor: "#ba9988",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              alignSelf: "center",
              minWidth: 200,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              List Your Business →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
