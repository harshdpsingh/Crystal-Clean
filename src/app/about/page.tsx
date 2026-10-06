import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Truck, Factory, Users, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Crystal Clean Hotel Amenities",
  description:
    "Learn about Crystal Clean, India's trusted manufacturer and institutional supplier of certified hotel toiletries, guest room amenities, and housekeeping chemicals.",
};

export default function AboutPage() {
  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-border">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            About Our Company
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Supplying India&apos;s Hospitality Industry with Uncompromising Quality
          </h1>
          <p className="text-sm sm:text-base text-body-muted leading-relaxed">
            Crystal Clean was founded to solve a persistent challenge faced by hotel purchase managers: inconsistent formulation quality, delayed dispatches, and opaque pricing in guest room amenities.
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-4 text-sm text-body leading-relaxed">
          <h2 className="font-serif text-2xl text-navy">
            Institutional Manufacturing & Distribution
          </h2>
          <p>
            Operating out of our central facility in New Delhi, Crystal Clean formulates and manufactures certified guest room toiletries, commercial cleaning chemicals, and eco-friendly guest room sets. We serve over 350 properties across 22 states, ranging from boutique heritage havelis in Rajasthan to beachfront luxury resorts in Goa and business hotels in Bengaluru.
          </p>
          <p>
            By eliminating multiple layers of intermediaries, we offer direct factory pricing tiers starting from just 100 units. Every product batch is formulated with skin-safe, paraben-free ingredients and packaged in 100% recyclable bottles or biodegradable kraft paper boxes.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-offwhite rounded-md border border-border space-y-2">
            <div className="w-10 h-10 bg-teal-subtle rounded flex items-center justify-center text-teal">
              <Factory className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-semibold text-navy">
              In-House Production & Quality Control
            </h3>
            <p className="text-xs text-body-muted leading-relaxed">
              Automated liquid filling lines with rigorous leak-testing, pH standardization, and batch viscosity monitoring.
            </p>
          </div>

          <div className="p-6 bg-offwhite rounded-md border border-border space-y-2">
            <div className="w-10 h-10 bg-teal-subtle rounded flex items-center justify-center text-teal">
              <Sparkles className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-semibold text-navy">
              Custom Private Labeling
            </h3>
            <p className="text-xs text-body-muted leading-relaxed">
              Precision screen printing and hot foil stamping for hotel logos with quick 24-hour digital sample turnarounds.
            </p>
          </div>

          <div className="p-6 bg-offwhite rounded-md border border-border space-y-2">
            <div className="w-10 h-10 bg-teal-subtle rounded flex items-center justify-center text-teal">
              <Truck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-semibold text-navy">
              Pan-India Logistics
            </h3>
            <p className="text-xs text-body-muted leading-relaxed">
              Strategic transport partnerships ensuring 2-4 day delivery windows across major tier-1, tier-2, and remote resort locations.
            </p>
          </div>

          <div className="p-6 bg-offwhite rounded-md border border-border space-y-2">
            <div className="w-10 h-10 bg-teal-subtle rounded flex items-center justify-center text-teal">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-semibold text-navy">
              GST Compliant Invoicing
            </h3>
            <p className="text-xs text-body-muted leading-relaxed">
              Full input tax credit eligibility with transparent itemized tax invoices and E-way bill compliance.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-navy text-white rounded-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl text-white">
              Ready to Upgrade Your Guest Amenities?
            </h3>
            <p className="text-xs text-white/70">
              Browse our complete catalog or request custom branding proofs.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-5 py-3 rounded transition-colors shrink-0"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </div>
  );
}
