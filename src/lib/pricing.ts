import { Product, BulkPriceTier, Discount, CartItem } from "./types";

/**
 * Calculates the applicable unit price for a given product and quantity,
 * checking against defined bulk price tiers.
 */
export function getApplicableUnitPrice(product: Product, quantity: number): number {
  if (!product.bulk_prices || product.bulk_prices.length === 0) {
    return Number(product.price);
  }

  // Sort tiers descending by min_qty
  const sortedTiers = [...product.bulk_prices].sort((a, b) => b.min_qty - a.min_qty);

  for (const tier of sortedTiers) {
    if (quantity >= tier.min_qty) {
      return Number(tier.price);
    }
  }

  return Number(product.price);
}

/**
 * Calculates discount amount based on subtotal and coupon
 */
export function calculateDiscount(
  subtotal: number,
  discount: Discount | null
): { discountAmount: number; isValid: boolean; message?: string } {
  if (!discount || !discount.is_active) {
    return { discountAmount: 0, isValid: false };
  }

  // Check start and end dates if provided
  const now = new Date();
  if (discount.starts_at && new Date(discount.starts_at) > now) {
    return { discountAmount: 0, isValid: false, message: "Coupon is not yet active." };
  }
  if (discount.ends_at && new Date(discount.ends_at) < now) {
    return { discountAmount: 0, isValid: false, message: "Coupon has expired." };
  }

  // Check usage limit
  if (discount.usage_limit && discount.used_count >= discount.usage_limit) {
    return { discountAmount: 0, isValid: false, message: "Coupon usage limit reached." };
  }

  // Check minimum cart value
  if (discount.min_cart_value && subtotal < discount.min_cart_value) {
    return {
      discountAmount: 0,
      isValid: false,
      message: `Minimum order value of ₹${discount.min_cart_value.toLocaleString("en-IN")} required for this coupon.`,
    };
  }

  let amount = 0;
  if (discount.type === "percent") {
    amount = (subtotal * discount.value) / 100;
  } else if (discount.type === "flat") {
    amount = Math.min(discount.value, subtotal);
  }

  return {
    discountAmount: Math.round(amount * 100) / 100,
    isValid: true,
  };
}

/**
 * Computes complete cart totals with bulk pricing & discounts
 */
export function calculateCartTotals(
  items: CartItem[],
  appliedDiscount: Discount | null = null
) {
  const lineItems = items.map((item) => {
    const unitPrice = getApplicableUnitPrice(item.product, item.quantity);
    const lineTotal = unitPrice * item.quantity;
    return {
      ...item,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = lineItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const { discountAmount, isValid: discountValid } = calculateDiscount(
    subtotal,
    appliedDiscount
  );
  const total = Math.max(0, subtotal - discountAmount);

  return {
    items: lineItems,
    subtotal,
    discountAmount: discountValid ? discountAmount : 0,
    couponCode: discountValid ? appliedDiscount?.coupon_code : undefined,
    total,
    totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
  };
}
