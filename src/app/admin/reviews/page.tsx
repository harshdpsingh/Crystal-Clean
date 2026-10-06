"use client";

import React, { useState } from "react";
import { Star, CheckCircle, EyeOff, Trash2, Check } from "lucide-react";
import { Review } from "@/lib/types";
import { INITIAL_REVIEWS } from "@/lib/mockData";
import { formatShortDate } from "@/lib/utils";
import RatingStars from "@/components/ui/RatingStars";
import { useToast } from "@/context/ToastContext";

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const toggleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, is_approved: !r.is_approved };
          showToast(`Review by ${r.reviewer_name} is now ${updated.is_approved ? "published" : "hidden"}.`, "info");
          return updated;
        }
        return r;
      })
    );
  };

  const toggleVerified = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, is_verified: !r.is_verified };
          showToast(`Verification badge toggled for ${r.reviewer_name}.`, "info");
          return updated;
        }
        return r;
      })
    );
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    showToast("Review deleted permanently.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Quality Assurance & Moderation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Hotel Reviews Moderation ({reviews.length})
          </h1>
        </div>
      </div>

      {/* Reviews Queue */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-6 rounded-md border shadow-subtle space-y-3 text-xs ${
              rev.is_approved ? "bg-white border-border" : "bg-amber-50/40 border-amber-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-navy">{rev.reviewer_name}</span>
                  {rev.hotel_name && (
                    <span className="text-body-muted">({rev.hotel_name})</span>
                  )}
                  {rev.is_verified && (
                    <span className="bg-teal-subtle text-teal font-semibold text-[10px] px-1.5 py-0.5 rounded">
                      Verified Buyer
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      rev.is_approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rev.is_approved ? "Published on Site" : "Pending Approval"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RatingStars rating={rev.rating} size={14} />
                <span className="text-body-light">{formatShortDate(rev.created_at)}</span>
              </div>
            </div>

            <p className="text-body text-xs leading-relaxed italic">
              &ldquo;{rev.comment}&rdquo;
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border/60">
              <span className="text-[11px] text-body-muted">
                Product: <strong>{rev.product_name || "Amenity Item"}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVerified(rev.id)}
                  className="bg-offwhite hover:bg-border text-navy px-3 py-1.5 rounded transition-colors text-[11px] font-medium"
                >
                  {rev.is_verified ? "Unmark Verified" : "Mark Verified Buyer"}
                </button>

                <button
                  onClick={() => toggleApprove(rev.id)}
                  className={`px-3 py-1.5 rounded transition-colors text-[11px] font-semibold flex items-center gap-1 ${
                    rev.is_approved
                      ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                      : "bg-teal text-white hover:bg-teal-dark"
                  }`}
                >
                  {rev.is_approved ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{rev.is_approved ? "Hide from Storefront" : "Approve & Publish"}</span>
                </button>

                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-1.5 text-body-light hover:text-red-600 transition-colors"
                  aria-label="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
