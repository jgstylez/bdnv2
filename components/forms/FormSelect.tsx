import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  required?: boolean;
  options: Option[];
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  error?: string;
  helperText?: string;
  multiple?: boolean;
  horizontal?: boolean;
}

/**
 * FormSelect Component
 * Reusable select/picker component with pill-style options
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  required = false,
  options,
  value,
  onValueChange,
  error,
  helperText,
  multiple = false,
  horizontal = false,
}) => {
  const isSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onValueChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onValueChange([...currentValues, optionValue]);
      }
    } else {
      onValueChange(optionValue);
    }
  };

  const content = (
    <View style={{ flexDirection: horizontal ? "row" : "column", flexWrap: "wrap", gap: spacing.sm }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelect(option.value)}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
            backgroundColor: isSelected(option.value) ? colors.accent : colors.background.input,
            borderWidth: 1,
            borderColor: isSelected(option.value) ? colors.accent : colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: isSelected(option.value) ? colors.text.primary : colors.text.secondary,
            }}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
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

