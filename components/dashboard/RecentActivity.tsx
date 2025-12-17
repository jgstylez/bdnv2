import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, CardContent } from '../Card';
import { cn } from '../../lib/utils';

const mockActivities = [
  {
    icon: 'shopping-cart' as const,
    description: 'Purchase at Diaspora',
    timestamp: '2h ago',
    amount: '-$45.00',
    color: '#ba9988',
  },
  {
    icon: 'event' as const,
    description: 'Event RSVP: Community Mixer',
    timestamp: 'Yesterday',
    amount: '-$10.00',
    color: '#e91e63',
  },
  {
    icon: 'card-giftcard' as const,
    description: 'Sent Gift Card to John D.',
    timestamp: '3 days ago',
    amount: '-$50.00',
    color: '#9c27b0',
  },
  {
    icon: 'account-balance-wallet' as const,
    description: 'Tokens Purchased',
    timestamp: '1 week ago',
    amount: '+$100.00',
    color: '#ffd700',
  },
];

interface RecentActivityProps {
  isMobile: boolean;
}

export function RecentActivity({ isMobile }: RecentActivityProps) {
  const router = useRouter();

  return (
    <View className={cn('flex-1', { 'min-w-[300px]': !isMobile })}>
       <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-dark-foreground">Recent Activity</Text>
        <TouchableOpacity
            onPress={() => router.push('/pages/activity')}
            className="flex-row items-center gap-1"
        >
            <Text className="text-sm font-semibold text-primary">View All</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ba9988" />
        </TouchableOpacity>
        </View>
      <Card mode="dark">
        <CardContent className="p-4 space-y-4">
          {mockActivities.map((activity, index) => (
            <View key={index} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <MaterialIcons name={activity.icon} size={20} color={activity.color} />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-dark-foreground">{activity.description}</Text>
                  <Text className="text-xs text-dark-muted-foreground">{activity.timestamp}</Text>
                </View>
              </View>
              <Text
                className={cn('text-sm font-bold', {
                  'text-success': activity.amount.startsWith('+'),
                  'text-dark-foreground': !activity.amount.startsWith('+'),
                })}
              >
                {activity.amount}
              </Text>
            </View>
          ))}
        </CardContent>
      </Card>
    </View>
  );
}
