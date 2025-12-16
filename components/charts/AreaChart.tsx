import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Polyline, Circle, G, Line, Text as SvgText } from "react-native-svg";

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 200,
  color = "#ba9988",
  showGrid = true,
  showDots = true,
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width < 768 ? width - 80 : Math.min(width - 160, 800);
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
  const areaPath = `M ${padding} ${padding + innerHeight} L ${pathData} L ${padding + innerWidth} ${padding + innerHeight} Z`;

  const gridLines = 5;
  const gridLineValues: number[] = [];
  for (let i = 0; i <= gridLines; i++) {
    gridLineValues.push(minValue + (range / gridLines) * i);
  }

  return (
    <View style={{ width: chartWidth, height }}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

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

        {/* Area */}
        <Path d={areaPath} fill="url(#areaGradient)" />

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

