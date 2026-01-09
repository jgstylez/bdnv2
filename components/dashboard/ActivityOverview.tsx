import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, CardContent } from "../Card";
import { BarChart } from "../charts/BarChart";
import { cn } from "../../lib/utils";
import { spacing } from "../../constants/theme";

interface ActivityOverviewProps {
  isMobile: boolean;
}

// Mock data for the bar chart - simulating activity over time
// This month's transactions
const mockChartDataThisMonth = [
  { label: "Mon", value: 120 },
  { label: "Tue", value: 180 },
  { label: "Wed", value: 150 },
  { label: "Thu", value: 220 },
  { label: "Fri", value: 190 },
  { label: "Sat", value: 250 },
  { label: "Sun", value: 210 },
];

// Last month's transactions (for comparison)
const mockChartDataLastMonth = [
  { label: "Mon", value: 100 },
  { label: "Tue", value: 160 },
  { label: "Wed", value: 140 },
  { label: "Thu", value: 200 },
  { label: "Fri", value: 170 },
  { label: "Sat", value: 230 },
  { label: "Sun", value: 190 },
];

export function ActivityOverview({ isMobile }: ActivityOverviewProps) {
  // Calculate height to match RecentActivity card
  // Chart height: 350px + legend (~30px) + padding = ~420px total
  // RecentActivity: ~351px, so we'll match that but allow chart to be larger
  const cardHeight = isMobile ? "auto" : 420; // Increased to accommodate larger chart with legend

  // Responsive padding: balanced on all sides, slightly more on bottom for desktop
  // CardContent has default px-6 (24px), so we override it completely
  const horizontalPadding = isMobile ? spacing.md : spacing.lg; // Balanced horizontal padding
  const topPadding = isMobile ? spacing.md : spacing.lg; // Balanced top padding
  const bottomPadding = isMobile ? spacing.md : spacing["2xl"]; // More bottom padding on desktop (40px)
  const chartContainerPadding = 0; // No extra padding in chart container

  return (
    <View
      style={[
        styles.container,
        { marginBottom: isMobile ? spacing["2xl"] : 0 },
      ]}
    >
      <Text style={styles.title}>Activity Overview</Text>
      <Card
        mode="dark"
        className={cn("items-center justify-center", {
          "h-auto": isMobile,
          "min-h-[420px]": !isMobile, // Increased height for larger chart
        })}
        style={!isMobile ? { height: 420 } : undefined}
      >
        <CardContent
          className="px-0" // Override default px-6 padding
          style={[
            styles.cardContent,
            {
              paddingLeft: horizontalPadding,
              paddingRight: horizontalPadding,
              paddingTop: topPadding,
              paddingBottom: bottomPadding,
            },
          ]}
        >
          <View
            style={[
              styles.chartContainer,
              {
                paddingHorizontal: chartContainerPadding,
              },
            ]}
          >
            <BarChart
              data={mockChartDataThisMonth}
              data2={mockChartDataLastMonth}
              height={isMobile ? 280 : 350}
              showGrid={true}
              showLegend={true}
              showValues={false}
              legendLabels={{ label1: "This Month", label2: "Last Month" }}
            />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: spacing.md,
  },
  cardContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  chartContainer: {
    width: "100%",
    maxWidth: 700, // Increased to match chart width
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "visible", // Allow chart elements (like Y-axis labels) to be visible
  },
});
