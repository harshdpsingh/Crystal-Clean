"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Sparkles, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { formatInrCurrency } from "@/lib/utils";
import RatingStars from "@/components/ui/RatingStars";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80";

  const discountPercent =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = product.min_order_qty || 100;
    addItem(product, qty);
    setIsAdded(true);
    showToast(`Added ${qty} units of ${product.name} to cart.`, "success");

    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div className="group bg-white rounded-md border border-border hover:border-border-dark transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-subtle hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="block relative">
        {/* Badges strip */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          {discountPercent && (
            <span className="bg-teal text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
              {discountPercent}% Off
            </span>
          )}
          {product.is_customizable && (
            <span className="bg-gold-subtle text-gold-dark border border-gold/40 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold" strokeWidth={1.5} />
              Customizable
            </span>
          )}
        </div>

        {/* 4:5 Aspect Ratio Image container */}
        <div className="relative w-full aspect-[4/5] bg-offwhite overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-body-muted mb-1">
            <span className="font-mono">{product.sku}</span>
            <span>{product.pack_size}</span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-base font-normal text-navy hover:text-teal transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mt-1.5">
            <RatingStars
              rating={product.avg_rating || 4.8}
              reviewCount={product.review_count || 12}
            />
          </div>
        </div>

        <div>
          {/* Price & MOQ */}
          <div className="pt-2 border-t border-border/60 flex items-baseline justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg font-bold text-navy">
                  {formatInrCurrency(product.price)}
                </span>
                <span className="text-xs text-body-muted font-normal">/ unit</span>
                {product.old_price && (
                  <span className="text-xs text-body-light line-through ml-1">
                    {formatInrCurrency(product.old_price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-body-muted font-medium mt-0.5">
                Min. order: <span className="text-navy font-semibold">{product.min_order_qty} units</span>
              </p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full mt-3 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all duration-200 ${
              isAdded
                ? "bg-teal text-white border-teal"
                : "bg-offwhite hover:bg-teal text-navy hover:text-white border-border hover:border-teal"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Add {product.min_order_qty} to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
