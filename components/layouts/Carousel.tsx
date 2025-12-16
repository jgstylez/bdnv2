import React, { useRef, useState } from "react";
import { View, ScrollView, useWindowDimensions, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CarouselProps {
  children: React.ReactNode;
  itemsPerView?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  gap?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  itemsPerView = 3,
  showControls = true,
  showIndicators = true,
  gap = 20,
}) => {
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  
  // Use the provided itemsPerView prop value, allowing fractional values for partial card visibility
  const actualItemsPerView = itemsPerView;
  const itemWidth = (width - (gap * (actualItemsPerView + 1))) / actualItemsPerView;
  const childrenArray = React.Children.toArray(children);
  const totalPages = Math.ceil(childrenArray.length / actualItemsPerView);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (itemWidth + gap));
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    const scrollPosition = index * (itemWidth + gap);
    scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
  };

  const scrollPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollNext = () => {
    if (currentIndex < totalPages - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  return (
    <View style={{ position: "relative" }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + gap}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: gap / 2,
          gap,
        }}
      >
        {childrenArray.map((child, index) => (
          <View
            key={index}
            style={{
              width: itemWidth,
            }}
          >
            {child}
          </View>
        ))}
      </ScrollView>

      {/* Controls */}
      {showControls && !isMobile && totalPages > 1 && (
        <>
          <TouchableOpacity
            onPress={scrollPrevious}
            disabled={currentIndex === 0}
            style={{
              position: "absolute",
              left: -20,
              top: "50%",
              transform: [{ translateY: -20 }],
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: currentIndex === 0 ? "rgba(71, 71, 71, 0.5)" : "#474747",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={currentIndex === 0 ? "rgba(255, 255, 255, 0.3)" : "#ffffff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={scrollNext}
            disabled={currentIndex >= totalPages - 1}
            style={{
              position: "absolute",
              right: -20,
              top: "50%",
              transform: [{ translateY: -20 }],
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: currentIndex >= totalPages - 1 ? "rgba(71, 71, 71, 0.5)" : "#474747",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentIndex >= totalPages - 1 ? "rgba(255, 255, 255, 0.3)" : "#ffffff"}
            />
          </TouchableOpacity>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalPages > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
          }}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

