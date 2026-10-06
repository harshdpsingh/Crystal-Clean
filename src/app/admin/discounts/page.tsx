"use client";

import React, { useState } from "react";
import { Tag, Plus, Check, X, Calendar, Percent } from "lucide-react";
import { Discount } from "@/lib/types";
import { INITIAL_DISCOUNTS } from "@/lib/mockData";
import { formatInrCurrency } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminDiscountsPage() {
  const { showToast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>(INITIAL_DISCOUNTS);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState<"percent" | "flat">("percent");
  const [value, setValue] = useState("10");
  const [couponCode, setCouponCode] = useState("");
  const [minCartValue, setMinCartValue] = useState("5000");
  const [usageLimit, setUsageLimit] = useState("500");

  const toggleActive = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = { ...d, is_active: !d.is_active };
          showToast(`Coupon "${d.coupon_code || d.name}" is now ${updated.is_active ? "active" : "disabled"}.`, "info");
          return updated;
        }
        return d;
      })
    );
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiscount: Discount = {
      id: `d-${Date.now()}`,
      name,
      type,
      value: Number(value),
      applies_to: "cart",
      coupon_code: couponCode.trim().toUpperCase() || undefined,
      min_cart_value: Number(minCartValue) || 0,
      usage_limit: Number(usageLimit) || undefined,
      used_count: 0,
      is_active: true,
    };

    setDiscounts([...discounts, newDiscount]);
    showToast(`Promotion code "${newDiscount.coupon_code || newDiscount.name}" created!`, "success");
    setIsAdding(false);
    setName("");
    setCouponCode("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Promotions & Wholesale Codes
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Discounts & Coupons ({discounts.length})
          </h1>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreateDiscount} className="bg-white p-6 rounded-md border border-teal/40 space-y-4 shadow-card text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="font-serif text-base font-semibold text-navy">
              Create Commercial Discount / Coupon
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-body-muted hover:text-navy"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Monsoon Hotel Welcome (10% Off)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MONSOON10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono uppercase font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Discount Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              >
                <option value="percent">Percentage (%) Off</option>
                <option value="flat">Flat Rupee (₹) Off</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Value ({type === "percent" ? "%" : "₹"})
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Min. Cart Value (₹)
              </label>
              <input
                type="number"
                value={minCartValue}
                onChange={(e) => setMinCartValue(e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-navy hover:bg-navy-light text-white font-semibold py-2.5 px-5 rounded text-xs transition-colors"
          >
            Activate Promotion Code
          </button>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-md border border-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-offwhite text-body-muted border-b border-border font-medium">
              <tr>
                <th className="px-4 py-3">Coupon Code</th>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Discount Value</th>
                <th className="px-4 py-3">Min. Cart Value</th>
                <th className="px-4 py-3">Redemptions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-offwhite/50">
                  <td className="px-4 py-3 font-mono font-bold text-navy">
                    {d.coupon_code || "(Automatic)"}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">
                    {d.name}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-teal">
                    {d.type === "percent" ? `${d.value}% Off` : formatInrCurrency(d.value)}
                  </td>
                  <td className="px-4 py-3 font-mono text-body">
                    {formatInrCurrency(d.min_cart_value)}
                  </td>
                  <td className="px-4 py-3 font-mono text-body-muted">
                    {d.used_count} uses
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        d.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {d.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleActive(d.id)}
                      className="text-xs text-teal hover:underline font-semibold"
                    >
                      {d.is_active ? "Deactivate" : "Enable"}
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
