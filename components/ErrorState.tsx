import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius } from "../constants/theme";
import { ErrorDisplay } from "./ErrorDisplay";

interface ErrorStateProps {
  error: string | Error | null | undefined;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  retryLabel?: string;
  backLabel?: string;
}

/**
 * Full-page error state component for when entire pages fail to load
 * Use this instead of ErrorDisplay when the entire page content failed
 */
export function ErrorState({
  error,
  title = "Something went wrong",
  description,
  onRetry,
  onGoBack,
  retryLabel = "Try Again",
  backLabel = "Go Back",
}: ErrorStateProps) {
  if (!error) return null;

  const errorMessage = typeof error === "string" ? error : error.message || "An unexpected error occurred";

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
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.status.error + "20",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.xl,
        }}
      >
        <MaterialIcons name="error-outline" size={56} color={colors.status.error} />
      </View>

      <Text
        style={{
          fontSize: typography.fontSize["2xl"],
          fontWeight: typography.fontWeight.bold as any,
          color: colors.text.primary,
          marginBottom: spacing.md,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: typography.fontSize.base,
          color: colors.text.secondary,
          textAlign: "center",
          marginBottom: spacing.lg,
          maxWidth: 500,
        }}
      >
        {description || errorMessage}
      </Text>

      <View style={{ flexDirection: "row", gap: spacing.md, width: "100%", maxWidth: 400 }}>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            style={{
              flex: 1,
              backgroundColor: colors.accent,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: borderRadius.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold as any,
                color: colors.textColors.onAccent,
              }}
            >
              {retryLabel}
            </Text>
          </TouchableOpacity>
        )}

        {onGoBack && (
          <TouchableOpacity
            onPress={onGoBack}
            style={{
              flex: 1,
              backgroundColor: colors.secondary,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: borderRadius.md,
              alignItems: "center",
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
              {backLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
