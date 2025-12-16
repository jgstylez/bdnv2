import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

interface CTASectionProps {
  onPress?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onPress }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/pages/merchant/onboarding");
    }
  };

  return (
    <ScrollAnimatedView delay={800}>
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
              backgroundColor: "#474747",
              borderRadius: 32,
              padding: isMobile ? 32 : 56,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              position: "relative",
            }}
          >
            <View style={{ alignItems: "center" }}>
              {/* Icon */}
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <MaterialIcons name="rocket-launch" size={32} color="#ba9988" />
              </View>

              {/* Heading */}
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
                Grow Your Black-Owned Business
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  lineHeight: isMobile ? 24 : 28,
                  maxWidth: 700,
                  marginBottom: 32,
                }}
              >
                Join hundreds of Black-owned businesses on BDN. Get discovered by thousands of customers, access powerful business tools, and grow your revenue. Enroll your business today—it's free.
              </Text>

              {/* Benefits */}
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 16,
                  marginBottom: 40,
                  maxWidth: 600,
                }}
              >
                {[
                  { icon: "store", text: "Business Directory" },
                  { icon: "trending-up", text: "Customer Analytics" },
                  { icon: "payment", text: "Payment Processing" },
                  { icon: "campaign", text: "Marketing Tools" },
                ].map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: "rgba(186, 153, 136, 0.1)",
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <MaterialIcons name={benefit.icon as any} size={18} color="#ba9988" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.9)",
                        fontWeight: "500",
                      }}
                    >
                      {benefit.text}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={{
            backgroundColor: "#ba9988",
                    paddingHorizontal: isMobile ? 40 : 48,
                    paddingVertical: isMobile ? 16 : 18,
                    borderRadius: 14,
                    minWidth: isMobile ? "100%" : 220,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
            shadowColor: "#ba9988",
                    shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
                    shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text
            style={{
                      fontSize: isMobile ? 16 : 18,
                      fontWeight: "700",
              color: "#ffffff",
                      letterSpacing: 0.5,
            }}
          >
                    Enroll Your Business
          </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
              </View>

              {/* Trust Text */}
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.5)",
                  marginTop: 24,
                  textAlign: "center",
                }}
              >
                No credit card required • Free forever • Cancel anytime
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

