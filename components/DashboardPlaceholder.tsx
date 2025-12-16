import React from "react";
import { View } from "react-native";
import Svg, { Rect, Circle, Path } from "react-native-svg";

interface DashboardPlaceholderProps {
  width?: number;
  height?: number;
}

export const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = ({
  width = 400,
  height = 300,
}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={width} height={height} viewBox="0 0 400 300">
        {/* Background */}
        <Rect width="400" height="300" fill="#474747" rx="12" />
        
        {/* Chart bars */}
        <Rect x="50" y="200" width="40" height="60" fill="#ba9988" rx="4" />
        <Rect x="110" y="170" width="40" height="90" fill="#ba9988" rx="4" />
        <Rect x="170" y="150" width="40" height="110" fill="#ba9988" rx="4" />
        <Rect x="230" y="180" width="40" height="80" fill="#ba9988" rx="4" />
        <Rect x="290" y="160" width="40" height="100" fill="#ba9988" rx="4" />
        
        {/* Grid lines */}
        <Path d="M40 50 L360 50" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <Path d="M40 100 L360 100" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <Path d="M40 150 L360 150" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <Path d="M40 200 L360 200" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <Path d="M40 250 L360 250" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        
        {/* Decorative circles */}
        <Circle cx="100" cy="80" r="8" fill="rgba(186, 153, 136, 0.3)" />
        <Circle cx="200" cy="70" r="6" fill="rgba(186, 153, 136, 0.3)" />
        <Circle cx="300" cy="85" r="10" fill="rgba(186, 153, 136, 0.3)" />
        
        {/* Text placeholder */}
        <Rect x="50" y="20" width="120" height="12" fill="rgba(255, 255, 255, 0.3)" rx="2" />
        <Rect x="50" y="38" width="80" height="10" fill="rgba(255, 255, 255, 0.2)" rx="2" />
      </Svg>
    </View>
  );
};

