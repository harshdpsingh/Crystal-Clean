import { NextRequest, NextResponse } from "next/server";
import { trackOrderStatus } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { orderCode, phone } = await req.json();

    if (!orderCode || !phone) {
      return NextResponse.json(
        { success: false, message: "Please provide both Order ID and Phone Number." },
        { status: 400 }
      );
    }

    const trackResult = await trackOrderStatus(orderCode, phone);

    if (!trackResult) {
      return NextResponse.json(
        {
          success: false,
          message: "No matching order found with the provided Order Code and Phone Number.",
        },
        { status: 404 }
      );
    }

    // Return ONLY status, code, and date for strict customer privacy
    return NextResponse.json({
      success: true,
      order: {
        orderCode: trackResult.orderCode,
        status: trackResult.status,
        createdAt: trackResult.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { success: false, message: "Error looking up order status." },
      { status: 500 }
    );
  }
}
