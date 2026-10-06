import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/supabase/admin";
import StatCard from "@/components/admin/StatCard";
import { formatInrCurrency, formatShortDate } from "@/lib/utils";

export const revalidate = 0; // Dynamic admin stats

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const getStatusBadge = (status: string) => {
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Commercial Supply Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
          >
            <span>Manage Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Orders Today"
          value={stats.ordersTodayCount}
          sublabel={`${stats.ordersThisMonthCount} total orders this month`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Revenue This Month"
          value={formatInrCurrency(stats.revenueThisMonth)}
          sublabel="Excluding cancelled/rejected orders"
          icon={TrendingUp}
          trend="+18.4% vs last month"
        />
        <StatCard
          label="Active Hotel Clients"
          value={stats.newCustomersCount}
          sublabel="Properties with verified GSTIN"
          icon={Users}
        />
        <StatCard
          label="Low Stock Warnings"
          value={stats.lowStockProducts.length}
          sublabel="Products below 500 units"
          icon={AlertTriangle}
        />
      </div>

      {/* Two Column Layout: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-md border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-serif text-base font-semibold text-navy">
              Latest Hospital & Hotel Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-teal hover:underline font-medium"
            >
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-offwhite text-body-muted border-b border-border font-medium">
                <tr>
                  <th className="px-3 py-2.5">Order ID</th>
                  <th className="px-3 py-2.5">Customer / Property</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Total Amount</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-offwhite/50">
                    <td className="px-3 py-3 font-mono font-bold text-navy">
                      #{order.order_code}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-navy block">
                        {order.customer?.name || "Customer"}
                      </span>
                      <span className="text-[11px] text-body-muted">
                        {order.customer?.hotel_name || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-3 py-3 font-mono font-semibold text-navy">
                      {formatInrCurrency(order.total)}
                    </td>
                    <td className="px-3 py-3 text-body-muted">
                      {formatShortDate(order.created_at)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id || order.order_code}`}
                        className="text-teal hover:underline font-medium"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Low Stock Alerts & Quick Tools */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Low Stock Widget */}
          <div className="bg-white rounded-md border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-serif text-base font-semibold text-navy flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Low Inventory Watch</span>
              </h2>
              <span className="text-xs font-mono font-bold text-amber-600">
                {stats.lowStockProducts.length} Items
              </span>
            </div>

            <div className="space-y-3">
              {stats.lowStockProducts.slice(0, 5).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2.5 bg-offwhite rounded border border-border text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-navy truncate">{prod.name}</p>
                    <span className="text-[10px] font-mono text-body-muted">SKU: {prod.sku}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-red-600 font-bold font-mono block">
                      {prod.stock} units
                    </span>
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="text-[10px] text-teal hover:underline"
                    >
                      Update Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Custom Order Shortcut */}
          <div className="bg-navy text-white rounded-md p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-light" />
              <h3 className="font-serif text-base text-white">
                Custom Branding Desk
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Review new property logo submissions and update production statuses.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/custom-requests"
                className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                <span>View Custom Inquiries</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
