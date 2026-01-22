import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminDataCard } from '@/components/admin/AdminDataCard';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { InternationalAddress, CountryCode, TaxIdentification } from '@/types/international';
import { NonprofitModal } from '@/components/admin/nonprofits/NonprofitModal';

interface Nonprofit {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneCountryCode?: CountryCode;
  taxIdentification?: TaxIdentification;
  ein?: string; // Legacy field for backward compatibility
  status: "pending" | "approved" | "rejected" | "suspended";
  submittedDate: string;
  category: string;
  totalDonations: number;
  verified: boolean;
  missionStatement?: string;
  address?: InternationalAddress;
  website?: string;
}

// Mock nonprofits
const mockNonprofits: Nonprofit[] = [
  {
    id: "np-1",
    name: "Community Scholarship Fund",
    email: "info@communityscholarship.org",
    phone: "(404) 555-0123",
    taxIdentification: {
      type: "EIN",
      number: "12-3456789",
      country: "US",
    },
    ein: "12-3456789", // Legacy field
    status: "approved",
    submittedDate: "2024-01-15",
    category: "Education",
    totalDonations: 12500.00,
    verified: true,
    missionStatement: "Providing scholarships to underserved students",
    address: {
      street: "123 Education Ave",
    city: "Atlanta",
    state: "GA",
      postalCode: "30309",
      country: "US",
    },
    website: "https://communityscholarship.org",
  },
  {
    id: "np-2",
    name: "Youth Development Center",
    email: "contact@youthdev.org",
    phone: "(312) 555-0456",
    ein: "98-7654321",
    status: "pending",
    submittedDate: "2024-02-10",
    category: "Community",
    totalDonations: 0,
    verified: false,
    missionStatement: "Empowering youth through mentorship",
  },
  {
    id: "np-3",
    name: "Health & Wellness Initiative",
    email: "hello@healthwellness.org",
    phone: "(212) 555-0789",
    ein: "45-6789012",
    status: "approved",
    submittedDate: "2024-01-20",
    category: "Health",
    totalDonations: 8900.50,
    verified: true,
    missionStatement: "Promoting health and wellness in underserved communities",
  },
];

export default function NonprofitManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>(mockNonprofits);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCountryCode: "US" as CountryCode,
    taxIdentification: {
      type: "EIN" as TaxIdentification["type"],
      number: "",
      country: "US" as CountryCode,
    } as TaxIdentification,
    ein: "", // Legacy field
    status: "pending" as "pending" | "approved" | "rejected" | "suspended",
    category: "",
    verified: false,
    missionStatement: "",
    address: {
      street: "",
    city: "",
    state: "",
      postalCode: "",
      country: "US" as CountryCode,
    } as Partial<InternationalAddress>,
    website: "",
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCountryCode: "US" as CountryCode,
    taxIdentification: {
      type: "EIN" as TaxIdentification["type"],
      number: "",
      country: "US" as CountryCode,
    } as TaxIdentification,
    ein: "", // Legacy field
    category: "",
    missionStatement: "",
    address: {
      street: "",
    city: "",
    state: "",
      postalCode: "",
      country: "US" as CountryCode,
    } as Partial<InternationalAddress>,
    website: "",
  });

  const filteredNonprofits = nonprofits.filter((np) => {
    const matchesSearch = searchQuery === "" ||
      np.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      np.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (np.ein?.includes(searchQuery) || np.taxIdentification?.number.includes(searchQuery));
    const matchesStatus = selectedStatus === "all" || np.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNonprofits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNonprofits = filteredNonprofits.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4caf50";
      case "pending":
        return "#ffd700";
      case "rejected":
        return "#ff4444";
      case "suspended":
        return "#ff4444";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const handleEdit = (np: Nonprofit) => {
    setSelectedNonprofit(np);
    setEditForm({
      name: np.name,
      email: np.email,
      phone: np.phone || "",
      phoneCountryCode: np.phoneCountryCode || "US",
      taxIdentification: np.taxIdentification || {
        type: "EIN" as TaxIdentification["type"],
        number: np.ein || "",
        country: "US" as CountryCode,
      },
      ein: np.ein || "",
      status: np.status,
      category: np.category,
      verified: np.verified,
      missionStatement: np.missionStatement || "",
      address: np.address || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US" as CountryCode,
      },
      website: np.website || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNonprofit || !editForm.name || !editForm.email || !editForm.taxIdentification.number) {
      alert("Please fill in required fields");
      return;
    }
    // TODO: Save via API
    setNonprofits(nonprofits.map(n => n.id === selectedNonprofit.id ? { 
      ...n, 
      ...editForm,
      taxIdentification: editForm.taxIdentification,
      address: editForm.address?.street ? editForm.address as InternationalAddress : undefined,
    } : n));
    setShowEditModal(false);
    setSelectedNonprofit(null);
    alert("Nonprofit updated successfully");
  };

  const handleCreate = () => {
    if (!createForm.name || !createForm.email || !createForm.taxIdentification.number || !createForm.category) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Create via API
    const newNonprofit: Nonprofit = {
      id: `np-${Date.now()}`,
      name: createForm.name,
      email: createForm.email,
      phone: createForm.phone || undefined,
      phoneCountryCode: createForm.phoneCountryCode,
      taxIdentification: createForm.taxIdentification,
      ein: createForm.taxIdentification.number, // Legacy field
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      category: createForm.category,
      totalDonations: 0,
      verified: false,
      missionStatement: createForm.missionStatement || undefined,
      address: createForm.address?.street ? createForm.address as InternationalAddress : undefined,
      website: createForm.website || undefined,
    };
    setNonprofits([...nonprofits, newNonprofit]);
    setShowCreateModal(false);
    setCreateForm({
      name: "",
      email: "",
      phone: "",
      phoneCountryCode: "US",
      taxIdentification: {
        type: "EIN" as TaxIdentification["type"],
        number: "",
        country: "US" as CountryCode,
      },
      ein: "",
      category: "",
      missionStatement: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US" as CountryCode,
      },
      website: "",
    });
    alert("Nonprofit created successfully");
  };

  const handleApprove = (np: Nonprofit) => {
    // TODO: Approve via API
    setNonprofits(nonprofits.map(n => n.id === np.id ? { ...n, status: "approved" } : n));
    alert("Nonprofit approved successfully");
  };

  const handleReject = (np: Nonprofit) => {
    // TODO: Reject via API
    setNonprofits(nonprofits.map(n => n.id === np.id ? { ...n, status: "rejected" } : n));
    alert("Nonprofit rejected");
  };

  const handleSuspend = (np: Nonprofit) => {
    // TODO: Suspend via API
    setNonprofits(nonprofits.map(n => n.id === np.id ? { ...n, status: n.status === "suspended" ? "approved" : "suspended" } : n));
    alert(np.status === "suspended" ? "Nonprofit activated" : "Nonprofit suspended");
  };

  const handleDelete = () => {
    if (!selectedNonprofit) return;
    // TODO: Delete via API
    setNonprofits(nonprofits.filter(n => n.id !== selectedNonprofit.id));
    setShowDeleteModal(false);
    setSelectedNonprofit(null);
    alert("Nonprofit deleted successfully");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Nonprofit Management
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Manage nonprofit organizations, approve applications, and update organization information.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32, flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            style={{
              backgroundColor: "#ba9988",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flex: isMobile ? 1 : 0,
              minWidth: isMobile ? "100%" : 200,
            }}
          >
            <MaterialIcons name="add" size={24} color="#ffffff" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Create Nonprofit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={{ marginBottom: 32, gap: 16 }}>
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#474747",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search nonprofits..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 12,
                fontSize: 16,
                color: "#ffffff",
              }}
            />
          </View>

          {/* Filter Dropdowns */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              gap: 16,
            }}
          >
            <FilterDropdown
              label="Status"
              options={[
                { value: "", label: "All Status" },
                { value: "approved", label: "Approved" },
                { value: "pending", label: "Pending" },
                { value: "rejected", label: "Rejected" },
                { value: "suspended", label: "Suspended" },
              ]}
              value={selectedStatus === "all" ? "" : selectedStatus}
              onSelect={(value) => setSelectedStatus(value === "" ? "all" : value)}
            />
          </View>
        </View>

        {/* Nonprofits List */}
        {filteredNonprofits.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {paginatedNonprofits.map((np) => {
              const statusColor = getStatusColor(np.status);
              const actions: Array<{
                label: string;
                icon: keyof typeof MaterialIcons.glyphMap;
                onPress: () => void;
                variant: "primary" | "secondary" | "danger" | "info";
              }> = [
                {
                  label: "Edit",
                  icon: "edit",
                  onPress: () => handleEdit(np),
                  variant: "secondary",
                },
                ...(np.status === "pending"
                  ? [
                      {
                        label: "Approve",
                        icon: "check" as keyof typeof MaterialIcons.glyphMap,
                        onPress: () => handleApprove(np),
                        variant: "primary" as const,
                      },
                      {
                        label: "Reject",
                        icon: "close" as keyof typeof MaterialIcons.glyphMap,
                        onPress: () => handleReject(np),
                        variant: "danger" as const,
                      },
                    ]
                  : [
                      {
                        label: np.status === "suspended" ? "Activate" : "Suspend",
                        icon: (np.status === "suspended" ? "check-circle" : "block") as keyof typeof MaterialIcons.glyphMap,
                        onPress: () => handleSuspend(np),
                        variant: (np.status === "suspended" ? "primary" : "danger") as "primary" | "danger",
                      },
                    ]),
                {
                  label: "Delete",
                  icon: "delete",
                  onPress: () => {
                    setSelectedNonprofit(np);
                    setShowDeleteModal(true);
                  },
                  variant: "danger",
                },
              ];

              return (
                <AdminDataCard
                  key={np.id}
                  title={`${np.verified ? "✓ " : ""}${np.name}`}
                  subtitle={`${np.email}${np.phone ? ` • ${np.phone}` : ""} • EIN: ${np.ein}`}
                  badges={[
                    {
                      label: np.category,
                      color: colors.accent,
                      backgroundColor: colors.accent,
                    },
                    {
                      label: np.status,
                      color: statusColor,
                      backgroundColor: `${statusColor}20`,
                    },
                  ]}
                  actions={actions}
                >
                  <View style={{ alignItems: "flex-end", marginTop: spacing.md }}>
                    <Text
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.bold as '700',
                        color: colors.accent,
                        marginBottom: spacing.xs,
                      }}
                    >
                      ${np.totalDonations.toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.tertiary,
                      }}
                    >
                      Total Donations
                    </Text>
                  </View>
                </AdminDataCard>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="handshake" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No nonprofits found
            </Text>
          </View>
        )}

        {/* Pagination */}
        {filteredNonprofits.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNonprofits.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Edit Nonprofit Modal */}
        <NonprofitModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          isEditing={true}
          onSave={handleSaveEdit}
          form={editForm}
          setForm={setEditForm}
        />

        {/* Create Nonprofit Modal */}
        <NonprofitModal
          visible={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm({
              name: "",
              email: "",
              phone: "",
              phoneCountryCode: "US",
              taxIdentification: {
                type: "EIN" as TaxIdentification["type"],
                number: "",
                country: "US" as CountryCode,
              },
              ein: "",
              category: "",
              missionStatement: "",
              address: {
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "US" as CountryCode,
              },
              website: "",
            });
          }}
          isEditing={false}
          onSave={handleCreate}
          form={createForm}
          setForm={setCreateForm}
        />

        {/* Delete Confirmation Modal */}
        <AdminModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Nonprofit"
          maxWidth={400}
          actions={[
            {
              label: "Cancel",
              onPress: () => setShowDeleteModal(false),
              variant: "secondary",
            },
            {
              label: "Delete",
              onPress: handleDelete,
              variant: "danger",
            },
          ]}
        >
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
            }}
          >
            Are you sure you want to delete {selectedNonprofit?.name}? This action cannot be undone.
          </Text>
        </AdminModal>
      </ScrollView>
    </View>
  );
}
