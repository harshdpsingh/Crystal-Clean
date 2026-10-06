"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  AlertCircle,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatInrCurrency } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    appliedDiscount,
    applyCouponCode,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
    totalItems,
    isLoaded,
  } = useCart();

  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-site mx-auto px-4 py-24 text-center text-xs text-body-muted">
        Loading cart items...
      </div>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    const res = await applyCouponCode(couponInput.trim());
    setIsApplyingCoupon(false);

    if (res.success) {
      showToast(res.message, "success");
      setCouponInput("");
    } else {
      showToast(res.message, "error");
    }
  };

  const handleApplySampleCoupon = async (code: string) => {
    setIsApplyingCoupon(true);
    const res = await applyCouponCode(code);
    setIsApplyingCoupon(false);
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto bg-white rounded-md border border-border p-8 sm:p-12 text-center space-y-4 shadow-subtle">
          <div className="w-16 h-16 bg-offwhite rounded-full flex items-center justify-center mx-auto text-navy border border-border">
            <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-2xl text-navy">
            Your Cart is Currently Empty
          </h1>
          <p className="text-xs sm:text-sm text-body-muted leading-relaxed">
            You haven&apos;t added any hotel amenities or housekeeping supplies yet. Browse our commercial catalog to start an order.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-medium px-6 py-3 rounded text-xs transition-colors border border-teal-dark"
            >
              <span>Explore Products Catalog</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if any items are below MOQ
  const hasMoqViolation = items.some(
    (item) => item.quantity < (item.product.min_order_qty || 1)
  );

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-border gap-2">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
            Order Review
          </span>
          <h1 className="font-serif text-3xl text-navy">
            Shopping Cart ({totalItems} Units)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-body-muted hover:text-red-600 transition-colors self-start sm:self-auto"
        >
          Clear Entire Cart
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {hasMoqViolation && (
            <div className="p-3.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.5} />
              <span>Some items in your cart are below their minimum order quantity. Please adjust quantities to proceed.</span>
            </div>
          )}

          <div className="border border-border rounded-md overflow-hidden bg-white divide-y divide-border">
            {items.map((item) => {
              const mainImg = item.product.images && item.product.images.length > 0
                ? item.product.images[0]
                : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80";

              const isBelowMoq = item.quantity < (item.product.min_order_qty || 1);

              return (
                <div
                  key={item.product.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-offwhite/40 transition-colors"
                >
                  {/* Thumbnail & Product Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-offwhite rounded border border-border shrink-0 overflow-hidden">
                      <Image
                        src={mainImg}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-body-muted">
                        <span className="font-mono">{item.product.sku}</span>
                        <span>•</span>
                        <span>{item.product.pack_size}</span>
                      </div>

                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-serif text-sm sm:text-base text-navy hover:text-teal transition-colors font-medium line-clamp-1"
                      >
                        {item.product.name}
                      </Link>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-navy font-semibold">
                          {formatInrCurrency(item.unitPrice)}
                        </span>
                        <span className="text-body-muted text-[11px]">/ unit applied tier</span>
                      </div>

                      {isBelowMoq && (
                        <p className="text-[11px] text-red-600 font-medium">
                          Min. Order: {item.product.min_order_qty} units
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls & Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                    <div className="flex items-center border border-border rounded bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 50)}
                        className="px-2.5 py-1 text-navy hover:bg-offwhite text-xs font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={item.product.min_order_qty || 1}
                        step={10}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            parseInt(e.target.value) || item.product.min_order_qty || 1
                          )
                        }
                        className="w-16 text-center py-1 text-xs font-semibold text-navy focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 50)}
                        className="px-2.5 py-1 text-navy hover:bg-offwhite text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="font-serif text-base font-bold text-navy block">
                        {formatInrCurrency(item.lineTotal)}
                      </span>
                      <span className="text-[10px] text-body-muted">excl. GST</span>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-body-light hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-body-muted">
            <Link href="/products" className="text-teal hover:underline font-medium">
              &larr; Continue Adding Products
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary Box */}
          <div className="bg-offwhite rounded-md border border-border p-6 space-y-5">
            <h2 className="font-serif text-lg font-semibold text-navy pb-3 border-b border-border">
              Order Summary
            </h2>

            {/* Subtotal, Discounts, Total */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-body">
                <span>Subtotal ({totalItems} Units)</span>
                <span className="font-mono font-medium text-navy">
                  {formatInrCurrency(subtotal)}
                </span>
              </div>

              {appliedDiscount && discountAmount > 0 && (
                <div className="flex items-center justify-between text-teal font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Discount ({appliedDiscount.coupon_code})
                  </span>
                  <span className="font-mono">
                    -{formatInrCurrency(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-body-muted text-[11px]">
                <span>Shipping / Freight</span>
                <span className="text-navy font-medium">Calculated via WhatsApp</span>
              </div>

              <div className="flex items-center justify-between text-body-muted text-[11px]">
                <span>GST (18% / 12% on amenities)</span>
                <span className="text-navy font-medium">Itemized in official invoice</span>
              </div>

              <div className="pt-3 border-t border-border flex items-baseline justify-between">
                <span className="font-serif text-base font-semibold text-navy">
                  Estimated Total
                </span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-navy block">
                    {formatInrCurrency(total)}
                  </span>
                  <span className="text-[10px] text-body-muted">No online payment required</span>
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs font-semibold text-navy uppercase tracking-wider">
                Apply Promo Code
              </p>

              {appliedDiscount ? (
                <div className="flex items-center justify-between p-2.5 bg-teal-subtle rounded border border-teal/30 text-xs text-navy">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal" strokeWidth={2} />
                    <span><strong>{appliedDiscount.coupon_code}</strong> applied ({appliedDiscount.value}% off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. BULK10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white text-xs px-3 py-2 rounded border border-border focus:outline-none focus:border-teal uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="bg-navy hover:bg-navy-light text-white text-xs font-medium px-4 py-2 rounded transition-colors"
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </form>
              )}

              {/* Sample Coupons */}
              {!appliedDiscount && (
                <div className="pt-1 flex flex-wrap gap-1.5 text-[11px]">
                  <span className="text-body-muted">Available:</span>
                  <button
                    type="button"
                    onClick={() => handleApplySampleCoupon("BULK10")}
                    className="text-teal hover:underline font-mono bg-white px-1.5 py-0.5 rounded border border-border"
                  >
                    BULK10 (10% off &gt; ₹10k)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplySampleCoupon("FESTIVE5")}
                    className="text-teal hover:underline font-mono bg-white px-1.5 py-0.5 rounded border border-border"
                  >
                    FESTIVE5 (5% off)
                  </button>
                </div>
              )}
            </div>

            {/* Checkout CTA */}
            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full bg-teal hover:bg-teal-dark text-white font-medium py-3.5 px-4 rounded text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-colors border border-teal-dark tracking-wide shadow-subtle"
              >
                <span>Proceed to Hotel Details & WhatsApp</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="pt-2 text-[11px] text-body-muted text-center space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-navy font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                No payment charged on website
              </p>
              <p>Your order is directly transmitted to our sales office for pro-forma generation.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
