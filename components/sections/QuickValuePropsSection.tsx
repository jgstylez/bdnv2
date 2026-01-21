import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const VALUE_PROPS = [
  {
    title: "Consumers",
    icon: "people",
    description: "Support Black businesses, earn rewards, and track your economic impact. Level up through tiers and unlock exclusive benefits.",
    benefits: ["Earn points & cashback", "Track spending impact", "Access exclusive events", "Level up rewards"],
    cta: "Get Started Free",
    href: "/public_pages/for-consumers",
  },
  {
    title: "Businesses",
    icon: "store",
    description: "Reach engaged Black consumers, grow revenue, and access powerful business tools. Join 500+ businesses on the platform.",
    benefits: ["Reach engaged consumers", "Payment processing", "Marketing tools", "Analytics dashboard"],
    cta: "List Your Business",
    href: "/public_pages/for-businesses",
  },
  {
    title: "Nonprofits",
    icon: "volunteer-activism",
    description: "Connect with supporters, raise funds, and amplify your impact. Tools designed for community organizations.",
    benefits: ["Fundraising campaigns", "Community engagement", "Impact tracking", "Donor management"],
    cta: "Learn More",
    href: "/public_pages/community",
  },
];

export const QuickValuePropsSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={300}>
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
              Built for Everyone
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
              Whether you're a consumer, business owner, or nonprofit, BDN has tools designed for you.
            </Text>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 24,
            }}
          >
            {VALUE_PROPS.map((prop, index) => (
              <View
                key={prop.title}
                style={{
                  flex: 1,
                  backgroundColor: "#474747",
                  borderRadius: 24,
                  padding: isMobile ? 24 : 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                {/* Icon */}
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
                  <MaterialIcons name={prop.icon as any} size={32} color="#ba9988" />
                </View>

                {/* Title */}
                <Text
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                    letterSpacing: -0.5,
                  }}
                >
                  {prop.title}
                </Text>

                {/* Description */}
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 24,
                    marginBottom: 24,
                  }}
                >
                  {prop.description}
                </Text>

                {/* Benefits */}
                <View style={{ gap: 12, marginBottom: 24 }}>
                  {prop.benefits.map((benefit, idx) => (
                    <View key={idx} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <MaterialIcons name="check-circle" size={20} color="#ba9988" />
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

                {/* CTA */}
                <TouchableOpacity
                  onPress={() => router.push(prop.href as any)}
                  style={{
                    backgroundColor: prop.title === "Consumers" ? "#ba9988" : "transparent",
                    borderWidth: prop.title === "Consumers" ? 0 : 2,
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
                      color: prop.title === "Consumers" ? "#ffffff" : "#ba9988",
                    }}
                  >
                    {prop.cta} →
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
