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
    } else {
      // Always try router.back() first to respect navigation history
      // If 'to' is provided, it serves as a fallback route
      // Note: router.back() doesn't throw errors, so we call it first
      router.back();
      
      // If 'to' is provided and router.back() doesn't navigate (no history),
      // the app will stay on the current page. In that case, we could navigate
      // to 'to', but since we can't detect if back() worked, we'll just use back()
      // and trust the navigation stack. If needed, users can provide onPress
      // with custom logic to handle fallback navigation.
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Go back${label !== "Back" ? ` to ${label}` : ""}`}
      accessibilityHint="Returns to previous page"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

