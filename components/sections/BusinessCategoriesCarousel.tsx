import React, { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Image } from "expo-image";
import { ScrollAnimatedView } from "../ScrollAnimatedView";

const INDUSTRY_IMAGES = [
  require("@/assets/images/public/empowering_industries_1.png"),
  require("@/assets/images/public/empowering_industries_2.png"),
  require("@/assets/images/public/empowering_industries_3.png"),
];

// Fixed height for all images
const IMAGE_HEIGHT = 152;

export const BusinessCategoriesCarousel: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollPosition = useRef(0);
  const itemWidth = isMobile ? width - 40 : width * 0.8 - 20;
  
  // Create multiple sets for seamless infinite scroll (at least 3 sets)
  const allImages = [...INDUSTRY_IMAGES, ...INDUSTRY_IMAGES, ...INDUSTRY_IMAGES];
  const singleSetWidth = INDUSTRY_IMAGES.length * itemWidth;

  useEffect(() => {
    // Start at the middle set for seamless looping
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: singleSetWidth,
        animated: false,
      });
      scrollPosition.current = singleSetWidth;
    }
  }, [singleSetWidth]);

  useEffect(() => {
    // Auto-scroll functionality
    const interval = setInterval(() => {
      if (scrollViewRef.current && !isScrolling) {
        scrollPosition.current += itemWidth;
        scrollViewRef.current.scrollTo({
          x: scrollPosition.current,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [itemWidth, isScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    scrollPosition.current = scrollX;
    
    // Reset to middle set when reaching the end (seamless loop)
    if (scrollX >= singleSetWidth * 2 - itemWidth) {
      scrollViewRef.current?.scrollTo({
        x: singleSetWidth,
        animated: false,
      });
      scrollPosition.current = singleSetWidth;
    } else if (scrollX <= itemWidth) {
      scrollViewRef.current?.scrollTo({
        x: singleSetWidth,
        animated: false,
      });
      scrollPosition.current = singleSetWidth;
    }
  };

  const handleScrollBeginDrag = () => {
    setIsScrolling(true);
  };

  const handleScrollEndDrag = () => {
    setIsScrolling(false);
  };

  return (
    <ScrollAnimatedView delay={400}>
      <View
        style={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 60 : 80,
          backgroundColor: "#232323",
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
              marginBottom: isMobile ? 32 : 48,
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
              Empowering Black-Owned Businesses
            </Text>
            <Text
              style={{
                fontSize: isMobile ? 16 : 18,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: isMobile ? 26 : 30,
              }}
            >
              BDN 2.0 will serve Black-owned businesses across many verticals.
            </Text>
          </View>

          {/* Carousel */}
          <View style={{ overflow: "hidden" }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}
              decelerationRate="fast"
              contentContainerStyle={{
                gap: 0,
              }}
              onScroll={handleScroll}
              onScrollBeginDrag={handleScrollBeginDrag}
              onScrollEndDrag={handleScrollEndDrag}
              scrollEventThrottle={16}
            >
              {allImages.map((imageSource, index) => (
                <View
                  key={index}
                  style={{
                    width: itemWidth,
                    height: IMAGE_HEIGHT,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={imageSource}
                    style={{
                      width: "100%",
                      height: IMAGE_HEIGHT,
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollAnimatedView>
  );
};
