import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
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
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? spacing.mobile : spacing.desktop,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >

        {/* Getting Started */}
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
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
            <MaterialIcons name="rocket-launch" size={24} color={colors.accent} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
            >
              Getting Started
            </Text>
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.md,
              lineHeight: 20,
            }}
          >
            1. Get your API key from the API Keys page
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.md,
              lineHeight: 20,
            }}
          >
            2. Include your API key in the Authorization header: <Text style={{ fontFamily: "monospace", color: colors.accent }}>Bearer YOUR_API_KEY</Text>
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              lineHeight: 20,
            }}
          >
            3. Make requests to <Text style={{ fontFamily: "monospace", color: colors.accent }}>https://api.bdn.com/api/v1</Text>
          </Text>
        </View>

        {/* Code Examples */}
        <View style={{ marginBottom: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Code Examples
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginBottom: spacing.md,
            }}
          >
            {Object.keys(codeExamples).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setSelectedExample(lang as keyof typeof codeExamples)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.md,
                  backgroundColor: selectedExample === lang ? colors.accent : colors.secondary.bg,
                  borderWidth: 1,
                  borderColor: selectedExample === lang ? colors.accent : colors.border.light,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: selectedExample === lang ? colors.text.primary : colors.text.secondary,
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
              backgroundColor: colors.background.primary,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: spacing.sm }}>
              <TouchableOpacity
                onPress={() => copyToClipboard(codeExamples[selectedExample])}
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                  backgroundColor: colors.secondary.bg,
                }}
              >
                <MaterialIcons name="content-copy" size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: colors.text.primary,
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
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            API Endpoints
          </Text>
          <View style={{ gap: spacing.md }}>
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
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    overflow: "hidden",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setExpandedEndpoint(isExpanded ? null : endpoint.path)}
                    style={{
                      padding: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <View
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,
                          borderRadius: borderRadius.sm,
                          backgroundColor: `${methodColor}20`,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.bold,
                            color: methodColor,
                          }}
                        >
                          {endpoint.method}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                            color: colors.text.primary,
                            marginBottom: spacing.xs,
                          }}
                        >
                          {endpoint.path}
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.secondary,
                          }}
                        >
                          {endpoint.description}
                        </Text>
                      </View>
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
                        padding: spacing.md,
                        borderTopWidth: 1,
                        borderTopColor: colors.border.light,
                        backgroundColor: colors.background.primary,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                          marginBottom: spacing.sm,
                        }}
                      >
                        Category: {endpoint.category}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: colors.text.primary,
                          backgroundColor: colors.secondary.bg,
                          padding: spacing.sm,
                          borderRadius: borderRadius.sm,
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
            marginTop: spacing["2xl"],
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
            <MaterialIcons name="speed" size={24} color={colors.status.warning} />
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
            >
              Rate Limits
            </Text>
          </View>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              lineHeight: 20,
            }}
          >
            API requests are limited to 10,000 requests per hour per API key. Rate limit information is included in response headers:
          </Text>
          <View
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.background.primary,
              padding: spacing.md,
              borderRadius: borderRadius.sm,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                color: colors.text.primary,
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

