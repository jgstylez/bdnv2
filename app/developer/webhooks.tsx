import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { DeveloperPageHeader } from '@/components/developer/DeveloperPageHeader';

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
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <DeveloperPageHeader
          title="Webhooks"
          description="Configure and manage webhook endpoints"
          actionButton={{
            label: "Create Webhook",
            icon: "add",
            onPress: () => setShowCreateForm(!showCreateForm),
          }}
        />

        {/* Create Form */}
        {showCreateForm && (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 32,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Create New Webhook
            </Text>
            <TextInput
              placeholder="Webhook Name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newWebhookName}
              onChangeText={setNewWebhookName}
              style={{
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 16,
                color: "#ffffff",
                fontSize: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
            <TextInput
              placeholder="Webhook URL (https://...)"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newWebhookUrl}
              onChangeText={setNewWebhookUrl}
              style={{
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 16,
                color: "#ffffff",
                fontSize: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Select Events
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {availableEvents.map((event) => (
                <TouchableOpacity
                  key={event}
                  onPress={() => handleToggleEvent(event)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: selectedEvents.includes(event) ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: selectedEvents.includes(event) ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: selectedEvents.includes(event) ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {event}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateForm(false);
                  setNewWebhookName("");
                  setNewWebhookUrl("");
                  setSelectedEvents([]);
                }}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: "#474747",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateWebhook}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: "#ba9988",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Webhooks List */}
        <View style={{ gap: 12 }}>
          {webhooks.map((webhook) => {
            const isExpanded = selectedWebhook === webhook.id;

            return (
              <View
                key={webhook.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: webhook.status === "active" ? "#4caf5040" : "rgba(186, 153, 136, 0.2)",
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedWebhook(isExpanded ? null : webhook.id)}
                  style={{
                    padding: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        {webhook.name}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor: webhook.status === "active" ? "#4caf5020" : "#f7414120",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: webhook.status === "active" ? "#4caf50" : "#f74141",
                            textTransform: "uppercase",
                          }}
                        >
                          {webhook.status}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                        color: "rgba(255, 255, 255, 0.7)",
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                    >
                      {webhook.url}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {webhook.events.length} event(s) • Last triggered: {webhook.lastTriggered}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={isExpanded ? "expand-less" : "expand-more"}
                    size={24}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View
                    style={{
                      padding: 20,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.2)",
                      backgroundColor: "#232323",
                    }}
                  >
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Events
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        {webhook.events.map((event) => (
                          <View
                            key={event}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              borderRadius: 4,
                              backgroundColor: "#ba998820",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#ba9988",
                              }}
                            >
                              {event}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 8,
                        }}
                      >
                        Webhook Secret
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#474747",
                          borderRadius: 8,
                          padding: 16,
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                            color: "#ffffff",
                          }}
                        >
                          {webhook.secret}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 16 }}>
                      <TouchableOpacity
                        onPress={() => handleToggleWebhook(webhook.id)}
                        style={{
                          flex: 1,
                          padding: 16,
                          borderRadius: 8,
                          backgroundColor: webhook.status === "active" ? "#f7414120" : "#4caf5020",
                          borderWidth: 1,
                          borderColor: webhook.status === "active" ? "#f74141" : "#4caf50",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: webhook.status === "active" ? "#f74141" : "#4caf50",
                          }}
                        >
                          {webhook.status === "active" ? "Deactivate" : "Activate"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteWebhook(webhook.id)}
                        style={{
                          flex: 1,
                          padding: 16,
                          borderRadius: 8,
                          backgroundColor: "#f7414120",
                          borderWidth: 1,
                          borderColor: "#f74141",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#f74141",
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
            marginTop: 32,
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <MaterialIcons name="info" size={24} color="#2196f3" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginLeft: 8,
              }}
            >
              Webhook Documentation
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            Webhooks allow you to receive real-time notifications when events occur in the BDN platform. Each webhook request includes:
          </Text>
          <View
            style={{
              backgroundColor: "#232323",
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: "#ffffff",
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
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
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

