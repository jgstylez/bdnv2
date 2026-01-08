import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, CardContent } from '../Card';
import { cn } from '../../lib/utils';
import { spacing } from '../../constants/theme';

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
  
  // Calculate minimum height: header (28px) + padding (16px) + empty state (100px) + padding (16px) = ~160px
  // With items: header (28px) + padding (16px) + 4 items (4 * 60px) + padding (16px) = ~328px
  // Updated to match ActivityOverview height: ~420px
  const minHeight = mockActivities.length === 0 ? 160 : undefined;
  const cardHeight = !isMobile ? 420 : undefined; // Match ActivityOverview height on desktop

  // Responsive padding: balanced on all sides, slightly more on bottom for desktop
  // CardContent has default px-6 (24px), so we override it completely
  const horizontalPadding = isMobile ? spacing.md : spacing.lg; // Balanced horizontal padding
  const topPadding = isMobile ? spacing.md : spacing.lg; // Balanced top padding
  const bottomPadding = isMobile ? spacing.md : spacing["2xl"]; // More bottom padding on desktop (40px)
  const itemSpacing = isMobile ? spacing.md : spacing.lg;

  return (
    <View className={cn('flex-1', { 'min-w-[300px]': !isMobile })}>
       <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-dark-foreground">Recent Activity</Text>
        <TouchableOpacity
            onPress={() => router.push('/pages/transactions')}
            className="flex-row items-center gap-1"
        >
            <Text className="text-sm font-semibold text-primary">View All</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ba9988" />
        </TouchableOpacity>
        </View>
      <Card 
        mode="dark"
        style={cardHeight ? { minHeight: cardHeight, height: cardHeight } : minHeight ? { minHeight } : undefined}
      >
        <CardContent 
          className="px-0" // Override default px-6 padding
          style={[
            styles.cardContent,
            {
              paddingLeft: horizontalPadding,
              paddingRight: horizontalPadding,
              paddingTop: topPadding,
              paddingBottom: bottomPadding,
            }
          ]}
        >
          {mockActivities.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-sm text-dark-muted-foreground text-center">
                No recent activity
              </Text>
            </View>
          ) : (
            mockActivities.map((activity, index) => (
            <View 
              key={index} 
              className="flex-row items-center justify-between"
              style={index > 0 ? { marginTop: itemSpacing } : undefined}
            >
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
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: activity.amount.startsWith('+') 
                    ? '#9ce0a4' // Lighter green for better contrast (WCAG AA compliant)
                    : '#ffffff',
                }}
              >
                {activity.amount}
              </Text>
            </View>
            ))
          )}
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    width: "100%",
    flex: 1,
  },
});
