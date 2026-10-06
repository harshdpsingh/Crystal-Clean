import React from "react";

export default function ClientLogos() {
  const clients = [
    { name: "The Grand Residency", location: "Jaipur" },
    { name: "Bayview Luxury Suites", location: "Goa" },
    { name: "Silver Sands Business Hotel", location: "Pune" },
    { name: "Kovalam Heritage Retreat", location: "Kerala" },
    { name: "The Imperial Gateway", location: "Bengaluru" },
    { name: "Pinecrest Resort & Spa", location: "Shimla" },
  ];

  return (
    <section className="py-12 bg-offwhite border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-body-muted font-semibold mb-8">
          Supplying Leading Independent & Boutique Hospitality Properties
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {clients.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 bg-white/60 rounded border border-border text-center group hover:border-teal transition-colors"
            >
              <span className="font-serif text-sm font-semibold text-navy/80 group-hover:text-navy">
                {c.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-body-light mt-0.5">
                {c.location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
