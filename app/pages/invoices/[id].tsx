import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice } from '@/types/invoices';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { formatCurrency } from '@/lib/international';
import { BusinessPlaceholder } from '@/components/BusinessPlaceholder';
import { OptimizedScrollView } from '@/components/optimized/OptimizedScrollView';

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
  "inv-3": {
    id: "inv-3",
    invoiceNumber: "INV-2024-003",
    issuerId: "merchant-2",
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
};

export default function InvoiceDetail() {
  const router = useRouter();
  const { id, view } = useLocalSearchParams<{ id: string; view?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();

  // Determine if viewing as recipient (default) or issuer (business/nonprofit managing invoice)
  // view=issuer means the business/nonprofit is viewing their own invoice
  const isRecipient = view !== "issuer"; 

  // Get invoice - use fallback if not found (shouldn't happen in production)
  const invoice = id ? (mockInvoices[id] || mockInvoices["inv-1"]) : mockInvoices["inv-1"];

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

  const handleEditInvoice = () => {
    if (!invoice) return;
    const entityType = invoice.issuerType === "nonprofit" ? "nonprofit" : "business";
    router.push(`/pages/invoices/create?id=${invoice.id}&type=${entityType}`);
  };

  const handleSendInvoice = () => {
    // TODO: Send/resend invoice via API
    Alert.alert("Success", "Invoice sent successfully!");
  };

  const handleDeleteInvoice = () => {
    Alert.alert(
      "Delete Invoice",
      "Are you sure you want to delete this invoice? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Delete invoice via API
            Alert.alert("Success", "Invoice deleted successfully!");
            router.back();
          },
        },
      ]
    );
  };

  const statusColors = getStatusColor(invoice.status);
  const canPay = invoice.status === "sent" || invoice.status === "overdue";
  const isOverdue = invoice.status === "overdue";
  const canEdit = invoice.status === "draft";
  const canSend = invoice.status === "draft" || invoice.status === "sent";

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
          {/* Header */}
        <View style={{ marginBottom: isMobile ? spacing.lg : spacing.xl }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: spacing.lg,
            flexWrap: 'wrap',
            gap: spacing.sm,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: isMobile ? 1 : 0,
                minWidth: isMobile ? undefined : 150,
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="arrow-back" size={isMobile ? 20 : 24} color={colors.text.primary} />
              {!isMobile && (
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.primary,
                    marginLeft: spacing.sm,
                  }}
                >
                  {isRecipient ? "Back to Invoices" : "Back to Invoice Management"}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Download PDF option available for recipients */}
            <TouchableOpacity 
              onPress={handleDownloadPDF} 
              style={{ 
                padding: spacing.sm,
                minWidth: 44,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="download" size={isMobile ? 20 : 24} color={colors.accent} />
            </TouchableOpacity>
          </View>

          {/* Invoice Header */}
          <View style={{ 
            backgroundColor: colors.secondary.bg, 
            borderRadius: borderRadius.lg, 
            padding: isMobile ? spacing.lg : spacing.xl,
            borderWidth: 1,
            borderColor: isOverdue ? colors.status.error : colors.border.light,
            marginBottom: isMobile ? spacing.lg : spacing.xl,
          }}>
            <View style={{ 
              flexDirection: isMobile ? 'column' : 'row', 
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'flex-start',
              gap: isMobile ? spacing.md : 0,
            }}>
              <View style={{ flex: 1, width: isMobile ? '100%' : undefined }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Invoice Number
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? typography.fontSize.xl : typography.fontSize["2xl"],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={isMobile}
                >
                  {invoice.invoiceNumber}
                </Text>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: statusColors.bg,
                    borderRadius: borderRadius.sm,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
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
              </View>
              <View style={{ 
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                width: isMobile ? '100%' : undefined,
                marginTop: isMobile ? spacing.md : 0,
              }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Total Amount
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {formatCurrency(invoice.total, invoice.currency)}
                </Text>
                {invoice.amountDue > 0 && (
                  <Text
                    style={{
                      fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                      color: isOverdue ? colors.status.error : colors.accent,
                      marginTop: spacing.xs,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    {formatCurrency(invoice.amountDue, invoice.currency)} due
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Issuer & Recipient Info */}
          <View style={{ 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: isMobile ? spacing.md : spacing.lg, 
            marginBottom: isMobile ? spacing.lg : spacing.xl 
          }}>
            {/* Issuer Card */}
            <View style={{ 
              flex: 1, 
              backgroundColor: colors.secondary.bg, 
              borderRadius: borderRadius.lg, 
              padding: isMobile ? spacing.md : spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <BusinessPlaceholder width={isMobile ? 40 : 48} height={isMobile ? 40 : 48} aspectRatio={1} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.text.secondary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    From
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                    }}
                    numberOfLines={2}
                  >
                    {invoice.issuerName}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.text.tertiary,
                      marginTop: spacing.xs,
                      textTransform: 'capitalize',
                    }}
                  >
                    {invoice.issuerType}
                  </Text>
                </View>
              </View>
            </View>

            {/* Recipient Card */}
            <View style={{ 
              flex: 1, 
              backgroundColor: colors.secondary.bg, 
              borderRadius: borderRadius.lg, 
              padding: isMobile ? spacing.md : spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}>
              <View>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Bill To
                </Text>
                <Text
                  style={{
                    fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                  numberOfLines={1}
                >
                  {invoice.recipientName}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.text.secondary,
                  }}
                  numberOfLines={1}
                >
                  {invoice.recipientEmail}
                </Text>
              </View>
            </View>
          </View>

          {/* Dates & Payment Terms */}
          <View style={{ 
            backgroundColor: colors.secondary.bg, 
            borderRadius: borderRadius.lg, 
            padding: isMobile ? spacing.md : spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: isMobile ? spacing.lg : spacing.xl,
          }}>
            <View style={{ 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: isMobile ? spacing.md : spacing.lg,
            }}>
              <View style={{ flex: 1 }}>
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
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  {formatDate(invoice.issueDate)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
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
                    fontWeight: typography.fontWeight.semibold,
                    color: isOverdue ? colors.status.error : colors.text.primary,
                  }}
                >
                  {formatDate(invoice.dueDate)}
                </Text>
              </View>
              {invoice.paidAt && (
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Paid Date
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.status.success,
                    }}
                  >
                    {formatDate(invoice.paidAt)}
                  </Text>
                </View>
              )}
              {invoice.paymentTerms && (
                <View style={{ flex: 1 }}>
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
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    {invoice.paymentTerms}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Recurring Settings */}
          {invoice.recurringSettings && (
            <View style={{ 
              backgroundColor: colors.secondary.bg, 
              borderRadius: borderRadius.lg, 
              padding: isMobile ? spacing.md : spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              marginBottom: isMobile ? spacing.lg : spacing.xl,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                <MaterialIcons name="repeat" size={20} color={colors.accent} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.text.primary,
                  }}
                >
                  Recurring Invoice
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Frequency
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary, textTransform: 'capitalize' }}>
                    {invoice.recurringSettings.frequency}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Current Cycle
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                    {invoice.recurringSettings.currentCycle}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Next Billing Date
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                    {formatDate(invoice.recurringSettings.nextBillingDate)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Line Items */}
          <View style={{ 
            backgroundColor: colors.secondary.bg, 
            borderRadius: borderRadius.lg, 
            padding: isMobile ? spacing.md : spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: isMobile ? spacing.lg : spacing.xl,
          }}>
            <Text
              style={{
                fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Line Items
            </Text>
            <View style={{ gap: spacing.md }}>
              {invoice.lineItems.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    paddingBottom: index < invoice.lineItems.length - 1 ? spacing.md : 0,
                    borderBottomWidth: index < invoice.lineItems.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border.light,
                  }}
                >
                  <View style={{ 
                    flexDirection: isMobile ? 'column' : 'row', 
                    justifyContent: 'space-between', 
                    marginBottom: spacing.xs,
                    gap: isMobile ? spacing.xs : 0,
                  }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        style={{
                          fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                        numberOfLines={isMobile ? 2 : undefined}
                      >
                        {item.description}
                      </Text>
                      <View style={{ 
                        flexDirection: isMobile ? 'column' : 'row', 
                        gap: isMobile ? spacing.xs : spacing.md,
                        flexWrap: 'wrap',
                      }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.secondary,
                          }}
                        >
                          Qty: {item.quantity}
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.secondary,
                          }}
                        >
                          @ {formatCurrency(item.unitPrice, invoice.currency)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.text.primary,
                        alignSelf: isMobile ? 'flex-start' : 'flex-end',
                      }}
                    >
                      {formatCurrency(item.total, invoice.currency)}
                    </Text>
                  </View>
                  {item.tax && item.tax > 0 && (
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.tertiary,
                        marginTop: spacing.xs,
                      }}
                    >
                      Tax: {formatCurrency(item.tax, invoice.currency)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Amount Breakdown */}
          <View style={{ 
            backgroundColor: colors.secondary.bg, 
            borderRadius: borderRadius.lg, 
            padding: isMobile ? spacing.md : spacing.lg,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: isMobile ? spacing.lg : spacing.xl,
          }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Amount Summary
            </Text>
            <View style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Subtotal
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </Text>
              </View>
              {invoice.tax > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Tax
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                    {formatCurrency(invoice.tax, invoice.currency)}
                  </Text>
                </View>
              )}
              {invoice.discount > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Discount
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                    -{formatCurrency(invoice.discount, invoice.currency)}
                  </Text>
                </View>
              )}
              <View style={{ height: 1, backgroundColor: colors.border.light, marginVertical: spacing.sm }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                  Total
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                  {formatCurrency(invoice.total, invoice.currency)}
                </Text>
              </View>
              {invoice.amountPaid > 0 && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Amount Paid
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                      Amount Due
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: invoice.amountDue > 0 ? (isOverdue ? colors.status.error : colors.accent) : colors.status.success }}>
                      {formatCurrency(invoice.amountDue, invoice.currency)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <View style={{ 
              backgroundColor: colors.secondary.bg, 
              borderRadius: borderRadius.lg, 
              padding: isMobile ? spacing.md : spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              marginBottom: isMobile ? spacing.lg : spacing.xl,
            }}>
              {invoice.notes && (
                <View style={{ marginBottom: invoice.terms ? spacing.lg : 0 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                      marginBottom: spacing.sm,
                    }}
                  >
                    Notes
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    {invoice.notes}
                  </Text>
                </View>
              )}
              {invoice.terms && (
                <View>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                      marginBottom: spacing.sm,
                    }}
                  >
                    Terms & Conditions
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    {invoice.terms}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <View style={{ 
              backgroundColor: colors.secondary.bg, 
              borderRadius: borderRadius.lg, 
              padding: isMobile ? spacing.md : spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              marginBottom: isMobile ? spacing.lg : spacing.xl,
            }}>
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginBottom: spacing.md,
                }}
              >
                Payment History
              </Text>
              <View style={{ gap: spacing.md }}>
                {invoice.payments.map((payment) => (
                  <View
                    key={payment.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: spacing.sm,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.light,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {formatCurrency(payment.amount, payment.currency)}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.secondary,
                        }}
                      >
                        {formatDate(payment.paidAt)} • {payment.paymentMethod}
                      </Text>
                      {payment.transactionId && (
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                            marginTop: spacing.xs,
                          }}
                        >
                          Transaction: {payment.transactionId}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        backgroundColor: payment.status === 'completed' ? colors.status.successLight : colors.status.infoLight,
                        borderRadius: borderRadius.sm,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          color: payment.status === 'completed' ? colors.status.success : colors.status.info,
                          textTransform: 'capitalize',
                        }}
                      >
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: isMobile ? spacing.md : spacing.md, 
            marginTop: spacing.lg 
          }}>
            {isRecipient ? (
              <>
                {/* Recipient Actions */}
                {canPay && (
                  <TouchableOpacity
                    onPress={handlePayInvoice}
                    style={{
                      flex: isMobile ? 0 : 1,
                      backgroundColor: colors.accent,
                      borderRadius: borderRadius.md,
                      paddingVertical: spacing.md,
                      minHeight: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: spacing.sm,
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="payment" size={isMobile ? 18 : 20} color="#ffffff" />
                    <Text
                      style={{
                        fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: "#ffffff",
                      }}
                    >
                      Pay Now
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleDownloadPDF}
                  style={{
                    flex: isMobile ? 0 : (canPay ? 0 : 1),
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.md,
                    paddingHorizontal: isMobile ? 0 : (canPay ? spacing.lg : 0),
                    minHeight: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="download" size={isMobile ? 18 : 20} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Download PDF
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Issuer Actions */}
                {canEdit && (
                  <TouchableOpacity
                    onPress={handleEditInvoice}
                    style={{
                      flex: isMobile ? 0 : 1,
                      backgroundColor: colors.accent,
                      borderRadius: borderRadius.md,
                      paddingVertical: spacing.md,
                      minHeight: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: spacing.sm,
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="edit" size={isMobile ? 18 : 20} color={colors.text.primary} />
                    <Text
                      style={{
                        fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                      }}
                    >
                      Edit Invoice
                    </Text>
                  </TouchableOpacity>
                )}
                {canSend && (
                  <TouchableOpacity
                    onPress={handleSendInvoice}
                    style={{
                      flex: isMobile ? 0 : 1,
                      backgroundColor: invoice.status === "sent" ? colors.secondary.bg : colors.accent,
                      borderRadius: borderRadius.md,
                      paddingVertical: spacing.md,
                      minHeight: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: spacing.sm,
                      borderWidth: invoice.status === "sent" ? 1 : 0,
                      borderColor: invoice.status === "sent" ? colors.border.light : undefined,
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons 
                      name="send" 
                      size={isMobile ? 18 : 20} 
                      color={invoice.status === "sent" ? colors.accent : colors.text.primary} 
                    />
                    <Text
                      style={{
                        fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: invoice.status === "sent" ? colors.accent : colors.text.primary,
                      }}
                    >
                      {invoice.status === "sent" ? "Resend" : "Send Invoice"}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleDownloadPDF}
                  style={{
                    flex: isMobile ? 0 : 0,
                    backgroundColor: colors.secondary.bg,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    minHeight: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="download" size={isMobile ? 18 : 20} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.text.primary,
                    }}
                  >
                    Download PDF
                  </Text>
                </TouchableOpacity>
                {canEdit && (
                  <TouchableOpacity
                    onPress={handleDeleteInvoice}
                    style={{
                      flex: isMobile ? 0 : 0,
                      backgroundColor: colors.secondary.bg,
                      borderRadius: borderRadius.md,
                      paddingVertical: spacing.md,
                      paddingHorizontal: spacing.lg,
                      minHeight: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.status.error,
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="delete" size={isMobile ? 18 : 20} color={colors.status.error} />
                    <Text
                      style={{
                        fontSize: isMobile ? typography.fontSize.sm : typography.fontSize.base,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.status.error,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </OptimizedScrollView>
    </View>
  );
}
