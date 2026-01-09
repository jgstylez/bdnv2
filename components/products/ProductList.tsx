/**
 * Shared Product List Component
 * 
 * Displays products for both businesses and nonprofits
 * Uses entityType prop to determine context and routing
 */

import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Product, ProductType } from '@/types/merchant';
import { ProductPlaceholder } from '@/components/ProductPlaceholder';
import { DeleteProductModal } from '@/components/products/modals/DeleteProductModal';
import { EntitySwitcher } from '@/components/EntitySwitcher';
import { useBusiness } from '@/contexts/BusinessContext';
import { useNonprofit } from '@/contexts/NonprofitContext';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface ProductListProps {
  entityType: "business" | "nonprofit";
  products?: Product[]; // Optional: if not provided, uses mock data
  onProductsChange?: (products: Product[]) => void; // Optional: callback for product updates
}

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
      return colors.accent;
  }
};

export function ProductList({ entityType, products: externalProducts, onProductsChange }: ProductListProps) {
  const router = useRouter();
  const { isMobile, paddingHorizontal } = useResponsive();
  
  // Get entity context based on type
  // Note: Both hooks are called but only one is used based on entityType
  // This is necessary to avoid conditional hook calls (React rules)
  const businessContext = useBusiness();
  const nonprofitContext = useNonprofit();
  
  const selectedEntity = entityType === "business" 
    ? businessContext.selectedBusiness 
    : nonprofitContext.selectedNonprofit;
  
  const entityId = selectedEntity?.id;

  // Mock products - in production, fetch from API
  const mockProducts: Product[] = useMemo(() => {
    if (entityType === "business") {
      return [
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
    } else {
      return [
        {
          id: "1",
          merchantId: "org1",
          name: "Community T-Shirt",
          description: "Support our cause with this limited edition t-shirt",
          productType: "physical",
          price: 25.99,
          currency: "USD",
          category: "Merchandise",
          sku: "TSH-001",
          inventory: 100,
          inventoryTracking: "manual",
          isActive: true,
          shippingRequired: true,
          shippingCost: 5.99,
          images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"],
          createdAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          merchantId: "org1",
          name: "Digital Resource Guide",
          description: "Comprehensive guide to community resources",
          productType: "digital",
          price: 9.99,
          currency: "USD",
          category: "Digital Products",
          sku: "DRG-001",
          inventory: -1,
          inventoryTracking: "none",
          downloadUrl: "https://example.com/download",
          downloadLimit: -1,
          isActive: true,
          shippingRequired: false,
          images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop"],
          createdAt: "2024-01-20T00:00:00Z",
        },
        {
          id: "3",
          merchantId: "org1",
          name: "Volunteer Training Session",
          description: "One-on-one training session for new volunteers",
          productType: "service",
          price: 0.00,
          currency: "USD",
          category: "Services",
          inventory: 20,
          inventoryTracking: "manual",
          duration: "2 hours",
          serviceLocation: "hybrid",
          bookingRequired: true,
          isActive: true,
          shippingRequired: false,
          images: ["https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=800&fit=crop"],
          createdAt: "2024-01-25T00:00:00Z",
        },
      ];
    }
  }, [entityType]);

  const [products, setProducts] = useState<Product[]>(externalProducts || mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ProductType | "all">("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Update products if external products change
  React.useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
    }
  }, [externalProducts]);

  // Filter products by selected entity and search/type filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesEntity = !entityId || product.merchantId === entityId;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || product.productType === filterType;
      return matchesEntity && matchesSearch && matchesType;
    });
  }, [products, entityId, searchQuery, filterType]);

  const handleDelete = () => {
    if (selectedProduct) {
      const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
      setProducts(updatedProducts);
      onProductsChange?.(updatedProducts);
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

  const getRouteType = () => entityType === "business" ? "merchant" : "nonprofit";
  const getIntegrationsRoute = () => 
    entityType === "business" 
      ? "/pages/merchant/products/integrations"
      : "/pages/nonprofit/products/integrations";

  return (
    <>
      {/* Entity Switcher */}
      <EntitySwitcher entityType={entityType} />

      {/* Action Buttons */}
      <View style={{ marginBottom: spacing.xl, flexDirection: "row", gap: spacing.sm, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <TouchableOpacity
          onPress={() => router.push(`/pages/products/bulk-upload?type=${getRouteType()}`)}
          style={{
            backgroundColor: colors.secondary.bg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <MaterialIcons name="upload-file" size={20} color={colors.accent} />
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}
          >
            Bulk Upload
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(getIntegrationsRoute())}
          style={{
            backgroundColor: colors.secondary.bg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <MaterialIcons name="link" size={20} color={colors.accent} />
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}
          >
            Integrations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/pages/products/create?type=${getRouteType()}`)}
          style={{
            backgroundColor: colors.accent,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          <MaterialIcons name="add" size={20} color={colors.text.primary} />
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}
          >
            Add Product
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={{ marginBottom: spacing.lg, gap: spacing.sm }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            placeholderTextColor={colors.text.placeholder}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.sm,
              fontSize: typography.fontSize.base,
              color: colors.text.primary,
            }}
          />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row", gap: spacing.xs, paddingRight: spacing.lg }}
          style={{ flexGrow: 0 }}
        >
          {(["all", "physical", "digital", "service"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.full,
                backgroundColor: filterType === type ? colors.accent : colors.accentLight,
                borderWidth: 1,
                borderColor: filterType === type ? colors.accent : colors.accentBorder,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
                flexShrink: 0,
              }}
            >
              {type !== "all" && (
                <MaterialIcons
                  name={getProductTypeIcon(type as ProductType)}
                  size={16}
                  color={filterType === type ? colors.text.primary : colors.accent}
                />
              )}
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  color: filterType === type ? colors.text.primary : colors.accent,
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
            gap: spacing.md,
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
                backgroundColor: colors.secondary.bg,
                borderRadius: borderRadius.lg,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.accentBorder,
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

              <View style={{ padding: spacing.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.sm }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text.primary,
                        }}
                      >
                        {product.name}
                      </Text>
                      <View
                        style={{
                          backgroundColor: `${getProductTypeColor(product.productType)}20`,
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.sm,
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
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
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
                        fontSize: typography.fontSize.sm,
                        color: colors.text.secondary,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {product.description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap", marginBottom: spacing.sm }}>
                      <View>
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginBottom: 2 }}>Price</Text>
                        <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.accent }}>
                          ${product.price.toFixed(2)}
                        </Text>
                      </View>
                      {product.inventoryTracking !== "none" && (
                        <View>
                          <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginBottom: 2 }}>Inventory</Text>
                          <Text
                            style={{
                              fontSize: typography.fontSize.base,
                              fontWeight: typography.fontWeight.semibold,
                              color: product.inventory > 10 ? colors.accent : colors.status.error,
                            }}
                          >
                            {product.inventory === -1 ? "∞" : product.inventory}
                          </Text>
                        </View>
                      )}
                      {product.sku && (
                        <View>
                          <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, marginBottom: 2 }}>SKU</Text>
                          <Text style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary }}>
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
                    paddingTop: spacing.sm,
                    borderTopWidth: 1,
                    borderTopColor: colors.accentBorder,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" }}>
                    <View
                      style={{
                        backgroundColor: product.isActive ? colors.accentLight : colors.secondary.bg,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 4,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          color: product.isActive ? colors.accent : colors.text.tertiary,
                          textTransform: "uppercase",
                        }}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Text>
                    </View>
                    {product.shippingRequired && (
                      <View
                        style={{
                          backgroundColor: colors.accentLight,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 4,
                          borderRadius: borderRadius.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.accent,
                            textTransform: "uppercase",
                          }}
                        >
                          Shipping
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", gap: spacing.xs }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pages/products/create?type=${getRouteType()}&id=${product.id}`)}
                      style={{
                        backgroundColor: colors.primary.bg,
                        padding: spacing.xs,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <MaterialIcons name="edit" size={20} color={colors.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => promptDelete(product)}
                      style={{
                        backgroundColor: colors.primary.bg,
                        padding: spacing.xs,
                        borderRadius: borderRadius.sm,
                      }}
                    >
                      <MaterialIcons name="delete" size={20} color={colors.status.error} />
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
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing["4xl"],
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.accentBorder,
          }}
        >
          <MaterialIcons name="inventory" size={48} color={colors.text.tertiary} />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              marginTop: spacing.md,
            }}
          >
            {searchQuery ? "No products found" : "No products yet. Add your first product to get started!"}
          </Text>
        </View>
      )}

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
    </>
  );
}
