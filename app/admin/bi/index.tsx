import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BusinessMetrics } from '@/types/bi';
import { Pagination } from '@/components/admin/Pagination';

// Mock business metrics
const mockBusinessMetrics: BusinessMetrics[] = [
  {
    businessId: "business1",
    businessName: "Soul Food Kitchen",
    period: {
      start: "2024-02-01T00:00:00Z",
      end: "2024-02-29T23:59:59Z",
    },
    revenue: {
      total: 45000,
      currency: "USD",
      byCategory: [
        { category: "Food & Beverage", amount: 42000 },
        { category: "Catering", amount: 3000 },
      ],
      byProduct: [
        { productId: "p1", productName: "Signature Platter", amount: 15000, quantity: 500 },
        { productId: "p2", productName: "Family Meal", amount: 12000, quantity: 300 },
        { productId: "p3", productName: "Catering Service", amount: 3000, quantity: 15 },
      ],
    },
    transactions: {
      total: 815,
      successful: 800,
      failed: 10,
      refunded: 5,
      averageValue: 55.21,
    },
    customers: {
      total: 650,
      new: 120,
      returning: 530,
      averageOrderValue: 55.21,
    },
    growth: {
      revenueGrowth: 15.5,
      transactionGrowth: 12.3,
      customerGrowth: 8.7,
    },
  },
  {
    businessId: "business2",
    businessName: "Black Business Network",
    period: {
      start: "2024-02-01T00:00:00Z",
      end: "2024-02-29T23:59:59Z",
    },
    revenue: {
      total: 12500,
      currency: "USD",
      byCategory: [
        { category: "Membership", amount: 10000 },
        { category: "Events", amount: 2500 },
      ],
      byProduct: [
        { productId: "p4", productName: "Premium Membership", amount: 10000, quantity: 100 },
        { productId: "p5", productName: "Event Tickets", amount: 2500, quantity: 125 },
      ],
    },
    transactions: {
      total: 225,
      successful: 220,
      failed: 3,
      refunded: 2,
      averageValue: 55.56,
    },
    customers: {
      total: 180,
      new: 45,
      returning: 135,
      averageOrderValue: 55.56,
    },
    growth: {
      revenueGrowth: 22.1,
      transactionGrowth: 18.5,
      customerGrowth: 15.2,
    },
  },
];

export default function BusinessIntelligence() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [selectedBusiness, setSelectedBusiness] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const displayMetrics = selectedBusiness === "all" 
    ? mockBusinessMetrics 
    : mockBusinessMetrics.filter(m => m.businessId === selectedBusiness);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBusiness]);

  // Paginate display metrics
  const totalPages = Math.ceil(displayMetrics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMetrics = displayMetrics.slice(startIndex, endIndex);

  const aggregateMetrics = mockBusinessMetrics.reduce((acc, metric) => ({
    totalRevenue: acc.totalRevenue + metric.revenue.total,
    totalTransactions: acc.totalTransactions + metric.transactions.total,
    totalCustomers: acc.totalCustomers + metric.customers.total,
  }), { totalRevenue: 0, totalTransactions: 0, totalCustomers: 0 });

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
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
              letterSpacing: -1,
            }}
          >
            Business Intelligence
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Comprehensive analytics and insights for businesses
          </Text>
        </View>

        {/* Business Filter */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Select Business
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedBusiness("all")}
              style={{
                backgroundColor: selectedBusiness === "all" ? "#ba9988" : "#474747",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedBusiness === "all" ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedBusiness === "all" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                }}
              >
                All Businesses
              </Text>
            </TouchableOpacity>
            {mockBusinessMetrics.map((business) => (
              <TouchableOpacity
                key={business.businessId}
                onPress={() => setSelectedBusiness(business.businessId)}
                style={{
                  backgroundColor: selectedBusiness === business.businessId ? "#ba9988" : "#474747",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: selectedBusiness === business.businessId ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedBusiness === business.businessId ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {business.businessName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Aggregate Summary */}
        {selectedBusiness === "all" && (
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
                Total Revenue
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                ${aggregateMetrics.totalRevenue.toLocaleString()}
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
                Total Transactions
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "#4caf50",
                }}
              >
                {aggregateMetrics.totalTransactions.toLocaleString()}
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
                Total Customers
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "#2196f3",
                }}
              >
                {aggregateMetrics.totalCustomers.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Business Metrics Cards */}
        {paginatedMetrics.map((metrics) => (
          <View
            key={metrics.businessId}
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
                fontSize: 24,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 20,
              }}
            >
              {metrics.businessName}
            </Text>

            {/* Key Metrics */}
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Revenue
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  ${metrics.revenue.total.toLocaleString()} {metrics.revenue.currency}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4caf50",
                    marginTop: 4,
                  }}
                >
                  +{metrics.growth.revenueGrowth}% vs last period
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Transactions
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#4caf50",
                  }}
                >
                  {metrics.transactions.total.toLocaleString()}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4caf50",
                    marginTop: 4,
                  }}
                >
                  +{metrics.growth.transactionGrowth}% vs last period
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Customers
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#2196f3",
                  }}
                >
                  {metrics.customers.total.toLocaleString()}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4caf50",
                    marginTop: 4,
                  }}
                >
                  +{metrics.growth.customerGrowth}% vs last period
                </Text>
              </View>
            </View>

            {/* Revenue by Category */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Revenue by Category
              </Text>
              <View style={{ gap: 12 }}>
                {metrics.revenue.byCategory.map((category, index) => {
                  const percentage = (category.amount / metrics.revenue.total) * 100;
                  return (
                    <View key={index}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>
                          {category.category}
                        </Text>
                        <Text style={{ fontSize: 14, color: "#ba9988", fontWeight: "600" }}>
                          ${category.amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 8,
                          backgroundColor: "#232323",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            backgroundColor: "#ba9988",
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Top Products */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Top Products
              </Text>
              <View style={{ gap: 12 }}>
                {metrics.revenue.byProduct.map((product, index) => (
                  <View
                    key={product.productId}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: "#232323",
                      borderRadius: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>
                        {product.productName}
                      </Text>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>
                        {product.quantity} sold
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: "#ba9988", fontWeight: "700" }}>
                      ${product.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Transaction Stats */}
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Transaction Statistics
              </Text>
              <View
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                    Successful
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "700", color: "#4caf50" }}>
                    {metrics.transactions.successful}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                    Failed
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "700", color: "#f44336" }}>
                    {metrics.transactions.failed}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>
                    Avg. Value
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
                    ${metrics.transactions.averageValue.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push("/admin/bi/business-model")}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="business" size={32} color="#ba9988" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginTop: 12 }}>
              Business Model
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/admin/bi/transactions")}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="receipt" size={32} color="#ba9988" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginTop: 12 }}>
              Transaction Tracking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/admin/bi/user-behavior")}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="insights" size={32} color="#ba9988" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginTop: 12 }}>
              User Behavior
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/admin/bi/revenue-sharing")}
            style={{
              flex: 1,
              backgroundColor: "#474747",
              borderRadius: 12,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="account-balance" size={32} color="#ba9988" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff", marginTop: 12 }}>
              Revenue Sharing
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pagination */}
        {displayMetrics.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayMetrics.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </ScrollView>
    </View>
  );
}

