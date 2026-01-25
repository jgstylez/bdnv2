import React from "react";
import { View, Text, TextInput, TextInputProps, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface FormTextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function FormTextArea({
  label,
  error,
  containerStyle,
  style,
  numberOfLines = 4,
  ...props
}: FormTextAreaProps) {
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
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        accessible={true}
        accessibilityRole="textbox"
        accessibilityLabel={props.accessibilityLabel || label || props.placeholder || "Text area input"}
        accessibilityHint={props.accessibilityHint || (error ? `Error: ${error}` : "Multiline text input")}
        accessibilityState={{ 
          ...props.accessibilityState,
          ...(error ? { invalid: true } : {})
        }}
        style={[
          {
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            color: colors.text.primary,
            fontSize: typography.fontSize.base,
            borderWidth: 1,
            borderColor: error ? colors.status.error : colors.border,
            minHeight: numberOfLines * 24 + spacing.md * 2,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.textColors.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
