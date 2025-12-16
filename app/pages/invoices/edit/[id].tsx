import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice, InvoiceLineItem, BillingType, RecurringFrequency } from "../../../../types/invoices";
import { useResponsive } from "../../../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../../../constants/theme";
import { HeroSection } from "../../../../components/layouts/HeroSection";
import { FormInput, FormTextArea, FormSelect, FormToggle, DateTimePickerComponent } from "../../../../components/forms";
import { FilterDropdown } from "../../../../components/admin/FilterDropdown";
import { BackButton } from "../../../../components/navigation/BackButton";

// Mock fetching function - replace with actual API call
const fetchInvoiceById = async (id: string): Promise<Invoice | null> => {
  console.log(`Fetching invoice with ID: ${id}`);
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
  };
  
  return mockInvoices[id] || null;
};


export default function EditInvoice() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const [billingType, setBillingType] = useState<BillingType>("one-time");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Immediately");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("monthly");
  const [recurringStartDate, setRecurringStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [billingCycleCount, setBillingCycleCount] = useState("");

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);

  useEffect(() => {
    if (id) {
      const loadInvoice = async () => {
        setLoading(true);
        const fetchedInvoice = await fetchInvoiceById(id);
        if (fetchedInvoice) {
          setInvoice(fetchedInvoice);
          // Populate state from fetched invoice
          setBillingType(fetchedInvoice.billingType);
          setRecipientName(fetchedInvoice.recipientName);
          setRecipientEmail(fetchedInvoice.recipientEmail);
          setIssueDate(fetchedInvoice.issueDate.split("T")[0]);
          setDueDate(fetchedInvoice.dueDate.split("T")[0]);
          setPaymentTerms(fetchedInvoice.paymentTerms || "Immediately");
          setNotes(fetchedInvoice.notes || "");
          setTerms(fetchedInvoice.terms || "");
          setLineItems(fetchedInvoice.lineItems);

          if (fetchedInvoice.billingType === "recurring" && fetchedInvoice.recurringSettings) {
            setRecurringFrequency(fetchedInvoice.recurringSettings.frequency);
            setRecurringStartDate(fetchedInvoice.recurringSettings.startDate.split("T")[0]);
            // Optional fields
            setRecurringEndDate(fetchedInvoice.recurringSettings.endDate?.split("T")[0] || "");
            setBillingCycleCount(fetchedInvoice.recurringSettings.cycleCount?.toString() || "");
          }

        } else {
          // Handle case where invoice is not found
          alert("Invoice not found.");
          router.back();
        }
        setLoading(false);
      };
      loadInvoice();
    }
  }, [id]);

  // ... (rest of the component logic: updateLineItem, addLineItem, etc.)

  const handleUpdateInvoice = () => {
    // TODO: Validate and send updated invoice data to API
    alert("Invoice updated successfully!");
    router.push(`/pages/invoices/${id}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.text.primary, marginTop: spacing.md }}>Loading Invoice...</Text>
      </View>
    );
  }

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
        <BackButton label="Back to Invoice" onPress={() => router.back()} />

        <HeroSection
          title="Edit Invoice"
          subtitle={`Editing Invoice: ${invoice?.invoiceNumber}`}
        />
        
        {/* Form fields are pre-populated from state */}
        {/* ... (rest of the form) */}
        
        <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: colors.secondary.bg,
              borderWidth: 1,
              borderColor: colors.border.light,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdateInvoice}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: colors.accent,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
