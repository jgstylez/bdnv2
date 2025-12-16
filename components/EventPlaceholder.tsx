import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Rect, Circle, Path } from "react-native-svg";

interface EventPlaceholderProps {
  width?: number | string;
  height?: number;
  aspectRatio?: number; // width/height ratio, default 2:1
}

export const EventPlaceholder: React.FC<EventPlaceholderProps> = ({
  width,
  height,
  aspectRatio = 2,
}) => {
  const [containerWidth, setContainerWidth] = useState(400);
  
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    if (layoutWidth > 0) {
      setContainerWidth(layoutWidth);
    }
  };
  
  // Calculate dimensions
  let finalWidth: number;
  let finalHeight: number;
  
  if (typeof width === "string" && width === "100%") {
    // Use container width, calculate height from aspect ratio
    finalWidth = containerWidth;
    finalHeight = height || finalWidth / aspectRatio;
  } else if (width) {
    finalWidth = typeof width === "number" ? width : containerWidth;
    finalHeight = height || finalWidth / aspectRatio;
  } else {
    // Default fallback
    finalWidth = containerWidth;
    finalHeight = height || finalWidth / aspectRatio;
  }
  
  return (
    <View 
      style={{ width: width === "100%" ? "100%" : (width || "100%"), height: finalHeight } as any}
      onLayout={handleLayout}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${finalWidth} ${finalHeight}`} preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <Rect width={finalWidth} height={finalHeight} fill="#474747" rx="12" />
        
        {/* Event icon representation */}
        <Circle cx={finalWidth / 2} cy={finalHeight / 2 - 20} r="30" fill="rgba(186, 153, 136, 0.2)" />
        <Path
          d={`M ${finalWidth / 2 - 15} ${finalHeight / 2 - 20} L ${finalWidth / 2} ${finalHeight / 2 - 35} L ${finalWidth / 2 + 15} ${finalHeight / 2 - 20} L ${finalWidth / 2 + 10} ${finalHeight / 2 + 5} L ${finalWidth / 2 - 10} ${finalHeight / 2 + 5} Z`}
          fill="rgba(186, 153, 136, 0.3)"
        />
        
        {/* Decorative elements */}
        <Circle cx={finalWidth * 0.2} cy={finalHeight * 0.3} r="8" fill="rgba(186, 153, 136, 0.2)" />
        <Circle cx={finalWidth * 0.8} cy={finalHeight * 0.25} r="6" fill="rgba(186, 153, 136, 0.2)" />
        <Circle cx={finalWidth * 0.15} cy={finalHeight * 0.7} r="10" fill="rgba(186, 153, 136, 0.15)" />
        <Circle cx={finalWidth * 0.85} cy={finalHeight * 0.75} r="7" fill="rgba(186, 153, 136, 0.15)" />
        
        {/* Text placeholder lines */}
        <Rect x={finalWidth * 0.2} y={finalHeight * 0.6} width={finalWidth * 0.6} height="8" fill="rgba(255, 255, 255, 0.2)" rx="2" />
        <Rect x={finalWidth * 0.25} y={finalHeight * 0.75} width={finalWidth * 0.5} height="6" fill="rgba(255, 255, 255, 0.15)" rx="2" />
      </Svg>
    </View>
  );
};

