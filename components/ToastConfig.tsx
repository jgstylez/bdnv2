import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { colors, spacing, borderRadius, typography } from "../constants/theme";

/**
 * Custom Toast Configuration
 * Uses BDN theme colors and styling
 */
export const toastConfig = {
  success: ({ text1, text2, onPress }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={[styles.toast, styles.successToast]}>
        <View style={[styles.iconContainer, styles.successIcon]}>
          <MaterialIcons name="check-circle" size={24} color={colors.status.success} />
        </View>
        <View style={styles.content}>
          {text1 && (
            <Text style={styles.text1} numberOfLines={1}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={styles.text2} numberOfLines={2}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ),

  error: ({ text1, text2, onPress }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={[styles.toast, styles.errorToast]}>
        <View style={[styles.iconContainer, styles.errorIcon]}>
          <MaterialIcons name="error" size={24} color={colors.status.error} />
        </View>
        <View style={styles.content}>
          {text1 && (
            <Text style={styles.text1} numberOfLines={1}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={styles.text2} numberOfLines={2}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ),

  info: ({ text1, text2, onPress }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={[styles.toast, styles.infoToast]}>
        <View style={[styles.iconContainer, styles.infoIcon]}>
          <MaterialIcons name="info" size={24} color={colors.status.info} />
        </View>
        <View style={styles.content}>
          {text1 && (
            <Text style={styles.text1} numberOfLines={1}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={styles.text2} numberOfLines={2}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ),

  warning: ({ text1, text2, onPress }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={[styles.toast, styles.warningToast]}>
        <View style={[styles.iconContainer, styles.warningIcon]}>
          <MaterialIcons name="warning" size={24} color={colors.status.warning} />
        </View>
        <View style={styles.content}>
          {text1 && (
            <Text style={styles.text1} numberOfLines={1}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={styles.text2} numberOfLines={2}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ),
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.success,
  },
  errorToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.error,
  },
  infoToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.info,
  },
  warningToast: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.warning,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  successIcon: {
    backgroundColor: colors.status.successLight,
  },
  errorIcon: {
    backgroundColor: colors.status.errorLight,
  },
  infoIcon: {
    backgroundColor: colors.status.infoLight,
  },
  warningIcon: {
    backgroundColor: colors.status.warningLight,
  },
  content: {
    flex: 1,
  },
  text1: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  text2: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  },
});

