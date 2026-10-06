"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, MessageSquare, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SettingsState } from "@/lib/types";

interface HeaderProps {
  settings: SettingsState;
}

export default function Header({ settings }: HeaderProps) {
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "All Products", href: "/products" },
    { label: "Hygiene & Toiletries", href: "/products?category=hygiene-toiletries" },
    { label: "Guest Amenities", href: "/products?category=guest-room-amenities" },
    { label: "Cleaning Supplies", href: "/products?category=cleaning-supplies" },
    { label: "Housekeeping", href: "/products?category=housekeeping-essentials" },
    { label: "Custom Branding", href: "/custom-order", highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-navy hover:text-teal focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex flex-col group py-1">
            <span className="font-serif text-2xl sm:text-[28px] text-navy tracking-tight leading-none group-hover:text-teal transition-colors">
              {settings.business_name || "Crystal Clean"}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-body-muted font-medium mt-1">
              Hotel Amenities & Hygiene
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-medium text-body">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors py-1 hover:text-teal ${
                  link.highlight
                    ? "text-teal font-semibold flex items-center gap-1.5"
                    : "hover:border-b hover:border-teal"
                }`}
              >
                {link.highlight && <Sparkles className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search amenities, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-60 xl:w-72 bg-offwhite text-sm text-body px-3.5 py-2 pl-9 rounded border border-border focus:outline-none focus:border-teal focus:bg-white transition-all placeholder:text-body-muted text-[13px]"
              />
              <Search className="w-4 h-4 text-body-muted absolute left-3 pointer-events-none" strokeWidth={1.5} />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-navy hover:text-teal"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 text-navy hover:text-teal transition-colors flex items-center justify-center"
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-teal text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Request a Quote CTA */}
            <Link
              href="/custom-order"
              className="hidden sm:inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-[13px] font-medium px-4 py-2.5 rounded border border-navy transition-colors tracking-wide"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Bulk Inquiry</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search shampoo, towel, soap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-offwhite text-sm px-4 py-2.5 pl-10 rounded border border-border focus:outline-none focus:border-teal"
              />
              <Search className="w-4 h-4 text-body-muted absolute left-3.5 top-3.5" strokeWidth={1.5} />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[116px] z-50 bg-white border-t border-border p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <p className="text-xs uppercase font-bold tracking-widest text-body-muted pb-2 border-b border-border">
              Product Categories
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-navy hover:text-teal py-2 border-b border-border/50"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 space-y-2 text-sm text-body-muted">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-navy"
              >
                About Crystal Clean
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-navy"
              >
                Track Your Order
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-navy"
              >
                Contact & Support
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            <Link
              href="/custom-order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block bg-teal hover:bg-teal-dark text-white font-medium py-3 rounded text-sm tracking-wide"
            >
              Start a Custom Branded Order
            </Link>
            <p className="text-xs text-center text-body-muted">
              Direct Phone Support: {settings.phone}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
