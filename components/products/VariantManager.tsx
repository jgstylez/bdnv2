import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProductVariantOption, ProductVariant } from '../../types/merchant';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface VariantManagerProps {
  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];
  onVariantOptionsChange: (options: ProductVariantOption[]) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
}

/**
 * VariantManager Component
 * 
 * Allows merchants to create and manage product variants with inventory tracking.
 * Supports multiple variant options (Size, Color, etc.) and generates all combinations.
 */
export default function VariantManager({
  variantOptions,
  variants,
  onVariantOptionsChange,
  onVariantsChange,
}: VariantManagerProps) {
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  // Add new variant option (e.g., "Size", "Color")
  const handleAddOption = () => {
    if (!newOptionName.trim()) {
      Alert.alert("Error", "Please enter an option name (e.g., Size, Color)");
      return;
    }

    // Check if option name already exists
    if (variantOptions.some((opt) => opt.name.toLowerCase() === newOptionName.trim().toLowerCase())) {
      Alert.alert("Error", "This option already exists");
      return;
    }

    const newOption: ProductVariantOption = {
      id: `opt-${Date.now()}`,
      name: newOptionName.trim(),
      values: [],
    };

    onVariantOptionsChange([...variantOptions, newOption]);
    setNewOptionName("");
  };

  // Remove variant option
  const handleRemoveOption = (optionId: string) => {
    Alert.alert(
      "Remove Option",
      "This will remove all variants. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const filteredOptions = variantOptions.filter((opt) => opt.id !== optionId);
            onVariantOptionsChange(filteredOptions);
            // Clear all variants when removing an option
            onVariantsChange([]);
          },
        },
      ]
    );
  };

  // Add value to an option (e.g., "Small" to "Size")
  const handleAddOptionValue = (optionId: string, value: string) => {
    if (!value.trim()) {
      Alert.alert("Error", "Please enter a value");
      return;
    }

    const updatedOptions = variantOptions.map((opt) => {
      if (opt.id === optionId) {
        // Check if value already exists
        if (opt.values.includes(value.trim())) {
          Alert.alert("Error", "This value already exists");
          return opt;
        }
        return {
          ...opt,
          values: [...opt.values, value.trim()],
        };
      }
      return opt;
    });

    onVariantOptionsChange(updatedOptions);
    setNewOptionValue("");
    generateVariants(updatedOptions);
  };

  // Remove value from an option
  const handleRemoveOptionValue = (optionId: string, value: string) => {
    const updatedOptions = variantOptions.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          values: opt.values.filter((v) => v !== value),
        };
      }
      return opt;
    });

    onVariantOptionsChange(updatedOptions);
    generateVariants(updatedOptions);
  };

  // Generate all variant combinations
  const generateVariants = (options: ProductVariantOption[]) => {
    if (options.length === 0 || options.some((opt) => opt.values.length === 0)) {
      onVariantsChange([]);
      return;
    }

    // Generate all combinations using cartesian product
    const combinations: Record<string, string>[] = [];
    
    const generateCombinations = (current: Record<string, string>, remaining: ProductVariantOption[]) => {
      if (remaining.length === 0) {
        combinations.push({ ...current });
        return;
      }

      const [first, ...rest] = remaining;
      first.values.forEach((value) => {
        generateCombinations(
          { ...current, [first.name]: value },
          rest
        );
      });
    };

    generateCombinations({}, options);

    // Create or update variants
    const newVariants: ProductVariant[] = combinations.map((combo, index) => {
      // Check if variant already exists
      const existingVariant = variants.find((v) =>
        Object.keys(combo).every((key) => v.options[key] === combo[key]) &&
        Object.keys(v.options).length === Object.keys(combo).length
      );

      if (existingVariant) {
        // Keep existing variant data
        return {
          ...existingVariant,
          options: combo,
        };
      }

      // Create new variant
      const variantName = Object.values(combo).join(" / ");
      return {
        id: `var-${Date.now()}-${index}`,
        name: variantName,
        options: combo,
        inventory: 0,
        isActive: true,
      };
    });

    onVariantsChange(newVariants);
  };

  // Update variant inventory
  const handleVariantInventoryChange = (variantId: string, inventory: string) => {
    const updatedVariants = variants.map((v) =>
      v.id === variantId
        ? { ...v, inventory: parseInt(inventory) || 0 }
        : v
    );
    onVariantsChange(updatedVariants);
  };

  // Update variant price
  const handleVariantPriceChange = (variantId: string, price: string) => {
    const updatedVariants = variants.map((v) =>
      v.id === variantId
        ? { ...v, price: price ? parseFloat(price) : undefined }
        : v
    );
    onVariantsChange(updatedVariants);
  };

  // Update variant SKU
  const handleVariantSkuChange = (variantId: string, sku: string) => {
    const updatedVariants = variants.map((v) =>
      v.id === variantId ? { ...v, sku: sku.trim() || undefined } : v
    );
    onVariantsChange(updatedVariants);
  };

  // Toggle variant active status
  const handleToggleVariantActive = (variantId: string) => {
    const updatedVariants = variants.map((v) =>
      v.id === variantId ? { ...v, isActive: !v.isActive } : v
    );
    onVariantsChange(updatedVariants);
  };

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Add New Option */}
      <View>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}
        >
          Variant Options (e.g., Size, Color)
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <TextInput
            value={newOptionName}
            onChangeText={setNewOptionName}
            placeholder="Option name (e.g., Size)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            onSubmitEditing={handleAddOption}
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              color: colors.text.primary,
              fontSize: typography.fontSize.base,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          />
          <TouchableOpacity
            onPress={handleAddOption}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: spacing.xs,
            }}
          >
            <MaterialIcons name="add" size={20} color={colors.text.primary} />
            <Text
              style={{
                color: colors.text.primary,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Existing Options */}
      {variantOptions.map((option) => (
        <View
          key={option.id}
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {option.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveOption(option.id)}
              style={{
                padding: spacing.xs,
              }}
            >
              <MaterialIcons name="delete" size={20} color={colors.status.error} />
            </TouchableOpacity>
          </View>

          {/* Option Values */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.sm }}>
            {option.values.map((value) => (
              <View
                key={value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.accentLight,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                  gap: spacing.xs,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.accent,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  {value}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveOptionValue(option.id, value)}
                  style={{ padding: 2 }}
                >
                  <MaterialIcons name="close" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add Value Input */}
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <TextInput
              value={newOptionValue}
              onChangeText={setNewOptionValue}
              placeholder={`Add ${option.name} value`}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              onSubmitEditing={() => {
                if (newOptionValue.trim()) {
                  handleAddOptionValue(option.id, newOptionValue);
                }
              }}
              style={{
                flex: 1,
                backgroundColor: colors.primary.bg,
                borderRadius: borderRadius.sm,
                padding: spacing.sm,
                color: colors.text.primary,
                fontSize: typography.fontSize.sm,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (newOptionValue.trim()) {
                  handleAddOptionValue(option.id, newOptionValue);
                }
              }}
              style={{
                backgroundColor: colors.accent,
                borderRadius: borderRadius.sm,
                padding: spacing.sm,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="add" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Variants List */}
      {variants.length > 0 && (
        <View>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Variants ({variants.length})
          </Text>
          <ScrollView
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={true}
          >
            {variants.map((variant) => (
              <View
                key={variant.id}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  borderWidth: 1,
                  borderColor: variant.isActive ? colors.border.light : colors.status.error + "40",
                  opacity: variant.isActive ? 1 : 0.6,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    {variant.name || Object.values(variant.options).join(" / ")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleToggleVariantActive(variant.id)}
                    style={{
                      padding: spacing.xs,
                    }}
                  >
                    <MaterialIcons
                      name={variant.isActive ? "check-circle" : "cancel"}
                      size={20}
                      color={variant.isActive ? colors.status.success : colors.status.error}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ gap: spacing.sm }}>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Inventory
                      </Text>
                      <TextInput
                        value={variant.inventory.toString()}
                        onChangeText={(text) => handleVariantInventoryChange(variant.id, text)}
                        placeholder="0"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="numeric"
                        style={{
                          backgroundColor: colors.primary.bg,
                          borderRadius: borderRadius.sm,
                          padding: spacing.sm,
                          color: colors.text.primary,
                          fontSize: typography.fontSize.sm,
                          borderWidth: 1,
                          borderColor: colors.border.light,
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Price Override (optional)
                      </Text>
                      <TextInput
                        value={variant.price?.toString() || ""}
                        onChangeText={(text) => handleVariantPriceChange(variant.id, text)}
                        placeholder="Base price"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="decimal-pad"
                        style={{
                          backgroundColor: colors.primary.bg,
                          borderRadius: borderRadius.sm,
                          padding: spacing.sm,
                          color: colors.text.primary,
                          fontSize: typography.fontSize.sm,
                          borderWidth: 1,
                          borderColor: colors.border.light,
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      SKU (optional)
                    </Text>
                    <TextInput
                      value={variant.sku || ""}
                      onChangeText={(text) => handleVariantSkuChange(variant.id, text)}
                      placeholder="SKU-001"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: colors.primary.bg,
                        borderRadius: borderRadius.sm,
                        padding: spacing.sm,
                        color: colors.text.primary,
                        fontSize: typography.fontSize.sm,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

