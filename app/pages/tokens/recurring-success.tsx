import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export default function RecurringPurchaseSuccess() {
  const router = useRouter();
  const { paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const params = useLocalSearchParams<{
    tokens?: string;
    frequency?: string;
    nextPurchaseDate?: string;
  }>();

  const tokens = params.tokens || "10";
  const frequency = params.frequency || "monthly";
  const nextPurchaseDate = params.nextPurchaseDate 
    ? new Date(params.nextPurchaseDate).toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      })
    : "";

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      "weekly": "Weekly",
      "monthly": "Monthly",
      "bi-monthly": "Bi-monthly",
      "quarterly": "Quarterly",
      "annually": "Annually",
    };
    return labels[freq] || freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: scrollViewBottomPadding,
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center", marginTop: spacing["2xl"], marginBottom: spacing.xl, width: "100%", maxWidth: 500 }}>
          {/* Success Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#4caf50",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons name="check" size={48} color="#ffffff" />
          </View>

          {/* Success Message */}
          <Text
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Recurring Purchase Set Up Successfully!
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.xl,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            Your recurring token purchase has been configured. Tokens will be automatically purchased according to your schedule.
          </Text>

          {/* Purchase Details */}
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              width: "100%",
              marginBottom: spacing.xl,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.md,
                textAlign: "center",
              }}
            >
              Purchase Details
            </Text>
            
            <View style={{ gap: spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons name="shopping-cart" size={18} color={colors.accent} />
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Tokens per Purchase
                  </Text>
                </View>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                  {tokens} Token{parseInt(tokens) !== 1 ? "s" : ""}
                </Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <MaterialIcons name="repeat" size={18} color={colors.accent} />
                  <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Frequency
                  </Text>
                </View>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text.primary }}>
                  {getFrequencyLabel(frequency)}
                </Text>
              </View>

              {nextPurchaseDate && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.light }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <MaterialIcons name="calendar-today" size={18} color={colors.accent} />
                    <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                      Next Purchase
                    </Text>
                  </View>
                  <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
                    {nextPurchaseDate}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Info Box */}
          <View
            style={{
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderRadius: borderRadius.md,
              padding: spacing.md,
              width: "100%",
              marginBottom: spacing.xl,
              borderWidth: 1,
              borderColor: "rgba(76, 175, 80, 0.3)",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="info" size={20} color="#4caf50" />
            <Text
              style={{
                flex: 1,
                fontSize: typography.fontSize.sm,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              You can manage, pause, or cancel your recurring purchase anytime from the Manage tab.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ width: "100%", gap: spacing.md }}>
            <TouchableOpacity
              onPress={() => router.push("/pages/tokens?tab=manage")}
              style={{
                backgroundColor: colors.accent,
                borderRadius: borderRadius.md,
                padding: spacing.lg,
                alignItems: "center",
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: "#ffffff",
                }}
              >
                Manage Recurring Purchase
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/pages/tokens")}
              style={{
                backgroundColor: colors.primary.bg,
                borderRadius: borderRadius.md,
                padding: spacing.lg,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}
              >
                Back to Tokens
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
