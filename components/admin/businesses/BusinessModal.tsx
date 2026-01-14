import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { AdminModal } from "../AdminModal";
import { MerchantType } from '../../../types/merchant';
import { InternationalAddressForm } from '../../forms/InternationalAddressForm';
import { CurrencySelector } from '../../forms/CurrencySelector';
import { TaxIdSelector } from '../../forms/TaxIdSelector';
import { spacing } from '../../../constants/theme';
import { BUSINESS_CATEGORIES } from '../../../constants/categories';

const categories = [...BUSINESS_CATEGORIES];

const MERCHANT_TYPES: { value: MerchantType; label: string }[] = [
  { value: "local-shop", label: "Local Shop" },
  { value: "local-service", label: "Local Service" },
  { value: "national-service", label: "National Service" },
  { value: "online-shopping", label: "Online Shopping" },
];

interface BusinessModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  onSave: () => void;
  form: any;
  setForm: (form: any) => void;
}

export function BusinessModal({
  visible,
  onClose,
  isEditing,
  onSave,
  form,
  setForm,
}: BusinessModalProps) {
  return (
    <AdminModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit Business" : "Create Business"}
      actions={[
        {
          label: "Cancel",
          onPress: onClose,
          variant: "secondary",
        },
        {
          label: "Save",
          onPress: onSave,
          variant: "primary",
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.lg }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Business Name *</Text>
            <TextInput
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Email *</Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              keyboardType="email-address"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Phone</Text>
            <TextInput
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              keyboardType="phone-pad"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 8 }}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setForm({ ...form, category: cat })}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: form.category === cat ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: form.category === cat ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: form.category === cat ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Merchant Type</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {MERCHANT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setForm({ ...form, merchantType: type.value })}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: form.merchantType === type.value ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: form.merchantType === type.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: form.merchantType === type.value ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {isEditing && (
            <>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Merchant Level</Text>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {(["basic", "premier", "platinum"] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setForm({ ...form, merchantLevel: level })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: form.merchantLevel === level ? "#ba9988" : "#232323",
                        borderWidth: 1,
                        borderColor: form.merchantLevel === level ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: form.merchantLevel === level ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          textTransform: "capitalize",
                        }}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Status</Text>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {(["pending", "approved", "rejected", "suspended"] as const).map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setForm({ ...form, status })}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: form.status === status ? "#ba9988" : "#232323",
                        borderWidth: 1,
                        borderColor: form.status === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: form.status === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          textTransform: "capitalize",
                        }}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                textAlignVertical: "top",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 16 }}>
              Address
            </Text>
            <InternationalAddressForm
              value={form.address}
              onChange={(address) => setForm({ ...form, address: { ...form.address, ...address } })}
              defaultCountry={form.address?.country || "US"}
            />
          </View>

          <CurrencySelector
            value={form.currency}
            onChange={(currency) => setForm({ ...form, currency })}
            showBLKD={true}
          />

          <TaxIdSelector
            value={form.taxIdentification}
            onChange={(taxId) => setForm({ ...form, taxIdentification: taxId })}
            country={form.address?.country || "US"}
          />

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Website</Text>
            <TextInput
              value={form.website}
              onChangeText={(text) => setForm({ ...form, website: text })}
              keyboardType="url"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>
        </View>
      </ScrollView>
    </AdminModal>
  );
}
