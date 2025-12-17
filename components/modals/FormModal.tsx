import React from "react";
import { BaseModal, ModalAction } from "./BaseModal";

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  maxWidth?: number;
}

export function FormModal({
  visible,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitDisabled = false,
  maxWidth = 600,
}: FormModalProps) {
  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      onPress: onClose,
      variant: "secondary",
    },
    {
      label: submitLabel,
      onPress: onSubmit,
      variant: "primary",
      disabled: submitDisabled,
    },
  ];

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={title}
      actions={actions}
      maxWidth={maxWidth}
    >
      {children}
    </BaseModal>
  );
}
