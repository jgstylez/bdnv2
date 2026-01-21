import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Linking, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import { LinearGradient } from "expo-linear-gradient";

interface CTASectionProps {
  onPress?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onPress }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Linking.openURL("https://www.zeffy.com/en-US/peer-to-peer/donate-to-project-unity");
    }
  };

  return (
    <ScrollAnimatedView delay={800}>
      <View
        style={{
          position: "relative",
          minHeight: isMobile ? 500 : 600,
          backgroundColor: "#1a1a1a",
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
            colors={["rgba(35, 35, 35, 0.8)", "rgba(35, 35, 35, 0.95)"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </View>

        {/* Content */}
        <View
          style={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingVertical: isMobile ? 60 : 80,
            position: "relative",
            zIndex: 1,
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
                  Your contribution is not just a donation—{"\n"}
                  it's sowing a seed into our collective future!
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
                  Join us in making a difference. Your donation will help create the
                  change you wish to see.
                </Text>

                {/* CTA Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePress}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Support Project Unity"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{
                    backgroundColor: "#ba9988",
                    paddingHorizontal: isMobile ? 40 : 48,
                    paddingVertical: isMobile ? 16 : 18,
                    borderRadius: 14,
                    minWidth: isMobile ? "100%" : 280,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    shadowColor: "#ba9988",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 8,
                    marginBottom: 24,
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
                    Support Project Unity
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                </TouchableOpacity>

                {/* Tax Deductible Note */}
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.6)",
                    textAlign: "center",
                    maxWidth: 600,
                    lineHeight: 20,
                  }}
                >
                  All donations are made to Black Dollar Movement, Inc., a registered
                  501(c)(3) nonprofit organization. Your donation is fully
                  tax-deductible.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};

