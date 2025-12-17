import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNonprofit } from '../contexts/NonprofitContext';
import { useRouter } from "expo-router";
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';

export function NonprofitSwitcher() {
  const { nonprofits, selectedNonprofit, selectNonprofit, isLoading } = useNonprofit();
  const { isMobile } = useResponsive();
  const router = useRouter();
  const [showSwitcher, setShowSwitcher] = useState(false);

  if (isLoading || nonprofits.length === 0) {
    return null;
  }

  if (nonprofits.length === 1) {
    // Only one nonprofit, show it without dropdown
    return (
      <View
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border.light,
          marginBottom: spacing.lg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#e91e63" + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="handshake" size={20} color="#e91e63" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
              numberOfLines={1}
            >
              {selectedNonprofit?.name}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                textTransform: "capitalize",
              }}
            >
              {selectedNonprofit?.type}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowSwitcher(true)}
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border.light,
          marginBottom: spacing.lg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#e91e63" + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="handshake" size={20} color="#e91e63" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
                numberOfLines={1}
              >
                {selectedNonprofit?.name}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {selectedNonprofit?.type} • {nonprofits.length} {nonprofits.length === 1 ? "Organization" : "Organizations"}
              </Text>
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.text.tertiary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showSwitcher}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSwitcher(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.lg,
          }}
          activeOpacity={1}
          onPress={() => setShowSwitcher(false)}
        >
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              width: "100%",
              maxWidth: 500,
              maxHeight: 600,
              borderWidth: 1,
              borderColor: colors.border.light,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={{
                padding: spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.light,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Select Organization
              </Text>
              <TouchableOpacity onPress={() => setShowSwitcher(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 500 }}>
              {nonprofits.map((nonprofit) => (
                <TouchableOpacity
                  key={nonprofit.id}
                  onPress={() => {
                    selectNonprofit(nonprofit.id);
                    setShowSwitcher(false);
                  }}
                  style={{
                    padding: spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.light,
                    backgroundColor: selectedNonprofit?.id === nonprofit.id ? colors.accent + "20" : "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#e91e63" + "20",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name="handshake" size={24} color="#e91e63" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                        <Text
                          style={{
                            fontSize: typography.fontSize.base,
                            fontWeight: typography.fontWeight.bold,
                            color: colors.text.primary,
                          }}
                        >
                          {nonprofit.name}
                        </Text>
                        {selectedNonprofit?.id === nonprofit.id && (
                          <MaterialIcons name="check-circle" size={20} color={colors.accent} />
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          textTransform: "capitalize",
                        }}
                      >
                        {nonprofit.type}
                      </Text>
                      {nonprofit.address && (
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                            marginTop: spacing.xs,
                          }}
                          numberOfLines={1}
                        >
                          {nonprofit.address.city}, {nonprofit.address.state}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setShowSwitcher(false);
                  router.push("/pages/nonprofit/onboarding");
                }}
                style={{
                  padding: spacing.lg,
                  borderTopWidth: 1,
                  borderTopColor: colors.border.light,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.accent + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="add" size={24} color={colors.accent} />
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.accent,
                  }}
                >
                  Add New Organization
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

