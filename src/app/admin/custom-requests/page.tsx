"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  MessageSquare,
  Building,
  Phone,
  FileCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { CustomRequest, CustomRequestStatus } from "@/lib/types";
import { INITIAL_CUSTOM_REQUESTS } from "@/lib/mockData";
import { formatShortDate } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useToast } from "@/context/ToastContext";

export default function AdminCustomRequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<CustomRequest[]>(INITIAL_CUSTOM_REQUESTS);

  const updateStatus = (id: string, newStatus: CustomRequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast(`Inquiry from ${r.hotel_name} updated to "${newStatus}".`, "success");
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  const getStatusBadge = (status: CustomRequestStatus) => {
    switch (status) {
      case "New":
        return <span className="bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded text-[11px]">New</span>;
      case "Quoted":
        return <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded text-[11px]">Quoted</span>;
      case "In production":
        return <span className="bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded text-[11px]">In Production</span>;
      case "Done":
        return <span className="bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded text-[11px]">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 font-semibold px-2.5 py-1 rounded text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Private Label Pipeline
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Custom Branded Inquiries ({requests.length})
          </h1>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {requests.map((req) => {
          const chatText = `Hello ${req.name}, Crystal Clean custom design desk here regarding your inquiry for ${req.hotel_name} (${req.product_type}):`;
          const chatUrl = buildWhatsAppUrl(req.phone, chatText);

          return (
            <div
              key={req.id}
              className="bg-white rounded-md border border-border p-6 shadow-subtle space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-lg font-semibold text-navy">
                      {req.hotel_name}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-body text-xs">
                    Contact: <strong>{req.name}</strong> | Phone: <strong className="font-mono">{req.phone}</strong> | Submitted on: {formatShortDate(req.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#0E7C86] hover:bg-[#0A5D65] text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2 bg-offwhite p-4 rounded border border-border">
                  <p>
                    <strong className="text-navy">Requested Product Type:</strong>{" "}
                    <span>{req.product_type}</span>
                  </p>
                  <p>
                    <strong className="text-navy">Target Batch Volume:</strong>{" "}
                    <span className="font-mono font-bold text-navy">
                      {req.quantity.toLocaleString("en-IN")} Units
                    </span>
                  </p>
                  {req.details && (
                    <p className="pt-1 text-body-muted italic">
                      &ldquo;{req.details}&rdquo;
                    </p>
                  )}
                </div>

                {/* Logo & Status Changer */}
                <div className="space-y-3 bg-offwhite p-4 rounded border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-navy font-semibold block mb-1">
                      Uploaded Artwork Reference:
                    </span>
                    {req.logo_url ? (
                      <div className="flex items-center gap-2 text-teal font-medium">
                        <FileCheck className="w-4 h-4" />
                        <span className="truncate">{req.logo_url}</span>
                      </div>
                    ) : (
                      <span className="text-body-muted">No file attached (Text brief provided)</span>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-navy mb-1">
                      Update Production Status:
                    </label>
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value as CustomRequestStatus)}
                      className="w-full bg-white px-2.5 py-1.5 rounded border border-border text-navy font-medium focus:border-teal"
                    >
                      <option value="New">New</option>
                      <option value="Quoted">Quoted (Sample Shared)</option>
                      <option value="In production">In Production</option>
                      <option value="Done">Done (Dispatched)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
