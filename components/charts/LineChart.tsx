import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Polyline, Circle, Line, G, Text as SvgText } from "react-native-svg";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = "#ba9988",
  showGrid = true,
  showDots = true,
}) => {
  const { width } = useWindowDimensions();
  // Use container width if available, otherwise calculate from window
  const chartWidth = width < 768 ? Math.min(width - 80, 400) : Math.min(width - 160, 500);
  const padding = 40;
  const chartHeight = height - 60;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * innerWidth;
    const y = padding + innerHeight - ((point.value - minValue) / range) * innerHeight;
    return { x, y, value: point.value, label: point.label };
  });

  const pathData = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLines = 5;
  const gridLineValues: number[] = [];
  for (let i = 0; i <= gridLines; i++) {
    gridLineValues.push(minValue + (range / gridLines) * i);
  }

  return (
    <View style={{ width: chartWidth, height }}>
      <Svg width={chartWidth} height={height}>
        {/* Grid Lines */}
        {showGrid &&
          gridLineValues.map((value, index) => {
            const y = padding + innerHeight - ((value - minValue) / range) * innerHeight;
            return (
              <G key={index}>
                <Line
                  x1={padding}
                  y1={y}
                  x2={padding + innerWidth}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={padding - 10}
                  y={y + 4}
                  fontSize="10"
                  fill="rgba(255, 255, 255, 0.5)"
                  textAnchor="end"
                >
                  {value.toLocaleString()}
                </SvgText>
              </G>
            );
          })}

        {/* Line */}
        <Polyline
          points={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          points.map((point, index) => (
            <G key={index}>
              <Circle cx={point.x} cy={point.y} r="4" fill={color} />
              <Circle cx={point.x} cy={point.y} r="8" fill={color} opacity="0.2" />
            </G>
          ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <SvgText
            key={index}
            x={point.x}
            y={height - 10}
            fontSize="10"
            fill="rgba(255, 255, 255, 0.6)"
            textAnchor="middle"
          >
            {point.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

