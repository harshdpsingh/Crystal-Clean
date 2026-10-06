"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors shadow-subtle"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print / Save as PDF</span>
    </button>
  );
}
