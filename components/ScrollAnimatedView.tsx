import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ScrollAnimatedViewProps {
  children: React.ReactNode;
  delay?: number;
}

export const ScrollAnimatedView: React.FC<ScrollAnimatedViewProps> = ({
  children,
  delay = 0,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 800 });
      translateY.value = withSpring(0, { damping: 20 });
      scale.value = withSpring(1, { damping: 20 });
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

