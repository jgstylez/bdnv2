import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
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
          title="Testing Tools"
          description="Test API endpoints and validate integrations"
        />

        {/* Test Scenarios */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Test Scenarios
          </Text>
          <View style={{ gap: 12 }}>
            {testScenarios.map((scenario, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectScenario(scenario)}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      backgroundColor: "#2196f320",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#2196f3",
                      }}
                    >
                      {scenario.method}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    {scenario.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 4,
                  }}
                >
                  {scenario.endpoint}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {scenario.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Request Builder */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Request Builder
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {/* Method Selector */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                HTTP Method
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["GET", "POST", "PUT", "DELETE"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setSelectedMethod(method)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: selectedMethod === method ? "#ba9988" : "#232323",
                      borderWidth: 1,
                      borderColor: selectedMethod === method ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: selectedMethod === method ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Endpoint Input */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Endpoint
              </Text>
              <TextInput
                placeholder="/api/v1/businesses"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={endpoint}
                onChangeText={setEndpoint}
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 8,
                  padding: 16,
                  color: "#ffffff",
                  fontSize: 16,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>

            {/* Request Body */}
            {selectedMethod !== "GET" && (
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Request Body (JSON)
                </Text>
                <TextInput
                  placeholder='{"key": "value"}'
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={requestBody}
                  onChangeText={setRequestBody}
                  multiline
                  numberOfLines={6}
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 8,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
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
                padding: 16,
                borderRadius: 8,
                backgroundColor: "#ba9988",
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {isLoading ? "Testing..." : "Test Request"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Response */}
        {response && (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Response
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(response)}
                style={{
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: "#ba998820",
                }}
              >
                <MaterialIcons name="content-copy" size={16} color="#ba9988" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  color: "#ffffff",
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              cURL Command
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(generateCurlCommand())}
              style={{
                padding: 8,
                borderRadius: 4,
                backgroundColor: "#ba998820",
              }}
            >
              <MaterialIcons name="content-copy" size={16} color="#ba9988" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 8,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: "#ffffff",
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

