import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const STATS = [
  { value: "10K+", label: "Active Members", icon: "people" },
  { value: "500+", label: "Black-Owned Businesses", icon: "store" },
  { value: "$2M+", label: "Circulated in Community", icon: "attach-money" },
  { value: "50+", label: "Cities Nationwide", icon: "location-city" },
  { value: "4.9/5", label: "Average Rating", icon: "star" },
  { value: "24/7", label: "Support Available", icon: "support-agent" },
];

export const StatsSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={400}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#1a1a1a",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#474747",
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
              flexWrap: "wrap",
              justifyContent: "space-around",
              gap: isMobile ? 32 : 24,
            }}
          >
            {STATS.map((stat, index) => (
              <View
                key={stat.label}
                style={{
                  alignItems: "center",
                  flex: isMobile ? 1 : 0,
                  minWidth: isMobile ? "100%" : 150,
                  paddingVertical: 16,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: "rgba(186, 153, 136, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                }}
              >
                  <MaterialIcons name={stat.icon as any} size={28} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: isMobile ? 36 : 48,
                    fontWeight: "800",
                    color: "#ba9988",
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

