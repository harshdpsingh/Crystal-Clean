import React from "react";
import { notFound } from "next/navigation";
import { getAdminOrderById, getSettings } from "@/lib/supabase/admin";
import { formatInrCurrency, formatShortDate } from "@/lib/utils";
import PrintButton from "./PrintButton";

interface InvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    getAdminOrderById(id),
    getSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const subtotal = order.subtotal;
  const discount = order.discount_amount || 0;
  const taxableValue = subtotal - discount;
  const gstRate = 0.18; // 18% GST standard on amenities
  const gstAmount = Math.round(taxableValue * gstRate * 100) / 100;
  const grandTotalWithTax = taxableValue + gstAmount;

  return (
    <div className="bg-white min-h-screen text-black p-6 sm:p-12 max-w-4xl mx-auto text-xs leading-relaxed font-sans">
      
      {/* Print Control Bar (Hidden during print) */}
      <div className="no-print pb-6 mb-8 border-b border-gray-300 flex items-center justify-between">
        <span className="text-gray-500 font-medium">
          Official Commercial Pro-Forma Invoice & Packing Slip
        </span>
        <PrintButton />
      </div>

      {/* Invoice Header */}
      <div className="border-b-2 border-black pb-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-black">
              {settings.business_name || "CRYSTAL CLEAN"}
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-gray-600 font-semibold mt-0.5">
              {settings.tagline || "Hotel Amenities and Hygiene Supplies"}
            </p>
            <p className="text-gray-600 mt-2 max-w-sm">
              {settings.address}
            </p>
            <p className="text-gray-600">
              Phone: {settings.phone} | Email: {settings.email}
            </p>
            {settings.gst_number && (
              <p className="font-mono font-bold text-black mt-1">
                GSTIN: {settings.gst_number}
              </p>
            )}
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block bg-black text-white font-mono text-sm uppercase px-3 py-1 font-bold">
              TAX INVOICE
            </span>
            <p className="font-mono text-sm font-bold text-black mt-2">
              Invoice #{order.order_code}
            </p>
            <p className="text-gray-600">
              Date: {formatShortDate(order.created_at)}
            </p>
            <p className="text-gray-600 font-mono">
              Customer Code: {order.customer?.customer_code}
            </p>
            <p className="text-gray-600">
              Status: <strong>{order.status}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Bill To & Ship To Details */}
      <div className="grid grid-cols-2 gap-8 py-6 border-b border-gray-300">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Billed To / Buyer (Hotel)
          </h2>
          <p className="font-serif text-base font-bold text-black">
            {order.customer?.hotel_name}
          </p>
          <p className="text-gray-700 font-medium mt-0.5">
            Attn: {order.customer?.name}
          </p>
          <p className="text-gray-600 mt-1">
            {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
          </p>
          <p className="text-gray-600">
            Phone: {order.customer?.phone}
          </p>
          {order.customer?.gst_number && (
            <p className="font-mono font-bold text-black mt-1">
              Buyer GSTIN: {order.customer.gst_number}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Consignment Dispatch & Terms
          </h2>
          <p className="text-gray-700">
            <strong>Dispatch Mode:</strong> Surface Commercial Cargo / Express Courier
          </p>
          <p className="text-gray-700">
            <strong>Payment Terms:</strong> 100% Advance via RTGS/NEFT against Pro-Forma
          </p>
          <p className="text-gray-700">
            <strong>Delivery Pincode:</strong> {order.customer?.pincode}
          </p>
          {order.notes && (
            <p className="text-gray-700 italic mt-2">
              <strong>Instructions:</strong> &ldquo;{order.notes}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Itemized Table */}
      <div className="py-6">
        <table className="w-full text-xs text-left border border-gray-300">
          <thead className="bg-gray-100 border-b border-gray-300 font-bold text-black">
            <tr>
              <th className="p-2.5 w-10 text-center">#</th>
              <th className="p-2.5">Item Description & Specifications</th>
              <th className="p-2.5">SKU / Pack</th>
              <th className="p-2.5 text-right">Quantity</th>
              <th className="p-2.5 text-right">Rate (₹)</th>
              <th className="p-2.5 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items?.map((item, index) => (
              <tr key={index}>
                <td className="p-2.5 text-center font-mono text-gray-500">{index + 1}</td>
                <td className="p-2.5 font-medium text-black">
                  {item.product_name}
                </td>
                <td className="p-2.5 text-gray-600 font-mono text-[11px]">
                  {item.sku || "-"} ({item.pack_size || "Standard"})
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-black">
                  {item.qty.toLocaleString("en-IN")}
                </td>
                <td className="p-2.5 text-right font-mono">
                  {formatInrCurrency(item.unit_price)}
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-black">
                  {formatInrCurrency(item.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Calculations */}
      <div className="flex justify-end pt-2 pb-6 border-b border-gray-300">
        <div className="w-72 space-y-2 text-xs">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-mono">{formatInrCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Discount ({order.coupon_code || "Promo"}):</span>
              <span className="font-mono">-{formatInrCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-700 pt-1 border-t border-gray-200">
            <span>Taxable Supply Value:</span>
            <span className="font-mono font-bold">{formatInrCurrency(taxableValue)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>CGST (9%) + SGST (9%) / IGST (18%):</span>
            <span className="font-mono">{formatInrCurrency(gstAmount)}</span>
          </div>

          <div className="flex justify-between text-sm font-bold text-black pt-2 border-t-2 border-black">
            <span>Total Payable Amount:</span>
            <span className="font-mono">{formatInrCurrency(grandTotalWithTax)}</span>
          </div>
        </div>
      </div>

      {/* Bank & Payment Information */}
      <div className="grid grid-cols-2 gap-8 py-6 border-b border-gray-300">
        <div className="space-y-1">
          <h3 className="font-bold uppercase tracking-wider text-[11px] text-black">
            Bank Details for RTGS / NEFT / IMPS
          </h3>
          <p className="text-gray-700">Account Name: <strong>Crystal Clean Amenities Pvt Ltd</strong></p>
          <p className="text-gray-700">Bank: <strong>HDFC Bank Ltd</strong></p>
          <p className="text-gray-700">Account Number: <strong>50200088991122</strong></p>
          <p className="text-gray-700">IFSC Code: <strong>HDFC0001234</strong></p>
          <p className="text-gray-700">Branch: <strong>Industrial Area Phase II, New Delhi</strong></p>
        </div>

        <div className="flex flex-col justify-between items-end text-right">
          <div className="text-[11px] text-gray-500">
            E. & O.E. Goods once sold will not be taken back unless transit damage is verified.
          </div>
          <div className="mt-8 text-center">
            <div className="w-44 border-b border-black mb-1"></div>
            <p className="font-bold text-black">For Crystal Clean</p>
            <p className="text-[10px] text-gray-600">Authorized Signatory</p>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center text-[10px] text-gray-500">
        Thank you for your business. For dispatch updates, reach our WhatsApp desk at +{settings.whatsapp_number}.
      </div>

    </div>
  );
}
