/**
 * Sort Selector Component
 * 
 * Enhanced sorting UI for search results
 */

import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";

export type SortOption = "relevance" | "distance" | "rating" | "price" | "newest" | "name";

interface SortOptionConfig {
  key: SortOption;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  description?: string;
}

const sortOptions: SortOptionConfig[] = [
  { key: "relevance", label: "Relevance", icon: "sort" },
  { key: "distance", label: "Distance", icon: "location-on", description: "Nearest first" },
  { key: "rating", label: "Rating", icon: "star", description: "Highest rated" },
  { key: "price", label: "Price", icon: "attach-money", description: "Lowest first" },
  { key: "newest", label: "Newest", icon: "schedule", description: "Recently added" },
  { key: "name", label: "Name", icon: "sort-by-alpha", description: "A-Z" },
];

interface SortSelectorProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  visible: boolean;
  onClose: () => void;
}

export function SortSelector({
  sortBy,
  onSortChange,
  visible,
  onClose,
}: SortSelectorProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            paddingTop: spacing.lg,
            maxHeight: "60%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold as any,
                color: colors.text.primary,
              }}
            >
              Sort By
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            {sortOptions.map((option) => {
              const isSelected = sortBy === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => {
                    onSortChange(option.key);
                    onClose();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: isSelected ? colors.accent + "20" : "transparent",
                    borderWidth: 1,
                    borderColor: isSelected ? colors.accent : colors.border,
                  }}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={24}
                    color={isSelected ? colors.accent : colors.text.secondary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: isSelected ? typography.fontWeight.semibold as any : typography.fontWeight.normal as any,
                        color: isSelected ? colors.accent : colors.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                          marginTop: 2,
                        }}
                      >
                        {option.description}
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
