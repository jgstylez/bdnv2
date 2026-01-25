import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius } from "../constants/theme";

export type ErrorDisplayVariant = "inline" | "card" | "fullscreen";

interface ErrorDisplayProps {
  error: string | Error | null | undefined;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: ErrorDisplayVariant;
  showDetails?: boolean; // Only in development
}

export function ErrorDisplay({
  error,
  title,
  onRetry,
  onDismiss,
  variant = "card",
  showDetails = __DEV__,
}: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.message || "An unexpected error occurred";
  const errorTitle = title || "Something went wrong";

  if (variant === "fullscreen") {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          padding: spacing.xl,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.status.error + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.lg,
          }}
        >
          <MaterialIcons name="error-outline" size={48} color={colors.status.error} />
        </View>
        <Text
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold as any,
            color: colors.text.primary,
            marginBottom: spacing.sm,
            textAlign: "center",
          }}
        >
          {errorTitle}
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            textAlign: "center",
            marginBottom: spacing.lg,
            maxWidth: 400,
          }}
        >
          {errorMessage}
        </Text>
        {showDetails && typeof error !== "string" && error.stack && (
          <View
            style={{
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              width: "100%",
              maxWidth: 600,
              marginBottom: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.textColors.error,
                fontFamily: "monospace",
              }}
            >
              {error.stack}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.textColors.onAccent,
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          )}
          {onDismiss && (
            <TouchableOpacity
              onPress={onDismiss}
              style={{
                backgroundColor: colors.secondary,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold as any,
                  color: colors.text.primary,
                }}
              >
                Dismiss
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (variant === "inline") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: spacing.sm,
          backgroundColor: colors.status.error + "15",
          borderRadius: borderRadius.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.status.error + "30",
        }}
      >
        <MaterialIcons name="error-outline" size={20} color={colors.status.error} style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold as any,
              color: colors.status.error,
              marginBottom: spacing.xs,
            }}
          >
            {errorTitle}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.textColors.error,
            }}
          >
            {errorMessage}
          </Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={{ marginTop: spacing.sm }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.accent,
                  fontWeight: typography.fontWeight.semibold as any,
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <MaterialIcons name="close" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Card variant (default)
  return (
    <View
      style={{
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.status.error + "30",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: spacing.md,
          marginBottom: spacing.md,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.status.error + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="error-outline" size={24} color={colors.status.error} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as any,
              color: colors.text.primary,
              marginBottom: spacing.xs,
            }}
          >
            {errorTitle}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
            }}
          >
            {errorMessage}
          </Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <MaterialIcons name="close" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
      {showDetails && typeof error !== "string" && error.stack && (
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginTop: spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.textColors.error,
              fontFamily: "monospace",
            }}
          >
            {error.stack}
          </Text>
        </View>
      )}
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.md,
            alignItems: "center",
            marginTop: spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold as any,
              color: colors.textColors.onAccent,
            }}
          >
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
