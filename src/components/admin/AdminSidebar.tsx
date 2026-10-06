"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Sparkles,
  Tag,
  Star,
  Settings,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Custom Inquiries", href: "/admin/custom-requests", icon: Sparkles },
    { label: "Coupons & Offers", href: "/admin/discounts", icon: Tag },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-navy text-white flex flex-col justify-between h-full min-h-screen border-r border-navy-light">
      <div className="p-6">
        {/* Brand */}
        <div className="pb-6 border-b border-navy-light/60">
          <Link href="/admin" className="block">
            <span className="font-serif text-xl text-white tracking-tight block">
              Crystal Clean
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gold-light font-medium">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded transition-colors ${
                  isActive
                    ? "bg-teal text-white font-semibold"
                    : "text-white/70 hover:bg-navy-light hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public website */}
      <div className="p-6 border-t border-navy-light/60">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-white/60 hover:text-teal transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
