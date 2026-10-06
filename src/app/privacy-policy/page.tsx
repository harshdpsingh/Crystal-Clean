import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Crystal Clean Hotel Amenities",
  description: "Privacy policy and data governance practices of Crystal Clean.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-body leading-relaxed">
        
        <div className="pb-6 border-b border-border">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
            Data Governance
          </span>
          <h1 className="font-serif text-3xl text-navy">
            Privacy Policy
          </h1>
          <p className="text-xs text-body-muted mt-1">
            Last updated: October 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            1. Overview & Information We Collect
          </h2>
          <p>
            Crystal Clean operates as a B2B supplier for hotels, resorts, and commercial institutions. We do not require customer accounts or passwords. When you place an order or submit a custom branding inquiry, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-body">
            <li>Contact person name and hotel/business property name</li>
            <li>10-digit mobile number for WhatsApp dispatch coordination</li>
            <li>Physical delivery address, city, and PIN code</li>
            <li>GSTIN registration number (when provided for tax credit)</li>
            <li>Uploaded logo artwork files for custom branding production</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            2. How Information is Used
          </h2>
          <p>
            Your information is used strictly to fulfill commercial orders, generate official tax invoices, schedule logistics freight, and provide order status tracking. We do not sell, rent, or trade customer contact details to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            3. Order Privacy & Status Tracking
          </h2>
          <p>
            Customer purchase history and past delivery addresses are never exposed to the public. The public order status lookup tool requires both the unique Order Reference ID and the registered mobile number, and reveals strictly the current fulfillment status (e.g. New, Packed, Shipped, Delivered) without exposing financial totals or addresses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-navy">
            4. Local Browser Storage
          </h2>
          <p>
            For your convenience, our website saves your hotel name and delivery details in your browser&apos;s local storage (localStorage) so you don&apos;t have to re-enter them on recurring orders. You can clear this anytime by clearing your browser cookies and site data.
          </p>
        </section>

      </div>
    </div>
  );
}
