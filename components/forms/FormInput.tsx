import React from "react";
import { View, Text, TextInput, TextInputProps, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function FormInput({
  label,
  error,
  containerStyle,
  style,
  ...props
}: FormInputProps) {
  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: "600",
            color: colors.text.primary,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.text.placeholder}
        style={[
          {
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            color: colors.text.primary,
            fontSize: typography.fontSize.base,
            borderWidth: 1,
            borderColor: error ? colors.status.error : colors.border.light,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.status.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
