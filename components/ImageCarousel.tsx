import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { ImagePlaceholder } from "@/components/placeholders/SVGPlaceholders";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

interface CarouselItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  onItemPress?: (item: CarouselItem) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  items,
  height = 200,
  autoPlay = true,
  autoPlayInterval = 5000,
  showIndicators = true,
  showControls = true,
  onItemPress,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [containerWidth, setContainerWidth] = useState(screenWidth);
  const [containerHeight, setContainerHeight] = useState(height);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const gradientHeight = isMobile ? 140 : 180; // Gradient height for desktop/tablet
  const width = containerWidth; // Use container width instead of screen width
  const actualHeight = containerHeight || height; // Use container height if available, otherwise use prop

  // Animation for swipe indicator
  const swipeTranslateX = useSharedValue(0);

  useEffect(() => {
    if (items.length > 1) {
      swipeTranslateX.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );

      // Hide swipe indicator after 7 seconds (on page load only)
      const hideTimer = setTimeout(() => {
        setShowSwipeIndicator(false);
      }, 7000);

      return () => clearTimeout(hideTimer);
    } else {
      setShowSwipeIndicator(false);
    }
  }, [items.length]);

  const swipeIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeTranslateX.value }],
  }));

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % items.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [currentIndex, autoPlay, autoPlayInterval, items.length, width]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  };

  const scrollPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else {
      scrollToIndex(items.length - 1);
    }
  };

  const scrollNext = () => {
    if (currentIndex < items.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      scrollToIndex(0);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <View
      style={{ position: "relative", width: "100%", flex: 1 }}
      onLayout={(event) => {
        const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
        if (layoutWidth > 0) {
          setContainerWidth(layoutWidth);
        }
        // Use container height if available, otherwise use prop height
        if (layoutHeight > 0) {
          setContainerHeight(layoutHeight);
        }
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ borderRadius: 16, overflow: "hidden", width: "100%", height: actualHeight }}
        scrollEnabled={true}
        bounces={true}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        disableIntervalMomentum={true}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
      >
        {items.map((item, index) => (
          <View key={item.id} style={{ width, height: actualHeight }}>
            <View
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor: "#474747",
                overflow: "hidden",
              }}
            >
              {item.imageUrl && item.imageUrl.trim() !== "" && !imageErrors.has(item.id) ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  {...(Platform.OS !== 'web' && {
                    accessible: true,
                    accessibilityRole: "image" as const,
                    accessibilityLabel:
                      item.title 
                        ? `Carousel image: ${item.title}${item.description ? `. ${item.description}` : ""}`
                        : `Carousel image ${index + 1} of ${items.length}`,
                    accessibilityHint: item.link ? "Double tap to open link" : undefined,
                  })}
                  onError={() => {
                    setImageErrors((prev) => new Set(prev).add(item.id));
                  }}
                />
              ) : (
                <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                  <ImagePlaceholder width={width} height={actualHeight} />
                </View>
              )}
              {/* Solid Black Overlay - Half Container */}
              {(item.title || item.description || item.link) && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    backgroundColor: "#000000",
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    zIndex: 20,
                  }}
                />
              )}

              {/* Text Content - Two Column Layout */}
              {(item.title || item.description || item.link) && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    zIndex: 25,
                    pointerEvents: "box-none",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {/* First Column - Text and CTA */}
                    <View
                      style={{
                        width: "50%",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: isMobile ? 8 : 16,
                        paddingTop: isMobile ? 24 : 32,
                        paddingBottom: isMobile ? 60 : 80,
                        paddingLeft: isMobile ? 24 : 36,
                        paddingRight: isMobile ? 16 : 20,
                      }}
                    >
                      {/* Text Column */}
                      <View
                        style={{
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                      >
                        {item.title && (
                          <Text
                            style={{
                              fontSize: isMobile ? 14 : 18,
                              fontWeight: "700",
                              color: "#ffffff",
                              marginBottom: isMobile ? 4 : 6,
                              textAlign: "left",
                            }}
                          >
                            {item.title}
                          </Text>
                        )}
                        {item.description && (
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: isMobile ? 11 : 14,
                              color: "rgba(255, 255, 255, 0.9)",
                              lineHeight: isMobile ? 15 : 20,
                              textAlign: "left",
                            }}
                          >
                            {item.description}
                          </Text>
                        )}
                      </View>

                      {/* CTA - Left Aligned */}
                      {item.link && item.linkText && (
                        <View
                          style={{
                            alignItems: "flex-start",
                            justifyContent: "center",
                            marginTop: isMobile ? 4 : 8,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => onItemPress?.(item)}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={item.linkText || "Open link"}
                            accessibilityHint={`Opens ${item.title || "carousel item"}`}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: "transparent",
                              paddingHorizontal: isMobile ? 10 : 16,
                              paddingVertical: isMobile ? 5 : 8,
                              borderRadius: 20,
                              borderWidth: isMobile ? 1.5 : 2,
                              borderColor: "#ba9988",
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.4,
                              shadowRadius: 4,
                              elevation: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: isMobile ? 11 : 13,
                                fontWeight: "700",
                                color: "#ffffff",
                                marginRight: isMobile ? 6 : 8,
                              }}
                            >
                              {item.linkText}
                            </Text>
                            <MaterialIcons
                              name="arrow-forward"
                              size={isMobile ? 12 : 16}
                              color="#ffffff"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {/* Second Column - Empty (Background Image Visible) */}
                    <View
                      style={{
                        width: "50%",
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Controls - Desktop/Tablet */}
      {!isMobile && items.length > 1 && (
        <>
          <TouchableOpacity
            onPress={scrollPrevious}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Previous carousel item"
            accessibilityHint="Navigate to previous image in carousel"
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              width: 48,
              height: 48,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 16,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 25,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
            }}
          >
            <MaterialIcons name="chevron-left" size={28} color="#ba9988" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={scrollNext}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Next carousel item"
            accessibilityHint="Navigate to next image in carousel"
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 48,
              height: 48,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 16,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 25,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.3)",
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chevron-right" size={28} color="#ba9988" />
          </TouchableOpacity>
        </>
      )}

      {/* Swipe Indicator - Mobile Only (shows on page load for 7 seconds) */}
      {isMobile && items.length > 1 && showSwipeIndicator && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              zIndex: 15,
            },
            swipeIndicatorStyle,
          ]}
        >
          <MaterialIcons
            name="swap-horiz"
            size={16}
            color="rgba(255, 255, 255, 0.8)"
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.8)",
              textTransform: "uppercase",
            }}
          >
            Swipe
          </Text>
        </Animated.View>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 30,
            right: 0,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 8,
            zIndex: 10,
          }}
        >
          {items.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Go to carousel item ${index + 1}`}
              accessibilityState={{ selected: currentIndex === index }}
              accessibilityHint={`Navigate to ${index + 1} of ${items.length}`}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index
                    ? "#ba9988"
                    : "rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
