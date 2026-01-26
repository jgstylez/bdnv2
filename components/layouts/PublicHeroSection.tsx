import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Circle } from "react-native-svg";
import { useResponsive } from '../../hooks/useResponsive';
import { spacing, borderRadius, typography, colors } from '../../constants/theme';
import { VideoLightbox } from '../modals/VideoLightbox';

interface PublicHeroSectionProps {
  title: string;
  subtitle?: string;
  videoUrl?: string;
  videoTitle?: string;
  showVideo?: boolean;
  backgroundImage?: ImageSourcePropType;
  videoPlaceholderImage?: ImageSourcePropType;
  overlayColor?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

/**
 * PublicHeroSection Component
 * Hero section specifically designed for public marketing pages
 * Features larger height and customizable background/overlay
 * 
 * Usage:
 * ```tsx
 * <PublicHeroSection 
 *   title="Page Title" 
 *   subtitle="Optional subtitle text"
 *   backgroundImage={require("@/assets/images/hero.png")}
 *   overlayColor="#1a1a1a"
 *   overlayOpacity={0.6}
 * />
 * ```
 */
export const PublicHeroSection: React.FC<PublicHeroSectionProps> = ({
  title,
  subtitle,
  videoUrl,
  videoTitle = "Watch Video",
  showVideo = false,
  backgroundImage,
  videoPlaceholderImage,
  overlayColor = "#1a1a1a",
  overlayOpacity = 0.65,
  children,
}) => {
  const { isMobile, width } = useResponsive();
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const heroHeight = isMobile ? 320 : 420;

  return (
    <View
      style={{
        position: "relative",
        minHeight: heroHeight,
        overflow: "hidden",
        backgroundColor: "#0f0f0f",
      }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Image
            source={backgroundImage}
            style={{
              width: "100%",
              height: "100%",
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
            }}
          />
        </View>
      )}

      {/* Faint Radial Gradient in Center */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Svg
          width={width}
          height={heroHeight}
          style={{ position: "absolute" }}
        >
          <Defs>
            <SvgRadialGradient id="radialGradient" cx={width / 2} cy={heroHeight / 2} r={isMobile ? 200 : 300}>
              <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" stopOpacity="1" />
              <Stop offset="50%" stopColor="rgba(255, 255, 255, 0.03)" stopOpacity="1" />
              <Stop offset="100%" stopColor="rgba(0, 0, 0, 0)" stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>
          <Circle
            cx={width / 2}
            cy={heroHeight / 2}
            r={isMobile ? 200 : 300}
            fill="url(#radialGradient)"
          />
        </Svg>
      </View>

      {/* Content */}
      <View
        style={{
          position: "relative",
          zIndex: 1,
          paddingHorizontal: isMobile ? spacing.lg : spacing.xl,
          paddingTop: isMobile ? spacing["3xl"] : spacing["4xl"],
          paddingBottom: isMobile ? spacing["3xl"] : spacing["4xl"],
          minHeight: heroHeight,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            maxWidth: 1200,
            alignSelf: "center",
            width: "100%",
          }}
        >
          {/* Video Placeholder */}
          {showVideo && (
            <TouchableOpacity
              onPress={() => setVideoModalVisible(true)}
              activeOpacity={0.9}
              style={{
                width: "100%",
                maxWidth: isMobile ? width - 40 : 800,
                aspectRatio: 16 / 9,
                borderRadius: borderRadius.lg,
                overflow: "hidden",
                marginBottom: spacing.xl,
                backgroundColor: "#1a1a1a",
                borderWidth: 2,
                borderColor: "rgba(186, 153, 136, 0.3)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
                alignSelf: "center",
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
                {videoPlaceholderImage && (
                  <Image
                    source={videoPlaceholderImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                )}
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
              </View>
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: isMobile ? 40 : 56,
              fontWeight: "800",
              color: colors.accent,
              textAlign: "center",
              marginBottom: subtitle ? spacing.md : 0,
              letterSpacing: -1.5,
              lineHeight: isMobile ? 48 : 64,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: isMobile ? typography.fontSize.lg : typography.fontSize.xl,
                color: "rgba(255, 255, 255, 0.85)",
                textAlign: "center",
                lineHeight: isMobile ? 26 : 30,
                maxWidth: 800,
                alignSelf: "center",
              }}
            >
              {subtitle}
            </Text>
          )}

          {children && (
            <View style={{ marginTop: spacing.xl }}>
              {children}
            </View>
          )}
        </View>
      </View>

      {/* Video Lightbox */}
      {showVideo && (
        <VideoLightbox
          visible={videoModalVisible}
          onClose={() => setVideoModalVisible(false)}
          videoUrl={videoUrl}
          title={videoTitle}
        />
      )}
    </View>
  );
};
