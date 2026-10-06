import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, ShieldCheck, Truck, Layers, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SettingsState } from "@/lib/types";

interface HeroProps {
  settings: SettingsState;
}

export default function Hero({ settings }: HeroProps) {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Crystal Clean, I would like to inquire about hotel amenities catalog and bulk pricing."
  );

  return (
    <section className="relative bg-navy text-white overflow-hidden border-b border-navy-light">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-navy-light/80 border border-white/10 px-3 py-1 rounded text-xs text-gold-light uppercase tracking-widest font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
              <span>Direct Commercial Supply to Hospitality</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-white tracking-tight leading-[1.15]">
              Hotel Amenities & Housekeeping Supplies for India’s Finest Properties.
            </h1>

            <p className="text-white/80 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Supplying certified guest toiletries, cleaning chemicals, and custom branded amenities to over 350 hotels, boutique resorts, and serviced apartments across India.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white font-medium px-6 py-3.5 rounded text-sm transition-colors border border-teal-dark tracking-wide"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded text-sm transition-colors border border-white/20 tracking-wide"
              >
                <MessageSquare className="w-4 h-4 text-teal-light" strokeWidth={1.5} />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Factual Trust Strip */}
            <div className="pt-8 border-t border-navy-light/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-light shrink-0" strokeWidth={1.5} />
                <span>GST Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-light shrink-0" strokeWidth={1.5} />
                <span>Tiered Bulk Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-light shrink-0" strokeWidth={1.5} />
                <span>Custom Branding</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-light shrink-0" strokeWidth={1.5} />
                <span>Pan-India Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] rounded-md overflow-hidden border border-white/15 shadow-modal">
              <Image
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80"
                alt="Crystal Clean hotel amenities luxury set"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 bg-navy/90 backdrop-blur-sm p-3.5 rounded border border-white/10 text-xs text-white">
                <p className="font-serif font-medium text-white text-sm">
                  Hospitality Grade Formulations
                </p>
                <p className="text-white/70 text-[11px] mt-0.5">
                  Paraben-free guest toiletries with tamper-evident caps and customizable bottle designs.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
