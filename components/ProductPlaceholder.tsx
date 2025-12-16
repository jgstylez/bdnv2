import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Rect, Circle, Path } from "react-native-svg";

interface ProductPlaceholderProps {
  width?: number | string;
  height?: number;
  aspectRatio?: number; // width/height ratio, default 1:1 for product images
}

export const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
  width = "100%",
  height,
  aspectRatio = 1,
}) => {
  const [containerWidth, setContainerWidth] = useState(300);
  const [containerHeight, setContainerHeight] = useState(300);
  
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
    if (layoutWidth > 0) {
      setContainerWidth(layoutWidth);
    }
    if (layoutHeight > 0) {
      setContainerHeight(layoutHeight);
    }
  };
  
  // Calculate dimensions
  let finalWidth: number;
  let finalHeight: number;
  
  if (typeof width === "string" && width === "100%") {
    finalWidth = containerWidth > 0 ? containerWidth : 300;
    finalHeight = height || (containerHeight > 0 ? containerHeight : finalWidth / aspectRatio);
  } else if (width) {
    finalWidth = typeof width === "number" ? width : (containerWidth > 0 ? containerWidth : 300);
    finalHeight = height || (finalWidth / aspectRatio);
  } else {
    finalWidth = containerWidth > 0 ? containerWidth : 300;
    finalHeight = height || (finalWidth / aspectRatio);
  }
  
  // Ensure minimum dimensions and valid numbers
  finalWidth = Math.max(finalWidth || 300, 100);
  finalHeight = Math.max(finalHeight || 300, 100);
  
  // Ensure we have valid numbers (not NaN or Infinity)
  if (!isFinite(finalWidth) || isNaN(finalWidth)) {
    finalWidth = 300;
  }
  if (!isFinite(finalHeight) || isNaN(finalHeight)) {
    finalHeight = 300;
  }
  
  return (
    <View 
      style={{ 
        width: width === "100%" ? "100%" : (width || "100%"), 
        height: height || (width === "100%" ? undefined : finalHeight),
        flex: width === "100%" && !height ? 1 : undefined,
        minHeight: height || finalHeight,
        backgroundColor: "#5a5a5a",
        borderRadius: 12,
      } as any}
      onLayout={handleLayout}
    >
      {finalWidth > 0 && finalHeight > 0 && isFinite(finalWidth) && isFinite(finalHeight) && (
        <Svg width="100%" height="100%" viewBox={`0 0 ${finalWidth} ${finalHeight}`} preserveAspectRatio="xMidYMid meet" style={{ flex: 1 }}>
        {/* Background - lighter shade for better contrast */}
          <Rect width={finalWidth} height={finalHeight} fill="#5a5a5a" rx={12} />
        
        {/* Product box representation - using vibrant blue accent color */}
        <Rect 
          x={finalWidth * 0.25} 
          y={finalHeight * 0.2} 
          width={finalWidth * 0.5} 
          height={finalHeight * 0.5} 
          fill="rgba(33, 150, 243, 0.5)" 
            rx={4} 
        />
        {/* Box top */}
        <Path
          d={`M ${finalWidth * 0.25} ${finalHeight * 0.2} L ${finalWidth * 0.35} ${finalHeight * 0.15} L ${finalWidth * 0.75} ${finalHeight * 0.15} L ${finalWidth * 0.75} ${finalHeight * 0.2} Z`}
          fill="rgba(33, 150, 243, 0.6)"
        />
        {/* Box side */}
        <Path
          d={`M ${finalWidth * 0.75} ${finalHeight * 0.15} L ${finalWidth * 0.75} ${finalHeight * 0.2} L ${finalWidth * 0.75} ${finalHeight * 0.7} L ${finalWidth * 0.85} ${finalHeight * 0.65} L ${finalWidth * 0.85} ${finalHeight * 0.15} Z`}
          fill="rgba(33, 150, 243, 0.4)"
        />
        
        {/* Product label/icon */}
        <Circle 
          cx={finalWidth * 0.5} 
          cy={finalHeight * 0.45} 
            r={Math.max(finalWidth * 0.08, 4)} 
          fill="rgba(33, 150, 243, 0.7)" 
        />
        <Path
          d={`M ${finalWidth * 0.45} ${finalHeight * 0.45} L ${finalWidth * 0.5} ${finalHeight * 0.4} L ${finalWidth * 0.55} ${finalHeight * 0.45} L ${finalWidth * 0.52} ${finalHeight * 0.5} L ${finalWidth * 0.48} ${finalHeight * 0.5} Z`}
          fill="rgba(33, 150, 243, 0.9)"
        />
        
        {/* Decorative elements */}
          <Circle cx={finalWidth * 0.2} cy={finalHeight * 0.3} r={6} fill="rgba(33, 150, 243, 0.4)" />
          <Circle cx={finalWidth * 0.8} cy={finalHeight * 0.25} r={5} fill="rgba(33, 150, 243, 0.4)" />
          <Circle cx={finalWidth * 0.15} cy={finalHeight * 0.75} r={8} fill="rgba(33, 150, 243, 0.35)" />
          <Circle cx={finalWidth * 0.85} cy={finalHeight * 0.8} r={7} fill="rgba(33, 150, 243, 0.35)" />
        
        {/* Text placeholder lines */}
          <Rect x={finalWidth * 0.15} y={finalHeight * 0.75} width={finalWidth * 0.7} height={8} fill="rgba(33, 150, 243, 0.5)" rx={2} />
          <Rect x={finalWidth * 0.2} y={finalHeight * 0.85} width={finalWidth * 0.6} height={6} fill="rgba(33, 150, 243, 0.4)" rx={2} />
      </Svg>
      )}
    </View>
  );
};

