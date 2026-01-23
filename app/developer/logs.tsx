import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { DeveloperPageHeader } from '@/components/developer/DeveloperPageHeader';

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
    if (statusCode >= 200 && statusCode < 300) return "#4caf50";
    if (statusCode >= 400 && statusCode < 500) return "#ff9800";
    if (statusCode >= 500) return "#f74141";
    return "rgba(255, 255, 255, 0.7)";
  };

  const getMethodColor = (method: string) => {
    if (method === "GET") return "#2196f3";
    if (method === "POST") return "#4caf50";
    if (method === "PUT" || method === "PATCH") return "#ff9800";
    if (method === "DELETE") return "#f74141";
    return "rgba(255, 255, 255, 0.7)";
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
          title="Logs & Debugging"
          description="View API logs and debug requests"
        />

        {/* Filters */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 24,
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
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: filter === filterOption.value ? "#ba9988" : "#474747",
                borderWidth: 1,
                borderColor: filter === filterOption.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: filter === filterOption.value ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                {filterOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logs List */}
        <View style={{ gap: 12 }}>
          {filteredLogs.map((log) => {
            const isExpanded = selectedLog === log.id;
            const statusColor = getStatusColor(log.statusCode);
            const methodColor = getMethodColor(log.method);

            return (
              <View
                key={log.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: log.error ? "#f7414140" : "rgba(186, 153, 136, 0.2)",
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedLog(isExpanded ? null : log.id)}
                  style={{
                    padding: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
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
                          {log.method}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: "#ffffff",
                          flex: 1,
                          fontWeight: "600",
                        }}
                        numberOfLines={1}
                      >
                        {log.path}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
                          backgroundColor: `${statusColor}20`,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: statusColor,
                          }}
                        >
                          {log.statusCode}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {log.timestamp}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {log.responseTime}ms
                      </Text>
                      {log.error && (
                        <View
                          style={{
                            paddingHorizontal: 6,
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
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 4,
                        }}
                      >
                        API Key
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                          color: "#ffffff",
                        }}
                      >
                        {log.apiKey}
                      </Text>
                    </View>
                    {log.error && (
                      <View style={{ marginBottom: 16 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: "#f74141",
                            marginBottom: 4,
                          }}
                        >
                          Error Message
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#f74141",
                          }}
                        >
                          {log.error}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 4,
                        }}
                      >
                        Request Details
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#474747",
                          padding: 12,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                            color: "#ffffff",
                            lineHeight: 18,
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
            marginTop: 32,
            flexDirection: isMobile ? "column" : "row",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: 12,
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
              Total Requests (Today)
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {logs.length}
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
              Error Rate
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#f74141",
              }}
            >
              {Math.round((logs.filter((l) => l.statusCode >= 400).length / logs.length) * 100)}%
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
              {Math.round(logs.reduce((acc, log) => acc + log.responseTime, 0) / logs.length)}ms
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

