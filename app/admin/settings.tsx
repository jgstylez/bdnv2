import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Switch, Platform, ActivityIndicator, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminModal } from '@/components/admin/AdminModal';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { FeatureFlags, featureFlagMetadata } from '@/types/feature-flags';
import { getFeatureFlags, updateFeatureFlags } from '@/lib/feature-flags';

const settingsCategories = [
  {
    id: "platform",
    name: "Platform Settings",
    description: "Configure platform-wide settings",
    icon: "settings",
  },
  {
    id: "features",
    name: "Feature Flags",
    description: "Enable or disable platform features",
    icon: "toggle-on",
  },
  {
    id: "payments",
    name: "Payment Settings",
    description: "Configure BDN Payment gateway",
    icon: "payment",
  },
  {
    id: "notifications",
    name: "Notification Settings",
    description: "Manage notification preferences",
    icon: "notifications",
  },
];

// Mock platform settings
interface PlatformSettings {
  platformName: string;
  platformEmail: string;
  platformUrl: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  businessApplicationsEnabled: boolean;
  nonprofitApplicationsEnabled: boolean;
  defaultCurrency: string;
  supportedCurrencies: string[];
  timezone: string;
}

// Mock payment settings
interface PaymentSettings {
  bdnPaymentEnabled: boolean;
  bdnPaymentApiKey: string;
  bdnPaymentSecretKey: string;
  bdnPaymentWebhookSecret: string;
  sandboxMode: boolean;
  consumerServiceFeePercent: number;
  consumerServiceFeeMin: number;
  consumerServiceFeeMax: number;
  businessPlatformFeePercent: number;
  businessPlatformFeePercentWithBDNPlus: number;
  autoSettleEnabled: boolean;
  settlementPeriodDays: number;
}

// Mock notification settings
interface NotificationSettings {
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  defaultNotificationChannels: {
    wallet: boolean;
    promotions: boolean;
    events: boolean;
    system: boolean;
    social: boolean;
    merchant: boolean;
  };
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const initialPlatformSettings: PlatformSettings = {
  platformName: "BDN",
  platformEmail: "support@bdn.com",
  platformUrl: "https://bdn.com",
  maintenanceMode: false,
  registrationEnabled: true,
  businessApplicationsEnabled: true,
  nonprofitApplicationsEnabled: true,
  defaultCurrency: "USD",
  supportedCurrencies: ["USD", "EUR", "GBP", "CAD"],
  timezone: "America/New_York",
};

const initialPaymentSettings: PaymentSettings = {
  bdnPaymentEnabled: true,
  bdnPaymentApiKey: "pk_live_...",
  bdnPaymentSecretKey: "sk_live_...",
  bdnPaymentWebhookSecret: "whsec_...",
  sandboxMode: false,
  consumerServiceFeePercent: 10,
  consumerServiceFeeMin: 1.00,
  consumerServiceFeeMax: 14.99,
  businessPlatformFeePercent: 10,
  businessPlatformFeePercentWithBDNPlus: 5,
  autoSettleEnabled: true,
  settlementPeriodDays: 7,
};

const initialNotificationSettings: NotificationSettings = {
  pushNotificationsEnabled: true,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  defaultNotificationChannels: {
    wallet: true,
    promotions: true,
    events: true,
    system: true,
    social: false,
    merchant: true,
  },
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
};

export default function AdminSettings() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [featureFlagsLoading, setFeatureFlagsLoading] = useState(true);
  const [featureFlagsSaving, setFeatureFlagsSaving] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(initialPaymentSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);

  // Load feature flags on mount
  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      setFeatureFlagsLoading(true);
      const flags = await getFeatureFlags();
      setFeatureFlags(flags);
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      Alert.alert('Error', 'Failed to load feature flags. Please try again.');
    } finally {
      setFeatureFlagsLoading(false);
    }
  };

  const handleSavePlatformSettings = () => {
    // TODO: Save via API
    alert("Platform settings saved successfully");
    setSelectedCategory(null);
  };

  const handleSaveFeatureFlags = async () => {
    if (!featureFlags) return;
    
    try {
      setFeatureFlagsSaving(true);
      await updateFeatureFlags(featureFlags);
      Alert.alert('Success', 'Feature flags saved successfully');
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to save feature flags:', error);
      Alert.alert('Error', 'Failed to save feature flags. Please try again.');
    } finally {
      setFeatureFlagsSaving(false);
    }
  };

  const handleSavePaymentSettings = () => {
    // TODO: Save via API
    alert("Payment settings saved successfully");
    setSelectedCategory(null);
  };

  const handleSaveNotificationSettings = () => {
    // TODO: Save via API
    alert("Notification settings saved successfully");
    setSelectedCategory(null);
  };

  const renderPlatformSettings = () => (
    <AdminModal
      visible={selectedCategory === "platform"}
      onClose={() => setSelectedCategory(null)}
      title="Platform Settings"
    >
      <ScrollView style={{ maxHeight: 600 }}>
        <View style={{ gap: spacing.lg }}>
          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              Platform Name *
            </Text>
            <TextInput
              value={platformSettings.platformName}
              onChangeText={(text) => setPlatformSettings({ ...platformSettings, platformName: text })}
              placeholder="Enter platform name"
              placeholderTextColor={colors.text.placeholder}
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              Platform Email *
            </Text>
            <TextInput
              value={platformSettings.platformEmail}
              onChangeText={(text) => setPlatformSettings({ ...platformSettings, platformEmail: text })}
              placeholder="support@bdn.com"
              placeholderTextColor={colors.text.placeholder}
              keyboardType="email-address"
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              Platform URL *
            </Text>
            <TextInput
              value={platformSettings.platformUrl}
              onChangeText={(text) => setPlatformSettings({ ...platformSettings, platformUrl: text })}
              placeholder="https://bdn.com"
              placeholderTextColor={colors.text.placeholder}
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Maintenance Mode
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Temporarily disable platform access
              </Text>
            </View>
            <Switch
              value={platformSettings.maintenanceMode}
              onValueChange={(value) => setPlatformSettings({ ...platformSettings, maintenanceMode: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                User Registration
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Allow new user registrations
              </Text>
            </View>
            <Switch
              value={platformSettings.registrationEnabled}
              onValueChange={(value) => setPlatformSettings({ ...platformSettings, registrationEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Business Applications
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Allow new business applications
              </Text>
            </View>
            <Switch
              value={platformSettings.businessApplicationsEnabled}
              onValueChange={(value) => setPlatformSettings({ ...platformSettings, businessApplicationsEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Nonprofit Applications
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Allow new nonprofit applications
              </Text>
            </View>
            <Switch
              value={platformSettings.nonprofitApplicationsEnabled}
              onValueChange={(value) => setPlatformSettings({ ...platformSettings, nonprofitApplicationsEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              Default Currency
            </Text>
            <TextInput
              value={platformSettings.defaultCurrency}
              onChangeText={(text) => setPlatformSettings({ ...platformSettings, defaultCurrency: text })}
              placeholder="USD"
              placeholderTextColor={colors.text.placeholder}
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.input,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSavePlatformSettings}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.textColors.onAccent }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AdminModal>
  );

  const renderFeatureFlags = () => {
    if (featureFlagsLoading) {
      return (
        <AdminModal
          visible={selectedCategory === "features"}
          onClose={() => setSelectedCategory(null)}
          title="Feature Flags"
        >
          <View style={{ padding: spacing.xl, alignItems: "center", justifyContent: "center", minHeight: 200 }}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, marginTop: spacing.md }}>
              Loading feature flags...
            </Text>
          </View>
        </AdminModal>
      );
    }

    if (!featureFlags) {
      return (
        <AdminModal
          visible={selectedCategory === "features"}
          onClose={() => setSelectedCategory(null)}
          title="Feature Flags"
        >
          <View style={{ padding: spacing.xl, alignItems: "center", justifyContent: "center", minHeight: 200 }}>
            <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
              Failed to load feature flags
            </Text>
            <TouchableOpacity
              onPress={loadFeatureFlags}
              style={{
                marginTop: spacing.md,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.textColors.onAccent }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </AdminModal>
      );
    }

    // Group flags by category
    const flagsByCategory = featureFlagMetadata.reduce((acc, meta) => {
      if (!acc[meta.category]) {
        acc[meta.category] = [];
      }
      acc[meta.category].push(meta);
      return acc;
    }, {} as Record<string, typeof featureFlagMetadata>);

    const categoryLabels: Record<string, string> = {
      core: 'Core Features',
      subscriptions: 'Subscription Tiers',
      nonprofit: 'Nonprofit Features',
      tokens: 'Token & Wallet Features',
      business: 'Business Features',
      payments: 'Payment Features',
      dashboards: 'Dashboard Features',
      'sub-features': 'Sub-features',
    };

    return (
      <AdminModal
        visible={selectedCategory === "features"}
        onClose={() => setSelectedCategory(null)}
        title="Feature Flags"
      >
        <ScrollView style={{ maxHeight: 600 }}>
          <View style={{ gap: spacing.lg }}>
            {Object.entries(flagsByCategory).map(([category, flags]) => (
              <View key={category} style={{ gap: spacing.md }}>
                <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold as '700', color: colors.text.primary, marginBottom: spacing.xs }}>
                  {categoryLabels[category] || category}
                </Text>
                {flags.map((meta) => {
                  const value = featureFlags[meta.key];
                  const isDisabled = meta.requires && meta.requires.some(req => !featureFlags[req]);
                  
                  return (
                    <View
                      key={meta.key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: isDisabled ? colors.input + "40" : "transparent",
                        borderRadius: borderRadius.md,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                          <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                            {meta.label}
                          </Text>
                          {meta.impact === 'high' && (
                            <View style={{ backgroundColor: colors.status.error + "40", paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                              <Text style={{ fontSize: typography.fontSize.xs, color: colors.status.error, fontWeight: typography.fontWeight.semibold as '600' }}>
                                HIGH
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                          {meta.description}
                        </Text>
                        {isDisabled && (
                          <Text style={{ fontSize: typography.fontSize.xs, color: colors.status.warning, marginTop: spacing.xs }}>
                            Requires: {meta.requires?.map(req => featureFlagMetadata.find(m => m.key === req)?.label).join(', ')}
                          </Text>
                        )}
                      </View>
                      <Switch
                        value={value}
                        disabled={isDisabled}
                        onValueChange={(newValue) => {
                          setFeatureFlags({ ...featureFlags, [meta.key]: newValue });
                        }}
                        trackColor={{ false: colors.border, true: colors.accent }}
                        thumbColor={colors.text.primary}
                      />
                    </View>
                  );
                })}
              </View>
            ))}

            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                disabled={featureFlagsSaving}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.input,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                  opacity: featureFlagsSaving ? 0.5 : 1,
                }}
              >
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveFeatureFlags}
                disabled={featureFlagsSaving}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.accent,
                  alignItems: "center",
                  opacity: featureFlagsSaving ? 0.5 : 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: spacing.sm,
                }}
              >
                {featureFlagsSaving && <ActivityIndicator size="small" color={colors.textColors.onAccent} />}
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.textColors.onAccent }}>
                  {featureFlagsSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </AdminModal>
    );
  };

  const renderPaymentSettings = () => (
    <AdminModal
      visible={selectedCategory === "payments"}
      onClose={() => setSelectedCategory(null)}
      title="Payment Settings - BDN Payment"
    >
      <ScrollView style={{ maxHeight: 600 }}>
        <View style={{ gap: spacing.lg }}>
          <View style={{ backgroundColor: colors.status.warning + "20", borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.status.warning + "40" }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.sm }}>
              <MaterialIcons name="info" size={20} color={colors.status.warning} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.status.warning, marginBottom: spacing.xs }}>
                  BDN Payment Gateway
                </Text>
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                  Configure BDN Payment gateway settings. Keep API keys secure and never expose them publicly.
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Enable BDN Payment
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Enable payment processing via BDN Payment gateway
              </Text>
            </View>
            <Switch
              value={paymentSettings.bdnPaymentEnabled}
              onValueChange={(value) => setPaymentSettings({ ...paymentSettings, bdnPaymentEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Sandbox Mode
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Use test environment for payment processing
              </Text>
            </View>
            <Switch
              value={paymentSettings.sandboxMode}
              onValueChange={(value) => setPaymentSettings({ ...paymentSettings, sandboxMode: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              API Key
            </Text>
            <TextInput
              value={paymentSettings.bdnPaymentApiKey}
              onChangeText={(text) => setPaymentSettings({ ...paymentSettings, bdnPaymentApiKey: text })}
              placeholder="pk_live_..."
              placeholderTextColor={colors.text.placeholder}
              secureTextEntry
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              Secret Key
            </Text>
            <TextInput
              value={paymentSettings.bdnPaymentSecretKey}
              onChangeText={(text) => setPaymentSettings({ ...paymentSettings, bdnPaymentSecretKey: text })}
              placeholder="sk_live_..."
              placeholderTextColor={colors.text.placeholder}
              secureTextEntry
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
              Webhook Secret
            </Text>
            <TextInput
              value={paymentSettings.bdnPaymentWebhookSecret}
              onChangeText={(text) => setPaymentSettings({ ...paymentSettings, bdnPaymentWebhookSecret: text })}
              placeholder="whsec_..."
              placeholderTextColor={colors.text.placeholder}
              secureTextEntry
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                color: colors.text.primary,
                fontSize: typography.fontSize.base,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold as '700', color: colors.text.primary, marginBottom: spacing.md }}>
              Fee Configuration
            </Text>

            <View style={{ gap: spacing.md }}>
              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Consumer Service Fee (%)
                </Text>
                <TextInput
                  value={paymentSettings.consumerServiceFeePercent.toString()}
                  onChangeText={(text) => setPaymentSettings({ ...paymentSettings, consumerServiceFeePercent: parseFloat(text) || 0 })}
                  placeholder="10"
                  placeholderTextColor={colors.text.placeholder}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.input,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    color: colors.text.primary,
                    fontSize: typography.fontSize.base,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                    Min Fee (USD)
                  </Text>
                  <TextInput
                    value={paymentSettings.consumerServiceFeeMin.toString()}
                    onChangeText={(text) => setPaymentSettings({ ...paymentSettings, consumerServiceFeeMin: parseFloat(text) || 0 })}
                    placeholder="1.00"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.input,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      color: colors.text.primary,
                      fontSize: typography.fontSize.base,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                    Max Fee (USD)
                  </Text>
                  <TextInput
                    value={paymentSettings.consumerServiceFeeMax.toString()}
                    onChangeText={(text) => setPaymentSettings({ ...paymentSettings, consumerServiceFeeMax: parseFloat(text) || 0 })}
                    placeholder="14.99"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.input,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      color: colors.text.primary,
                      fontSize: typography.fontSize.base,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                </View>
              </View>

              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Business Platform Fee (%)
                </Text>
                <TextInput
                  value={paymentSettings.businessPlatformFeePercent.toString()}
                  onChangeText={(text) => setPaymentSettings({ ...paymentSettings, businessPlatformFeePercent: parseFloat(text) || 0 })}
                  placeholder="10"
                  placeholderTextColor={colors.text.placeholder}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.input,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    color: colors.text.primary,
                    fontSize: typography.fontSize.base,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Business Platform Fee with BDN+ (%)
                </Text>
                <TextInput
                  value={paymentSettings.businessPlatformFeePercentWithBDNPlus.toString()}
                  onChangeText={(text) => setPaymentSettings({ ...paymentSettings, businessPlatformFeePercentWithBDNPlus: parseFloat(text) || 0 })}
                  placeholder="5"
                  placeholderTextColor={colors.text.placeholder}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.input,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    color: colors.text.primary,
                    fontSize: typography.fontSize.base,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold as '700', color: colors.text.primary, marginBottom: spacing.md }}>
              Settlement Configuration
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                  Auto Settlement
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                  Automatically settle payments to businesses
                </Text>
              </View>
              <Switch
                value={paymentSettings.autoSettleEnabled}
                onValueChange={(value) => setPaymentSettings({ ...paymentSettings, autoSettleEnabled: value })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            {paymentSettings.autoSettleEnabled && (
              <View>
                <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                  Settlement Period (Days)
                </Text>
                <TextInput
                  value={paymentSettings.settlementPeriodDays.toString()}
                  onChangeText={(text) => setPaymentSettings({ ...paymentSettings, settlementPeriodDays: parseInt(text) || 0 })}
                  placeholder="7"
                  placeholderTextColor={colors.text.placeholder}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.input,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    color: colors.text.primary,
                    fontSize: typography.fontSize.base,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.input,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSavePaymentSettings}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.textColors.onAccent }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AdminModal>
  );

  const renderNotificationSettings = () => (
    <AdminModal
      visible={selectedCategory === "notifications"}
      onClose={() => setSelectedCategory(null)}
      title="Notification Settings"
    >
      <ScrollView style={{ maxHeight: 600 }}>
        <View style={{ gap: spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Push Notifications
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Enable push notifications for all users
              </Text>
            </View>
            <Switch
              value={notificationSettings.pushNotificationsEnabled}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, pushNotificationsEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Email Notifications
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Enable email notifications for all users
              </Text>
            </View>
            <Switch
              value={notificationSettings.emailNotificationsEnabled}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, emailNotificationsEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                SMS Notifications
              </Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                Enable SMS notifications (requires SMS provider)
              </Text>
            </View>
            <Switch
              value={notificationSettings.smsNotificationsEnabled}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, smsNotificationsEnabled: value })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text.primary}
            />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold as '700', color: colors.text.primary, marginBottom: spacing.md }}>
              Default Notification Channels
            </Text>
            {Object.entries(notificationSettings.defaultNotificationChannels).map(([channel, enabled]) => (
              <View key={channel} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, textTransform: "capitalize" }}>
                    {channel}
                  </Text>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={(value) => setNotificationSettings({
                    ...notificationSettings,
                    defaultNotificationChannels: {
                      ...notificationSettings.defaultNotificationChannels,
                      [channel]: value,
                    },
                  })}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.text.primary}
                />
              </View>
            ))}
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold as '700', color: colors.text.primary, marginBottom: spacing.md }}>
              Quiet Hours
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                  Enable Quiet Hours
                </Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.xs }}>
                  Suppress notifications during quiet hours
                </Text>
              </View>
              <Switch
                value={notificationSettings.quietHoursEnabled}
                onValueChange={(value) => setNotificationSettings({ ...notificationSettings, quietHoursEnabled: value })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.text.primary}
              />
            </View>

            {notificationSettings.quietHoursEnabled && (
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                    Start Time
                  </Text>
                  <TextInput
                    value={notificationSettings.quietHoursStart}
                    onChangeText={(text) => setNotificationSettings({ ...notificationSettings, quietHoursStart: text })}
                    placeholder="22:00"
                    placeholderTextColor={colors.text.placeholder}
                    style={{
                      backgroundColor: colors.input,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      color: colors.text.primary,
                      fontSize: typography.fontSize.base,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary, marginBottom: spacing.xs }}>
                    End Time
                  </Text>
                  <TextInput
                    value={notificationSettings.quietHoursEnd}
                    onChangeText={(text) => setNotificationSettings({ ...notificationSettings, quietHoursEnd: text })}
                    placeholder="08:00"
                    placeholderTextColor={colors.text.placeholder}
                    style={{
                      backgroundColor: colors.input,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      color: colors.text.primary,
                      fontSize: typography.fontSize.base,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.input,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.text.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveNotificationSettings}
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                backgroundColor: colors.accent,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold as '600', color: colors.textColors.onAccent }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AdminModal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.lg,
          paddingBottom: spacing["4xl"],
        }}
      >
        <View style={{ marginBottom: spacing["2xl"] }}>
          <Text
            style={{
              fontSize: isMobile ? typography.fontSize["2xl"] : typography.fontSize["3xl"],
              fontWeight: typography.fontWeight.extrabold as '800',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Platform Settings
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
              lineHeight: 24,
            }}
          >
            Configure platform settings and features
          </Text>
        </View>

        {/* Settings Categories */}
        <View style={{ gap: spacing.md }}>
          {settingsCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name={category.icon as any} size={24} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold as '700',
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {category.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                    }}
                  >
                    {category.description}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.text.tertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderPlatformSettings()}
      {renderFeatureFlags()}
      {renderPaymentSettings()}
      {renderNotificationSettings()}
    </View>
  );
}
