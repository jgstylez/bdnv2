import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const SpendingPowerSection: React.FC = () => {
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
              $1.6+ Trillion in Black Spending Power
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
              Black consumers control over $1.6 trillion in annual spending power. When we circulate these dollars within our community, each dollar multiplies, creating lasting economic impact.
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
                backgroundColor: "rgba(71, 71, 71, 0.4)",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 48 : 64,
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
                  textAlign: "center",
                }}
              >
                Annual Black Spending Power
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(71, 71, 71, 0.4)",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 48 : 64,
                  fontWeight: "800",
                  color: "#ba9988",
                  marginBottom: 8,
                }}
              >
                2-3x
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                }}
              >
                Multiplier Effect When Dollars Stay in Community
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/web/learn/black-spending-power")}
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
              Learn More →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
