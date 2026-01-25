import React, { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

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
  const modalContentRef = useRef<View>(null);
  const closeButtonRef = useRef<TouchableOpacity>(null);
  const firstActionRef = useRef<TouchableOpacity>(null);
  const previousActiveElementRef = useRef<any>(null);

  // Focus management for web
  useEffect(() => {
    if (Platform.OS === "web" && visible) {
      // Store the previously focused element
      previousActiveElementRef.current = document.activeElement;

      // Focus the modal content or close button when modal opens
      setTimeout(() => {
        if (closeButtonRef.current) {
          // @ts-ignore - Web-only focus method
          closeButtonRef.current.focus?.();
        }
      }, 100);

      // Handle Escape key to close modal
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      // Trap focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const focusableElements = modalContentRef.current
          ? // @ts-ignore - Web-only querySelector
            modalContentRef.current.querySelectorAll?.(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          : [];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTabKey);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleTabKey);
        // Restore focus to previously focused element
        if (previousActiveElementRef.current) {
          // @ts-ignore - Web-only focus method
          previousActiveElementRef.current.focus?.();
        }
      };
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...(Platform.OS === "web" && {
        // Prevent aria-hidden warnings by ensuring proper focus management
        // The modal background will have aria-hidden, but we manage focus within
        accessibilityViewIsModal: true,
      })}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.md,
        }}
        {...(Platform.OS === "web" && {
          // Prevent aria-hidden warnings by ensuring this view doesn't interfere with focus
          accessible: false,
        })}
      >
        <View
          ref={modalContentRef}
          accessible={true}
          accessibilityRole="dialog"
          accessibilityLabel={title}
          style={{
            width: "100%",
            maxWidth: isMobile ? width - 32 : maxWidth,
            backgroundColor: "#474747",
            borderRadius: borderRadius.xl,
            borderWidth: 2,
            borderColor: "#5a5a68",
            maxHeight: "90%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 20,
            ...(Platform.OS === "web" && {
              // @ts-ignore - Web-only CSS properties
              outline: "none",
            }),
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.xl,
              borderBottomWidth: 2,
              borderBottomColor: "#5a5a68",
              backgroundColor: "#474747",
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
              ref={closeButtonRef}
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
              accessibilityHint="Closes this dialog"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                padding: 4,
                borderRadius: borderRadius.full,
                backgroundColor: "transparent",
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
                ...(Platform.OS === "web" && {
                  // @ts-ignore - Web-only CSS properties
                  cursor: "pointer",
                  ":focus": {
                    outline: `2px solid ${colors.accent}`,
                    outlineOffset: "2px",
                  },
                }),
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
                borderTopWidth: 2,
                borderTopColor: "#5a5a68",
                backgroundColor: "#474747",
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
                    case "primary": return colors.textColors.onAccent; // Dark text on accent background for WCAG AA compliance
                    case "danger": return "#ffffff"; // White text on error background is OK
                    default: return colors.textColors.onAccent; // Dark text on accent background
                  }
                };

                const getBorderColor = () => {
                  switch (action.variant) {
                    case "secondary": return colors.border.light;
                    case "outline": return colors.border.light;
                    default: return "transparent";
                  }
                };

                const isFirstAction = index === 0;
                return (
                  <TouchableOpacity
                    key={index}
                    ref={isFirstAction ? firstActionRef : undefined}
                    onPress={action.onPress}
                    disabled={action.disabled}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                    accessibilityState={{ disabled: action.disabled || false }}
                    accessibilityHint={action.disabled ? `${action.label} is disabled` : `Double tap to ${action.label.toLowerCase()}`}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      paddingHorizontal: spacing.xl,
                      paddingVertical: spacing.md,
                      borderRadius: borderRadius.lg,
                      backgroundColor: getBackgroundColor(),
                      borderWidth: 1,
                      borderColor: getBorderColor(),
                      opacity: action.disabled ? 0.5 : 1,
                      minHeight: 44,
                      minWidth: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      ...(Platform.OS === "web" && {
                        // @ts-ignore - Web-only CSS properties
                        cursor: action.disabled ? "not-allowed" : "pointer",
                        ":focus": {
                          outline: `2px solid ${colors.accent}`,
                          outlineOffset: "2px",
                        },
                      }),
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
