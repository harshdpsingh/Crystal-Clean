import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCustomRequest, getSettings } from "@/lib/supabase/admin";
import { buildCustomInquiryWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { isValidIndianPhone, sanitizeText } from "@/lib/utils";

const CustomRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  hotel_name: z.string().min(2, "Hotel/Business name is required"),
  phone: z.string().refine((val) => isValidIndianPhone(val), {
    message: "Please enter a valid 10-digit mobile number",
  }),
  product_type: z.string().min(2, "Please select or enter product type"),
  quantity: z.number().int().min(100, "Minimum inquiry quantity is 100 units"),
  details: z.string().optional(),
  logo_url: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CustomRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid inquiry data" },
        { status: 400 }
      );
    }

    const { name, hotel_name, phone, product_type, quantity, details, logo_url } = parsed.data;

    // 1. Save custom inquiry in DB
    const savedInquiry = await createCustomRequest({
      name: sanitizeText(name),
      hotel_name: sanitizeText(hotel_name),
      phone: sanitizeText(phone),
      product_type: sanitizeText(product_type),
      quantity,
      details: details ? sanitizeText(details) : undefined,
      logo_url,
    });

    // 2. Fetch business settings to get the WhatsApp number
    const settings = await getSettings();
    const businessWhatsApp = settings.whatsapp_number || "919876543210";

    // 3. Build WhatsApp message and URL
    const message = buildCustomInquiryWhatsAppMessage(savedInquiry);
    const whatsappUrl = buildWhatsAppUrl(businessWhatsApp, message);

    return NextResponse.json({
      success: true,
      inquiryId: savedInquiry.id,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Custom request error:", error);
    return NextResponse.json(
      { success: false, message: "Error submitting custom inquiry." },
      { status: 500 }
    );
  }
}
