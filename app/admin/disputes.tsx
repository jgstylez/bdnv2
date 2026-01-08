import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Modal, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface Dispute {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: "refund" | "transaction" | "account" | "business" | "other";
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  subject: string;
  description: string;
  relatedTransactionId?: string;
  relatedBusinessId?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
}

// Mock disputes
const mockDisputes: Dispute[] = [
  {
    id: "dsp-001",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    type: "refund",
    status: "open",
    priority: "high",
    subject: "Request refund for cancelled order",
    description: "I placed an order but the business cancelled it. I need a refund.",
    relatedTransactionId: "txn-001",
    createdAt: "2024-02-15T10:30:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "dsp-002",
    userId: "user2",
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
    type: "transaction",
    status: "in-progress",
    priority: "normal",
    subject: "Duplicate charge on my account",
    description: "I was charged twice for the same purchase. Please investigate.",
    relatedTransactionId: "txn-002",
    createdAt: "2024-02-14T14:20:00Z",
    updatedAt: "2024-02-15T09:00:00Z",
    assignedTo: "admin-1",
  },
  {
    id: "dsp-003",
    userId: "user3",
    userName: "Marcus Williams",
    userEmail: "marcus@example.com",
    type: "account",
    status: "resolved",
    priority: "low",
    subject: "Account access issue",
    description: "I cannot log into my account. Password reset not working.",
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-02-10T11:30:00Z",
    assignedTo: "admin-2",
    resolutionNotes: "Password reset link sent successfully. User confirmed access restored.",
  },
];

export default function DisputeManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch = searchQuery === "" ||
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || dispute.status === selectedStatus;
    const matchesPriority = !selectedPriority || dispute.priority === selectedPriority;
    const matchesType = !selectedType || dispute.type === selectedType;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDisputes = filteredDisputes.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedPriority, selectedType]);

  const stats = {
    total: mockDisputes.length,
    open: mockDisputes.filter(d => d.status === "open").length,
    inProgress: mockDisputes.filter(d => d.status === "in-progress").length,
    resolved: mockDisputes.filter(d => d.status === "resolved").length,
    urgent: mockDisputes.filter(d => d.priority === "urgent").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#ffd700";
      case "in-progress":
        return "#2196f3";
      case "resolved":
        return "#4caf50";
      case "closed":
        return "rgba(255, 255, 255, 0.5)";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#ff4444";
      case "high":
        return "#ff6b35";
      case "normal":
        return "#ffd700";
      case "low":
        return "#4caf50";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDetailModal(true);
  };

  const handleResolve = () => {
    if (!selectedDispute) return;
    setShowDetailModal(false);
    setShowResolutionModal(true);
  };

  const handleSaveResolution = () => {
    if (!resolutionNotes.trim()) {
      alert("Please enter resolution notes");
      return;
    }
    // TODO: Process resolution via API
    alert("Dispute resolved successfully.");
    setShowResolutionModal(false);
    setResolutionNotes("");
    setSelectedDispute(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        <AdminPageHeader
          title="Dispute & Support Management"
          description="Manage user disputes, support tickets, and resolve issues"
        />

        {/* Stats Summary */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: spacing.md,
            marginBottom: spacing["2xl"],
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              Total Disputes
          </Text>
          <Text
            style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold as '700',
                color: colors.text.primary,
              }}
            >
              {stats.total}
          </Text>
        </View>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              Open
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold as '700',
                color: "#ffd700",
              }}
            >
              {stats.open}
            </Text>
          </View>
          <View
                style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
                  borderWidth: 1,
              borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              In Progress
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold as '700',
                color: "#2196f3",
              }}
            >
              {stats.inProgress}
                </Text>
          </View>
          <View
                style={{
              flex: 1,
              backgroundColor: colors.input,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
                  borderWidth: 1,
              borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                marginBottom: spacing.xs,
              }}
            >
              Urgent
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize["2xl"],
                fontWeight: typography.fontWeight.bold as '700',
                color: "#ff4444",
              }}
            >
              {stats.urgent}
                </Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.input,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by ID, subject, user name, or email..."
              placeholderTextColor={colors.text.placeholder}
              style={{
                flex: 1,
                paddingVertical: spacing.md - 2,
                paddingHorizontal: spacing.md,
                fontSize: typography.fontSize.base,
                color: colors.text.primary,
              }}
            />
          </View>

          {/* Filter Dropdowns */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: spacing.md,
            }}
          >
            <FilterDropdown
              label="Status"
              options={[
                { value: "", label: "All Status" },
                { value: "open", label: "Open" },
                { value: "in-progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
                { value: "closed", label: "Closed" },
              ]}
              value={selectedStatus}
              onSelect={setSelectedStatus}
            />
            <FilterDropdown
              label="Priority"
              options={[
                { value: "", label: "All Priorities" },
                { value: "urgent", label: "Urgent" },
                { value: "high", label: "High" },
                { value: "normal", label: "Normal" },
                { value: "low", label: "Low" },
              ]}
              value={selectedPriority}
              onSelect={setSelectedPriority}
            />
            <FilterDropdown
              label="Type"
              options={[
                { value: "", label: "All Types" },
                { value: "refund", label: "Refund" },
                { value: "transaction", label: "Transaction" },
                { value: "account", label: "Account" },
                { value: "business", label: "Business" },
                { value: "other", label: "Other" },
              ]}
              value={selectedType}
              onSelect={setSelectedType}
            />
          </View>
        </View>

        {/* Disputes List */}
        <View style={{ gap: spacing.md }}>
          {paginatedDisputes.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing["2xl"],
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons name="inbox" size={48} color={colors.text.tertiary} />
                    <Text
                      style={{
                  fontSize: typography.fontSize.base,
                  color: colors.text.secondary,
                  marginTop: spacing.md,
                }}
              >
                No disputes found matching your filters
              </Text>
            </View>
          ) : (
            paginatedDisputes.map((dispute) => (
              <TouchableOpacity
                key={dispute.id}
                onPress={() => handleViewDetails(dispute)}
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "flex-start" }}>
                  {/* Priority Indicator */}
                  <View
                    style={{
                      width: 4,
                      height: "100%",
                      backgroundColor: getPriorityColor(dispute.priority),
                      borderRadius: 2,
                    }}
                  />

                  {/* Content */}
                  <View style={{ flex: 1, gap: spacing.sm }}>
                    {/* Header Row */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: spacing.sm }}>
                      <View style={{ flex: 1, minWidth: 200 }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.base,
                            fontWeight: typography.fontWeight.bold as '700',
                            color: colors.text.primary,
                            marginBottom: spacing.xs,
                          }}
                          numberOfLines={1}
                    >
                      {dispute.subject}
                    </Text>
                        <Text
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.secondary,
                          }}
                          numberOfLines={2}
                        >
                          {dispute.description}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
                    <View
                      style={{
                            paddingHorizontal: spacing.sm,
                        paddingVertical: 4,
                            borderRadius: borderRadius.sm,
                        backgroundColor: `${getPriorityColor(dispute.priority)}20`,
                      }}
                    >
                      <Text
                        style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.semibold as '600',
                          color: getPriorityColor(dispute.priority),
                          textTransform: "uppercase",
                        }}
                      >
                        {dispute.priority}
                      </Text>
                    </View>
                        <View
                    style={{
                            paddingHorizontal: spacing.sm,
                            paddingVertical: 4,
                            borderRadius: borderRadius.sm,
                            backgroundColor: `${getStatusColor(dispute.status)}20`,
                          }}
                        >
                    <Text
                      style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.semibold as '600',
                              color: getStatusColor(dispute.status),
                              textTransform: "capitalize",
                            }}
                          >
                            {dispute.status.replace("-", " ")}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Metadata Row */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xs }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="person" size={14} color={colors.text.tertiary} />
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                          {dispute.userName}
                    </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="category" size={14} color={colors.text.tertiary} />
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, textTransform: "capitalize" }}>
                          {dispute.type}
                    </Text>
                      </View>
                    {dispute.relatedTransactionId && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                          <MaterialIcons name="receipt" size={14} color={colors.text.tertiary} />
                          <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                            {dispute.relatedTransactionId}
                      </Text>
                        </View>
                      )}
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <MaterialIcons name="schedule" size={14} color={colors.text.tertiary} />
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                          {formatDate(dispute.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Pagination */}
        {filteredDisputes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDisputes.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </ScrollView>

      {/* Detail Modal */}
      <AdminModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedDispute(null);
        }}
        title={selectedDispute?.subject || "Dispute Details"}
      >
        {selectedDispute && (
          <ScrollView style={{ maxHeight: 600 }}>
            <View style={{ gap: spacing.lg }}>
              {/* Status and Priority */}
              <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
                <View
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.sm,
                    backgroundColor: `${getStatusColor(selectedDispute.status)}20`,
                  }}
                >
                  <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Status
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold as '700',
                      color: getStatusColor(selectedDispute.status),
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedDispute.status.replace("-", " ")}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.sm,
                    backgroundColor: `${getPriorityColor(selectedDispute.priority)}20`,
                  }}
                >
                  <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Priority
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold as '700',
                      color: getPriorityColor(selectedDispute.priority),
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedDispute.priority}
                  </Text>
                </View>
              </View>

              {/* User Information */}
              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
                  User Information
                </Text>
                <View style={{ backgroundColor: colors.input, borderRadius: borderRadius.md, padding: spacing.md }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, marginBottom: spacing.xs }}>
                    {selectedDispute.userName}
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    {selectedDispute.userEmail}
                  </Text>
                  <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginTop: spacing.xs }}>
                    User ID: {selectedDispute.userId}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
                  Description
                </Text>
                <View style={{ backgroundColor: colors.input, borderRadius: borderRadius.md, padding: spacing.md }}>
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, lineHeight: 22 }}>
                    {selectedDispute.description}
                  </Text>
                </View>
              </View>

              {/* Related Information */}
              {(selectedDispute.relatedTransactionId || selectedDispute.relatedBusinessId) && (
                <View>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
                    Related Information
                  </Text>
                  <View style={{ backgroundColor: colors.input, borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.sm }}>
                    {selectedDispute.relatedTransactionId && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <MaterialIcons name="receipt" size={16} color={colors.text.tertiary} />
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          Transaction: <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>{selectedDispute.relatedTransactionId}</Text>
                        </Text>
                      </View>
                    )}
                    {selectedDispute.relatedBusinessId && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <MaterialIcons name="store" size={16} color={colors.text.tertiary} />
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                          Business ID: <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>{selectedDispute.relatedBusinessId}</Text>
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Resolution Notes */}
              {selectedDispute.resolutionNotes && (
                <View>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
                    Resolution Notes
                  </Text>
                  <View style={{ backgroundColor: colors.input, borderRadius: borderRadius.md, padding: spacing.md }}>
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary, lineHeight: 22 }}>
                      {selectedDispute.resolutionNotes}
                    </Text>
                  </View>
                </View>
              )}

              {/* Timestamps */}
              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.secondary, marginBottom: spacing.sm }}>
                  Timeline
                </Text>
                <View style={{ backgroundColor: colors.input, borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.sm }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Created
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                      {formatDate(selectedDispute.createdAt)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Last Updated
                    </Text>
                    <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.primary }}>
                      {formatDate(selectedDispute.updatedAt)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              {selectedDispute.status !== "resolved" && selectedDispute.status !== "closed" && (
                <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDetailModal(false);
                      setShowResolutionModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      backgroundColor: colors.accent,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                      Resolve Dispute
                    </Text>
                  </TouchableOpacity>
                </View>
                )}
              </View>
          </ScrollView>
        )}
      </AdminModal>

        {/* Resolution Modal */}
      <AdminModal
          visible={showResolutionModal}
        onClose={() => {
          setShowResolutionModal(false);
          setResolutionNotes("");
        }}
        title="Resolve Dispute"
      >
        <View style={{ gap: spacing.lg }}>
          {selectedDispute && (
            <View style={{ backgroundColor: colors.input, borderRadius: borderRadius.md, padding: spacing.md }}>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Dispute
              </Text>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                {selectedDispute.subject}
              </Text>
            </View>
          )}

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Resolution Notes *
                </Text>
                <TextInput
                  value={resolutionNotes}
                  onChangeText={setResolutionNotes}
                  placeholder="Enter resolution details..."
              placeholderTextColor={colors.text.placeholder}
                  multiline
                  numberOfLines={6}
                  style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                    borderWidth: 1,
                borderColor: colors.border,
                    textAlignVertical: "top",
                minHeight: 120,
                  }}
                />
              </View>

          <View style={{ flexDirection: "row", gap: spacing.md }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowResolutionModal(false);
                    setResolutionNotes("");
                  }}
                  style={{
                    flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.input,
                    borderWidth: 1,
                borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
              onPress={handleSaveResolution}
                  style={{
                    flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
                    alignItems: "center",
                  }}
                >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                    Resolve
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
      </AdminModal>
    </View>
  );
}
