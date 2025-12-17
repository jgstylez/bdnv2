import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography } from '../../constants/theme';

interface BackButtonProps {
  /**
   * Custom label text (default: "Back")
   */
  label?: string;
  /**
   * Custom route to navigate to (default: router.back())
   */
  to?: string;
  /**
   * Callback when back button is pressed
   */
  onPress?: () => void;
  /**
   * Custom text color
   */
  textColor?: string;
  /**
   * Custom icon color
   */
  iconColor?: string;
  /**
   * Show icon (default: true)
   */
  showIcon?: boolean;
  /**
   * Custom margin bottom
   */
  marginBottom?: number;
}

/**
 * Reusable BackButton Component
 * 
 * Provides consistent back navigation across the app
 * - Standard styling (icon + text)
 * - Standard placement (header top-left)
 * - Smart navigation (router.back() with optional fallback route)
 */
export const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  to,
  onPress,
  textColor = colors.text.primary,
  iconColor = colors.text.primary,
  showIcon = true,
  marginBottom = spacing.lg,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (to) {
      router.push(to as any);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom,
      }}
    >
      {showIcon && (
        <MaterialIcons name="arrow-back" size={24} color={iconColor} />
      )}
      <Text
        style={{
          fontSize: typography.fontSize.base,
          color: textColor,
          marginLeft: showIcon ? spacing.sm : 0,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

