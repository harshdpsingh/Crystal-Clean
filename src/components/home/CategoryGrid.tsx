import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-20 bg-offwhite border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
              Supply Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy">
              Essential Supplies for Every Department
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
          >
            <span>View All Product Categories</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Asymmetric 6-Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {displayCategories.map((category, index) => {
            // First tile is large (spans 6 cols on desktop), others span 3 or 6
            const isLarge = index === 0;
            const colSpanClass = isLarge
              ? "lg:col-span-6 lg:row-span-2"
              : index === 1
              ? "lg:col-span-6"
              : "lg:col-span-3";

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`group relative rounded-md overflow-hidden border border-border bg-white shadow-subtle hover:border-teal transition-all duration-300 flex flex-col justify-end ${colSpanClass} ${
                  isLarge ? "min-h-[360px] sm:min-h-[420px]" : "min-h-[220px]"
                }`}
              >
                {/* Background Image */}
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-5 sm:p-6 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gold-light font-medium block mb-1">
                      {category.product_count || "10+"} Products
                    </span>
                    <h3 className={`font-serif text-white font-normal ${isLarge ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-teal flex items-center justify-center text-white transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
