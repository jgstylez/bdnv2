import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

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
    description: "Complete API reference with endpoints, parameters, and examples",
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

export default function DeveloperDashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  const rateLimitPercentage = (mockStats.rateLimitRemaining / mockStats.rateLimitTotal) * 100;

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

        {/* Quick Stats */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: spacing.md,
            marginBottom: spacing["2xl"],
          }}
        >
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              API Calls Today
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.info,
              }}
            >
              {mockStats.apiCallsToday.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              Rate Limit Remaining
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.success,
              }}
            >
              {mockStats.rateLimitRemaining.toLocaleString()}
            </Text>
            <View
              style={{
                marginTop: spacing.sm,
                height: 4,
                backgroundColor: colors.background.primary,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${rateLimitPercentage}%`,
                  backgroundColor: colors.status.success,
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              Active API Keys
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.accent,
              }}
            >
              {mockStats.totalApiKeys}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 200,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.sm,
              }}
            >
              Avg Response Time
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.warning,
              }}
            >
              {mockStats.avgResponseTime}ms
            </Text>
          </View>
        </View>

        {/* Developer Tools */}
        <View>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.lg,
            }}
          >
            Developer Tools
          </Text>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: spacing.lg,
            }}
          >
            {developerSections.map((section) => (
              <TouchableOpacity
                key={section.id}
                onPress={() => router.push(section.route as any)}
                style={{
                  width: isMobile ? "100%" : "48%",
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border.light,
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
                    marginBottom: spacing.md,
                  }}
                >
                  <MaterialIcons name={section.icon as any} size={24} color={section.color} />
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {section.name}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {section.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Links */}
        <View style={{ marginTop: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.lg,
            }}
          >
            Quick Links
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
            <View style={{ gap: spacing.md }}>
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
                    paddingVertical: spacing.md,
                    borderBottomWidth: index < 2 ? 1 : 0,
                    borderBottomColor: colors.border.light,
                  }}
                >
                  <MaterialIcons name={link.icon as any} size={20} color={colors.accent} style={{ marginRight: spacing.md }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {link.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                      }}
                    >
                      {link.description}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

