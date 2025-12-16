import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice } from "../../../types/invoices";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../../constants/theme";
import { HeroSection } from "../../../components/layouts/HeroSection";

// Mock invoice data - in production, fetch by ID
const mockInvoices: Record<string, Invoice> = {
  "inv-1": {
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
  "inv-2": {
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
};

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();

  const invoice = mockInvoices[id || "inv-1"] || mockInvoices["inv-1"];

  const getStatusColor = (status: Invoice["status"]) => {
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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePayInvoice = () => {
    // TODO: Navigate to payment page
    router.push(`/pages/payments/invoice?invoiceId=${invoice.id}`);
  };

  const handleDownloadPDF = () => {
    // TODO: Generate and download PDF
    alert("PDF download functionality coming soon!");
  };

  const statusColors = getStatusColor(invoice.status);

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
        {/* Header */}
        <View style={{ marginBottom: spacing.xl }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
                marginLeft: spacing.sm,
              }}
            >
              Back to Invoices
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: isMobile ? typography.fontSize["3xl"] : typography.fontSize["4xl"],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                {invoice.invoiceNumber}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" }}>
                <View
                  style={{
                    backgroundColor: statusColors.bg,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: statusColors.text,
                      textTransform: "uppercase",
                    }}
                  >
                    {invoice.status}
                  </Text>
                </View>
                {invoice.billingType === "recurring" && (
                  <View
                    style={{
                      backgroundColor: colors.accentLight,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: borderRadius.sm,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.xs,
                    }}
                  >
                    <MaterialIcons name="repeat" size={14} color={colors.accent} />
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.accent,
                        textTransform: "capitalize",
                      }}
                    >
                      {invoice.recurringSettings?.frequency}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: typography.fontSize["2xl"],
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
                    marginTop: spacing.xs,
                  }}
                >
                  ${invoice.amountDue.toFixed(2)} due
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Invoice Info */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.xl, marginBottom: spacing.xl }}>
            {/* Issuer Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.secondary,
                  marginBottom: spacing.sm,
                }}
              >
                From
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                {invoice.issuerName}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                {invoice.issuerType === "business" ? "Business" : "Nonprofit"}
              </Text>
            </View>

            {/* Recipient Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.secondary,
                  marginBottom: spacing.sm,
                }}
              >
                To
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                {invoice.recipientName}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                {invoice.recipientEmail}
              </Text>
            </View>
          </View>

          {/* Dates */}
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.xl, marginBottom: spacing.xl }}>
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Issue Date
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              >
                {formatDate(invoice.issueDate)}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  marginBottom: spacing.xs,
                }}
              >
                Due Date
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: invoice.status === "overdue" ? colors.status.error : colors.text.primary,
                  fontWeight: invoice.status === "overdue" ? typography.fontWeight.bold : typography.fontWeight.normal,
                }}
              >
                {formatDate(invoice.dueDate)}
              </Text>
            </View>
            {invoice.paymentTerms && (
              <View>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Payment Terms
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.primary,
                  }}
                >
                  {invoice.paymentTerms}
                </Text>
              </View>
            )}
          </View>

          {/* Recurring Info */}
          {invoice.recurringSettings && (
            <View
              style={{
                padding: spacing.md,
                backgroundColor: colors.accentLight,
                borderRadius: borderRadius.md,
                marginBottom: spacing.xl,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                <MaterialIcons name="repeat" size={20} color={colors.accent} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.accent,
                  }}
                >
                  Recurring Invoice
                </Text>
              </View>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                {invoice.recurringSettings.frequency.charAt(0).toUpperCase() + invoice.recurringSettings.frequency.slice(1)} billing
                {" • "}
                Cycle {invoice.recurringSettings.currentCycle}
                {" • "}
                Next billing: {formatDate(invoice.recurringSettings.nextBillingDate)}
              </Text>
            </View>
          )}

          {/* Line Items */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Line Items
            </Text>
            <View style={{ gap: spacing.sm }}>
              {invoice.lineItems.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: spacing.sm,
                    borderBottomWidth: index < invoice.lineItems.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border.light,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {item.description}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                      }}
                    >
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                      {item.tax && ` + $${item.tax.toFixed(2)} tax`}
                      {item.discount && ` - $${item.discount.toFixed(2)} discount`}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                  >
                    ${item.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View
            style={{
              paddingTop: spacing.md,
              borderTopWidth: 2,
              borderTopColor: colors.border.light,
            }}
          >
            <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Subtotal</Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>${invoice.subtotal.toFixed(2)}</Text>
              </View>
              {invoice.tax > 0 && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Tax</Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>${invoice.tax.toFixed(2)}</Text>
                </View>
              )}
              {invoice.discount > 0 && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Discount</Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>-${invoice.discount.toFixed(2)}</Text>
                </View>
              )}
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border.light,
                  marginVertical: spacing.sm,
                }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.accent,
                  }}
                >
                  ${invoice.total.toFixed(2)}
                </Text>
              </View>
              {invoice.amountPaid > 0 && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Amount Paid</Text>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.status.success }}>${invoice.amountPaid.toFixed(2)}</Text>
                </View>
              )}
              {invoice.amountDue > 0 && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Amount Due</Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      color: invoice.status === "overdue" ? colors.status.error : colors.accent,
                      fontWeight: typography.fontWeight.bold,
                    }}
                  >
                    ${invoice.amountDue.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Notes & Terms */}
          {invoice.notes && (
            <View style={{ marginTop: spacing.xl, paddingTop: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border.light }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.secondary,
                  marginBottom: spacing.sm,
                }}
              >
                Notes
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {invoice.notes}
              </Text>
            </View>
          )}

          {invoice.terms && (
            <View style={{ marginTop: spacing.lg }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.secondary,
                  marginBottom: spacing.sm,
                }}
              >
                Terms & Conditions
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {invoice.terms}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {invoice.status !== "paid" && invoice.status !== "cancelled" && invoice.amountDue > 0 && (
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.md }}>
            <TouchableOpacity
              onPress={handlePayInvoice}
              style={{
                flex: 1,
                backgroundColor: colors.accent,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Pay Invoice
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDownloadPDF}
              style={{
                flex: 1,
                backgroundColor: colors.secondary.bg,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                Download PDF
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

