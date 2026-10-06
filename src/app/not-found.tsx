import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="max-w-md mx-auto space-y-5">
        <span className="font-mono text-sm uppercase tracking-widest text-teal font-bold block">
          404 Error
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy">
          Amenity Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-body-muted leading-relaxed">
          The product or page you are searching for might have been relocated, discontinued, or renamed.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white text-xs font-medium px-5 py-2.5 rounded transition-colors"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            <span>Browse Products Catalog</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-offwhite hover:bg-white text-navy text-xs font-medium px-5 py-2.5 rounded border border-border transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
