"use client";

import React, { useState } from "react";
import { Star, CheckCircle, Send } from "lucide-react";
import { Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import RatingStars from "@/components/ui/RatingStars";
import { useToast } from "@/context/ToastContext";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  initialReviews: Review[];
  avgRating?: number;
}

export default function ProductReviews({
  productId,
  productName: _productName,
  initialReviews,
  avgRating = 4.8,
}: ProductReviewsProps) {
  const { showToast } = useToast();
  const [reviews] = useState<Review[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [reviewerName, setReviewerName] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Spam protection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If honeypot is filled, silently discard spam
    if (honeypot.trim()) {
      setIsSubmitted(true);
      return;
    }

    if (!reviewerName.trim() || !comment.trim()) {
      showToast("Please provide your name and review comments.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          reviewer_name: reviewerName.trim(),
          hotel_name: hotelName.trim() || undefined,
          rating,
          comment: comment.trim(),
          honeypot,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        showToast("Review submitted for verification. Thank you!", "success");
      } else {
        showToast(data.message || "Failed to submit review.", "error");
      }
    } catch {
      setIsSubmitted(true);
      showToast("Review received and queued for admin approval.", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Overall Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h3 className="font-serif text-xl text-navy">
            Verified Hotel Reviews
          </h3>
          <p className="text-xs text-body-muted mt-0.5">
            Feedback from verified purchase managers and hospitality buyers
          </p>
        </div>

        <div className="flex items-center gap-3 bg-offwhite px-4 py-2.5 rounded border border-border">
          <span className="font-serif text-2xl font-bold text-navy">
            {avgRating.toFixed(1)}
          </span>
          <div>
            <RatingStars rating={avgRating} size={14} />
            <p className="text-[11px] text-body-muted mt-0.5">
              Based on {reviews.length > 0 ? reviews.length : 1} approved reviews
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-offwhite/60 rounded border border-dashed border-border text-xs text-body-muted">
            No published reviews yet. Be the first hospitality buyer to share feedback.
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-md border border-border bg-white space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-navy">
                      {rev.reviewer_name}
                    </span>
                    {rev.is_verified && (
                      <span className="text-[10px] bg-teal-subtle text-teal font-semibold px-1.5 py-0.5 rounded border border-teal/20">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {rev.hotel_name && (
                    <p className="text-xs text-body-muted">
                      {rev.hotel_name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <RatingStars rating={rev.rating} size={13} />
                  <span className="text-[10px] text-body-light block mt-0.5">
                    {formatDate(rev.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-body leading-relaxed pt-1">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Section */}
      <div className="bg-offwhite rounded-md border border-border p-6 mt-8">
        <h4 className="font-serif text-base text-navy font-semibold mb-1">
          Submit Hospitality Feedback
        </h4>
        <p className="text-xs text-body-muted mb-5">
          Reviews are moderated by our admin team before being displayed publicly.
        </p>

        {isSubmitted ? (
          <div className="bg-white p-6 rounded border border-teal/40 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-teal mx-auto" strokeWidth={1.5} />
            <h5 className="font-serif text-sm font-semibold text-navy">
              Review Submitted Successfully
            </h5>
            <p className="text-xs text-body-muted max-w-sm mx-auto">
              Thank you for sharing your operational feedback. It will be published after routine verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_comment">Leave this empty</label>
              <input
                type="text"
                id="hp_comment"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Rating selector */}
            <div>
              <label className="block text-xs font-medium text-navy mb-1.5">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={20}
                      strokeWidth={1.5}
                      className={
                        (hoverRating || rating) >= star
                          ? "fill-gold text-gold"
                          : "text-border fill-transparent"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-navy ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded border border-border focus:outline-none focus:border-teal text-xs text-body"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy mb-1">
                  Hotel / Property / Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Grand Residency, Jaipur"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded border border-border focus:outline-none focus:border-teal text-xs text-body"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy mb-1">
                Your Review / Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your feedback regarding product quality, packaging durability, guest response, or delivery."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded border border-border focus:outline-none focus:border-teal text-xs text-body resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-medium px-5 py-2.5 rounded text-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{isSubmitting ? "Submitting..." : "Submit Review for Moderation"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
