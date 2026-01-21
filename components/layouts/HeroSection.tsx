import React, { useState } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { VideoLightbox } from '../modals/VideoLightbox';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  height?: number;
  videoUrl?: string;
  videoTitle?: string;
  showVideo?: boolean;
}

/**
 * HeroSection Component
 * Reusable hero section with gradient background
 * 
 * Usage:
 * ```tsx
 * <HeroSection 
 *   title="Page Title" 
 *   subtitle="Optional subtitle text"
 * />
 * ```
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  height,
  videoUrl,
  videoTitle = "Watch Video",
  showVideo = false,
}) => {
  const { isMobile, width } = useResponsive();
  const heroHeight = height || (isMobile ? 120 : 160);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  return (
    <View
      style={{
        marginBottom: spacing.xl,
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        // Use minHeight to allow content to expand naturally on native
        // while maintaining consistent appearance on web
        minHeight: heroHeight,
      }}
    >
      <LinearGradient
        colors={[colors.accent, colors.accentLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: spacing.lg,
          minHeight: heroHeight,
        }}
      >
        <View
          style={{
            alignItems: "center",
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
                marginBottom: spacing.lg,
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
                    {videoTitle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
              fontWeight: typography.fontWeight.extrabold,
              color: colors.text.primary,
              textAlign: "center",
              marginBottom: subtitle ? spacing.xs : 0,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
                color: colors.text.primary,
                textAlign: "center",
                opacity: 0.9,
                lineHeight: isMobile ? 20 : 24,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </LinearGradient>

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

