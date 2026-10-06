"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  ShieldCheck,
  Building,
  User,
  Phone,
  MapPin,
  Mail,
  FileText,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  formatInrCurrency,
  isValidIndianPhone,
  isValidIndianPincode,
  isValidGst,
  get10DigitPhone,
} from "@/lib/utils";

const PROFILE_STORAGE_KEY = "crystal_clean_checkout_profile_v1";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, total, totalItems, appliedDiscount, clearCart, isLoaded } = useCart();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Restore saved profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.name) setName(p.name);
        if (p.hotelName) setHotelName(p.hotelName);
        if (p.phone) setPhone(get10DigitPhone(p.phone));
        if (p.email) setEmail(p.email);
        if (p.address) setAddress(p.address);
        if (p.city) setCity(p.city);
        if (p.pincode) setPincode(p.pincode);
        if (p.gstNumber) setGstNumber(p.gstNumber);
      }
    } catch (e) {
      console.error("Failed to restore profile:", e);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="max-w-site mx-auto px-4 py-20 text-center text-xs text-body-muted">
        Preparing checkout desk...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-site mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-navy">Your Cart is Empty</h1>
        <p className="text-xs text-body-muted">Add items before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-block bg-teal text-white text-xs font-medium px-5 py-2.5 rounded"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!name.trim()) errors.name = "Full name is required";
    if (!hotelName.trim()) errors.hotelName = "Hotel or business name is required";

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!isValidIndianPhone(phone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 9829012345)";
    }

    if (!address.trim()) errors.address = "Delivery address is required";
    if (!city.trim()) errors.city = "City is required";

    if (!pincode.trim()) {
      errors.pincode = "PIN code is required";
    } else if (!isValidIndianPincode(pincode)) {
      errors.pincode = "Enter a valid 6-digit PIN code";
    }

    if (gstNumber.trim() && !isValidGst(gstNumber)) {
      errors.gstNumber = "Enter a valid 15-character GSTIN (e.g. 07AAAAA0000A1Z5)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please correct the errors in the form before proceeding.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Call server API to validate prices and record order in DB
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          hotel_name: hotelName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          gst_number: gstNumber.trim() || undefined,
          notes: notes.trim() || undefined,
          coupon_code: appliedDiscount?.coupon_code || undefined,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Could not process order.", "error");
        setIsSubmitting(false);
        return;
      }

      // 2. Save profile in localStorage for next time
      try {
        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify({
            name: name.trim(),
            hotelName: hotelName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: address.trim(),
            city: city.trim(),
            pincode: pincode.trim(),
            gstNumber: gstNumber.trim(),
          })
        );
      } catch (e) {
        console.error("Storage error:", e);
      }

      // 3. Clear cart
      clearCart();

      // 4. Open WhatsApp in new tab / redirect
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }

      // 5. Navigate to order confirmation page
      router.push(`/order-success/${data.orderCode}`);
    } catch (err: any) {
      console.error("Checkout submit error:", err);
      showToast("Failed to connect to order desk. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
          Final Step
        </span>
        <h1 className="font-serif text-3xl text-navy">
          Hotel Delivery Details & WhatsApp Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-body-muted mt-1">
          No online payment is charged. Your order will be sent to our sales desk via WhatsApp for pro-forma invoicing.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7 bg-white rounded-md border border-border p-6 sm:p-8 shadow-subtle">
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            
            {/* Commercial Profile */}
            <div className="space-y-4">
              <h2 className="font-serif text-base font-semibold text-navy flex items-center gap-2 pb-2 border-b border-border">
                <Building className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span>Property & Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-offwhite px-3 py-2.5 pl-8 rounded border text-body text-xs focus:outline-none focus:bg-white ${
                        validationErrors.name ? "border-red-500" : "border-border focus:border-teal"
                      }`}
                    />
                    <User className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-3" strokeWidth={1.5} />
                  </div>
                  {validationErrors.name && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Hotel / Resort / Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunrise Luxury Inn"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className={`w-full bg-offwhite px-3 py-2.5 pl-8 rounded border text-body text-xs focus:outline-none focus:bg-white ${
                        validationErrors.hotelName ? "border-red-500" : "border-border focus:border-teal"
                      }`}
                    />
                    <Building className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-3" strokeWidth={1.5} />
                  </div>
                  {validationErrors.hotelName && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.hotelName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-2.5 text-body-muted text-xs font-mono font-medium">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9829012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      className={`w-full bg-offwhite px-3 py-2.5 pl-11 rounded border text-body text-xs font-mono focus:outline-none focus:bg-white ${
                        validationErrors.phone ? "border-red-500" : "border-border focus:border-teal"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-body-muted block mt-0.5">
                    Order copy and tracking will be linked to this number.
                  </span>
                  {validationErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Email Address <span className="text-body-muted font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="purchase@hotel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-offwhite px-3 py-2.5 pl-8 rounded border border-border focus:border-teal text-body text-xs focus:outline-none focus:bg-white"
                    />
                    <Mail className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-3" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h2 className="font-serif text-base font-semibold text-navy flex items-center gap-2 pb-2 border-b border-border">
                <MapPin className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span>Receiving & Delivery Address</span>
              </h2>

              <div className="text-xs">
                <label className="block font-medium text-navy mb-1">
                  Full Street Address / Receiving Gate <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street name, landmark, hotel dock or receiving area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full bg-offwhite px-3 py-2 rounded border text-body text-xs focus:outline-none focus:bg-white resize-none ${
                    validationErrors.address ? "border-red-500" : "border-border focus:border-teal"
                  }`}
                />
                {validationErrors.address && (
                  <p className="text-[11px] text-red-600 mt-1">{validationErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full bg-offwhite px-3 py-2.5 rounded border text-body text-xs focus:outline-none focus:bg-white ${
                      validationErrors.city ? "border-red-500" : "border-border focus:border-teal"
                    }`}
                  />
                  {validationErrors.city && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 302002"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                    className={`w-full bg-offwhite px-3 py-2.5 rounded border text-body text-xs font-mono focus:outline-none focus:bg-white ${
                      validationErrors.pincode ? "border-red-500" : "border-border focus:border-teal"
                    }`}
                  />
                  {validationErrors.pincode && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Tax & Notes */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h2 className="font-serif text-base font-semibold text-navy flex items-center gap-2 pb-2 border-b border-border">
                <FileText className="w-4 h-4 text-teal" strokeWidth={1.5} />
                <span>GSTIN & Special Instructions</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    GSTIN Number <span className="text-body-muted font-normal">(For Tax Credit)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="07AAAAA0000A1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    className={`w-full bg-offwhite px-3 py-2.5 rounded border text-body text-xs font-mono uppercase focus:outline-none focus:bg-white ${
                      validationErrors.gstNumber ? "border-red-500" : "border-border focus:border-teal"
                    }`}
                  />
                  {validationErrors.gstNumber && (
                    <p className="text-[11px] text-red-600 mt-1">{validationErrors.gstNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Special Packaging / Delivery Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deliver before 12 PM, deliver to back dock"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-offwhite px-3 py-2.5 rounded border border-border focus:border-teal text-body text-xs focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-border space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0E7C86] hover:bg-[#0A5D65] text-white font-semibold py-4 px-6 rounded-md text-sm flex items-center justify-center gap-2.5 transition-all shadow-subtle tracking-wide disabled:opacity-70"
              >
                <MessageSquare className="w-5 h-5 text-white" strokeWidth={1.5} />
                <span>{isSubmitting ? "Generating WhatsApp Order..." : "Place Order on WhatsApp"}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-body-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-teal" strokeWidth={1.5} />
                <span>Your order is registered immediately on server before redirecting to WhatsApp.</span>
              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Order Preview Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-offwhite rounded-md border border-border p-6 space-y-4">
            <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-body-muted font-normal">
                {items.length} {items.length === 1 ? "Product" : "Products"} ({totalItems} Units)
              </span>
            </h2>

            {/* Line item snippets */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-border/60 text-xs">
              {items.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-navy line-clamp-1">{item.product.name}</p>
                    <p className="text-[11px] text-body-muted">
                      {item.quantity} units @ {formatInrCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-navy shrink-0">
                    {formatInrCurrency(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex items-center justify-between text-body">
                <span>Subtotal</span>
                <span className="font-mono">{formatInrCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-teal font-medium">
                  <span>Discount ({appliedDiscount?.coupon_code})</span>
                  <span className="font-mono">-{formatInrCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-baseline justify-between">
                <span className="font-serif text-base font-semibold text-navy">
                  Grand Total
                </span>
                <span className="font-serif text-2xl font-bold text-navy">
                  {formatInrCurrency(total)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[11px] text-body-muted">
              <p>
                <strong>Auto-fill enabled:</strong> Your hotel name and address are saved locally in this browser for quick 1-click reorders.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
