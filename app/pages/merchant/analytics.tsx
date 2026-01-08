import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { HeroSection } from '@/components/layouts/HeroSection';
import { useResponsive } from '@/hooks/useResponsive';
import { SalesMetrics, CustomerInsight, PerformanceMetric } from '@/types/merchant';
import { ReviewAnalytics, REVIEW_REASONS } from '@/types/review';
import { platformValues, isAndroid } from "../../../utils/platform";

// Mock analytics data
const mockSalesMetrics: SalesMetrics = {
  totalSales: 45230.50,
  totalOrders: 342,
  averageOrderValue: 132.25,
  period: "monthly",
  dateRange: {
    start: "2024-02-01",
    end: "2024-02-29",
  },
};

const mockCustomerInsights: CustomerInsight = {
  totalCustomers: 189,
  newCustomers: 23,
  returningCustomers: 166,
  averageCustomerValue: 239.31,
};

const mockPerformanceMetrics: PerformanceMetric[] = [
  { metric: "Sales Growth", value: 15.3, change: 5.2, trend: "up" },
  { metric: "Customer Retention", value: 87.8, change: 2.1, trend: "up" },
  { metric: "Average Order Value", value: 132.25, change: -3.5, trend: "down" },
  { metric: "Conversion Rate", value: 12.4, change: 1.2, trend: "up" },
];

const mockReviewAnalytics: ReviewAnalytics = {
  businessId: "1",
  totalReviews: 127,
  averageRating: 4.8,
  ratingDistribution: {
    5: 89,
    4: 28,
    3: 7,
    2: 2,
    1: 1,
  },
  npsScore: 72, // (Promoters - Detractors) / Total * 100
  npsBreakdown: {
    promoters: 89, // 9-10
    passives: 28, // 7-8
    detractors: 10, // 0-6
  },
  topPositiveReasons: [
    { reason: "excellent-service", count: 78 },
    { reason: "great-quality", count: 65 },
    { reason: "friendly-staff", count: 52 },
    { reason: "good-value", count: 41 },
    { reason: "recommend-to-friends", count: 38 },
  ],
  topNegativeReasons: [
    { reason: "slow-service", count: 5 },
    { reason: "overpriced", count: 3 },
  ],
  responseRate: 45.7, // Percentage of reviews with business responses
  averageResponseTime: 18.5, // Hours
  recentTrends: [
    { period: "Jan 2024", averageRating: 4.7, reviewCount: 32 },
    { period: "Feb 2024", averageRating: 4.8, reviewCount: 45 },
    { period: "Mar 2024", averageRating: 4.9, reviewCount: 50 },
  ],
};

export default function Analytics() {
  const { width } = useWindowDimensions();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  
  // Calculate card width for mobile (2 columns with gap)
  // Each card should be (container width - gap) / 2
  // Container width = screen width - (paddingHorizontal * 2)
  const containerWidth = width - (paddingHorizontal * 2);
  const cardWidth = isMobile ? (containerWidth - 12) / 2 : undefined;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      default:
        return "trending-flat";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "#4caf50";
      case "down":
        return "#ff4444";
      default:
        return "rgba(255, 255, 255, 0.6)";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={isAndroid}
        bounces={platformValues.scrollViewBounces}
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        {/* Hero Section */}
        <HeroSection
          title="Analytics"
          subtitle="Track your business performance, sales metrics, and customer insights"
        />

        {/* Period Selector */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {(["daily", "weekly", "monthly", "yearly"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              activeOpacity={platformValues.touchOpacity}
              hitSlop={platformValues.hitSlop}
              style={{
                flex: 1,
                backgroundColor: selectedPeriod === period ? "#ba9988" : "transparent",
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: selectedPeriod === period ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  textTransform: "capitalize",
                }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sales Metrics */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Sales Overview
          </Text>
          {isMobile ? (
            <View style={{ gap: 12 }}>
              {/* Total Sales - Full Width */}
          <View
            style={{
                  width: "100%",
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
                Total Sales
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                {formatCurrency(mockSalesMetrics.totalSales)}
              </Text>
            </View>
              {/* Total Orders and Avg Order Value - Side by Side */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
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
                Total Orders
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                {mockSalesMetrics.totalOrders}
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
                Avg Order Value
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#ba9988",
                }}
              >
                {formatCurrency(mockSalesMetrics.averageOrderValue)}
              </Text>
            </View>
          </View>
        </View>
          ) : (
            <View
            style={{
                flexDirection: "row",
                gap: 12,
            }}
          >
              {/* Total Sales */}
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
                  Total Sales
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {formatCurrency(mockSalesMetrics.totalSales)}
                </Text>
              </View>
              {/* Total Orders */}
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
                  Total Orders
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockSalesMetrics.totalOrders}
                </Text>
              </View>
              {/* Avg Order Value */}
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
                  Avg Order Value
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {formatCurrency(mockSalesMetrics.averageOrderValue)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Performance Metrics */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Performance Metrics
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {mockPerformanceMetrics.map((metric, index) => (
              <View
                key={index}
                style={{
                  flex: isMobile ? `0 0 ${cardWidth}px` : 1,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Label and Trend - Side by Side */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {metric.metric}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <MaterialIcons name={getTrendIcon(metric.trend) as any} size={20} color={getTrendColor(metric.trend)} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: getTrendColor(metric.trend),
                      }}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change.toFixed(1)}%
                    </Text>
                  </View>
                </View>
                {/* Value - Full Width */}
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  {typeof metric.value === "number" && metric.value < 100
                    ? `${metric.value.toFixed(1)}%`
                    : formatCurrency(metric.value)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Insights */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Customer Insights
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                gap: 20,
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
                  Total Customers
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockCustomerInsights.totalCustomers}
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
                  New Customers
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#4caf50",
                  }}
                >
                  {mockCustomerInsights.newCustomers}
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
                  Returning Customers
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockCustomerInsights.returningCustomers}
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
                  Avg Customer Value
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {formatCurrency(mockCustomerInsights.averageCustomerValue)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Review Analytics */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Review Analytics
          </Text>

          {/* NPS Score */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Net Promoter Score (NPS)
                </Text>
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: "800",
                    color: mockReviewAnalytics.npsScore >= 50 ? "#4caf50" : mockReviewAnalytics.npsScore >= 0 ? "#ffd700" : "#ff4444",
                  }}
                >
                  {mockReviewAnalytics.npsScore}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginTop: 4,
                  }}
                >
                  {mockReviewAnalytics.npsScore >= 50
                    ? "Excellent"
                    : mockReviewAnalytics.npsScore >= 0
                    ? "Good"
                    : "Needs Improvement"}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#4caf50",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Promoters: {mockReviewAnalytics.npsBreakdown.promoters}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#ffd700",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Passives: {mockReviewAnalytics.npsBreakdown.passives}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#ff4444",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Detractors: {mockReviewAnalytics.npsBreakdown.detractors}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Review Summary */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Review Summary
            </Text>
            <View style={{ flexDirection: isMobile ? "column" : "row", gap: 16, marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Total Reviews
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockReviewAnalytics.totalReviews}
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
                  Average Rating
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "700",
                      color: "#ba9988",
                    }}
                  >
                    {mockReviewAnalytics.averageRating.toFixed(1)}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <MaterialIcons
                        key={star}
                        name={star <= Math.round(mockReviewAnalytics.averageRating) ? "star" : "star-border"}
                        size={20}
                        color={star <= Math.round(mockReviewAnalytics.averageRating) ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  Response Rate
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "700",
                    color: "#ba9988",
                  }}
                >
                  {mockReviewAnalytics.responseRate.toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* Rating Distribution */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 12,
                }}
              >
                Rating Distribution
              </Text>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = mockReviewAnalytics.ratingDistribution[rating as keyof typeof mockReviewAnalytics.ratingDistribution];
                const percentage = (count / mockReviewAnalytics.totalReviews) * 100;
                return (
                  <View key={rating} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                          width: 20,
                        }}
                      >
                        {rating}
                      </Text>
                      <MaterialIcons name="star" size={16} color="#ffd700" />
                      <View
                        style={{
                          flex: 1,
                          height: 8,
                          backgroundColor: "#232323",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor: "#ba9988",
                            borderRadius: 4,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.7)",
                          width: 50,
                          textAlign: "right",
                        }}
                      >
                        {count} ({percentage.toFixed(0)}%)
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Top Reasons */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Top Feedback Reasons
            </Text>
            <View style={{ flexDirection: isMobile ? "column" : "row", gap: 16 }}>
              {/* Positive Reasons */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#4caf50",
                    marginBottom: 12,
                  }}
                >
                  Positive
                </Text>
                <View style={{ gap: 8 }}>
                  {mockReviewAnalytics.topPositiveReasons.map((item, index) => {
                    const reason = REVIEW_REASONS.find((r) => r.id === item.reason);
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 8,
                          borderBottomWidth: index < mockReviewAnalytics.topPositiveReasons.length - 1 ? 1 : 0,
                          borderBottomColor: "rgba(71, 71, 71, 0.5)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.8)",
                            flex: 1,
                          }}
                        >
                          {reason?.label || item.reason}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#4caf50",
                          }}
                        >
                          {item.count}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Negative Reasons */}
              {mockReviewAnalytics.topNegativeReasons.length > 0 && (
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ff4444",
                      marginBottom: 12,
                    }}
                  >
                    Areas for Improvement
                  </Text>
                  <View style={{ gap: 8 }}>
                    {mockReviewAnalytics.topNegativeReasons.map((item, index) => {
                      const reason = REVIEW_REASONS.find((r) => r.id === item.reason);
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 8,
                            borderBottomWidth: index < mockReviewAnalytics.topNegativeReasons.length - 1 ? 1 : 0,
                            borderBottomColor: "rgba(71, 71, 71, 0.5)",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.8)",
                              flex: 1,
                            }}
                          >
                            {reason?.label || item.reason}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#ff4444",
                            }}
                          >
                            {item.count}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Recent Trends */}
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              Recent Trends
            </Text>
            <View style={{ gap: 12 }}>
              {mockReviewAnalytics.recentTrends.map((trend, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: index < mockReviewAnalytics.recentTrends.length - 1 ? 1 : 0,
                    borderBottomColor: "rgba(71, 71, 71, 0.5)",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {trend.period}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {trend.reviewCount} reviews
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ flexDirection: "row", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialIcons
                          key={star}
                          name={star <= Math.round(trend.averageRating) ? "star" : "star-border"}
                          size={16}
                          color={star <= Math.round(trend.averageRating) ? "#ffd700" : "rgba(255, 255, 255, 0.3)"}
                        />
                      ))}
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#ba9988",
                      }}
                    >
                      {trend.averageRating.toFixed(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

