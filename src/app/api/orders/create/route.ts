import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processAndSaveOrder } from "@/lib/supabase/admin";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { getSettings } from "@/lib/supabase/admin";
import { isValidIndianPhone, isValidIndianPincode, isValidGst, sanitizeText } from "@/lib/utils";

const OrderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  hotel_name: z.string().min(2, "Hotel/Business name is required"),
  phone: z.string().refine((val) => isValidIndianPhone(val), {
    message: "Please enter a valid 10-digit Indian mobile number",
  }),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().refine((val) => isValidIndianPincode(val), {
    message: "Please enter a valid 6-digit PIN code",
  }),
  email: z.string().email().optional().or(z.literal("")),
  gst_number: z.string().optional().refine((val) => isValidGst(val || ""), {
    message: "Please enter a valid 15-character GSTIN",
  }),
  notes: z.string().optional(),
  coupon_code: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OrderSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid order details";
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
    }

    const {
      name,
      hotel_name,
      phone,
      email,
      address,
      city,
      pincode,
      gst_number,
      notes,
      coupon_code,
      items,
    } = parsed.data;

    // 1. Process and save order to DB in one secure transaction
    const { order, customer, items: orderItems, isReturningCustomer } = await processAndSaveOrder({
      name: sanitizeText(name),
      hotel_name: sanitizeText(hotel_name),
      phone: sanitizeText(phone),
      email: email ? sanitizeText(email) : undefined,
      address: sanitizeText(address),
      city: sanitizeText(city),
      pincode: sanitizeText(pincode),
      gst_number: gst_number ? sanitizeText(gst_number) : undefined,
      notes: notes ? sanitizeText(notes) : undefined,
      coupon_code: coupon_code ? sanitizeText(coupon_code) : undefined,
      items,
    });

    // 2. Fetch business settings to get the target WhatsApp number
    const settings = await getSettings();
    const businessWhatsApp = settings.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919149953610";

    // 3. Build formatted pre-filled WhatsApp message
    const message = buildOrderWhatsAppMessage(
      order,
      customer,
      orderItems,
      isReturningCustomer
    );

    // 4. Generate direct wa.me link
    const whatsappUrl = buildWhatsAppUrl(businessWhatsApp, message);

    return NextResponse.json({
      success: true,
      orderCode: order.order_code,
      customerCode: customer.customer_code,
      isReturningCustomer,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while creating your order.",
      },
      { status: 500 }
    );
  }
}
