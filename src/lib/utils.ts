import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers in Indian Rupee format with standard lakh/crore commas.
 * e.g., 125000 -> "₹1,25,000", 8.5 -> "₹8.50"
 */
export function formatInrCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "₹0";
  }

  const num = Number(amount);
  const isInteger = Number.isInteger(num);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Validates 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s+-]/g, "");
  // Matches 10 digits starting with 6-9, or with 91 prefix
  if (/^91[6-9]\d{9}$/.test(cleaned)) return true;
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Normalizes phone number to 10 digits or 91XXXXXXXXXX
 */
export function normalizeIndianPhone(phone: string): string {
  let cleaned = phone.replace(/[\s+()-]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return "91" + cleaned;
  }
  return cleaned;
}

/**
 * Extracts 10-digit display format for user inputs
 */
export function get10DigitPhone(phone: string): string {
  let cleaned = phone.replace(/[\s+()-]/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned.substring(2);
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Validates 6-digit Indian PIN Code (e.g. 110020)
 */
export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validates Indian 15-character GSTIN format
 */
export function isValidGst(gst: string): boolean {
  if (!gst || gst.trim() === "") return true; // Optional field
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst.trim().toUpperCase());
}

/**
 * Clean date formatting in Indian English format: e.g. "07 Oct 2026, 02:30 PM"
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Short date formatting: e.g. "07 Oct 2026"
 */
export function formatShortDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Sanitize text strings for security
 */
export function sanitizeText(str: string | undefined | null): string {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, "").trim();
}
