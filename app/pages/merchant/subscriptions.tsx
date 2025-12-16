import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform, TextInput, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SubscriptionBoxPlan, getFrequencyLabel, getDurationLabel } from "../../../types/subscription-box";
import { formatCurrency } from "../../../lib/international";
import { AdminDataCard } from "../../../components/admin/AdminDataCard";
import { Pagination } from "../../../components/admin/Pagination";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../../constants/theme";
import { PageHeader } from "../../../components/admin/AdminPageHeader";

export default function MerchantSubscriptions() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [plans, setPlans] = useState<SubscriptionBoxPlan[]>([]);


  const handleToggleActive = (planId: string, isActive: boolean) => {
    Alert.alert(
      `${isActive ? "Deactivate" : "Activate"} Plan`,
      `Are you sure you want to ${isActive ? "deactivate" : "activate"} this plan?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isActive ? "Deactivate" : "Activate",
          style: "destructive",
          onPress: () => {
             setPlans(plans.map(p => p.id === planId ? {...p, isActive: !isActive} : p));
             // Here you would call an API to update the plan's status
          },
        },
      ]
    );
  };

  const handleDelete = (planId: string) => {
     Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete this plan? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
             setPlans(plans.filter(p => p.id !== planId));
            // Here you would call an API to delete the plan
          },
        },
      ]
    );
  };


  const filteredPlans = plans.filter((plan) => {
    return (
      searchQuery === "" ||
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.productId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <PageHeader
          title="Subscription Plans"
          description="Manage your subscription plans and offerings."
          actions={[
            {
              label: "Create New Plan",
              icon: "add",
              onPress: () => router.push("/pages/merchant/subscriptions/create"),
            },
          ]}
        />

        <View style={{ marginBottom: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by plan name or product ID..."
              placeholderTextColor={colors.text.placeholder}
              style={{
                flex: 1,
                paddingVertical: spacing.md - 2,
                paddingHorizontal: spacing.md,
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
              }}
            />
          </View>
        </View>

        {paginatedPlans.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {paginatedPlans.map((plan) => (
              <AdminDataCard
                key={plan.id}
                title={plan.name}
                subtitle={`${getFrequencyLabel(plan.frequency)} • ${getDurationLabel(plan.duration)} • ${formatCurrency(plan.pricePerShipment + plan.shippingCostPerShipment, plan.currency)}/shipment`}
                badges={[
                  {
                    label: plan.isActive ? "Active" : "Inactive",
                    color: plan.isActive ? colors.status.success : colors.text.tertiary,
                    backgroundColor: plan.isActive ? `${colors.status.success}20` : `${colors.text.tertiary}20`,
                  },
                   {
                    label: `${plan.discountPercentage}% OFF`,
                    color: colors.status.success,
                    backgroundColor: `${colors.status.success}20`,
                  },
                ]}
                actions={[
                  {
                    label: "Edit",
                    icon: "edit",
                    variant: "info",
                    onPress: () => router.push(`/pages/merchant/subscriptions/edit/${plan.id}`),
                  },
                  {
                    label: plan.isActive ? "Deactivate" : "Activate",
                    icon: plan.isActive ? "toggle-off" : "toggle-on",
                    variant: "secondary",
                    onPress: () => handleToggleActive(plan.id, plan.isActive),
                  },
                  {
                    label: "Delete",
                    icon: "delete",
                    variant: "danger",
                    onPress: () => handleDelete(plan.id),
                  },
                ]}
              >
                <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Product ID:
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                      {plan.productId}
                    </Text>
                  </View>
                   <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Created:
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </AdminDataCard>
            ))}
          </View>
        ) : (
          <View style={{ backgroundColor: colors.secondary.bg, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', marginTop: spacing.xl }}>
            <MaterialIcons name="list-alt" size={48} color={colors.text.tertiary} />
            <Text style={{ fontSize: typography.fontSize.lg, fontWeight: '600', color: colors.text.primary, marginTop: spacing.md }}>
              No subscription plans found
            </Text>
             <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, marginTop: spacing.sm, textAlign: 'center', marginBottom: spacing.lg }}>
             Create your first subscription plan to get started.
            </Text>
             <TouchableOpacity
              onPress={() => router.push("/pages/merchant/subscriptions/create")}
               style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                backgroundColor: colors.accent,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
                borderRadius: borderRadius.md
              }}
            >
              <MaterialIcons name="add" size={20} color={colors.text.primary} />
              <Text style={{color: colors.text.primary, fontWeight: '600'}}>Create Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredPlans.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPlans.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </ScrollView>
    </View>
  );
}
