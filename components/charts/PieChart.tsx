import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLabels = true,
  showLegend = true,
}) => {
  const { width } = useWindowDimensions();
  const chartSize = width < 768 ? Math.min(size, width - 80) : size;
  const center = chartSize / 2;
  const radius = chartSize / 2 - 20;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = -90; // Start from top
  const paths: Array<{ path: string; color: string; label: string; percentage: number; angle: number }> = [];

  data.forEach((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    paths.push({
      path,
      color: item.color,
      label: item.label,
      percentage,
      angle: startAngle + angle / 2,
    });

    currentAngle = endAngle;
  });

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <Svg width={chartSize} height={chartSize}>
        {paths.map((item, index) => (
          <Path
            key={index}
            d={item.path}
            fill={item.color}
            stroke="#232323"
            strokeWidth="2"
          />
        ))}

        {/* Center circle */}
        <Circle cx={center} cy={center} r={radius * 0.4} fill="#232323" />

        {/* Labels */}
        {showLabels &&
          paths.map((item, index) => {
            if (item.percentage < 5) return null; // Skip labels for small slices
            const labelRadius = radius * 0.7;
            const labelAngleRad = (item.angle * Math.PI) / 180;
            const labelX = center + labelRadius * Math.cos(labelAngleRad);
            const labelY = center + labelRadius * Math.sin(labelAngleRad);

            return (
              <SvgText
                key={index}
                x={labelX}
                y={labelY}
                fontSize="12"
                fill="#ffffff"
                textAnchor="middle"
                fontWeight="600"
              >
                {item.percentage.toFixed(0)}%
              </SvgText>
            );
          })}
      </Svg>

      {/* Legend */}
      {showLegend && (
        <View style={{ marginTop: 20, width: "100%", gap: 12 }}>
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: "#474747",
                borderRadius: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: item.color,
                  }}
                />
                <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>
                  {item.label}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 16, color: item.color, fontWeight: "700" }}>
                  {item.value.toLocaleString()}
                </Text>
                <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                  {((item.value / total) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

