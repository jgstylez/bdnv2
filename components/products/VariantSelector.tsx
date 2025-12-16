import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Product, ProductVariant, ProductVariantOption } from "../../types/merchant";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

interface VariantSelectorProps {
  product: Product;
  selectedVariantId?: string;
  onVariantSelect: (variantId: string | undefined) => void;
  showInventory?: boolean;
}

/**
 * VariantSelector Component
 * 
 * Displays variant options (Size, Color, etc.) and allows users to select a variant.
 * Handles variant combinations and inventory display.
 */
export default function VariantSelector({
  product,
  selectedVariantId,
  onVariantSelect,
  showInventory = true,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Get variant options from product
  const variantOptions = product.variantOptions || [];

  // Get all variants
  const variants = product.variants || [];

  // Check if product has variants
  const hasVariants = variantOptions.length > 0 && variants.length > 0;

  if (!hasVariants) {
    return null;
  }

  // Find selected variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!selectedVariantId) {
      // Try to find variant matching current selections
      return variants.find((v) =>
        Object.keys(selectedOptions).every(
          (key) => v.options[key] === selectedOptions[key]
        )
      );
    }
    return variants.find((v) => v.id === selectedVariantId);
  }, [selectedVariantId, selectedOptions, variants]);

  // Handle option selection
  const handleOptionSelect = (optionName: string, value: string) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionName]: value,
    };

    setSelectedOptions(newSelectedOptions);

    // Find matching variant
    const matchingVariant = variants.find((v) =>
      Object.keys(newSelectedOptions).every(
        (key) => v.options[key] === newSelectedOptions[key]
      ) && Object.keys(v.options).length === Object.keys(newSelectedOptions).length
    );

    if (matchingVariant) {
      onVariantSelect(matchingVariant.id);
    } else {
      // Partial selection - clear variant selection
      onVariantSelect(undefined);
    }
  };

  // Get available values for an option based on current selections
  const getAvailableValues = (optionName: string): string[] => {
    if (Object.keys(selectedOptions).length === 0) {
      // No selections yet - return all unique values for this option
      const values = new Set<string>();
      variants.forEach((v) => {
        if (v.options[optionName] && v.isActive) {
          values.add(v.options[optionName]);
        }
      });
      return Array.from(values);
    }

    // Filter variants based on current selections (excluding current option)
    const filteredVariants = variants.filter((v) => {
      return Object.keys(selectedOptions)
        .filter((key) => key !== optionName)
        .every((key) => v.options[key] === selectedOptions[key]) && v.isActive;
    });

    // Get unique values for this option from filtered variants
    const values = new Set<string>();
    filteredVariants.forEach((v) => {
      if (v.options[optionName]) {
        values.add(v.options[optionName]);
      }
    });
    return Array.from(values);
  };

  // Check if a value is available (has active variants)
  const isValueAvailable = (optionName: string, value: string): boolean => {
    return getAvailableValues(optionName).includes(value);
  };

  return (
    <View style={{ marginBottom: spacing.lg }}>
      {variantOptions.map((option) => {
        const availableValues = getAvailableValues(option.name);
        const currentValue = selectedOptions[option.name];

        return (
          <View key={option.id} style={{ marginBottom: spacing.md }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}
            >
              {option.name}:
              {currentValue && (
                <Text style={{ color: colors.accent }}> {currentValue}</Text>
              )}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.sm }}
            >
              {option.values.map((value) => {
                const isSelected = currentValue === value;
                const isAvailable = isValueAvailable(option.name, value);
                const isDisabled = !isAvailable;

                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      if (!isDisabled) {
                        handleOptionSelect(option.name, value);
                      }
                    }}
                    disabled={isDisabled}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: isSelected
                        ? colors.accent
                        : isDisabled
                          ? "rgba(255, 255, 255, 0.05)"
                          : colors.secondary.bg,
                      borderWidth: 2,
                      borderColor: isSelected
                        ? colors.accent
                        : isDisabled
                          ? "rgba(186, 153, 136, 0.1)"
                          : colors.border.light,
                      opacity: isDisabled ? 0.4 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: isSelected
                          ? typography.fontWeight.bold
                          : typography.fontWeight.normal,
                        color: isSelected
                          ? colors.text.primary
                          : isDisabled
                            ? colors.text.secondary
                            : colors.text.primary,
                      }}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );
      })}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <View
          style={{
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          {selectedVariant.price !== undefined && selectedVariant.price !== product.price && (
            <View style={{ marginBottom: spacing.xs }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.accent,
                }}
              >
                ${selectedVariant.price.toFixed(2)}
              </Text>
            </View>
          )}
          {showInventory && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
              {selectedVariant.inventory > 0 ? (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color={colors.status.success}
                  />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color:
                        selectedVariant.inventory <= (selectedVariant.lowStockThreshold || 10)
                          ? colors.status.warning
                          : colors.status.success,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    {selectedVariant.inventory > (selectedVariant.lowStockThreshold || 10)
                      ? `In Stock (${selectedVariant.inventory} available)`
                      : `Low Stock (${selectedVariant.inventory} available)`}
                  </Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="cancel" size={16} color={colors.status.error} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.status.error,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    Out of Stock
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      )}

      {/* Warning if no variant selected but variants exist */}
      {!selectedVariant && variants.length > 0 && (
        <View
          style={{
            marginTop: spacing.md,
            padding: spacing.sm,
            backgroundColor: colors.status.warning + "20",
            borderRadius: borderRadius.sm,
            borderWidth: 1,
            borderColor: colors.status.warning,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.status.warning,
            }}
          >
            Please select all options to continue
          </Text>
        </View>
      )}
    </View>
  );
}

