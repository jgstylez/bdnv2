import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { BusinessManagementFilters } from "../../types/admin";
import { MerchantType } from "../../types/merchant";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { FilterDropdown } from "../../components/admin/FilterDropdown";
import { AdminDataCard } from "../../components/admin/AdminDataCard";
import { AdminModal } from "../../components/admin/AdminModal";
import { Pagination } from "../../components/admin/Pagination";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../constants/theme";
import { InternationalAddress, CountryCode, Currency, TaxIdentification } from "../../types/international";
import { InternationalAddressForm } from "../../components/forms/InternationalAddressForm";
import { CurrencySelector } from "../../components/forms/CurrencySelector";
import { TaxIdSelector } from "../../components/forms/TaxIdSelector";
import { formatAddressDisplay } from "../../lib/international";

interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneCountryCode?: CountryCode;
  merchantType: MerchantType;
  merchantLevel: "basic" | "premier" | "platinum";
  status: "pending" | "approved" | "rejected" | "suspended";
  submittedDate: string;
  category: string;
  description?: string;
  address?: InternationalAddress;
  currency?: Currency;
  taxIdentification?: TaxIdentification;
  website?: string;
}

// Mock businesses
const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Soul Food Kitchen",
    email: "info@soulfoodkitchen.com",
    phone: "(404) 555-0123",
    merchantType: "local-shop",
    merchantLevel: "premier",
    status: "approved",
    submittedDate: "2024-02-01",
    category: "Restaurant",
    description: "Authentic Southern cuisine",
    address: {
      street: "123 Main Street",
    city: "Atlanta",
    state: "GA",
      postalCode: "30309",
      country: "US",
    },
    website: "https://soulfoodkitchen.com",
  },
  {
    id: "2",
    name: "Black Beauty Salon",
    email: "contact@blackbeautysalon.com",
    phone: "(312) 555-0456",
    merchantType: "local-service",
    merchantLevel: "basic",
    status: "pending",
    submittedDate: "2024-02-15",
    category: "Beauty & Wellness",
    description: "Premium grooming services",
  },
  {
    id: "3",
    name: "Community Bookstore",
    email: "hello@communitybookstore.com",
    phone: "(212) 555-0789",
    merchantType: "local-shop",
    merchantLevel: "platinum",
    status: "approved",
    submittedDate: "2024-01-20",
    category: "Retail",
    description: "Independent bookstore",
  },
];

const MERCHANT_TYPES: { value: MerchantType; label: string }[] = [
  { value: "local-shop", label: "Local Shop" },
  { value: "local-service", label: "Local Service" },
  { value: "national-service", label: "National Service" },
  { value: "online-shopping", label: "Online Shopping" },
];

const categories = [
  "Restaurant",
  "Retail",
  "Services",
  "Technology",
  "Beauty & Wellness",
  "Health & Fitness",
  "Education",
  "Entertainment",
  "Other",
];

export default function BusinessManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BusinessManagementFilters>({});
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCountryCode: "US" as CountryCode,
    merchantType: "local-shop" as MerchantType,
    merchantLevel: "basic" as "basic" | "premier" | "platinum",
    status: "pending" as "pending" | "approved" | "rejected" | "suspended",
    category: "",
    description: "",
    address: {
      street: "",
    city: "",
    state: "",
      postalCode: "",
      country: "US" as CountryCode,
    } as Partial<InternationalAddress>,
    currency: "USD" as Currency,
    taxIdentification: {
      type: "EIN" as TaxIdentification["type"],
      number: "",
      country: "US" as CountryCode,
    } as TaxIdentification,
    website: "",
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCountryCode: "US" as CountryCode,
    merchantType: "local-shop" as MerchantType,
    merchantLevel: "basic" as "basic" | "premier" | "platinum",
    category: "",
    description: "",
    address: {
      street: "",
    city: "",
    state: "",
      postalCode: "",
      country: "US" as CountryCode,
    } as Partial<InternationalAddress>,
    currency: "USD" as Currency,
    taxIdentification: {
      type: "EIN" as TaxIdentification["type"],
      number: "",
      country: "US" as CountryCode,
    } as TaxIdentification,
    website: "",
  });

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = searchQuery === "" || 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.phone?.includes(searchQuery);
    const matchesStatus = !filters.status || business.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters.status]);

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

  const handleEdit = (business: Business) => {
    setSelectedBusiness(business);
    setEditForm({
      name: business.name,
      email: business.email,
      phone: business.phone || "",
      phoneCountryCode: business.phoneCountryCode || "US",
      merchantType: business.merchantType,
      merchantLevel: business.merchantLevel,
      status: business.status,
      category: business.category,
      description: business.description || "",
      address: business.address || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US" as CountryCode,
      },
      currency: business.currency || "USD",
      taxIdentification: business.taxIdentification || {
        type: "EIN" as TaxIdentification["type"],
        number: "",
        country: "US" as CountryCode,
      },
      website: business.website || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedBusiness || !editForm.name || !editForm.email) {
      alert("Please fill in required fields");
      return;
    }
    // TODO: Save via API
    setBusinesses(businesses.map(b => b.id === selectedBusiness.id ? { ...b, ...editForm } : b));
    setShowEditModal(false);
    setSelectedBusiness(null);
    alert("Business updated successfully");
  };

  const handleCreate = () => {
    if (!createForm.name || !createForm.email || !createForm.category) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Create via API
    const newBusiness: Business = {
      id: `business-${Date.now()}`,
      name: createForm.name,
      email: createForm.email,
      phone: createForm.phone || undefined,
      merchantType: createForm.merchantType,
      merchantLevel: createForm.merchantLevel,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      category: createForm.category,
      description: createForm.description || undefined,
      address: createForm.address?.street ? createForm.address as InternationalAddress : undefined,
      currency: createForm.currency,
      taxIdentification: createForm.taxIdentification.number ? createForm.taxIdentification : undefined,
      website: createForm.website || undefined,
    };
    setBusinesses([...businesses, newBusiness]);
    setShowCreateModal(false);
    setCreateForm({
      name: "",
      email: "",
      phone: "",
      merchantType: "local-shop",
      merchantLevel: "basic",
      category: "",
      description: "",
      address: {
        street: "",
      city: "",
      state: "",
        postalCode: "",
        country: "US" as CountryCode,
      },
      currency: "USD",
      taxIdentification: {
        type: "EIN" as TaxIdentification["type"],
        number: "",
        country: "US" as CountryCode,
      },
      website: "",
    });
    alert("Business created successfully");
  };

  const handleApprove = (business: Business) => {
    // TODO: Approve via API
    setBusinesses(businesses.map(b => b.id === business.id ? { ...b, status: "approved" } : b));
    alert("Business approved successfully");
  };

  const handleReject = (business: Business) => {
    // TODO: Reject via API
    setBusinesses(businesses.map(b => b.id === business.id ? { ...b, status: "rejected" } : b));
    alert("Business rejected");
  };

  const handleSuspend = (business: Business) => {
    // TODO: Suspend via API
    setBusinesses(businesses.map(b => b.id === business.id ? { ...b, status: b.status === "suspended" ? "approved" : "suspended" } : b));
    alert(business.status === "suspended" ? "Business activated" : "Business suspended");
  };

  const handleDelete = () => {
    if (!selectedBusiness) return;
    // TODO: Delete via API
    setBusinesses(businesses.filter(b => b.id !== selectedBusiness.id));
    setShowDeleteModal(false);
    setSelectedBusiness(null);
    alert("Business deleted successfully");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? spacing["2xl"] : spacing["2xl"] + 16,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Header */}
        <AdminPageHeader
          title="Business Management"
          description="Approve and manage merchant accounts. Edit business information and handle applications."
          actionButton={{
            label: "Create Business",
            icon: "add",
            onPress: () => setShowCreateModal(true),
          }}
        />

        {/* Search and Filters */}
        <View style={{ marginBottom: spacing["2xl"], gap: spacing.md }}>
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search businesses..."
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
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "suspended", label: "Suspended" },
              ]}
              value={filters.status || ""}
              onSelect={(value) => setFilters({ ...filters, status: value === "" ? undefined : value as any })}
            />
          </View>
        </View>

        {/* Businesses List */}
        {filteredBusinesses.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {paginatedBusinesses.map((business) => {
              const statusColor = getStatusColor(business.status);
              const actions: Array<{
                label: string;
                icon: keyof typeof MaterialIcons.glyphMap;
                onPress: () => void;
                variant: "primary" | "secondary" | "danger" | "info";
              }> = [
                {
                  label: "Edit",
                  icon: "edit",
                  onPress: () => handleEdit(business),
                  variant: "secondary",
                },
                ...(business.status === "pending"
                  ? [
                      {
                        label: "Approve",
                        icon: "check" as keyof typeof MaterialIcons.glyphMap,
                        onPress: () => handleApprove(business),
                        variant: "primary" as const,
                      },
                      {
                        label: "Reject",
                        icon: "close" as keyof typeof MaterialIcons.glyphMap,
                        onPress: () => handleReject(business),
                        variant: "danger" as const,
                      },
                    ]
                  : [
                      {
                        label: business.status === "suspended" ? "Activate" : "Suspend",
                        icon: (business.status === "suspended" ? "check-circle" : "block") as keyof typeof MaterialIcons.glyphMap,
                        onPress: () => handleSuspend(business),
                        variant: (business.status === "suspended" ? "primary" : "danger") as "primary" | "danger",
                      },
                    ]),
                {
                  label: "Delete",
                  icon: "delete",
                  onPress: () => {
                    setSelectedBusiness(business);
                    setShowDeleteModal(true);
                  },
                  variant: "danger",
                },
              ];

              return (
                <AdminDataCard
                  key={business.id}
                  title={business.name}
                  subtitle={`${business.email}${business.phone ? ` • ${business.phone}` : ""}`}
                  badges={[
                    {
                      label: business.category,
                      color: colors.accent,
                      backgroundColor: colors.accentLight,
                    },
                    {
                      label: business.merchantLevel,
                      color: colors.accent,
                      backgroundColor: colors.accentLight,
                    },
                    {
                      label: business.status,
                      color: statusColor,
                      backgroundColor: `${statusColor}20`,
                    },
                  ]}
                  actions={actions}
                />
              );
            })}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing["4xl"],
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <MaterialIcons name="store" size={48} color={colors.accentLight} />
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                color: colors.text.tertiary,
                textAlign: "center",
                marginTop: spacing.lg,
              }}
            >
              No businesses found
            </Text>
          </View>
        )}

        {/* Pagination */}
        {filteredBusinesses.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBusinesses.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Edit Business Modal */}
        <AdminModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Business"
          actions={[
            {
              label: "Cancel",
              onPress: () => setShowEditModal(false),
              variant: "secondary",
            },
            {
              label: "Save",
              onPress: handleSaveEdit,
              variant: "primary",
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: spacing.lg }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Business Name *</Text>
                  <TextInput
                    value={editForm.name}
                    onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Email *</Text>
                  <TextInput
                    value={editForm.email}
                    onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                    keyboardType="email-address"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Phone</Text>
                  <TextInput
                    value={editForm.phone}
                    onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                    keyboardType="phone-pad"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Category *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 8 }}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setEditForm({ ...editForm, category: cat })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: editForm.category === cat ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: editForm.category === cat ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: editForm.category === cat ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Merchant Type</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {MERCHANT_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        onPress={() => setEditForm({ ...editForm, merchantType: type.value })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: editForm.merchantType === type.value ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: editForm.merchantType === type.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: editForm.merchantType === type.value ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Merchant Level</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["basic", "premier", "platinum"] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setEditForm({ ...editForm, merchantLevel: level })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: editForm.merchantLevel === level ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: editForm.merchantLevel === level ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: editForm.merchantLevel === level ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            textTransform: "capitalize",
                          }}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Status</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["pending", "approved", "rejected", "suspended"] as const).map((status) => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => setEditForm({ ...editForm, status })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: editForm.status === status ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: editForm.status === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: editForm.status === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            textTransform: "capitalize",
                          }}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Description</Text>
                  <TextInput
                    value={editForm.description}
                    onChangeText={(text) => setEditForm({ ...editForm, description: text })}
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 16 }}>
                    Address
                  </Text>
                  <InternationalAddressForm
                    value={editForm.address}
                    onChange={(address) => setEditForm({ ...editForm, address: { ...editForm.address, ...address } })}
                    defaultCountry={editForm.address?.country || "US"}
                  />
                </View>

                <CurrencySelector
                  value={editForm.currency}
                  onChange={(currency) => setEditForm({ ...editForm, currency })}
                  showBLKD={true}
                    />

                <TaxIdSelector
                  value={editForm.taxIdentification}
                  onChange={(taxId) => setEditForm({ ...editForm, taxIdentification: taxId })}
                  country={editForm.address?.country || "US"}
                    />

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Website</Text>
                  <TextInput
                    value={editForm.website}
                    onChangeText={(text) => setEditForm({ ...editForm, website: text })}
                    keyboardType="url"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>
            </View>
          </ScrollView>
        </AdminModal>

        {/* Create Business Modal */}
        <AdminModal
          visible={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm({
              name: "",
              email: "",
              phone: "",
              phoneCountryCode: "US",
              merchantType: "local-shop",
              merchantLevel: "basic",
              category: "",
              description: "",
              address: {
                street: "",
              city: "",
              state: "",
                postalCode: "",
                country: "US" as CountryCode,
              },
              currency: "USD",
              taxIdentification: {
                type: "EIN" as TaxIdentification["type"],
                number: "",
                country: "US" as CountryCode,
              },
              website: "",
            });
          }}
          title="Create Business"
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowCreateModal(false);
                setCreateForm({
                  name: "",
                  email: "",
                  phone: "",
                  merchantType: "local-shop",
                  merchantLevel: "basic",
                  category: "",
                  description: "",
                  address: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  website: "",
                });
              },
              variant: "secondary",
            },
            {
              label: "Create",
              onPress: handleCreate,
              variant: "primary",
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: spacing.lg }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Business Name *</Text>
                  <TextInput
                    value={createForm.name}
                    onChangeText={(text) => setCreateForm({ ...createForm, name: text })}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Email *</Text>
                  <TextInput
                    value={createForm.email}
                    onChangeText={(text) => setCreateForm({ ...createForm, email: text })}
                    keyboardType="email-address"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Category *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 8 }}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCreateForm({ ...createForm, category: cat })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: createForm.category === cat ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: createForm.category === cat ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: createForm.category === cat ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Merchant Type</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {MERCHANT_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        onPress={() => setCreateForm({ ...createForm, merchantType: type.value })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: createForm.merchantType === type.value ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: createForm.merchantType === type.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: createForm.merchantType === type.value ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 16 }}>
                    Address
                  </Text>
                  <InternationalAddressForm
                    value={createForm.address}
                    onChange={(address) => setCreateForm({ ...createForm, address: { ...createForm.address, ...address } })}
                    defaultCountry={createForm.address?.country || "US"}
                  />
                </View>

                <CurrencySelector
                  value={createForm.currency}
                  onChange={(currency) => setCreateForm({ ...createForm, currency })}
                  showBLKD={true}
                />

                <TaxIdSelector
                  value={createForm.taxIdentification}
                  onChange={(taxId) => setCreateForm({ ...createForm, taxIdentification: taxId })}
                  country={createForm.address?.country || "US"}
                />

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Website</Text>
                  <TextInput
                    value={createForm.website}
                    onChangeText={(text) => setCreateForm({ ...createForm, website: text })}
                    keyboardType="url"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>
            </View>
          </ScrollView>
        </AdminModal>

        {/* Delete Confirmation Modal */}
        <AdminModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Business"
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
            Are you sure you want to delete {selectedBusiness?.name}? This action cannot be undone.
          </Text>
        </AdminModal>
      </ScrollView>
    </View>
  );
}
