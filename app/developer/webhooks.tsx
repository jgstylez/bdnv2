import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  createdAt: string;
  lastTriggered: string;
  secret: string;
}

const mockWebhooks: Webhook[] = [
  {
    id: "1",
    name: "Payment Notifications",
    url: "https://api.example.com/webhooks/payments",
    events: ["payment.completed", "payment.failed"],
    status: "active",
    createdAt: "2024-01-15",
    lastTriggered: "2024-12-19 14:30:00",
    secret: "whsec_1234567890abcdef",
  },
  {
    id: "2",
    name: "Transaction Updates",
    url: "https://api.example.com/webhooks/transactions",
    events: ["transaction.created", "transaction.updated"],
    status: "active",
    createdAt: "2024-02-01",
    lastTriggered: "2024-12-19 12:15:00",
    secret: "whsec_abcdef1234567890",
  },
  {
    id: "3",
    name: "User Events",
    url: "https://api.example.com/webhooks/users",
    events: ["user.created", "user.updated"],
    status: "inactive",
    createdAt: "2024-03-10",
    lastTriggered: "Never",
    secret: "whsec_9876543210fedcba",
  },
];

const availableEvents = [
  "payment.completed",
  "payment.failed",
  "transaction.created",
  "transaction.updated",
  "user.created",
  "user.updated",
  "business.created",
  "business.updated",
];

export default function Webhooks() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);

  const handleCreateWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (selectedEvents.length === 0) {
      Alert.alert("Error", "Please select at least one event");
      return;
    }

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: selectedEvents,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastTriggered: "Never",
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
    };

    setWebhooks([newWebhook, ...webhooks]);
    setNewWebhookName("");
    setNewWebhookUrl("");
    setSelectedEvents([]);
    setShowCreateForm(false);
    Alert.alert("Success", "Webhook created successfully");
  };

  const handleToggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(webhooks.map((wh) => (wh.id === id ? { ...wh, status: wh.status === "active" ? "inactive" : "active" } : wh)));
  };

  const handleDeleteWebhook = (id: string) => {
    Alert.alert("Delete Webhook", "Are you sure you want to delete this webhook?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setWebhooks(webhooks.filter((wh) => wh.id !== id));
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? spacing.mobile : spacing.desktop,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: spacing["2xl"] }}>
          <TouchableOpacity
            onPress={() => setShowCreateForm(!showCreateForm)}
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: colors.accent,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="add" size={20} color={colors.text.primary} />
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Create Webhook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Create Form */}
        {showCreateForm && (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              marginBottom: spacing["2xl"],
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Create New Webhook
            </Text>
            <TextInput
              placeholder="Webhook Name"
              placeholderTextColor={colors.text.placeholder}
              value={newWebhookName}
              onChangeText={setNewWebhookName}
              style={{
                backgroundColor: colors.background.primary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            />
            <TextInput
              placeholder="Webhook URL (https://...)"
              placeholderTextColor={colors.text.placeholder}
              value={newWebhookUrl}
              onChangeText={setNewWebhookUrl}
              style={{
                backgroundColor: colors.background.primary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            />
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}
            >
              Select Events
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md }}>
              {availableEvents.map((event) => (
                <TouchableOpacity
                  key={event}
                  onPress={() => handleToggleEvent(event)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.md,
                    backgroundColor: selectedEvents.includes(event) ? colors.accent : colors.background.primary,
                    borderWidth: 1,
                    borderColor: selectedEvents.includes(event) ? colors.accent : colors.border.light,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: selectedEvents.includes(event) ? colors.text.primary : colors.text.secondary,
                    }}
                  >
                    {event}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateForm(false);
                  setNewWebhookName("");
                  setNewWebhookUrl("");
                  setSelectedEvents([]);
                }}
                style={{
                  flex: 1,
                  padding: spacing.md,
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
                    color: colors.text.secondary,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateWebhook}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.accent,
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
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Webhooks List */}
        <View style={{ gap: spacing.md }}>
          {webhooks.map((webhook) => {
            const isExpanded = selectedWebhook === webhook.id;

            return (
              <View
                key={webhook.id}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  borderWidth: 1,
                  borderColor: webhook.status === "active" ? colors.status.success + "40" : colors.border.light,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedWebhook(isExpanded ? null : webhook.id)}
                  style={{
                    padding: spacing.lg,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                        }}
                      >
                        {webhook.name}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          backgroundColor: webhook.status === "active" ? colors.status.success + "20" : colors.status.error + "20",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: webhook.status === "active" ? colors.status.success : colors.status.error,
                            textTransform: "uppercase",
                          }}
                        >
                          {webhook.status}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                        color: colors.text.secondary,
                        marginBottom: spacing.xs,
                      }}
                      numberOfLines={1}
                    >
                      {webhook.url}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      {webhook.events.length} event(s) • Last triggered: {webhook.lastTriggered}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={isExpanded ? "expand-less" : "expand-more"}
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View
                    style={{
                      padding: spacing.lg,
                      borderTopWidth: 1,
                      borderTopColor: colors.border.light,
                      backgroundColor: colors.background.primary,
                    }}
                  >
                    <View style={{ marginBottom: spacing.md }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing.sm,
                        }}
                      >
                        Events
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
                        {webhook.events.map((event) => (
                          <View
                            key={event}
                            style={{
                              paddingHorizontal: spacing.sm,
                              paddingVertical: spacing.xs,
                              borderRadius: borderRadius.sm,
                              backgroundColor: colors.accent + "20",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: typography.fontSize.xs,
                                color: colors.accent,
                              }}
                            >
                              {event}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View style={{ marginBottom: spacing.md }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing.sm,
                        }}
                      >
                        Webhook Secret
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: colors.secondary.bg,
                          borderRadius: borderRadius.md,
                          padding: spacing.md,
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: typography.fontSize.sm,
                            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                            color: colors.text.primary,
                          }}
                        >
                          {webhook.secret}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: spacing.md }}>
                      <TouchableOpacity
                        onPress={() => handleToggleWebhook(webhook.id)}
                        style={{
                          flex: 1,
                          padding: spacing.md,
                          borderRadius: borderRadius.md,
                          backgroundColor: webhook.status === "active" ? colors.status.error + "20" : colors.status.success + "20",
                          borderWidth: 1,
                          borderColor: webhook.status === "active" ? colors.status.error : colors.status.success,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.semibold,
                            color: webhook.status === "active" ? colors.status.error : colors.status.success,
                          }}
                        >
                          {webhook.status === "active" ? "Deactivate" : "Activate"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteWebhook(webhook.id)}
                        style={{
                          flex: 1,
                          padding: spacing.md,
                          borderRadius: borderRadius.md,
                          backgroundColor: colors.status.error + "20",
                          borderWidth: 1,
                          borderColor: colors.status.error,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.status.error,
                          }}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Webhook Documentation */}
        <View
          style={{
            marginTop: spacing["2xl"],
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
            <MaterialIcons name="info" size={24} color={colors.status.info} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
            >
              Webhook Documentation
            </Text>
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              lineHeight: 20,
              marginBottom: spacing.md,
            }}
          >
            Webhooks allow you to receive real-time notifications when events occur in the BDN platform. Each webhook request includes:
          </Text>
          <View
            style={{
              backgroundColor: colors.background.primary,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: colors.text.primary,
                lineHeight: 18,
              }}
            >
              POST {`{your-webhook-url}`}{"\n"}
              Headers:{"\n"}
              {"  "}X-Webhook-Signature: {`{signature}`}{"\n"}
              {"  "}X-Webhook-Timestamp: {`{timestamp}`}{"\n"}
              Body: {`{event-data}`}
            </Text>
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              lineHeight: 20,
            }}
          >
            Verify webhook signatures using your webhook secret to ensure requests are from BDN.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

