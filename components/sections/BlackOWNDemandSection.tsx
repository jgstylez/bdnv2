import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const BlackOWNDemandSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleVisitBOD = () => {
    Linking.openURL("https://blackowndemand.com");
  };

  return (
    <ScrollAnimatedView delay={600}>
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
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 24,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {/* Image Column */}
            <View
              style={{
                width: isMobile ? "100%" : "50%",
                minHeight: isMobile ? 300 : 400,
              }}
            >
              <Image
                source={require("@/assets/images/public/blkownd.png")}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
            </View>

            {/* Content Column */}
            <View
              style={{
                width: isMobile ? "100%" : "50%",
                padding: isMobile ? 32 : 48,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 20,
                  letterSpacing: -0.5,
                }}
              >
                Introducing BlackOWNDemand
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 26,
                  marginBottom: 16,
                }}
              >
                We are excited to introduce to you our groundbreaking new initiative called BlackOWNDemand!
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 26,
                  marginBottom: 32,
                }}
              >
                BlackOWNDemand (BOD) is a Global Black Business Directory designed to expand our international reach, create more visibility for Black-owned businesses, and empower our community worldwide!
              </Text>
              <TouchableOpacity
                onPress={handleVisitBOD}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  alignSelf: "flex-start",
                  shadowColor: "#ba9988",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Visit BlackOWNDemand
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
