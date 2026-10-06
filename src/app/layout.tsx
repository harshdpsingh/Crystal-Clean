import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { getSettings } from "@/lib/supabase/admin";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B2545",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.business_name} | ${settings.tagline}`;
  const description =
    "Crystal Clean is India's premier B2B manufacturer and bulk supplier of hotel amenities, guest toiletries, commercial housekeeping chemicals, and custom branded hotel supplies.";

  return {
    title: {
      default: title,
      template: `%s | ${settings.business_name}`,
    },
    description: description,
    keywords: [
      "hotel amenities supplier India",
      "bulk hotel toiletries",
      "custom branded hotel toiletries",
      "hotel shampoo soap manufacturer",
      "commercial housekeeping chemicals India",
      "hotel guest supplies Delhi Mumbai Bangalore Goa",
    ],
    authors: [{ name: settings.business_name }],
    openGraph: {
      title: title,
      description: description,
      type: "website",
      locale: "en_IN",
      siteName: settings.business_name,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en-IN" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-body antialiased selection:bg-teal selection:text-white">
        <ToastProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <AnnouncementBar text={settings.announcement_bar} />
              <Header settings={settings} />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer settings={settings} />
              <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
              <MobileBottomBar whatsappNumber={settings.whatsapp_number} />
            </div>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
