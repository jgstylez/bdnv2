import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
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

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/v1/businesses",
    description: "List all businesses",
    category: "Businesses",
  },
  {
    method: "GET",
    path: "/api/v1/businesses/{id}",
    description: "Get business details",
    category: "Businesses",
  },
  {
    method: "POST",
    path: "/api/v1/payments/c2b",
    description: "Create consumer-to-business payment",
    category: "Payments",
  },
  {
    method: "GET",
    path: "/api/v1/transactions",
    description: "List transactions",
    category: "Transactions",
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    description: "Create webhook endpoint",
    category: "Webhooks",
  },
  {
    method: "GET",
    path: "/api/v1/users/me",
    description: "Get current user",
    category: "Users",
  },
];

const codeExamples = {
  curl: `curl -X GET https://api.bdn.com/api/v1/businesses \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  javascript: `const response = await fetch('https://api.bdn.com/api/v1/businesses', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`,
  python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.bdn.com/api/v1/businesses', headers=headers)
data = response.json()`,
};

export default function ApiDocs() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedExample, setSelectedExample] = useState<keyof typeof codeExamples>("curl");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

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
          title="API Documentation"
          description="Complete API reference with endpoints"
        />

        {/* Getting Started */}
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
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <MaterialIcons name="rocket-launch" size={24} color="#ba9988" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginLeft: 8,
              }}
            >
              Getting Started
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            1. Get your API key from the API Keys page
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            2. Include your API key in the Authorization header: <Text style={{ fontFamily: "monospace", color: "#ba9988" }}>Bearer YOUR_API_KEY</Text>
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 20,
            }}
          >
            3. Make requests to <Text style={{ fontFamily: "monospace", color: "#ba9988" }}>https://api.bdn.com/api/v1</Text>
          </Text>
        </View>

        {/* Code Examples */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Code Examples
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {Object.keys(codeExamples).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setSelectedExample(lang as keyof typeof codeExamples)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selectedExample === lang ? "#ba9988" : "#474747",
                  borderWidth: 1,
                  borderColor: selectedExample === lang ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedExample === lang ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    textTransform: "uppercase",
                  }}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
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
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() => copyToClipboard(codeExamples[selectedExample])}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  backgroundColor: "#474747",
                }}
              >
                <MaterialIcons name="content-copy" size={16} color="#ba9988" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: "#ffffff",
                lineHeight: 20,
              }}
            >
              {codeExamples[selectedExample]}
            </Text>
          </View>
        </View>

        {/* API Endpoints */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            API Endpoints
          </Text>
          <View style={{ gap: 12 }}>
            {apiEndpoints.map((endpoint, index) => {
              const isExpanded = expandedEndpoint === endpoint.path;
              const methodColor =
                endpoint.method === "GET"
                  ? colors.status.info
                  : endpoint.method === "POST"
                  ? colors.status.success
                  : colors.status.warning;

              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setExpandedEndpoint(isExpanded ? null : endpoint.path)}
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 6,
                          backgroundColor: `${methodColor}20`,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: methodColor,
                          }}
                        >
                          {endpoint.method}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                            color: "#ffffff",
                            marginBottom: 4,
                            fontWeight: "600",
                          }}
                        >
                          {endpoint.path}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {endpoint.description}
                        </Text>
                      </View>
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 8,
                        }}
                      >
                        Category: {endpoint.category}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: "#ffffff",
                          backgroundColor: "#474747",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      >
                        {endpoint.method} https://api.bdn.com{endpoint.path}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Rate Limits */}
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
            <MaterialIcons name="speed" size={24} color="#ff9800" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#ffffff",
                marginLeft: 8,
              }}
            >
              Rate Limits
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 20,
            }}
          >
            API requests are limited to 10,000 requests per hour per API key. Rate limit information is included in response headers:
          </Text>
          <View
            style={{
              marginTop: 16,
              backgroundColor: "#232323",
              padding: 16,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: "#ffffff",
              }}
            >
              X-RateLimit-Limit: 10000{"\n"}
              X-RateLimit-Remaining: 8750{"\n"}
              X-RateLimit-Reset: 1640995200
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

