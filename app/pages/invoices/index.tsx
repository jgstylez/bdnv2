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

// Mock invoices - in production, fetch from API
const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2024-001",
    issuerId: "merchant-1",
    issuerType: "business",
    issuerName: "Soul Food Kitchen",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "one-time",
    status: "sent",
    currency: "USD",
    subtotal: 150.00,
    tax: 12.00,
    discount: 0,
    total: 162.00,
    amountPaid: 0,
    amountDue: 162.00,
    lineItems: [
      {
        id: "1",
        description: "Catering Services",
        quantity: 1,
        unitPrice: 150.00,
        tax: 12.00,
        total: 162.00,
      },
    ],
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-03-02T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2024-002",
    issuerId: "nonprofit-1",
    issuerType: "nonprofit",
    issuerName: "Community Foundation",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "recurring",
    status: "paid",
    currency: "USD",
    subtotal: 50.00,
    tax: 0,
    discount: 0,
    total: 50.00,
    amountPaid: 50.00,
    amountDue: 0,
    lineItems: [
      {
        id: "1",
        description: "Monthly Donation",
        quantity: 1,
        unitPrice: 50.00,
        total: 50.00,
      },
    ],
    recurringSettings: {
      frequency: "monthly",
      startDate: "2024-01-01T00:00:00Z",
      nextBillingDate: "2024-03-01T00:00:00Z",
      currentCycle: 2,
    },
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-02-15T00:00:00Z",
    paidAt: "2024-02-05T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2024-003",
    issuerId: "merchant-2",
    issuerType: "business",
    issuerName: "Tech Solutions LLC",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "one-time",
    status: "overdue",
    currency: "USD",
    subtotal: 500.00,
    tax: 40.00,
    discount: 50.00,
    total: 490.00,
    amountPaid: 0,
    amountDue: 490.00,
    lineItems: [
      {
        id: "1",
        description: "Website Development",
        quantity: 1,
        unitPrice: 500.00,
        tax: 40.00,
        discount: 50.00,
        total: 490.00,
      },
    ],
    issueDate: "2024-01-15T00:00:00Z",
    dueDate: "2024-02-14T00:00:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

export default function Invoices() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "one-time" | "recurring">("all");

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      if (searchQuery && !invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !invoice.issuerName.toLowerCase().includes(searchQuery.toLowerCase())) {
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
      case "cancelled":
        return { bg: colors.secondary.bg, text: colors.text.tertiary };
      default:
        return { bg: colors.secondary.bg, text: colors.text.secondary };
    }
  };

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
          subtitle="View and manage invoices you've received"
        />

        {/* Filters */}
        <AdminFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by invoice number or issuer..."
          filterGroups={[
            {
              key: "status",
              options: [
                { key: "all", label: "All Status" },
                { key: "draft", label: "Draft" },
                { key: "sent", label: "Sent" },
                { key: "paid", label: "Paid" },
                { key: "overdue", label: "Overdue" },
              ],
              selected: statusFilter,
              onSelect: (key) => setStatusFilter(key as InvoiceStatus | "all"),
            },
            {
              key: "type",
              options: [
                { key: "all", label: "All Types" },
                { key: "one-time", label: "One-Time" },
                { key: "recurring", label: "Recurring" },
              ],
              selected: typeFilter,
              onSelect: (key) => setTypeFilter(key as "all" | "one-time" | "recurring"),
            },
          ]}
        />

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
                }}
              >
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't received any invoices yet"}
              </Text>
            </View>
          ) : (
            filteredInvoices.map((invoice) => {
              const statusColors = getStatusColor(invoice.status);
              return (
                <TouchableOpacity
                  key={invoice.id}
                  onPress={() => router.push(`/pages/invoices/${invoice.id}`)}
                  style={{
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.lg,
                            fontWeight: typography.fontWeight.bold,
                            color: colors.text.primary,
                          }}
                        >
                          {invoice.invoiceNumber}
                        </Text>
                        {invoice.billingType === "recurring" && (
                          <MaterialIcons name="repeat" size={16} color={colors.accent} />
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          color: colors.text.secondary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        From: {invoice.issuerName}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.tertiary,
                        }}
                      >
                        Due: {formatDate(invoice.dueDate)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <View
                        style={{
                          backgroundColor: statusColors.bg,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,
                          borderRadius: borderRadius.sm,
                          marginBottom: spacing.xs,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: statusColors.text,
                            textTransform: "uppercase",
                          }}
                        >
                          {invoice.status}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xl,
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
                    </View>
                  </View>
                  {invoice.recurringSettings && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        marginTop: spacing.sm,
                        paddingTop: spacing.sm,
                        borderTopWidth: 1,
                        borderTopColor: colors.border.light,
                      }}
                    >
                      <MaterialIcons name="schedule" size={16} color={colors.text.tertiary} />
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.tertiary,
                        }}
                      >
                        {invoice.recurringSettings.frequency.charAt(0).toUpperCase() + invoice.recurringSettings.frequency.slice(1)} billing
                        {" • "}
                        Next: {formatDate(invoice.recurringSettings.nextBillingDate)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

