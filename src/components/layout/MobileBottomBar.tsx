"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatInrCurrency } from "@/lib/utils";

interface MobileBottomBarProps {
  whatsappNumber: string;
}

export default function MobileBottomBar({ whatsappNumber: _whatsappNumber }: MobileBottomBarProps) {
  const { totalItems, total, isLoaded } = useCart();

  if (!isLoaded || totalItems === 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border px-4 py-2.5 shadow-modal">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-body-muted font-medium">
            {totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart
          </span>
          <span className="font-serif text-lg font-bold text-navy leading-tight">
            {formatInrCurrency(total)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2.5 rounded border border-teal-dark transition-colors"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          <span>Checkout on WhatsApp</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
