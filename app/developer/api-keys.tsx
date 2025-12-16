import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

const copyToClipboard = async (text: string): Promise<boolean> => {
  if (Platform.OS === "web") {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: "sandbox" | "live";
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
  permissions: string[];
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "pk_live_51H8xK2L3mN9pQrS7tUvWxYz4aBcDeFgHiJkLmNoPqRsTuVwXyZ123456",
    environment: "live",
    createdAt: "2024-01-15",
    lastUsed: "2024-12-19",
    status: "active",
    permissions: ["read", "write"],
  },
  {
    id: "2",
    name: "Development Key",
    key: "pk_test_51H8xK2L3mN9pQrS7tUvWxYz4aBcDeFgHiJkLmNoPqRsTuVwXyZ345678",
    environment: "sandbox",
    createdAt: "2024-11-01",
    lastUsed: "2024-12-19",
    status: "active",
    permissions: ["read"],
  },
  {
    id: "3",
    name: "Old Production Key",
    key: "pk_live_51H8xK2L3mN9pQrS7tUvWxYz4aBcDeFgHiJkLmNoPqRsTuVwXyZ789012",
    environment: "live",
    createdAt: "2024-06-01",
    lastUsed: "2024-10-15",
    status: "revoked",
    permissions: ["read", "write"],
  },
];

export default function ApiKeys() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"sandbox" | "live">("sandbox");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      Alert.alert("Error", "Please enter a name for your API key");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `pk_${newKeyEnvironment === "live" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`,
      environment: newKeyEnvironment,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active",
      permissions: ["read", "write"],
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName("");
    setShowCreateForm(false);
    Alert.alert("Success", "API key created successfully");
  };

  const handleRevokeKey = (id: string) => {
    Alert.alert("Revoke API Key", "Are you sure you want to revoke this API key?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Revoke",
        style: "destructive",
        onPress: () => {
          setApiKeys(apiKeys.map((key) => (key.id === id ? { ...key, status: "revoked" as const } : key)));
        },
      },
    ]);
  };

  const handleCopyKey = async (key: string) => {
    const success = await copyToClipboard(key);
    if (success) {
      Alert.alert("Copied!", "API key copied to clipboard");
    }
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
              Create Key
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
              Create New API Key
            </Text>
            <TextInput
              placeholder="API Key Name"
              placeholderTextColor={colors.text.placeholder}
              value={newKeyName}
              onChangeText={setNewKeyName}
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
            <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.md }}>
              <TouchableOpacity
                onPress={() => setNewKeyEnvironment("sandbox")}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: newKeyEnvironment === "sandbox" ? colors.status.warning + "20" : colors.background.primary,
                  borderWidth: 1,
                  borderColor: newKeyEnvironment === "sandbox" ? colors.status.warning : colors.border.light,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: newKeyEnvironment === "sandbox" ? colors.status.warning : colors.text.secondary,
                  }}
                >
                  Sandbox
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewKeyEnvironment("live")}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: newKeyEnvironment === "live" ? colors.status.error + "20" : colors.background.primary,
                  borderWidth: 1,
                  borderColor: newKeyEnvironment === "live" ? colors.status.error : colors.border.light,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: newKeyEnvironment === "live" ? colors.status.error : colors.text.secondary,
                  }}
                >
                  Live
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateForm(false);
                  setNewKeyName("");
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
                onPress={handleCreateKey}
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

        {/* API Keys List */}
        <View style={{ gap: spacing.md }}>
          {apiKeys.map((apiKey) => {
            const isExpanded = selectedKey === apiKey.id;
            const isLive = apiKey.environment === "live";

            return (
              <View
                key={apiKey.id}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  borderWidth: 1,
                  borderColor: apiKey.status === "revoked" ? colors.status.error + "40" : isLive ? colors.status.error + "40" : colors.border.light,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedKey(isExpanded ? null : apiKey.id)}
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
                        {apiKey.name}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          backgroundColor: isLive ? colors.status.error + "20" : colors.status.warning + "20",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: isLive ? colors.status.error : colors.status.warning,
                            textTransform: "uppercase",
                          }}
                        >
                          {apiKey.environment}
                        </Text>
                      </View>
                      {apiKey.status === "revoked" && (
                        <View
                          style={{
                            paddingHorizontal: spacing.xs,
                            paddingVertical: 2,
                            borderRadius: borderRadius.sm,
                            backgroundColor: colors.status.error + "20",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.semibold,
                              color: colors.status.error,
                              textTransform: "uppercase",
                            }}
                          >
                            Revoked
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      Created: {apiKey.createdAt} • Last used: {apiKey.lastUsed}
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.secondary.bg,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        marginBottom: spacing.md,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: typography.fontSize.sm,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: colors.text.primary,
                        }}
                        numberOfLines={1}
                      >
                        {apiKey.key}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleCopyKey(apiKey.key)}
                        style={{
                          marginLeft: spacing.sm,
                          padding: spacing.xs,
                          borderRadius: borderRadius.sm,
                          backgroundColor: colors.accent + "20",
                        }}
                      >
                        <MaterialIcons name="content-copy" size={18} color={colors.accent} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", gap: spacing.md }}>
                      {apiKey.status === "active" && (
                        <TouchableOpacity
                          onPress={() => handleRevokeKey(apiKey.id)}
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
                            Revoke Key
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Security Notice */}
        <View
          style={{
            marginTop: spacing["2xl"],
            backgroundColor: colors.status.warning + "20",
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.status.warning + "40",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.sm }}>
            <MaterialIcons name="security" size={20} color={colors.status.warning} style={{ marginRight: spacing.sm, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.status.warning,
                  marginBottom: spacing.xs,
                }}
              >
                Security Best Practices
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  lineHeight: 20,
                }}
              >
                • Never share your API keys publicly or commit them to version control{"\n"}
                • Use sandbox keys for development and testing{"\n"}
                • Rotate your keys regularly{"\n"}
                • Revoke keys immediately if they are compromised{"\n"}
                • Use environment variables to store API keys
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

