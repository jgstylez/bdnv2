import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Product, ProductType } from '@/types/merchant';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { DeleteProductModal } from '@/components/products/modals/DeleteProductModal';

// Mock products (Initial State)
const initialProducts: Product[] = [
  {
    id: "1",
    merchantId: "merchant1",
    name: "Soul Food Platter",
    description: "Fried chicken, mac & cheese, collard greens, cornbread",
    productType: "physical",
    price: 24.99,
    currency: "USD",
    category: "Food",
    sku: "SFP-001",
    inventory: 50,
    inventoryTracking: "manual",
    isActive: true,
    shippingRequired: false,
    images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"],
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    merchantId: "merchant1",
    name: "BBQ Ribs",
    description: "Slow-cooked ribs with signature sauce",
    productType: "physical",
    price: 32.99,
    currency: "USD",
    category: "Food",
    sku: "BBQ-002",
    inventory: 30,
    inventoryTracking: "manual",
    isActive: true,
    shippingRequired: false,
    images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=800&fit=crop"],
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "3",
    merchantId: "merchant1",
    name: "Digital Recipe Book",
    description: "Complete collection of soul food recipes",
    productType: "digital",
    price: 19.99,
    currency: "USD",
    category: "Digital Products",
    sku: "DRB-001",
    inventory: -1,
    inventoryTracking: "none",
    downloadUrl: "https://example.com/download",
    downloadLimit: -1,
    isActive: true,
    shippingRequired: false,
    images: ["https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=800&fit=crop"],
    createdAt: "2024-01-25T00:00:00Z",
  },
  {
    id: "4",
    merchantId: "merchant1",
    name: "Catering Service",
    description: "Full-service catering for events",
    productType: "service",
    price: 500.00,
    currency: "USD",
    category: "Services",
    inventory: 10,
    inventoryTracking: "manual",
    duration: "4 hours",
    serviceLocation: "on-site",
    bookingRequired: true,
    isActive: true,
    shippingRequired: false,
    images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=800&fit=crop"],
    createdAt: "2024-01-28T00:00:00Z",
  },
];

const getProductTypeIcon = (type: ProductType) => {
  switch (type) {
    case "physical":
      return "inventory";
    case "digital":
      return "cloud-download";
    case "service":
      return "build";
    default:
      return "category";
  }
};

const getProductTypeColor = (type: ProductType) => {
  switch (type) {
    case "physical":
      return "#4caf50";
    case "digital":
      return "#2196f3";
    case "service":
      return "#ff9800";
    default:
      return "#ba9988";
  }
};

export default function Products() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ProductType | "all">("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || product.productType === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      // In a real app, you would also make an API call to delete the product
      Alert.alert("Success", "Product deleted successfully");
    }
  };

  const promptDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Action Buttons */}
        <View style={{ marginBottom: 32, flexDirection: "row", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/products/bulk-upload?type=merchant")}
            style={{
              backgroundColor: "#474747",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="upload-file" size={20} color="#ba9988" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Bulk Upload
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/pages/merchant/products/integrations")}
            style={{
              backgroundColor: "#474747",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="link" size={20} color="#ba9988" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Integrations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/pages/products/create?type=merchant")}
            style={{
              backgroundColor: "#ba9988",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="add" size={20} color="#ffffff" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Add Product
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={{ marginBottom: 24, gap: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#474747",
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search products..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                color: "#ffffff",
              }}
            />
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "row", gap: 8, paddingRight: 20 }}
            style={{ flexGrow: 0 }}
          >
            {(["all", "physical", "digital", "service"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilterType(type)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: filterType === type ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                  borderWidth: 1,
                  borderColor: filterType === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {type !== "all" && (
                  <MaterialIcons
                    name={getProductTypeIcon(type as ProductType)}
                    size={16}
                    color={filterType === type ? "#ffffff" : "#ba9988"}
                  />
                )}
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: filterType === type ? "#ffffff" : "#ba9988",
                    textTransform: "capitalize",
                  }}
                >
                  {type === "all" ? "All Types" : type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products List - 3 Column Grid */}
        {filteredProducts.length > 0 ? (
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {filteredProducts.map((product) => (
              <View
                key={product.id}
                style={{
                  width: isMobile ? "100%" : "32%",
                  flexBasis: isMobile ? undefined : "32%",
                  maxWidth: isMobile ? undefined : "32%",
                  minWidth: isMobile ? undefined : 300,
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                {/* Product Image */}
                {product.images && product.images.length > 0 && product.images[0] ? (
                  <Image
                    source={{ uri: product.images[0] }}
                    style={{ width: "100%", height: isMobile ? 200 : 200 }}
                    contentFit="cover"
cachePolicy="memory-disk"
                    onError={() => { }}
                  />
                ) : (
                  <ProductPlaceholder width="100%" height={isMobile ? 200 : 200} aspectRatio={16 / 9} />
                )}

                <View style={{ padding: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          {product.name}
                        </Text>
                        <View
                          style={{
                            backgroundColor: `${getProductTypeColor(product.productType)}20`,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <MaterialIcons
                            name={getProductTypeIcon(product.productType)}
                            size={12}
                            color={getProductTypeColor(product.productType)}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "600",
                              color: getProductTypeColor(product.productType),
                              textTransform: "uppercase",
                            }}
                          >
                            {product.productType}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: 12,
                        }}
                      >
                        {product.description}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                        <View>
                          <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>Price</Text>
                          <Text style={{ fontSize: 16, fontWeight: "600", color: "#ba9988" }}>
                            ${product.price.toFixed(2)}
                          </Text>
                        </View>
                        {product.inventoryTracking !== "none" && (
                          <View>
                            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>Inventory</Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: product.inventory > 10 ? "#ba9988" : "#ff4444",
                              }}
                            >
                              {product.inventory === -1 ? "∞" : product.inventory}
                            </Text>
                          </View>
                        )}
                        {product.sku && (
                          <View>
                            <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)", marginBottom: 4 }}>SKU</Text>
                            <Text style={{ fontSize: 14, fontWeight: "600", color: "rgba(255, 255, 255, 0.7)" }}>
                              {product.sku}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  >
                    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                      <View
                        style={{
                          backgroundColor: product.isActive ? "rgba(186, 153, 136, 0.2)" : "rgba(255, 255, 255, 0.1)",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "600",
                            color: product.isActive ? "#ba9988" : "rgba(255, 255, 255, 0.6)",
                            textTransform: "uppercase",
                          }}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Text>
                      </View>
                      {product.shippingRequired && (
                        <View
                          style={{
                            backgroundColor: "rgba(186, 153, 136, 0.2)",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "600",
                              color: "#ba9988",
                              textTransform: "uppercase",
                            }}
                          >
                            Shipping
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => router.push(`/pages/products/create?type=merchant&id=${product.id}`)}
                        style={{
                          backgroundColor: "#232323",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        <MaterialIcons name="edit" size={20} color="#ba9988" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => promptDelete(product)}
                        style={{
                          backgroundColor: "#232323",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        <MaterialIcons name="delete" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="inventory" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              {searchQuery ? "No products found" : "No products yet. Add your first product to get started!"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Delete Product Modal */}
      <DeleteProductModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
        productName={selectedProduct?.name || "this product"}
      />
    </View>
  );
}
