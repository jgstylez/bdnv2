import React from "react";
import { View, Text, Modal, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VideoLightboxProps {
  visible: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({
  visible,
  onClose,
  videoUrl,
  title = "Watch Video",
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const videoWidth = isMobile ? width - 40 : Math.min(1200, width - 80);
  const videoHeight = isMobile ? (videoWidth * 9) / 16 : (videoWidth * 9) / 16;

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

        {/* Video Container */}
        <View
          style={{
            width: videoWidth,
            maxWidth: "100%",
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          {/* Video Title */}
          {title && (
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: "700",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {title}
              </Text>
            </View>
          )}

          {/* Video Placeholder/Player */}
          <View
            style={{
              width: "100%",
              height: videoHeight,
              backgroundColor: "#000000",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {videoUrl ? (
              // TODO: Replace with actual video player component when video URL is available
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  Video player will be integrated here
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.5)",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  {videoUrl}
                </Text>
              </View>
            ) : (
              // Placeholder with play button
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#232323",
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "rgba(186, 153, 136, 0.9)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <MaterialIcons name="play-arrow" size={48} color="#ffffff" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                  }}
                >
                  Video coming soon
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
