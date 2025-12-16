import React from "react";
import { View, useWindowDimensions } from "react-native";

interface MultiColumnLayoutProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
  mobileColumns?: 1 | 2;
}

export const MultiColumnLayout: React.FC<MultiColumnLayoutProps> = ({
  children,
  columns = 3,
  gap = 20,
  mobileColumns = 1,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  
  const actualColumns = isMobile ? mobileColumns : isTablet ? Math.min(columns, 2) : columns;
  const childrenArray = React.Children.toArray(children);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap,
        marginHorizontal: -gap / 2,
      }}
    >
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / actualColumns}%`,
            paddingHorizontal: gap / 2,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

