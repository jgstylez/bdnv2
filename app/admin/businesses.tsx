import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { BusinessManagementFilters } from '@/types/admin';
import { MerchantType } from '@/types/merchant';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { InternationalAddress, CountryCode, Currency, TaxIdentification } from '@/types/international';
import { BusinessList, Business } from '@/components/admin/businesses/BusinessList';
import { BusinessModal } from '@/components/admin/businesses/BusinessModal';

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
            Business Management
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Approve and manage merchant accounts. Edit business information and handle applications.
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
              Create Business
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
              placeholder="Search businesses..."
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
          <BusinessList
            businesses={paginatedBusinesses}
            onEdit={handleEdit}
            onApprove={handleApprove}
            onReject={handleReject}
            onSuspend={handleSuspend}
            onDelete={(business) => {
              setSelectedBusiness(business);
              setShowDeleteModal(true);
            }}
            getStatusColor={getStatusColor}
          />
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
            <MaterialIcons name="store" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
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
        <BusinessModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          isEditing={true}
          onSave={handleSaveEdit}
          form={editForm}
          setForm={setEditForm}
        />

        {/* Create Business Modal */}
        <BusinessModal
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
          isEditing={false}
          onSave={handleCreate}
          form={createForm}
          setForm={setCreateForm}
        />

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
