import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { DeveloperRedirect } from '@/components/DeveloperRedirect';
import { DeveloperPageHeader } from '@/components/developer/DeveloperPageHeader';

// Mock developer stats
const mockStats = {
  totalApiKeys: 3,
  activeWebhooks: 5,
  apiCallsToday: 12450,
  apiCallsThisMonth: 342000,
  rateLimitRemaining: 8750,
  rateLimitTotal: 10000,
  errorsToday: 12,
  avgResponseTime: 145, // ms
};

const developerSections = [
  {
    id: "api-docs",
    name: "API Documentation",
    description: "Complete API reference with endpoints",
    icon: "menu-book",
    color: "#2196f3",
    route: "/developer/api-docs",
  },
  {
    id: "api-keys",
    name: "API Keys",
    description: "Manage your API keys and access credentials",
    icon: "vpn-key",
    color: "#4caf50",
    route: "/developer/api-keys",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Configure and manage webhook endpoints",
    icon: "webhook",
    color: "#9c27b0",
    route: "/developer/webhooks",
  },
  {
    id: "sdks",
    name: "SDKs & Examples",
    description: "Download SDKs and view code examples",
    icon: "code",
    color: "#ff9800",
    route: "/developer/sdks",
  },
  {
    id: "logs",
    name: "Logs & Debugging",
    description: "View API logs and debug requests",
    icon: "bug-report",
    color: "#ff4444",
    route: "/developer/logs",
  },
  {
    id: "testing",
    name: "Testing Tools",
    description: "Test API endpoints and validate integrations",
    icon: "science",
    color: "#00bcd4",
    route: "/developer/testing",
  },
];

function DeveloperDashboardContent() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  const rateLimitPercentage = (mockStats.rateLimitRemaining / mockStats.rateLimitTotal) * 100;

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
        {/* Description */}
        <View style={{ marginBottom: 32, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.9)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Developer Portal
          </Text>
        </View>

        {/* Quick Stats */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              API Calls Today
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#2196f3",
              }}
            >
              {mockStats.apiCallsToday.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Rate Limit Remaining
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              {mockStats.rateLimitRemaining.toLocaleString()}
            </Text>
            <View
              style={{
                marginTop: 8,
                height: 4,
                backgroundColor: "#232323",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${rateLimitPercentage}%`,
                  backgroundColor: "#4caf50",
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Active API Keys
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {mockStats.totalApiKeys}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Avg Response Time
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ff9800",
              }}
            >
              {mockStats.avgResponseTime}ms
            </Text>
          </View>
        </View>

        {/* Developer Tools */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 24,
            }}
          >
            Developer Tools
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -6,
            }}
          >
            {developerSections.map((section) => (
              <View
                key={section.id}
                style={{
                  flex: 1,
                  minWidth: "48%",
                  maxWidth: "48%",
                  paddingHorizontal: 6,
                  marginBottom: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(section.route as any)}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    minHeight: 140,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: `${section.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <MaterialIcons name={section.icon as any} size={24} color={section.color} />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {section.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {section.description}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Links */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 24,
            }}
          >
            Quick Links
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
            <View style={{ gap: 16 }}>
              {[
                {
                  title: "Getting Started Guide",
                  description: "Learn how to integrate with the BDN API",
                  icon: "rocket-launch",
                  link: "/developer/api-docs",
                },
                {
                  title: "API Status",
                  description: "Check API status and uptime",
                  icon: "check-circle",
                  link: "/developer/logs",
                },
                {
                  title: "Support & Community",
                  description: "Get help from our developer community",
                  icon: "forum",
                  link: "#",
                },
              ].map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(link.link as any)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name={link.icon as any} size={20} color="#ba9988" style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {link.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {link.description}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function DeveloperDashboard() {
  return (
    <DeveloperRedirect>
      <DeveloperDashboardContent />
    </DeveloperRedirect>
  );
}

