import React, { useState } from "react";
import { View, Text, useWindowDimensions, StyleSheet, LayoutChangeEvent } from "react-native";
import Svg, { Rect, G, Line, Text as SvgText } from "react-native-svg";
import { spacing } from "../../constants/theme";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  data2?: BarData[]; // Second data series for comparison
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showValues?: boolean; // Show value labels above bars
  legendLabels?: { label1: string; label2: string };
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  data2,
  height = 300,
  showGrid = true,
  showLegend = false,
  showValues = false, // Hide values by default for cleaner look
  legendLabels = { label1: "This Month", label2: "Last Month" },
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const hasTwoSeries = data2 && data2.length > 0;

  // Measure container width on layout
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Calculate width: prefer measured container width, fallback to window-based calculation
  const isMobile = windowWidth < 768;
  const maxChartWidth = isMobile ? 500 : 700;
  
  // Use container width if available, otherwise calculate from window
  let chartWidth: number;
  if (containerWidth && containerWidth > 0) {
    // Use actual container width, accounting for padding
    chartWidth = Math.min(containerWidth - 20, maxChartWidth);
  } else {
    // Fallback calculation
    const containerPadding = isMobile ? 40 : 80;
    const availableWidth = windowWidth - containerPadding;
    chartWidth = Math.min(availableWidth - 20, maxChartWidth);
  }

  const leftPadding = 60; // Increased left padding to ensure Y-axis labels are fully visible
  const rightPadding = 25; // Increased right padding to prevent clipping on desktop
  // Increased bottom padding to match y-axis spacing - provides clearance between bars and x-axis labels
  // Y-axis has ~60px left padding with ~15px label clearance, so x-axis needs similar spacing
  const bottomPadding = showLegend && hasTwoSeries ? 100 : 90; // Generous space for x-axis labels + legend
  const topPadding = 10; // Minimal top padding for cleaner look
  const chartHeight = height - bottomPadding - topPadding;
  const innerWidth = chartWidth - leftPadding - rightPadding; // Different left/right padding
  const innerHeight = chartHeight - topPadding;

  // Combine both datasets to find max value
  const allValues = [
    ...data.map((d) => d.value),
    ...(data2 || []).map((d) => d.value),
  ];
  const maxValue = Math.max(...allValues);
  const range = maxValue || 1;

  const barGroupWidth = innerWidth / data.length;
  // For stacked bars, use full width minus minimal spacing
  const barWidth = barGroupWidth - 8; // Single wider bar for stacked design
  const barSpacing = 4; // Minimal spacing between bars

  const gridLines = 5;
  const gridLineValues: number[] = [];
  for (let i = 0; i <= gridLines; i++) {
    gridLineValues.push((maxValue / gridLines) * i);
  }

  // Colors for the two series
  const color1 = "#ba9988"; // This month - accent color
  const color2 = "#5a5a68"; // Last month - muted gray

  // Ensure chart width is valid before rendering
  if (chartWidth <= 0) {
    return <View style={styles.container} onLayout={handleLayout} />;
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={{ width: chartWidth, height, overflow: 'visible', marginLeft: 10, marginRight: 10 }}>
        <Svg 
          width={chartWidth} 
          height={height} 
          viewBox={`-20 0 ${chartWidth + 40} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid Lines */}
          {showGrid &&
            gridLineValues.map((value, index) => {
              const y =
                leftPadding +
                topPadding +
                innerHeight -
                (value / range) * innerHeight;
              return (
                <G key={index}>
                  <Line
                    x1={leftPadding}
                    y1={y}
                    x2={leftPadding + innerWidth}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <SvgText
                    x={leftPadding - 15}
                    y={y + 4}
                    fontSize="10"
                    fill="rgba(255, 255, 255, 0.7)"
                    textAnchor="end"
                    fontWeight="500"
                    fontFamily="Inter"
                    style={{ overflow: 'visible' }}
                  >
                    {Math.round(value)}
                  </SvgText>
                </G>
              );
            })}

          {/* Stacked Bars - Overlapping colors in one bar */}
          {data.map((item, index) => {
            const groupX = leftPadding + index * barGroupWidth;
            const x = groupX + barSpacing / 2;
            const baseY = leftPadding + topPadding + innerHeight;
            
            if (hasTwoSeries && data2 && data2[index]) {
              const lastMonthValue = data2[index].value;
              const thisMonthValue = item.value;
              
              // Calculate heights in pixels
              const baseBarHeight = (lastMonthValue / range) * innerHeight;
              const thisMonthBarHeight = (thisMonthValue / range) * innerHeight;
              
              // Base bar (last month) - always at bottom
              const baseBarY = baseY - baseBarHeight;
              
              // Top bar (this month) - always drawn, positioned relative to base bar
              let topBarY: number;
              let topBarHeight: number;
              
              if (thisMonthValue > lastMonthValue) {
                // This month is higher - stack on top of base bar
                topBarY = baseBarY - (thisMonthBarHeight - baseBarHeight);
                topBarHeight = thisMonthBarHeight - baseBarHeight;
              } else {
                // This month is lower - overlap on top of base bar
                topBarY = baseBarY - thisMonthBarHeight;
                topBarHeight = thisMonthBarHeight;
              }

              return (
                <G key={`bar-group-${index}`}>
                  {/* Base bar (last month) - always visible at bottom */}
                  <Rect
                    x={x}
                    y={baseBarY}
                    width={barWidth}
                    height={baseBarHeight}
                    fill={color2}
                    rx="4"
                  />
                  
                  {/* Top bar (this month) - stacked/overlapping on top */}
                  <Rect
                    x={x}
                    y={topBarY}
                    width={barWidth}
                    height={topBarHeight}
                    fill={color1}
                    rx="4"
                  />
                  
                  {/* Optional value label on top */}
                  {showValues && thisMonthBarHeight > 25 && (
                    <SvgText
                      x={x + barWidth / 2}
                      y={baseBarY - Math.max(thisMonthBarHeight, baseBarHeight) - 8}
                      fontSize="10"
                      fill="rgba(255, 255, 255, 0.9)"
                      textAnchor="middle"
                      fontWeight="600"
                      fontFamily="Inter"
                    >
                      {thisMonthValue}
                    </SvgText>
                  )}
                </G>
              );
            } else {
              // Single bar if no second series
              const barHeight = (item.value / range) * innerHeight;
              const barY = baseY - barHeight;
              
              return (
                <G key={`bar-group-${index}`}>
                  <Rect
                    x={x}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={item.color || color1}
                    rx="4"
                  />
                  {showValues && barHeight > 25 && (
                    <SvgText
                      x={x + barWidth / 2}
                      y={barY - 8}
                      fontSize="10"
                      fill="rgba(255, 255, 255, 0.9)"
                      textAnchor="middle"
                      fontWeight="600"
                      fontFamily="Inter"
                    >
                      {item.value}
                    </SvgText>
                  )}
                </G>
              );
            }
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const groupX = leftPadding + index * barGroupWidth;
            const x = groupX + barGroupWidth / 2;
            // Position labels with proper spacing from bars - matching y-axis label spacing pattern
            // Y-axis labels have ~15px clearance from chart edge, so x-axis should match
            // Bars end at baseY, so labels need to be positioned well below that
            const labelY = height - 30; // Proper clearance from bars (matching y-axis spacing pattern)
            return (
            <SvgText
              key={index}
              x={x}
              y={labelY}
              fontSize="10"
              fill="rgba(255, 255, 255, 0.8)"
              textAnchor="middle"
              fontWeight="500"
              fontFamily="Inter"
            >
              {item.label}
            </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Legend - Moved to bottom */}
      {showLegend && hasTwoSeries && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color1 }]} />
            <Text style={styles.legendText}>{legendLabels.label1}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color2 }]} />
            <Text style={styles.legendText}>{legendLabels.label2}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "visible",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.md * 2,
    paddingHorizontal: spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
});
