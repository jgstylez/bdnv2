import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { MultiColumnLayout } from "./MultiColumnLayout";

interface BentoItem {
  title: string;
  description?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  gradient?: string[];
  color?: string;
  onPress?: () => void;
  span?: 1 | 2; // Column span for desktop
  height?: "small" | "medium" | "large";
}

interface EnhancedBentoGridProps {
  items: BentoItem[];
  columns?: 2 | 3 | 4;
  title?: string;
  subtitle?: string;
}

export const EnhancedBentoGrid: React.FC<EnhancedBentoGridProps> = ({
  items,
  columns = 3,
  title,
  subtitle,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const getHeight = (height?: "small" | "medium" | "large") => {
    if (isMobile) {
      return height === "large" ? 240 : height === "small" ? 180 : 200;
    }
    return height === "large" ? 320 : height === "small" ? 200 : 260;
  };

  const getColumnSpan = (span?: 1 | 2) => {
    if (isMobile) return "100%";
    if (columns === 2) {
      return span === 2 ? "100%" : "50%";
    } else if (columns === 3) {
      return span === 2 ? "66.666%" : "33.333%";
    } else if (columns === 4) {
      return span === 2 ? "50%" : "25%";
    }
    return span === 2 ? "66.666%" : "33.333%";
  };

  return (
    <View>
      {(title || subtitle) && (
        <View style={{ marginBottom: 32, alignItems: isMobile ? "flex-start" : "center" }}>
          {title && (
            <Text
              style={{
                fontSize: isMobile ? 28 : 36,
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: subtitle ? 12 : 0,
                letterSpacing: -1,
                textAlign: isMobile ? "left" : "center",
              }}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: isMobile ? "left" : "center",
                maxWidth: 700,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {items.map((item, index) => {
          const cardHeight = getHeight(item.height);
          const cardWidth = isMobile ? "100%" : getColumnSpan(item.span);
          const gradient = item.gradient || ["#ba9988", "#9d7f6f"];
          const iconColor = item.color || "#ba9988";

          const CardContent = (
            <View
              style={{
                width: cardWidth,
                minHeight: cardHeight,
                borderRadius: 24,
                overflow: "hidden",
                backgroundColor: "#474747",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  opacity: 0.15,
                }}
              />
              <View
                style={{
                  padding: isMobile ? 24 : 32,
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {item.icon && (
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: `${iconColor}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                      }}
                    >
                      <MaterialIcons name={item.icon} size={28} color={iconColor} />
                    </View>
                  )}
                  <Text
                    style={{
                      fontSize: isMobile ? 24 : 28,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: item.description ? 12 : 0,
                      letterSpacing: -0.5,
                    }}
                  >
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text
                      style={{
                        fontSize: isMobile ? 15 : 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 24,
                      }}
                    >
                      {item.description}
                    </Text>
                  )}
                </View>
                {item.onPress && (
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                      alignSelf: "flex-start",
                    }}
                    onPress={item.onPress}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: iconColor,
                      }}
                    >
                      Learn more →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );

          if (item.onPress) {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                style={{ 
                  width: cardWidth,
                  marginHorizontal: isMobile ? 0 : 0,
                }}
              >
                {CardContent}
              </TouchableOpacity>
            );
          }

          return (
            <View 
              key={index}
              style={{ 
                width: cardWidth,
                marginHorizontal: isMobile ? 0 : 0,
              }}
            >
              {CardContent}
            </View>
          );
        })}
      </View>
    </View>
  );
};

