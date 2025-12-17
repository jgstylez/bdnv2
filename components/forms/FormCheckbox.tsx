import React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export function FormCheckbox({
  label,
  checked,
  onChange,
  error,
  containerStyle,
}: FormCheckboxProps) {
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => onChange(!checked)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: borderRadius.sm,
            borderWidth: 2,
            borderColor: checked ? colors.accent : colors.text.tertiary,
            backgroundColor: checked ? colors.accent : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked && (
            <MaterialIcons name="check" size={16} color={colors.primary.bg} />
          )}
        </View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.primary,
            flex: 1,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.status.error,
            marginTop: spacing.xs,
            marginLeft: 32,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
