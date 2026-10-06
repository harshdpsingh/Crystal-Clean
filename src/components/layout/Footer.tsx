import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, FileText, Lock } from "lucide-react";
import { SettingsState } from "@/lib/types";

interface FooterProps {
  settings: SettingsState;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white/80 border-t border-navy-light pt-16 pb-12 text-sm">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-navy-light/60">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl text-white tracking-tight">
                {settings.business_name || "Crystal Clean"}
              </span>
              <p className="text-xs uppercase tracking-[0.16em] text-gold-light mt-1 font-medium">
                {settings.tagline || "Hotel Amenities and Hygiene Supplies"}
              </p>
            </div>
            <p className="text-white/70 text-sm max-w-sm leading-relaxed">
              Trusted institutional partner for hotels, boutique resorts, service apartments, and hospitals across India. Reliable bulk supplies, transparent tiered pricing, and custom private labelling.
            </p>
            <div className="pt-2">
              <a
                href={settings.catalog_pdf_url || "/catalog/CrystalClean_Hotel_Amenities_Catalog_2026.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-navy-light hover:bg-teal px-3.5 py-2 rounded border border-white/20 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-gold-light" strokeWidth={1.5} />
                <span>Download Product Catalog (PDF)</span>
              </a>
            </div>
          </div>

          {/* Shop Col */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/products?category=hygiene-toiletries" className="hover:text-teal transition-colors">
                  Hygiene & Toiletries
                </Link>
              </li>
              <li>
                <Link href="/products?category=guest-room-amenities" className="hover:text-teal transition-colors">
                  Guest Room Amenities
                </Link>
              </li>
              <li>
                <Link href="/products?category=cleaning-supplies" className="hover:text-teal transition-colors">
                  Housekeeping Chemicals
                </Link>
              </li>
              <li>
                <Link href="/products?category=housekeeping-essentials" className="hover:text-teal transition-colors">
                  Room Supplies & Liners
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-teal transition-colors font-medium text-white/90">
                  Custom Branded Items
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-teal transition-colors">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Col */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Purchase & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/track-order" className="hover:text-teal transition-colors">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal transition-colors">
                  About Our Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-teal transition-colors">
                  Private Label Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal transition-colors">
                  Contact Sales Team
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-teal transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Commercial Contact Details */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Supply Desk
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" strokeWidth={1.5} />
                <span className="leading-snug">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
                <span className="truncate">{settings.email}</span>
              </li>
              {settings.gst_number && (
                <li className="pt-2 border-t border-navy-light/60 text-xs text-white/60">
                  GSTIN: <span className="text-white/90 font-mono font-medium">{settings.gst_number}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} {settings.business_name}. All rights reserved. Pan-India Commercial Supply.</p>
          <div className="flex items-center gap-6">
            <span>Orders processed directly via WhatsApp Sales Desk</span>
            <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3" strokeWidth={1.5} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
