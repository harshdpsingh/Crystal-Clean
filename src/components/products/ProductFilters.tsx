"use client";

import React from "react";
import { Category } from "@/lib/types";
import { Sparkles, Tag, Check } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategorySlug?: string;
  onSelectCategory: (slug: string) => void;
  customizableOnly: boolean;
  onToggleCustomizable: () => void;
  onOfferOnly: boolean;
  onToggleOnOffer: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ProductFilters({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  customizableOnly,
  onToggleCustomizable,
  onOfferOnly,
  onToggleOnOffer,
  onResetFilters,
  hasActiveFilters,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-md border border-border p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-serif text-sm font-semibold text-navy">
          Filter Catalog
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] text-teal hover:underline font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase font-bold tracking-wider text-body-muted">
          Category
        </p>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => onSelectCategory("")}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              !selectedCategorySlug
                ? "bg-teal-subtle text-navy font-semibold"
                : "text-body hover:bg-offwhite"
            }`}
          >
            <span>All Categories</span>
            {!selectedCategorySlug && <Check className="w-3.5 h-3.5 text-teal" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                selectedCategorySlug === cat.slug
                  ? "bg-teal-subtle text-navy font-semibold"
                  : "text-body hover:bg-offwhite"
              }`}
            >
              <span>{cat.name}</span>
              {selectedCategorySlug === cat.slug && <Check className="w-3.5 h-3.5 text-teal" />}
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights */}
      <div className="space-y-2.5 pt-4 border-t border-border">
        <p className="text-xs uppercase font-bold tracking-wider text-body-muted">
          Attributes
        </p>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-body hover:text-navy">
            <input
              type="checkbox"
              checked={customizableOnly}
              onChange={onToggleCustomizable}
              className="rounded border-border text-teal focus:ring-teal h-4 w-4"
            />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
              Customizable / Private Label
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-body hover:text-navy">
            <input
              type="checkbox"
              checked={onOfferOnly}
              onChange={onToggleOnOffer}
              className="rounded border-border text-teal focus:ring-teal h-4 w-4"
            />
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
              Discounted / On Offer
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
