import React from "react";
import { View, Text, ViewStyle } from "react-native";
import { colors, spacing, typography } from '../../constants/theme';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function FormSection({
  title,
  description,
  children,
  containerStyle,
}: FormSectionProps) {
  return (
    <View style={[{ gap: spacing.lg }, containerStyle]}>
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: "700",
            color: colors.text.primary,
            marginBottom: description ? spacing.xs : 0,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      <View style={{ gap: spacing.md }}>
        {children}
      </View>
    </View>
  );
}
