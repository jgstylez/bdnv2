import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminDataCard } from "../AdminDataCard";
import { ContentManagementItem } from "../../types/admin";
import { colors, spacing } from "../../constants/theme";

interface ContentListProps {
  content: ContentManagementItem[];
  onEdit: (item: ContentManagementItem) => void;
  onDelete: (item: ContentManagementItem) => void;
  onPublish: (item: ContentManagementItem) => void;
  getTypeIcon: (type: string) => any;
  getStatusColor: (status: string) => string;
}

export function ContentList({
  content,
  onEdit,
  onDelete,
  onPublish,
  getTypeIcon,
  getStatusColor,
}: ContentListProps) {
  return (
    <View style={{ gap: spacing.md }}>
      {content.map((item) => {
        const statusColor = getStatusColor(item.status);
        const actions: Array<{
          label: string;
          icon: keyof typeof MaterialIcons.glyphMap;
          onPress: () => void;
          variant: "primary" | "secondary" | "danger" | "info";
        }> = [
          {
            label: "Edit",
            icon: "edit",
            onPress: () => onEdit(item),
            variant: "secondary",
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => onDelete(item),
            variant: "danger",
          },
          ...(item.status === "draft"
            ? [
                {
                  label: "Publish",
                  icon: "publish" as keyof typeof MaterialIcons.glyphMap,
                  onPress: () => onPublish(item),
                  variant: "primary" as const,
                },
              ]
            : []),
        ];

        return (
          <AdminDataCard
            key={item.id}
            title={item.title}
            subtitle={`By ${item.author}${item.views ? ` • ${item.views.toLocaleString()} views` : ""}`}
            badges={[
              {
                label: item.type,
                color: colors.accent,
                backgroundColor: colors.accentLight,
              },
              {
                label: item.status,
                color: statusColor,
                backgroundColor: `${statusColor}20`,
              },
            ]}
            actions={actions}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name={getTypeIcon(item.type)} size={20} color={colors.accent} />
              </View>
            </View>
          </AdminDataCard>
        );
      })}
    </View>
  );
}
