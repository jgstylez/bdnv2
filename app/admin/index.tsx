import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminDashboardStats } from '@/types/admin';
import { AdminRedirect } from '@/components/AdminRedirect';

// Mock admin stats
const mockStats: AdminDashboardStats = {
  totalUsers: 12500,
  totalBusinesses: 450,
  totalNonprofits: 89,
  activeUsers: 8900,
  totalTransactions: 125000,
  totalRevenue: 1250000,
  pendingApprovals: 23,
  supportTickets: 45,
};

const adminSections = [
  {
    id: "users",
    name: "User Management",
    description: "Manage users, accounts, and permissions",
    icon: "people",
    color: "#ba9988",
    route: "/admin/users",
  },
  {
    id: "businesses",
    name: "Business Management",
    description: "Approve and manage merchant accounts",
    icon: "store",
    color: "#4caf50",
    route: "/admin/businesses",
  },
  {
    id: "nonprofits",
    name: "Nonprofit Management",
    description: "Manage nonprofit organizations and applications",
    icon: "handshake",
    color: "#e91e63",
    route: "/admin/nonprofits",
  },
  {
    id: "token-holders",
    name: "Token Holders",
    description: "Manage token holders, balances, and account status",
    icon: "account-balance-wallet",
    color: "#ff9800",
    route: "/admin/token-holders",
  },
  {
    id: "transactions",
    name: "Transaction Management",
    description: "Review transactions, process refunds, and manage disputes",
    icon: "receipt",
    color: "#2196f3",
    route: "/admin/transactions",
  },
  {
    id: "gift-cards",
    name: "Gift Card Orders",
    description: "View and monitor gift card orders (automated system)",
    icon: "card-giftcard",
    color: "#e91e63",
    route: "/admin/gift-cards",
  },
  {
    id: "blkd-purchases",
    name: "BLKD Purchases",
    description: "View and monitor BLKD purchases (automated system)",
    icon: "account-balance-wallet",
    color: "#4caf50",
    route: "/admin/blkd-purchases",
  },
  {
    id: "subscription-boxes",
    name: "Subscription Boxes",
    description: "Oversight and dispute resolution for subscription boxes",
    icon: "subscriptions",
    color: "#ff9800",
    route: "/admin/subscription-boxes",
  },
  {
    id: "disputes",
    name: "Dispute Management",
    description: "Handle user disputes and support tickets",
    icon: "gavel",
    color: "#ff6b35",
    route: "/admin/disputes",
  },
  {
    id: "notifications",
    name: "Push Notifications",
    description: "Send push notifications to users, businesses, or nonprofits",
    icon: "notifications",
    color: "#9c27b0",
    route: "/admin/notifications",
  },
  {
    id: "emails",
    name: "Email Management",
    description: "Send emails to users, businesses, or nonprofits",
    icon: "email",
    color: "#00bcd4",
    route: "/admin/emails",
  },
  {
    id: "content",
    name: "Content Management",
    description: "Manage blog, videos, and dynamic content",
    icon: "article",
    color: "#2196f3",
    route: "/admin/content",
  },
  {
    id: "bi",
    name: "Business Intelligence",
    description: "Comprehensive business metrics and analytics",
    icon: "insights",
    color: "#9c27b0",
    route: "/admin/bi",
  },
  {
    id: "analytics",
    name: "Analytics & Reports",
    description: "Platform analytics and insights",
    icon: "analytics",
    color: "#ffd700",
    route: "/admin/analytics",
  },
  {
    id: "settings",
    name: "Platform Settings",
    description: "Configure platform settings and features",
    icon: "settings",
    color: "#9c27b0",
    route: "/admin/settings",
  },
];

function AdminDashboardContent() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Description */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Platform Management
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
              Total Users
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {mockStats.totalUsers.toLocaleString()}
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
              Total Businesses
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              {mockStats.totalBusinesses.toLocaleString()}
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
              Pending Approvals
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ffd700",
              }}
            >
              {mockStats.pendingApprovals}
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
              Support Tickets
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#2196f3",
              }}
            >
              {mockStats.supportTickets}
            </Text>
          </View>
        </View>

        {/* Admin Sections */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Management Tools
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -6,
              alignItems: "stretch",
            }}
          >
            {adminSections.map((section) => (
              <View
                key={section.id}
                style={{
                  flex: 1,
                  minWidth: isMobile ? "48%" : "32%",
                  maxWidth: isMobile ? "48%" : "32%",
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
                    flex: 1,
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
                    marginBottom: 12,
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
                    fontSize: 13,
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

        {/* Recent Activity */}
        <View style={{ marginTop: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Recent Activity
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
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                paddingVertical: 20,
              }}
            >
              No recent activity
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function AdminDashboard() {
  return (
    <AdminRedirect>
      <AdminDashboardContent />
    </AdminRedirect>
  );
}

