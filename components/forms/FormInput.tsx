import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface FormInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

/**
 * FormInput Component
 * Reusable text input with label, error handling, and consistent styling
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  required = false,
  error,
  helperText,
  style,
  ...textInputProps
}) => {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}
      >
        {label} {required && <Text style={{ color: colors.status.error }}>*</Text>}
      </Text>
      <TextInput
        {...textInputProps}
        style={[
          {
            backgroundColor: colors.background.input,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            color: colors.text.primary,
            fontSize: typography.fontSize.base,
            borderWidth: 1,
            borderColor: error ? colors.status.error : colors.border.light,
          },
          style,
        ]}
        placeholderTextColor={colors.text.placeholder}
      />
      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.status.error,
            marginTop: spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.tertiary,
            marginTop: spacing.xs,
          }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

