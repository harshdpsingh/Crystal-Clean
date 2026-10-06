import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions of Commercial Supply | Crystal Clean",
  description: "Terms and conditions of sale, minimum order quantities, bulk rates, and dispatch policies.",
};

export default function TermsPage() {
  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-body leading-relaxed">
        
        <div className="pb-6 border-b border-border">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
            Commercial Agreement
          </span>
          <h1 className="font-serif text-3xl text-navy">
            Terms & Conditions of Supply
          </h1>
          <p className="text-xs text-body-muted mt-1">
            Effective from: October 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            1. Ordering & Payment Terms
          </h2>
          <p>
            Crystal Clean operates on an institutional B2B basis. Orders placed on this website generate an automated order reference transmitted to our WhatsApp desk. No online credit card or UPI payment is processed on the website. Payments are accepted via RTGS/NEFT/Bank Transfer against an official pro-forma invoice issued prior to dispatch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            2. Minimum Order Quantities (MOQ)
          </h2>
          <p>
            Standard products carry defined MOQs (typically 100 units for toiletries and guest supplies; 2 cans for 5L chemical concentrates). Custom branded private label items carry a minimum production run of 500 units per item.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            3. Goods & Services Tax (GST)
          </h2>
          <p>
            All catalog prices are exclusive of applicable GST (18% on toiletries and hygiene products; 12% or 18% on linen and chemical concentrates). An itemized GST invoice with HSN codes will be generated for every commercial order.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            4. Freight & Delivery
          </h2>
          <p>
            Freight is charged at actuals based on consignment weight, volume, and destination pincode. Standard delivery timelines are 2-4 business days for major metropolitan areas and 4-7 business days for non-metro and hill stations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            5. Damage & Batch Inspection
          </h2>
          <p>
            Any transit damage or quantity discrepancy must be reported within 48 hours of shipment delivery with photographic evidence on our WhatsApp desk for immediate replacement or credit note issuance.
          </p>
        </section>

      </div>
    </div>
  );
}
