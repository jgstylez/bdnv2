import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

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

const testScenarios = [
  {
    name: "List Businesses",
    method: "GET",
    endpoint: "/api/v1/businesses",
    description: "Test fetching a list of businesses",
  },
  {
    name: "Get Business",
    method: "GET",
    endpoint: "/api/v1/businesses/{id}",
    description: "Test fetching a specific business",
  },
  {
    name: "Create Payment",
    method: "POST",
    endpoint: "/api/v1/payments/c2b",
    description: "Test creating a consumer-to-business payment",
  },
  {
    name: "List Transactions",
    method: "GET",
    endpoint: "/api/v1/transactions",
    description: "Test fetching transaction history",
  },
];

export default function Testing() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedMethod, setSelectedMethod] = useState<string>("GET");
  const [endpoint, setEndpoint] = useState<string>("/api/v1/businesses");
  const [requestBody, setRequestBody] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTestRequest = async () => {
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setResponse(
        JSON.stringify(
          {
            status: 200,
            data: {
              message: "Test request successful",
              endpoint: endpoint,
              method: selectedMethod,
            },
          },
          null,
          2
        )
      );
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectScenario = (scenario: typeof testScenarios[0]) => {
    setSelectedMethod(scenario.method);
    setEndpoint(scenario.endpoint);
    setRequestBody("");
    setResponse("");
  };

  const generateCurlCommand = () => {
    const baseUrl = "https://api.bdn.com";
    let command = `curl -X ${selectedMethod} ${baseUrl}${endpoint}`;
    command += `\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    command += `\n  -H "Content-Type: application/json"`;
    if (requestBody && selectedMethod !== "GET") {
      command += `\n  -d '${requestBody}'`;
    }
    return command;
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

        {/* Test Scenarios */}
        <View style={{ marginBottom: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Quick Test Scenarios
          </Text>
          <View style={{ gap: spacing.sm }}>
            {testScenarios.map((scenario, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectScenario(scenario)}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                  <View
                    style={{
                      paddingHorizontal: spacing.xs,
                      paddingVertical: 2,
                      borderRadius: borderRadius.sm,
                      backgroundColor: colors.status.info + "20",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.status.info,
                      }}
                    >
                      {scenario.method}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    {scenario.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {scenario.endpoint}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                  }}
                >
                  {scenario.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Request Builder */}
        <View style={{ marginBottom: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Request Builder
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            {/* Method Selector */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                HTTP Method
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                {["GET", "POST", "PUT", "DELETE"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setSelectedMethod(method)}
                    style={{
                      flex: 1,
                      padding: spacing.sm,
                      borderRadius: borderRadius.md,
                      backgroundColor: selectedMethod === method ? colors.accent : colors.background.primary,
                      borderWidth: 1,
                      borderColor: selectedMethod === method ? colors.accent : colors.border.light,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: selectedMethod === method ? colors.text.primary : colors.text.secondary,
                      }}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Endpoint Input */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}
              >
                Endpoint
              </Text>
              <TextInput
                placeholder="/api/v1/businesses"
                placeholderTextColor={colors.text.placeholder}
                value={endpoint}
                onChangeText={setEndpoint}
                style={{
                  backgroundColor: colors.background.primary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              />
            </View>

            {/* Request Body */}
            {selectedMethod !== "GET" && (
              <View style={{ marginBottom: spacing.md }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}
                >
                  Request Body (JSON)
                </Text>
                <TextInput
                  placeholder='{"key": "value"}'
                  placeholderTextColor={colors.text.placeholder}
                  value={requestBody}
                  onChangeText={setRequestBody}
                  multiline
                  numberOfLines={6}
                  style={{
                    backgroundColor: colors.background.primary,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    color: colors.text.primary,
                    fontSize: typography.fontSize.sm,
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    minHeight: 120,
                    textAlignVertical: "top",
                  }}
                />
              </View>
            )}

            {/* Test Button */}
            <TouchableOpacity
              onPress={handleTestRequest}
              disabled={isLoading}
              style={{
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                {isLoading ? "Testing..." : "Test Request"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Response */}
        {response && (
          <View style={{ marginBottom: spacing["2xl"] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Response
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(response)}
                style={{
                  padding: spacing.sm,
                  borderRadius: borderRadius.sm,
                  backgroundColor: colors.accent + "20",
                }}
              >
                <MaterialIcons name="content-copy" size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: colors.background.primary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  color: colors.text.primary,
                  lineHeight: 20,
                }}
              >
                {response}
              </Text>
            </View>
          </View>
        )}

        {/* cURL Command */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              cURL Command
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(generateCurlCommand())}
              style={{
                padding: spacing.sm,
                borderRadius: borderRadius.sm,
                backgroundColor: colors.accent + "20",
              }}
            >
              <MaterialIcons name="content-copy" size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: colors.background.primary,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: colors.text.primary,
                lineHeight: 20,
              }}
            >
              {generateCurlCommand()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

