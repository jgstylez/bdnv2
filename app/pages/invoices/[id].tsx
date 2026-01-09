import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice } from '@/types/invoices';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

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

  // This page is for recipients viewing invoices they've received
  // Users cannot create/edit/delete invoices from this page
  const isRecipient = true; 

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
    router.push(`/pages/payments/invoice?invoiceId=${invoice.id}`);
  };

  const handleDownloadPDF = () => {
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
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
            
            {/* Download PDF option available for recipients */}
            <TouchableOpacity onPress={handleDownloadPDF} style={{ padding: spacing.xs }}>
              <MaterialIcons name="download" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>

          {/* ... rest of the component ... */}
        </View>
      </ScrollView>
    </View>
  );
}
