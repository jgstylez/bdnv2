import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors = ["#232323", "#2a2a2a", "#232323"],
  className = "",
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      {children}
    </LinearGradient>
  );
};

