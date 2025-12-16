import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, usePathname, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ProductType, InventoryTracking, ProductVariantOption, ProductVariant } from "../../../types/merchant";
import { useResponsive } from "../../../hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "../../../constants/theme";
import { BackButton } from "../../../components/navigation/BackButton";
import VariantManager from "../../../components/products/VariantManager";
import { platformValues, isAndroid } from "../../../utils/platform";

/**
 * Shared Product Creation Component
 * Used by both merchant and nonprofit product creation flows
 */
export default function CreateProduct() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ type?: "merchant" | "nonprofit" }>();
  const { isMobile, paddingHorizontal } = useResponsive();
  
  // Determine user type from route params or pathname
  const userType = params.type || (pathname?.includes("nonprofit") ? "nonprofit" : "merchant");
  const productsPath = userType === "nonprofit" ? "/pages/nonprofit/products" : "/pages/merchant/products";
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState<ProductType | "">("");
  const [useVariants, setUseVariants] = useState(false);
  const [variantOptions, setVariantOptions] = useState<ProductVariantOption[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD" as "USD" | "BLKD",
    category: "",
    sku: "",
    barcode: "",
    inventory: "",
    inventoryTracking: "manual" as InventoryTracking,
    lowStockThreshold: "",
    isActive: true,
    // Physical
    weight: "",
    length: "",
    width: "",
    height: "",
    dimensionUnit: "in" as "in" | "cm",
    shippingRequired: false,
    shippingCost: "",
    returnPolicy: "",
    // Digital
    downloadUrl: "",
    downloadLimit: "",
    expirationDate: "",
    // Service
    duration: "",
    serviceLocation: "in-store" as "in-store" | "remote" | "on-site" | "hybrid",
    bookingRequired: false,
    // Common
    tags: "",
    taxCategory: "",
  });

  const categories = [
    "Food & Beverage",
    "Clothing & Apparel",
    "Electronics",
    "Home & Garden",
    "Beauty & Personal Care",
    "Health & Fitness",
    "Books & Media",
    "Toys & Games",
    "Automotive",
    "Services",
    "Digital Products",
    "Other",
  ];

  const handleNext = () => {
    if (step === 1 && (!formData.name || !productType || !formData.category)) {
      alert("Please fill in product name, select product type, and choose a category");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push(productsPath);
    }
  };

  const [isCreating, setIsCreating] = useState(false);

  const handleConfirmAndCreate = async () => {
    setIsCreating(true);
    try {
    // TODO: Submit to API with userType context
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // On success, go to step 5 (success screen)
      setStep(5);
    } catch (error) {
      alert("Failed to create product. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDone = () => {
    router.push(productsPath);
  };

  const renderStep1 = () => (
    <View style={{ gap: 20 }}>
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Product Type
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(["physical", "digital", "service"] as ProductType[]).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setProductType(type)}
              style={{
                flex: 1,
                minWidth: 100,
                backgroundColor: productType === type ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                borderRadius: 12,
                padding: 20,
                alignItems: "center",
                borderWidth: 2,
                borderColor: productType === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
              }}
            >
              <MaterialIcons
                name={type === "physical" ? "inventory" : type === "digital" ? "cloud-download" : "build"}
                size={32}
                color={productType === type ? "#ffffff" : "#ba9988"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: productType === type ? "#ffffff" : "#ba9988",
                  marginTop: 8,
                  textTransform: "capitalize",
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Product Name <Text style={{ color: "#ff4444" }}>*</Text>
        </Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter product name"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
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

      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Description
        </Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Describe your product..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          multiline
          onContentSizeChange={(event) => {
            const { height } = event.nativeEvent.contentSize;
            setDescriptionHeight(Math.max(0, height + 32)); // 32 for padding (16 top + 16 bottom)
          }}
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            color: "#ffffff",
            fontSize: 14,
            height: Math.max(descriptionHeight, 50), // Minimum visible height when empty
            minHeight: 0,
            maxHeight: 300,
            textAlignVertical: "top",
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        />
      </View>

      <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Price <Text style={{ color: "#ff4444" }}>*</Text>
          </Text>
          <TextInput
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            keyboardType="decimal-pad"
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

      <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
          Category <Text style={{ color: "#ff4444" }}>*</Text>
          </Text>
              <TouchableOpacity
          onPress={() => setCategoryDropdownOpen(true)}
                style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: formData.category ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 68, 68, 0.5)",
            flexDirection: "row",
            justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
              color: formData.category ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                  }}
                >
            {formData.category || "Select category"}
                </Text>
          <MaterialIcons
            name={categoryDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color="rgba(255, 255, 255, 0.6)"
          />
              </TouchableOpacity>

        <Modal
          visible={categoryDropdownOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setCategoryDropdownOpen(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setCategoryDropdownOpen(false)}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                width: "90%",
                maxWidth: 400,
                maxHeight: "80%",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(186, 153, 136, 0.2)",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
        <Text
          style={{
                    fontSize: 18,
                    fontWeight: "700",
            color: "#ffffff",
          }}
        >
                  Select Category
        </Text>
                <TouchableOpacity
                  onPress={() => setCategoryDropdownOpen(false)}
                  style={{ padding: 4 }}
                >
                  <MaterialIcons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ maxHeight: 400 }}
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={16}
                nestedScrollEnabled={isAndroid}
              >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
                    onPress={() => {
                      setFormData({ ...formData, category: cat });
                      setCategoryDropdownOpen(false);
                    }}
                    activeOpacity={platformValues.touchOpacity}
                    hitSlop={platformValues.hitSlop}
              style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      backgroundColor: formData.category === cat ? "rgba(186, 153, 136, 0.2)" : "transparent",
              }}
            >
              <Text
                style={{
                        fontSize: 14,
                        fontWeight: formData.category === cat ? "600" : "400",
                        color: formData.category === cat ? "#ba9988" : "#ffffff",
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={{ gap: 20 }}>
      {/* Inventory - Only for physical products */}
      {productType === "physical" && (
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Inventory Management
        </Text>
        <View style={{ gap: 12 }}>
              {/* Variant Toggle (only for physical products) */}
              {productType === "physical" && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setUseVariants(!useVariants);
                      if (useVariants) {
                        // Clear variants when disabling
                        setVariantOptions([]);
                        setVariants([]);
                      }
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      backgroundColor: useVariants ? "#ba9988" : "transparent",
                      borderWidth: 2,
                      borderColor: "#ba9988",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {useVariants && <MaterialIcons name="check" size={16} color="#ffffff" />}
                  </TouchableOpacity>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>
                    Use variants (Size, Color, etc.)
                  </Text>
                </View>
              )}

              {/* Variant Manager */}
              {useVariants && productType === "physical" ? (
                <VariantManager
                  variantOptions={variantOptions}
                  variants={variants}
                  onVariantOptionsChange={setVariantOptions}
                  onVariantsChange={setVariants}
                />
              ) : (
            <>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Stock Quantity
                  </Text>
                  <TextInput
                    value={formData.inventory}
                    onChangeText={(text) => setFormData({ ...formData, inventory: text })}
                    placeholder="0"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    keyboardType="numeric"
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
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Low Stock Alert
                  </Text>
                  <TextInput
                    value={formData.lowStockThreshold}
                    onChangeText={(text) => setFormData({ ...formData, lowStockThreshold: text })}
                    placeholder="10"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    keyboardType="numeric"
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
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    SKU
                  </Text>
                  <TextInput
                    value={formData.sku}
                    onChangeText={(text) => setFormData({ ...formData, sku: text })}
                    placeholder="SKU-001"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Barcode
                  </Text>
                  <TextInput
                    value={formData.barcode}
                    onChangeText={(text) => setFormData({ ...formData, barcode: text })}
                    placeholder="1234567890"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
              </View>
            </>
          )}
        </View>
      </View>
      )}

      {/* Product Type Specific Fields */}
      {productType === "physical" && (
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Physical Product Details
          </Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Weight (lbs)
              </Text>
              <TextInput
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                placeholder="0.0"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="decimal-pad"
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
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Dimensions
              </Text>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <TextInput
                  value={formData.length}
                  onChangeText={(text) => setFormData({ ...formData, length: text })}
                  placeholder="L"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
                <Text style={{ color: "rgba(255, 255, 255, 0.5)" }}>×</Text>
                <TextInput
                  value={formData.width}
                  onChangeText={(text) => setFormData({ ...formData, width: text })}
                  placeholder="W"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
                <Text style={{ color: "rgba(255, 255, 255, 0.5)" }}>×</Text>
                <TextInput
                  value={formData.height}
                  onChangeText={(text) => setFormData({ ...formData, height: text })}
                  placeholder="H"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {(["in", "cm"] as const).map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setFormData({ ...formData, dimensionUnit: unit })}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 8,
                        backgroundColor: formData.dimensionUnit === unit ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: formData.dimensionUnit === unit ? "#ffffff" : "#ba9988",
                        }}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, shippingRequired: !formData.shippingRequired })}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: formData.shippingRequired ? "#ba9988" : "transparent",
                  borderWidth: 2,
                  borderColor: "#ba9988",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formData.shippingRequired && <MaterialIcons name="check" size={16} color="#ffffff" />}
              </TouchableOpacity>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Requires shipping</Text>
            </View>
            {formData.shippingRequired && (
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Shipping Cost
                </Text>
                <TextInput
                  value={formData.shippingCost}
                  onChangeText={(text) => setFormData({ ...formData, shippingCost: text })}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="decimal-pad"
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
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Return Policy
              </Text>
              <TextInput
                value={formData.returnPolicy}
                onChangeText={(text) => setFormData({ ...formData, returnPolicy: text })}
                placeholder="30-day return policy..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 16,
                  color: "#ffffff",
                  fontSize: 14,
                  minHeight: 80,
                  textAlignVertical: "top",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>
          </View>
        </View>
      )}

      {productType === "digital" && (
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Digital Product Details
          </Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Download URL
              </Text>
              <TextInput
                value={formData.downloadUrl}
                onChangeText={(text) => setFormData({ ...formData, downloadUrl: text })}
                placeholder="https://example.com/download"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="url"
                autoCapitalize="none"
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
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Download Limit (-1 for unlimited)
              </Text>
              <TextInput
                value={formData.downloadLimit}
                onChangeText={(text) => setFormData({ ...formData, downloadLimit: text })}
                placeholder="-1"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="numeric"
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
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Expiration Date (optional)
              </Text>
              <TextInput
                value={formData.expirationDate}
                onChangeText={(text) => setFormData({ ...formData, expirationDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
          </View>
        </View>
      )}

      {productType === "service" && (
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Service Details
          </Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Duration
              </Text>
              <TextInput
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
                placeholder="1 hour, 30 minutes, etc."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                Service Location
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {(["in-store", "remote", "on-site", "hybrid"] as const).map((location) => (
                  <TouchableOpacity
                    key={location}
                    onPress={() => setFormData({ ...formData, serviceLocation: location })}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      backgroundColor: formData.serviceLocation === location ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                      borderWidth: 1,
                      borderColor: formData.serviceLocation === location ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: formData.serviceLocation === location ? "#ffffff" : "#ba9988",
                        textTransform: "capitalize",
                      }}
                    >
                      {location.replace("-", " ")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, bookingRequired: !formData.bookingRequired })}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: formData.bookingRequired ? "#ba9988" : "transparent",
                  borderWidth: 2,
                  borderColor: "#ba9988",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formData.bookingRequired && <MaterialIcons name="check" size={16} color="#ffffff" />}
              </TouchableOpacity>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Booking required</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={{ gap: 20 }}>
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Additional Information
        </Text>
        <View style={{ gap: 12 }}>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Tags (comma-separated)
            </Text>
            <TextInput
              value={formData.tags}
              onChangeText={(text) => setFormData({ ...formData, tags: text })}
              placeholder="tag1, tag2, tag3"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Tax Category
            </Text>
            <TextInput
              value={formData.taxCategory}
              onChangeText={(text) => setFormData({ ...formData, taxCategory: text })}
              placeholder="Standard, Reduced, Exempt"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                backgroundColor: formData.isActive ? "#ba9988" : "transparent",
                borderWidth: 2,
                borderColor: "#ba9988",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {formData.isActive && <MaterialIcons name="check" size={16} color="#ffffff" />}
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Product is active</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(186, 153, 136, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <MaterialIcons name="check-circle" size={48} color="#ba9988" />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Review Your Product
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          Please review all the details before creating your product
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        {/* Basic Info */}
        <View
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#ba9988",
              marginBottom: 12,
            }}
          >
            Basic Information
          </Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Name:</Text>
              <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.name || "—"}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Type:</Text>
              <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600", textTransform: "capitalize" }}>
                {productType || "—"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Category:</Text>
              <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.category || "—"}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Price:</Text>
              <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>
                {formData.price ? `${formData.currency} ${formData.price}` : "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {formData.description && (
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ba9988",
                marginBottom: 8,
              }}
            >
              Description
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", lineHeight: 20 }}>
              {formData.description}
            </Text>
          </View>
        )}

        {/* Inventory (Physical only) */}
        {productType === "physical" && (
          <View
            style={{
              backgroundColor: "#232323",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ba9988",
                marginBottom: 12,
              }}
            >
              Inventory
            </Text>
            <View style={{ gap: 8 }}>
              {formData.inventory && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Stock Quantity:</Text>
                  <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.inventory}</Text>
                </View>
              )}
              {formData.lowStockThreshold && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Low Stock Alert:</Text>
                  <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.lowStockThreshold}</Text>
                </View>
              )}
              {formData.sku && (
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>SKU:</Text>
                  <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.sku}</Text>
                </View>
              )}
              {useVariants && variants.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", marginBottom: 8 }}>
                    Variants ({variants.length}):
                  </Text>
                  {variants.slice(0, 3).map((variant) => (
                    <Text key={variant.id} style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginLeft: 8 }}>
                      • {variant.name}
                    </Text>
                  ))}
                  {variants.length > 3 && (
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginLeft: 8 }}>
                      • +{variants.length - 3} more
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Status */}
        <View
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <MaterialIcons
              name={formData.isActive ? "check-circle" : "cancel"}
              size={20}
              color={formData.isActive ? "#ba9988" : "rgba(255, 255, 255, 0.5)"}
            />
            <Text style={{ fontSize: 14, color: formData.isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)" }}>
              Product will be {formData.isActive ? "active" : "inactive"} after creation
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={isAndroid}
        bounces={platformValues.scrollViewBounces}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: platformValues.scrollViewPaddingTop,
          paddingBottom: spacing["4xl"],
        }}
      >
        {/* Success Screen (Step 5) */}
        {step === 5 ? (
          <View style={{ alignItems: "center", justifyContent: "center", minHeight: 500 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#4CAF50",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <MaterialIcons name="check" size={60} color="#ffffff" />
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Product Created Successfully!
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              Your product has been created and is now live
            </Text>

            {/* Product Summary */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                width: "100%",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
                marginBottom: 32,
              }}
            >
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Product Name</Text>
                  <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.name}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Type</Text>
                  <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600", textTransform: "capitalize" }}>
                    {productType}
                  </Text>
                </View>
                {formData.price && (
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Price</Text>
                    <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>
                      {formData.currency} {formData.price}
                    </Text>
                  </View>
                )}
                {productType === "physical" && formData.inventory && (
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Stock Quantity</Text>
                    <Text style={{ fontSize: 14, color: "#ffffff", fontWeight: "600" }}>{formData.inventory}</Text>
                  </View>
                )}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)" }}>Status</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <MaterialIcons
                      name={formData.isActive ? "check-circle" : "cancel"}
                      size={16}
                      color={formData.isActive ? "#4CAF50" : "rgba(255, 255, 255, 0.5)"}
                    />
                    <Text style={{ fontSize: 14, color: formData.isActive ? "#4CAF50" : "rgba(255, 255, 255, 0.5)", fontWeight: "600" }}>
                      {formData.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              onPress={handleDone}
              style={{
                width: "100%",
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: "#ba9988",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
        {/* Back Button */}
        <BackButton 
          label={step === 1 ? "Cancel" : "Back"} 
          onPress={handleBack}
          marginBottom={16}
        />

        {/* Progress Steps */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                {[1, 2, 3, 4].map((s) => (
              <View key={s} style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: step >= s ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: step >= s ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {s}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: step >= s ? "#ba9988" : "rgba(255, 255, 255, 0.5)",
                  }}
                >
                      {s === 1 ? "Basic Info" : s === 2 ? "Details" : s === 3 ? "Additional" : "Confirm"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form Content */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
        </View>

        {/* Navigation Buttons */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
          <TouchableOpacity
            onPress={handleBack}
                disabled={isCreating}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: "#232323",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
                  opacity: isCreating ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
                onPress={step === 4 ? handleConfirmAndCreate : handleNext}
                disabled={isCreating}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: "#ba9988",
              alignItems: "center",
                  opacity: isCreating ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
                  {isCreating ? "Creating..." : step === 4 ? "Create Product" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

