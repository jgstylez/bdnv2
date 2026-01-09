import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Modal, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Invoice, InvoiceLineItem, BillingType, RecurringFrequency } from '@/types/invoices';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { FormInput, FormTextArea, FormSelect, FormToggle, DateTimePickerComponent } from '@/components/forms';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { BackButton } from '@/components/navigation/BackButton';

// Mock user data for recipient search
const mockUsers = [
  { id: "user-1", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "user-2", name: "Michael Johnson", email: "michael.j@example.com" },
  { id: "user-3", name: "Sarah Williams", email: "sarah.w@example.com" },
  { id: "user-4", name: "David Brown", email: "david.brown@example.com" },
];

export default function CreateInvoice() {
  const router = useRouter();
  const { type, templateId } = useLocalSearchParams<{ type: string; templateId?: string }>();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
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
  const [recipientUserId, setRecipientUserId] = useState<string | undefined>(undefined);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");
  const [recipientEmailInput, setRecipientEmailInput] = useState("");
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

  const filteredRecipientsForModal = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(recipientSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(recipientSearchQuery.toLowerCase())
  );

  const isValidEmail = recipientEmailInput.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmailInput.trim());

  const handleSelectRecipient = (userId: string, name: string, email: string) => {
    setRecipientUserId(userId);
    setRecipientName(name);
    setRecipientEmail(email);
    setRecipientSearchQuery("");
    setShowRecipientModal(false);
    setRecipientEmailInput("");
  };

  const handleAddEmailRecipient = () => {
    if (recipientEmailInput.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmailInput.trim())) {
      setRecipientUserId(undefined);
      setRecipientName("");
      setRecipientEmail(recipientEmailInput.trim());
      setRecipientSearchQuery("");
      setShowRecipientModal(false);
      setRecipientEmailInput("");
    }
  };

  const handleSaveDraft = () => {
    // TODO: Save as draft
    alert("Invoice saved as draft!");
  };

  const handleSendInvoice = () => {
    // TODO: Validate and send invoice
    if (!recipientUserId && !recipientEmail) {
      alert("Please select a recipient");
      return;
    }
    if (recipientUserId && !recipientName) {
      // Set recipient name from selected user
      const selectedUser = mockUsers.find((u) => u.id === recipientUserId);
      if (selectedUser) {
        setRecipientName(selectedUser.name);
        setRecipientEmail(selectedUser.email);
      }
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
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={Platform.OS === 'android'}
        bounces={Platform.OS !== 'web'}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
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
                color={billingType === "one-time" ? colors.textColors.onAccent : colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: billingType === "one-time" ? colors.textColors.onAccent : colors.text.secondary,
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
                color={billingType === "recurring" ? colors.textColors.onAccent : colors.text.secondary}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: billingType === "recurring" ? colors.textColors.onAccent : colors.text.secondary,
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
            Recipient
          </Text>
          {recipientUserId || recipientEmail ? (
            <View
              style={{
                backgroundColor: "rgba(71, 71, 71, 0.3)",
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <MaterialIcons name="person" size={40} color="rgba(255, 255, 255, 0.5)" />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 2,
                  }}
                >
                  {recipientUserId
                    ? mockUsers.find((u) => u.id === recipientUserId)?.name || recipientName
                    : recipientEmail || ""}
                </Text>
                {recipientUserId && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {mockUsers.find((u) => u.id === recipientUserId)?.email || recipientEmail}
                  </Text>
                )}
                {!recipientUserId && recipientEmail && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Email invitation
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setRecipientUserId(undefined);
                  setRecipientName("");
                  setRecipientEmail("");
                  setRecipientSearchQuery("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowRecipientModal(true)}
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <MaterialIcons name="person-add" size={24} color="rgba(255, 255, 255, 0.5)" />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Select recipient
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.5)",
                    marginTop: 2,
                  }}
                >
                  Tap to search users or add email
                </Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
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
              <MaterialIcons name="add" size={18} color={colors.textColors.onAccent} />
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textColors.onAccent,
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
                color: colors.textColors.onAccent,
              }}
            >
              Send Invoice
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Recipient Selection Modal */}
      <Modal
        visible={showRecipientModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowRecipientModal(false);
          setRecipientSearchQuery("");
          setRecipientEmailInput("");
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setShowRecipientModal(false);
            setRecipientSearchQuery("");
            setRecipientEmailInput("");
          }}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#474747",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: spacing.md,
              paddingBottom: Platform.OS === "ios" ? 40 : spacing.lg,
              maxHeight: Dimensions.get("window").height * 0.9,
              borderWidth: 2,
              borderColor: "#5a5a68",
              borderBottomWidth: 0,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Select Recipient
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowRecipientModal(false);
                  setRecipientSearchQuery("");
                  setRecipientEmailInput("");
                }}
                style={{ padding: 4 }}
              >
                <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
                <TextInput
                  placeholder="Search by name or email..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={recipientSearchQuery}
                  onChangeText={setRecipientSearchQuery}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: "#ffffff",
                  }}
                  autoFocus
                />
                {recipientSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setRecipientSearchQuery("")}
                    style={{ padding: 4 }}
                  >
                    <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Add Email Section */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
                gap: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Or send to email address
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <TextInput
                  placeholder="Enter email address..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={recipientEmailInput}
                  onChangeText={setRecipientEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: isValidEmail ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                />
                <TouchableOpacity
                  onPress={handleAddEmailRecipient}
                  disabled={!isValidEmail}
                  style={{
                    backgroundColor: isValidEmail ? "#ba9988" : "#474747",
                    borderRadius: 12,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isValidEmail ? 1 : 0.5,
                  }}
                >
                  <MaterialIcons name="add" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* User List */}
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredRecipientsForModal.length === 0 ? (
                <View
                  style={{
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="people-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 16,
                      textAlign: "center",
                    }}
                  >
                    No users found
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.4)",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Try a different search term or add an email address
                  </Text>
                </View>
              ) : (
                filteredRecipientsForModal.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => handleSelectRecipient(user.id, user.name, user.email)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: "rgba(186, 153, 136, 0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name="person" size={24} color="#ba9988" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#ffffff",
                          marginBottom: 4,
                        }}
                      >
                        {user.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {user.email}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

