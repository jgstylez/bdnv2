import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const TRUST_SIGNALS = [
  {
    icon: "security",
    title: "Bank-Level Security",
    description: "Your data and transactions are protected with enterprise-grade encryption",
  },
  {
    icon: "verified",
    title: "FDIC Insured",
    description: "Your funds are protected with FDIC insurance up to $250,000",
  },
  {
    icon: "lock",
    title: "PCI Compliant",
    description: "We meet the highest standards for payment card industry security",
  },
  {
    icon: "shield",
    title: "SOC 2 Certified",
    description: "Independently audited for security, availability, and confidentiality",
  },
];

export const TrustSignalsSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={600}>
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
          <Text
            style={{
              fontSize: isMobile ? 32 : 44,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 48,
              textAlign: "center",
              letterSpacing: -0.5,
            }}
          >
            Trusted & Secure
          </Text>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {TRUST_SIGNALS.map((signal, index) => (
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
                    marginBottom: 20,
                  }}
                >
                  <MaterialIcons name={signal.icon as any} size={32} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {signal.title}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  {signal.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
