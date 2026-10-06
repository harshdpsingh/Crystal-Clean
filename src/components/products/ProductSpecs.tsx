import React from "react";
import { ProductSpecifications } from "@/lib/types";

interface ProductSpecsProps {
  sku: string;
  packSize: string;
  minOrderQty: number;
  specifications: ProductSpecifications;
}

export default function ProductSpecs({
  sku,
  packSize,
  minOrderQty,
  specifications,
}: ProductSpecsProps) {
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const defaultSpecs = [
    { label: "SKU Identifier", value: sku },
    { label: "Packaging / Pack Size", value: packSize },
    { label: "Minimum Order Quantity", value: `${minOrderQty} Units` },
  ];

  const customSpecs = Object.entries(specifications || {}).map(([key, val]) => ({
    label: formatKey(key),
    value: String(val),
  }));

  const allSpecs = [...defaultSpecs, ...customSpecs];

  return (
    <div className="border border-border rounded-md overflow-hidden bg-white">
      <div className="bg-offwhite px-4 py-2.5 border-b border-border">
        <h3 className="font-serif text-sm font-semibold text-navy">
          Commercial Specifications & Material Data
        </h3>
      </div>
      <div className="divide-y divide-border/60">
        {allSpecs.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 sm:grid-cols-3 px-4 py-2.5 text-xs"
          >
            <span className="text-body-muted font-medium sm:col-span-1">
              {item.label}
            </span>
            <span className="text-navy font-normal sm:col-span-2 mt-0.5 sm:mt-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
