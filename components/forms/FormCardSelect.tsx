import React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface FormCardSelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string; description?: string }[];
  onSelect: (value: string) => void;
  error?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

/**
 * FormCardSelect Component
 * 
 * Displays selectable options as cards with checkboxes, similar to the
 * organization type selection pattern. Each option is displayed as a
 * card that can be selected.
 */
export function FormCardSelect({
  label,
  value,
  options,
  onSelect,
  error,
  placeholder,
  containerStyle,
  required = false,
}: FormCardSelectProps) {
  return (
    <View style={[{ gap: spacing.sm }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: "600",
            color: "#ffffff", // White for better contrast on dark background
            marginBottom: spacing.xs,
          }}
        >
          {label}
          {required && <Text style={{ color: colors.status.errorText }}> *</Text>}
        </Text>
      )}

      <View style={{ gap: spacing.md }}>
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.input, // Darker background (#28282d) for better contrast
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: isSelected
                  ? colors.accent
                  : error
                    ? colors.status.error + "60" // More visible error border
                    : "rgba(186, 153, 136, 0.3)", // Slightly more visible border
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              {/* Checkbox */}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.accent : "rgba(255, 255, 255, 0.4)", // Lighter border for better visibility
                  backgroundColor: isSelected ? colors.accent : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <MaterialIcons name="check" size={16} color="#ffffff" />
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: isSelected ? "700" : "600",
                    color: "#ffffff", // White for maximum contrast on dark background
                    marginBottom: option.description ? spacing.xs : 0,
                  }}
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: "rgba(255, 255, 255, 0.8)", // 80% white for good contrast
                      lineHeight: 20,
                    }}
                  >
                    {option.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.status.errorText, // Lighter red for better contrast on dark background
            marginTop: spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
