import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

interface ActionButton {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "info";
}

interface Badge {
  label: string;
  color: string;
  backgroundColor: string;
}

interface AdminDataCardProps {
  title: string;
  subtitle?: string;
  badges?: Badge[];
  actions?: ActionButton[];
  children?: React.ReactNode;
}

/**
 * AdminDataCard Component
 * Reusable card component for displaying data rows in admin pages
 * Memoized for performance optimization
 */
const AdminDataCardComponent: React.FC<AdminDataCardProps> = ({
  title,
  subtitle,
  badges = [],
  actions = [],
  children,
}) => {
  const { isMobile } = useResponsive();

  const getActionStyle = (variant: "primary" | "secondary" | "danger" | "info" = "secondary") => {
    switch (variant) {
      case "danger":
        return {
          backgroundColor: "rgba(255, 68, 68, 0.1)",
          borderColor: "#ff4444",
        };
      case "info":
        return {
          backgroundColor: "rgba(186, 153, 136, 0.1)",
          borderColor: "#ba9988",
        };
      case "primary":
        return {
          backgroundColor: "#ba9988",
          borderColor: "#ba9988",
        };
      default:
        return {
          backgroundColor: "#232323",
          borderColor: "rgba(186, 153, 136, 0.2)",
        };
    }
  };

  const getActionTextColor = (variant: "primary" | "secondary" | "danger" | "info" = "secondary") => {
    switch (variant) {
      case "danger":
        return "#ff4444";
      case "info":
        return "#ba9988";
      case "primary":
        return "#ffffff";
      default:
        return "#ba9988";
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#474747",
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: "rgba(186, 153, 136, 0.2)",
        gap: 16,
      }}
    >
      {/* Header */}
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {badges.map((badge, index) => (
            <View
              key={index}
              style={{
                backgroundColor: badge.backgroundColor,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: badge.color,
                  textTransform: "capitalize",
                }}
              >
                {badge.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Children Content */}
      {children && <View>{children}</View>}

      {/* Actions */}
      {actions.length > 0 && (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={{
                flex: isMobile ? 1 : undefined,
                minWidth: isMobile ? undefined : 100,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 6,
                ...getActionStyle(action.variant),
              }}
            >
              <MaterialIcons name={action.icon} size={18} color={getActionTextColor(action.variant)} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: getActionTextColor(action.variant),
                }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const AdminDataCard = memo(AdminDataCardComponent);

