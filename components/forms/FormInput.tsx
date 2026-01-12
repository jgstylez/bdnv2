import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, ViewStyle, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean;
}

export function FormInput({
  label,
  error,
  containerStyle,
  style,
  showPasswordToggle,
  secureTextEntry,
  ...props
}: FormInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: "600",
            color: colors.text.primary,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
      )}
      <View style={{ position: "relative" }}>
        <TextInput
          placeholderTextColor="rgba(186, 153, 136, 0.5)"
          accessible={true}
          accessibilityRole="textbox"
          accessibilityLabel={props.accessibilityLabel || label || props.placeholder || "Text input"}
          accessibilityHint={props.accessibilityHint || (error ? `Error: ${error}` : undefined)}
          accessibilityState={{ 
            ...props.accessibilityState,
            ...(error ? { invalid: true } : {})
          }}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            {
              backgroundColor: "#2a2a2a",
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              paddingRight: showPasswordToggle && secureTextEntry ? 48 : spacing.md,
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
              borderWidth: 1.5,
              borderColor: error 
                ? colors.status.error 
                : isFocused 
                  ? colors.accent 
                  : "rgba(186, 153, 136, 0.3)",
              minHeight: 48,
            },
            style,
          ]}
          {...props}
        />
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              padding: 4,
              borderRadius: 8,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
            accessibilityRole="button"
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility-off" : "visibility"}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.textColors.error,
            marginTop: 2,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
