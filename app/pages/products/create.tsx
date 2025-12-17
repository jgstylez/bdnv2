import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing } from "@/constants/theme";
import { ProductStepIndicator } from "@/components/products/ProductStepIndicator";
import { ProductTypeSelector } from "@/components/products/ProductTypeSelector";
import { ProductForm } from "@/components/products/ProductForm";

// Categories based on user type
const MERCHANT_CATEGORIES = [
  "Clothing & Apparel",
  "Home & Living",
  "Beauty & Personal Care",
  "Food & Beverage",
  "Art & Collectibles",
  "Jewelry & Accessories",
  "Electronics",
  "Other"
];

const NONPROFIT_CATEGORIES = [
  "Donation",
  "Merchandise",
  "Event Ticket",
  "Fundraising Item",
  "Digital Download",
  "Other"
];

const PRODUCT_TYPES = [
  {
    id: "physical",
    label: "Physical Product",
    icon: "shopping-bag" as keyof typeof MaterialIcons.glyphMap,
    description: "Item that requires shipping or pickup",
  },
  {
    id: "digital",
    label: "Digital Product",
    icon: "cloud-download" as keyof typeof MaterialIcons.glyphMap,
    description: "File or content available for download",
  },
  {
    id: "service",
    label: "Service",
    icon: "room-service" as keyof typeof MaterialIcons.glyphMap,
    description: "Service or experience offered",
  },
];

export default function CreateProduct() {
  const { isMobile, paddingHorizontal } = useResponsive();
  const params = useLocalSearchParams();
  const isNonprofit = params.type === "nonprofit";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    category: "",
    stock: "",
    sku: "",
    images: [] as string[],
    shipping: {
      weight: "",
      dimensions: "",
      class: "standard",
    },
    attributes: [] as { name: string; options: string[] }[],
  });

  const steps = ["Type", "Details", "Inventory", "Review"];

  const handleNext = () => {
    if (currentStep === 1 && !productType) {
      Alert.alert("Required", "Please select a product type");
      return;
    }
    if (currentStep === 2) {
      if (!form.name || !form.price || !form.category) {
        Alert.alert("Required", "Please fill in all required fields");
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      Alert.alert("Success", "Product created successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <AppHeader />
      
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingVertical: spacing["2xl"],
        }}
      >
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
            {isNonprofit ? "Create New Item" : "Add New Product"}
          </Text>
          <Text style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}>
            Fill in the details below to add a new item to your catalog.
          </Text>
        </View>

        <ProductStepIndicator currentStep={currentStep} steps={steps} />

        <View style={{ 
          backgroundColor: "#2a2a2a",
          borderRadius: 20,
          padding: spacing.xl,
          borderWidth: 1,
          borderColor: "rgba(186, 153, 136, 0.1)",
        }}>
          {currentStep === 1 && (
            <ProductTypeSelector
              selectedType={productType}
              onSelect={setProductType}
              productTypes={PRODUCT_TYPES}
            />
          )}

          {currentStep === 2 && (
            <ProductForm
              form={form}
              setForm={setForm}
              categories={isNonprofit ? NONPROFIT_CATEGORIES : MERCHANT_CATEGORIES}
              isNonprofit={isNonprofit}
            />
          )}

          {currentStep === 3 && (
            <View>
              <Text style={{ color: "#fff", marginBottom: 20 }}>Inventory settings go here...</Text>
              {/* Add inventory fields if needed */}
            </View>
          )}
          
          {currentStep === 4 && (
            <View>
              <Text style={{ color: "#fff", marginBottom: 20 }}>Review your details...</Text>
              {/* Add summary view */}
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 32 }}>
            <TouchableOpacity
              onPress={handleBack}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: "#232323",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                {currentStep === 1 ? "Cancel" : "Back"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleNext}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: "#ba9988",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                {currentStep === 4 ? "Publish Product" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
