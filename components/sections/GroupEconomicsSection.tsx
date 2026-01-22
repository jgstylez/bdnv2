import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const GroupEconomicsSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={400}>
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
              <MaterialIcons name="diamond" size={32} color="#ba9988" />
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
              The Power of Group Economics
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
              Group economics is the practice of circulating dollars within our community, creating a multiplier effect that strengthens Black economic power.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(35, 35, 35, 0.4)",
              borderRadius: 24,
              padding: isMobile ? 24 : 40,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
              marginBottom: 32,
            }}
          >
            <View style={{ gap: 24 }}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  How It Works
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 26,
                  }}
                >
                  When Black dollars stay in Black hands, they circulate 2-3 times within the community before leaving. This creates jobs, builds wealth, and strengthens neighborhoods.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Historical Success
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 26,
                  }}
                >
                  Black Wall Street in Tulsa demonstrated the power of group economics, with dollars circulating multiple times within the community, creating one of the wealthiest Black communities in America.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/public_pages/learn/group-economics")}
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
