import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminDataCard } from "../AdminDataCard";
import { MerchantType } from "../../types/merchant";
import { colors, spacing } from "../../constants/theme";

export interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneCountryCode?: any;
  merchantType: MerchantType;
  merchantLevel: "basic" | "premier" | "platinum";
  status: "pending" | "approved" | "rejected" | "suspended";
  submittedDate: string;
  category: string;
  description?: string;
  address?: any;
  currency?: any;
  taxIdentification?: any;
  website?: string;
}

interface BusinessListProps {
  businesses: Business[];
  onEdit: (business: Business) => void;
  onApprove: (business: Business) => void;
  onReject: (business: Business) => void;
  onSuspend: (business: Business) => void;
  onDelete: (business: Business) => void;
  getStatusColor: (status: string) => string;
}

export function BusinessList({
  businesses,
  onEdit,
  onApprove,
  onReject,
  onSuspend,
  onDelete,
  getStatusColor,
}: BusinessListProps) {
  return (
    <View style={{ gap: spacing.md }}>
      {businesses.map((business) => {
        const statusColor = getStatusColor(business.status);
        const actions: Array<{
          label: string;
          icon: keyof typeof MaterialIcons.glyphMap;
          onPress: () => void;
          variant: "primary" | "secondary" | "danger" | "info";
        }> = [
          {
            label: "Edit",
            icon: "edit",
            onPress: () => onEdit(business),
            variant: "secondary",
          },
          ...(business.status === "pending"
            ? [
                {
                  label: "Approve",
                  icon: "check" as keyof typeof MaterialIcons.glyphMap,
                  onPress: () => onApprove(business),
                  variant: "primary" as const,
                },
                {
                  label: "Reject",
                  icon: "close" as keyof typeof MaterialIcons.glyphMap,
                  onPress: () => onReject(business),
                  variant: "danger" as const,
                },
              ]
            : [
                {
                  label: business.status === "suspended" ? "Activate" : "Suspend",
                  icon: (business.status === "suspended" ? "check-circle" : "block") as keyof typeof MaterialIcons.glyphMap,
                  onPress: () => onSuspend(business),
                  variant: (business.status === "suspended" ? "primary" : "danger") as "primary" | "danger",
                },
              ]),
          {
            label: "Delete",
            icon: "delete",
            onPress: () => onDelete(business),
            variant: "danger",
          },
        ];

        return (
          <AdminDataCard
            key={business.id}
            title={business.name}
            subtitle={`${business.email}${business.phone ? ` • ${business.phone}` : ""}`}
            badges={[
              {
                label: business.category,
                color: colors.accent,
                backgroundColor: colors.accentLight,
              },
              {
                label: business.merchantLevel,
                color: colors.accent,
                backgroundColor: colors.accentLight,
              },
              {
                label: business.status,
                color: statusColor,
                backgroundColor: `${statusColor}20`,
              },
            ]}
            actions={actions}
          />
        );
      })}
    </View>
  );
}
