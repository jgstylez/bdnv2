import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing } from "@/constants/theme";
import { ProductStepIndicator } from "@/components/products/ProductStepIndicator";
import { ProductTypeSelector } from "@/components/products/ProductTypeSelector";
import { ProductForm } from "@/components/products/ProductForm";
import { api } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { handleError } from "@/lib/error-handler";
import { getStorageItem } from "@/lib/storage";
import { ENV } from "@/lib/config";

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
  const productId = params.id as string | undefined;
  const isEditing = !!productId;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [nonprofitId, setNonprofitId] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<any>(null);
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

  // Get entity ID (merchant or nonprofit) from storage
  useEffect(() => {
    const loadEntityId = async () => {
      try {
        if (isNonprofit) {
          // Load nonprofit ID
          const selectedNonprofitId = await getStorageItem("@bdn_selected_nonprofit_id");
          if (selectedNonprofitId) {
            setNonprofitId(selectedNonprofitId);
            console.log("Loaded nonprofitId from storage:", selectedNonprofitId);
          } else {
            // Fallback: use a default or get from params
            const nonprofitIdParam = params.nonprofitId as string | undefined;
            if (nonprofitIdParam) {
              setNonprofitId(nonprofitIdParam);
              console.log("Loaded nonprofitId from params:", nonprofitIdParam);
            } else {
              console.warn("No nonprofitId found, using fallback");
              setNonprofitId("org1"); // Fallback for development
            }
          }
        } else {
          // Load business/merchant ID
          const selectedBusinessId = await getStorageItem("@bdn_selected_business_id");
          if (selectedBusinessId) {
            setMerchantId(selectedBusinessId);
            console.log("Loaded merchantId from storage:", selectedBusinessId);
          } else {
            // Fallback: use a default or get from params
            const merchantIdParam = params.merchantId as string | undefined;
            if (merchantIdParam) {
              setMerchantId(merchantIdParam);
              console.log("Loaded merchantId from params:", merchantIdParam);
            } else {
              console.warn("No merchantId found, using fallback");
              setMerchantId("1"); // Fallback for development
            }
          }
        }
      } catch (error) {
        logger.error(`Error loading ${isNonprofit ? "nonprofit" : "merchant"} ID`, error);
        // Fallback for development
        if (isNonprofit) {
          setNonprofitId("org1");
        } else {
          setMerchantId("1");
        }
      }
    };
    loadEntityId();
  }, [params.merchantId, params.nonprofitId, isNonprofit]);

  // Helper functions for dimensions
  const parseDimensions = (dimensions: string) => {
    const parts = dimensions.split("x");
    return {
      length: parts[0] || "",
      width: parts[1] || "",
      height: parts[2] || "",
    };
  };

  const formatDimensions = (length: string, width: string, height: string) => {
    const parts = [length, width, height].filter(p => p);
    return parts.join("x");
  };

  const transformFormDataToApiFormat = () => {
    const dims = parseDimensions(form.shipping.dimensions);
    const dimensions = dims.length && dims.width && dims.height
      ? {
          length: parseFloat(dims.length),
          width: parseFloat(dims.width),
          height: parseFloat(dims.height),
          unit: "in" as const,
        }
      : undefined;

    const baseData = {
      name: form.name.trim(),
      description: form.description.trim(),
      productType: productType as "physical" | "digital" | "service",
      price: parseFloat(form.price) || 0,
      currency: form.currency as "USD" | "BLKD",
      category: form.category,
      sku: form.sku.trim() || undefined,
      inventory: parseInt(form.stock) || 0,
      inventoryTracking: "basic" as const,
      isActive: true,
      images: form.images.length > 0 ? form.images : undefined,
      // Physical product fields
      ...(productType === "physical" && {
        weight: form.shipping.weight ? parseFloat(form.shipping.weight) : undefined,
        dimensions,
        shippingRequired: true,
        shippingMethods: [form.shipping.class],
      }),
      createdAt: new Date().toISOString(),
    };

    // Add entity-specific ID field
    if (isNonprofit) {
      return {
        ...baseData,
        nonprofitId: nonprofitId || "",
      };
    } else {
      return {
        ...baseData,
        merchantId: merchantId || "",
      };
    }
  };

  const handleSubmit = async () => {
    const entityId = isNonprofit ? nonprofitId : merchantId;
    console.log("handleSubmit called", { entityId, isNonprofit, isSubmitting, submissionState });
    
    // Final validation before submission
    if (!entityId) {
      Alert.alert(
        isNonprofit ? "Nonprofit Required" : "Business Required",
        isNonprofit 
          ? "No nonprofit selected. Please select a nonprofit first to create items."
          : "No business selected. Please select a business first to create products.",
        [{ text: "OK" }]
      );
      return;
    }

    // Prevent double submission
    if (isSubmitting || submissionState === "processing") {
      console.log("Already submitting, ignoring");
      return;
    }

    console.log("Starting submission...");
    
    // Update states to show processing immediately
    setErrorMessage(null);
    setIsSubmitting(true);
    setSubmissionState("processing");

    try {
      const productData = transformFormDataToApiFormat();
      
      logger.info(`${isEditing ? "Updating" : "Creating"} product`, productData);
      console.log("Submitting product data:", productData);

      let response;
      let useMockResponse = false;

      try {
        if (isEditing && productId) {
          // Update existing product/item
          console.log(`Updating ${isNonprofit ? "nonprofit item" : "product"}:`, productId);
          const updateEndpoint = isNonprofit 
            ? `/api/nonprofits/products/${productId}` 
            : `/api/products/${productId}`;
          response = await api.put(updateEndpoint, productData);
        } else {
          // Create new product/item
          console.log(`Creating new ${isNonprofit ? "nonprofit item" : "product"}`);
          const endpoint = isNonprofit ? "/api/nonprofits/products" : "/api/products";
          response = await api.post(endpoint, productData);
        }
      } catch (apiError: any) {
        // If API fails and we're in development, use mock response
        if (ENV.isDevelopment && (apiError.code === "NETWORK_ERROR" || apiError.message?.includes("fetch"))) {
          console.warn("API unavailable in development, using mock response");
          useMockResponse = true;
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create mock response
          response = {
            data: {
              id: `prod-${Date.now()}`,
              ...productData,
              createdAt: new Date().toISOString(),
            },
            status: 201,
            statusText: "Created",
          };
        } else {
          // Re-throw if not a network error or not in development
          throw apiError;
        }
      }
      
      logger.info("Product saved successfully", response.data);
      console.log("Product saved:", response.data, useMockResponse ? "(mock)" : "(real)");
      
      // Set the created product with the response data
      const savedProduct = response.data || {
        id: `prod-${Date.now()}`,
        ...productData,
        createdAt: new Date().toISOString(),
      };
      setCreatedProduct(savedProduct);
      setSubmissionState("success");
    } catch (error: any) {
      logger.error("Failed to save product", error);
      console.error("Product submission error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      });
      
      // Provide user-friendly error message
      let errorMsg = `We couldn't ${isEditing ? "update" : "create"} your product right now. `;
      
      if (error.code === "NETWORK_ERROR" || error.message?.includes("fetch")) {
        errorMsg += "Please check your internet connection and try again.";
      } else if (error.statusCode === 400) {
        errorMsg += "Please check that all required fields are filled correctly.";
      } else if (error.statusCode === 401) {
        errorMsg += "Please log in and try again.";
      } else if (error.statusCode === 403) {
        errorMsg += "You don't have permission to perform this action.";
      } else if (error.statusCode >= 500) {
        errorMsg += "Our servers are experiencing issues. Please try again later.";
      } else {
        errorMsg += error.message || "Please try again or contact support if the issue persists.";
      }
      
      setErrorMessage(errorMsg);
      setSubmissionState("error");
    } finally {
      setIsSubmitting(false);
      console.log("Submission complete, state:", submissionState);
    }
  };

  const handleComplete = () => {
    if (isEditing) {
      router.back();
    } else {
      router.push("/pages/merchant/products");
    }
  };

  const handleTryAgain = () => {
    setSubmissionState("idle");
    setErrorMessage(null);
    setCurrentStep(4); // Go back to review step
  };

  const handleNext = () => {
    if (currentStep === 1 && !productType) {
      Alert.alert(
        "Product Type Required",
        "Please select a product type to continue. This helps us configure the right settings for your product.",
        [{ text: "OK" }]
      );
      return;
    }
    if (currentStep === 2) {
      const missingFields: string[] = [];
      if (!form.name?.trim()) missingFields.push("Product Name");
      if (!form.price?.trim() || parseFloat(form.price) <= 0) missingFields.push("Price (must be greater than $0)");
      if (!form.category) missingFields.push("Category");
      
      if (missingFields.length > 0) {
        Alert.alert(
          "Missing Required Information",
          `Please complete the following fields:\n\n${missingFields.map(f => `• ${f}`).join("\n")}`,
          [{ text: "OK" }]
        );
        return;
      }
    }
    if (currentStep === 3) {
      // Inventory step - no required fields, can proceed
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit directly (simpler flow)
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (isSubmitting || submissionState === "processing") {
      Alert.alert(
        "Please Wait",
        "Product is being saved. Please wait for the process to complete.",
        [{ text: "OK" }]
      );
      return;
    }
    if (submissionState === "success" || submissionState === "error") {
      // If in success/error state, allow going back to review
      setSubmissionState("idle");
      setCurrentStep(4);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Render processing step
  const renderProcessingStep = () => (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], gap: spacing.xl }}>
      <ActivityIndicator size="large" color="#ba9988" />
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff" }}>
        {isEditing ? "Updating Product..." : "Publishing Product..."}
      </Text>
      <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", textAlign: "center", maxWidth: 300 }}>
        Please wait while we {isEditing ? "update" : "create"} your product. This may take a few moments.
      </Text>
    </View>
  );

  // Render success step
  const renderSuccessStep = () => (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], gap: spacing.xl }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#4caf50",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="check" size={48} color="#ffffff" />
      </View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", textAlign: "center" }}>
        {isEditing ? "Product Updated!" : "Product Published!"}
      </Text>
      <Text style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)", textAlign: "center", maxWidth: 300 }}>
        Your {isNonprofit ? "item" : "product"} has been {isEditing ? "updated" : "published"} successfully and is now available in your catalog.
      </Text>

      {/* Product Summary */}
      {createdProduct && (
        <View
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: spacing.md,
            width: "100%",
            maxWidth: 400,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            gap: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
            Product Details
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>Name</Text>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>{form.name}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>Price</Text>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
              ${parseFloat(form.price).toFixed(2)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>Category</Text>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>{form.category}</Text>
          </View>
          {createdProduct.id && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
              <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)" }}>Product ID</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#ba9988" }}>{createdProduct.id}</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={handleComplete}
        style={{
          backgroundColor: "#ba9988",
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 32,
          width: "100%",
          maxWidth: 400,
          alignItems: "center",
          marginTop: spacing.md,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
          {isEditing ? "Back to Products" : "View My Products"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render error step
  const renderErrorStep = () => (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"], gap: spacing.xl }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#f44336",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="error-outline" size={48} color="#ffffff" />
      </View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", textAlign: "center" }}>
        Something Went Wrong
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
          maxWidth: 300,
          lineHeight: 24,
        }}
      >
        {errorMessage || `We couldn't ${isEditing ? "update" : "create"} your product right now. Please try again.`}
      </Text>

      <View style={{ flexDirection: "row", gap: spacing.md, width: "100%", maxWidth: 400 }}>
        <TouchableOpacity
          onPress={handleBack}
          style={{
            flex: 1,
            backgroundColor: "#232323",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleTryAgain}
          style={{
            flex: 1,
            backgroundColor: "#ba9988",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingVertical: spacing["2xl"],
        }}
      >
        {submissionState === "idle" && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
              {isEditing 
                ? (isNonprofit ? "Edit Item" : "Edit Product")
                : (isNonprofit ? "Create New Item" : "Add New Product")}
            </Text>
            <Text style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.7)" }}>
              {isEditing
                ? "Update the product details below."
                : "Fill in the details below to add a new item to your catalog."}
            </Text>
          </View>
        )}

        {submissionState === "processing" ? (
          <View style={{ 
            backgroundColor: "#2a2a2a",
            borderRadius: 20,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.1)",
          }}>
            {renderProcessingStep()}
          </View>
        ) : submissionState === "success" ? (
          <View style={{ 
            backgroundColor: "#2a2a2a",
            borderRadius: 20,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.1)",
          }}>
            {renderSuccessStep()}
          </View>
        ) : submissionState === "error" ? (
          <View style={{ 
            backgroundColor: "#2a2a2a",
            borderRadius: 20,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.1)",
          }}>
            {renderErrorStep()}
          </View>
        ) : (
          <>
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
            <View style={{ gap: spacing.lg }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
                  Inventory & Shipping
                </Text>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Configure inventory tracking and shipping details for your {isNonprofit ? "item" : "product"}.
                </Text>
              </View>

              {/* SKU & Stock */}
              <View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 12 }}>
                  Inventory Tracking
                </Text>
                <View style={{ gap: spacing.md }}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                      SKU (Stock Keeping Unit)
                    </Text>
                    <TextInput
                      value={form.sku}
                      onChangeText={(text) => setForm({ ...form, sku: text })}
                      placeholder="e.g., PROD-001"
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
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                      Optional: Unique identifier for tracking inventory
                    </Text>
                  </View>

                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                      Current Stock
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
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                      Number of units currently in stock
                    </Text>
                  </View>
                </View>
              </View>

              {/* Shipping Information - Only for physical products */}
              {productType === "physical" && (
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 12 }}>
                    Shipping Information
                  </Text>
                  <View style={{ gap: spacing.md }}>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                        Weight
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TextInput
                          value={form.shipping.weight}
                          onChangeText={(text) => setForm({ 
                            ...form, 
                            shipping: { ...form.shipping, weight: text } 
                          })}
                          keyboardType="decimal-pad"
                          placeholder="0.0"
                          placeholderTextColor="rgba(255, 255, 255, 0.3)"
                          style={{
                            flex: 1,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            padding: 14,
                            color: "#ffffff",
                            fontSize: 14,
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        />
                        <View
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 14, color: "#ffffff" }}>lbs</Text>
                        </View>
                      </View>
                    </View>

                    <View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                        Dimensions
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        {(() => {
                          const dims = parseDimensions(form.shipping.dimensions);
                          return (
                            <>
                              <TextInput
                                value={dims.length}
                                onChangeText={(text) => {
                                  setForm({ 
                                    ...form, 
                                    shipping: { 
                                      ...form.shipping, 
                                      dimensions: formatDimensions(text, dims.width, dims.height)
                                    } 
                                  });
                                }}
                                keyboardType="decimal-pad"
                                placeholder="Length"
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                style={{
                                  flex: 1,
                                  backgroundColor: "#232323",
                                  borderRadius: 12,
                                  padding: 14,
                                  color: "#ffffff",
                                  fontSize: 14,
                                  borderWidth: 1,
                                  borderColor: "rgba(186, 153, 136, 0.2)",
                                }}
                              />
                              <TextInput
                                value={dims.width}
                                onChangeText={(text) => {
                                  setForm({ 
                                    ...form, 
                                    shipping: { 
                                      ...form.shipping, 
                                      dimensions: formatDimensions(dims.length, text, dims.height)
                                    } 
                                  });
                                }}
                                keyboardType="decimal-pad"
                                placeholder="Width"
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                style={{
                                  flex: 1,
                                  backgroundColor: "#232323",
                                  borderRadius: 12,
                                  padding: 14,
                                  color: "#ffffff",
                                  fontSize: 14,
                                  borderWidth: 1,
                                  borderColor: "rgba(186, 153, 136, 0.2)",
                                }}
                              />
                              <TextInput
                                value={dims.height}
                                onChangeText={(text) => {
                                  setForm({ 
                                    ...form, 
                                    shipping: { 
                                      ...form.shipping, 
                                      dimensions: formatDimensions(dims.length, dims.width, text)
                                    } 
                                  });
                                }}
                                keyboardType="decimal-pad"
                                placeholder="Height"
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                style={{
                                  flex: 1,
                                  backgroundColor: "#232323",
                                  borderRadius: 12,
                                  padding: 14,
                                  color: "#ffffff",
                                  fontSize: 14,
                                  borderWidth: 1,
                                  borderColor: "rgba(186, 153, 136, 0.2)",
                                }}
                              />
                            </>
                          );
                        })()}
                        <View
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 14, color: "#ffffff" }}>in</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                        Length × Width × Height
                      </Text>
                    </View>

                    <View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>
                        Shipping Class
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                        {["standard", "express", "overnight", "freight"].map((shippingClass) => (
                          <TouchableOpacity
                            key={shippingClass}
                            onPress={() => setForm({ 
                              ...form, 
                              shipping: { ...form.shipping, class: shippingClass } 
                            })}
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 10,
                              borderRadius: 12,
                              backgroundColor: form.shipping.class === shippingClass ? "#ba9988" : "#232323",
                              borderWidth: 1,
                              borderColor: form.shipping.class === shippingClass ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: form.shipping.class === shippingClass ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                                textTransform: "capitalize",
                              }}
                            >
                              {shippingClass}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Digital/Service Product Note */}
              {productType !== "physical" && (
                <View
                  style={{
                    backgroundColor: "rgba(186, 153, 136, 0.1)",
                    borderRadius: 12,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.3)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <MaterialIcons name="info" size={20} color="#ba9988" />
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                      {productType === "digital" ? "Digital Product" : "Service Product"}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", marginLeft: 28 }}>
                    {productType === "digital"
                      ? "Digital products don't require shipping information. Stock represents available download licenses."
                      : "Services don't require shipping information. Stock represents available booking slots."}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {currentStep === 4 && (
            <View style={{ gap: spacing.lg }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff", marginBottom: 8 }}>
                  Review Your {isNonprofit ? "Item" : "Product"}
                </Text>
                <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                  Please review all details before publishing. You can go back to edit any section.
                </Text>
              </View>

              {/* Product Type */}
              <View
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                    Product Type
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentStep(1)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <MaterialIcons name="edit" size={16} color="#ba9988" />
                    <Text style={{ fontSize: 12, color: "#ba9988" }}>Edit</Text>
                  </TouchableOpacity>
                </View>
                {productType && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <MaterialIcons
                      name={PRODUCT_TYPES.find(t => t.id === productType)?.icon || "shopping-bag"}
                      size={24}
                      color="#ba9988"
                    />
                    <Text style={{ fontSize: 14, color: "#ffffff" }}>
                      {PRODUCT_TYPES.find(t => t.id === productType)?.label || productType}
                    </Text>
                  </View>
                )}
              </View>

              {/* Basic Information */}
              <View
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                    Basic Information
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentStep(2)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <MaterialIcons name="edit" size={16} color="#ba9988" />
                    <Text style={{ fontSize: 12, color: "#ba9988" }}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ gap: 12 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                      {isNonprofit ? "Item Name" : "Product Name"}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ffffff" }}>
                      {form.name || "Not set"}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                      Description
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ffffff" }}>
                      {form.description || "Not set"}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                      Category
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ffffff" }}>
                      {form.category || "Not set"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Pricing & Inventory */}
              <View
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                    Pricing & Inventory
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentStep(2)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <MaterialIcons name="edit" size={16} color="#ba9988" />
                    <Text style={{ fontSize: 12, color: "#ba9988" }}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                      Price
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ffffff" }}>
                      {form.price ? `$${parseFloat(form.price).toFixed(2)}` : "Not set"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                      Stock
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ffffff" }}>
                      {form.stock || "0"} units
                    </Text>
                  </View>
                </View>
              </View>

              {/* Product Images */}
              {form.images && form.images.length > 0 && (
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                      Product Images
                    </Text>
                    <TouchableOpacity
                      onPress={() => setCurrentStep(2)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                    >
                      <MaterialIcons name="edit" size={16} color="#ba9988" />
                      <Text style={{ fontSize: 12, color: "#ba9988" }}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {form.images.map((img: string, index: number) => (
                      <View
                        key={index}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          backgroundColor: "#474747",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{ uri: img }}
                          style={{ width: 60, height: 60 }}
                          contentFit="cover"
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Inventory & Shipping Details */}
              {(form.sku || form.shipping.weight || form.shipping.dimensions || productType === "physical") && (
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>
                      Inventory & Shipping
                    </Text>
                    <TouchableOpacity
                      onPress={() => setCurrentStep(3)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                    >
                      <MaterialIcons name="edit" size={16} color="#ba9988" />
                      <Text style={{ fontSize: 12, color: "#ba9988" }}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ gap: 12 }}>
                    {form.sku && (
                      <View>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                          SKU
                        </Text>
                        <Text style={{ fontSize: 14, color: "#ffffff" }}>
                          {form.sku}
                        </Text>
                      </View>
                    )}
                    {productType === "physical" && (
                      <>
                        {form.shipping.weight && (
                          <View>
                            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                              Weight
                            </Text>
                            <Text style={{ fontSize: 14, color: "#ffffff" }}>
                              {form.shipping.weight} lbs
                            </Text>
                          </View>
                        )}
                        {form.shipping.dimensions && (
                          <View>
                            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                              Dimensions
                            </Text>
                            <Text style={{ fontSize: 14, color: "#ffffff" }}>
                              {(() => {
                                const dims = parseDimensions(form.shipping.dimensions);
                                return dims.length && dims.width && dims.height
                                  ? `${dims.length}" × ${dims.width}" × ${dims.height}"`
                                  : form.shipping.dimensions || "Not set";
                              })()}
                            </Text>
                          </View>
                        )}
                        {form.shipping.class && (
                          <View>
                            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginBottom: 4 }}>
                              Shipping Class
                            </Text>
                            <Text style={{ fontSize: 14, color: "#ffffff", textTransform: "capitalize" }}>
                              {form.shipping.class}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
              )}

              {/* Summary */}
              <View
                style={{
                  backgroundColor: "rgba(186, 153, 136, 0.1)",
                  borderRadius: 12,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.3)",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#ba9988", marginBottom: 8 }}>
                  Ready to {isEditing ? "update" : "publish"}?
                </Text>
                <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }}>
                  {isEditing
                    ? "Click 'Update Product' below to save your changes."
                    : "Click 'Publish Product' below to make this item available in your catalog."}
                </Text>
              </View>
            </View>
          )}

              {/* Navigation Buttons */}
              {submissionState === "idle" && (
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
                    onPress={() => {
                      console.log("Publish button clicked", { currentStep, isSubmitting, submissionState });
                      handleNext();
                    }}
                    disabled={isSubmitting || submissionState === "processing"}
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      borderRadius: 12,
                      backgroundColor: (isSubmitting || submissionState === "processing") ? "#666666" : "#ba9988",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                      opacity: (isSubmitting || submissionState === "processing") ? 0.6 : 1,
                    }}
                  >
                    {(isSubmitting || submissionState === "processing") && (
                      <ActivityIndicator size="small" color="#ffffff" />
                    )}
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                      {(isSubmitting || submissionState === "processing")
                        ? (isEditing ? "Updating..." : "Publishing...")
                        : currentStep === 4
                        ? (isEditing ? "Update Product" : "Publish Product")
                        : "Continue"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
