import React from "react";
import { View, Text, Modal, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ImageLightboxProps {
  visible: boolean;
  onClose: () => void;
  imageSource: any;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  visible,
  onClose,
  imageSource,
  title,
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 0 : insets.top,
          paddingBottom: Platform.OS === "web" ? 0 : insets.bottom,
        }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: Platform.OS === "web" ? 20 : insets.top + 20,
            right: isMobile ? 20 : 40,
            zIndex: 10,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <MaterialIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>

        {/* Image Container */}
        <View
          style={{
            width: isMobile ? width - 40 : Math.min(1200, width - 80),
            height: isMobile ? height - 140 : height - 160,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          {/* Title */}
          {title && (
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {title}
              </Text>
            </View>
          )}

          {/* Image */}
          <View
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {imageSource && (
              <Image
                source={imageSource}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={200}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
