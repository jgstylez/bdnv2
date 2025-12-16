import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, TextInput, Modal, Switch } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../../constants/theme";
import { HeroSection } from "../../../components/layouts/HeroSection";
import { FormInput } from "../../../components/forms";

export default function ManageAccount() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
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

  const handleDeleteAccount = () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      Alert.alert("Error", "Please type 'DELETE' to confirm account deletion");
      return;
    }

    // TODO: Implement account deletion
    Alert.alert("Account Deletion", "Your account deletion request has been submitted. You will receive a confirmation email shortly.", [
      {
        text: "OK",
        onPress: () => {
          setShowDeleteModal(false);
          setDeleteConfirmation("");
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }
    // TODO: Implement password change
    Alert.alert("Success", "Your password has been changed successfully");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangeEmail = () => {
    if (!newEmail || !emailPassword) {
      Alert.alert("Error", "Please fill in email and password");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    // TODO: Implement email change
    Alert.alert("Success", "A verification email has been sent to your new email address");
    setShowEmailModal(false);
    setNewEmail("");
    setEmailPassword("");
  };

  const handleSavePreferences = () => {
    // TODO: Save notification preferences
    Alert.alert("Success", "Your preferences have been saved");
  };

  const handleSavePrivacy = () => {
    // TODO: Save privacy settings
    Alert.alert("Success", "Your privacy settings have been saved");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.lg,
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
              marginLeft: spacing.sm,
            }}
          >
            Back to Account
          </Text>
        </TouchableOpacity>

        {/* Hero Section */}
        <HeroSection
          title="Manage Account"
          subtitle="Control your account settings and preferences"
        />

        {/* Account Settings */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
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
                borderBottomColor: colors.border.light,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <MaterialIcons name="lock" size={24} color={colors.text.secondary} />
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
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
                borderBottomColor: colors.border.light,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <MaterialIcons name="email" size={24} color={colors.text.secondary} />
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
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
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <MaterialIcons name="notifications" size={24} color={colors.text.secondary} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
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
                    fontWeight: typography.fontWeight.semibold,
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
                trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
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
                trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
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
                trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
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
                trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSavePreferences}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Save Preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <MaterialIcons name="privacy-tip" size={24} color={colors.text.secondary} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
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
                  fontWeight: typography.fontWeight.semibold,
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
                    onPress={() => setProfileVisibility(option)}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.sm,
                      backgroundColor: profileVisibility === option ? colors.accent : colors.background.input,
                      borderWidth: 1,
                      borderColor: profileVisibility === option ? colors.accent : colors.border.light,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
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
                    fontWeight: typography.fontWeight.semibold,
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
                trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
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
                trackColor={{ false: colors.secondary.bg, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSavePrivacy}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Save Privacy Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
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
                fontWeight: typography.fontWeight.bold,
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
                fontWeight: typography.fontWeight.bold,
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
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              padding: spacing.xl,
            }}
          >
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                width: "100%",
                maxWidth: 500,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Delete Account
              </Text>

              <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.primary,
                    lineHeight: typography.lineHeight.relaxed,
                  }}
                >
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.secondary,
                    marginTop: spacing.sm,
                    lineHeight: typography.lineHeight.relaxed,
                  }}
                >
                  To confirm, please type <Text style={{ fontWeight: typography.fontWeight.bold, color: colors.status.error }}>DELETE</Text> in the field below:
                </Text>
                <TextInput
                  value={deleteConfirmation}
                  onChangeText={setDeleteConfirmation}
                  placeholder="Type DELETE here"
                  placeholderTextColor={colors.text.placeholder}
                  style={{
                    backgroundColor: colors.background.input,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: deleteConfirmation.toLowerCase() === "delete" ? colors.status.success : colors.border.light,
                    fontSize: typography.fontSize.base,
                    color: colors.text.primary,
                    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                    marginTop: spacing.sm,
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.secondary.bg,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.status.errorLight,
                    borderWidth: 1,
                    borderColor: colors.status.error,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.status.error,
                    }}
                  >
                    Delete Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              padding: spacing.xl,
            }}
          >
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                width: "100%",
                maxWidth: 500,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.lg,
                }}
              >
                Change Password
              </Text>

              <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                <FormInput
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  required
                />
                <FormInput
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password (min 8 characters)"
                  required
                />
                <FormInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  required
                />
              </View>

              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.secondary.bg,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleChangePassword}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.accent,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Change Password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              padding: spacing.xl,
            }}
          >
            <View
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                padding: spacing.xl,
                width: "100%",
                maxWidth: 500,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.lg,
                }}
              >
                Change Email Address
              </Text>

              <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
                <FormInput
                  label="New Email Address"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter new email address"
                  required
                />
                <FormInput
                  label="Confirm Password"
                  value={emailPassword}
                  onChangeText={setEmailPassword}
                  secureTextEntry
                  placeholder="Enter your password to confirm"
                  required
                  helperText="You must enter your current password to change your email"
                />
              </View>

              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowEmailModal(false);
                    setNewEmail("");
                    setEmailPassword("");
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.secondary.bg,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleChangeEmail}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.accent,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Change Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

