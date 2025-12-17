import React from "react";
import { View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { BentoGrid } from '@/components/sections/BentoGrid';
import { FeatureHighlight } from '@/components/sections/FeatureHighlight';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { FintechFeaturesSection } from '@/components/sections/FintechFeaturesSection';
import { BusinessDirectoryPreview } from '@/components/sections/BusinessDirectoryPreview';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { EmailCaptureSection } from '@/components/sections/EmailCaptureSection';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function Home() {
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    headerTranslateY.value = withSpring(0, { damping: 20 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <Navigation includeSafeAreaPadding={true} />
      <AnimatedScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 0,
        }}
      >
        <HeroSection animatedStyle={headerAnimatedStyle} />
        <StatsSection />
        <FintechFeaturesSection />
        <BusinessDirectoryPreview />
        <BentoGrid />
        <FeatureHighlight />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection onPress={() => {}} />
        <EmailCaptureSection />
        <Footer />
      </AnimatedScrollView>
    </View>
  );
}
