import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  SubscriptionFrequency,
  SubscriptionDuration,
  getFrequencyLabel,
  getDurationLabel,
} from "../../types/subscription-box";
import { calculateSubscriptionBoxPricing } from "../../lib/subscription-box";
import { SubscriptionBoxPlan } from "../../types/subscription-box";
import { formatCurrency } from "../../lib/international";
import { calculateConsumerServiceFee, checkBDNPlusSubscription } from "../../lib/fees";
import { colors, typography, spacing, borderRadius } from "../../constants/theme";

// Compact Select Component (similar to CurrencySelector)
interface CompactSelectProps<T> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onSelect: (value: T) => void;
  onOpen?: () => void;
  isOpen?: boolean;
}

function CompactSelect<T>({ value, options, onSelect, onOpen, isOpen }: CompactSelectProps<T>) {
  const [showList, setShowList] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const isDropdownOpen = isOpen !== undefined ? isOpen : showList;

  const handleToggle = () => {
    const newState = !isDropdownOpen;
    if (onOpen) {
      onOpen();
    } else {
      setShowList(newState);
    }
  };

  const handleSelect = (optionValue: T) => {
    onSelect(optionValue);
    if (onOpen) {
      onOpen();
    } else {
      setShowList(false);
    }
  };

  return (
    <View style={{ position: "relative", zIndex: isDropdownOpen ? 1000 : 1 }}>
      <TouchableOpacity
        onPress={handleToggle}
        style={{
          backgroundColor: colors.background.primary,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderWidth: 1,
          borderColor: colors.border.light,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: isDropdownOpen ? 1001 : 1,
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
          }}
        >
          {selectedOption?.label || "Select"}
        </Text>
        <MaterialIcons
          name={isDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: spacing.xs,
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            maxHeight: 200,
            zIndex: 1002,
            borderWidth: 1,
            borderColor: colors.border.light,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {options.map((option) => (
              <TouchableOpacity
                key={String(option.value)}
                onPress={() => handleSelect(option.value)}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.light,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor:
                    value === option.value
                      ? colors.accent + "20"
                      : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight:
                      value === option.value
                        ? typography.fontWeight.bold
                        : typography.fontWeight.medium,
                    color:
                      value === option.value
                        ? colors.text.primary
                        : colors.text.secondary,
                  }}
                >
                  {option.label}
                </Text>
                {value === option.value && (
                  <MaterialIcons name="check" size={18} color={colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

interface SubscriptionBoxSelectorProps {
  plan: SubscriptionBoxPlan;
  quantity: number;
  userId: string;
  onSelect: (frequency: SubscriptionFrequency, duration: SubscriptionDuration) => void;
  selectedFrequency?: SubscriptionFrequency;
  selectedDuration?: SubscriptionDuration;
  onSubscriptionToggle?: (enabled: boolean) => void;
  isSubscriptionEnabled?: boolean;
}

const FREQUENCY_OPTIONS: SubscriptionFrequency[] = [
  "weekly",
  "bi-weekly",
  "monthly",
  "bi-monthly",
  "quarterly",
];

const DURATION_OPTIONS: SubscriptionDuration[] = [4, 8, 12, 24, -1]; // -1 for ongoing

export default function SubscriptionBoxSelector({
  plan,
  quantity,
  userId,
  onSelect,
  selectedFrequency,
  selectedDuration,
  onSubscriptionToggle,
  isSubscriptionEnabled = false,
}: SubscriptionBoxSelectorProps) {
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(
    selectedFrequency || plan.frequency
  );
  const [duration, setDuration] = useState<SubscriptionDuration>(
    selectedDuration || plan.duration
  );
  const [openDropdown, setOpenDropdown] = useState<"frequency" | "duration" | null>(null);
  const [isExpanded, setIsExpanded] = useState(isSubscriptionEnabled);

  const updatedPlan: SubscriptionBoxPlan = {
    ...plan,
    frequency,
    duration,
  };

  const pricing = calculateSubscriptionBoxPricing(updatedPlan, quantity, userId);

  const handleFrequencySelect = (freq: SubscriptionFrequency) => {
    setFrequency(freq);
    onSelect(freq, duration);
  };

  const handleDurationSelect = (dur: SubscriptionDuration) => {
    setDuration(dur);
    onSelect(frequency, dur);
  };

  const handleToggleSubscription = () => {
    const newState = !isSubscriptionEnabled;
    if (onSubscriptionToggle) {
      onSubscriptionToggle(newState);
    }
    setIsExpanded(newState);
  };

  // Calculate one-time purchase total for comparison
  const oneTimeSubtotal = plan.pricePerShipment * quantity + (plan.shippingCostPerShipment * quantity);
  const hasBDNPlus = checkBDNPlusSubscription(userId);
  const oneTimeFee = calculateConsumerServiceFee(oneTimeSubtotal, plan.currency, hasBDNPlus);
  const oneTimeTotal = oneTimeSubtotal + oneTimeFee;
  
  // Calculate savings
  const savings = Math.max(0, oneTimeTotal - pricing.totalPerShipment);
  const savingsPercentage = plan.discountPercentage || 0;

  // Collapsed view
  if (!isExpanded) {
    return (
      <View
        style={{
          backgroundColor: colors.secondary.bg,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        <TouchableOpacity
          onPress={handleToggleSubscription}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="repeat" size={20} color={colors.accent} />
            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Subscribe & Save
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.secondary,
                  marginTop: spacing.xs / 2,
                }}
              >
                {savingsPercentage > 0 && (
                  <Text style={{ color: colors.status.success, fontWeight: typography.fontWeight.semibold }}>
                    Save {savingsPercentage}% • 
                  </Text>
                )}
                {" "}Get automatic deliveries & never run out
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 48,
              height: 28,
              borderRadius: 14,
              backgroundColor: isSubscriptionEnabled ? colors.accent : colors.background.primary,
              borderWidth: 1,
              borderColor: isSubscriptionEnabled ? colors.accent : colors.border.light,
              justifyContent: "center",
              paddingHorizontal: 2,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.text.primary,
                transform: [{ translateX: isSubscriptionEnabled ? 20 : 0 }],
              }}
            />
          </View>
        </TouchableOpacity>
        
        {savings > 0 && (
          <View
            style={{
              marginTop: spacing.sm,
              padding: spacing.sm,
              backgroundColor: colors.status.success + "15",
              borderRadius: borderRadius.sm,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="savings" size={16} color={colors.status.success} />
            <Text
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.status.success,
                marginLeft: spacing.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Save {formatCurrency(savings, plan.currency)} per shipment
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Expanded view
  return (
    <View
      style={{
        backgroundColor: colors.secondary.bg,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <MaterialIcons name="repeat" size={24} color={colors.accent} />
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginLeft: spacing.sm,
            }}
          >
            Subscribe & Save
          </Text>
        </View>
        <TouchableOpacity onPress={handleToggleSubscription}>
          <MaterialIcons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
          marginBottom: spacing.lg,
        }}
      >
        Get automatic deliveries and save with recurring shipments
      </Text>

      {/* Compact Frequency & Duration Selection */}
      <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg, zIndex: 100 }}>
        {/* Frequency Dropdown */}
        <View style={{ flex: 1, zIndex: openDropdown === "frequency" ? 1001 : 100 }}>
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.secondary,
              marginBottom: spacing.xs,
            }}
          >
            Frequency
          </Text>
          <CompactSelect
            value={frequency}
            options={FREQUENCY_OPTIONS.map((freq) => ({
              value: freq,
              label: getFrequencyLabel(freq),
            }))}
            onSelect={(freq) => handleFrequencySelect(freq as SubscriptionFrequency)}
            onOpen={() => setOpenDropdown(openDropdown === "frequency" ? null : "frequency")}
            isOpen={openDropdown === "frequency"}
          />
        </View>

        {/* Duration Dropdown */}
        <View style={{ flex: 1, zIndex: openDropdown === "duration" ? 1001 : 100 }}>
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.secondary,
              marginBottom: spacing.xs,
            }}
          >
            Duration
          </Text>
          <CompactSelect
            value={duration}
            options={DURATION_OPTIONS.map((dur) => ({
              value: dur,
              label: getDurationLabel(dur),
            }))}
            onSelect={(dur) => handleDurationSelect(dur as SubscriptionDuration)}
            onOpen={() => setOpenDropdown(openDropdown === "duration" ? null : "duration")}
            isOpen={openDropdown === "duration"}
          />
        </View>
      </View>

      {/* Pricing Breakdown */}
      <View
        style={{
          backgroundColor: colors.background.primary,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          marginTop: spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: spacing.xs,
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}
          >
            Price per shipment
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.primary,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {formatCurrency(pricing.pricePerShipment, pricing.currency)}
          </Text>
        </View>

        {pricing.shippingPerShipment > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              Shipping per shipment
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.primary,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {formatCurrency(pricing.shippingPerShipment, pricing.currency)}
            </Text>
          </View>
        )}

        {pricing.discountAmount && pricing.discountAmount > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.status.success,
              }}
            >
              Discount ({plan.discountPercentage}%)
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.status.success,
                fontWeight: typography.fontWeight.bold,
              }}
            >
              -{formatCurrency(pricing.discountAmount, pricing.currency)}
            </Text>
          </View>
        )}

        {pricing.serviceFeePerShipment > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.secondary,
              }}
            >
              Service fee
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.text.primary,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {formatCurrency(pricing.serviceFeePerShipment, pricing.currency)}
            </Text>
          </View>
        )}

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border.light,
            marginTop: spacing.sm,
            paddingTop: spacing.sm,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
          >
            Total per shipment
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.accent,
            }}
          >
            {formatCurrency(pricing.totalPerShipment, pricing.currency)}
          </Text>
        </View>

        {duration !== -1 && (
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              marginTop: spacing.xs,
              textAlign: "center",
            }}
          >
            {duration} shipments × {formatCurrency(pricing.totalPerShipment, pricing.currency)} ={" "}
            {formatCurrency(pricing.totalPerShipment * duration, pricing.currency)} total
          </Text>
        )}
      </View>

      {pricing.hasBDNPlus && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: spacing.md,
            padding: spacing.sm,
            backgroundColor: colors.status.success + "20",
            borderRadius: borderRadius.sm,
          }}
        >
          <MaterialIcons name="check-circle" size={16} color={colors.status.success} />
          <Text
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.status.success,
              marginLeft: spacing.xs,
            }}
          >
            No service fees with BDN+
          </Text>
        </View>
      )}
    </View>
  );
}

