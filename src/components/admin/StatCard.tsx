import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-md border border-border p-5 space-y-3 shadow-subtle flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-wider text-body-muted">
          {label}
        </span>
        <div className="w-8 h-8 rounded bg-teal-subtle text-teal flex items-center justify-center border border-teal/20">
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
      </div>

      <div>
        <span className="font-serif text-2xl sm:text-3xl font-bold text-navy block">
          {value}
        </span>
        {sublabel && (
          <p className="text-[11px] text-body-muted mt-1">{sublabel}</p>
        )}
        {trend && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-teal bg-teal-subtle px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
