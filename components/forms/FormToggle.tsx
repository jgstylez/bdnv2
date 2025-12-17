import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from '../../constants/theme';

interface FormToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  helperText?: string;
}

/**
 * FormToggle Component
 * Reusable toggle/switch component with label
 */
export const FormToggle: React.FC<FormToggleProps> = ({
  label,
  value,
  onValueChange,
  helperText,
}) => {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.xs,
            }}
          >
            {label}
          </Text>
          {helperText && (
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.tertiary,
              }}
            >
              {helperText}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => onValueChange(!value)}
          style={{
            width: 50,
            height: 30,
            borderRadius: 15,
            backgroundColor: value ? colors.status.success : colors.secondary.bg,
            justifyContent: "center",
            paddingHorizontal: 4,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.text.primary,
              transform: [{ translateX: value ? 20 : 0 }],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

