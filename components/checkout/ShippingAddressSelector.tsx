/**
 * Shipping Address Selector Component
 * 
 * Allows users to select, add, or edit shipping addresses during checkout
 * Only shown for physical products that require shipping
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { ShippingAddress } from '@/types/orders';
import { InternationalAddressForm } from '@/components/forms/InternationalAddressForm';
import { InternationalAddress } from '@/types/international';
import { TextInput } from 'react-native';

interface ShippingAddressSelectorProps {
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string | null) => void;
  onAddressChange: (address: ShippingAddress | null) => void;
}

// Extended ShippingAddress with id for management
type ShippingAddressWithId = ShippingAddress & { id: string };

// Mock saved addresses - in production, fetch from API/context
const mockSavedAddresses: ShippingAddressWithId[] = [
  {
    id: "addr-1",
    fullName: "John Doe",
    street: "123 Main Street",
    street2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
    phone: "555-123-4567",
    phoneCountryCode: "US",
    isDefault: true,
  },
  {
    id: "addr-2",
    fullName: "Jane Smith",
    street: "456 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    country: "US",
    phone: "555-987-6543",
    phoneCountryCode: "US",
    isDefault: false,
  },
];

export function ShippingAddressSelector({
  selectedAddressId,
  onSelectAddress,
  onAddressChange,
}: ShippingAddressSelectorProps) {
  const { isMobile, paddingHorizontal, scrollViewBottomPadding } = useResponsive();
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddressWithId[]>(mockSavedAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ShippingAddressWithId>>({
    fullName: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    phoneCountryCode: "US",
  });

  // Set default address as selected if none selected
  useEffect(() => {
    if (!selectedAddressId && savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault) || savedAddresses[0];
      if (defaultAddress) {
        onSelectAddress(defaultAddress.id || null);
        onAddressChange(defaultAddress);
      }
    } else if (selectedAddressId) {
      const selected = savedAddresses.find((addr) => addr.id === selectedAddressId);
      if (selected) {
        onAddressChange(selected);
      }
    }
  }, [selectedAddressId, savedAddresses]);

  const handleSelectAddress = (address: ShippingAddress) => {
    if (address.id) {
      onSelectAddress(address.id);
      onAddressChange(address);
    }
  };

  const handleAddNew = () => {
    setFormData({
      fullName: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      phone: "",
      phoneCountryCode: "US",
    });
    setEditingAddressId(null);
    setShowAddModal(true);
  };

  const handleEdit = (address: ShippingAddress) => {
    setFormData({
      fullName: address.fullName,
      street: address.street,
      street2: address.street2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      phoneCountryCode: address.phoneCountryCode,
    });
    setEditingAddressId(address.id || null);
    setShowAddModal(true);
  };

  const handleSaveAddress = () => {
    // Validate required fields
    if (!formData.fullName || !formData.street || !formData.city || !formData.postalCode || !formData.country) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    const addressData: ShippingAddressWithId = {
      id: editingAddressId || `addr-${Date.now()}`,
      fullName: formData.fullName!,
      street: formData.street!,
      street2: formData.street2,
      city: formData.city!,
      state: formData.state,
      postalCode: formData.postalCode!,
      country: formData.country!,
      phone: formData.phone,
      phoneCountryCode: formData.phoneCountryCode,
      isDefault: savedAddresses.length === 0, // First address is default
    };

    if (editingAddressId) {
      // Update existing address
      const updated = savedAddresses.map((addr) =>
        addr.id === editingAddressId ? addressData : addr
      );
      setSavedAddresses(updated);
      
      // If this was the selected address, update it
      if (selectedAddressId === editingAddressId) {
        onAddressChange(addressData);
      }
    } else {
      // Add new address
      const updated = [...savedAddresses, addressData];
      setSavedAddresses(updated);
      // Select the new address
      handleSelectAddress(addressData);
    }

    setShowAddModal(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = savedAddresses.filter((addr) => addr.id !== addressId);
            setSavedAddresses(updated);
            
            // If deleted address was selected, select default or first
            if (selectedAddressId === addressId) {
              const newDefault = updated.find((addr) => addr.isDefault) || updated[0];
              if (newDefault) {
                handleSelectAddress(newDefault);
              } else {
                onSelectAddress(null);
                onAddressChange(null);
              }
            }
          },
        },
      ]
    );
  };

  const handleAddressFormChange = (address: Partial<InternationalAddress>) => {
    setFormData((prev) => ({ ...prev, ...address }));
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <Text
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: colors.text.primary,
        }}
      >
        Shipping Address
      </Text>

      {/* Saved Addresses */}
      <View style={{ gap: spacing.md }}>
        {savedAddresses.map((address) => {
          const isSelected = selectedAddressId === address.id;
          return (
            <TouchableOpacity
              key={address.id}
              onPress={() => handleSelectAddress(address)}
              style={{
                backgroundColor: colors.input,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                borderWidth: 2,
                borderColor: isSelected ? colors.accent : colors.border,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
                  <Text
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.primary,
                      marginRight: spacing.sm,
                    }}
                  >
                    {address.fullName}
                  </Text>
                  {address.isDefault && (
                    <View
                      style={{
                        backgroundColor: colors.accent + "20",
                        paddingHorizontal: spacing.xs,
                        paddingVertical: 2,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.accent,
                        }}
                      >
                        DEFAULT
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs / 2,
                  }}
                >
                  {address.street}
                  {address.street2 && `, ${address.street2}`}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginBottom: spacing.xs / 2,
                  }}
                >
                  {address.city}, {address.state} {address.postalCode}
                </Text>
                {address.phone && (
                  <Text
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                    }}
                  >
                    {address.phone}
                  </Text>
                )}
              </View>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                {isSelected && (
                  <MaterialIcons name="check-circle" size={24} color={colors.accent} />
                )}
                <TouchableOpacity
                  onPress={() => handleEdit(address)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="edit" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
                {savedAddresses.length > 1 && (
                  <TouchableOpacity
                    onPress={() => address.id && handleDeleteAddress(address.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialIcons name="delete-outline" size={20} color={colors.status.error} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Add New Address Button */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
          borderStyle: "dashed",
          backgroundColor: colors.input,
        }}
      >
        <MaterialIcons name="add" size={24} color={colors.accent} />
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.accent,
            marginLeft: spacing.sm,
          }}
        >
          Add New Address
        </Text>
      </TouchableOpacity>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: paddingHorizontal,
              paddingTop: spacing.lg,
              paddingBottom: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddModal(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: paddingHorizontal,
              paddingTop: spacing.lg,
              paddingBottom: scrollViewBottomPadding,
            }}
          >
            {/* Full Name */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                Full Name <Text style={{ color: colors.accent }}>*</Text>
              </Text>
              <TextInput
                value={formData.fullName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, fullName: text }))}
                placeholder="Enter full name"
                placeholderTextColor={colors.text.tertiary}
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

            {/* Phone Number */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}
              >
                Phone Number
              </Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="phone-pad"
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

            {/* Address Form */}
            <InternationalAddressForm
              value={{
                street: formData.street,
                street2: formData.street2,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country || "US",
              }}
              onChange={handleAddressFormChange}
              required={true}
              defaultCountry={(formData.country as any) || "US"}
            />

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveAddress}
              style={{
                backgroundColor: colors.accent,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md + 2,
                paddingHorizontal: paddingHorizontal,
                alignItems: "center",
                marginTop: spacing.xl,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.textColors.onAccent,
                }}
              >
                Save Address
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
