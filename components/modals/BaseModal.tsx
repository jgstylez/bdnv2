import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { useResponsive } from "../../hooks/useResponsive";

export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
}

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: ModalAction[];
  maxWidth?: number;
}

export function BaseModal({
  visible,
  onClose,
  title,
  children,
  actions,
  maxWidth = 600,
}: BaseModalProps) {
  const { isMobile, width } = useResponsive();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.md,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: isMobile ? width - 32 : maxWidth,
            backgroundColor: colors.primary.bg,
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
            maxHeight: "90%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.xl,
              borderBottomWidth: 1,
              borderBottomColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: "700",
                color: colors.text.primary,
              }}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 4,
                borderRadius: borderRadius.full,
                backgroundColor: colors.secondary.bg,
              }}
            >
              <MaterialIcons name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={{ padding: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {actions && actions.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: spacing.md,
                padding: spacing.xl,
                borderTopWidth: 1,
                borderTopColor: colors.border.light,
                backgroundColor: colors.secondary.bg,
                borderBottomLeftRadius: borderRadius.xl,
                borderBottomRightRadius: borderRadius.xl,
              }}
            >
              {actions.map((action, index) => {
                const getBackgroundColor = () => {
                  switch (action.variant) {
                    case "primary": return colors.accent;
                    case "danger": return colors.status.error;
                    case "secondary": return colors.secondary.bg;
                    case "outline": return "transparent";
                    default: return colors.accent;
                  }
                };

                const getTextColor = () => {
                  switch (action.variant) {
                    case "secondary": return colors.text.primary;
                    case "outline": return colors.text.primary;
                    default: return "#ffffff";
                  }
                };

                const getBorderColor = () => {
                  switch (action.variant) {
                    case "secondary": return colors.border.light;
                    case "outline": return colors.border.light;
                    default: return "transparent";
                  }
                };

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={action.onPress}
                    disabled={action.disabled}
                    style={{
                      paddingHorizontal: spacing.xl,
                      paddingVertical: spacing.md,
                      borderRadius: borderRadius.lg,
                      backgroundColor: getBackgroundColor(),
                      borderWidth: 1,
                      borderColor: getBorderColor(),
                      opacity: action.disabled ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: "600",
                        color: getTextColor(),
                      }}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
