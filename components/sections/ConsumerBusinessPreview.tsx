import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const ConsumerBusinessPreview: React.FC = () => {
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
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 24,
            }}
          >
            {/* Consumer Preview */}
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(71, 71, 71, 0.4)",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
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
                <MaterialIcons name="person" size={28} color="#ba9988" />
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
                For Consumers
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 24,
                  marginBottom: 24,
                }}
              >
                Support Black businesses, earn rewards, and track your economic impact. Join thousands of members building economic power.
              </Text>
              <View style={{ gap: 12, marginBottom: 24 }}>
                {[
                  "Earn points & cashback",
                  "Track spending impact",
                  "Access exclusive events",
                ].map((benefit, idx) => (
                  <View key={idx} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <MaterialIcons name="check-circle" size={18} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => router.push("/public_pages/for-consumers")}
                style={{
                  backgroundColor: "#ba9988",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Learn More →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Business Preview */}
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(71, 71, 71, 0.4)",
                borderRadius: 20,
                padding: isMobile ? 24 : 32,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.3)",
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
                <MaterialIcons name="store" size={28} color="#ba9988" />
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
                For Businesses
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 24,
                  marginBottom: 24,
                }}
              >
                Reach engaged consumers, access powerful tools, and grow your revenue. Join 500+ businesses on the platform.
              </Text>
              <View style={{ gap: 12, marginBottom: 24 }}>
                {[
                  "Reach engaged consumers",
                  "Payment processing",
                  "Marketing tools & analytics",
                ].map((benefit, idx) => (
                  <View key={idx} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <MaterialIcons name="check-circle" size={18} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => router.push("/public_pages/for-businesses")}
                style={{
                  borderWidth: 2,
                  borderColor: "#ba9988",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: "#ba9988",
                  }}
                >
                  List Your Business →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
