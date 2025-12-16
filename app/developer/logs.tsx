import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../../constants/theme";

interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  apiKey: string;
  error?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-12-19 14:30:15",
    method: "GET",
    path: "/api/v1/businesses",
    statusCode: 200,
    responseTime: 145,
    apiKey: "pk_live_...123456",
  },
  {
    id: "2",
    timestamp: "2024-12-19 14:29:42",
    method: "POST",
    path: "/api/v1/payments/c2b",
    statusCode: 201,
    responseTime: 234,
    apiKey: "pk_live_...123456",
  },
  {
    id: "3",
    timestamp: "2024-12-19 14:28:10",
    method: "GET",
    path: "/api/v1/transactions",
    statusCode: 400,
    responseTime: 89,
    apiKey: "pk_live_...123456",
    error: "Invalid parameters",
  },
  {
    id: "4",
    timestamp: "2024-12-19 14:27:33",
    method: "GET",
    path: "/api/v1/businesses/123",
    statusCode: 404,
    responseTime: 67,
    apiKey: "pk_live_...123456",
    error: "Business not found",
  },
  {
    id: "5",
    timestamp: "2024-12-19 14:26:55",
    method: "POST",
    path: "/api/v1/webhooks",
    statusCode: 200,
    responseTime: 312,
    apiKey: "pk_test_...345678",
  },
];

export default function Logs() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "success") return log.statusCode < 400;
    if (filter === "error") return log.statusCode >= 400;
    return true;
  });

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return colors.status.success;
    if (statusCode >= 400 && statusCode < 500) return colors.status.warning;
    if (statusCode >= 500) return colors.status.error;
    return colors.text.secondary;
  };

  const getMethodColor = (method: string) => {
    if (method === "GET") return colors.status.info;
    if (method === "POST") return colors.status.success;
    if (method === "PUT" || method === "PATCH") return colors.status.warning;
    if (method === "DELETE") return colors.status.error;
    return colors.text.secondary;
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

        {/* Filters */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginBottom: spacing.lg,
          }}
        >
          {[
            { label: "All", value: "all" as const },
            { label: "Success", value: "success" as const },
            { label: "Errors", value: "error" as const },
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.value}
              onPress={() => setFilter(filterOption.value)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.md,
                backgroundColor: filter === filterOption.value ? colors.accent : colors.secondary.bg,
                borderWidth: 1,
                borderColor: filter === filterOption.value ? colors.accent : colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: filter === filterOption.value ? colors.text.primary : colors.text.secondary,
                }}
              >
                {filterOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logs List */}
        <View style={{ gap: spacing.md }}>
          {filteredLogs.map((log) => {
            const isExpanded = selectedLog === log.id;
            const statusColor = getStatusColor(log.statusCode);
            const methodColor = getMethodColor(log.method);

            return (
              <View
                key={log.id}
                style={{
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  borderWidth: 1,
                  borderColor: log.error ? colors.status.error + "40" : colors.border.light,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedLog(isExpanded ? null : log.id)}
                  style={{
                    padding: spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                      <View
                        style={{
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
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
                          {log.method}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: colors.text.primary,
                          flex: 1,
                        }}
                        numberOfLines={1}
                      >
                        {log.path}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
                          backgroundColor: `${statusColor}20`,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.bold,
                            color: statusColor,
                          }}
                        >
                          {log.statusCode}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                        }}
                      >
                        {log.timestamp}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                        }}
                      >
                        {log.responseTime}ms
                      </Text>
                      {log.error && (
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
                            }}
                          >
                            Error
                          </Text>
                        </View>
                      )}
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
                    <View style={{ marginBottom: spacing.md }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        API Key
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: colors.text.primary,
                        }}
                      >
                        {log.apiKey}
                      </Text>
                    </View>
                    {log.error && (
                      <View style={{ marginBottom: spacing.md }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.status.error,
                            marginBottom: spacing.xs,
                          }}
                        >
                          Error Message
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.status.error,
                          }}
                        >
                          {log.error}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Request Details
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.secondary.bg,
                          padding: spacing.sm,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                            color: colors.text.primary,
                            lineHeight: 16,
                          }}
                        >
                          {log.method} {log.path}{"\n"}
                          Status: {log.statusCode}{"\n"}
                          Response Time: {log.responseTime}ms
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Stats */}
        <View
          style={{
            marginTop: spacing["2xl"],
            flexDirection: isMobile ? "column" : "row",
            gap: spacing.md,
          }}
        >
          <View
            style={{
              flex: 1,
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
              Total Requests (Today)
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {logs.length}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
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
              Error Rate
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["3xl"],
                fontWeight: typography.fontWeight.bold,
                color: colors.status.error,
              }}
            >
              {Math.round((logs.filter((l) => l.statusCode >= 400).length / logs.length) * 100)}%
            </Text>
          </View>
          <View
            style={{
              flex: 1,
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
              {Math.round(logs.reduce((acc, log) => acc + log.responseTime, 0) / logs.length)}ms
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

