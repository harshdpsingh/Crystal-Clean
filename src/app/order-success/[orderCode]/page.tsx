"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { CheckCircle2, MessageSquare, ArrowRight, Search, Clock, PackageCheck, Truck } from "lucide-react";
import { formatShortDate } from "@/lib/utils";

interface OrderSuccessPageProps {
  params: Promise<{
    orderCode: string;
  }>;
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderCode } = use(params);
  const [trackPhone, setTrackPhone] = useState("");
  const [trackStatus, setTrackStatus] = useState<string | null>(null);
  const [trackDate, setTrackDate] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackPhone.trim()) return;

    setIsSearching(true);
    setTrackError(null);
    setTrackStatus(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          phone: trackPhone.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setTrackStatus(data.order.status);
        setTrackDate(data.order.createdAt);
      } else {
        setTrackError(data.message || "Order not found. Check phone number.");
      }
    } catch {
      setTrackError("Unable to query order status right now.");
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
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Main Success Card */}
        <div className="bg-white rounded-md border border-border p-8 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 bg-teal-subtle rounded-full flex items-center justify-center mx-auto text-teal border border-teal/30">
            <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
              Order Recorded Successfully
            </span>
            <h1 className="font-serif text-3xl text-navy">
              Thank You for Your Order
            </h1>
            <p className="text-xs font-mono font-bold text-navy bg-offwhite px-3 py-1.5 rounded inline-block mt-3 border border-border">
              Order Reference: #{orderCode}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-body leading-relaxed max-w-lg mx-auto">
            Your order has been recorded in our system and sent to the Crystal Clean WhatsApp sales desk. Our dispatch coordinator will review stock availability and send your official invoice copy.
          </p>

          {/* Steps Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-border text-left text-xs">
            <div className="p-3 bg-offwhite rounded border border-border space-y-1">
              <span className="flex items-center gap-1.5 text-navy font-semibold">
                <Clock className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                1. Review & Invoice
              </span>
              <p className="text-[11px] text-body-muted">Sales coordinator confirms items and freight charges.</p>
            </div>

            <div className="p-3 bg-offwhite rounded border border-border space-y-1">
              <span className="flex items-center gap-1.5 text-navy font-semibold">
                <PackageCheck className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                2. Carton Packing
              </span>
              <p className="text-[11px] text-body-muted">Items inspected, leak-tested, and packed in master cartons.</p>
            </div>

            <div className="p-3 bg-offwhite rounded border border-border space-y-1">
              <span className="flex items-center gap-1.5 text-navy font-semibold">
                <Truck className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                3. Dispatch & Tracking
              </span>
              <p className="text-[11px] text-body-muted">Consignment dispatched with courier tracking ID.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-medium px-5 py-2.5 rounded transition-colors"
            >
              <span>Continue Browsing Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Live Tracking Box */}
        <div className="bg-offwhite rounded-md border border-border p-6 space-y-4">
          <div>
            <h2 className="font-serif text-base font-semibold text-navy">
              Check Order Status
            </h2>
            <p className="text-xs text-body-muted mt-0.5">
              Enter the phone number registered during checkout to view current status:
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter 10-digit Phone Number"
              value={trackPhone}
              onChange={(e) => setTrackPhone(e.target.value.replace(/[^0-9]/g, ""))}
              className="flex-1 bg-white px-3 py-2 rounded border border-border focus:outline-none focus:border-teal text-xs font-mono"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-teal hover:bg-teal-dark text-white text-xs font-medium px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{isSearching ? "Checking..." : "Check Status"}</span>
            </button>
          </form>

          {trackError && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
              {trackError}
            </p>
          )}

          {trackStatus && (
            <div className="p-4 bg-white rounded border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-body-muted">Order ID:</span>
                <span className="font-mono font-bold text-navy">#{orderCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-muted">Current Status:</span>
                <div>{getStatusBadge(trackStatus)}</div>
              </div>
              {trackDate && (
                <div className="flex items-center justify-between">
                  <span className="text-body-muted">Placed On:</span>
                  <span className="text-navy">{formatShortDate(trackDate)}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
