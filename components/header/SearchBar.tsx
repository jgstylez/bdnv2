import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  style?: any;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  onSearch,
  style,
}: SearchBarProps) {
  return (
    <View
      style={{
        width: "100%", // Take full width of parent container
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.lg,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border.light,
        ...style,
      }}
    >
      <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        onSubmitEditing={onSearch}
        style={{
          flex: 1,
          paddingHorizontal: spacing.md,
          fontSize: typography.fontSize.base,
          color: colors.text.primary,
          height: "100%",
        }}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText?.("")}>
          <MaterialIcons name="close" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
