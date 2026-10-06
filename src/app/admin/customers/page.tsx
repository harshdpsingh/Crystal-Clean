"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Download,
  Building,
  Phone,
  Tag,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Customer } from "@/lib/types";
import { INITIAL_CUSTOMERS, INITIAL_ORDERS } from "@/lib/mockData";
import { formatInrCurrency, formatShortDate } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCustId, setExpandedCustId] = useState<string | null>(null);

  const filtered = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.customer_code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.hotel_name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const exportCustomersCsv = () => {
    const headers = [
      "Customer Code",
      "Name",
      "Hotel/Property",
      "Phone",
      "Email",
      "Address",
      "City",
      "Pincode",
      "GSTIN",
      "Tag",
      "Total Orders",
      "Total Spent",
    ];

    const rows = filtered.map((c) => [
      c.customer_code,
      `"${c.name}"`,
      `"${c.hotel_name}"`,
      c.phone,
      c.email || "-",
      `"${c.address}"`,
      c.city,
      c.pincode,
      c.gst_number || "-",
      c.tag,
      c.total_orders,
      c.total_spent,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CrystalClean_Customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCustomerOrders = (customerId: string) => {
    return INITIAL_ORDERS.filter(
      (o) => o.customer_id === customerId || o.customer?.phone === customerId
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Commercial Client Directory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Registered Hotel Accounts ({filtered.length})
          </h1>
        </div>

        <button
          onClick={exportCustomersCsv}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-offwhite text-navy text-xs font-semibold px-4 py-2 rounded border border-border transition-colors shadow-subtle"
        >
          <Download className="w-3.5 h-3.5 text-teal" />
          <span>Export Customers CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-md border border-border flex items-center justify-between shadow-subtle text-xs">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by customer ID (CUST-0001), hotel, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offwhite px-3 py-2 pl-8 rounded border border-border focus:border-teal text-xs"
          />
          <Search className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Customers List & Drilldown */}
      <div className="bg-white rounded-md border border-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-offwhite text-body-muted border-b border-border font-medium">
              <tr>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Hotel / Property</th>
                <th className="px-4 py-3">Contact Person</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Orders & Spend</th>
                <th className="px-4 py-3 text-right">Order History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((cust) => {
                const isExpanded = expandedCustId === cust.id;
                const custOrders = getCustomerOrders(cust.id);
                const chatUrl = buildWhatsAppUrl(cust.phone, `Hello ${cust.name}, Crystal Clean sales desk here:`);

                return (
                  <React.Fragment key={cust.id}>
                    <tr className="hover:bg-offwhite/50">
                      <td className="px-4 py-3.5 font-mono font-bold text-navy">
                        {cust.customer_code}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-navy block">
                          {cust.hotel_name}
                        </span>
                        <span className="text-[11px] text-body-muted">
                          {cust.city}, {cust.pincode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-navy block">{cust.name}</span>
                        {cust.gst_number && (
                          <span className="text-[10px] font-mono text-body-muted">
                            GST: {cust.gst_number}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        <a
                          href={chatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal hover:underline flex items-center gap-1"
                        >
                          <span>{cust.phone}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            cust.tag === "VIP"
                              ? "bg-gold-subtle text-gold-dark border border-gold/40"
                              : cust.tag === "Bulk buyer"
                              ? "bg-teal-subtle text-teal-dark border border-teal/30"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {cust.tag}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-navy block">
                          {formatInrCurrency(cust.total_spent)}
                        </span>
                        <span className="text-[11px] text-body-muted">
                          {cust.total_orders} {cust.total_orders === 1 ? "order" : "orders"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setExpandedCustId(isExpanded ? null : cust.id)}
                          className="inline-flex items-center gap-1 text-teal hover:underline font-semibold"
                        >
                          <span>{isExpanded ? "Hide" : "Orders"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Drilldown orders row */}
                    {isExpanded && (
                      <tr className="bg-offwhite/80">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-3 bg-white p-4 rounded border border-border">
                            <h3 className="font-serif text-sm font-semibold text-navy flex items-center justify-between">
                              <span>Order History for {cust.hotel_name}</span>
                              <span className="text-xs text-body-muted font-normal font-sans">
                                {cust.address}, {cust.city}
                              </span>
                            </h3>

                            {cust.notes && (
                              <p className="text-xs bg-gold-subtle p-2 rounded border border-gold/30 text-navy italic">
                                <strong>Admin Note:</strong> {cust.notes}
                              </p>
                            )}

                            {custOrders.length === 0 ? (
                              <p className="text-xs text-body-muted">No past orders in test session.</p>
                            ) : (
                              <div className="space-y-2">
                                {custOrders.map((o) => (
                                  <div
                                    key={o.id}
                                    className="flex items-center justify-between p-2.5 bg-offwhite rounded border border-border text-xs"
                                  >
                                    <div>
                                      <span className="font-mono font-bold text-navy">
                                        #{o.order_code}
                                      </span>
                                      <span className="text-body-muted ml-2">
                                        {formatShortDate(o.created_at)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="font-mono font-bold text-navy">
                                        {formatInrCurrency(o.total)}
                                      </span>
                                      <span className="bg-teal-subtle text-teal text-[10px] font-semibold px-2 py-0.5 rounded">
                                        {o.status}
                                      </span>
                                      <Link
                                        href={`/admin/orders/${o.id || o.order_code}`}
                                        className="text-teal hover:underline font-medium"
                                      >
                                        View Order &rarr;
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
