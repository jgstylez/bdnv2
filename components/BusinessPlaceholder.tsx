import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Rect, Circle, Path } from "react-native-svg";

interface BusinessPlaceholderProps {
  width?: number | string;
  height?: number;
  aspectRatio?: number; // width/height ratio, default 16:9 for cards
}

export const BusinessPlaceholder: React.FC<BusinessPlaceholderProps> = ({
  width = "100%",
  height,
  aspectRatio = 16 / 9,
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
    finalWidth = containerWidth;
    finalHeight = height || finalWidth / aspectRatio;
  } else if (width) {
    finalWidth = typeof width === "number" ? width : containerWidth;
    finalHeight = height || finalWidth / aspectRatio;
  } else {
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
        
        {/* Store/Business icon representation */}
        <Rect 
          x={finalWidth * 0.1} 
          y={finalHeight * 0.15} 
          width={finalWidth * 0.25} 
          height={finalHeight * 0.4} 
          fill="rgba(186, 153, 136, 0.2)" 
          rx="4" 
        />
        {/* Store front door */}
        <Rect 
          x={finalWidth * 0.15} 
          y={finalHeight * 0.35} 
          width={finalWidth * 0.15} 
          height={finalHeight * 0.2} 
          fill="rgba(186, 153, 136, 0.3)" 
          rx="2" 
        />
        {/* Store window */}
        <Circle 
          cx={finalWidth * 0.175} 
          cy={finalHeight * 0.25} 
          r={finalWidth * 0.03} 
          fill="rgba(186, 153, 136, 0.3)" 
        />
        
        {/* Decorative elements */}
        <Circle cx={finalWidth * 0.7} cy={finalHeight * 0.25} r="8" fill="rgba(186, 153, 136, 0.15)" />
        <Circle cx={finalWidth * 0.85} cy={finalHeight * 0.3} r="6" fill="rgba(186, 153, 136, 0.15)" />
        <Circle cx={finalWidth * 0.75} cy={finalHeight * 0.7} r="10" fill="rgba(186, 153, 136, 0.1)" />
        
        {/* Text placeholder lines */}
        <Rect x={finalWidth * 0.4} y={finalHeight * 0.2} width={finalWidth * 0.5} height="10" fill="rgba(255, 255, 255, 0.2)" rx="2" />
        <Rect x={finalWidth * 0.4} y={finalHeight * 0.35} width={finalWidth * 0.4} height="8" fill="rgba(255, 255, 255, 0.15)" rx="2" />
        <Rect x={finalWidth * 0.4} y={finalHeight * 0.5} width={finalWidth * 0.55} height="8" fill="rgba(255, 255, 255, 0.15)" rx="2" />
        
        {/* Rating stars placeholder */}
        <Circle cx={finalWidth * 0.4} cy={finalHeight * 0.7} r="4" fill="rgba(186, 153, 136, 0.3)" />
        <Circle cx={finalWidth * 0.45} cy={finalHeight * 0.7} r="4" fill="rgba(186, 153, 136, 0.3)" />
        <Circle cx={finalWidth * 0.5} cy={finalHeight * 0.7} r="4" fill="rgba(186, 153, 136, 0.3)" />
      </Svg>
    </View>
  );
};

