import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Rect, G, Line, Text as SvgText } from "react-native-svg";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  showGrid?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showGrid = true,
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width < 768 ? width - 80 : Math.min(width - 160, 800);
  const padding = 40;
  const chartHeight = height - 60;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  const maxValue = Math.max(...data.map((d) => d.value));
  const range = maxValue || 1;

  const barWidth = innerWidth / data.length - 10;
  const barSpacing = 10;

  const gridLines = 5;
  const gridLineValues: number[] = [];
  for (let i = 0; i <= gridLines; i++) {
    gridLineValues.push((maxValue / gridLines) * i);
  }

  return (
    <View style={{ width: chartWidth, height }}>
      <Svg width={chartWidth} height={height}>
        {/* Grid Lines */}
        {showGrid &&
          gridLineValues.map((value, index) => {
            const y = padding + innerHeight - (value / range) * innerHeight;
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

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / range) * innerHeight;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = padding + innerHeight - barHeight;
          const color = item.color || "#ba9988";

          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="4"
              />
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="11"
                fill="#ffffff"
                textAnchor="middle"
                fontWeight="600"
              >
                {item.value.toLocaleString()}
              </SvgText>
            </G>
          );
        })}

        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
          return (
            <SvgText
              key={index}
              x={x}
              y={height - 10}
              fontSize="10"
              fill="rgba(255, 255, 255, 0.6)"
              textAnchor="middle"
            >
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

