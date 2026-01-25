/**
 * Search Filters Panel Component
 * 
 * Enhanced filtering UI for search results with multiple filter options
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { SearchFilters } from "@/types/search";
import { BUSINESS_CATEGORIES } from "@/constants/categories";
import { FormInput } from "@/components/forms";

interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  visible,
  onClose,
  onApply,
  onReset,
}: SearchFiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset();
  };

  const activeFilterCount = Object.keys(localFilters).filter(
    (key) => localFilters[key as keyof SearchFilters] !== undefined
  ).length;

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
            maxHeight: "90%",
            paddingTop: spacing.lg,
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
              Filters
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: spacing.lg,
              gap: spacing.xl,
            }}
          >
            {/* Type Filter */}
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Type
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                {[
                  { key: "business", label: "Businesses", icon: "store" },
                  { key: "product", label: "Products", icon: "shopping-bag" },
                  { key: "service", label: "Services", icon: "build" },
                  { key: "media", label: "Media", icon: "movie" },
                ].map((type) => {
                  const isSelected =
                    localFilters.type?.includes(type.key as any) || false;
                  return (
                    <TouchableOpacity
                      key={type.key}
                      onPress={() => {
                        const currentTypes = localFilters.type || [];
                        const newTypes = isSelected
                          ? currentTypes.filter((t) => t !== type.key)
                          : [...currentTypes, type.key as any];
                        updateFilter("type", newTypes.length > 0 ? newTypes : undefined);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        backgroundColor: isSelected ? colors.accent : colors.secondary,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.accent : colors.border,
                      }}
                    >
                      <MaterialIcons
                        name={type.icon as any}
                        size={16}
                        color={isSelected ? colors.textColors.onAccent : colors.text.secondary}
                      />
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium as any,
                          color: isSelected ? colors.textColors.onAccent : colors.text.primary,
                        }}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Filter */}
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Category
              </Text>
              <View style={{ maxHeight: 200 }}>
                <ScrollView
                  nestedScrollEnabled
                  style={{ maxHeight: 200 }}
                  contentContainerStyle={{ gap: spacing.sm }}
                >
                  {["All", ...BUSINESS_CATEGORIES.slice(0, 20)].map((category) => {
                    const isSelected = localFilters.category === category || (category === "All" && !localFilters.category);
                    return (
                      <TouchableOpacity
                        key={category}
                        onPress={() => {
                          updateFilter("category", category === "All" ? undefined : category);
                        }}
                        style={{
                          paddingVertical: spacing.sm,
                          paddingHorizontal: spacing.md,
                          borderRadius: borderRadius.md,
                          backgroundColor: isSelected ? colors.accent + "20" : "transparent",
                          borderWidth: 1,
                          borderColor: isSelected ? colors.accent : colors.border,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: isSelected ? colors.accent : colors.text.primary,
                            fontWeight: isSelected ? typography.fontWeight.semibold as any : typography.fontWeight.normal as any,
                          }}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Price Range Filter */}
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Price Range
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Min Price"
                    placeholder="0"
                    keyboardType="numeric"
                    value={localFilters.priceRange?.min?.toString() || ""}
                    onChangeText={(text) => {
                      const min = text ? parseFloat(text) : undefined;
                      updateFilter("priceRange", {
                        min: min || 0,
                        max: localFilters.priceRange?.max || 1000,
                      });
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    marginTop: spacing.lg,
                  }}
                >
                  to
                </Text>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Max Price"
                    placeholder="1000"
                    keyboardType="numeric"
                    value={localFilters.priceRange?.max?.toString() || ""}
                    onChangeText={(text) => {
                      const max = text ? parseFloat(text) : undefined;
                      updateFilter("priceRange", {
                        min: localFilters.priceRange?.min || 0,
                        max: max || 1000,
                      });
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Rating Filter */}
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Minimum Rating
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
                {[4, 4.5, 5].map((rating) => {
                  const isSelected = localFilters.rating === rating;
                  return (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => {
                        updateFilter("rating", isSelected ? undefined : rating);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        backgroundColor: isSelected ? colors.accent : colors.secondary,
                        borderWidth: 1,
                        borderColor: isSelected ? colors.accent : colors.border,
                      }}
                    >
                      <MaterialIcons
                        name="star"
                        size={16}
                        color={isSelected ? colors.textColors.onAccent : colors.text.secondary}
                      />
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium as any,
                          color: isSelected ? colors.textColors.onAccent : colors.text.primary,
                        }}
                      >
                        {rating}+
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              padding: spacing.lg,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={handleReset}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.secondary,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.text.primary,
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.textColors.onAccent,
                }}
              >
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
