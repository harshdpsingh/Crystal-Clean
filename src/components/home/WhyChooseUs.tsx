import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      title: "Consistent Batch Quality",
      fact: "Every batch of toiletries and housekeeping chemicals undergoes rigorous viscosity, pH balance, and drop-leak testing before dispatch.",
      metric: "99.8% Batch Consistency Rate",
    },
    {
      title: "Direct Tiered Wholesale Pricing",
      fact: "Transparent pricing tiers starting from 100 units. No distributor middle-margins, allowing maximum cost savings on your monthly OPEX.",
      metric: "Save 15% - 25% on Master Cartons",
    },
    {
      title: "Dispatch Within 2-4 Business Days",
      fact: "Standard inventory maintained in New Delhi for immediate packaging and reliable logistics tracking across all Indian states.",
      metric: "Pan-India Surface & Express Cargo",
    },
    {
      title: "Dedicated WhatsApp Purchase Desk",
      fact: "No complicated vendor portals. Submit orders, request custom quotes, and get real-time tracking updates directly on WhatsApp.",
      metric: "< 15 Min Response Time",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
            Institutional Advantages
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy">
            Why Hospitality Purchase Managers Rely on Crystal Clean
          </h2>
        </div>

        {/* Factual Table-Like Grid */}
        <div className="border border-border rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border bg-white shadow-subtle">
          {points.map((pt, idx) => (
            <div key={idx} className={`p-8 space-y-3 ${idx >= 2 ? "md:border-t md:border-border" : ""}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal shrink-0" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-semibold text-navy">
                  {pt.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-body leading-relaxed">
                {pt.fact}
              </p>
              <div className="pt-2">
                <span className="inline-block bg-offwhite text-navy font-mono font-medium text-[11px] px-2.5 py-1 rounded border border-border">
                  {pt.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
