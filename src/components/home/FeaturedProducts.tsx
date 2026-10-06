import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.filter((p) => p.is_featured).slice(0, 8);

  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
              High-Demand Amenities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy">
              Featured Hospitality Products
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
          >
            <span>Explore All 20+ Items</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
