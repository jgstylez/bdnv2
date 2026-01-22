import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import { LinearGradient } from "expo-linear-gradient";

const INITIATIVES = [
  {
    number: "01",
    title: "Technology and Platform Development",
    description:
      "Enhance the existing platform to ensure our technological solution remains cutting-edge with better usability and accessibility. Architecting an Amazon-like Black business marketplace and distribution network with the largest Black-owned service and product offerings.",
  },
  {
    number: "02",
    title: "Community Empowerment Content",
    description:
      "Develop multimedia content and community empowerment media to amplify positive Black narratives. Create educational resources that inspire economic solidarity and expand storytelling content to reach millions.",
  },
  {
    number: "03",
    title: "Economic Ecosystem Development",
    description:
      "Expand our economic ecosystem to be more robust, supporting businesses through zero-cost marketplace enrollment. Develop job creation strategies to reduce unemployment and implement comprehensive economic approaches.",
  },
];

export const KeyInitiativesSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={300}>
      <View
        style={{
          position: "relative",
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#1a1a1a",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            zIndex: 0,
          }}
        >
          <Image
            source={require("@/assets/images/public/cta-community-family.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={["rgba(35, 35, 35, 0.75)", "rgba(35, 35, 35, 0.8)", "rgba(35, 35, 35, 1)"]}
            locations={[0, 0.5, 1]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </View>

        <View
          style={{
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Section Header */}
          <View
            style={{
              marginBottom: isMobile ? 40 : 48,
              alignItems: "center",
            }}
          >
            {/* Badge */}
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  letterSpacing: 1,
                }}
              >
                MISSION
              </Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 32 : 44,
                fontWeight: "700",
                color: "#ffffff",
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Key Initiatives
            </Text>
          </View>

          {/* Initiatives Grid */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {INITIATIVES.map((initiative, index) => (
              <View
                key={index}
                style={{
                  flex: isMobile ? 1 : 0,
                  minWidth: isMobile ? "100%" : "calc(33.333% - 16px)",
                  backgroundColor: "rgba(71, 71, 71, 0.4)",
                  borderRadius: 20,
                  padding: isMobile ? 24 : 32,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                  position: "relative",
                  alignItems: "center",
                }}
              >
                {/* Number Badge */}
                <View
                  style={{
                    position: "absolute",
                    top: -20,
                    alignSelf: "center",
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#ba9988",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 4,
                    borderColor: "#232323",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "800",
                      color: "#ffffff",
                    }}
                  >
                    {initiative.number}
                  </Text>
                </View>

                {/* Content */}
                <View 
                  style={{ 
                    marginTop: 20,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: isMobile ? 12 : 16,
                      letterSpacing: -0.5,
                      textAlign: "center",
                    }}
                  >
                    {initiative.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 14 : 15,
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: isMobile ? 22 : 24,
                      textAlign: "justify",
                    }}
                  >
                    {initiative.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
