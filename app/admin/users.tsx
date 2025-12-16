import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Platform, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { UserManagementFilters } from "../../types/admin";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { FilterDropdown } from "../../components/admin/FilterDropdown";
import { AdminDataCard } from "../../components/admin/AdminDataCard";
import { AdminModal } from "../../components/admin/AdminModal";
import { Pagination } from "../../components/admin/Pagination";
import { useResponsive } from "../../hooks/useResponsive";
import { colors, spacing, typography, borderRadius } from "../../constants/theme";

import { CountryCode } from "../../types/international";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneCountryCode?: CountryCode;
  userType: "consumer" | "business" | "nonprofit";
  level: string;
  status: "active" | "suspended" | "deleted";
  joinedDate: string;
  totalSpent: number;
  points?: number;
  privacySettings?: {
    profileVisible: boolean;
    emailVisible: boolean;
    analyticsOptIn: boolean;
  };
}

// Mock users
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    userType: "consumer",
    level: "Bronze",
    status: "active",
    joinedDate: "2024-01-15",
    totalSpent: 1250.50,
    points: 1250,
    privacySettings: {
      profileVisible: true,
      emailVisible: false,
      analyticsOptIn: true,
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    userType: "business",
    level: "Silver",
    status: "active",
    joinedDate: "2024-01-10",
    totalSpent: 5432.18,
    points: 5000,
    privacySettings: {
      profileVisible: true,
      emailVisible: true,
      analyticsOptIn: true,
    },
  },
  {
    id: "3",
    name: "Marcus Williams",
    email: "marcus@example.com",
    phone: "(555) 345-6789",
    userType: "consumer",
    level: "Gold",
    status: "suspended",
    joinedDate: "2023-12-20",
    totalSpent: 8900.00,
    points: 15000,
    privacySettings: {
      profileVisible: false,
      emailVisible: false,
      analyticsOptIn: false,
    },
  },
];

export default function UserManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UserManagementFilters>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "consumer" as "consumer" | "business" | "nonprofit",
    level: "Basic",
    status: "active" as "active" | "suspended" | "deleted",
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "consumer" as "consumer" | "business" | "nonprofit",
    password: "",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    const matchesType = !filters.userType || user.userType === filters.userType;
    const matchesStatus = !filters.status || user.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters.userType, filters.status]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      userType: user.userType,
      level: user.level,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedUser || !editForm.name || !editForm.email) {
      alert("Please fill in required fields");
      return;
    }
    // TODO: Save via API
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
    setShowEditModal(false);
    setSelectedUser(null);
    alert("User updated successfully");
  };

  const handleCreate = () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Create via API
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: createForm.name,
      email: createForm.email,
      phone: createForm.phone || undefined,
      userType: createForm.userType,
      level: "Basic",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      totalSpent: 0,
      points: 0,
      privacySettings: {
        profileVisible: true,
        emailVisible: false,
        analyticsOptIn: true,
      },
    };
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    setCreateForm({ name: "", email: "", phone: "", userType: "consumer", password: "" });
    alert("User created successfully");
  };

  const handleSuspend = (user: User) => {
    // TODO: Suspend via API
    setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u));
    alert(user.status === "suspended" ? "User activated" : "User suspended");
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    // TODO: Delete via API
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    alert("User deleted successfully");
  };

  const handlePrivacyUpdate = (user: User, setting: "profileVisible" | "emailVisible" | "analyticsOptIn", value: boolean) => {
    // TODO: Update via API
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, privacySettings: { ...(u.privacySettings || { profileVisible: true, emailVisible: false, analyticsOptIn: true }), [setting]: value } }
        : u
    ));
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
          title="User Management"
          description="Manage users, accounts, permissions, and privacy settings"
          actionButton={{
            label: "Create User",
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
              placeholder="Search users..."
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
              label="User Type"
              options={[
                { value: "", label: "All Types" },
                { value: "consumer", label: "Consumers" },
                { value: "business", label: "Businesses" },
                { value: "nonprofit", label: "Nonprofits" },
              ]}
              value={filters.userType || ""}
              onSelect={(value) => setFilters({ ...filters, userType: value === "" ? undefined : value as any })}
            />
            <FilterDropdown
              label="Status"
              options={[
                { value: "", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "suspended", label: "Suspended" },
              ]}
              value={filters.status || ""}
              onSelect={(value) => setFilters({ ...filters, status: value === "" ? undefined : value as any })}
            />
          </View>
        </View>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {paginatedUsers.map((user) => (
              <AdminDataCard
                key={user.id}
                title={user.name}
                subtitle={`${user.email}${user.phone ? ` • ${user.phone}` : ""}`}
                badges={[
                  {
                    label: user.userType,
                    color: colors.accent,
                    backgroundColor: colors.accentLight,
                  },
                  {
                    label: user.level,
                    color: colors.accent,
                    backgroundColor: colors.accentLight,
                  },
                  {
                    label: user.status,
                    color: user.status === "active" ? colors.status.success : colors.status.error,
                    backgroundColor: user.status === "active" ? colors.status.successLight : colors.status.errorLight,
                  },
                ]}
                actions={[
                  {
                    label: "Edit",
                    icon: "edit",
                    onPress: () => handleEdit(user),
                    variant: "secondary",
                  },
                  {
                    label: "Privacy",
                    icon: "privacy-tip",
                    onPress: () => {
                      setSelectedUser(user);
                      setShowPrivacyModal(true);
                    },
                    variant: "info",
                  },
                  {
                    label: user.status === "suspended" ? "Activate" : "Suspend",
                    icon: user.status === "suspended" ? "check-circle" : "block",
                    onPress: () => handleSuspend(user),
                    variant: user.status === "suspended" ? "primary" : "danger",
                  },
                  {
                    label: "Delete",
                    icon: "delete",
                    onPress: () => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    },
                    variant: "danger",
                  },
                ]}
              />
            ))}
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
            <MaterialIcons name="people" size={48} color={colors.accentLight} />
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                color: colors.text.tertiary,
                textAlign: "center",
                marginTop: spacing.lg,
              }}
            >
              No users found
            </Text>
          </View>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Edit User Modal */}
        <AdminModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit User"
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
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Name *</Text>
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
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>User Type</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["consumer", "business", "nonprofit"] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setEditForm({ ...editForm, userType: type })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: editForm.userType === type ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: editForm.userType === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: editForm.userType === type ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            textTransform: "capitalize",
                          }}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Level</Text>
                  <TextInput
                    value={editForm.level}
                    onChangeText={(text) => setEditForm({ ...editForm, level: text })}
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
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Status</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["active", "suspended"] as const).map((status) => (
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
        </AdminModal>

        {/* Create User Modal */}
        <AdminModal
          visible={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm({ name: "", email: "", phone: "", userType: "consumer", password: "" });
          }}
          title="Create New User"
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowCreateModal(false);
                setCreateForm({ name: "", email: "", phone: "", userType: "consumer", password: "" });
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
          <View style={{ gap: spacing.lg }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Name *</Text>
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
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Phone</Text>
                  <TextInput
                    value={createForm.phone}
                    onChangeText={(text) => setCreateForm({ ...createForm, phone: text })}
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
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Password *</Text>
                  <TextInput
                    value={createForm.password}
                    onChangeText={(text) => setCreateForm({ ...createForm, password: text })}
                    secureTextEntry
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
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>User Type</Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {(["consumer", "business", "nonprofit"] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setCreateForm({ ...createForm, userType: type })}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: createForm.userType === type ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor: createForm.userType === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: createForm.userType === type ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                            textTransform: "capitalize",
                          }}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
          </View>
        </AdminModal>

        {/* Delete Confirmation Modal */}
        <AdminModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete User"
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
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </Text>
        </AdminModal>

        {/* Privacy Settings Modal */}
        <AdminModal
          visible={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          title="Privacy Settings"
          maxWidth={500}
          actions={[
            {
              label: "Close",
              onPress: () => setShowPrivacyModal(false),
              variant: "primary",
            },
          ]}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
            }}
          >
            {selectedUser?.name}
          </Text>

          {selectedUser?.privacySettings && (
            <View style={{ gap: spacing.lg }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                        Profile Visible
                      </Text>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                        Allow others to see profile information
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedUser?.privacySettings) {
                          handlePrivacyUpdate(selectedUser, "profileVisible", !selectedUser.privacySettings.profileVisible);
                        }
                      }}
                      style={{
                        width: 50,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: selectedUser?.privacySettings?.profileVisible ? "#4caf50" : "#474747",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: "#ffffff",
                          transform: [{ translateX: selectedUser?.privacySettings?.profileVisible ? 20 : 0 }],
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                        Email Visible
                      </Text>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                        Allow others to see email address
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedUser?.privacySettings) {
                          handlePrivacyUpdate(selectedUser, "emailVisible", !selectedUser.privacySettings.emailVisible);
                        }
                      }}
                      style={{
                        width: 50,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: selectedUser?.privacySettings?.emailVisible ? "#4caf50" : "#474747",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: "#ffffff",
                          transform: [{ translateX: selectedUser?.privacySettings?.emailVisible ? 20 : 0 }],
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                        Analytics Opt-In
                      </Text>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                        Allow data collection for analytics
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedUser?.privacySettings) {
                          handlePrivacyUpdate(selectedUser, "analyticsOptIn", !selectedUser.privacySettings.analyticsOptIn);
                        }
                      }}
                      style={{
                        width: 50,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: selectedUser?.privacySettings?.analyticsOptIn ? "#4caf50" : "#474747",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: "#ffffff",
                          transform: [{ translateX: selectedUser?.privacySettings?.analyticsOptIn ? 20 : 0 }],
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

        </AdminModal>
      </ScrollView>
    </View>
  );
}
