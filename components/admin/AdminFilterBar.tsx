import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

interface FilterOption {
  key: string;
  label: string;
}

interface AdminFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  hideSearch?: boolean;
  filterGroups?: {
    key: string;
    options: FilterOption[];
    selected?: string;
    onSelect: (key: string) => void;
  }[];
}

/**
 * AdminFilterBar Component
 * Reusable search bar and filter pills for admin pages
 */
export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  hideSearch = false,
  filterGroups = [],
}) => {
  const { isMobile } = useResponsive();

  return (
    <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
      {/* Search Bar */}
      {!hideSearch && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.text.placeholder}
            style={{
              flex: 1,
              paddingVertical: spacing.md - 2,
              paddingHorizontal: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.text.primary,
            }}
          />
        </View>
      )}

      {/* Filter Groups */}
      {filterGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
          {group.options.map((option) => {
            const isSelected = group.selected === option.key || (option.key === "all" && !group.selected);
            return (
              <TouchableOpacity
                key={option.key}
                onPress={() => group.onSelect(option.key === "all" ? "" : option.key)}
                style={{
                  backgroundColor: isSelected ? colors.accent : colors.secondary.bg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: isSelected ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

