import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlogContentBlock } from '../../types/education';

interface RichContentRendererProps {
  blocks: BlogContentBlock[];
}

export default function RichContentRenderer({ blocks }: RichContentRendererProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const renderBlock = (block: BlogContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <Text
            key={index}
            style={{
              fontSize: 16,
              lineHeight: 28,
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: 16,
            }}
          >
            {block.content}
          </Text>
        );

      case "heading":
        const headingSizes = { 1: 32, 2: 28, 3: 24, 4: 20 };
        const headingMargin = { 1: 32, 2: 24, 3: 20, 4: 16 };
        return (
          <Text
            key={index}
            style={{
              fontSize: isMobile ? headingSizes[block.level] - 4 : headingSizes[block.level],
              fontWeight: "700",
              color: "#ffffff",
              marginTop: index > 0 ? headingMargin[block.level] : 0,
              marginBottom: 12,
              lineHeight: isMobile ? headingSizes[block.level] - 2 : headingSizes[block.level] + 4,
            }}
          >
            {block.content}
          </Text>
        );

      case "image":
        return (
          <View key={index} style={{ marginVertical: 24, alignItems: "center" }}>
            <View
              style={{
                width: "100%",
                maxWidth: 800,
                height: isMobile ? 200 : 400,
                backgroundColor: "#232323",
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              {/* Placeholder for image - in production, use Image component */}
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#474747",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="image" size={48} color="rgba(186, 153, 136, 0.5)" />
              </View>
            </View>
            {block.caption && (
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.5)",
                  marginTop: 8,
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                {block.caption}
              </Text>
            )}
          </View>
        );

      case "list":
        return (
          <View key={index} style={{ marginBottom: 16, paddingLeft: 8 }}>
            {block.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={{
                  flexDirection: "row",
                  marginBottom: 8,
                  alignItems: "flex-start",
                }}
              >
                {block.ordered ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#ba9988",
                      fontWeight: "600",
                      marginRight: 12,
                      minWidth: 24,
                    }}
                  >
                    {itemIndex + 1}.
                  </Text>
                ) : (
                  <MaterialIcons
                    name="circle"
                    size={6}
                    color="#ba9988"
                    style={{ marginTop: 10, marginRight: 12 }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 28,
                    color: "rgba(255, 255, 255, 0.9)",
                    flex: 1,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        );

      case "code":
        return (
          <View
            key={index}
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              marginVertical: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            {block.language && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(186, 153, 136, 0.1)",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#ba9988",
                    textTransform: "uppercase",
                  }}
                >
                  {block.language}
                </Text>
                <MaterialIcons name="content-copy" size={16} color="rgba(255, 255, 255, 0.5)" />
              </View>
            )}
            <Text
              style={{
                fontSize: 14,
                fontFamily: "monospace",
                color: "#ffffff",
                lineHeight: 20,
              }}
            >
              {block.code}
            </Text>
          </View>
        );

      case "quote":
        return (
          <View
            key={index}
            style={{
              borderLeftWidth: 4,
              borderLeftColor: "#ba9988",
              paddingLeft: 20,
              marginVertical: 24,
              backgroundColor: "rgba(186, 153, 136, 0.05)",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 28,
                marginBottom: block.author ? 12 : 0,
              }}
            >
              "{block.content}"
            </Text>
            {block.author && (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ba9988",
                }}
              >
                — {block.author}
              </Text>
            )}
          </View>
        );

      case "divider":
        return (
          <View
            key={index}
            style={{
              height: 1,
              backgroundColor: "rgba(186, 153, 136, 0.2)",
              marginVertical: 32,
            }}
          />
        );

      case "callout":
        const calloutColors = {
          info: { bg: "rgba(33, 150, 243, 0.1)", border: "rgba(33, 150, 243, 0.3)", icon: "#2196F3" },
          warning: { bg: "rgba(255, 193, 7, 0.1)", border: "rgba(255, 193, 7, 0.3)", icon: "#FFC107" },
          success: { bg: "rgba(76, 175, 80, 0.1)", border: "rgba(76, 175, 80, 0.3)", icon: "#4CAF50" },
          error: { bg: "rgba(244, 67, 54, 0.1)", border: "rgba(244, 67, 54, 0.3)", icon: "#F44336" },
        };
        const calloutIcons = {
          info: "info",
          warning: "warning",
          success: "check-circle",
          error: "error",
        };
        const colors = calloutColors[block.variant];
        return (
          <View
            key={index}
            style={{
              backgroundColor: colors.bg,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              marginVertical: 16,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <MaterialIcons name={calloutIcons[block.variant] as any} size={24} color={colors.icon} />
            <Text
              style={{
                fontSize: 15,
                lineHeight: 24,
                color: "rgba(255, 255, 255, 0.9)",
                flex: 1,
              }}
            >
              {block.content}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ width: "100%" }}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </View>
  );
}

