import React from "react";
import { BulkPriceTier } from "@/lib/types";
import { formatInrCurrency } from "@/lib/utils";

interface BulkPriceTableProps {
  basePrice: number;
  minOrderQty: number;
  tiers?: BulkPriceTier[];
  selectedQuantity?: number;
}

export default function BulkPriceTable({
  basePrice,
  minOrderQty,
  tiers,
  selectedQuantity = minOrderQty,
}: BulkPriceTableProps) {
  if (!tiers || tiers.length === 0) {
    return (
      <div className="bg-offwhite p-3.5 rounded border border-border text-xs text-body-muted">
        Standard wholesale pricing: <span className="font-semibold text-navy">{formatInrCurrency(basePrice)} / unit</span> for all quantities (MOQ: {minOrderQty} units).
      </div>
    );
  }

  // Build complete tier list
  const sortedTiers = [...tiers].sort((a, b) => a.min_qty - b.min_qty);
  
  // Format table rows
  const rows = [
    {
      qtyLabel: `${minOrderQty} - ${sortedTiers[0].min_qty - 1} Units`,
      min: minOrderQty,
      max: sortedTiers[0].min_qty - 1,
      price: basePrice,
      savings: "Standard",
    },
    ...sortedTiers.map((tier, idx) => {
      const nextTier = sortedTiers[idx + 1];
      const qtyLabel = nextTier
        ? `${tier.min_qty} - ${nextTier.min_qty - 1} Units`
        : `${tier.min_qty}+ Units`;
      const savingPercent = Math.round(((basePrice - tier.price) / basePrice) * 100);

      return {
        qtyLabel,
        min: tier.min_qty,
        max: nextTier ? nextTier.min_qty - 1 : Infinity,
        price: tier.price,
        savings: savingPercent > 0 ? `${savingPercent}% Off` : "-",
      };
    }),
  ];

  return (
    <div className="border border-border rounded-md overflow-hidden bg-white">
      <div className="bg-offwhite px-4 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-wider text-navy">
          Institutional Tiered Pricing
        </span>
        <span className="text-[11px] text-body-muted">Auto-applied in cart</span>
      </div>
      <table className="w-full text-xs text-left">
        <thead className="bg-white border-b border-border/80 text-body-muted font-medium">
          <tr>
            <th className="px-4 py-2">Order Quantity</th>
            <th className="px-4 py-2">Price / Unit</th>
            <th className="px-4 py-2 text-right">Wholesale Savings</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row, idx) => {
            const isActive =
              selectedQuantity >= row.min && selectedQuantity <= row.max;

            return (
              <tr
                key={idx}
                className={
                  isActive
                    ? "bg-teal-subtle text-navy font-semibold border-l-4 border-l-teal"
                    : "hover:bg-offwhite text-body"
                }
              >
                <td className="px-4 py-2.5">{row.qtyLabel}</td>
                <td className="px-4 py-2.5 font-mono">
                  {formatInrCurrency(row.price)}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-teal">
                  {row.savings}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
