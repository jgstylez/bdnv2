import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { AdminModal } from "../AdminModal";
import { InternationalAddressForm } from "../../forms/InternationalAddressForm";
import { TaxIdSelector } from "../../forms/TaxIdSelector";
import { spacing } from "../../constants/theme";

const categories = [
  "Education",
  "Community",
  "Health",
  "Arts & Culture",
  "Environment",
  "Social Services",
  "Other",
];

interface NonprofitModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  onSave: () => void;
  form: any;
  setForm: (form: any) => void;
}

export function NonprofitModal({
  visible,
  onClose,
  isEditing,
  onSave,
  form,
  setForm,
}: NonprofitModalProps) {
  return (
    <AdminModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit Nonprofit" : "Create Nonprofit"}
      actions={[
        {
          label: "Cancel",
          onPress: onClose,
          variant: "secondary",
        },
        {
          label: isEditing ? "Save" : "Create",
          onPress: onSave,
          variant: "primary",
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.lg }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Organization Name *</Text>
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

          <TaxIdSelector
            value={form.taxIdentification}
            onChange={(taxId) => setForm({ ...form, taxIdentification: taxId })}
            country={form.address?.country || "US"}
            required
          />

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

          {isEditing && (
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
          )}

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

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Mission Statement</Text>
            <TextInput
              value={form.missionStatement}
              onChangeText={(text) => setForm({ ...form, missionStatement: text })}
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

          {isEditing && (
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Verified</Text>
              <TouchableOpacity
                onPress={() => setForm({ ...form, verified: !form.verified })}
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: form.verified ? "#4caf50" : "#474747",
                  justifyContent: "center",
                  paddingHorizontal: 4,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: "#ffffff",
                    transform: [{ translateX: form.verified ? 20 : 0 }],
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </AdminModal>
  );
}
