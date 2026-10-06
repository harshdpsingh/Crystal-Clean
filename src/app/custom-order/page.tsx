"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, MessageSquare, Upload, CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { isValidIndianPhone } from "@/lib/utils";

function CustomOrderForm() {
  const searchParams = useSearchParams();
  const prefilledProduct = searchParams?.get("product") || "";
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [phone, setPhone] = useState("");
  const [productType, setProductType] = useState(prefilledProduct || "Custom 30ml Toiletries Set (Shampoo, Lotion, Soap)");
  const [quantity, setQuantity] = useState(500);
  const [details, setDetails] = useState("");
  const [fileName, setFileName] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File exceeds 5 MB limit. Please upload a smaller file.", "error");
      return;
    }

    setFileName(file.name);

    // Read preview/base64
    const reader = new FileReader();
    reader.onload = () => {
      setLogoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidIndianPhone(phone)) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    if (quantity < 100) {
      showToast("Minimum custom inquiry quantity is 100 units.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          hotel_name: hotelName.trim(),
          phone: phone.trim(),
          product_type: productType.trim(),
          quantity,
          details: details.trim() || undefined,
          logo_url: fileName ? `[Attached: ${fileName}]` : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setWhatsappRedirectUrl(data.whatsappUrl);
        showToast("Inquiry saved! Redirecting to WhatsApp sales desk...", "success");

        if (data.whatsappUrl) {
          setTimeout(() => {
            window.open(data.whatsappUrl, "_blank");
          }, 800);
        }
      } else {
        showToast(data.message || "Failed to submit inquiry.", "error");
      }
    } catch {
      showToast("Error connecting to server. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-md border border-border p-6 sm:p-8 shadow-card">
          <div className="pb-6 border-b border-border">
            <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
              Private Label Desk
            </span>
            <h1 className="font-serif text-3xl text-navy">
              Custom Branded Amenities Inquiry
            </h1>
            <p className="text-xs sm:text-sm text-body-muted mt-1">
              Submit your property logo and required specifications. We share 3D sample proofs and direct factory bulk estimates on WhatsApp.
            </p>
          </div>

          {isSuccess ? (
            <div className="pt-8 text-center space-y-4">
              <div className="w-16 h-16 bg-teal-subtle rounded-full flex items-center justify-center mx-auto text-teal border border-teal/30">
                <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-2xl text-navy">
                Inquiry Successfully Logged
              </h2>
              <p className="text-xs sm:text-sm text-body-muted max-w-md mx-auto">
                Your custom branding requirements have been saved in our system. You can now chat directly with our design and production desk on WhatsApp.
              </p>
              {whatsappRedirectUrl && (
                <div className="pt-4">
                  <a
                    href={whatsappRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0E7C86] hover:bg-[#0A5D65] text-white text-xs font-semibold px-6 py-3 rounded transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Chat Again</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pt-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:outline-none focus:border-teal text-body text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Hotel / Resort / Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Heritage Palace"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:outline-none focus:border-teal text-body text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    WhatsApp Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9829012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:outline-none focus:border-teal text-body text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Estimated Batch Quantity (Units) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    placeholder="500"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 100)}
                    className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:outline-none focus:border-teal text-body text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Product Type or Amenity Kit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30ml Shampoo in frosted bottle with gold hot-foil logo"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:outline-none focus:border-teal text-body text-xs"
                />
              </div>

              {/* Logo upload container */}
              <div>
                <label className="block font-medium text-navy mb-1">
                  Attach Property Logo / Artwork <span className="text-body-muted font-normal">(PNG, JPG, PDF - Max 5 MB)</span>
                </label>
                <div className="border border-dashed border-border rounded-md p-4 bg-offwhite/50 text-center space-y-2 relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, application/pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-5 h-5 text-teal mx-auto" strokeWidth={1.5} />
                  {fileName ? (
                    <div className="flex items-center justify-center gap-1.5 text-teal font-medium">
                      <FileCheck className="w-4 h-4" />
                      <span>{fileName}</span>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-navy">Click or drag & drop property logo here</p>
                      <p className="text-[11px] text-body-muted">Vector PDF or high-resolution PNG recommended</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Packaging, Color Scheme & Fragrance Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. White caps, matte finish bottles, Lemongrass & Bergamot fragrance notes, delivery needed within 15 days."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:outline-none focus:border-teal text-body text-xs resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0E7C86] hover:bg-[#0A5D65] text-white font-semibold py-3.5 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors border border-[#0A5D65]"
                >
                  <Sparkles className="w-4 h-4 text-gold-light" strokeWidth={1.5} />
                  <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry & Chat on WhatsApp"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Capabilities & Process */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-offwhite rounded-md border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold text-navy pb-2 border-b border-border">
              Private Label Capabilities
            </h2>

            <ul className="space-y-3 text-xs text-body">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <span><strong>Multi-Color Screen Printing:</strong> High-adhesion UV inks that never fade or peel in humid bathroom environments.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <span><strong>Hot Foil Stamping:</strong> Metallic Gold, Rose Gold, and Silver foil for 4-star and 5-star boutique properties.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <span><strong>Custom Fragrance Profiling:</strong> Over 15 signature fragrances (Green Tea, Vanilla Sandalwood, Jasmine, French Lavender).</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                <span><strong>Sustainable Packaging:</strong> Biodegradable kraft boxes, bamboo accessories, and 100% recyclable rPET bottles.</span>
              </li>
            </ul>

            <div className="p-4 bg-white rounded border border-border space-y-1 text-xs">
              <p className="font-serif font-semibold text-navy">
                Fast Turnaround Time
              </p>
              <p className="text-[11px] text-body-muted">
                Digital mockups within 24 hours. Pre-production sample dispatch within 3 business days. Batch production in 7-10 days.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-site mx-auto px-4 py-20 text-center text-xs text-body-muted">
          Loading custom branding desk...
        </div>
      }
    >
      <CustomOrderForm />
    </Suspense>
  );
}
