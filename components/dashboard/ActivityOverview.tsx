import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { DashboardPlaceholder } from '../DashboardPlaceholder';
import { cn } from '../../lib/utils';

interface ActivityOverviewProps {
  isMobile: boolean;
}

export function ActivityOverview({ isMobile }: ActivityOverviewProps) {
  return (
    <View className={cn('flex-1', { 'mb-8': isMobile })}>
      <Text className="text-xl font-bold text-dark-foreground mb-4">Activity Overview</Text>
      <Card
        mode="dark"
        className={cn('items-center justify-center', { 'h-auto': isMobile, 'h-[400px]': !isMobile })}
      >
        <CardContent className="p-6">
          <DashboardPlaceholder width={isMobile ? 300 : 500} height={isMobile ? 225 : 375} />
        </CardContent>
      </Card>
    </View>
  );
}
