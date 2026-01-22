import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollAnimatedView } from "../ScrollAnimatedView";
import { ImageLightbox } from "../modals/ImageLightbox";

const TRADEMARKS = [
  {
    image: require("@/assets/images/public/trademark-thumb-emblem.jpg"),
    title: "Trademark Emblem Certificate",
  },
  {
    image: require("@/assets/images/public/trademark-thumb-name.jpg"),
    title: "Trademark Name Certificate",
  },
  {
    image: require("@/assets/images/public/trademark-thumb-tagline.jpg"),
    title: "Trademark Tagline Certificate",
  },
];

export const TrademarkSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const handleImagePress = (image: any, title: string) => {
    setSelectedImage(image);
    setSelectedTitle(title);
    setLightboxVisible(true);
  };

  return (
    <>
      <ScrollAnimatedView delay={900}>
        <View
          style={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingVertical: isMobile ? 60 : 80,
            backgroundColor: "#1a1a1a",
          }}
        >
          <View
            style={{
              maxWidth: 1200,
              alignSelf: "center",
              width: "100%",
            }}
          >
            {/* Section Header */}
            <View
              style={{
                marginBottom: isMobile ? 40 : 48,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 32 : 44,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                  textAlign: "center",
                  letterSpacing: -0.5,
                }}
              >
                SOLID FOUNDATION
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "rgba(255, 255, 255, 0.8)",
                  textAlign: "center",
                  maxWidth: 800,
                  lineHeight: isMobile ? 26 : 30,
                }}
              >
                You are sowing into fertile ground that will also be protected for generations to come, as we have our trademark and provisional patent for our proprietary system.
              </Text>
            </View>

            {/* Trademark Images Grid */}
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                gap: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {TRADEMARKS.map((trademark, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(trademark.image, trademark.title)}
                  activeOpacity={0.9}
                  style={{
                    flex: isMobile ? 1 : 0,
                    minWidth: isMobile ? "100%" : 180,
                    maxWidth: isMobile ? "100%" : 200,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "rgba(35, 35, 35, 0.4)",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                    position: "relative",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={trademark.image}
                    style={{
                      width: "100%",
                      height: isMobile ? 150 : 180,
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                  />
                  {/* Overlay */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "rgba(186, 153, 136, 0.9)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons name="zoom-in" size={20} color="#ffffff" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollAnimatedView>

      {/* Image Lightbox */}
      <ImageLightbox
        visible={lightboxVisible}
        onClose={() => {
          setLightboxVisible(false);
          setSelectedImage(null);
          setSelectedTitle("");
        }}
        imageSource={selectedImage}
        title={selectedTitle}
      />
    </>
  );
};
