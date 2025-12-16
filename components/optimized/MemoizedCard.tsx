import React, { memo } from "react";
import { View, ViewProps } from "react-native";

interface MemoizedCardProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * MemoizedCard Component
 * Memoized card wrapper to prevent unnecessary re-renders
 */
const MemoizedCardComponent: React.FC<MemoizedCardProps> = ({ children, style, ...props }) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export const MemoizedCard = memo(MemoizedCardComponent);

