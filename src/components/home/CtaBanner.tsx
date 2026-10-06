import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SettingsState } from "@/lib/types";

interface CtaBannerProps {
  settings: SettingsState;
}

export default function CtaBanner({ settings }: CtaBannerProps) {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    "Hello Crystal Clean, I would like to request a bulk quote for hotel supplies."
  );

  return (
    <section className="bg-navy py-16 text-white border-b border-navy-light">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-xl space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white">
              Need a Customized Bulk Quotation?
            </h2>
            <p className="text-white/70 text-sm sm:text-base">
              Speak with our direct institutional sales desk on WhatsApp. We share pricing estimates and artwork mockups within the hour.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-medium px-6 py-3.5 rounded text-sm transition-colors border border-teal-dark tracking-wide"
            >
              <MessageSquare className="w-4 h-4 text-white" strokeWidth={1.5} />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href="/custom-order"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded text-sm transition-colors border border-white/20 tracking-wide"
            >
              <span>Submit Custom Form</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
