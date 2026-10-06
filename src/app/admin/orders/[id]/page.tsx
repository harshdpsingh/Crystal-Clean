"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  Building,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { INITIAL_ORDERS } from "@/lib/mockData";
import { formatInrCurrency, formatDate } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useToast } from "@/context/ToastContext";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("New");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Find order by ID or order_code
    const found = INITIAL_ORDERS.find(
      (o) => o.id === id || o.order_code.toLowerCase() === id.toLowerCase()
    );
    if (found) {
      setOrder(found);
      setCurrentStatus(found.status);
      setAdminNotes(found.admin_notes || "");
    }
  }, [id]);

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="text-xs text-teal hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
        <div className="bg-white p-8 rounded border border-border text-center text-xs text-body-muted">
          Order not found.
        </div>
      </div>
    );
  }

  const handleSaveStatus = async () => {
    setIsSaving(true);
    // Update local state and mock store
    order.status = currentStatus;
    order.admin_notes = adminNotes;
    showToast(`Order #${order.order_code} status updated to ${currentStatus}.`, "success");
    setIsSaving(false);
  };

  const whatsappReplyText = `Hello ${order.customer?.name || "Customer"}, this is Crystal Clean regarding your Order #${order.order_code} for ${order.customer?.hotel_name}:`;
  const whatsappReplyUrl = buildWhatsAppUrl(
    order.customer?.phone || "",
    whatsappReplyText
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-teal hover:underline flex items-center gap-1 mb-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Order #{order.order_code}
          </h1>
          <p className="text-xs text-body-muted">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={whatsappReplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#0E7C86] hover:bg-[#0A5D65] text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reply on WhatsApp</span>
          </a>

          <Link
            href={`/admin/orders/${order.id || order.order_code}/invoice`}
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-offwhite text-navy text-xs font-semibold px-4 py-2 rounded border border-border transition-colors shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5 text-teal" />
            <span>Print Tax Invoice & Packing Slip</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Order Line Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-md border border-border p-6 shadow-subtle space-y-4">
            <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
              Ordered Products & Bulk Breakdown
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-offwhite text-body-muted border-b border-border">
                  <tr>
                    <th className="px-3 py-2">Item Name & SKU</th>
                    <th className="px-3 py-2">Pack Info</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Unit Rate</th>
                    <th className="px-3 py-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-offwhite/50">
                      <td className="px-3 py-3">
                        <span className="font-semibold text-navy block">
                          {item.product_name}
                        </span>
                        {item.sku && (
                          <span className="text-[10px] font-mono text-body-muted">
                            SKU: {item.sku}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-body-muted">
                        {item.pack_size || "Standard Pack"}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-navy">
                        {item.qty.toLocaleString("en-IN")} Units
                      </td>
                      <td className="px-3 py-3 font-mono">
                        {formatInrCurrency(item.unit_price)}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-navy text-right">
                        {formatInrCurrency(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-border space-y-2 text-xs max-w-xs ml-auto">
              <div className="flex items-center justify-between text-body">
                <span>Subtotal</span>
                <span className="font-mono">{formatInrCurrency(order.subtotal)}</span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex items-center justify-between text-teal font-medium">
                  <span>Discount ({order.coupon_code || "Applied"})</span>
                  <span className="font-mono">-{formatInrCurrency(order.discount_amount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-baseline justify-between">
                <span className="font-serif text-base font-semibold text-navy">
                  Grand Total
                </span>
                <span className="font-serif text-xl font-bold text-navy">
                  {formatInrCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Order Notes */}
          {order.notes && (
            <div className="p-4 bg-offwhite rounded-md border border-border text-xs space-y-1">
              <strong className="text-navy block font-semibold">
                Customer Delivery Instructions:
              </strong>
              <p className="text-body italic">&ldquo;{order.notes}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Right Column: Customer Details & Status Control */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Fulfillment Updater */}
          <div className="bg-white rounded-md border border-border p-6 shadow-subtle space-y-4">
            <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border">
              Fulfillment Control
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">
                  Order Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                  className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal text-xs font-semibold text-navy"
                >
                  <option value="New">New (Received)</option>
                  <option value="Confirmed">Confirmed (Pro-forma Sent)</option>
                  <option value="Packed">Packed in Warehouse</option>
                  <option value="Shipped">Shipped (In Transit)</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Internal Dispatch / Courier Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Dispatched via Bluedart AWB #BD1234567"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal text-xs resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2.5 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Update Order Status"}</span>
              </button>
            </div>
          </div>

          {/* Customer Profile Box */}
          <div className="bg-white rounded-md border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h2 className="font-serif text-base font-semibold text-navy">
                Customer Profile
              </h2>
              <span className="text-[10px] font-mono bg-offwhite px-2 py-0.5 rounded border border-border">
                {order.customer?.customer_code || "CUST-0001"}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-body">
              <li className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-body-muted block text-[11px]">Hotel / Property</span>
                  <strong className="text-navy">{order.customer?.hotel_name}</strong>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-body-muted block text-[11px]">Contact Person</span>
                  <span className="text-navy">{order.customer?.name}</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-body-muted block text-[11px]">Mobile Number</span>
                  <span className="font-mono text-navy">{order.customer?.phone}</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-body-muted block text-[11px]">Delivery Address</span>
                  <span className="text-navy">
                    {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
                  </span>
                </div>
              </li>

              {order.customer?.gst_number && (
                <li className="flex items-start gap-2.5 pt-2 border-t border-border">
                  <FileText className="w-4 h-4 text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <span className="text-body-muted block text-[11px]">GSTIN Registration</span>
                    <span className="font-mono font-bold text-navy">{order.customer.gst_number}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
