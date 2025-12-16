import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

interface HeroSectionProps {
  animatedStyle: any;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const HeroSection: React.FC<HeroSectionProps> = ({ animatedStyle }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  // Animation values
  const pulseAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    pulseAnim.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    floatAnim.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(pulseAnim.value, [0, 1], [1, 1.1]) }],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [0, -10]) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={["#0a0a0a", "#1a1a1a", "#232323"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          paddingTop: isMobile ? 80 : 120,
          paddingBottom: isMobile ? 80 : 100,
          paddingHorizontal: isMobile ? 20 : 40,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            paddingHorizontal: isMobile ? 40 : 80,
            paddingVertical: isMobile ? 40 : 80,
          }}
        >
          <Svg
            width={width}
            height={600}
            style={{ position: "absolute", top: -100 }}
          >
            <Defs>
              <SvgLinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ba9988" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#ba9988" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Circle cx={width * 0.2} cy={100} r={80} fill="url(#grad1)" />
            <Circle cx={width * 0.8} cy={200} r={120} fill="url(#grad1)" />
            <Circle cx={width * 0.5} cy={400} r={100} fill="url(#grad1)" />
          </Svg>
        </View>

        {/* Fintech Badge */}
        <Animated.View style={[{ marginBottom: 24 }, floatStyle]}>
          <View
            style={{
              backgroundColor: "rgba(186, 153, 136, 0.1)",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons
              name="account-balance-wallet"
              size={16}
              color="#ba9988"
            />
            <Text
              style={{
                fontSize: isMobile ? 12 : 14,
                color: "#ba9988",
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              FINANCIAL TECHNOLOGY PLATFORM
            </Text>
          </View>
        </Animated.View>

        {/* Main Heading */}
        <Text
          style={{
            fontSize: isMobile ? 48 : 60,
            fontWeight: "900",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: 32,
            letterSpacing: -2,
            lineHeight: isMobile ? 56 : 70,
          }}
        >
          The #1 Black Business Marketplace
        </Text>

        {/* Value Proposition */}
        <Text
          style={{
            fontSize: isMobile ? 16 : 20,
            color: "rgba(255, 255, 255, 0.75)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: isMobile ? 26 : 32,
            marginBottom: 48,
            fontWeight: "400",
          }}
        >
          An all in one platform designed to circulate Black dollars and build
          economic power in our communities. Get started in minutes—it's free.
        </Text>

        {/* CTA Buttons */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: isMobile ? "100%" : 600,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(auth)/signup")}
            style={{
              backgroundColor: "#ba9988",
              paddingHorizontal: isMobile ? 40 : 48,
              paddingVertical: isMobile ? 16 : 18,
              borderRadius: 14,
              minWidth: isMobile ? "100%" : 200,
              alignItems: "center",
              justifyContent: "center",
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
                textAlign: "center",
                letterSpacing: 0.5,
              }}
            >
              Get Started Free
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(auth)/login")}
            style={{
              paddingHorizontal: isMobile ? 40 : 48,
              paddingVertical: isMobile ? 16 : 18,
              borderWidth: 2,
              borderColor: "#474747",
              borderRadius: 14,
              minWidth: isMobile ? "100%" : 200,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(71, 71, 71, 0.3)",
            }}
          >
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: "600",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trust Indicators */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialIcons name="verified" size={20} color="#ba9988" />
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
              Bank-Level Security
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialIcons name="lock" size={20} color="#ba9988" />
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
              Encrypted Payments
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialIcons name="check-circle" size={20} color="#ba9988" />
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
              FDIC Insured
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
