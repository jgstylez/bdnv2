import React from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { OrganizationAccount } from '@/types/nonprofit';
import { HeroSection } from '@/components/layouts/HeroSection';
import { NonprofitSwitcher } from '@/components/NonprofitSwitcher';
import { useNonprofit } from '@/contexts/NonprofitContext';
import { useResponsive } from '@/hooks/useResponsive';
import { spacing } from '@/constants/theme';
import { mockNonprofitAccounts } from '@/contexts/NonprofitContext';

export default function NonprofitDashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const { selectedNonprofit, isLoading } = useNonprofit();

  // Get account data for the selected nonprofit
  const account = selectedNonprofit ? (mockNonprofitAccounts[selectedNonprofit.id] || mockNonprofitAccounts["org1"]) : null;

  const stats = account ? [
    {
      label: "Current Balance",
      value: `$${Math.round(account.balance.usd).toLocaleString()}`,
      icon: "account-balance-wallet",
      color: "#ba9988",
    },
    {
      label: "Total Raised",
      value: `$${Math.round(account.totalRaised.usd).toLocaleString()}`,
      icon: "trending-up",
      color: "#4caf50",
    },
    {
      label: "Total Donations",
      value: account.totalDonations.toLocaleString(),
      icon: "favorite",
      color: "#f44336",
    },
    {
      label: "Contributors",
      value: account.contributors.toLocaleString(),
      icon: "people",
      color: "#2196f3",
    },
  ] : [];

  if (isLoading || !selectedNonprofit || !account) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#ffffff" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Nonprofit Switcher */}
        <NonprofitSwitcher />

        {/* Hero Section */}
        <HeroSection
          title="Organization Dashboard"
          subtitle={`${selectedNonprofit.name} • Track your fundraising progress, manage campaigns, and view donations`}
        />

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {stats.map((stat, index) => (
            <View
              key={index}
              style={{
                flex: isMobile ? "0 0 calc(50% - 8px)" : "0 0 calc(25% - 12px)",
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${stat.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/pages/nonprofit/campaigns")}
              style={{
                flex: isMobile ? "0 0 calc(50% - 6px)" : "0 0 calc(25% - 9px)",
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="campaign" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                Manage Campaigns
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                }}
              >
                {account.activeCampaigns} active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/pages/nonprofit/account")}
              style={{
                flex: isMobile ? "0 0 calc(50% - 6px)" : "0 0 calc(25% - 9px)",
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="account-balance" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                Manage Account
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                }}
              >
                View funding & transactions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/pages/nonprofit/donations")}
              style={{
                flex: isMobile ? "0 0 calc(50% - 6px)" : "0 0 calc(25% - 9px)",
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="favorite" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                View Donations
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                }}
              >
                {account.totalDonations} total
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/pages/nonprofit/settings")}
              style={{
                flex: isMobile ? "0 0 calc(50% - 6px)" : "0 0 calc(25% - 9px)",
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="settings" size={24} color="#ba9988" style={{ marginBottom: 8 }} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                Manage Settings
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                }}
              >
                Manage organization details
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View>
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
              Recent donations and activity will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

