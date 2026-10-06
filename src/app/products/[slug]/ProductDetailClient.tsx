"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Truck,
  Check,
  ChevronRight,
  Package,
} from "lucide-react";
import { Product, Review, SettingsState } from "@/lib/types";
import { formatInrCurrency } from "@/lib/utils";
import { getApplicableUnitPrice } from "@/lib/pricing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import ProductGallery from "@/components/products/ProductGallery";
import BulkPriceTable from "@/components/products/BulkPriceTable";
import ProductSpecs from "@/components/products/ProductSpecs";
import ProductReviews from "@/components/products/ProductReviews";
import ProductCard from "@/components/products/ProductCard";
import RatingStars from "@/components/ui/RatingStars";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
  settings: SettingsState;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
  settings,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const minQty = product.min_order_qty || 100;
  const [quantity, setQuantity] = useState<number>(minQty);
  const [isAdded, setIsAdded] = useState(false);

  // Compute live unit price and line total for selected quantity
  const currentUnitPrice = getApplicableUnitPrice(product, quantity);
  const calculatedLineTotal = currentUnitPrice * quantity;

  const handleQuantityChange = (val: number) => {
    const valid = Math.max(minQty, Math.floor(val) || minQty);
    setQuantity(valid);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    showToast(
      `Added ${quantity} units of ${product.name} to cart. (${formatInrCurrency(calculatedLineTotal)})`,
      "success"
    );

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const directInquiryText = `Hello Crystal Clean, I would like to inquire about ${product.name} (SKU: ${product.sku}). Required Quantity: ${quantity} units.`;
  const directInquiryUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    directInquiryText
  );

  const discountPercent =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-body-muted mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-navy whitespace-nowrap">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-border-dark shrink-0" />
        <Link href="/products" className="hover:text-navy whitespace-nowrap">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-border-dark shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-navy whitespace-nowrap"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-border-dark shrink-0" />
        <span className="text-navy font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Information, Pricing & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-body-muted mb-2">
              <span className="font-mono bg-offwhite px-2 py-0.5 rounded border border-border">
                SKU: {product.sku}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Package className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                {product.pack_size}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-navy leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews anchor */}
            <div className="mt-2.5 flex items-center gap-3">
              <RatingStars
                rating={product.avg_rating || 4.8}
                reviewCount={product.review_count || reviews.length || 12}
                showValue
              />
              {product.is_customizable && (
                <span className="bg-gold-subtle text-gold-dark border border-gold/40 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold" strokeWidth={1.5} />
                  Custom Branding Available
                </span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-offwhite rounded-md border border-border space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-navy">
                {formatInrCurrency(currentUnitPrice)}
              </span>
              <span className="text-xs text-body-muted">/ unit (excl. GST)</span>
              {product.old_price && (
                <span className="text-sm text-body-light line-through ml-2">
                  {formatInrCurrency(product.old_price)}
                </span>
              )}
              {discountPercent && (
                <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-sm ml-auto">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="text-xs text-body-muted flex items-center justify-between pt-1 border-t border-border/60">
              <span>Minimum Order Quantity (MOQ): <strong>{minQty} Units</strong></span>
              <span>In Stock: <strong>{product.stock.toLocaleString("en-IN")} Units</strong></span>
            </div>
          </div>

          {/* Tiered Bulk Pricing Table */}
          <BulkPriceTable
            basePrice={product.price}
            minOrderQty={minQty}
            tiers={product.bulk_prices}
            selectedQuantity={quantity}
          />

          {/* Quantity Selector & Add to Cart Controls */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider">
              Order Quantity (Units)
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-border rounded bg-white">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 50)}
                  className="px-3 py-2 text-navy hover:bg-offwhite text-sm font-bold disabled:opacity-40"
                  disabled={quantity <= minQty}
                >
                  -
                </button>
                <input
                  type="number"
                  min={minQty}
                  step={10}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || minQty)}
                  className="w-24 text-center py-2 text-sm font-semibold text-navy focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 50)}
                  className="px-3 py-2 text-navy hover:bg-offwhite text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 text-xs">
                {[minQty, minQty * 2, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuantityChange(preset)}
                    className={`px-2.5 py-2 rounded border text-xs transition-colors ${
                      quantity === preset
                        ? "bg-navy text-white border-navy font-semibold"
                        : "bg-offwhite text-body border-border hover:border-teal"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculated Line Total */}
            <div className="flex items-center justify-between text-xs py-2 px-3 bg-teal-subtle/50 rounded border border-teal/20 text-navy font-medium">
              <span>Estimated Line Total ({quantity} units @ {formatInrCurrency(currentUnitPrice)}):</span>
              <strong className="font-serif text-base text-teal-dark">{formatInrCurrency(calculatedLineTotal)}</strong>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`py-3 px-4 rounded text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  isAdded
                    ? "bg-teal text-white border-teal"
                    : "bg-teal hover:bg-teal-dark text-white border-teal-dark"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    <span>Added {quantity} to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span>Add {quantity} Units to Cart</span>
                  </>
                )}
              </button>

              <a
                href={directInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded text-xs font-semibold flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white border border-navy transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-teal-light" strokeWidth={1.5} />
                <span>Instant WhatsApp Quote</span>
              </a>
            </div>

            {/* Customization Callout if product allows it */}
            {product.is_customizable && (
              <div className="p-3 bg-gold-subtle rounded border border-gold/30 text-xs text-navy flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
                  Looking for your property logo printed on this bottle?
                </span>
                <Link
                  href={`/custom-order?product=${encodeURIComponent(product.name)}`}
                  className="font-semibold text-teal hover:underline shrink-0"
                >
                  Request Branding &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Factual Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border text-xs text-body-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal shrink-0" strokeWidth={1.5} />
              <span>Dispatched within 2-4 business days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal shrink-0" strokeWidth={1.5} />
              <span>100% Quality checked & leak tested</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="font-serif text-base font-semibold text-navy">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-body leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <ProductSpecs
            sku={product.sku}
            packSize={product.pack_size}
            minOrderQty={minQty}
            specifications={product.specifications}
          />

        </div>
      </div>

      {/* Frequently Ordered Together / Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-border space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
              Complementary Amenities
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-navy">
              Frequently Ordered Together
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-20 pt-12 border-t border-border">
        <ProductReviews
          productId={product.id}
          productName={product.name}
          initialReviews={reviews}
          avgRating={product.avg_rating}
        />
      </div>

    </div>
  );
}
