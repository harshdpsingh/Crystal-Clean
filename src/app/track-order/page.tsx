"use client";

import React, { useState } from "react";
import { Search, Package, Clock, ShieldCheck } from "lucide-react";
import { formatShortDate } from "@/lib/utils";

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderCode: string;
    status: string;
    createdAt: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim() || !phone.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    setOrderResult(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: orderCode.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderResult(data.order);
      } else {
        setErrorMsg(data.message || "No order found matching these credentials.");
      }
    } catch {
      setErrorMsg("Error querying status. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded">Received (New)</span>;
      case "Confirmed":
        return <span className="bg-teal-subtle text-teal-dark font-semibold px-2.5 py-1 rounded">Order Confirmed</span>;
      case "Packed":
        return <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded">Packed in Warehouse</span>;
      case "Shipped":
        return <span className="bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded">In Transit (Shipped)</span>;
      case "Delivered":
        return <span className="bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded">Delivered to Property</span>;
      case "Cancelled":
        return <span className="bg-red-100 text-red-800 font-semibold px-2.5 py-1 rounded">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded">{status}</span>;
    }
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Order Status Lookup
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Track Your Consignment
          </h1>
          <p className="text-xs sm:text-sm text-body-muted">
            Enter your Order Reference ID (e.g. ORD-1024) and the 10-digit mobile number used during order placement.
          </p>
        </div>

        <div className="bg-white rounded-md border border-border p-6 sm:p-8 shadow-card space-y-6">
          <form onSubmit={handleSearch} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-navy mb-1">
                Order Code / Reference ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-1024"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:border-teal font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Registered Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9829012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3 rounded text-xs flex items-center justify-center gap-2 transition-colors border border-teal-dark"
            >
              <Search className="w-4 h-4" strokeWidth={1.5} />
              <span>{isSearching ? "Checking Database..." : "Track Status"}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 rounded border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {orderResult && (
            <div className="p-5 bg-offwhite rounded border border-border space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-semibold text-navy flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-teal" strokeWidth={1.5} />
                  Order #{orderResult.orderCode}
                </span>
                <span>{getStatusBadge(orderResult.status)}</span>
              </div>

              <div className="flex items-center justify-between text-body-muted">
                <span>Placement Date:</span>
                <span className="text-navy">{formatShortDate(orderResult.createdAt)}</span>
              </div>

              <div className="pt-2 text-[11px] text-body-muted flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal shrink-0" strokeWidth={1.5} />
                <span>For full billing slips or courier tracking airway bills, contact your WhatsApp sales coordinator.</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
