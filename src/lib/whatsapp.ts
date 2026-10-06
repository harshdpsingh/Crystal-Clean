import { Order, Customer, OrderItem, CustomRequest } from "./types";
import { formatInrCurrency } from "./utils";

/**
 * Builds a pre-filled WhatsApp message for an order.
 * Truncates gracefully if cart has more than 10 items.
 */
export function buildOrderWhatsAppMessage(
  order: Order,
  customer: Customer,
  items: OrderItem[],
  isReturningCustomer: boolean = false
): string {
  const lines: string[] = [];

  lines.push("New Order from Crystal Clean website");
  lines.push(`Order #${order.order_code}`);
  lines.push(`Customer ID: ${customer.customer_code} ${isReturningCustomer ? "(Returning customer)" : "(New customer)"}`);
  lines.push(`Name: ${customer.name}`);
  lines.push(`Hotel: ${customer.hotel_name}`);
  lines.push(`Phone: ${customer.phone}`);
  lines.push(`Address: ${customer.address}, ${customer.city}, ${customer.pincode}`);
  
  if (customer.gst_number && customer.gst_number.trim()) {
    lines.push(`GST: ${customer.gst_number.trim().toUpperCase()}`);
  }

  lines.push("");

  // Items (first 10 items)
  const maxItemsToShow = 10;
  const itemsToShow = items.slice(0, maxItemsToShow);
  const remainingCount = items.length - maxItemsToShow;

  itemsToShow.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.product_name} x ${item.qty} = Rs ${Math.round(item.line_total).toLocaleString("en-IN")}`
    );
  });

  if (remainingCount > 0) {
    lines.push(`...and ${remainingCount} more items (see full order #${order.order_code} in admin)`);
  }

  lines.push(`Subtotal: Rs ${Math.round(order.subtotal).toLocaleString("en-IN")}`);

  if (order.discount_amount > 0) {
    const couponTag = order.coupon_code ? ` (${order.coupon_code})` : "";
    lines.push(`Discount${couponTag}: -Rs ${Math.round(order.discount_amount).toLocaleString("en-IN")}`);
  }

  lines.push(`Total: Rs ${Math.round(order.total).toLocaleString("en-IN")}`);

  if (order.notes && order.notes.trim()) {
    lines.push(`Notes: ${order.notes.trim()}`);
  }

  return lines.join("\n");
}

/**
 * Builds a pre-filled WhatsApp message for a custom branding inquiry.
 */
export function buildCustomInquiryWhatsAppMessage(inquiry: CustomRequest): string {
  const lines: string[] = [];

  lines.push("Custom Branded Amenities Inquiry");
  lines.push("--------------------------------");
  lines.push(`Name: ${inquiry.name}`);
  lines.push(`Hotel: ${inquiry.hotel_name}`);
  lines.push(`Phone: ${inquiry.phone}`);
  lines.push(`Product Type: ${inquiry.product_type}`);
  lines.push(`Expected Quantity: ${inquiry.quantity.toLocaleString("en-IN")} Units`);

  if (inquiry.details && inquiry.details.trim()) {
    lines.push(`Specifications / Notes: ${inquiry.details.trim()}`);
  }

  if (inquiry.logo_url) {
    lines.push(`Logo Reference: ${inquiry.logo_url}`);
  }

  lines.push("\nPlease share sample mockup and bulk quotation.");

  return lines.join("\n");
}

/**
 * Builds the wa.me direct URL.
 * Cleans phone numbers by removing non-digits.
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
