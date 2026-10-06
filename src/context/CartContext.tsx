"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem, Discount } from "@/lib/types";
import { calculateCartTotals } from "@/lib/pricing";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedDiscount: Discount | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  totalItems: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "crystal_clean_cart_v1";
const COUPON_STORAGE_KEY = "crystal_clean_coupon_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }

      if (savedCoupon) {
        const parsedCoupon = JSON.parse(savedCoupon);
        setAppliedDiscount(parsedCoupon);
      }
    } catch (e) {
      console.error("Failed to restore cart from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [items, isLoaded]);

  // Sync coupon to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedDiscount) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedDiscount));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save coupon to localStorage:", e);
    }
  }, [appliedDiscount, isLoaded]);

  const addItem = (product: Product, quantity: number = product.min_order_qty || 100) => {
    const qtyToAdd = Math.max(product.min_order_qty || 1, quantity);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + qtyToAdd;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            quantity: qtyToAdd,
            unitPrice: product.price,
            lineTotal: product.price * qtyToAdd,
          },
        ];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedDiscount(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing cart storage:", e);
    }
  };

  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a valid coupon code." };
    }

    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (data.success && data.discount) {
        setAppliedDiscount(data.discount);
        return {
          success: true,
          message: `Coupon "${cleanCode}" applied successfully!`,
        };
      } else {
        return {
          success: false,
          message: data.message || "Invalid or expired coupon code.",
        };
      }
    } catch {
      // Fallback check against known codes
      if (cleanCode === "BULK10") {
        const fallbackDiscount: Discount = {
          id: "d1",
          name: "Bulk Purchase (10% Off)",
          type: "percent",
          value: 10,
          applies_to: "cart",
          coupon_code: "BULK10",
          min_cart_value: 10000,
          used_count: 0,
          is_active: true,
        };
        setAppliedDiscount(fallbackDiscount);
        return { success: true, message: "Coupon BULK10 applied: 10% off on orders above ₹10,000" };
      } else if (cleanCode === "FESTIVE5") {
        const fallbackDiscount: Discount = {
          id: "d2",
          name: "Festive Season (5% Off)",
          type: "percent",
          value: 5,
          applies_to: "cart",
          coupon_code: "FESTIVE5",
          min_cart_value: 3000,
          used_count: 0,
          is_active: true,
        };
        setAppliedDiscount(fallbackDiscount);
        return { success: true, message: "Coupon FESTIVE5 applied: 5% flat discount!" };
      }
      return { success: false, message: "Invalid coupon code." };
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
  };

  // Re-calculate live bulk pricing and totals
  const totals = calculateCartTotals(items, appliedDiscount);

  return (
    <CartContext.Provider
      value={{
        items: totals.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedDiscount,
        applyCouponCode,
        removeCoupon,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        total: totals.total,
        totalItems: totals.totalItems,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
