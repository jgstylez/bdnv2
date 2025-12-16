import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

export const FeatureHighlight: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollAnimatedView delay={700}>
      <LinearGradient
        colors={["#0a0a0a", "#1a1a1a", "#232323"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, paddingHorizontal: isMobile ? 40 : 80, paddingVertical: isMobile ? 40 : 80 }}>
          <Svg width={width} height={600} style={{ position: "absolute", top: -100 }}>
            <Defs>
              <SvgLinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#ba9988" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Circle cx={width * 0.2} cy={100} r={80} fill="url(#grad2)" />
            <Circle cx={width * 0.8} cy={200} r={120} fill="url(#grad2)" />
            <Circle cx={width * 0.5} cy={400} r={100} fill="url(#grad2)" />
          </Svg>
        </View>

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
            }}
          >
            <View style={{ alignItems: "center" }}>
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
                <MaterialIcons name="auto-awesome" size={32} color="#ba9988" />
              </View>
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 20,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                Building Economic Power Together
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.85)",
                  textAlign: "center",
                  lineHeight: isMobile ? 24 : 28,
                  maxWidth: 750,
                  marginBottom: 32,
                }}
              >
                BDN is more than a platform—it's a movement. By circulating Black dollars and supporting Black businesses, we're building a stronger economic foundation for our communities. Join thousands of members creating lasting change.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#ba9988",
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Join the Community
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollAnimatedView>
  );
};

