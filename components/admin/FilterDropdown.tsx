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
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.lg,
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: borderRadius.lg,
              width: "100%",
              maxWidth: 400,
              maxHeight: 500,
              borderWidth: 2,
              borderColor: "#5a5a68",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 16,
              elevation: 20,
              overflow: "hidden",
            }}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={{
                padding: spacing.lg,
                borderBottomWidth: 2,
                borderBottomColor: "#5a5a68",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#474747",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                {label}
              </Text>
              <TouchableOpacity 
                onPress={() => setIsOpen(false)}
                style={{
                  padding: spacing.xs,
                  borderRadius: borderRadius.sm,
                  backgroundColor: "transparent",
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={true}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={{
                    paddingVertical: spacing.lg,
                    paddingHorizontal: spacing.lg,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: "#5a5a68",
                    backgroundColor: value === option.value 
                      ? "rgba(186, 153, 136, 0.3)" 
                      : "#474747",
                    minHeight: 52,
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: value === option.value 
                          ? typography.fontWeight.bold 
                          : typography.fontWeight.medium,
                        color: value === option.value 
                          ? colors.accent 
                          : colors.text.primary,
                        flex: 1,
                      }}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <View
                        style={{
                          marginLeft: spacing.md,
                          backgroundColor: colors.accent + "20",
                          borderRadius: borderRadius.full,
                          padding: spacing.xs,
                        }}
                      >
                        <MaterialIcons name="check-circle" size={22} color={colors.accent} />
                      </View>
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

