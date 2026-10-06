"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderTree, Plus, Edit, Check, X, ArrowUpDown } from "lucide-react";
import { Category } from "@/lib/types";
import { INITIAL_CATEGORIES } from "@/lib/mockData";
import { useToast } from "@/context/ToastContext";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("1");

  const startAdd = () => {
    setIsAdding(true);
    setEditingCat(null);
    setFormName("");
    setFormSlug("");
    setFormImageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80");
    setFormSortOrder(String(categories.length + 1));
  };

  const startEdit = (cat: Category) => {
    setEditingCat(cat);
    setIsAdding(false);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormImageUrl(cat.image_url);
    setFormSortOrder(String(cat.sort_order));
  };

  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, is_active: !c.is_active };
          showToast(`Category "${c.name}" is now ${updated.is_active ? "active" : "hidden"}.`, "info");
          return updated;
        }
        return c;
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCat.id
            ? {
                ...c,
                name: formName,
                slug: formSlug,
                image_url: formImageUrl,
                sort_order: parseInt(formSortOrder) || c.sort_order,
              }
            : c
        )
      );
      showToast(`Category "${formName}" updated successfully!`, "success");
      setEditingCat(null);
    } else if (isAdding) {
      const newCat: Category = {
        id: `c-${Date.now()}`,
        name: formName,
        slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image_url: formImageUrl,
        sort_order: parseInt(formSortOrder) || categories.length + 1,
        is_active: true,
        product_count: 0,
      };
      setCategories([...categories, newCat]);
      showToast(`Category "${formName}" created successfully!`, "success");
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Taxonomy & Navigation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={startAdd}
          className="inline-flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Edit / Add Modal or Inline Card */}
      {(isAdding || editingCat) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-md border border-teal/40 space-y-4 shadow-card text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="font-serif text-base font-semibold text-navy">
              {editingCat ? `Edit Category: ${editingCat.name}` : "Create New Supply Category"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingCat(null);
              }}
              className="text-body-muted hover:text-navy"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!formSlug) {
                    setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-medium text-navy mb-1">
                Image URL (4:3 ratio for tile banner)
              </label>
              <input
                type="url"
                required
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Sort Display Order
              </label>
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-navy hover:bg-navy-light text-white font-semibold py-2.5 px-5 rounded text-xs transition-colors"
          >
            {editingCat ? "Update Category" : "Create Category"}
          </button>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-md border border-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-offwhite text-body-muted border-b border-border font-medium">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Category Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Product Count</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-offwhite/50">
                  <td className="px-4 py-3 font-mono font-bold text-navy">
                    #{cat.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-offwhite rounded border border-border overflow-hidden shrink-0">
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-navy">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-body-muted">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-navy">
                    {cat.product_count || 5}+ Products
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(cat.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        cat.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{cat.is_active ? "Active" : "Hidden"}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(cat)}
                      className="inline-flex items-center gap-1 text-teal hover:underline font-medium"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
