import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

/**
 * FilterDropdown Component
 * Dropdown select for admin filters
 */
export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value) || options.find((opt) => opt.value === "");

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={{ flex: 1, minWidth: 150 }}>
      <Text
        style={{
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.secondary,
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.md - 2,
          paddingHorizontal: spacing.md,
          borderWidth: 1,
          borderColor: colors.border.light,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={colors.text.secondary}
          style={{ marginLeft: spacing.xs }}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.lg,
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              width: "100%",
              maxWidth: 400,
              maxHeight: 400,
              borderWidth: 1,
              borderColor: colors.border.light,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={{
                padding: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.light,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                {label}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <MaterialIcons name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={{
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.light,
                    backgroundColor: value === option.value ? colors.accent + "20" : "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: value === option.value ? typography.fontWeight.bold : typography.fontWeight.medium,
                        color: value === option.value ? colors.text.primary : colors.text.secondary,
                      }}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <MaterialIcons name="check" size={20} color={colors.accent} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

