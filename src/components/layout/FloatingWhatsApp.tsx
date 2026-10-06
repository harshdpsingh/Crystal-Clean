"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export default function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
  const defaultText = "Hello Crystal Clean, I am interested in inquiring about hotel amenities and bulk pricing.";
  const url = buildWhatsAppUrl(whatsappNumber || "919876543210", defaultText);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 bg-[#0E7C86] hover:bg-[#0A5D65] text-white px-4 py-3 rounded-md shadow-card border border-[#0A5D65] transition-all hover:scale-[1.02] duration-200"
      aria-label="Chat with Crystal Clean Sales on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-[#0E7C86]" strokeWidth={1.5} />
      <span className="text-xs font-semibold tracking-wide">Quick WhatsApp Desk</span>
    </a>
  );
}
