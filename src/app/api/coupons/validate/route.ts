import { NextRequest, NextResponse } from "next/server";
import { getDiscountByCode } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const discount = await getDiscountByCode(code);

    if (!discount || !discount.is_active) {
      return NextResponse.json(
        { success: false, message: `Coupon code "${code.toUpperCase()}" is invalid or expired.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      discount,
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { success: false, message: "Error validating coupon." },
      { status: 500 }
    );
  }
}
