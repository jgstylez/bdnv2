import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing } from "../../constants/theme";

interface ProductTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
  productTypes: {
    id: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    description: string;
  }[];
}

export function ProductTypeSelector({
  selectedType,
  onSelect,
  productTypes,
}: ProductTypeSelectorProps) {
  return (
    <View style={{ gap: spacing.md }}>
      {productTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          onPress={() => onSelect(type.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: selectedType === type.id ? "rgba(186, 153, 136, 0.1)" : "#232323",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: selectedType === type.id ? "#ba9988" : "transparent",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: selectedType === type.id ? "#ba9988" : "#474747",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <MaterialIcons
              name={type.icon}
              size={24}
              color="#ffffff"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              {type.label}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {type.description}
            </Text>
          </View>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: selectedType === type.id ? "#ba9988" : "rgba(255, 255, 255, 0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedType === type.id && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#ba9988",
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
