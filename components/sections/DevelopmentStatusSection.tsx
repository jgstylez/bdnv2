import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const DevelopmentStatusSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={100}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#232323",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: isMobile ? width - 40 : 800,
            backgroundColor: "rgba(71, 71, 71, 0.4)",
            borderRadius: 20,
            padding: isMobile ? 24 : 32,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.3)",
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="code" size={24} color="#ba9988" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Our new app is currently in development
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 24,
                }}
              >
                We're building the powerful BDN 2.0 version. You won't find a live
                app just yet — because we're focused on creating something truly
                transformative.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
