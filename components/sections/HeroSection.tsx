import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import { VideoLightbox } from "../modals/VideoLightbox";

interface HeroSectionProps {
  animatedStyle: any;
  videoUrl?: string;
  videoTitle?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  animatedStyle, 
  videoUrl,
  videoTitle = "Watch Our Story",
}) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  // Animation values
  const pulseAnim = useSharedValue(0);

  React.useEffect(() => {
    pulseAnim.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(pulseAnim.value, [0, 1], [1, 1.1]) }],
  }));

  const handleForConsumers = () => {
    router.push("/public_pages/for-consumers");
  };

  const handleForBusinesses = () => {
    router.push("/public_pages/for-businesses");
  };

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          width: "100%",
          paddingTop: isMobile ? 40 : 60,
          paddingBottom: isMobile ? 40 : 50,
          paddingHorizontal: isMobile ? 20 : 40,
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: isMobile ? 600 : 700,
        }}
      >
        {/* Hero Background Image */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
          }}
        >
          <Image
            source={require("@/assets/images/public/bdn_hero_bg.jpg")}
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

        {/* Content */}
        <View style={{ position: "relative", zIndex: 1, width: "100%", alignItems: "center" }}>
          {/* Main Heading */}
          <Text
            style={{
              fontSize: isMobile ? 40 : 56,
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: 24,
              letterSpacing: -1.5,
              lineHeight: isMobile ? 48 : 64,
            }}
          >
            Creating Real{"\n"}
            <Text style={{ color: "#ba9988" }}>Community-Driven Commerce</Text>
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: isMobile ? 16 : 18,
              color: "rgba(255, 255, 255, 0.85)",
              textAlign: "center",
              maxWidth: 800,
              lineHeight: isMobile ? 24 : 28,
              marginBottom: 32,
            }}
          >
            We're entering a new chapter in our mission to educate, equip, and
            empower our community.
          </Text>

          {/* Video Section */}
          <TouchableOpacity
            onPress={() => setVideoModalVisible(true)}
            activeOpacity={0.9}
            style={{
              width: "100%",
              maxWidth: isMobile ? width - 40 : 800,
              aspectRatio: 16 / 9,
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 32,
              backgroundColor: "#1a1a1a",
              borderWidth: 2,
              borderColor: "rgba(186, 153, 136, 0.3)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#232323",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                }}
              >
                <View
                  style={{
                    width: isMobile ? 64 : 80,
                    height: isMobile ? 64 : 80,
                    borderRadius: isMobile ? 32 : 40,
                    backgroundColor: "rgba(186, 153, 136, 0.9)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 4,
                    borderColor: "#ffffff",
                  }}
                >
                  <MaterialIcons 
                    name="play-arrow" 
                    size={isMobile ? 32 : 40} 
                    color="#ffffff"
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons name="play-circle-filled" size={20} color="#ffffff" />
                <Text
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  WHAT WE DO - WATCH VIDEO
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* CTA Buttons */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 16,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: isMobile ? "100%" : 600,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleForConsumers}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="I'm a Consumer"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                backgroundColor: "#ba9988",
                paddingHorizontal: isMobile ? 40 : 48,
                paddingVertical: isMobile ? 22 : 18,
                borderRadius: 14,
                flex: isMobile ? 0 : 1,
                minWidth: isMobile ? "100%" : 0,
                minHeight: isMobile ? 60 : undefined,
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
                I'm a Consumer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleForBusinesses}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="I'm a Business"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.2)",
                borderWidth: 2,
                borderColor: "#ba9988",
                paddingHorizontal: isMobile ? 40 : 48,
                paddingVertical: isMobile ? 22 : 18,
                borderRadius: 14,
                flex: isMobile ? 0 : 1,
                minWidth: isMobile ? "100%" : 0,
                minHeight: isMobile ? 60 : undefined,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: "700",
                  color: "#ba9988",
                  textAlign: "center",
                  letterSpacing: 0.5,
                }}
              >
                I'm a Business
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Video Lightbox */}
      <VideoLightbox
        visible={videoModalVisible}
        onClose={() => setVideoModalVisible(false)}
        videoUrl={videoUrl}
        title={videoTitle}
      />
    </Animated.View>
  );
};
