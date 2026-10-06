import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 14,
  showValue = false,
  reviewCount,
}: RatingStarsProps) {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index + 1 <= Math.round(rating);
          return (
            <Star
              key={index}
              size={size}
              strokeWidth={1.5}
              className={
                isFilled
                  ? "fill-gold text-gold"
                  : "text-border fill-transparent"
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-body-muted ml-0.5">
          {roundedRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-body-muted">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
