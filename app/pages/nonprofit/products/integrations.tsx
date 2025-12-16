import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { InventoryIntegration } from "../../../../types/merchant";

const availableIntegrations = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync products and inventory from your Shopify store",
    icon: "store",
    color: "#96bf48",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Connect your WooCommerce store for seamless inventory sync",
    icon: "shopping-cart",
    color: "#96588a",
  },
  {
    id: "square",
    name: "Square",
    description: "Integrate with Square POS and inventory management",
    icon: "point-of-sale",
    color: "#3e4348",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync inventory data from QuickBooks accounting software",
    icon: "account-balance",
    color: "#0077c5",
  },
  {
    id: "custom",
    name: "Custom API",
    description: "Connect via custom API endpoint",
    icon: "api",
    color: "#ba9988",
  },
];

export default function InventoryIntegrations() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [integrations, setIntegrations] = useState<InventoryIntegration[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
    syncFrequency: "hourly" as "realtime" | "hourly" | "daily",
  });

  const handleConnect = (providerId: string) => {
    setSelectedProvider(providerId);
    setFormData({
      name: availableIntegrations.find((p) => p.id === providerId)?.name || "",
      apiKey: "",
      apiSecret: "",
      webhookUrl: "",
      syncFrequency: "hourly",
    });
  };

  const handleSaveIntegration = () => {
    if (!selectedProvider) return;

    const newIntegration: InventoryIntegration = {
      id: `integration-${Date.now()}`,
      merchantId: "merchant1",
      provider: selectedProvider as any,
      name: formData.name,
      apiKey: formData.apiKey,
      apiSecret: formData.apiSecret,
      webhookUrl: formData.webhookUrl,
      isActive: true,
      syncFrequency: formData.syncFrequency,
      createdAt: new Date().toISOString(),
    };

    setIntegrations([...integrations, newIntegration]);
    setSelectedProvider(null);
    setFormData({
      name: "",
      apiKey: "",
      apiSecret: "",
      webhookUrl: "",
      syncFrequency: "hourly",
    });
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((int) => (int.id === id ? { ...int, isActive: !int.isActive } : int))
    );
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(integrations.filter((int) => int.id !== id));
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
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Inventory Integrations
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 24,
            }}
          >
            Connect your existing inventory management systems to automatically sync product data.
          </Text>
        </View>

        {/* Available Integrations */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Available Integrations
          </Text>
          <View style={{ gap: 12 }}>
            {availableIntegrations.map((integration) => {
              const isConnected = integrations.some((int) => int.provider === integration.id);
              return (
                <View
                  key={integration.id}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flexDirection: "row", gap: 16, flex: 1 }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          backgroundColor: `${integration.color}20`,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name={integration.icon as any} size={24} color={integration.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#ffffff",
                            marginBottom: 4,
                          }}
                        >
                          {integration.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {integration.description}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleConnect(integration.id)}
                      disabled={isConnected}
                      style={{
                        backgroundColor: isConnected ? "rgba(186, 153, 136, 0.2)" : "#ba9988",
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: isConnected ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
                        }}
                      >
                        {isConnected ? "Connected" : "Connect"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Connection Form */}
        {selectedProvider && (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Configure Integration
              </Text>
              <TouchableOpacity onPress={() => setSelectedProvider(null)}>
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Integration Name
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="My Shopify Store"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  API Key
                </Text>
                <TextInput
                  value={formData.apiKey}
                  onChangeText={(text) => setFormData({ ...formData, apiKey: text })}
                  placeholder="Enter API key"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  API Secret
                </Text>
                <TextInput
                  value={formData.apiSecret}
                  onChangeText={(text) => setFormData({ ...formData, apiSecret: text })}
                  placeholder="Enter API secret"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Webhook URL (Optional)
                </Text>
                <TextInput
                  value={formData.webhookUrl}
                  onChangeText={(text) => setFormData({ ...formData, webhookUrl: text })}
                  placeholder="https://example.com/webhook"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="url"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Sync Frequency
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {(["realtime", "hourly", "daily"] as const).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      onPress={() => setFormData({ ...formData, syncFrequency: freq })}
                      style={{
                        flex: 1,
                        backgroundColor: formData.syncFrequency === freq ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderRadius: 8,
                        padding: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: formData.syncFrequency === freq ? "#ffffff" : "#ba9988",
                          textTransform: "capitalize",
                        }}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSaveIntegration}
                style={{
                  backgroundColor: "#ba9988",
                  borderRadius: 12,
                  padding: 16,
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
                  Save Integration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Integrations */}
        {integrations.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Active Integrations
            </Text>
            <View style={{ gap: 12 }}>
              {integrations.map((integration) => {
                const providerInfo = availableIntegrations.find((p) => p.id === integration.provider);
                return (
                  <View
                    key={integration.id}
                    style={{
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          {providerInfo && (
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: `${providerInfo.color}20`,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <MaterialIcons name={providerInfo.icon as any} size={20} color={providerInfo.color} />
                            </View>
                          )}
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: "#ffffff",
                              }}
                            >
                              {integration.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              Sync: {integration.syncFrequency} • Last sync: {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleString() : "Never"}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => handleToggleIntegration(integration.id)}
                          style={{
                            backgroundColor: integration.isActive ? "#4caf50" : "#232323",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <MaterialIcons
                            name={integration.isActive ? "toggle-on" : "toggle-off"}
                            size={24}
                            color={integration.isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteIntegration(integration.id)}
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <MaterialIcons name="delete" size={24} color="#ff4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

