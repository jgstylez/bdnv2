import React from "react";
import { View } from "react-native";
import Svg, { Path, Circle, G, Rect, Polygon, Ellipse, LinearGradient, Stop, Defs } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";

interface BadgeIconProps {
  icon: string; // MaterialIcons name or custom SVG identifier
  size?: number;
  color?: string;
  isEarned?: boolean;
  gradient?: string[];
}

// Custom SVG badge shapes
const BadgeShapes = {
  circle: (size: number, color: string) => (
    <Circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill={color} />
  ),
  star: (size: number, color: string) => {
    const center = size / 2;
    const radius = size / 2 - 4;
    const points = 5;
    const pointsArray = [];
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius * 0.5;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      pointsArray.push(`${x},${y}`);
    }
    return <Polygon points={pointsArray.join(" ")} fill={color} />;
  },
  shield: (size: number, color: string) => {
    const center = size / 2;
    const width = size - 8;
    const height = size - 8;
    return (
      <Path
        d={`M ${center} ${4} L ${width} ${height * 0.3} L ${width} ${height * 0.7} L ${center} ${height} L ${8} ${height * 0.7} L ${8} ${height * 0.3} Z`}
        fill={color}
      />
    );
  },
  hexagon: (size: number, color: string) => {
    const center = size / 2;
    const radius = size / 2 - 4;
    const points = 6;
    const pointsArray = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      pointsArray.push(`${x},${y}`);
    }
    return <Polygon points={pointsArray.join(" ")} fill={color} />;
  },
};

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  icon,
  size = 64,
  color = "#ba9988",
  isEarned = false,
  gradient,
}) => {
  const iconSize = size * 0.5;
  const badgeColor = isEarned ? color : "rgba(255, 255, 255, 0.2)";
  const iconColor = isEarned ? "#ffffff" : "rgba(255, 255, 255, 0.3)";

  // Determine badge shape based on rarity or use circle as default
  const getBadgeShape = () => {
    // For now, use circle for all badges - can be customized per badge
    return BadgeShapes.circle(size, badgeColor);
  };

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {isEarned && gradient && (
            <LinearGradient id={`gradient-${icon}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
              <Stop offset="100%" stopColor={gradient[1]} stopOpacity="1" />
            </LinearGradient>
          )}
        </Defs>
        {isEarned && gradient ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill={`url(#gradient-${icon})`}
          />
        ) : (
          getBadgeShape()
        )}
        {/* Inner circle for icon background */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.35}
          fill={isEarned ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"}
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: size / 2 - iconSize / 2,
          left: size / 2 - iconSize / 2,
          width: iconSize,
          height: iconSize,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={iconSize} color={iconColor} />
      </View>
    </View>
  );
};

