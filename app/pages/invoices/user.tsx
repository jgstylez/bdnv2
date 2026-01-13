/**
 * User Invoices Page
 * 
 * Displays invoices the user has received (as recipient)
 * Users can view and pay invoices, but cannot create/edit them
 */

import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { HeroSection } from "@/components/layouts/HeroSection";
import { FilterDropdown } from "@/components/admin/FilterDropdown";
import { OptimizedScrollView } from "@/components/optimized/OptimizedScrollView";
import { formatCurrency } from "@/lib/international";

// Mock invoices - in production, fetch from API where recipientId matches current user
const mockUserInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2024-001",
    issuerId: "business-1",
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
        description: "Catering Services for Corporate Event",
        quantity: 1,
        unitPrice: 150.00,
        tax: 12.00,
        total: 162.00,
      },
    ],
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-03-02T00:00:00Z",
    paymentTerms: "Net 30",
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
    issuerId: "business-2",
    issuerType: "business",
    issuerName: "Black Business Network Services",
    recipientId: "user-1",
    recipientName: "John Doe",
    recipientEmail: "john@example.com",
    billingType: "one-time",
    status: "overdue",
    currency: "USD",
    subtotal: 75.00,
    tax: 6.00,
    discount: 0,
    total: 81.00,
    amountPaid: 0,
    amountDue: 81.00,
    lineItems: [
      {
        id: "1",
        description: "Consultation Services",
        quantity: 2,
        unitPrice: 37.50,
        tax: 6.00,
        total: 81.00,
      },
    ],
    issueDate: "2024-01-15T00:00:00Z",
    dueDate: "2024-02-14T00:00:00Z",
    paymentTerms: "Net 30",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

export default function UserInvoicesPage() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = useMemo(() => {
    return mockUserInvoices.filter((invoice) => {
      // Status filter
      if (statusFilter !== "all" && invoice.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.issuerName.toLowerCase().includes(query) ||
          invoice.lineItems.some((item) => item.description.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [statusFilter, searchQuery]);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return { bg: "rgba(76, 175, 80, 0.2)", text: "#4caf50" };
      case "sent":
        return { bg: "rgba(33, 150, 243, 0.2)", text: "#2196f3" };
      case "overdue":
        return { bg: "rgba(244, 67, 54, 0.2)", text: "#f44336" };
      case "draft":
        return { bg: "rgba(255, 255, 255, 0.1)", text: "rgba(255, 255, 255, 0.6)" };
      case "cancelled":
        return { bg: "rgba(255, 255, 255, 0.1)", text: "rgba(255, 255, 255, 0.4)" };
      default:
        return { bg: "rgba(255, 255, 255, 0.1)", text: "rgba(255, 255, 255, 0.6)" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePayInvoice = (invoiceId: string) => {
    router.push(`/pages/payments/invoice?invoiceId=${invoiceId}`);
  };

  const totalDue = mockUserInvoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amountDue, 0);

  const totalPaid = mockUserInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amountPaid, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? spacing.lg : spacing.xl,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <HeroSection
          title="Invoices"
          subtitle="View and pay invoices you've received"
        />

        {/* Summary Cards */}
        <View
          style={{
            flexDirection: "row",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: 8,
              }}
            >
              Amount Due
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#f44336",
              }}
            >
              {formatCurrency(totalDue, "USD")}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: 8,
              }}
            >
              Total Paid
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              {formatCurrency(totalPaid, "USD")}
            </Text>
          </View>
        </View>

        {/* Filters */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 12,
            }}
          >
            <FilterDropdown
              label="Status"
              options={[
                { value: "all", label: "All Status" },
                { value: "sent", label: "Pending" },
                { value: "paid", label: "Paid" },
                { value: "overdue", label: "Overdue" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={statusFilter}
              onSelect={(value) => setStatusFilter((value === "all" ? "all" : value) as InvoiceStatus | "all")}
            />
          </View>
        </View>

        {/* Invoices List */}
        {filteredInvoices.length > 0 ? (
          <View style={{ gap: 12 }}>
            {filteredInvoices.map((invoice) => {
              const statusColors = getStatusColor(invoice.status);
              const isOverdue = invoice.status === "overdue";
              const canPay = invoice.status === "sent" || invoice.status === "overdue";

              return (
                <TouchableOpacity
                  key={invoice.id}
                  onPress={() => router.push(`/pages/invoices/${invoice.id}`)}
                  style={{
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.lg,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: isOverdue ? "#f44336" : colors.border.light,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: "600",
                          color: colors.text.primary,
                          marginBottom: 4,
                        }}
                      >
                        {invoice.invoiceNumber}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: 4,
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
                          borderRadius: borderRadius.sm,
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: "600",
                            color: statusColors.text,
                            textTransform: "uppercase",
                          }}
                        >
                          {invoice.status}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: "700",
                          color: colors.text.primary,
                        }}
                      >
                        {formatCurrency(invoice.total, invoice.currency)}
                      </Text>
                      {invoice.amountDue > 0 && (
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                            marginTop: 4,
                          }}
                        >
                          Due: {formatCurrency(invoice.amountDue, invoice.currency)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Line Items Preview */}
                  <View style={{ marginBottom: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border.light }}>
                    {invoice.lineItems.slice(0, 2).map((item) => (
                      <Text
                        key={item.id}
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          marginBottom: 4,
                        }}
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    ))}
                    {invoice.lineItems.length > 2 && (
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.tertiary,
                        }}
                      >
                        +{invoice.lineItems.length - 2} more items
                      </Text>
                    )}
                  </View>

                  {/* Actions */}
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pages/invoices/${invoice.id}`)}
                      style={{
                        flex: 1,
                        backgroundColor: colors.primary.bg,
                        borderRadius: borderRadius.md,
                        paddingVertical: 12,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.border.light,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: "600",
                          color: colors.text.primary,
                        }}
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>
                    {canPay && (
                      <TouchableOpacity
                        onPress={() => handlePayInvoice(invoice.id)}
                        style={{
                          flex: 1,
                          backgroundColor: colors.accent,
                          borderRadius: borderRadius.md,
                          paddingVertical: 12,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            fontWeight: "600",
                            color: "#ffffff",
                          }}
                        >
                          Pay Now
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="receipt" size={48} color={colors.accent} style={{ opacity: 0.5, marginBottom: 16 }} />
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: 8,
              }}
            >
              No Invoices Found
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
                textAlign: "center",
              }}
            >
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters to see more invoices"
                : "You don't have any invoices yet"}
            </Text>
          </View>
        )}
      </OptimizedScrollView>
    </View>
  );
}
