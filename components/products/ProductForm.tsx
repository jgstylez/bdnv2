import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { spacing } from "../../constants/theme";

interface ProductFormProps {
  form: any;
  setForm: (form: any) => void;
  categories: string[];
  isNonprofit?: boolean;
}

export function ProductForm({ form, setForm, categories, isNonprofit }: ProductFormProps) {
  return (
    <View style={{ gap: spacing.lg }}>
      {/* Basic Info */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 16 }}>
          Basic Information
        </Text>
        
        <View style={{ gap: spacing.md }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              {isNonprofit ? "Item Name *" : "Product Name *"}
            </Text>
            <TextInput
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder={isNonprofit ? "e.g. Handmade Quilt" : "e.g. Premium T-Shirt"}
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Description *
            </Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              multiline
              numberOfLines={4}
              placeholder="Describe your item..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Category *
            </Text>
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
        </View>
      </View>

      {/* Pricing */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 16 }}>
          Pricing & Inventory
        </Text>
        
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Price ($) *
            </Text>
            <TextInput
              value={form.price}
              onChangeText={(text) => setForm({ ...form, price: text })}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
          
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
              Stock *
            </Text>
            <TextInput
              value={form.stock}
              onChangeText={(text) => setForm({ ...form, stock: text })}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
      </View>

      {/* Images */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 16 }}>
          Product Images
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {form.images.map((img: string, index: number) => (
            <View key={index} style={{ position: "relative" }}>
              <Image
                source={{ uri: img }}
                style={{ width: 100, height: 100, borderRadius: 12, backgroundColor: "#232323" }}
              />
              <TouchableOpacity
                onPress={() => setForm({ ...form, images: form.images.filter((_: string, i: number) => i !== index) })}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "#ff4444",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <MaterialIcons name="close" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              borderRadius: 12,
              backgroundColor: "#232323",
              borderWidth: 2,
              borderColor: "rgba(186, 153, 136, 0.2)",
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="add-photo-alternate" size={32} color="rgba(186, 153, 136, 0.5)" />
            <Text style={{ fontSize: 12, color: "rgba(186, 153, 136, 0.5)", marginTop: 4 }}>Add Image</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
