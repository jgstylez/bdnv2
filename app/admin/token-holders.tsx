import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Platform, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FilterDropdown } from '@/components/admin/FilterDropdown';
import { AdminDataCard } from '@/components/admin/AdminDataCard';
import { AdminModal } from '@/components/admin/AdminModal';
import { Pagination } from '@/components/admin/Pagination';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface TokenHolder {
  id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  tokenType: "BLKD" | "BDN" | "other";
  balance: number;
  status: "active" | "suspended" | "frozen";
  joinedDate: string;
  totalTransactions: number;
  lastActivity?: string;
}

// Mock token holders
const mockTokenHolders: TokenHolder[] = [
  {
    id: "1",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    name: "John Doe",
    email: "john@example.com",
    tokenType: "BLKD",
    balance: 12500.50,
    status: "active",
    joinedDate: "2024-01-15",
    totalTransactions: 45,
    lastActivity: "2024-06-15",
  },
  {
    id: "2",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    tokenType: "BDN",
    balance: 5432.18,
    status: "active",
    joinedDate: "2024-01-10",
    totalTransactions: 23,
    lastActivity: "2024-06-14",
  },
  {
    id: "3",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    name: "Marcus Williams",
    email: "marcus@example.com",
    tokenType: "BLKD",
    balance: 8900.00,
    status: "frozen",
    joinedDate: "2023-12-20",
    totalTransactions: 67,
    lastActivity: "2024-05-20",
  },
  {
    id: "4",
    walletAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
    tokenType: "BDN",
    balance: 2500.75,
    status: "active",
    joinedDate: "2024-02-05",
    totalTransactions: 12,
    lastActivity: "2024-06-10",
  },
];

export default function TokenHoldersManagement() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    tokenType?: "BLKD" | "BDN" | "other";
    status?: "active" | "suspended" | "frozen";
  }>({});
  const [selectedHolder, setSelectedHolder] = useState<TokenHolder | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>(mockTokenHolders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "active" as "active" | "suspended" | "frozen",
  });

  const filteredHolders = tokenHolders.filter((holder) => {
    const matchesSearch = searchQuery === "" || 
      holder.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holder.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holder.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filters.tokenType || holder.tokenType === filters.tokenType;
    const matchesStatus = !filters.status || holder.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHolders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHolders = filteredHolders.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters.tokenType, filters.status]);

  const handleEdit = (holder: TokenHolder) => {
    setSelectedHolder(holder);
    setEditForm({
      name: holder.name || "",
      email: holder.email || "",
      status: holder.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedHolder) {
      alert("Please select a token holder");
      return;
    }
    // TODO: Save via API
    setTokenHolders(tokenHolders.map(h => 
      h.id === selectedHolder.id 
        ? { ...h, ...editForm } 
        : h
    ));
    setShowEditModal(false);
    setSelectedHolder(null);
    alert("Token holder updated successfully");
  };

  const handleFreeze = () => {
    if (!selectedHolder) return;
    // TODO: Freeze via API
    setTokenHolders(tokenHolders.map(h => 
      h.id === selectedHolder.id 
        ? { ...h, status: h.status === "frozen" ? "active" : "frozen" } 
        : h
    ));
    setShowFreezeModal(false);
    setSelectedHolder(null);
    alert(selectedHolder.status === "frozen" ? "Token holder activated" : "Token holder frozen");
  };

  const handleSuspend = (holder: TokenHolder) => {
    // TODO: Suspend via API
    setTokenHolders(tokenHolders.map(h => 
      h.id === holder.id 
        ? { ...h, status: h.status === "suspended" ? "active" : "suspended" } 
        : h
    ));
    alert(holder.status === "suspended" ? "Token holder activated" : "Token holder suspended");
  };

  const copyAddress = (address: string) => {
    // TODO: Copy to clipboard
    alert(`Address copied: ${address}`);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
            Token Holders Management
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Manage token holders, balances, and account status
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32, flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => alert("Export functionality coming soon")}
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flex: isMobile ? 1 : 0,
              minWidth: isMobile ? "100%" : 200,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="download" size={24} color="#ba9988" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Export Data
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
              placeholder="Search by wallet address, name, or email..."
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
              label="Token Type"
              options={[
                { value: "", label: "All Types" },
                { value: "BLKD", label: "BLKD" },
                { value: "BDN", label: "BDN" },
                { value: "other", label: "Other" },
              ]}
              value={filters.tokenType || ""}
              onSelect={(value) => setFilters({ ...filters, tokenType: value === "" ? undefined : value as any })}
            />
            <FilterDropdown
              label="Status"
              options={[
                { value: "", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "suspended", label: "Suspended" },
                { value: "frozen", label: "Frozen" },
              ]}
              value={filters.status || ""}
              onSelect={(value) => setFilters({ ...filters, status: value === "" ? undefined : value as any })}
            />
          </View>
        </View>

        {/* Stats Summary */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Total Holders
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {tokenHolders.length.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Total Balance
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {tokenHolders.reduce((sum, h) => sum + h.balance, 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View
            style={{
              flex: isMobile ? 1 : 1,
              minWidth: isMobile ? "47%" : undefined,
              maxWidth: isMobile ? "47%" : undefined,
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
              }}
            >
              Active Holders
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              {tokenHolders.filter(h => h.status === "active").length}
            </Text>
          </View>
        </View>

        {/* Token Holders List */}
        <View style={{ gap: 16 }}>
          {paginatedHolders.length === 0 ? (
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
              <MaterialIcons name="account-balance-wallet" size={48} color="rgba(186, 153, 136, 0.5)" />
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No token holders found
              </Text>
            </View>
          ) : (
            paginatedHolders.map((holder) => (
              <AdminDataCard
                key={holder.id}
                title={holder.name || formatAddress(holder.walletAddress)}
                subtitle={`${holder.email || holder.walletAddress} • ${holder.tokenType} • Balance: ${holder.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • Transactions: ${holder.totalTransactions} • Joined: ${holder.joinedDate}`}
                actions={[
                  {
                    label: holder.status === "frozen" ? "Unfreeze" : "Freeze",
                    icon: holder.status === "frozen" ? "lock-open" : "lock",
                    onPress: () => {
                      setSelectedHolder(holder);
                      setShowFreezeModal(true);
                    },
                    variant: holder.status === "frozen" ? "primary" : "secondary",
                  },
                  {
                    label: holder.status === "suspended" ? "Activate" : "Suspend",
                    icon: holder.status === "suspended" ? "check-circle" : "block",
                    onPress: () => handleSuspend(holder),
                    variant: holder.status === "suspended" ? "primary" : "secondary",
                  },
                  {
                    label: "Edit",
                    icon: "edit",
                    onPress: () => handleEdit(holder),
                    variant: "secondary",
                  },
                  {
                    label: "Copy Address",
                    icon: "content-copy",
                    onPress: () => copyAddress(holder.walletAddress),
                    variant: "secondary",
                  },
                ]}
              />
            ))
          )}
        </View>

        {/* Pagination */}
        {filteredHolders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredHolders.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Edit Modal */}
        <AdminModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedHolder(null);
          }}
          title="Edit Token Holder"
        >
          <View style={{ gap: spacing.md }}>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.weights.semibold as any, color: colors.text.primary, marginBottom: spacing.xs }}>
                Wallet Address
              </Text>
              <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
                {selectedHolder?.walletAddress}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.weights.semibold as any, color: colors.text.primary, marginBottom: spacing.xs }}>
                Name
              </Text>
              <TextInput
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="Enter name (optional)"
                placeholderTextColor={colors.text.placeholder}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.weights.semibold as any, color: colors.text.primary, marginBottom: spacing.xs }}>
                Email
              </Text>
              <TextInput
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                placeholder="Enter email (optional)"
                placeholderTextColor={colors.text.placeholder}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.weights.semibold as any, color: colors.text.primary, marginBottom: spacing.xs }}>
                Status
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                {(["active", "suspended", "frozen"] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setEditForm({ ...editForm, status })}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      backgroundColor: editForm.status === status ? colors.accent : colors.secondary,
                      borderWidth: 1,
                      borderColor: editForm.status === status ? colors.accent : colors.border,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.weights.semibold as any,
                        color: editForm.status === status ? colors.text.primary : colors.text.secondary,
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setSelectedHolder(null);
                }}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.secondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.weights.semibold as any, color: colors.text.primary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.accent,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.weights.semibold as any, color: colors.text.primary }}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AdminModal>

        {/* Freeze Modal */}
        <AdminModal
          visible={showFreezeModal}
          onClose={() => {
            setShowFreezeModal(false);
            setSelectedHolder(null);
          }}
          title={selectedHolder?.status === "frozen" ? "Unfreeze Token Holder" : "Freeze Token Holder"}
        >
          <View style={{ gap: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
              {selectedHolder?.status === "frozen"
                ? "Are you sure you want to unfreeze this token holder? They will be able to make transactions again."
                : "Are you sure you want to freeze this token holder? They will not be able to make transactions until unfrozen."}
            </Text>
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <TouchableOpacity
                onPress={() => {
                  setShowFreezeModal(false);
                  setSelectedHolder(null);
                }}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.secondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.weights.semibold as any, color: colors.text.primary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFreeze}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.status.warning,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.weights.semibold as any, color: colors.text.primary }}>
                  {selectedHolder?.status === "frozen" ? "Unfreeze" : "Freeze"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AdminModal>
      </ScrollView>
    </View>
  );
}

