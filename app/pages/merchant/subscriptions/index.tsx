import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BackButton } from '@/components/navigation/BackButton';
import { HeroSection } from '@/components/layouts/HeroSection';
import { BusinessSwitcher } from '@/components/BusinessSwitcher';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { formatCurrency } from '@/lib/international';

// Mock data for subscriptions. In a real app, you would fetch this from a database.
const MOCK_SUBSCRIPTIONS = [
  { id: '1', name: 'Basic Plan', price: 9.99, status: 'Active', currency: 'USD' as const },
  { id: '2', name: 'Premium Plan', price: 19.99, status: 'Cancelled', currency: 'USD' as const },
  { id: '3', name: 'Pro Plan', price: 29.99, status: 'Active', currency: 'USD' as const },
  { id: '4', name: 'Enterprise Plan', price: 49.99, status: 'Pending', currency: 'USD' as const },
];

export default function SubscriptionManagement() {
  const router = useRouter();
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return colors.status.success;
      case 'cancelled':
        return colors.status.error;
      case 'pending':
        return colors.status.warning;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'check-circle';
      case 'cancelled':
        return 'cancel';
      case 'pending':
        return 'schedule';
      default:
        return 'info';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: scrollViewBottomPadding,
        }}
      >
        <BackButton />

        <HeroSection
          title="Subscription Management"
          subtitle="Manage your subscription plans and billing"
        />

        {/* Business Switcher */}
        <BusinessSwitcher />

        {/* Create New Subscription Button */}
        <TouchableOpacity
          onPress={() => router.push('/pages/merchant/subscriptions/create')}
          style={{
            backgroundColor: colors.accent,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            minHeight: 48, // Ensure proper touch target
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            marginBottom: spacing.xl,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Create new subscription plan"
          accessibilityHint="Opens the form to create a new subscription plan"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="add-circle-outline" size={20} color="#ffffff" />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: '#ffffff',
            }}
          >
            Create New Subscription
          </Text>
        </TouchableOpacity>

        {/* Subscriptions List */}
        {MOCK_SUBSCRIPTIONS.length > 0 ? (
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              gap: spacing.md,
            }}
          >
            {MOCK_SUBSCRIPTIONS.map((subscription) => (
              <TouchableOpacity
                key={subscription.id}
                onPress={() => router.push(`/pages/merchant/subscriptions/edit/${subscription.id}`)}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${subscription.name} subscription plan, ${formatCurrency(subscription.price, subscription.currency)} per shipment, status: ${subscription.status}`}
                accessibilityHint="Double tap to manage this subscription plan"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: colors.secondary.bg,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: spacing.md,
                    gap: spacing.sm,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.sm,
                        marginBottom: spacing.xs,
                        flexWrap: 'wrap',
                      }}
                    >
                      <MaterialIcons
                        name="subscriptions"
                        size={isMobile ? 18 : 20}
                        color={colors.accent}
                        accessible={false}
                      />
                      <Text
                        style={{
                          fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                          flex: 1,
                        }}
                        numberOfLines={2}
                      >
                        {subscription.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        gap: spacing.xs,
                        marginTop: spacing.xs,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: isMobile ? typography.fontSize.xl : typography.fontSize["2xl"],
                          fontWeight: typography.fontWeight.bold,
                          color: colors.accent,
                        }}
                      >
                        {formatCurrency(subscription.price, subscription.currency)}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.text.tertiary,
                        }}
                      >
                        per shipment
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.xs,
                      backgroundColor: getStatusColor(subscription.status) + '20',
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: borderRadius.md,
                      borderWidth: 1,
                      borderColor: getStatusColor(subscription.status) + '40',
                      alignSelf: isMobile ? 'flex-start' : 'flex-start',
                    }}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`Status: ${subscription.status}`}
                  >
                    <MaterialIcons
                      name={getStatusIcon(subscription.status) as any}
                      size={16}
                      color={getStatusColor(subscription.status)}
                      accessible={false}
                    />
                    <Text
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: getStatusColor(subscription.status),
                        textTransform: 'capitalize',
                      }}
                    >
                      {subscription.status}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: colors.border.light,
                    marginTop: spacing.xs,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <MaterialIcons
                      name="edit"
                      size={isMobile ? 14 : 16}
                      color={colors.text.secondary}
                      accessible={false}
                    />
                    <Text
                      style={{
                        fontSize: isMobile ? typography.fontSize.xs : typography.fontSize.sm,
                        color: colors.text.secondary,
                      }}
                    >
                      Manage plan
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={isMobile ? 18 : 20}
                    color={colors.text.secondary}
                    accessible={false}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border.light,
              marginTop: spacing.lg,
            }}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="No subscriptions yet. Create your first subscription plan to get started."
          >
            <MaterialIcons 
              name="subscriptions" 
              size={isMobile ? 40 : 48} 
              color={colors.text.tertiary}
              accessible={false}
            />
            <Text
              style={{
                fontSize: isMobile ? typography.fontSize.base : typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
                marginTop: spacing.md,
                marginBottom: spacing.xs,
                textAlign: 'center',
              }}
            >
              No Subscriptions Yet
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 20,
                paddingHorizontal: spacing.md,
              }}
            >
              Create your first subscription plan to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
