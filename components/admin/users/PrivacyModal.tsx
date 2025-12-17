import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AdminModal } from "../AdminModal";
import { spacing, typography } from "../../constants/theme";

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (user: any, setting: string, value: boolean) => void;
}

export function PrivacyModal({
  visible,
  onClose,
  user,
  onUpdate,
}: PrivacyModalProps) {
  if (!user) return null;

  return (
    <AdminModal
      visible={visible}
      onClose={onClose}
      title="Privacy Settings"
      maxWidth={500}
      actions={[
        {
          label: "Close",
          onPress: onClose,
          variant: "primary",
        },
      ]}
    >
      <Text
        style={{
          fontSize: typography.fontSize.base,
          color: "#ffffff",
          marginBottom: spacing.lg,
        }}
      >
        {user.name}
      </Text>

      {user.privacySettings && (
        <View style={{ gap: spacing.lg }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                Profile Visible
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                Allow others to see profile information
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (user.privacySettings) {
                  onUpdate(user, "profileVisible", !user.privacySettings.profileVisible);
                }
              }}
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: user.privacySettings.profileVisible ? "#4caf50" : "#474747",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#ffffff",
                  transform: [{ translateX: user.privacySettings.profileVisible ? 20 : 0 }],
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                Email Visible
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                Allow others to see email address
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (user.privacySettings) {
                  onUpdate(user, "emailVisible", !user.privacySettings.emailVisible);
                }
              }}
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: user.privacySettings.emailVisible ? "#4caf50" : "#474747",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#ffffff",
                  transform: [{ translateX: user.privacySettings.emailVisible ? 20 : 0 }],
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                Analytics Opt-In
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                Allow data collection for analytics
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (user.privacySettings) {
                  onUpdate(user, "analyticsOptIn", !user.privacySettings.analyticsOptIn);
                }
              }}
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: user.privacySettings.analyticsOptIn ? "#4caf50" : "#474747",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#ffffff",
                  transform: [{ translateX: user.privacySettings.analyticsOptIn ? 20 : 0 }],
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AdminModal>
  );
}
