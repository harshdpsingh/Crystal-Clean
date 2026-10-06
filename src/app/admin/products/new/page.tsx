"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Sparkles } from "lucide-react";
import { INITIAL_CATEGORIES } from "@/lib/mockData";
import { BulkPriceTier } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

export default function AdminNewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0].id);
  const [price, setPrice] = useState("8.50");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("10000");
  const [minOrderQty, setMinOrderQty] = useState("100");
  const [packSize, setPackSize] = useState("Pack of 100 Units");
  const [description, setDescription] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80");

  const [bulkTiers, setBulkTiers] = useState<BulkPriceTier[]>([
    { min_qty: 500, price: 7.80 },
    { min_qty: 1000, price: 7.20 },
  ]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const addTier = () => {
    setBulkTiers([...bulkTiers, { min_qty: 2000, price: Number(price) * 0.8 }]);
  };

  const removeTier = (index: number) => {
    setBulkTiers(bulkTiers.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Product "${name}" added to catalog successfully!`, "success");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <Link href="/admin/products" className="text-xs text-teal hover:underline flex items-center gap-1 mb-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Add New Amenity Product
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Details */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle text-xs">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shampoo Bottle 30 ml, Pack of 100"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                SKU Identifier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CC-HYG-021"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-medium"
              >
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Pack Size / Packaging Format
              </label>
              <input
                type="text"
                placeholder="e.g. Pack of 100 Units"
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                URL Slug
              </label>
              <input
                type="text"
                placeholder="shampoo-bottle-30ml"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-navy mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Descriptive details regarding formulation, ingredients, packaging, and suitability for hotels."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal resize-none"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle text-xs">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
            Pricing, Stock & Minimum Quantities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Base Price / Unit (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Old / Strikethrough Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Inventory Stock (Units)
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Min. Order Qty (MOQ)
              </label>
              <input
                type="number"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>
          </div>

          {/* Bulk Tiers */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-navy uppercase tracking-wider">
                Volume Discount Tiers
              </span>
              <button
                type="button"
                onClick={addTier}
                className="text-teal hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tier
              </button>
            </div>

            <div className="space-y-2">
              {bulkTiers.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-body-muted">Min Qty:</span>
                  <input
                    type="number"
                    value={tier.min_qty}
                    onChange={(e) => {
                      const updated = [...bulkTiers];
                      updated[idx].min_qty = parseInt(e.target.value) || 0;
                      setBulkTiers(updated);
                    }}
                    className="w-28 bg-offwhite px-2.5 py-1.5 rounded border border-border font-mono"
                  />
                  <span className="text-body-muted">Price / Unit (₹):</span>
                  <input
                    type="number"
                    step="0.01"
                    value={tier.price}
                    onChange={(e) => {
                      const updated = [...bulkTiers];
                      updated[idx].price = parseFloat(e.target.value) || 0;
                      setBulkTiers(updated);
                    }}
                    className="w-28 bg-offwhite px-2.5 py-1.5 rounded border border-border font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="text-body-light hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media & Attributes */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle text-xs">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
            Media & Catalog Flags
          </h2>

          <div>
            <label className="block font-medium text-navy mb-1">
              Primary Product Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal h-4 w-4"
              />
              <span className="font-medium text-navy flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Customizable (Private Label Ready)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal h-4 w-4"
              />
              <span className="font-medium text-navy">
                Feature on Homepage
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-subtle"
        >
          <Save className="w-4 h-4" />
          <span>Save Product & Publish to Storefront</span>
        </button>
      </form>
    </div>
  );
}
