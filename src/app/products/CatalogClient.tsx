"use client";

import React, { useState, useMemo, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import SortSelector from "@/components/products/SortSelector";
import { Search, Filter } from "lucide-react";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
}

export default function CatalogClient({
  initialProducts,
  categories,
  initialCategory = "",
  initialQuery = "",
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(
    initialCategory || searchParams?.get("category") || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialQuery || searchParams?.get("q") || ""
  );
  const [customizableOnly, setCustomizableOnly] = useState(
    searchParams?.get("customizable") === "true"
  );
  const [onOfferOnly, setOnOfferOnly] = useState(
    searchParams?.get("offer") === "true"
  );
  const [sortBy, setSortBy] = useState<"popular" | "price_asc" | "price_desc" | "newest">("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category selection with URL
  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSelectedCategorySlug("");
    setSearchQuery("");
    setCustomizableOnly(false);
    setOnOfferOnly(false);
    setSortBy("popular");
    router.replace("/products", { scroll: false });
  };

  const hasActiveFilters = Boolean(
    selectedCategorySlug || searchQuery || customizableOnly || onOfferOnly
  );

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by Category
    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat) {
        list = list.filter((p) => p.category_id === cat.id);
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.pack_size.toLowerCase().includes(q)
      );
    }

    // Filter by Customizable
    if (customizableOnly) {
      list = list.filter((p) => p.is_customizable);
    }

    // Filter by On Offer
    if (onOfferOnly) {
      list = list.filter((p) => p.old_price && p.old_price > p.price);
    }

    // Sort
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    } else {
      // Default: Popular (by review count or ratings)
      list.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    }

    return list;
  }, [
    initialProducts,
    categories,
    selectedCategorySlug,
    searchQuery,
    customizableOnly,
    onOfferOnly,
    sortBy,
  ]);

  const activeCategoryName = categories.find((c) => c.slug === selectedCategorySlug)?.name;

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Heading & Search */}
      <div className="pb-8 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
              Commercial Amenities Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-navy">
              {activeCategoryName || "All Hospitality Products"}
            </h1>
            <p className="text-xs sm:text-sm text-body-muted mt-1">
              Bulk amenities, toiletries, and housekeeping supplies with tiered wholesale rates.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, SKU, pack size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-offwhite text-xs px-4 py-2.5 pl-9 rounded border border-border focus:outline-none focus:border-teal"
            />
            <Search className="w-4 h-4 text-body-muted absolute left-3 top-3" strokeWidth={1.5} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-body-muted hover:text-navy"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Desktop Left Filters */}
        <div className="hidden lg:block lg:col-span-3">
          <ProductFilters
            categories={categories}
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategory={handleSelectCategory}
            customizableOnly={customizableOnly}
            onToggleCustomizable={() => setCustomizableOnly(!customizableOnly)}
            onOfferOnly={onOfferOnly}
            onToggleOnOffer={() => setOnOfferOnly(!onOfferOnly)}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Right Products Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Bar: Count, Mobile filter button & Sort selector */}
          <div className="flex items-center justify-between gap-4 bg-offwhite p-3.5 rounded-md border border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-xs font-semibold bg-white px-3 py-1.5 rounded border border-border text-navy"
              >
                <Filter className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                <span>Filters {hasActiveFilters && "(Active)"}</span>
              </button>
              <span className="text-xs text-body font-medium">
                Showing <strong className="text-navy">{filteredProducts.length}</strong> items
              </span>
            </div>

            <SortSelector sortBy={sortBy} onChange={setSortBy} />
          </div>

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-offwhite rounded-md border border-border space-y-3 p-6">
              <p className="font-serif text-lg text-navy">
                No products match your current filter criteria.
              </p>
              <p className="text-xs text-body-muted max-w-sm mx-auto">
                Try searching with a broader term or reset active category/discount filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-block bg-teal hover:bg-teal-dark text-white text-xs font-medium px-4 py-2 rounded transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <ProductFilters
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              onSelectCategory={(slug) => {
                handleSelectCategory(slug);
                setMobileFilterOpen(false);
              }}
              customizableOnly={customizableOnly}
              onToggleCustomizable={() => setCustomizableOnly(!customizableOnly)}
              onOfferOnly={onOfferOnly}
              onToggleOnOffer={() => setOnOfferOnly(!onOfferOnly)}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              hasActiveFilters={hasActiveFilters}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full bg-navy text-white text-xs font-medium py-3 rounded text-center"
            >
              Done & View {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
