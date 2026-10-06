"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Sparkles, Check, Trash } from "lucide-react";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/mockData";
import { Product, BulkPriceTier } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("");
  const [packSize, setPackSize] = useState("");
  const [description, setDescription] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [bulkTiers, setBulkTiers] = useState<BulkPriceTier[]>([]);

  useEffect(() => {
    const found = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (found) {
      setProduct(found);
      setName(found.name);
      setSku(found.sku);
      setPrice(String(found.price));
      setOldPrice(found.old_price ? String(found.old_price) : "");
      setStock(String(found.stock));
      setMinOrderQty(String(found.min_order_qty));
      setPackSize(found.pack_size);
      setDescription(found.description);
      setIsCustomizable(found.is_customizable);
      setIsFeatured(found.is_featured);
      setIsActive(found.is_active);
      setBulkTiers(found.bulk_prices || []);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="space-y-4">
        <Link href="/admin/products" className="text-xs text-teal hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
        <div className="bg-white p-8 rounded border border-border text-center text-xs text-body-muted">
          Product not found.
        </div>
      </div>
    );
  }

  const addTier = () => {
    setBulkTiers([...bulkTiers, { min_qty: 2500, price: Number(price) * 0.8 }]);
  };

  const removeTier = (index: number) => {
    setBulkTiers(bulkTiers.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    product.name = name;
    product.price = Number(price);
    product.old_price = oldPrice ? Number(oldPrice) : undefined;
    product.stock = Number(stock);
    product.min_order_qty = Number(minOrderQty);
    product.pack_size = packSize;
    product.description = description;
    product.is_customizable = isCustomizable;
    product.is_featured = isFeatured;
    product.is_active = isActive;
    product.bulk_prices = bulkTiers;

    showToast(`Product "${name}" updated successfully!`, "success");
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
            Edit: {product.name}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Details */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle text-xs">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
            Product Attributes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal text-body text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono uppercase text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Pack Size / Packaging Format
              </label>
              <input
                type="text"
                value={packSize}
                onChange={(e) => setPackSize(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal text-xs"
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
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-navy mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal text-xs resize-none"
            />
          </div>
        </div>

        {/* Pricing & Bulk Tiers */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle text-xs">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
            Pricing & Tiered Discounts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Base Unit Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Old / Strikethrough Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono text-xs"
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
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono text-xs"
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

        {/* Catalog Flags */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle text-xs">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
            Catalog Visibility & Customization
          </h2>

          <div className="flex flex-wrap items-center gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal h-4 w-4"
              />
              <span className="font-semibold text-navy">
                Visible on Storefront (Active)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="rounded border-border text-teal focus:ring-teal h-4 w-4"
              />
              <span className="font-medium text-navy flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Customizable (Private Label Tag)
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
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}
