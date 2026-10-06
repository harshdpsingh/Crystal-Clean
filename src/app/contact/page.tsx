import React from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, MessageSquare, Clock, FileText } from "lucide-react";
import { getSettings } from "@/lib/supabase/admin";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact & Institutional Sales Desk | Crystal Clean",
  description:
    "Get in touch with Crystal Clean hotel amenities sales office. Direct WhatsApp ordering, bulk quote inquiries, and dispatch coordination.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Crystal Clean, I am contacting you from your website for hotel amenities inquiry."
  );

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Sales & Support Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Contact Crystal Clean
          </h1>
          <p className="text-xs sm:text-sm text-body-muted leading-relaxed">
            Our institutional sales coordinators and dispatch managers are available Monday through Saturday to assist with quotes, sample dispatches, and active shipments.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Direct WhatsApp Box */}
          <div className="p-8 bg-offwhite rounded-md border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-teal-subtle text-teal rounded-md flex items-center justify-center border border-teal/20">
                <MessageSquare className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-2xl text-navy">
                WhatsApp Purchase Desk
              </h2>
              <p className="text-xs sm:text-sm text-body leading-relaxed">
                Fastest channel for live stock confirmation, bulk quote negotiations, sample requests, and instant invoice copies.
              </p>
              <div className="text-xs text-navy font-mono font-bold bg-white p-3 rounded border border-border">
                WhatsApp: +{settings.whatsapp_number}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0E7C86] hover:bg-[#0A5D65] text-white font-medium py-3.5 px-6 rounded text-xs transition-colors border border-[#0A5D65]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open WhatsApp Conversation</span>
            </a>
          </div>

          {/* Operational Details Box */}
          <div className="p-8 bg-white rounded-md border border-border space-y-6 shadow-subtle">
            <h2 className="font-serif text-xl text-navy pb-3 border-b border-border">
              Commercial Details & Address
            </h2>

            <ul className="space-y-4 text-xs text-body">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <strong className="text-navy block font-semibold mb-0.5">Manufacturing & Dispatch Facility:</strong>
                  <span>{settings.address}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <strong className="text-navy block font-semibold mb-0.5">Telephone Support:</strong>
                  <span>{settings.phone}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <strong className="text-navy block font-semibold mb-0.5">Official Invoicing Email:</strong>
                  <span>{settings.email}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-teal shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <strong className="text-navy block font-semibold mb-0.5">Desk Hours:</strong>
                  <span>Monday – Saturday: 9:30 AM – 7:00 PM IST</span>
                </div>
              </li>

              {settings.gst_number && (
                <li className="pt-2 border-t border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
                  <span>GSTIN: <strong className="font-mono text-navy">{settings.gst_number}</strong></span>
                </li>
              )}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
