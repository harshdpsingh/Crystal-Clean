"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { INITIAL_ORDERS } from "@/lib/mockData";
import { formatInrCurrency, formatShortDate } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = o.order_code.toLowerCase().includes(q);
      const matchCustomer = o.customer?.name.toLowerCase().includes(q);
      const matchHotel = o.customer?.hotel_name.toLowerCase().includes(q);
      const matchPhone = o.customer?.phone.includes(q);
      return matchCode || matchCustomer || matchHotel || matchPhone;
    }
    return true;
  });

  const exportOrdersCsv = () => {
    const headers = [
      "Order Code",
      "Date",
      "Customer Code",
      "Customer Name",
      "Hotel Name",
      "Phone",
      "Status",
      "Subtotal",
      "Discount",
      "Total",
      "GSTIN",
    ];

    const rows = filteredOrders.map((o) => [
      o.order_code,
      o.created_at,
      o.customer?.customer_code || "-",
      `"${o.customer?.name || "-"}"`,
      `"${o.customer?.hotel_name || "-"}"`,
      o.customer?.phone || "-",
      o.status,
      o.subtotal,
      o.discount_amount,
      o.total,
      o.customer?.gst_number || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CrystalClean_Orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "New":
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded">New</span>;
      case "Confirmed":
        return <span className="bg-teal-subtle text-teal-dark text-[11px] font-semibold px-2 py-0.5 rounded">Confirmed</span>;
      case "Packed":
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded">Packed</span>;
      case "Shipped":
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-semibold px-2 py-0.5 rounded">Shipped</span>;
      case "Delivered":
        return <span className="bg-green-100 text-green-800 text-[11px] font-semibold px-2 py-0.5 rounded">Delivered</span>;
      case "Cancelled":
        return <span className="bg-red-100 text-red-800 text-[11px] font-semibold px-2 py-0.5 rounded">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Fulfillment & Invoicing
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Orders Management ({filteredOrders.length})
          </h1>
        </div>

        <button
          onClick={exportOrdersCsv}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-offwhite text-navy text-xs font-semibold px-4 py-2 rounded border border-border transition-colors shadow-subtle"
        >
          <Download className="w-3.5 h-3.5 text-teal" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-md border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-subtle text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-body-muted font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {["all", "New", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded transition-colors ${
                statusFilter === st
                  ? "bg-navy text-white font-semibold"
                  : "bg-offwhite text-body hover:bg-border/60"
              }`}
            >
              {st === "all" ? "All Orders" : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search order #, customer, hotel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offwhite px-3 py-2 pl-8 rounded border border-border focus:border-teal text-xs"
          />
          <Search className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-md border border-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-offwhite text-body-muted border-b border-border font-medium">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Property / Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-body-muted">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const replyText = `Hello ${order.customer?.name || "Customer"}, regarding your Crystal Clean Order #${order.order_code}:`;
                  const replyUrl = buildWhatsAppUrl(order.customer?.phone || "", replyText);

                  return (
                    <tr key={order.id} className="hover:bg-offwhite/50">
                      <td className="px-4 py-3.5 font-mono font-bold text-navy">
                        #{order.order_code}
                      </td>
                      <td className="px-4 py-3.5 text-body-muted">
                        {formatShortDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-navy block">
                          {order.customer?.hotel_name || order.customer?.name}
                        </span>
                        <span className="text-[11px] text-body-muted">
                          {order.customer?.name} ({order.customer?.customer_code})
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        {order.customer?.phone}
                      </td>
                      <td className="px-4 py-3.5">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-navy">
                        {formatInrCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Link
                          href={`/admin/orders/${order.id || order.order_code}`}
                          className="inline-flex items-center gap-1 text-teal hover:underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-700 hover:underline font-medium"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
