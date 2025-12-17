import React from "react";
import { Text } from "react-native";
import { ConfirmModal } from "../../modals/ConfirmModal";
import { colors, typography } from '../../../constants/theme';

interface DeleteProductModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export function DeleteProductModal({
  visible,
  onClose,
  onConfirm,
  productName,
}: DeleteProductModalProps) {
  return (
    <ConfirmModal
      visible={visible}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Product"
      message={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
      confirmLabel="Delete"
      variant="danger"
    />
  );
}
