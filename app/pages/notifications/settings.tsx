import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Switch, Platform, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { NotificationPreferences, NotificationChannel } from '@/types/notifications';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useLoading } from '@/hooks/useLoading';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

const channelLabels: Record<NotificationChannel, string> = {
  wallet: "Wallet",
  promotions: "Promotions",
  events: "Events",
  system: "System",
  social: "Social",
  merchant: "Merchant",
};

const channelDescriptions: Record<NotificationChannel, string> = {
  wallet: "Transaction updates, payment alerts",
  promotions: "Deals, discounts, special offers",
  events: "Community events, webinars, meetups",
  system: "Account updates, security alerts",
  social: "Friend activity, comments, mentions",
  merchant: "Business updates, order status",
};

// Mock preferences
const mockPreferences: NotificationPreferences = {
  userId: "user1",
  channels: {
    wallet: { enabled: true, push: true, email: true, inApp: true },
    promotions: { enabled: true, push: false, email: true, inApp: true },
    events: { enabled: true, push: true, email: false, inApp: true },
    system: { enabled: true, push: true, email: true, inApp: true },
    social: { enabled: false, push: false, email: false, inApp: false },
    merchant: { enabled: true, push: false, email: true, inApp: true },
  },
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00",
    timezone: "America/New_York",
  },
  digest: {
    enabled: true,
    frequency: "daily",
    time: "09:00",
  },
};

export default function NotificationSettings() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [preferences, setPreferences] = useState<NotificationPreferences>(mockPreferences);
  const { loading: savingPreferences, execute: executeSavePreferences } = useLoading();

  const updateChannelPreference = (
    channel: NotificationChannel,
    field: "enabled" | "push" | "email" | "inApp",
    value: boolean
  ) => {
    setPreferences({
      ...preferences,
      channels: {
        ...preferences.channels,
        [channel]: {
          ...preferences.channels[channel],
          [field]: value,
        },
      },
    });
  };

  const updateQuietHours = (enabled: boolean) => {
    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours!,
        enabled,
      },
    });
  };

  const updateDigest = (enabled: boolean) => {
    setPreferences({
      ...preferences,
      digest: {
        ...preferences.digest!,
        enabled,
      },
    });
  };

  const handleSavePreferences = async () => {
    try {
      await executeSavePreferences(async () => {
        const response = await api.put('/account/notification-preferences', preferences);
        logger.info('Notification preferences saved', { preferences });
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

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Channel Preferences */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Notification Channels
          </Text>
          <View style={{ gap: 12 }}>
            {(Object.keys(preferences.channels) as NotificationChannel[]).map((channel) => {
              const channelPref = preferences.channels[channel];
              return (
                <View
                  key={channel}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {channelLabels[channel]}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {channelDescriptions[channel]}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      {channelPref.enabled && (
                        <View
                          style={{
                            backgroundColor: "rgba(186, 153, 136, 0.15)",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "600",
                              color: "#ba9988",
                              textTransform: "uppercase",
                            }}
                          >
                            Enabled
                          </Text>
                        </View>
                      )}
                      <Switch
                        value={channelPref.enabled}
                        onValueChange={(value) => updateChannelPreference(channel, "enabled", value)}
                        trackColor={{ false: "#474747", true: "#ba9988" }}
                        thumbColor="#ffffff"
                      />
                    </View>
                  </View>
                  {channelPref.enabled && (
                    <View style={{ marginTop: 12, gap: 8, paddingLeft: 4 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Push Notifications</Text>
                        <Switch
                          value={channelPref.push}
                          onValueChange={(value) => updateChannelPreference(channel, "push", value)}
                          trackColor={{ false: "#474747", true: "#ba9988" }}
                          thumbColor="#ffffff"
                        />
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Email</Text>
                        <Switch
                          value={channelPref.email}
                          onValueChange={(value) => updateChannelPreference(channel, "email", value)}
                          trackColor={{ false: "#474747", true: "#ba9988" }}
                          thumbColor="#ffffff"
                        />
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>In-App</Text>
                        <Switch
                          value={channelPref.inApp}
                          onValueChange={(value) => updateChannelPreference(channel, "inApp", value)}
                          trackColor={{ false: "#474747", true: "#ba9988" }}
                          thumbColor="#ffffff"
                        />
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quiet Hours
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  Enable Quiet Hours
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Pause notifications during specified hours
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {preferences.quietHours?.enabled && (
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        color: "#ba9988",
                        textTransform: "uppercase",
                      }}
                    >
                      Enabled
                    </Text>
                  </View>
                )}
                <Switch
                  value={preferences.quietHours?.enabled || false}
                  onValueChange={updateQuietHours}
                  trackColor={{ false: "#474747", true: "#ba9988" }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
            {preferences.quietHours?.enabled && (
              <View style={{ marginTop: 12, gap: 8 }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  {preferences.quietHours.start} - {preferences.quietHours.end} ({preferences.quietHours.timezone})
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Digest */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Email Digest
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  Daily Digest
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Receive a summary of notifications
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {preferences.digest?.enabled && (
                  <View
                    style={{
                      backgroundColor: "rgba(186, 153, 136, 0.15)",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        color: "#ba9988",
                        textTransform: "uppercase",
                      }}
                    >
                      Enabled
                    </Text>
                  </View>
                )}
                <Switch
                  value={preferences.digest?.enabled || false}
                  onValueChange={updateDigest}
                  trackColor={{ false: "#474747", true: "#ba9988" }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
            {preferences.digest?.enabled && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  {preferences.digest.frequency === "daily" ? "Daily" : "Weekly"} at {preferences.digest.time}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Save Button */}
        <View style={{ marginTop: 32, marginBottom: 40 }}>
          <TouchableOpacity
            onPress={handleSavePreferences}
            disabled={savingPreferences}
            style={{
              backgroundColor: savingPreferences ? "#474747" : "#ba9988",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            {savingPreferences && (
              <ActivityIndicator size="small" color="#ffffff" />
            )}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              {savingPreferences ? "Saving..." : "Save Preferences"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

