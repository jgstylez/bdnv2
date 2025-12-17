import React from "react";
import { Text } from "react-native";
import { BaseModal, ModalAction } from "./BaseModal";
import { colors, typography } from "../../constants/theme";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
}: ConfirmModalProps) {
  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      onPress: onClose,
      variant: "secondary",
    },
    {
      label: confirmLabel,
      onPress: onConfirm,
      variant: variant,
    },
  ];

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={title}
      actions={actions}
      maxWidth={400}
    >
      <Text
        style={{
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          lineHeight: 24,
        }}
      >
        {message}
      </Text>
    </BaseModal>
  );
}
