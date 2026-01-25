import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../constants/theme";

export interface FieldError {
  field: string;
  message: string;
}

interface FormValidationFeedbackProps {
  errors?: FieldError[] | Record<string, string> | string | null;
  touched?: Record<string, boolean>;
  showFieldErrors?: boolean;
  className?: string;
}

/**
 * Displays form validation errors in a consistent way
 * Supports multiple error formats:
 * - Array of FieldError objects
 * - Object with field names as keys
 * - Single string error message
 */
export function FormValidationFeedback({
  errors,
  touched,
  showFieldErrors = true,
}: FormValidationFeedbackProps) {
  if (!errors) return null;

  // Convert errors to a consistent format
  let errorList: FieldError[] = [];

  if (typeof errors === "string") {
    // Single error message
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: spacing.sm,
          backgroundColor: colors.status.error + "15",
          borderRadius: 8,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.status.error + "30",
          marginBottom: spacing.md,
        }}
      >
        <MaterialIcons name="error-outline" size={20} color={colors.status.error} style={{ marginTop: 2 }} />
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.textColors.error,
            flex: 1,
          }}
        >
          {errors}
        </Text>
      </View>
    );
  }

  if (Array.isArray(errors)) {
    errorList = errors;
  } else if (typeof errors === "object") {
    // Convert object to array
    errorList = Object.entries(errors).map(([field, message]) => ({
      field,
      message: typeof message === "string" ? message : String(message),
    }));
  }

  // Filter to only show errors for touched fields if touched is provided
  const visibleErrors = touched
    ? errorList.filter((error) => touched[error.field])
    : errorList;

  if (visibleErrors.length === 0) return null;

  // Show summary if multiple errors
  if (visibleErrors.length > 1 && !showFieldErrors) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: spacing.sm,
          backgroundColor: colors.status.error + "15",
          borderRadius: 8,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.status.error + "30",
          marginBottom: spacing.md,
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
            Please fix the following errors:
          </Text>
          {visibleErrors.map((error, index) => (
            <Text
              key={index}
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.textColors.error,
                marginBottom: index < visibleErrors.length - 1 ? spacing.xs : 0,
              }}
            >
              • {error.message}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  // Show individual field errors
  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
      {visibleErrors.map((error, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: spacing.sm,
            backgroundColor: colors.status.error + "15",
            borderRadius: 8,
            padding: spacing.sm,
            borderWidth: 1,
            borderColor: colors.status.error + "30",
          }}
        >
          <MaterialIcons name="error-outline" size={16} color={colors.status.error} style={{ marginTop: 2 }} />
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.textColors.error,
              flex: 1,
            }}
          >
            {error.message}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Helper function to get error message for a specific field
 */
export function getFieldError(
  errors: FieldError[] | Record<string, string> | string | null | undefined,
  fieldName: string
): string | undefined {
  if (!errors) return undefined;

  if (typeof errors === "string") {
    return fieldName === "general" ? errors : undefined;
  }

  if (Array.isArray(errors)) {
    const error = errors.find((e) => e.field === fieldName);
    return error?.message;
  }

  if (typeof errors === "object") {
    return errors[fieldName];
  }

  return undefined;
}
