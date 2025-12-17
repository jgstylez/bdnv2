import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  height?: number;
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
}) => {
  const { isMobile } = useResponsive();
  const heroHeight = height || (isMobile ? 120 : 160);

  return (
    <View
      style={{
        marginBottom: spacing.xl,
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        height: heroHeight,
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
          paddingVertical: spacing.lg,
        }}
      >
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
      </LinearGradient>
    </View>
  );
};

