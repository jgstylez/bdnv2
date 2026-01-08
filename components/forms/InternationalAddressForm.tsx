/**
 * International Address Form Component
 * 
 * A reusable form component for entering international addresses
 * with country-specific field labels and validation
 */

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { InternationalAddress, CountryCode, COUNTRY_INFO } from '../../types/international';
import {
  getCountryInfo,
  validatePostalCode,
} from '../../types/international';
import {
  requiresStateField,
  getStateFieldLabel,
  getPostalCodeLabel,
} from '../../lib/international';
import { useResponsive } from '../../hooks/useResponsive';

interface InternationalAddressFormProps {
  value: Partial<InternationalAddress>;
  onChange: (address: Partial<InternationalAddress>) => void;
  required?: boolean;
  showCountrySelector?: boolean;
  defaultCountry?: CountryCode;
  editable?: boolean;
  style?: any;
}

export function InternationalAddressForm({
  value,
  onChange,
  required = false,
  showCountrySelector = true,
  defaultCountry = "US",
  editable = true,
  style,
}: InternationalAddressFormProps) {
  const { isMobile } = useResponsive();
  const [address, setAddress] = useState<Partial<InternationalAddress>>({
    country: defaultCountry,
    ...value,
  });
  const [showCountryList, setShowCountryList] = useState(false);

  const countryCode = (address.country || defaultCountry) as CountryCode;
  const countryInfo = getCountryInfo(countryCode);
  const needsState = requiresStateField(countryCode);
  const stateLabel = getStateFieldLabel(countryCode);
  const postalCodeLabel = getPostalCodeLabel(countryCode);

  useEffect(() => {
    onChange(address);
  }, [address]);

  const updateAddress = (field: keyof InternationalAddress, val: string) => {
    setAddress((prev) => ({ ...prev, [field]: val }));
  };

  const handleCountrySelect = (country: CountryCode) => {
    setAddress((prev) => ({
      ...prev,
      country,
      state: needsState ? prev.state : undefined, // Clear state if not needed
    }));
    setShowCountryList(false);
  };

  const countryList = Object.values(COUNTRY_INFO).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <View style={[{ gap: 16 }, style]}>
      {/* Street Address */}
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Street Address {required && <Text style={{ color: "#ba9988" }}>*</Text>}
        </Text>
        <TextInput
          value={address.street || ""}
          onChangeText={(text) => updateAddress("street", text)}
          placeholder="Enter street address"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          editable={editable}
          accessible={true}
          accessibilityRole="textbox"
          accessibilityLabel="Street address"
          accessibilityHint="Enter your street address"
          accessibilityState={{ disabled: !editable }}
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            color: "#ffffff",
            fontSize: 14,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      {/* Street Address Line 2 (Optional) */}
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Apartment, Suite, etc. (Optional)
        </Text>
        <TextInput
          value={address.street2 || ""}
          onChangeText={(text) => updateAddress("street2", text)}
          placeholder="Apt, Suite, Unit, etc."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          editable={editable}
          accessible={true}
          accessibilityRole="textbox"
          accessibilityLabel="Apartment, suite, or unit number"
          accessibilityHint="Enter apartment, suite, or unit number if applicable"
          accessibilityState={{ disabled: !editable }}
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            color: "#ffffff",
            fontSize: 14,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      {/* City and State/Province Row */}
      <View style={{ flexDirection: isMobile ? "column" : "row", gap: 12 }}>
        <View style={{ flex: isMobile ? undefined : 2 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            City {required && <Text style={{ color: "#ba9988" }}>*</Text>}
          </Text>
          <TextInput
            value={address.city || ""}
            onChangeText={(text) => updateAddress("city", text)}
            placeholder="City"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            editable={editable}
            accessible={true}
            accessibilityRole="textbox"
            accessibilityLabel="City"
            accessibilityHint="Enter your city"
            accessibilityState={{ disabled: !editable }}
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              color: "#ffffff",
              fontSize: 14,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          />
        </View>

        {needsState && (
          <View style={{ flex: isMobile ? undefined : 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              {stateLabel} {required && <Text style={{ color: "#ba9988" }}>*</Text>}
            </Text>
            <TextInput
              value={address.state || ""}
              onChangeText={(text) => updateAddress("state", text)}
              placeholder={stateLabel}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              editable={editable}
              accessible={true}
              accessibilityRole="textbox"
              accessibilityLabel={stateLabel}
              accessibilityHint={`Enter your ${stateLabel.toLowerCase()}`}
              accessibilityState={{ disabled: !editable }}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>
        )}
      </View>

      {/* Postal Code and Country Row */}
      <View style={{ flexDirection: isMobile ? "column" : "row", gap: 12 }}>
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            {postalCodeLabel} {required && <Text style={{ color: "#ba9988" }}>*</Text>}
          </Text>
          <TextInput
            value={address.postalCode || ""}
            onChangeText={(text) => updateAddress("postalCode", text)}
            placeholder={postalCodeLabel}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            keyboardType="default"
            editable={editable}
            accessible={true}
            accessibilityRole="textbox"
            accessibilityLabel={postalCodeLabel}
            accessibilityHint={`Enter your ${postalCodeLabel.toLowerCase()}`}
            accessibilityState={{ disabled: !editable }}
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              color: "#ffffff",
              fontSize: 14,
              borderWidth: 1,
              borderColor: validatePostalCode(countryCode, address.postalCode || "")
                ? "rgba(186, 153, 136, 0.5)"
                : address.postalCode
                ? "rgba(255, 0, 0, 0.5)"
                : "rgba(186, 153, 136, 0.2)",
            }}
          />
        </View>

        {showCountrySelector && (
          <View style={{ flex: isMobile ? undefined : 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Country {required && <Text style={{ color: "#ba9988" }}>*</Text>}
            </Text>
            <TouchableOpacity
              onPress={() => editable && setShowCountryList(!showCountryList)}
              disabled={!editable}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Country selector. Current selection: ${countryInfo?.name || address.country || "Select Country"}`}
              accessibilityHint="Double tap to open country selection list"
              accessibilityState={{ disabled: !editable, expanded: showCountryList }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: editable ? 1 : 0.5,
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 14 }}>
                {countryInfo?.name || address.country || "Select Country"}
              </Text>
              <MaterialIcons
                name={showCountryList ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={20}
                color="#ba9988"
              />
            </TouchableOpacity>

            {showCountryList && (
              <View
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  maxHeight: 300,
                  zIndex: 1000,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <ScrollView style={{ maxHeight: 300 }}>
                  {countryList.map((country) => (
                    <TouchableOpacity
                      key={country.code}
                      onPress={() => handleCountrySelect(country.code)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Select country ${country.name}`}
                      accessibilityState={{ selected: address.country === country.code }}
                      accessibilityHint="Double tap to select this country"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 14 }}>
                        {country.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

