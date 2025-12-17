import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { InvoiceTemplate } from '@/types/invoices';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { HeroSection } from '@/components/layouts/HeroSection';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDataCard } from '@/components/admin/AdminDataCard';
import { AdminModal } from '@/components/admin/AdminModal';
import { FormInput, FormTextArea } from '@/components/forms';

// Mock templates - in production, fetch from API
const mockTemplates: InvoiceTemplate[] = [
  {
    id: "template-1",
    name: "Monthly Service Invoice",
    issuerId: "merchant-1",
    issuerType: "business",
    description: "Template for monthly recurring service invoices",
    defaultLineItems: [
      {
        description: "Monthly Service Fee",
        quantity: 1,
        unitPrice: 200.00,
        tax: 16.00,
        total: 216.00,
      },
    ],
    defaultPaymentTerms: "Net 30",
    defaultNotes: "Thank you for your business!",
    isDefault: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "template-2",
    name: "One-Time Project",
    issuerId: "merchant-1",
    issuerType: "business",
    description: "Template for one-time project invoices",
    defaultLineItems: [
      {
        description: "Project Fee",
        quantity: 1,
        unitPrice: 500.00,
        tax: 40.00,
        total: 540.00,
      },
    ],
    defaultPaymentTerms: "Due on receipt",
    isDefault: false,
    createdAt: "2024-02-01T00:00:00Z",
  },
];

export default function InvoiceTemplates() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  
  // Form state
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState("Net 30");
  const [defaultNotes, setDefaultNotes] = useState("");
  const [defaultTerms, setDefaultTerms] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      Alert.alert("Error", "Please enter a template name");
      return;
    }
    // TODO: Save template to API
    Alert.alert("Success", "Template created successfully!");
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditTemplate = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description || "");
    setDefaultPaymentTerms(template.defaultPaymentTerms || "Net 30");
    setDefaultNotes(template.defaultNotes || "");
    setDefaultTerms(template.defaultTerms || "");
    setIsDefault(template.isDefault);
    setShowEditModal(true);
  };

  const handleUpdateTemplate = () => {
    if (!templateName.trim()) {
      Alert.alert("Error", "Please enter a template name");
      return;
    }
    // TODO: Update template via API
    Alert.alert("Success", "Template updated successfully!");
    setShowEditModal(false);
    resetForm();
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    // TODO: Delete template via API
    Alert.alert("Success", "Template deleted successfully!");
    setShowDeleteModal(false);
    setSelectedTemplate(null);
  };

  const handleUseTemplate = (template: InvoiceTemplate) => {
    // Navigate to create invoice page with template ID
    router.push(`/pages/invoices/create?type=business&templateId=${template.id}`);
  };

  const handleSetDefault = (template: InvoiceTemplate) => {
    // TODO: Set as default template via API
    Alert.alert("Success", `${template.name} is now your default template`);
  };

  const resetForm = () => {
    setTemplateName("");
    setTemplateDescription("");
    setDefaultPaymentTerms("Net 30");
    setDefaultNotes("");
    setDefaultTerms("");
    setIsDefault(false);
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
          title="Invoice Templates"
          subtitle="Create and manage reusable invoice templates"
        />

        {/* Header */}
        <AdminPageHeader
          title="Templates"
          description={`${mockTemplates.length} ${mockTemplates.length === 1 ? "template" : "templates"}`}
          actionLabel="Create Template"
          onActionPress={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        />

        {/* Template List */}
        <View style={{ gap: spacing.md }}>
          {mockTemplates.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: spacing["4xl"],
              }}
            >
              <MaterialIcons name="description" size={64} color={colors.text.tertiary} />
              <Text
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  marginTop: spacing.lg,
                  marginBottom: spacing.sm,
                }}
              >
                No templates found
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginBottom: spacing.lg,
                }}
              >
                Create your first template to get started
              </Text>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
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
                  Create Template
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            mockTemplates.map((template) => (
              <AdminDataCard
                key={template.id}
                title={template.name}
                subtitle={template.description || `Created ${formatDate(template.createdAt)}`}
                badges={[
                  {
                    label: template.isDefault ? "Default" : "Template",
                    color: template.isDefault ? colors.accent : colors.text.secondary,
                    backgroundColor: template.isDefault ? colors.accentLight : colors.secondary.bg,
                  },
                ]}
                actions={[
                  {
                    label: "Use",
                    icon: "play-arrow",
                    variant: "primary",
                    onPress: () => handleUseTemplate(template),
                  },
                  {
                    label: "Edit",
                    icon: "edit",
                    variant: "secondary",
                    onPress: () => handleEditTemplate(template),
                  },
                  {
                    label: template.isDefault ? "Default" : "Set Default",
                    icon: "star",
                    variant: "info",
                    onPress: () => handleSetDefault(template),
                  },
                  {
                    label: "Delete",
                    icon: "delete",
                    variant: "danger",
                    onPress: () => {
                      setSelectedTemplate(template);
                      setShowDeleteModal(true);
                    },
                  },
                ]}
              >
                <View style={{ marginTop: spacing.sm }}>
                  {template.defaultLineItems && template.defaultLineItems.length > 0 && (
                    <View style={{ marginBottom: spacing.sm }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.tertiary,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Default Line Items:
                      </Text>
                      {template.defaultLineItems.map((item, index) => (
                        <Text
                          key={index}
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.secondary,
                          }}
                        >
                          • {item.description} - ${item.unitPrice.toFixed(2)} × {item.quantity}
                        </Text>
                      ))}
                    </View>
                  )}
                  {template.defaultPaymentTerms && (
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.tertiary,
                      }}
                    >
                      Payment Terms: {template.defaultPaymentTerms}
                    </Text>
                  )}
                </View>
              </AdminDataCard>
            ))
          )}
        </View>

        {/* Create Template Modal */}
        <AdminModal
          visible={showCreateModal}
          title="Create Invoice Template"
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowCreateModal(false);
                resetForm();
              },
              variant: "secondary",
            },
            {
              label: "Create Template",
              onPress: handleCreateTemplate,
              variant: "primary",
            },
          ]}
        >
          <View style={{ gap: spacing.md }}>
            <FormInput
              label="Template Name"
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="e.g., Monthly Service Invoice"
              required
            />
            <FormTextArea
              label="Description (Optional)"
              value={templateDescription}
              onChangeText={setTemplateDescription}
              placeholder="Describe when to use this template"
              rows={3}
            />
            <FormInput
              label="Default Payment Terms"
              value={defaultPaymentTerms}
              onChangeText={setDefaultPaymentTerms}
              placeholder="e.g., Net 30, Due on receipt"
            />
            <FormTextArea
              label="Default Notes (Optional)"
              value={defaultNotes}
              onChangeText={setDefaultNotes}
              placeholder="Default notes to include in invoices"
              rows={3}
            />
            <FormTextArea
              label="Default Terms & Conditions (Optional)"
              value={defaultTerms}
              onChangeText={setDefaultTerms}
              placeholder="Default terms and conditions"
              rows={3}
            />
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.tertiary,
                fontStyle: "italic",
              }}
            >
              Note: You can add default line items when creating an invoice from this template.
            </Text>
          </View>
        </AdminModal>

        {/* Edit Template Modal */}
        <AdminModal
          visible={showEditModal}
          title="Edit Invoice Template"
          onClose={() => {
            setShowEditModal(false);
            resetForm();
            setSelectedTemplate(null);
          }}
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowEditModal(false);
                resetForm();
                setSelectedTemplate(null);
              },
              variant: "secondary",
            },
            {
              label: "Save Changes",
              onPress: handleUpdateTemplate,
              variant: "primary",
            },
          ]}
        >
          <View style={{ gap: spacing.md }}>
            <FormInput
              label="Template Name"
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="e.g., Monthly Service Invoice"
              required
            />
            <FormTextArea
              label="Description (Optional)"
              value={templateDescription}
              onChangeText={setTemplateDescription}
              placeholder="Describe when to use this template"
              rows={3}
            />
            <FormInput
              label="Default Payment Terms"
              value={defaultPaymentTerms}
              onChangeText={setDefaultPaymentTerms}
              placeholder="e.g., Net 30, Due on receipt"
            />
            <FormTextArea
              label="Default Notes (Optional)"
              value={defaultNotes}
              onChangeText={setDefaultNotes}
              placeholder="Default notes to include in invoices"
              rows={3}
            />
            <FormTextArea
              label="Default Terms & Conditions (Optional)"
              value={defaultTerms}
              onChangeText={setDefaultTerms}
              placeholder="Default terms and conditions"
              rows={3}
            />
          </View>
        </AdminModal>

        {/* Delete Template Modal */}
        <AdminModal
          visible={showDeleteModal}
          title="Delete Template"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTemplate(null);
          }}
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowDeleteModal(false);
                setSelectedTemplate(null);
              },
              variant: "secondary",
            },
            {
              label: "Delete",
              onPress: handleDeleteTemplate,
              variant: "danger",
            },
          ]}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            Are you sure you want to delete "{selectedTemplate?.name}"? This action cannot be undone.
          </Text>
        </AdminModal>
      </ScrollView>
    </View>
  );
}

