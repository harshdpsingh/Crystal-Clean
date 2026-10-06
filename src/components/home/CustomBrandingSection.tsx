import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CustomBrandingSection() {
  const steps = [
    {
      num: "01",
      title: "Share your logo & specifications",
      description: "Upload your property logo (PDF/PNG) and choose bottle shapes, cap finishes, and fragrance notes.",
    },
    {
      num: "02",
      title: "Approve the digital & physical sample",
      description: "Receive a 3D digital mockup within 24 hours. Pre-production physical samples dispatched on request.",
    },
    {
      num: "03",
      title: "Batch manufacturing & QC inspection",
      description: "Precision screen printing, gold hot foil stamping, and rigorous leakage checks on automated filling lines.",
    },
    {
      num: "04",
      title: "Scheduled pan-India delivery",
      description: "Heavy-duty carton packaging with tamper seals delivered straight to your hotel receiving dock.",
    },
  ];

  return (
    <section className="py-20 bg-offwhite border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-border shadow-card bg-white">
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                alt="Customized branded hotel toiletries with hotel logo"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-navy/90 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-light" strokeWidth={1.5} />
                <span>Private Label Manufacturing</span>
              </div>
            </div>
          </div>

          {/* Right Content & Numbered Process */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
                Private Labeling & Customization
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-navy">
                Elevate Guest Experience with Custom Branded Amenities
              </h2>
            </div>

            <p className="text-body text-sm sm:text-base leading-relaxed">
              We customize shampoo bottles, soaps, dental kits, slippers, and laundry bags with your hotel&apos;s exact logo, color palette, and bespoke fragrances. Low minimum order quantities starting from 500 units for branded batches.
            </p>

            {/* Numbered Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {steps.map((step) => (
                <div key={step.num} className="space-y-1.5 border-l-2 border-teal pl-3.5">
                  <span className="font-mono text-xs font-bold text-teal block">
                    {step.num}
                  </span>
                  <h3 className="font-serif text-base font-medium text-navy">
                    {step.title}
                  </h3>
                  <p className="text-xs text-body-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/custom-order"
                className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-medium px-6 py-3.5 rounded text-sm transition-colors border border-teal-dark tracking-wide"
              >
                <span>Start a Custom Order Inquiry</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
