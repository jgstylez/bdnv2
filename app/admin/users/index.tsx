import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { AdminDataCard } from '@/components/admin/AdminDataCard';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "merchant" | "nonprofit" | "admin";
  status: "active" | "inactive" | "suspended" | "pending";
  createdAt: string;
  lastLogin?: string;
  totalSpent?: number;
  totalOrders?: number;
}

// Mock users
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(404) 555-0123",
    role: "user",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-02-20",
    totalSpent: 1250.00,
    totalOrders: 15,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(312) 555-0456",
    role: "merchant",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-02-19",
    totalSpent: 0,
    totalOrders: 0,
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2023-12-01",
    lastLogin: "2024-01-05",
    totalSpent: 450.00,
    totalOrders: 8,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "(212) 555-0789",
    role: "nonprofit",
    status: "active",
    createdAt: "2024-02-01",
    lastLogin: "2024-02-21",
    totalSpent: 0,
    totalOrders: 0,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "user",
    status: "suspended",
    createdAt: "2023-11-15",
    lastLogin: "2024-02-10",
    totalSpent: 890.00,
    totalOrders: 12,
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(415) 555-0321",
    role: "merchant",
    status: "pending",
    createdAt: "2024-02-18",
    totalSpent: 0,
    totalOrders: 0,
  },
];

export default function UserManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "inactive":
        return "rgba(255, 255, 255, 0.5)";
      case "suspended":
        return "#ff4444";
      case "pending":
        return "#ffd700";
      default:
        return "rgba(255, 255, 255, 0.5)";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#ba9988";
      case "merchant":
        return "#2196f3";
      case "nonprofit":
        return "#e91e63";
      case "user":
        return "#4caf50";
      default:
        return colors.accent;
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
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
    if (!createForm.name || !createForm.email) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Create via API
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: createForm.name,
      email: createForm.email,
      phone: createForm.phone || undefined,
      role: createForm.role,
      status: createForm.status,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    setCreateForm({
      name: "",
      email: "",
      phone: "",
      role: "user",
      status: "active",
    });
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
            User Management
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Manage user accounts, roles, and permissions. View user activity and handle account status.
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
              Create User
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
              placeholder="Search users..."
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
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "suspended", label: "Suspended" },
                { value: "pending", label: "Pending" },
              ]}
              value={selectedStatus}
              onSelect={(value) => setSelectedStatus(value)}
            />
            <FilterDropdown
              label="Role"
              options={[
                { value: "", label: "All Roles" },
                { value: "user", label: "User" },
                { value: "merchant", label: "Merchant" },
                { value: "nonprofit", label: "Nonprofit" },
                { value: "admin", label: "Admin" },
              ]}
              value={selectedRole}
              onSelect={(value) => setSelectedRole(value)}
            />
          </View>
        </View>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <View style={{ gap: 16 }}>
            {paginatedUsers.map((user) => {
              const statusColor = getStatusColor(user.status);
              const roleColor = getRoleColor(user.role);
              const actions: Array<{
                label: string;
                icon: keyof typeof MaterialIcons.glyphMap;
                onPress: () => void;
                variant: "primary" | "secondary" | "danger" | "info";
              }> = [
                {
                  label: "Edit",
                  icon: "edit",
                  onPress: () => handleEdit(user),
                  variant: "secondary",
                },
                {
                  label: user.status === "suspended" ? "Activate" : "Suspend",
                  icon: (user.status === "suspended" ? "check-circle" : "block") as keyof typeof MaterialIcons.glyphMap,
                  onPress: () => handleSuspend(user),
                  variant: (user.status === "suspended" ? "primary" : "danger") as "primary" | "danger",
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
              ];

              return (
                <AdminDataCard
                  key={user.id}
                  title={user.name}
                  subtitle={`${user.email}${user.phone ? ` • ${user.phone}` : ""}`}
                  badges={[
                    {
                      label: user.role,
                      color: roleColor,
                      backgroundColor: `${roleColor}20`,
                    },
                    {
                      label: user.status,
                      color: statusColor,
                      backgroundColor: `${statusColor}20`,
                    },
                  ]}
                  actions={actions}
                >
                  {user.lastLogin && (
                    <View style={{ marginTop: spacing.sm }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.tertiary,
                        }}
                      >
                        Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        {user.totalOrders !== undefined && user.totalOrders > 0 && (
                          ` • ${user.totalOrders} orders${user.totalSpent ? ` • $${user.totalSpent.toFixed(2)} spent` : ""}`
                        )}
                      </Text>
                    </View>
                  )}
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
            <MaterialIcons name="people" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
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

        {/* Create User Modal */}
        <AdminModal
          visible={showCreateModal}
          title="Create New User"
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm({
              name: "",
              email: "",
              phone: "",
              role: "user",
              status: "active",
            });
          }}
          actions={[
            {
              label: "Cancel",
              onPress: () => {
                setShowCreateModal(false);
                setCreateForm({
                  name: "",
                  email: "",
                  phone: "",
                  role: "user",
                  status: "active",
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
          <View style={{ gap: spacing.lg }}>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Name *
              </Text>
              <TextInput
                value={createForm.name}
                onChangeText={(text) => setCreateForm({ ...createForm, name: text })}
                placeholder="Enter name"
                placeholderTextColor={colors.text.placeholder}
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Email *
              </Text>
              <TextInput
                value={createForm.email}
                onChangeText={(text) => setCreateForm({ ...createForm, email: text })}
                placeholder="Enter email"
                placeholderTextColor={colors.text.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Phone
              </Text>
              <TextInput
                value={createForm.phone}
                onChangeText={(text) => setCreateForm({ ...createForm, phone: text })}
                placeholder="Enter phone"
                placeholderTextColor={colors.text.placeholder}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Role
              </Text>
              <FilterDropdown
                label=""
                options={[
                  { value: "user", label: "User" },
                  { value: "merchant", label: "Merchant" },
                  { value: "nonprofit", label: "Nonprofit" },
                  { value: "admin", label: "Admin" },
                ]}
                value={createForm.role}
                onSelect={(value) => setCreateForm({ ...createForm, role: value as User["role"] })}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Status
              </Text>
              <FilterDropdown
                label=""
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "pending", label: "Pending" },
                ]}
                value={createForm.status}
                onSelect={(value) => setCreateForm({ ...createForm, status: value as User["status"] })}
              />
            </View>
          </View>
        </AdminModal>

        {/* Edit User Modal */}
        <AdminModal
          visible={showEditModal}
          title="Edit User"
          onClose={() => setShowEditModal(false)}
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
          <View style={{ gap: spacing.lg }}>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Name *
              </Text>
              <TextInput
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="Enter name"
                placeholderTextColor={colors.text.placeholder}
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Email *
              </Text>
              <TextInput
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                placeholder="Enter email"
                placeholderTextColor={colors.text.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Phone
              </Text>
              <TextInput
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                placeholder="Enter phone"
                placeholderTextColor={colors.text.placeholder}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: colors.input,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontSize: typography.fontSize.base,
                  color: colors.text.primary,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Role
              </Text>
              <FilterDropdown
                label=""
                options={[
                  { value: "user", label: "User" },
                  { value: "merchant", label: "Merchant" },
                  { value: "nonprofit", label: "Nonprofit" },
                  { value: "admin", label: "Admin" },
                ]}
                value={editForm.role}
                onSelect={(value) => setEditForm({ ...editForm, role: value as User["role"] })}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xs }}>
                Status
              </Text>
              <FilterDropdown
                label=""
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "suspended", label: "Suspended" },
                  { value: "pending", label: "Pending" },
                ]}
                value={editForm.status}
                onSelect={(value) => setEditForm({ ...editForm, status: value as User["status"] })}
              />
            </View>
          </View>
        </AdminModal>

        {/* Delete Confirmation Modal */}
        <AdminModal
          visible={showDeleteModal}
          title="Delete User"
          onClose={() => setShowDeleteModal(false)}
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
          <Text style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </Text>
        </AdminModal>
      </ScrollView>
    </View>
  );
}
