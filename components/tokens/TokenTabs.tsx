import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from '../../constants/theme';

interface TokenTabsProps {
  activeTab: "purchase" | "manage";
  onTabChange: (tab: "purchase" | "manage") => void;
}

export function TokenTabs({ activeTab, onTabChange }: TokenTabsProps) {
  const tabs = [
    { key: "purchase" as const, label: "Purchase" },
    { key: "manage" as const, label: "Manage" },
  ];

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel="Token management tabs"
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          accessible={true}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.key }}
          accessibilityLabel={`${tab.label} tab`}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.secondary.bg,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing["2xl"],
  },
  tab: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.primary,
  },
});

