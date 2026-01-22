import React, { useState } from "react";
import { View, Text, TextInput, useWindowDimensions, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const ROICalculator: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [customerCount, setCustomerCount] = useState("");

  // Simple ROI calculation
  const calculateROI = () => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    const customers = parseInt(customerCount) || 0;
    
    if (revenue === 0 || customers === 0) return null;

    // Assume average customer acquisition cost reduction of 30%
    // and average revenue increase of 25% from platform features
    const costSavings = revenue * 0.3;
    const revenueIncrease = revenue * 0.25;
    const totalBenefit = costSavings + revenueIncrease;
    const annualBenefit = totalBenefit * 12;
    
    return {
      monthlySavings: costSavings,
      monthlyIncrease: revenueIncrease,
      totalMonthly: totalBenefit,
      annual: annualBenefit,
    };
  };

  const roi = calculateROI();

  return (
    <ScrollAnimatedView delay={400}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#232323",
        }}
      >
        <View
          style={{
            maxWidth: 1000,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <MaterialIcons name="calculate" size={48} color="#ba9988" style={{ marginBottom: 16 }} />
            <Text
              style={{
                fontSize: isMobile ? 32 : 44,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Calculate Your Potential ROI
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
              }}
            >
              See how BDN can help grow your business revenue and reduce customer acquisition costs.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(35, 35, 35, 0.4)",
              borderRadius: 24,
              padding: isMobile ? 24 : 32,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
            }}
          >
            <View style={{ gap: 24, marginBottom: 32 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Current Monthly Revenue ($)
                </Text>
                <TextInput
                  value={monthlyRevenue}
                  onChangeText={setMonthlyRevenue}
                  placeholder="Enter amount"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Current Monthly Customers
                </Text>
                <TextInput
                  value={customerCount}
                  onChangeText={setCustomerCount}
                  placeholder="Enter number"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>
            </View>

            {roi && (
              <View
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 16,
                  padding: 24,
                  marginTop: 24,
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
                    textAlign: "center",
                  }}
                >
                  Potential Impact
                </Text>
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.7)" }}>
                      Monthly Cost Savings
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
                      ${roi.monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.7)" }}>
                      Monthly Revenue Increase
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
                      ${roi.monthlyIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.2)",
                      paddingTop: 16,
                      marginTop: 8,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, fontWeight: "600", color: "#ffffff" }}>
                        Total Monthly Benefit
                      </Text>
                      <Text style={{ fontSize: 24, fontWeight: "800", color: "#ba9988" }}>
                        ${roi.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                        Annual Benefit
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
                        ${roi.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: 24,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              *Estimates based on average BDN business performance. Actual results may vary.
            </Text>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
