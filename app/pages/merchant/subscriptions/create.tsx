import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useResponsive } from '../../../../hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '../../../../constants/theme';
import { PageHeader } from '../../../../components/admin/AdminPageHeader';
import { FormInput, FormTextArea } from '../../../../components/forms';
import { SubscriptionFrequency, SubscriptionDuration, getFrequencyLabel, getDurationLabel } from '../../../../types/subscription-box';
import { Currency } from '../../../../types/international';


const frequencies: SubscriptionFrequency[] = ["daily", "weekly", "bi-weekly", "monthly", "quarterly", "yearly"];
const durations: SubscriptionDuration[] = [3, 6, 12, -1]; // in months, -1 for indefinite

export default function CreateSubscriptionPlan() {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");
  const [duration, setDuration] = useState<SubscriptionDuration>(12);
  const [price, setPrice] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [discount, setDiscount] = useState("");

  const canProceed = () => {
    return name.trim() && description.trim() && productId.trim() && price.trim() && shippingCost.trim();
  }

  const handleSubmit = async () => {
    if (!canProceed()) {
      Alert.alert("Missing Information", "Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("New Plan Data:", {
      name,
      description,
      productId,
      frequency,
      duration,
      price: parseFloat(price),
      shippingCost: parseFloat(shippingCost),
      currency,
      discountPercentage: parseFloat(discount) || 0,
    });
    setIsSubmitting(false);
    Alert.alert("Success", "New subscription plan created successfully.");
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        <PageHeader
          title="Create Plan"
          description="Create a new subscription plan for your products."
          showBackButton
        />

        <View style={{ gap: spacing.lg }}>
          <FormInput
            label="Plan Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Premium Monthly Box"
            required
          />
          <FormTextArea
            label="Plan Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What's included in this plan?"
            numberOfLines={4}
            required
          />
          <FormInput
            label="Product ID"
            value={productId}
            onChangeText={setProductId}
            placeholder="Enter the associated product ID"
            required
          />

          <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: spacing.md }}>
            <FormInput
              label="Price per Shipment"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
              containerStyle={{flex:1}}
              required
            />
            <FormInput
              label="Shipping Cost"
              value={shippingCost}
              onChangeText={setShippingCost}
              placeholder="0.00"
              keyboardType="decimal-pad"
               containerStyle={{flex:1}}
               required
            />
          </View>
            <FormInput
              label="Discount Percentage"
              value={discount}
              onChangeText={setDiscount}
              placeholder="e.g., 10 for 10%"
              keyboardType="number-pad"
            />

          <View>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>Frequency</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {frequencies.map(freq => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  style={{
                    backgroundColor: frequency === freq ? colors.accent : colors.secondary.bg,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: borderRadius.md,
                     borderWidth: 1,
                    borderColor: frequency === freq ? colors.accent : colors.border.light,
                  }}
                >
                  <Text style={{ color: frequency === freq ? colors.text.primary : colors.text.secondary, fontWeight: '600' }}>{getFrequencyLabel(freq)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

           <View>
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm }}>Duration</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {durations.map(dur => (
                <TouchableOpacity
                  key={dur}
                  onPress={() => setDuration(dur)}
                  style={{
                     backgroundColor: duration === dur ? colors.accent : colors.secondary.bg,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: borderRadius.md,
                     borderWidth: 1,
                    borderColor: duration === dur ? colors.accent : colors.border.light,
                  }}
                >
                  <Text style={{ color: duration === dur ? colors.text.primary : colors.text.secondary, fontWeight: '600' }}>{getDurationLabel(dur)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !canProceed()}
            style={{
              backgroundColor: (isSubmitting || !canProceed()) ? colors.border.light : colors.accent,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: 'center',
               opacity: (isSubmitting || !canProceed()) ? 0.6 : 1,
            }}
          >
            <Text style={{ color: colors.text.primary, fontWeight: 'bold', fontSize: typography.fontSize.base }}>
              {isSubmitting ? "Creating Plan..." : "Create Plan"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
