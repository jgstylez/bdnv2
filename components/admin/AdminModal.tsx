import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";
import { useResponsive } from "../../hooks/useResponsive";

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: {
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
  }[];
  maxWidth?: number;
}

/**
 * AdminModal Component
 * Reusable modal component for admin pages
 */
export const AdminModal: React.FC<AdminModalProps> = ({
  visible,
  onClose,
  title,
  children,
  actions = [],
  maxWidth = 600,
}) => {
  const { isMobile } = useResponsive();

  const getActionStyle = (variant: "primary" | "secondary" | "danger" = "primary") => {
    switch (variant) {
      case "danger":
        return {
          backgroundColor: colors.status.errorLight,
          borderColor: colors.status.error,
        };
      case "secondary":
        return {
          backgroundColor: colors.primary.bg,
          borderColor: colors.border.light,
        };
      default:
        return {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        };
    }
  };

  const getActionTextColor = (variant: "primary" | "secondary" | "danger" = "primary") => {
    switch (variant) {
      case "danger":
        return colors.status.error;
      case "secondary":
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          justifyContent: "center",
          alignItems: "center",
          padding: spacing["2xl"],
        }}
      >
        <ScrollView
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.xl,
            padding: spacing["2xl"],
            width: "100%",
            maxWidth: isMobile ? "100%" : maxWidth,
            maxHeight: "90%",
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
          contentContainerStyle={{ gap: spacing.lg }}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: borderRadius.sm,
                backgroundColor: colors.primary.bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ gap: spacing.lg }}>{children}</View>

          {/* Actions */}
          {actions.length > 0 && (
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  disabled={action.disabled}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md - 2,
                    borderRadius: borderRadius.md,
                    borderWidth: 1,
                    alignItems: "center",
                    opacity: action.disabled ? 0.5 : 1,
                    ...getActionStyle(action.variant),
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.semibold,
                      color: getActionTextColor(action.variant),
                    }}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

