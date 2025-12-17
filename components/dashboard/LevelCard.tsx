import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { USER_LEVELS, mockUser } from '../../data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { cn } from '../../lib/utils';

interface LevelCardProps {
  isMobile: boolean;
}

export function LevelCard({ isMobile }: LevelCardProps) {
  const router = useRouter();
  const levelInfo = USER_LEVELS[mockUser.level as keyof typeof USER_LEVELS];
  const progress =
    ((mockUser.points - levelInfo.minPoints) /
      (mockUser.nextLevelPoints - levelInfo.minPoints)) *
    100;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const greeting = getTimeBasedGreeting();
  const firstName = mockUser.name.split(' ')[0];

  return (
    <Card
      mode="dark"
      className={cn('justify-between', {
        'min-w-[300px]': !isMobile,
        'h-auto': isMobile,
        'h-[220px]': !isMobile,
      })}
    >
      <CardHeader>
        <View className="flex-row justify-between items-center mb-4">
          <CardTitle mode="dark" className="text-lg font-bold">
            {greeting}, {firstName}!
          </CardTitle>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/account')}
            activeOpacity={0.7}
            className="bg-primary/15 px-3 py-1.5 rounded-lg border border-primary/30"
          >
            <Text className="text-sm font-semibold text-primary">
              {isMobile ? 'My Account' : 'Manage My Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex-row justify-between items-center mb-5">
          <View>
            <Text className="text-sm text-dark-muted-foreground mb-1">
              Current Level
            </Text>
            <Text
              className="text-3xl font-bold"
              style={{ color: levelInfo.color }}
            >
              {mockUser.level}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm text-dark-muted-foreground mb-1">Points</Text>
            <Text className="text-3xl font-bold text-primary">
              {mockUser.points.toLocaleString()}
            </Text>
          </View>
        </View>
        <View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-dark-muted-foreground">
              {mockUser.points.toLocaleString()} /{' '}
              {mockUser.nextLevelPoints.toLocaleString()} points
            </Text>
            <Text className="text-xs text-dark-muted-foreground">
              {Math.round(progress)}% to Silver
            </Text>
          </View>
          <View className="h-2 bg-dark-card rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
