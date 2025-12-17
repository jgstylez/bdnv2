import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface FormSelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  error?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

export function FormSelect({
  label,
  value,
  options,
  onSelect,
  error,
  placeholder = "Select an option",
  containerStyle,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={[{ gap: spacing.xs, zIndex: isOpen ? 100 : 1 }, containerStyle]}>
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
      
      <View style={{ position: "relative" }}>
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: error ? colors.status.error : isOpen ? colors.accent : colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: selectedOption ? colors.text.primary : colors.text.placeholder,
            }}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <MaterialIcons
            name={isOpen ? "expand-less" : "expand-more"}
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        {isOpen && (
          <>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: -1000,
                right: -1000,
                bottom: -1000,
                zIndex: -1,
              }}
              onPress={() => setIsOpen(false)}
            />
            <View
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 4,
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.border.light,
                maxHeight: 200,
                zIndex: 1000,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <ScrollView nestedScrollEnabled>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      onSelect(option.value);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: spacing.md,
                      borderBottomWidth: index < options.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border.light,
                      backgroundColor: value === option.value ? colors.accentLight : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color: value === option.value ? colors.accent : colors.text.primary,
                        fontWeight: value === option.value ? "600" : "400",
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </View>

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
