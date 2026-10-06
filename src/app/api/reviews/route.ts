import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createReview } from "@/lib/supabase/admin";
import { sanitizeText } from "@/lib/utils";

const ReviewSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  reviewer_name: z.string().min(2, "Reviewer name is required"),
  hotel_name: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
  honeypot: z.string().optional(),
});

// Simple IP based rate-limiting map (max 3 reviews per IP per hour)
const reviewRateLimit = new Map<string, { count: number; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const now = Date.now();

    // Rate limiting check
    const clientLimit = reviewRateLimit.get(ip);
    if (clientLimit && clientLimit.expires > now) {
      if (clientLimit.count >= 3) {
        return NextResponse.json(
          {
            success: false,
            message: "Maximum review submission limit reached for today. Please try again later.",
          },
          { status: 429 }
        );
      }
      clientLimit.count += 1;
    } else {
      reviewRateLimit.set(ip, { count: 1, expires: now + 24 * 60 * 60 * 1000 });
    }

    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid review data" },
        { status: 400 }
      );
    }

    const { product_id, reviewer_name, hotel_name, rating, comment, honeypot } = parsed.data;

    // Discard silently if spam honeypot triggered
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Review submitted." });
    }

    const newReview = await createReview({
      product_id,
      reviewer_name: sanitizeText(reviewer_name),
      hotel_name: hotel_name ? sanitizeText(hotel_name) : undefined,
      rating,
      comment: sanitizeText(comment),
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted for verification and approval.",
      reviewId: newReview.id,
    });
  } catch (error: any) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { success: false, message: "Error submitting review." },
      { status: 500 }
    );
  }
}
