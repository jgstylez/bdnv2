import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice, InvoiceLineItem, BillingType, RecurringFrequency } from "../../../types/invoices";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../../constants/theme";
import { HeroSection } from "../../../components/layouts/HeroSection";
import { FormInput, FormTextArea, FormSelect, FormToggle, DateTimePickerComponent } from "../../../components/forms";
import { FilterDropdown } from "../../../components/admin/FilterDropdown";
import { BackButton } from "../../../components/navigation/BackButton";

export default function CreateInvoice() {
  const router = useRouter();
  const { type, templateId } = useLocalSearchParams<{ type: string; templateId?: string }>();
  const { isMobile, paddingHorizontal } = useResponsive();
  const issuerType = type === "nonprofit" ? "nonprofit" : "business";
  
  // Load template if templateId is provided
  // TODO: Fetch template from API when templateId is provided
  const loadTemplate = (id: string) => {
    // Mock template loading - in production, fetch from API
    // For now, templates are loaded when the component mounts if templateId exists
  };
  
  React.useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
      // TODO: Populate form fields with template data
    }
  }, [templateId]);

  const [billingType, setBillingType] = useState<BillingType>("one-time");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default 30 days
    return date.toISOString().split("T")[0];
  });
  const [paymentTerms, setPaymentTerms] = useState("Immediately");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  // Recurring Settings
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("monthly");
  const [recurringStartDate, setRecurringStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [billingCycleCount, setBillingCycleCount] = useState("");

  // Line Items
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate total
          const subtotal = updated.quantity * updated.unitPrice;
          const discountAmount = updated.discount || 0;
          const taxAmount = updated.tax || 0;
          updated.total = subtotal - discountAmount + taxAmount;
          return updated;
        }
        return item;
      })
    );
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = lineItems.reduce((sum, item) => sum + (item.tax || 0), 0);
    const discount = lineItems.reduce((sum, item) => sum + (item.discount || 0), 0);
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  };

  const { subtotal, tax, discount, total } = calculateTotals();

  const handleSaveDraft = () => {
    // TODO: Save as draft
    alert("Invoice saved as draft!");
  };

  const handleSendInvoice = () => {
    // TODO: Validate and send invoice
    if (!recipientEmail || !recipientName) {
      alert("Please fill in recipient details");
      return;
    }
    if (lineItems.some((item) => !item.description || item.unitPrice <= 0)) {
      alert("Please fill in all line items with valid amounts");
      return;
    }
    alert("Invoice sent!");
    router.back();
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
        {/* Back Button */}
        <BackButton label="Back to Invoices" onPress={() => router.back()} />

        {/* Hero Section */}
        <HeroSection
          title="Create Invoice"
          subtitle={`Create a new ${billingType === "recurring" ? "recurring" : "one-time"} invoice`}
        />

        {/* Billing Type Selection */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Billing Type
          </Text>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <TouchableOpacity
              onPress={() => setBillingType("one-time")}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: billingType === "one-time" ? colors.accent : colors.secondary.bg,
                borderWidth: 1,
                borderColor: billingType === "one-time" ? colors.accent : colors.border.light,
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="receipt"
                size={24}
                color={billingType === "one-time" ? colors.text.primary : colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: billingType === "one-time" ? colors.text.primary : colors.text.secondary,
                  marginTop: spacing.xs,
                }}
              >
                One-Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBillingType("recurring")}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: billingType === "recurring" ? colors.accent : colors.secondary.bg,
                borderWidth: 1,
                borderColor: billingType === "recurring" ? colors.accent : colors.border.light,
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="repeat"
                size={24}
                color={billingType === "recurring" ? colors.text.primary : colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: billingType === "recurring" ? colors.text.primary : colors.text.secondary,
                  marginTop: spacing.xs,
                }}
              >
                Recurring
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipient Information */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Recipient Information
          </Text>
          <FormInput
            label="Recipient Name"
            value={recipientName}
            onChangeText={setRecipientName}
            required
            placeholder="Enter recipient name"
          />
          <FormInput
            label="Recipient Email"
            value={recipientEmail}
            onChangeText={setRecipientEmail}
            required
            placeholder="recipient@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Invoice Details */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Invoice Details
          </Text>
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <DateTimePickerComponent
                label="Issue Date"
                value={issueDate}
                onChange={setIssueDate}
                mode="date"
                required
                placeholder="Select issue date"
              />
            </View>
            <View style={{ flex: 1 }}>
              <DateTimePickerComponent
                label="Due Date"
                value={dueDate}
                onChange={setDueDate}
                mode="date"
                required
                placeholder="Select due date"
                minimumDate={issueDate || undefined}
              />
            </View>
          </View>
          <FilterDropdown
            label="Payment Terms"
            value={paymentTerms}
            onSelect={setPaymentTerms}
            options={[
              { value: "Immediately", label: "Immediately" },
              { value: "Due on receipt", label: "Due on receipt" },
              { value: "Net 15", label: "Net 15" },
              { value: "Net 30", label: "Net 30" },
              { value: "Net 45", label: "Net 45" },
              { value: "Net 60", label: "Net 60" },
            ]}
            placeholder="Select payment terms"
          />
        </View>

        {/* Recurring Settings */}
        {billingType === "recurring" && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Recurring Settings
            </Text>
            <FormSelect
              label="Frequency"
              value={recurringFrequency}
              onValueChange={(value) => setRecurringFrequency(value as RecurringFrequency)}
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
                { value: "yearly", label: "Yearly" },
              ]}
              required
            />
            <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <DateTimePickerComponent
                  label="Start Date"
                  value={recurringStartDate}
                  onChange={setRecurringStartDate}
                  mode="date"
                  required
                  placeholder="Select start date"
                />
              </View>
              <View style={{ flex: 1 }}>
                <DateTimePickerComponent
                  label="End Date (Optional)"
                  value={recurringEndDate}
                  onChange={setRecurringEndDate}
                  mode="date"
                  placeholder="Select end date"
                  helperText="Leave empty for indefinite"
                  minimumDate={recurringStartDate || undefined}
                />
              </View>
            </View>
            <FormInput
              label="Number of Cycles (Optional)"
              value={billingCycleCount}
              onChangeText={setBillingCycleCount}
              placeholder="e.g., 12"
              keyboardType="numeric"
              helperText="Leave empty for unlimited cycles"
            />
          </View>
        )}

        {/* Line Items */}
        <View style={{ marginBottom: spacing.xl }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Line Items
            </Text>
            <TouchableOpacity
              onPress={addLineItem}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                backgroundColor: colors.accent,
                borderRadius: borderRadius.md,
              }}
            >
              <MaterialIcons name="add" size={18} color={colors.text.primary} />
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                Add Item
              </Text>
            </TouchableOpacity>
          </View>

          {lineItems.map((item, index) => (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Item {index + 1}
                </Text>
                {lineItems.length > 1 && (
                  <TouchableOpacity onPress={() => removeLineItem(item.id)}>
                    <MaterialIcons name="delete" size={20} color={colors.status.error} />
                  </TouchableOpacity>
                )}
              </View>

              <FormInput
                label="Description"
                value={item.description}
                onChangeText={(value) => updateLineItem(item.id, "description", value)}
                required
                placeholder="Item description"
              />

              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Quantity"
                    value={item.quantity.toString()}
                    onChangeText={(value) => updateLineItem(item.id, "quantity", parseFloat(value) || 0)}
                    required
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Unit Price"
                    value={item.unitPrice.toString()}
                    onChangeText={(value) => updateLineItem(item.id, "unitPrice", parseFloat(value) || 0)}
                    required
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Tax"
                    value={(item.tax || 0).toString()}
                    onChangeText={(value) => updateLineItem(item.id, "tax", parseFloat(value) || 0)}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Discount"
                    value={(item.discount || 0).toString()}
                    onChangeText={(value) => updateLineItem(item.id, "discount", parseFloat(value) || 0)}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: spacing.sm,
                  paddingTop: spacing.sm,
                  borderTopWidth: 1,
                  borderTopColor: colors.border.light,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.accent,
                    textAlign: "right",
                  }}
                >
                  Total: ${item.total.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
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
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Summary
          </Text>
          <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Subtotal</Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>${subtotal.toFixed(2)}</Text>
            </View>
            {tax > 0 && (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Tax</Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>${tax.toFixed(2)}</Text>
              </View>
            )}
            {discount > 0 && (
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>Discount</Text>
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>-${discount.toFixed(2)}</Text>
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
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes & Terms */}
        <View style={{ marginBottom: spacing.xl }}>
          <FormTextArea
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes for the recipient"
            rows={4}
          />
          <FormTextArea
            label="Terms & Conditions (Optional)"
            value={terms}
            onChangeText={setTerms}
            placeholder="Payment terms and conditions"
            rows={4}
          />
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.md }}>
          <TouchableOpacity
            onPress={handleSaveDraft}
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
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Save as Draft
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendInvoice}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: colors.accent,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Send Invoice
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

