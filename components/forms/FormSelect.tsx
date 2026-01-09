import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ViewStyle, Platform, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface FormSelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  error?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
}

export function FormSelect({
  label,
  value,
  options,
  onSelect,
  error,
  placeholder = "Select an option",
  containerStyle,
  buttonStyle,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = () => {
    if (Platform.OS === "web" && buttonRef.current) {
      // Measure button position for web
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonLayout({ x: pageX, y: pageY, width, height });
        setIsOpen(true);
      });
    } else {
      setIsOpen(true);
    }
  };

  const renderDropdown = () => (
    <View
      style={{
        backgroundColor: "#474747",
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: "#5a5a68",
        maxHeight: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 20,
        opacity: 1,
      }}
      onStartShouldSetResponder={() => true}
    >
      <ScrollView nestedScrollEnabled>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => {
              onSelect(option.value);
              setIsOpen(false);
            }}
            style={{
              padding: spacing.md,
              borderBottomWidth: index < options.length - 1 ? 1 : 0,
              borderBottomColor: "#5a5a68",
              backgroundColor: value === option.value ? "rgba(186, 153, 136, 0.3)" : "#474747",
            }}
          >
            <Text
              style={{
                color: value === option.value ? colors.accent : colors.text.primary,
                fontWeight: value === option.value ? "600" : "400",
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[{ gap: spacing.xs, zIndex: isOpen ? 10000 : 1 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: "600",
            color: colors.text.primary,
          }}
        >
          {label}
        </Text>
      )}
      
      <View 
        style={{ position: "relative" }} 
        ref={buttonRef}
      >
        <TouchableOpacity
          onPress={handleOpen}
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#474747",
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: error ? colors.status.error : isOpen ? colors.accent : "#5a5a68",
            },
            buttonStyle,
          ]}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: selectedOption ? colors.text.primary : colors.text.placeholder,
            }}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <MaterialIcons
            name={isOpen ? "expand-less" : "expand-more"}
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        {Platform.OS === "web" && isOpen ? (
          <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
              activeOpacity={1}
              onPress={() => setIsOpen(false)}
            >
              <View
                style={{
                  position: "absolute",
                  top: buttonLayout.y + buttonLayout.height + 4,
                  left: buttonLayout.x,
                  width: buttonLayout.width || 300,
                }}
                onStartShouldSetResponder={() => true}
              >
                {renderDropdown()}
              </View>
            </TouchableOpacity>
          </Modal>
        ) : (
          isOpen && (
            <>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  left: -1000,
                  right: -1000,
                  bottom: -1000,
                  zIndex: 10000,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
                onPress={() => setIsOpen(false)}
                activeOpacity={1}
              />
              <View
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  zIndex: 10001,
                }}
              >
                {renderDropdown()}
              </View>
            </>
          )
        )}
      </View>

      {error && (
        <Text
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.status.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
