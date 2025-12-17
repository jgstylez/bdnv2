import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, CardContent } from '../Card';
import { cn } from '../../lib/utils';

const actions = [
  {
    title: 'Search',
    description: 'Discover businesses to shop',
    icon: 'search' as const,
    onPress: (router: any) => router.push('/pages/search'),
  },
  {
    title: 'Wallet',
    description: 'Manage accounts & balances',
    icon: 'account-balance-wallet' as const,
    onPress: (router: any) => router.push('/(tabs)/pay'),
  },
  {
    title: 'Invite',
    description: 'Share BDN with your network',
    icon: 'people' as const,
    onPress: (router: any) => router.push('/pages/referrals'),
  },
  {
    title: 'Media',
    description: 'Watch videos & read articles',
    icon: 'video-library' as const,
    onPress: (router: any) => router.push('/pages/media'),
  },
];

interface QuickActionsProps {
  isMobile: boolean;
}

export function QuickActions({ isMobile }: QuickActionsProps) {
  const router = useRouter();

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold text-dark-foreground mb-4">Quick Actions</Text>
      <View className={cn('flex-row flex-wrap', { 'gap-3': isMobile, 'gap-4': !isMobile })}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => action.onPress(router)}
            className={cn(
              'bg-dark-card border border-primary/20 rounded-2xl p-5',
              {
                'w-[48%]': isMobile,
                'flex-1 min-w-[200px]': !isMobile,
              }
            )}
          >
            <MaterialIcons name={action.icon} size={24} color="#ba9988" className="mb-2" />
            <Text className="text-base font-semibold text-dark-foreground mb-1">{action.title}</Text>
            <Text className="text-sm text-dark-muted-foreground">{action.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
