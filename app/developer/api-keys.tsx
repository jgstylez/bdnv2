import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { DeveloperPageHeader } from '@/components/developer/DeveloperPageHeader';

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
          title="API Keys"
          description="Manage your API keys and access credentials"
          actionButton={{
            label: "Create Key",
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
              Create New API Key
            </Text>
            <TextInput
              placeholder="API Key Name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newKeyName}
              onChangeText={setNewKeyName}
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
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setNewKeyEnvironment("sandbox")}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: newKeyEnvironment === "sandbox" ? "#ff980020" : "#232323",
                  borderWidth: 1,
                  borderColor: newKeyEnvironment === "sandbox" ? "#ff9800" : "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: newKeyEnvironment === "sandbox" ? "#ff9800" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Sandbox
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewKeyEnvironment("live")}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: newKeyEnvironment === "live" ? "#f7414120" : "#232323",
                  borderWidth: 1,
                  borderColor: newKeyEnvironment === "live" ? "#f74141" : "rgba(186, 153, 136, 0.2)",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: newKeyEnvironment === "live" ? "#f74141" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Live
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateForm(false);
                  setNewKeyName("");
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
                onPress={handleCreateKey}
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

        {/* API Keys List */}
        <View style={{ gap: 16 }}>
          {apiKeys.map((apiKey) => {
            const isExpanded = selectedKey === apiKey.id;
            const isLive = apiKey.environment === "live";

            return (
              <View
                key={apiKey.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: apiKey.status === "revoked" ? "#f7414140" : isLive ? "#f7414140" : "rgba(186, 153, 136, 0.2)",
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedKey(isExpanded ? null : apiKey.id)}
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
                        {apiKey.name}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor: isLive ? "#f7414120" : "#ff980020",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: isLive ? "#f74141" : "#ff9800",
                            textTransform: "uppercase",
                          }}
                        >
                          {apiKey.environment}
                        </Text>
                      </View>
                      {apiKey.status === "revoked" && (
                        <View
                          style={{
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            borderRadius: 4,
                            backgroundColor: "#f7414120",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: "#f74141",
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
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Created: {apiKey.createdAt} • Last used: {apiKey.lastUsed}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={isExpanded ? "expand-less" : "expand-more"}
                    size={20}
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#474747",
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: "#ffffff",
                        }}
                        numberOfLines={1}
                      >
                        {apiKey.key}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleCopyKey(apiKey.key)}
                        style={{
                          marginLeft: 8,
                          padding: 4,
                          borderRadius: 4,
                          backgroundColor: "#ba998820",
                        }}
                      >
                        <MaterialIcons name="content-copy" size={18} color="#ba9988" />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", gap: 16 }}>
                      {apiKey.status === "active" && (
                        <TouchableOpacity
                          onPress={() => handleRevokeKey(apiKey.id)}
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
            marginTop: 32,
            backgroundColor: "#ff980020",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#ff980040",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
            <MaterialIcons name="security" size={20} color="#ff9800" style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ff9800",
                  marginBottom: 4,
                }}
              >
                Security Best Practices
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
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

