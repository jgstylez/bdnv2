import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, TextInput, Modal, Switch, KeyboardAvoidingView, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { FormInput } from '@/components/forms';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { BackButton } from '@/components/navigation/BackButton';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { clearAuthTokens } from '@/lib/secure-storage';
import { useLoading } from '@/hooks/useLoading';

export default function ManageAccount() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, width } = useResponsive();
  const insets = useSafeAreaInsets();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  // Change Password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Change Email
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  
  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  
  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState<"public" | "friends" | "private">("public");
  const [showEmailPublic, setShowEmailPublic] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const { loading: deletingAccount, execute: executeDeleteAccount } = useLoading();

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      Alert.alert("Error", "Please type 'DELETE' to confirm account deletion");
      return;
    }

    try {
      await executeDeleteAccount(async () => {
        const response = await api.delete('/account');
        logger.info('Account deletion requested', { response });
        return response;
      });

      if (!deletingAccount) {
        // Clear auth tokens and redirect to login
        await clearAuthTokens();
        setShowDeleteModal(false);
        setDeleteConfirmation("");
        
        Alert.alert(
          "Account Deletion",
          "Your account has been deleted successfully. All your data has been permanently removed.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/(auth)/login");
              },
            },
          ]
        );
      }
    } catch (error: any) {
      logger.error('Failed to delete account', error);
      Alert.alert(
        "Failed to Delete Account",
        error?.message || "Please try again or contact support if the problem persists."
      );
    }
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const { loading: changingPassword, execute: executeChangePassword } = useLoading();

  const handleChangePassword = async () => {
    // Validation is already handled by disabled state, but double-check
    if (!currentPassword || !newPassword || !confirmPassword) {
      showErrorToast("Missing fields", "Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords don't match", "New passwords must match");
      return;
    }
    if (newPassword.length < 8) {
      showErrorToast("Password too short", "Password must be at least 8 characters");
      return;
    }

    try {
      await executeChangePassword(async () => {
        const response = await api.post('/account/change-password', {
          currentPassword,
          newPassword,
        });
        logger.info('Password changed successfully');
        return response;
      });

      if (!changingPassword) {
        showSuccessToast("Password Changed", "Your password has been updated successfully");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      logger.error('Failed to change password', error);
      showErrorToast(
        "Failed to Change Password",
        error?.message || "Please check your current password and try again"
      );
    }
  };

  const { loading: changingEmail, execute: executeChangeEmail } = useLoading();

  const handleChangeEmail = async () => {
    if (!newEmail) {
      showErrorToast("Missing email", "Please enter a new email address");
      return;
    }
    if (!isValidEmail(newEmail)) {
      showErrorToast("Invalid email", "Please enter a valid email address");
      return;
    }
    if (!emailPassword) {
      showErrorToast("Password required", "Please enter your password to confirm email change");
      return;
    }

    try {
      await executeChangeEmail(async () => {
        const response = await api.post('/account/change-email', {
          newEmail,
          password: emailPassword, // Password confirmation for security
        });
        logger.info('Email change requested', { newEmail });
        return response;
      });

      if (!changingEmail) {
        showSuccessToast(
          "Verification Email Sent",
          "Please check your new email address to verify the change"
        );
        setShowEmailModal(false);
        setNewEmail("");
        setEmailPassword("");
      }
    } catch (error: any) {
      logger.error('Failed to change email', error);
      showErrorToast(
        "Failed to Change Email",
        error?.message || "Please check your password and try again"
      );
    }
  };

  const { loading: savingPreferences, execute: executeSavePreferences } = useLoading();
  const { loading: savingPrivacy, execute: executeSavePrivacy } = useLoading();

  const handleSavePreferences = async () => {
    try {
      await executeSavePreferences(async () => {
        const preferencesPayload = {
          emailNotifications,
          pushNotifications,
          marketingEmails,
          transactionAlerts,
        };

        const response = await api.put('/account/notification-preferences', preferencesPayload);
        logger.info('Notification preferences saved', { preferences: preferencesPayload });
        return response;
      });

      if (!savingPreferences) {
        showSuccessToast("Preferences Saved", "Your notification preferences have been saved");
      }
    } catch (error: any) {
      logger.error('Failed to save notification preferences', error);
      showErrorToast(
        "Failed to Save Preferences",
        error?.message || "Please try again"
      );
    }
  };

  const handleSavePrivacy = async () => {
    try {
      await executeSavePrivacy(async () => {
        const privacyPayload = {
          profileVisibility,
          showEmailPublic,
          dataSharing,
        };

        const response = await api.put('/account/privacy-settings', privacyPayload);
        logger.info('Privacy settings saved', { settings: privacyPayload });
        return response;
      });

      if (!savingPrivacy) {
        showSuccessToast("Privacy Settings Saved", "Your privacy settings have been saved");
      }
    } catch (error: any) {
      logger.error('Failed to save privacy settings', error);
      showErrorToast(
        "Failed to Save Privacy Settings",
        error?.message || "Please try again"
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        <BackButton 
          textColor="#ffffff"
          iconColor="#ffffff"
          onPress={() => {
            router.back();
          }}
        />

        {/* Hero Section */}
        <HeroSection
          title="Manage Account"
          subtitle="Control your account settings and preferences"
        />

        {/* Account Settings */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.weights.bold as any,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Account Settings
          </Text>

          <View style={{ gap: spacing.md }}>
            <TouchableOpacity
              onPress={() => setShowPasswordModal(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <MaterialIcons name="lock" size={24} color={colors.text.secondary} />
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.weights.semibold as any,
                      color: colors.text.primary,
                    }}
                  >
                    Change Password
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Update your account password
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEmailModal(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <MaterialIcons name="email" size={24} color={colors.text.secondary} />
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.weights.semibold as any,
                      color: colors.text.primary,
                    }}
                  >
                    Change Email
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.tertiary,
                    }}
                  >
                    Update your email address
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Preferences */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <MaterialIcons name="notifications" size={24} color={colors.text.secondary} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.weights.bold as any,
                color: colors.text.primary,
              }}
            >
              Notification Preferences
            </Text>
          </View>

          <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.weights.semibold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Email Notifications
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: colors.secondary, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.weights.semibold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Push Notifications
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  Receive push notifications on your device
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.secondary, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.weights.semibold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Marketing Emails
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  Receive promotional emails and updates
                </Text>
              </View>
              <Switch
                value={marketingEmails}
                onValueChange={setMarketingEmails}
                trackColor={{ false: colors.secondary, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.weights.semibold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Transaction Alerts
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  Get notified about account transactions
                </Text>
              </View>
              <Switch
                value={transactionAlerts}
                onValueChange={setTransactionAlerts}
                trackColor={{ false: colors.secondary, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSavePreferences}
            disabled={savingPreferences}
            style={{
              backgroundColor: savingPreferences ? colors.secondary : colors.accent,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            {savingPreferences && (
              <ActivityIndicator size="small" color={colors.text.primary} />
            )}
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.weights.bold as any,
                color: colors.text.primary,
              }}
            >
              {savingPreferences ? "Saving..." : "Save Preferences"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <MaterialIcons name="privacy-tip" size={24} color={colors.text.secondary} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.weights.bold as any,
                color: colors.text.primary,
              }}
            >
              Privacy Settings
            </Text>
          </View>

          <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.weights.semibold as any,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Profile Visibility
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                {["public", "friends", "private"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setProfileVisibility(option as "public" | "friends" | "private")}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.sm,
                      backgroundColor: profileVisibility === option ? colors.accent : colors.input,
                      borderWidth: 1,
                      borderColor: profileVisibility === option ? colors.accent : colors.border,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.weights.semibold as any,
                        color: profileVisibility === option ? colors.text.primary : colors.text.secondary,
                        textTransform: "capitalize",
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.weights.semibold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Show Email Publicly
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  Allow others to see your email address
                </Text>
              </View>
              <Switch
                value={showEmailPublic}
                onValueChange={setShowEmailPublic}
                trackColor={{ false: colors.secondary, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.weights.semibold as any,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Data Sharing
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary,
                  }}
                >
                  Allow data sharing for analytics and improvements
                </Text>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={setDataSharing}
                trackColor={{ false: colors.secondary, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSavePrivacy}
            disabled={savingPrivacy}
            style={{
              backgroundColor: savingPrivacy ? colors.secondary : colors.accent,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            {savingPrivacy && (
              <ActivityIndicator size="small" color={colors.text.primary} />
            )}
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.weights.bold as any,
                color: colors.text.primary,
              }}
            >
              {savingPrivacy ? "Saving..." : "Save Privacy Settings"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.status.errorLight,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <MaterialIcons name="warning" size={24} color={colors.status.error} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.weights.bold as any,
                color: colors.status.error,
              }}
            >
              Danger Zone
            </Text>
          </View>

          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            Once you delete your account, there is no going back. Please be certain. This action cannot be undone and all your data will be permanently deleted.
          </Text>

          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}
            style={{
              backgroundColor: colors.status.errorLight,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: colors.status.error,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.weights.bold as any,
                color: colors.status.error,
              }}
            >
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account Modal */}
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowDeleteModal(false);
            setDeleteConfirmation("");
          }}
          statusBarTranslucent
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            style={{
              flex: 1,
            }}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.md,
                paddingTop: Math.max(insets.top, spacing.md),
                paddingBottom: Math.max(insets.bottom, spacing.md),
              }}
              onPress={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation("");
              }}
            >
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: isMobile ? width - 32 : 500,
                  backgroundColor: "#474747",
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  borderColor: "#5a5a68",
                  maxHeight: isMobile ? "85%" : "90%",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.6,
                  shadowRadius: 25,
                  elevation: 25,
                  paddingBottom: spacing.lg,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    marginBottom: spacing.md,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.lg,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginRight: spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize["2xl"],
                        fontWeight: typography.weights.bold as any,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                      accessibilityRole="header"
                    >
                      Delete Account
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        lineHeight: 18,
                      }}
                    >
                      Are you sure you want to delete your account? This action cannot be undone.
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation("");
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                  >
                    <MaterialIcons name="close" size={24} color={colors.text.primary} />
                  </Pressable>
                </View>

                {/* Content */}
                <View
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingBottom: spacing.sm,
                  }}
                >
                  <View style={{ gap: spacing.lg }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        lineHeight: 18,
                      }}
                    >
                      To confirm, please type <Text style={{ fontWeight: typography.weights.bold as any, color: colors.status.error }}>DELETE</Text> in the field below:
                    </Text>
                    <FormInput
                      value={deleteConfirmation}
                      onChangeText={setDeleteConfirmation}
                      placeholder="Type DELETE here"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{
                        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                        borderColor: deleteConfirmation.toLowerCase() === "delete" ? colors.status.success : undefined,
                      }}
                    />
                  </View>
                </View>

                {/* Footer */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: spacing.sm,
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.md,
                    paddingBottom: spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(90, 90, 104, 0.5)",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation("");
                    }}
                    style={({ pressed }) => ({
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: "#232323",
                      borderWidth: 1,
                      borderColor: "#5a5a68",
                      opacity: pressed ? 0.7 : 1,
                      minHeight: 36,
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                    accessibilityLabel="Cancel account deletion"
                    accessibilityRole="button"
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: "600",
                        color: colors.text.primary,
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleDeleteAccount}
                    disabled={deleteConfirmation.toLowerCase() !== "delete" || deletingAccount}
                    style={({ pressed }) => ({
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: deleteConfirmation.toLowerCase() !== "delete" || deletingAccount
                        ? "#3a3a3a"
                        : colors.status.error,
                      opacity: deleteConfirmation.toLowerCase() !== "delete" || deletingAccount
                        ? 0.5
                        : pressed
                        ? 0.9
                        : 1,
                      minHeight: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: deleteConfirmation.toLowerCase() !== "delete" || deletingAccount
                        ? "transparent"
                        : colors.status.error,
                      flexDirection: "row",
                      gap: spacing.xs,
                    })}
                    accessibilityLabel="Delete account"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: deleteConfirmation.toLowerCase() !== "delete" || deletingAccount }}
                  >
                    {deletingAccount && (
                      <ActivityIndicator size="small" color="#ffffff" />
                    )}
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: "600",
                        color: deleteConfirmation.toLowerCase() !== "delete" || deletingAccount
                          ? colors.text.secondary
                          : "#ffffff",
                      }}
                    >
                      {deletingAccount ? "Deleting..." : "Delete Account"}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          statusBarTranslucent
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            style={{
              flex: 1,
            }}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.md,
                paddingTop: Math.max(insets.top, spacing.md),
                paddingBottom: Math.max(insets.bottom, spacing.md),
              }}
              onPress={() => {
                setShowPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: isMobile ? width - 32 : 500,
                  backgroundColor: "#474747",
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  borderColor: "#5a5a68",
                  maxHeight: isMobile ? "85%" : "90%",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.6,
                  shadowRadius: 25,
                  elevation: 25,
                  paddingBottom: spacing.lg,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    marginBottom: spacing.md,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.lg,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginRight: spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize["2xl"],
                        fontWeight: typography.weights.bold as any,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                      accessibilityRole="header"
                    >
                      Change Password
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        lineHeight: 18,
                      }}
                    >
                      Update your account password to keep your account secure
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                  >
                    <MaterialIcons name="close" size={24} color={colors.text.primary} />
                  </Pressable>
                </View>

                {/* Content */}
                <View
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingBottom: spacing.sm,
                  }}
                >
                <View style={{ gap: spacing.lg }}>
                  <View>
                    <FormInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      showPasswordToggle
                      placeholder="Re-enter your new password"
                    />
                  </View>
                </View>
              </View>

                {/* Footer */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: spacing.sm,
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.md,
                    paddingBottom: spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(90, 90, 104, 0.5)",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    style={({ pressed }) => ({
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: "#232323",
                      borderWidth: 1,
                      borderColor: "#5a5a68",
                      opacity: pressed ? 0.7 : 1,
                      minHeight: 36,
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                    accessibilityLabel="Cancel password change"
                    accessibilityRole="button"
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: "600",
                        color: colors.text.primary,
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleChangePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || changingPassword}
                    style={({ pressed }) => ({
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || changingPassword)
                        ? "#3a3a3a"
                        : colors.accent,
                      opacity: (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || changingPassword)
                        ? 0.5
                        : pressed
                        ? 0.9
                        : 1,
                      minHeight: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || changingPassword)
                        ? "transparent"
                        : colors.accent,
                      flexDirection: "row",
                      gap: spacing.xs,
                    })}
                    accessibilityLabel="Change password"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || changingPassword }}
                  >
                    {changingPassword && (
                      <ActivityIndicator size="small" color="#ffffff" />
                    )}
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: "600",
                        color: (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || changingPassword)
                          ? colors.text.secondary
                          : "#ffffff",
                      }}
                    >
                      {changingPassword ? "Changing..." : "Change Password"}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* Change Email Modal */}
        <Modal
          visible={showEmailModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowEmailModal(false);
            setNewEmail("");
            setEmailPassword("");
          }}
          statusBarTranslucent
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            style={{
              flex: 1,
            }}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.md,
                paddingTop: Math.max(insets.top, spacing.md),
                paddingBottom: Math.max(insets.bottom, spacing.md),
              }}
              onPress={() => {
                setShowEmailModal(false);
                setNewEmail("");
                setEmailPassword("");
              }}
            >
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: isMobile ? width - 32 : 500,
                  backgroundColor: "#474747",
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  borderColor: "#5a5a68",
                  maxHeight: isMobile ? "85%" : "90%",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.6,
                  shadowRadius: 25,
                  elevation: 25,
                  paddingBottom: spacing.lg,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    marginBottom: spacing.md,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.lg,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginRight: spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize["2xl"],
                        fontWeight: typography.weights.bold as any,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                      accessibilityRole="header"
                    >
                      Change Email Address
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        lineHeight: 18,
                      }}
                    >
                      Update your email address to keep your account secure
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setShowEmailModal(false);
                      setNewEmail("");
                      setEmailPassword("");
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(71, 71, 71, 0.6)",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                  >
                    <MaterialIcons name="close" size={24} color={colors.text.primary} />
                  </Pressable>
                </View>

                {/* Content */}
                <View
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingBottom: spacing.md,
                  }}
                >
                  <View style={{ gap: spacing.md }}>
                    <View>
                      <FormInput
                        label="New Email Address"
                        value={newEmail}
                        onChangeText={setNewEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Enter new email address"
                      />
                      {newEmail && newEmail.length > 0 && !isValidEmail(newEmail) && (
                        <View
                          style={{
                            backgroundColor: "rgba(231, 38, 38, 0.2)",
                            borderRadius: borderRadius.md,
                            padding: spacing.sm,
                            paddingHorizontal: spacing.md,
                            marginTop: spacing.xs,
                            borderWidth: 1,
                            borderColor: colors.status.error,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                          accessibilityRole="alert"
                        >
                          <MaterialIcons 
                            name="error-outline" 
                            size={16} 
                            color={colors.status.error} 
                            style={{ marginRight: spacing.xs }}
                          />
                          <Text
                            style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: "500",
                              color: colors.status.error,
                              flex: 1,
                              lineHeight: 16,
                            }}
                          >
                            Please enter a valid email address
                          </Text>
                        </View>
                      )}
                      {newEmail && newEmail.length > 0 && isValidEmail(newEmail) && (
                        <View
                          style={{
                            backgroundColor: "rgba(75, 184, 88, 0.2)",
                            borderRadius: borderRadius.md,
                            padding: spacing.sm,
                            paddingHorizontal: spacing.md,
                            marginTop: spacing.xs,
                            borderWidth: 1,
                            borderColor: colors.status.success,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                          accessibilityRole="text"
                        >
                          <MaterialIcons 
                            name="check-circle" 
                            size={16} 
                            color={colors.status.success} 
                            style={{ marginRight: spacing.xs }}
                          />
                          <Text
                            style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: "500",
                              color: colors.status.success,
                              flex: 1,
                              lineHeight: 16,
                            }}
                          >
                            Valid email address
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Footer */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: spacing.md,
                    paddingHorizontal: spacing.lg,
                    paddingTop: spacing.md,
                    paddingBottom: spacing.lg,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(90, 90, 104, 0.5)",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setShowEmailModal(false);
                      setNewEmail("");
                      setEmailPassword("");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.md,
                      borderRadius: borderRadius.md,
                      backgroundColor: "#232323",
                      borderWidth: 1,
                      borderColor: "#5a5a68",
                      opacity: pressed ? 0.7 : 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                    accessibilityLabel="Cancel email change"
                    accessibilityRole="button"
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: "600",
                        color: colors.text.primary,
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleChangeEmail}
                    disabled={!newEmail || !isValidEmail(newEmail) || !emailPassword || changingEmail}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.md,
                      borderRadius: borderRadius.md,
                      backgroundColor: (!newEmail || !isValidEmail(newEmail) || !emailPassword || changingEmail)
                        ? "#3a3a3a"
                        : colors.accent,
                      opacity: (!newEmail || !isValidEmail(newEmail) || !emailPassword || changingEmail)
                        ? 0.5
                        : pressed
                        ? 0.9
                        : 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: (!newEmail || !isValidEmail(newEmail) || !emailPassword || changingEmail)
                        ? "transparent"
                        : colors.accent,
                      flexDirection: "row",
                      gap: spacing.xs,
                    })}
                    accessibilityLabel="Change email address"
                    accessibilityRole="button"
                    accessibilityState={{ 
                      disabled: !newEmail || !isValidEmail(newEmail) || !emailPassword || changingEmail
                    }}
                  >
                    {changingEmail && (
                      <ActivityIndicator size="small" color="#ffffff" />
                    )}
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: "600",
                        color: (!newEmail || !isValidEmail(newEmail) || !emailPassword || changingEmail)
                          ? colors.text.secondary
                          : "#ffffff",
                      }}
                    >
                      {changingEmail ? "Changing..." : "Change Email"}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </View>
  );
}

