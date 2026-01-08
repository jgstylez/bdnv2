/**
 * Cart Context
 * 
 * Global cart state management for shopping cart functionality
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Product, ProductVariant } from "../types/merchant";
import { Currency } from "../types/international";
import { getMerchantName } from "../lib/merchant-lookup";
import { logError } from "../lib/logger";

// AsyncStorage import with fallback for web
let AsyncStorage: any;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch {
  // Fallback for web or if AsyncStorage is not installed
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
}

export interface CartItem extends Product {
  quantity: number;
  addedAt: string;
  selectedVariantId?: string; // ID of the selected variant, if any
  selectedVariant?: ProductVariant; // Full variant object for reference
}

export interface BusinessOrder {
  merchantId: string;
  merchantName?: string;
  items: CartItem[];
  subtotal: number;
  shippingTotal: number;
  total: number;
  currency: Currency;
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[]; // Items saved for later
  itemCount: number;
  businessOrders: BusinessOrder[]; // Items grouped by business
  addToCart: (product: Product, quantity?: number, variantId?: string) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearBusinessCart: (merchantId: string) => Promise<void>; // Clear items from a specific business
  saveForLater: (productId: string, variantId?: string) => Promise<void>; // Move item from cart to saved
  moveToCart: (productId: string, variantId?: string) => Promise<void>; // Move item from saved to cart
  removeFromSaved: (productId: string, variantId?: string) => Promise<void>; // Remove from saved items
  getSubtotal: (currency?: Currency) => number;
  getShippingTotal: (currency?: Currency) => number;
  getTotal: (currency?: Currency) => number;
  getBusinessSubtotal: (merchantId: string, currency?: Currency) => number;
  getBusinessShippingTotal: (merchantId: string, currency?: Currency) => number;
  getBusinessTotal: (merchantId: string, currency?: Currency) => number;
  isInCart: (productId: string, variantId?: string) => boolean;
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
  getBusinessOrder: (merchantId: string) => BusinessOrder | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "@bdn_cart";
const SAVED_ITEMS_STORAGE_KEY = "@bdn_saved_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and saved items from storage on mount
  useEffect(() => {
    loadCart();
    loadSavedItems();
  }, []);

  // Save cart to storage whenever items change
  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isLoaded]);

  // Save saved items to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSavedItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedItems, isLoaded]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setItems(parsedCart);
      }
    } catch (error) {
      logError("Error loading cart from storage", error, { storageKey: CART_STORAGE_KEY });
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      logError("Error saving cart to storage", error, { storageKey: CART_STORAGE_KEY, itemCount: items.length });
    }
  };

  const loadSavedItems = async () => {
    try {
      const savedData = await AsyncStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
      if (savedData) {
        const parsedSaved = JSON.parse(savedData);
        setSavedItems(parsedSaved);
      }
    } catch (error) {
      logError("Error loading saved items from storage", error, { storageKey: SAVED_ITEMS_STORAGE_KEY });
    }
  };

  const saveSavedItems = async () => {
    try {
      await AsyncStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (error) {
      logError("Error saving saved items to storage", error, { storageKey: SAVED_ITEMS_STORAGE_KEY, itemCount: savedItems.length });
    }
  };

  const addToCart = useCallback(async (product: Product, quantity: number = 1, variantId?: string) => {
    setItems((currentItems) => {
      // Find existing item with same product ID and variant ID
      const existingItem = currentItems.find(
        (item) => item.id === product.id && item.selectedVariantId === variantId
      );

      // Get variant if provided
      const variant = variantId ? product.variants?.find((v) => v.id === variantId) : undefined;
      const inventory = variant ? variant.inventory : product.inventory;
      const price = variant?.price ?? product.price;

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        
        // Check inventory limits for physical products
        if (product.productType === "physical" && inventory > 0) {
          const maxQuantity = Math.min(newQuantity, inventory);
          if (maxQuantity <= existingItem.quantity) {
            // Already at max, don't update
            return currentItems;
          }
          return currentItems.map((item) =>
            item.id === product.id && item.selectedVariantId === variantId
              ? { ...item, quantity: maxQuantity, price }
              : item
          );
        }

        return currentItems.map((item) =>
          item.id === product.id && item.selectedVariantId === variantId
            ? { ...item, quantity: newQuantity, price }
            : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          ...product,
          price, // Use variant price if available
          quantity,
          selectedVariantId: variantId,
          selectedVariant: variant,
          addedAt: new Date().toISOString(),
        };
        return [...currentItems, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback(async (productId: string, variantId?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === productId && item.selectedVariantId === variantId)
      )
    );
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variantId);
      return;
    }

    setItems((currentItems) => {
      const item = currentItems.find(
        (i) => i.id === productId && i.selectedVariantId === variantId
      );
      if (!item) return currentItems;

      // Get inventory from variant if available, otherwise use product inventory
      const inventory = item.selectedVariant?.inventory ?? item.inventory;

      // Check inventory limits for physical products
      if (item.productType === "physical" && inventory > 0) {
        const maxQuantity = Math.min(quantity, inventory);
        return currentItems.map((i) =>
          i.id === productId && i.selectedVariantId === variantId
            ? { ...i, quantity: maxQuantity }
            : i
        );
      }

      return currentItems.map((i) =>
        i.id === productId && i.selectedVariantId === variantId ? { ...i, quantity } : i
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    setItems([]);
  }, []);

  const clearBusinessCart = useCallback(async (merchantId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.merchantId !== merchantId));
  }, []);

  const saveForLater = useCallback(async (productId: string, variantId?: string) => {
    setItems((currentItems) => {
      const itemToSave = currentItems.find(
        (item) => item.id === productId && item.selectedVariantId === variantId
      );
      
      if (!itemToSave) return currentItems;

      // Add to saved items
      setSavedItems((currentSaved) => {
        // Check if already saved
        const alreadySaved = currentSaved.some(
          (item) => item.id === productId && item.selectedVariantId === variantId
        );
        if (alreadySaved) return currentSaved;
        
        return [...currentSaved, { ...itemToSave }];
      });

      // Remove from cart
      return currentItems.filter(
        (item) => !(item.id === productId && item.selectedVariantId === variantId)
      );
    });
  }, []);

  const moveToCart = useCallback(async (productId: string, variantId?: string) => {
    setSavedItems((currentSaved) => {
      const itemToMove = currentSaved.find(
        (item) => item.id === productId && item.selectedVariantId === variantId
      );
      
      if (!itemToMove) return currentSaved;

      // Add to cart
      setItems((currentItems) => {
        // Check if already in cart
        const alreadyInCart = currentItems.some(
          (item) => item.id === productId && item.selectedVariantId === variantId
        );
        if (alreadyInCart) return currentItems;
        
        return [...currentItems, { ...itemToMove }];
      });

      // Remove from saved
      return currentSaved.filter(
        (item) => !(item.id === productId && item.selectedVariantId === variantId)
      );
    });
  }, []);

  const removeFromSaved = useCallback(async (productId: string, variantId?: string) => {
    setSavedItems((currentSaved) =>
      currentSaved.filter(
        (item) => !(item.id === productId && item.selectedVariantId === variantId)
      )
    );
  }, []);

  const getSubtotal = useCallback((currency?: Currency) => {
    return items
      .filter((item) => !currency || item.currency === currency)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getShippingTotal = useCallback((currency?: Currency) => {
    return items
      .filter((item) => (!currency || item.currency === currency) && item.shippingRequired && item.shippingCost)
      .reduce((sum, item) => sum + (item.shippingCost || 0), 0);
  }, [items]);

  const getTotal = useCallback((currency?: Currency) => {
    return getSubtotal(currency) + getShippingTotal(currency);
  }, [getSubtotal, getShippingTotal]);

  const getBusinessSubtotal = useCallback((merchantId: string, currency?: Currency) => {
    return items
      .filter((item) => item.merchantId === merchantId && (!currency || item.currency === currency))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getBusinessShippingTotal = useCallback((merchantId: string, currency?: Currency) => {
    return items
      .filter((item) => item.merchantId === merchantId && (!currency || item.currency === currency) && item.shippingRequired && item.shippingCost)
      .reduce((sum, item) => sum + (item.shippingCost || 0), 0);
  }, [items]);

  const getBusinessTotal = useCallback((merchantId: string, currency?: Currency) => {
    return getBusinessSubtotal(merchantId, currency) + getBusinessShippingTotal(merchantId, currency);
  }, [getBusinessSubtotal, getBusinessShippingTotal]);

  const isInCart = useCallback((productId: string, variantId?: string) => {
    return items.some(
      (item) => item.id === productId && item.selectedVariantId === variantId
    );
  }, [items]);

  const getCartItem = useCallback((productId: string, variantId?: string) => {
    return items.find(
      (item) => item.id === productId && item.selectedVariantId === variantId
    );
  }, [items]);

  const getBusinessOrder = useCallback((merchantId: string): BusinessOrder | undefined => {
    const businessItems = items.filter((item) => item.merchantId === merchantId);
    if (businessItems.length === 0) return undefined;

    const currency = businessItems[0].currency;
    const subtotal = getBusinessSubtotal(merchantId, currency);
    const shippingTotal = getBusinessShippingTotal(merchantId, currency);
    const total = subtotal + shippingTotal;

    return {
      merchantId,
      merchantName: getMerchantName(merchantId),
      items: businessItems,
      subtotal,
      shippingTotal,
      total,
      currency,
    };
  }, [items, getBusinessSubtotal, getBusinessShippingTotal]);

  // Group items by business
  const businessOrdersMemo = useMemo((): BusinessOrder[] => {
    const merchantMap = new Map<string, CartItem[]>();
    
    items.forEach((item) => {
      const existing = merchantMap.get(item.merchantId) || [];
      merchantMap.set(item.merchantId, [...existing, item]);
    });

    return Array.from(merchantMap.entries()).map(([merchantId, businessItems]) => {
      const currency = businessItems[0].currency;
      
      // Calculate totals directly for better performance (avoid calling memoized callbacks)
      const subtotal = businessItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingTotal = businessItems
        .filter((item) => item.shippingRequired && item.shippingCost)
        .reduce((sum, item) => sum + (item.shippingCost || 0), 0);
      const total = subtotal + shippingTotal;

      return {
        merchantId,
        merchantName: getMerchantName(merchantId),
        items: businessItems,
        subtotal,
        shippingTotal,
        total,
        currency,
      };
    });
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    savedItems,
    itemCount,
    businessOrders: businessOrdersMemo,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearBusinessCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    getSubtotal,
    getShippingTotal,
    getTotal,
    getBusinessSubtotal,
    getBusinessShippingTotal,
    getBusinessTotal,
    isInCart,
    getCartItem,
    getBusinessOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

