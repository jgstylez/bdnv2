/**
 * BDN Theme Constants
 * Centralized theme values for colors, spacing, and typography
 * 
 * Usage:
 * ```tsx
 * import { colors, spacing } from '@/constants/theme';
 * 
 * <View style={{ backgroundColor: colors.primary.bg, padding: spacing.md }}>
 *   <Text style={{ color: colors.primary.text }}>Hello</Text>
 * </View>
 * ```
 */

export const colors = {
  primary: {
    bg: "#232323",
    text: "#ffffff",
  },
  secondary: {
    bg: "#474747",
    text: "rgba(255, 255, 255, 0.9)",
  },
  accent: "#ba9988",
  accentLight: "rgba(186, 153, 136, 0.15)",
  accentBorder: "rgba(186, 153, 136, 0.2)",
  accentBorderLight: "rgba(186, 153, 136, 0.3)",
  
  // Text colors
  text: {
    primary: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.6)",
    disabled: "rgba(255, 255, 255, 0.4)",
    placeholder: "rgba(255, 255, 255, 0.4)",
  },
  
  // Border colors
  border: {
    default: "rgba(71, 71, 71, 0.3)",
    light: "rgba(186, 153, 136, 0.2)",
    accent: "rgba(186, 153, 136, 0.3)",
  },
  
  // Status colors
  status: {
    success: "#4caf50",
    successLight: "rgba(76, 175, 80, 0.2)",
    error: "#ff4444",
    errorLight: "rgba(255, 68, 68, 0.2)",
    warning: "#ff9800",
    warningLight: "rgba(255, 152, 0, 0.2)",
    info: "#2196f3",
    infoLight: "rgba(33, 150, 243, 0.2)",
  },
  
  // Background variations
  background: {
    primary: "#232323",
    secondary: "#474747",
    card: "#474747",
    input: "#232323",
  },
  
  // Secondary accent colors - use sparingly for special accents
  secondaryAccents: {
    darkMaroon: "#230007",    // Very dark red/maroon
    lightBeige: "#EAE0D5",    // Light beige/cream
    bronze: "#D98324",        // Orange/bronze
    darkRed: "#A40606",       // Dark red
    burgundy: "#5A0002",      // Very dark red/burgundy
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 60,
  "7xl": 80,
  
  // Responsive padding
  mobile: 20,
  desktop: 40,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 32,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
  },
} as const;

// Breakpoints (for reference, use useResponsive hook instead)
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

