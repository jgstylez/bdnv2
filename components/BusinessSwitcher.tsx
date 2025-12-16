import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useBusiness } from "../contexts/BusinessContext";
import { useRouter } from "expo-router";
import { colors, spacing, typography, borderRadius } from "../constants/theme";
import { useResponsive } from "../hooks/useResponsive";

export function BusinessSwitcher() {
  const { businesses, selectedBusiness, selectBusiness, isLoading } = useBusiness();
  const { isMobile } = useResponsive();
  const router = useRouter();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "platinum":
        return "#b9f2ff";
      case "premier":
        return "#ffd700";
      case "basic":
        return "#8d8d8d";
      default:
        return "#8d8d8d";
    }
  };

  if (isLoading || businesses.length === 0) {
    return null;
  }

  if (businesses.length === 1) {
    // Only one business, show it without dropdown
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
              backgroundColor: `${getLevelColor(selectedBusiness?.level || "basic")}20`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="store" size={20} color={getLevelColor(selectedBusiness?.level || "basic")} />
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
              {selectedBusiness?.name}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                textTransform: "capitalize",
              }}
            >
              {selectedBusiness?.level} Level
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
                backgroundColor: `${getLevelColor(selectedBusiness?.level || "basic")}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="store" size={20} color={getLevelColor(selectedBusiness?.level || "basic")} />
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
                {selectedBusiness?.name}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {selectedBusiness?.level} Level • {businesses.length} {businesses.length === 1 ? "Business" : "Businesses"}
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
                Select Business
              </Text>
              <TouchableOpacity onPress={() => setShowSwitcher(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 500 }}>
              {businesses.map((business) => (
                <TouchableOpacity
                  key={business.id}
                  onPress={() => {
                    selectBusiness(business.id);
                    setShowSwitcher(false);
                  }}
                  style={{
                    padding: spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.light,
                    backgroundColor: selectedBusiness?.id === business.id ? colors.accent + "20" : "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: `${getLevelColor(business.level)}20`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name="store" size={24} color={getLevelColor(business.level)} />
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
                          {business.name}
                        </Text>
                        {selectedBusiness?.id === business.id && (
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
                        {business.level} Level • {business.category}
                      </Text>
                      {business.address && (
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                            marginTop: spacing.xs,
                          }}
                          numberOfLines={1}
                        >
                          {business.address.city}, {business.address.state}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setShowSwitcher(false);
                  router.push("/pages/merchant/onboarding");
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
                  Add New Business
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

