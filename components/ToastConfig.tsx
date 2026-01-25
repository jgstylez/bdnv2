import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { colors, spacing, borderRadius, typography } from '../constants/theme';

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
          <MaterialIcons name="check-circle" size={24} color="#ffffff" />
        </View>
        <View style={styles.content}>
          {text1 && (
            <Text style={styles.successText1} numberOfLines={1}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={styles.successText2} numberOfLines={2}>
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
    width: '100%',
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
    ...(Platform.OS === "web" ? {
      // @ts-ignore - Web-only CSS properties
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 12,
    }),
    width: '100%',
  },
  successToast: {
    backgroundColor: colors.status.success, // Vibrant green background (#4bb858)
    borderLeftWidth: 4,
    borderLeftColor: '#6fcf7a', // Lighter green accent border
    borderWidth: 0, // Remove default border for success toast
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white for icon background
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
  successText1: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff', // White text for visibility on green background
    marginBottom: spacing.xs / 2,
  },
  successText2: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    color: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white for subtitle
    lineHeight: typography.lineHeight.normal,
  },
});

