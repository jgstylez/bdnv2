import React from 'react';
import { View, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ImageCarousel } from '../../components/ImageCarousel';
import { carouselItems } from '../../data/mock';
import { LevelCard } from '../../components/dashboard/LevelCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { NewlyAddedProducts } from '../../components/dashboard/NewlyAddedProducts';
import { KeyFeatures } from '../../components/dashboard/KeyFeatures';
import { ActivityOverview } from '../../components/dashboard/ActivityOverview';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { cn } from '../../lib/utils';

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const isDesktop = width >= 1024 && Platform.OS === 'web';

  // Tab bar height is 56px on mobile, 0 on desktop
  const tabBarHeight = isDesktop ? 0 : 56;
  const bottomPadding = 40 + tabBarHeight + (isMobile ? insets.bottom : 0);

  // Swipe gesture handlers (mobile only)
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate on horizontal movement
    .failOffsetY([-5, 5]) // Fail if vertical movement is too large
    .onEnd((event) => {
      if (!isMobile) return;

      const { translationX, velocityX } = event;
      const swipeThreshold = 100;
      const velocityThreshold = 500;

      // Swipe left to right (opens QR scanner)
      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        router.push('/pages/scanner');
      }
      // Swipe right to left (opens account page)
      else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        router.push('/(tabs)/account');
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View className="flex-1 bg-dark-background">
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingTop: 20,
            paddingBottom: bottomPadding,
          }}
        >
          {/* Carousel & Level Card Container */}
          <View className={cn('mb-6 flex-col gap-6 md:flex-row md:items-stretch')}>
            <View className="flex-1">
              <ImageCarousel
                items={carouselItems}
                height={isMobile ? 180 : 220}
                autoPlay={true}
                autoPlayInterval={5000}
                showIndicators={true}
                showControls={!isMobile}
                onItemPress={(item) => {
                  if (item.link) {
                    router.push(item.link as any);
                  }
                }}
              />
            </View>
            <LevelCard isMobile={isMobile} />
          </View>

          <QuickActions isMobile={isMobile} />
          <NewlyAddedProducts isMobile={isMobile} />
          <KeyFeatures isMobile={isMobile} />

          {/* Activity Overview & Recent Activity */}
          <View className={cn('mb-8 flex-col gap-8 md:flex-row md:items-stretch')}>
            <ActivityOverview isMobile={isMobile} />
            <RecentActivity isMobile={isMobile} />
          </View>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}
