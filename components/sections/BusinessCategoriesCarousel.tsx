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
const IMAGE_HEIGHT = 130;

export const BusinessCategoriesCarousel: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollPosition = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate container width respecting maxWidth: 1200
  const containerPadding = isMobile ? 40 : 80;
  const maxContainerWidth = 1200;
  const availableWidth = Math.min(width, maxContainerWidth);
  const itemWidth = availableWidth - containerPadding;
  
  // Create multiple sets for seamless infinite scroll (at least 3 sets)
  const allImages = [...INDUSTRY_IMAGES, ...INDUSTRY_IMAGES, ...INDUSTRY_IMAGES];
  const singleSetWidth = INDUSTRY_IMAGES.length * itemWidth;
  
  // Scroll speed: pixels per frame (16ms = ~60fps)
  // 0.8px per frame = ~50px per second (smooth ticker effect)
  const SCROLL_SPEED = 0.8;

  useEffect(() => {
    // Start at the middle set for seamless looping
    if (scrollViewRef.current && singleSetWidth > 0) {
      scrollViewRef.current.scrollTo({
        x: singleSetWidth,
        animated: false,
      });
      scrollPosition.current = singleSetWidth;
    }
  }, [singleSetWidth]);

  useEffect(() => {
    // Continuous smooth scrolling animation using setInterval
    if (singleSetWidth === 0) return;
    
    intervalRef.current = setInterval(() => {
      if (scrollViewRef.current && !isScrolling) {
        scrollPosition.current += SCROLL_SPEED;
        
        // Reset to middle set when reaching the end (seamless loop)
        if (scrollPosition.current >= singleSetWidth * 2) {
          scrollPosition.current = singleSetWidth + (scrollPosition.current - singleSetWidth * 2);
        }
        
        scrollViewRef.current.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
      }
    }, 16); // ~60fps
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [singleSetWidth, isScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    scrollPosition.current = scrollX;
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
            {/* Badge */}
            <View
              style={{
                backgroundColor: "rgba(186, 153, 136, 0.15)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ba9988",
                  letterSpacing: 1,
                }}
              >
                VERTICALS
              </Text>
            </View>
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
                      height: "100%",
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
