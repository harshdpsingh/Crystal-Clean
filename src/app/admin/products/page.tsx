"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Download,
  Upload,
  Edit,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Product } from "@/lib/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/mockData";
import { formatInrCurrency } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category_id !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.pack_size.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, is_active: !p.is_active };
          showToast(
            `${p.name} is now ${updated.is_active ? "active (visible)" : "hidden from catalog"}.`,
            "info"
          );
          return updated;
        }
        return p;
      })
    );
  };

  const exportProductsCsv = () => {
    const headers = [
      "ID",
      "SKU",
      "Name",
      "Slug",
      "Category_ID",
      "Price",
      "Old_Price",
      "Stock",
      "Min_Order_Qty",
      "Pack_Size",
      "Is_Customizable",
      "Is_Featured",
      "Is_Active",
    ];

    const rows = products.map((p) => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.slug,
      p.category_id,
      p.price,
      p.old_price || "",
      p.stock,
      p.min_order_qty,
      `"${p.pack_size}"`,
      p.is_customizable ? 1 : 0,
      p.is_featured ? 1 : 0,
      p.is_active ? 1 : 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CrystalClean_Products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Bulk CSV imported successfully (${file.name}).`, "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Inventory & Catalog Master
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Products Catalog ({products.length})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 bg-white hover:bg-offwhite text-navy text-xs font-semibold px-3 py-2 rounded border border-border transition-colors cursor-pointer shadow-subtle">
            <Upload className="w-3.5 h-3.5 text-teal" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
          </label>

          <button
            onClick={exportProductsCsv}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-offwhite text-navy text-xs font-semibold px-3 py-2 rounded border border-border transition-colors shadow-subtle"
          >
            <Download className="w-3.5 h-3.5 text-teal" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-md border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-subtle text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-body-muted font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-offwhite border border-border px-3 py-1.5 rounded text-navy font-medium focus:outline-none focus:border-teal"
          >
            <option value="all">All Categories ({products.length})</option>
            {INITIAL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offwhite px-3 py-2 pl-8 rounded border border-border focus:border-teal text-xs"
          />
          <Search className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-md border border-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-offwhite text-body-muted border-b border-border font-medium">
              <tr>
                <th className="px-4 py-3">Product Name & SKU</th>
                <th className="px-4 py-3">Base Price</th>
                <th className="px-4 py-3">Stock Units</th>
                <th className="px-4 py-3">MOQ</th>
                <th className="px-4 py-3">Badges</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((p) => {
                const img = p.images && p.images.length > 0
                  ? p.images[0]
                  : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80";

                return (
                  <tr key={p.id} className="hover:bg-offwhite/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-offwhite rounded border border-border overflow-hidden shrink-0">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-navy block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[11px] font-mono text-body-muted">
                            SKU: {p.sku} | {p.pack_size}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-navy">
                      {formatInrCurrency(p.price)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`font-mono font-semibold ${
                          p.stock < 500 ? "text-red-600 font-bold" : "text-navy"
                        }`}
                      >
                        {p.stock.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-body">
                      {p.min_order_qty}
                    </td>

                    <td className="px-4 py-3 space-x-1">
                      {p.is_featured && (
                        <span className="bg-teal-subtle text-teal-dark text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                      {p.is_customizable && (
                        <span className="bg-gold-subtle text-gold-dark text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          Customizable
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(p.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          p.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{p.is_active ? "Active" : "Hidden"}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex items-center gap-1 text-teal hover:underline font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
