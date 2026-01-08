import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice, InvoiceStatus } from '@/types/invoices';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { AdminFilterBar } from '@/components/admin/AdminFilterBar';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminDataCard } from '@/components/admin/AdminDataCard';

// Mock invoices sent by this business
const mockSentInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2024-001",
    issuerId: "business-1",
    issuerType: "business",
    issuerName: "My Business",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "one-time",
    status: "paid",
    currency: "USD",
    subtotal: 100.00,
    tax: 8.00,
    discount: 0,
    total: 108.00,
    amountPaid: 108.00,
    amountDue: 0,
    lineItems: [
      {
        id: "1",
        description: "Product Service",
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00,
      },
    ],
    issueDate: "2024-01-15T00:00:00Z",
    dueDate: "2024-02-15T00:00:00Z",
    paidAt: "2024-01-20T00:00:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2024-002",
    issuerId: "business-1",
    issuerType: "business",
    issuerName: "My Business",
    recipientId: "user-2",
    recipientName: "Jane Smith",
    recipientEmail: "jane@example.com",
    billingType: "recurring",
    status: "sent",
    currency: "USD",
    subtotal: 250.50,
    tax: 20.04,
    discount: 0,
    total: 270.54,
    amountPaid: 0,
    amountDue: 270.54,
    lineItems: [
      {
        id: "1",
        description: "Monthly Subscription",
        quantity: 1,
        unitPrice: 250.50,
        total: 250.50,
      },
    ],
    recurringSettings: {
      frequency: "monthly",
      startDate: "2024-02-01T00:00:00Z",
      nextBillingDate: "2024-03-01T00:00:00Z",
      currentCycle: 1,
    },
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-02-15T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
];

export default function InvoiceManagement() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "one-time" | "recurring">("all");

  const filteredInvoices = useMemo(() => {
    return mockSentInvoices.filter((invoice) => {
      if (searchQuery && !invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !invoice.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && invoice.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "all" && invoice.billingType !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Invoices"
          subtitle="Create and manage invoices for your customers and clients"
        />

        {/* Quick Actions */}
        <View style={{ marginBottom: spacing.xl }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/invoices/create?type=business")}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: colors.accent,
              marginBottom: spacing.md,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                  <MaterialIcons name="add-circle" size={24} color={colors.text.primary} />
                  <Text
                    style={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    Create New Invoice
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.primary,
                    opacity: 0.9,
                  }}
                >
                  Send an invoice to a customer or client quickly and easily
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color={colors.text.primary} />
            </View>
          </TouchableOpacity>

          {/* Secondary Actions */}
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.md }}>
            <TouchableOpacity
              onPress={() => router.push("/pages/merchant/invoices/templates")}
              style={{
                flex: 1,
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <MaterialIcons name="description" size={20} color={colors.text.secondary} />
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.text.secondary,
                }}
              >
                Use Template
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <MaterialIcons name="receipt" size={20} color={colors.text.secondary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.text.secondary,
                  }}
                >
                  {filteredInvoices.length} {filteredInvoices.length === 1 ? "Invoice" : "Invoices"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search */}
        <AdminFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by invoice number or recipient..."
          hideSearch={false}
        />

        {/* Filters */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: spacing.md,
            marginBottom: spacing.lg,
          }}
        >
          <FilterDropdown
            label="Status"
            options={[
              { value: "all", label: "All" },
              { value: "draft", label: "Draft" },
              { value: "sent", label: "Sent" },
              { value: "paid", label: "Paid" },
              { value: "overdue", label: "Overdue" },
            ]}
            value={statusFilter === "all" ? "all" : statusFilter}
            onSelect={(value) => setStatusFilter((value === "all" ? "all" : value) as InvoiceStatus | "all")}
          />
          <FilterDropdown
            label="Type"
            options={[
              { value: "all", label: "All" },
              { value: "one-time", label: "One-Time" },
              { value: "recurring", label: "Recurring" },
            ]}
            value={typeFilter === "all" ? "all" : typeFilter}
            onSelect={(value) => setTypeFilter((value === "all" ? "all" : value) as "all" | "one-time" | "recurring")}
          />
        </View>

        {/* Invoice List */}
        <View style={{ gap: spacing.md }}>
          {filteredInvoices.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: spacing["4xl"],
              }}
            >
              <MaterialIcons name="receipt" size={64} color={colors.text.tertiary} />
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginTop: spacing.lg,
                  marginBottom: spacing.sm,
                }}
              >
                No invoices found
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginBottom: spacing.lg,
                }}
              >
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first invoice to get started"}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/pages/invoices/create?type=business")}
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: spacing.xl,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Create Invoice
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredInvoices.map((invoice) => {
              const getStatusColor = (status: InvoiceStatus) => {
                switch (status) {
                  case "paid":
                    return { bg: colors.status.successLight, text: colors.status.success };
                  case "sent":
                    return { bg: colors.status.infoLight, text: colors.status.info };
                  case "overdue":
                    return { bg: colors.status.errorLight, text: colors.status.error };
                  case "draft":
                    return { bg: colors.secondary.bg, text: colors.text.secondary };
                  default:
                    return { bg: colors.secondary.bg, text: colors.text.secondary };
                }
              };
              const statusColors = getStatusColor(invoice.status);

              return (
                <AdminDataCard
                  key={invoice.id}
                  title={invoice.invoiceNumber}
                  subtitle={`To: ${invoice.recipientName} • Due: ${formatDate(invoice.dueDate)}`}
                  badges={[
                    {
                      label: invoice.status,
                      color: statusColors.text,
                      backgroundColor: statusColors.bg,
                    },
                    {
                      label: invoice.billingType,
                      color: invoice.billingType === "recurring" ? colors.accent : colors.text.secondary,
                      backgroundColor: invoice.billingType === "recurring" ? colors.accentLight : colors.secondary.bg,
                    },
                  ]}
                  actions={[
                    {
                      label: "View",
                      icon: "visibility",
                      variant: "info",
                      onPress: () => router.push(`/pages/invoices/${invoice.id}`),
                    },
                    {
                      label: "Edit",
                      icon: "edit",
                      variant: "secondary",
                      onPress: () => router.push(`/pages/invoices/create?id=${invoice.id}&type=business`),
                    },
                    {
                      label: invoice.status === "sent" ? "Resend" : "Send",
                      icon: "send",
                      variant: "primary",
                      onPress: () => {
                        // TODO: Send/resend invoice
                        alert("Invoice sent!");
                      },
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.accent,
                      }}
                    >
                      ${invoice.total.toFixed(2)}
                    </Text>
                    {invoice.amountDue > 0 && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.tertiary,
                        }}
                      >
                        ${invoice.amountDue.toFixed(2)} due
                      </Text>
                    )}
                    {invoice.recurringSettings && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="repeat" size={16} color={colors.text.tertiary} />
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                          }}
                        >
                          {invoice.recurringSettings.frequency}
                        </Text>
                      </View>
                    )}
                  </View>
                </AdminDataCard>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
