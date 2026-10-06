"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortSelectorProps {
  sortBy: string;
  onChange: (sort: "popular" | "price_asc" | "price_desc" | "newest") => void;
}

export default function SortSelector({ sortBy, onChange }: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-body-muted hidden sm:inline flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.5} />
        Sort By:
      </span>
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value as any)}
        className="bg-white border border-border text-navy rounded px-3 py-1.5 focus:outline-none focus:border-teal text-xs font-medium cursor-pointer"
      >
        <option value="popular">Most Popular & Ordered</option>
        <option value="newest">Newest Additions</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
