import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

interface BentoCardProps {
  title: string;
  description?: string;
  onPress?: () => void;
  delay?: number;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  onPress,
  delay = 0,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 600 });
      translateY.value = withSpring(0, { damping: 15 });
      scale.value = withSpring(1, { damping: 15 });
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

  const CardContent = (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: "#474747",
          borderRadius: 24,
          padding: 24,
          minHeight: width < 768 ? 180 : 200,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
      ]}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: width < 768 ? 20 : 24,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: width < 768 ? 14 : 16,
            marginTop: 8,
            lineHeight: 24,
          }}
        >
          {description}
        </Text>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

