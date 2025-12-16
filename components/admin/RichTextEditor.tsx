import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

/**
 * RichTextEditor Component
 * Simple rich text editor for React Native with formatting toolbar
 * Supports Markdown formatting (bold, italic, links)
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content...",
  label,
  required = false,
}) => {
  const insertFormat = (before: string, after: string = before) => {
    // Insert formatting at the end of the text
    const newValue = value + before + after;
    onChange(newValue);
  };

  const formatBold = () => {
    insertFormat("**", "**");
  };

  const formatItalic = () => {
    insertFormat("*", "*");
  };

  const formatLink = () => {
    insertFormat("[", "]()");
  };

  return (
    <View>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          {label} {required && <Text style={{ color: "#ba9988" }}>*</Text>}
        </Text>
      )}
      
      {/* Toolbar */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: "#232323",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
        }}
      >
        <TouchableOpacity
          onPress={formatBold}
          style={{
            padding: 6,
            borderRadius: 4,
          }}
        >
          <MaterialIcons name="format-bold" size={18} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={formatItalic}
          style={{
            padding: 6,
            borderRadius: 4,
          }}
        >
          <MaterialIcons name="format-italic" size={18} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={formatLink}
          style={{
            padding: 6,
            borderRadius: 4,
          }}
        >
          <MaterialIcons name="link" size={18} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
        <View style={{ width: 1, backgroundColor: "rgba(255, 255, 255, 0.2)", marginHorizontal: 4 }} />
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.5)",
            alignSelf: "center",
            paddingHorizontal: 8,
          }}
        >
          Markdown supported
        </Text>
      </View>

      {/* Text Input */}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.4)"
        multiline
        numberOfLines={12}
        style={{
          backgroundColor: "#232323",
          borderRadius: 12,
          padding: 14,
          color: "#ffffff",
          fontSize: 14,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.2)",
          textAlignVertical: "top",
          minHeight: 200,
        }}
      />
    </View>
  );
};

