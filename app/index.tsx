import React, { useEffect } from "react";
import { View, ScrollView, Platform, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from '@/hooks/useAuth';
import { isAppSubdomain } from '@/lib/subdomain-utils';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { DevelopmentStatusSection } from '@/components/sections/DevelopmentStatusSection';
import { InvestmentBreakdownSection } from '@/components/sections/InvestmentBreakdownSection';
import { KeyInitiativesSection } from '@/components/sections/KeyInitiativesSection';
import { BusinessCategoriesCarousel } from '@/components/sections/BusinessCategoriesCarousel';
import { ImpactChainSection } from '@/components/sections/ImpactChainSection';
import { BlackOWNDemandSection } from '@/components/sections/BlackOWNDemandSection';
import { SocialMediaSection } from '@/components/sections/SocialMediaSection';
import { TrademarkSection } from '@/components/sections/TrademarkSection';
import { QuickValuePropsSection } from '@/components/sections/QuickValuePropsSection';
import { BentoGrid } from '@/components/sections/BentoGrid';
import { FeatureHighlight } from '@/components/sections/FeatureHighlight';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { FintechFeaturesSection } from '@/components/sections/FintechFeaturesSection';
import { BusinessDirectoryPreview } from '@/components/sections/BusinessDirectoryPreview';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { EmailCaptureSection } from '@/components/sections/EmailCaptureSection';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function Home() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const isNative = Platform.OS !== 'web';
  const isApp = isAppSubdomain(searchParams as { subdomain?: string }); // Only relevant on web

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    headerTranslateY.value = withSpring(0, { damping: 20 });
  }, []);

  // Handle routing based on platform and subdomain
  useEffect(() => {
    // Wait for router to be ready before attempting navigation
    const timeoutId = setTimeout(() => {
      if (__DEV__) {
        console.log('[Home] Routing check:', {
          isNative,
          isApp,
          isAuthenticated,
          isLoading,
          pathname: typeof window !== 'undefined' && window.location ? window.location.pathname : 'N/A',
          search: typeof window !== 'undefined' && window.location ? window.location.search : 'N/A',
        });
      }

      // Skip if still loading auth state
      if (isLoading) {
        return;
      }

      // Native mobile: always redirect to app flow (skip marketing site)
      if (isNative) {
        if (isAuthenticated) {
          if (__DEV__) console.log('[Home] Redirecting native to dashboard');
          router.replace('/(tabs)/dashboard');
        } else {
          if (__DEV__) console.log('[Home] Redirecting native to login');
          router.replace('/(auth)/login');
        }
        return;
      }

      // Web: handle subdomain routing
      if (isApp) {
        // If on app subdomain, redirect immediately
        if (isAuthenticated) {
          if (__DEV__) console.log('[Home] Redirecting app subdomain to dashboard');
          router.replace('/(tabs)/dashboard');
        } else {
          if (__DEV__) console.log('[Home] Redirecting app subdomain to login');
          router.replace('/(auth)/login');
        }
      } else {
        if (__DEV__) {
          console.log('[Home] Not on app subdomain, showing marketing site');
        }
      }
    }, 100); // Small delay to ensure router is mounted

    return () => clearTimeout(timeoutId);
  }, [isNative, isApp, isAuthenticated, isLoading, router]);

  // Show loading spinner on native or app subdomain while checking auth
  if ((isNative || isApp) && isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ba9988" />
      </View>
    );
  }

  // Don't render marketing content on native or app subdomain (show loading/redirect instead)
  if (isNative) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ba9988" />
      </View>
    );
  }

  if (isApp) {
    // On app subdomain, don't show marketing content
    // Either redirecting or showing loading
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ba9988" />
      </View>
    );
  }

  // Only render marketing site on web + marketing domain (or authenticated on app subdomain)
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
        <HeroSection 
          animatedStyle={headerAnimatedStyle}
          videoUrl=""
          videoTitle="WHAT WE DO - WATCH VIDEO"
        />
        <DevelopmentStatusSection />
        <InvestmentBreakdownSection />
        <KeyInitiativesSection />
        <BusinessCategoriesCarousel />
        <ImpactChainSection />
        <BlackOWNDemandSection />
        <SocialMediaSection />
        <QuickValuePropsSection />
        <FintechFeaturesSection />
        <BusinessDirectoryPreview />
        <BentoGrid />
        <FeatureHighlight />
        <FeaturesSection />
        <TestimonialsSection />
        <TrademarkSection />
        <EmailCaptureSection />
        <Footer />
      </AnimatedScrollView>
    </View>
  );
}
