import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

export const ImpactCalculator: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [monthlySpending, setMonthlySpending] = useState("");

  const calculateImpact = () => {
    const spending = parseFloat(monthlySpending) || 0;
    if (spending === 0) return null;

    // Assume 60% of spending goes to Black businesses
    // Multiplier effect of 2.5x
    const blackBusinessSpending = spending * 0.6;
    const communityImpact = blackBusinessSpending * 2.5;
    const annualImpact = communityImpact * 12;
    const jobsCreated = Math.floor(annualImpact / 50000); // Rough estimate: $50k per job

    return {
      monthlyBlackSpending: blackBusinessSpending,
      monthlyImpact: communityImpact,
      annualImpact,
      jobsCreated,
    };
  };

  const impact = calculateImpact();

  return (
    <ScrollAnimatedView delay={500}>
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
              See Your Impact
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
              }}
            >
              Calculate how your spending creates economic impact in the Black community.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(71, 71, 71, 0.4)",
              borderRadius: 24,
              padding: isMobile ? 24 : 32,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
            }}
          >
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Your Monthly Spending ($)
              </Text>
              <TextInput
                value={monthlySpending}
                onChangeText={setMonthlySpending}
                placeholder="Enter your monthly spending amount"
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

            {impact && (
              <View
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 16,
                  padding: 24,
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
                  Your Community Impact
                </Text>
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.7)" }}>
                      Monthly Black Business Spending
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
                      ${impact.monthlyBlackSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.7)" }}>
                      Monthly Community Impact
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#ba9988" }}>
                      ${impact.monthlyImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                        Annual Community Impact
                      </Text>
                      <Text style={{ fontSize: 24, fontWeight: "800", color: "#ba9988" }}>
                        ${impact.annualImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                        Potential Jobs Created
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: "700", color: "#ba9988" }}>
                        {impact.jobsCreated}
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
              *Estimates based on group economics multiplier effect. Actual impact may vary.
            </Text>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
