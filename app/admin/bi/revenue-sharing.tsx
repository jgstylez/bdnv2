import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { RevenueShare, RevenueShareSettings } from "../../../types/bi";
import { Pagination } from "../../../components/admin/Pagination";

// Mock revenue shares
const mockRevenueShares: RevenueShare[] = [
  {
    id: "rs1",
    businessId: "business1",
    businessName: "Soul Food Kitchen",
    period: {
      start: "2024-02-01T00:00:00Z",
      end: "2024-02-29T23:59:59Z",
    },
    totalRevenue: 45000,
    platformFee: 2250,
    platformFeePercentage: 5,
    businessShare: 42750,
    businessSharePercentage: 95,
    status: "completed",
    scheduledDate: "2024-03-01T00:00:00Z",
    processedDate: "2024-03-01T08:30:00Z",
    transactionId: "PAY-2024-001",
    paymentMethod: "Bank Transfer",
    currency: "USD",
    transactions: [
      { transactionId: "txn1", amount: 150, fee: 7.5, date: "2024-02-15T10:30:00Z" },
      { transactionId: "txn2", amount: 85, fee: 4.25, date: "2024-02-14T14:20:00Z" },
      { transactionId: "txn3", amount: 45, fee: 2.25, date: "2024-02-13T09:15:00Z" },
    ],
  },
  {
    id: "rs2",
    businessId: "business2",
    businessName: "Black Business Network",
    period: {
      start: "2024-02-01T00:00:00Z",
      end: "2024-02-29T23:59:59Z",
    },
    totalRevenue: 12500,
    platformFee: 625,
    platformFeePercentage: 5,
    businessShare: 11875,
    businessSharePercentage: 95,
    status: "processing",
    scheduledDate: "2024-03-01T00:00:00Z",
    currency: "USD",
    transactions: [
      { transactionId: "txn4", amount: 35, fee: 1.75, date: "2024-02-20T08:00:00Z" },
      { transactionId: "txn5", amount: 25, fee: 1.25, date: "2024-02-18T12:00:00Z" },
    ],
  },
  {
    id: "rs3",
    businessId: "business3",
    businessName: "Community Center",
    period: {
      start: "2024-02-01T00:00:00Z",
      end: "2024-02-29T23:59:59Z",
    },
    totalRevenue: 8500,
    platformFee: 425,
    platformFeePercentage: 5,
    businessShare: 8075,
    businessSharePercentage: 95,
    status: "pending",
    scheduledDate: "2024-03-01T00:00:00Z",
    currency: "USD",
    transactions: [
      { transactionId: "txn6", amount: 50, fee: 2.5, date: "2024-02-25T15:00:00Z" },
    ],
  },
];

const mockSettings: RevenueShareSettings = {
  platformFeePercentage: 5,
  minimumPayout: 100,
  payoutSchedule: "monthly",
  autoPayout: true,
  payoutMethod: "bank",
  holdPeriod: 0,
};

export default function RevenueSharing() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [filterStatus, setFilterStatus] = useState<"all" | RevenueShare["status"]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredShares = mockRevenueShares.filter((share) => {
    if (filterStatus === "all") return true;
    return share.status === filterStatus;
  });

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // Paginate filtered shares
  const totalPages = Math.ceil(filteredShares.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShares = filteredShares.slice(startIndex, endIndex);

  const totalPending = mockRevenueShares
    .filter((s) => s.status === "pending" || s.status === "processing")
    .reduce((sum, s) => sum + s.businessShare, 0);

  const totalProcessed = mockRevenueShares
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.businessShare, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: RevenueShare["status"]) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "processing":
        return "#ff9800";
      case "pending":
        return "#2196f3";
      case "failed":
        return "#f44336";
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20, alignSelf: "flex-start" }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>← Back</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
              letterSpacing: -1,
            }}
          >
            Revenue Sharing
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Automated distribution of fees and revenue sharing
          </Text>
        </View>

        {/* Summary Cards */}
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flex: 1,
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
              Total Pending Payouts
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#ff9800",
              }}
            >
              ${totalPending.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
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
              Total Processed
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#4caf50",
              }}
            >
              ${totalProcessed.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
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
              Platform Fee Rate
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#ba9988",
              }}
            >
              {mockSettings.platformFeePercentage}%
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Revenue Share Settings
          </Text>
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                Platform Fee Percentage
              </Text>
              <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                {mockSettings.platformFeePercentage}%
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                Minimum Payout
              </Text>
              <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                ${mockSettings.minimumPayout}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                Payout Schedule
              </Text>
              <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600", textTransform: "capitalize" }}>
                {mockSettings.payoutSchedule}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                Auto Payout
              </Text>
              <View
                style={{
                  backgroundColor: mockSettings.autoPayout ? "#4caf50" : "#474747",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#ffffff",
                    fontWeight: "600",
                  }}
                >
                  {mockSettings.autoPayout ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => alert("Edit settings")}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                Edit Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Filter */}
        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {(["all", "pending", "processing", "completed", "failed"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                style={{
                  backgroundColor: filterStatus === status ? "#ba9988" : "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: filterStatus === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: filterStatus === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    textTransform: "capitalize",
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Revenue Shares List */}
        {filteredShares.length > 0 ? (
          <View style={{ gap: 16 }}>
            {paginatedShares.map((share) => (
              <View
                key={share.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {share.businessName}
                    </Text>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)" }}>
                      {formatDate(share.period.start)} - {formatDate(share.period.end)}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: `${getStatusColor(share.status)}20`,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: getStatusColor(share.status),
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {share.status}
                    </Text>
                  </View>
                </View>

                {/* Financial Breakdown */}
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                      Total Revenue
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>
                      ${share.totalRevenue.toLocaleString()} {share.currency}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                      Platform Fee ({share.platformFeePercentage}%)
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#ff9800" }}>
                      ${share.platformFee.toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "rgba(186, 153, 136, 0.2)",
                      marginVertical: 12,
                    }}
                  />
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 16, color: "#ffffff", fontWeight: "600" }}>
                      Business Share ({share.businessSharePercentage}%)
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: "700", color: "#4caf50" }}>
                      ${share.businessShare.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Transaction Details */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 12,
                    }}
                  >
                    Transactions ({share.transactions.length})
                  </Text>
                  <View style={{ gap: 8 }}>
                    {share.transactions.map((txn, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          backgroundColor: "#232323",
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                          {txn.transactionId}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          ${txn.amount.toFixed(2)} (Fee: ${txn.fee.toFixed(2)})
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Payment Info */}
                {share.status === "completed" && (
                  <View
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                        Processed Date
                      </Text>
                      <Text style={{ fontSize: 12, color: "#ffffff" }}>
                        {share.processedDate ? formatDate(share.processedDate) : "N/A"}
                      </Text>
                    </View>
                    {share.transactionId && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                          Transaction ID
                        </Text>
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>{share.transactionId}</Text>
                      </View>
                    )}
                    {share.paymentMethod && (
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                          Payment Method
                        </Text>
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>{share.paymentMethod}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Actions */}
                {share.status === "pending" && (
                  <TouchableOpacity
                    onPress={() => alert(`Process payout for ${share.businessName}`)}
                    style={{
                      backgroundColor: "#ba9988",
                      borderRadius: 12,
                      paddingVertical: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                      Process Payout
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
            <MaterialIcons name="account-balance" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No Revenue Shares Found
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
              }}
            >
              Try adjusting your filters
            </Text>
          </View>
        )}

        {/* Pagination */}
        {filteredShares.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredShares.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </ScrollView>
    </View>
  );
}

