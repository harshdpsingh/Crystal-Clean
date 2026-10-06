import React from "react";
import { Review } from "@/lib/types";
import RatingStars from "@/components/ui/RatingStars";

interface CustomerReviewsProps {
  reviews: Review[];
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block mb-1">
            Purchase Manager Feedback
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy">
            Approved Reviews from Indian Hoteliers
          </h2>
        </div>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-offwhite rounded-md border border-border p-6 flex flex-col justify-between space-y-4 shadow-subtle hover:border-teal transition-colors"
            >
              <div className="space-y-3">
                <RatingStars rating={rev.rating} size={15} />
                <p className="text-xs sm:text-sm text-body leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border/80">
                <p className="font-serif text-sm font-semibold text-navy">
                  {rev.reviewer_name}
                </p>
                {rev.hotel_name && (
                  <p className="text-xs text-body-muted mt-0.5 font-medium">
                    {rev.hotel_name}
                  </p>
                )}
                {rev.product_name && (
                  <span className="inline-block mt-2 text-[10px] bg-white px-2 py-0.5 rounded border border-border text-body-light truncate max-w-full">
                    Item: {rev.product_name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
