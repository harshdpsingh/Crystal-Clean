# Crystal Clean – Hotel Amenities & Hygiene Supplies

A complete, production-ready, mobile-first B2B e-commerce platform built for **Crystal Clean**, an established supplier of hotel amenities, guest-room supplies, housekeeping chemicals, and custom branded (private-label) items in India.

---

## 🌟 Key Highlights & Architectural Features

- **No Online Payment Gateway / No OTP friction:** B2B hotel buyers place orders with 1 click; the server validates inventory, re-calculates volume bulk prices, registers the order in PostgreSQL, and generates an organized, pre-filled WhatsApp message sent straight to your sales desk.
- **Unique Customer ID (`CUST-0001`) & Order ID (`ORD-1001`):** Server-managed sequence generators with automatic returning customer recognition based on 10-digit Indian phone number.
- **Privacy-Preserving Order Tracking:** Public order tracking (`/track-order` and `/order-success/[orderCode]`) requires both Order ID and Phone Number, and returns **Fulfillment Status Only** (New, Confirmed, Packed, Shipped, Delivered) without revealing addresses or historical orders.
- **Institutional Tiered Bulk Pricing:** Dynamic unit price calculation based on purchase quantities (e.g. 100+ units, 500+ units, 1000+ units) with live price table highlighters.
- **Custom Branded Private-Label Desk:** Form for hotels to upload logos (PNG, JPG, PDF up to 5 MB) and specify custom fragrances and packaging finishes.
- **Full Admin Portal (`/admin`):** Dashboard KPIs, Product CRUD with bulk price tiers, Category organizer, Orders manager with status changer, printable official Tax Invoices / Packing Slips with GSTIN, Customers database with full order history, Custom branding inquiries, Promotions/Coupons manager, Reviews moderation, and Business Profile Settings.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS (Custom Crystal Clean corporate theme: Deep Navy `#0B2545`, Crystal Teal `#0E7C86`, Warm Off-White `#F7F5F0`, Muted Gold `#B08D57`)
- **Typography:** `DM Serif Display` (refined serif headings) and `DM Sans` (clean UI body text)
- **Icons:** `lucide-react` (1.5px thin line icons)
- **Database & Storage:** Supabase (PostgreSQL with Row Level Security + Storage bucket)
- **Forms & Validation:** Zod with strict Indian phone, PIN code, and GSTIN format validation.

---

## 📁 Project Directory Structure

```
crystalclean/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Premium B2B Home Page
│   │   ├── layout.tsx                  # Root layout with Fonts, Cart & Toast providers
│   │   ├── products/
│   │   │   ├── page.tsx                # Catalog page with search, filters & sort
│   │   │   ├── CatalogClient.tsx       # Interactive client filtering
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            # Dynamic Product detail page with SEO JSON-LD
│   │   │       └── ProductDetailClient.tsx # Live bulk tier calculator & gallery
│   │   ├── cart/page.tsx               # Cart with auto bulk discount & coupon engine
│   │   ├── checkout/page.tsx           # Hotel checkout form + localStorage autofill
│   │   ├── custom-order/page.tsx       # Custom branded amenities inquiry form
│   │   ├── order-success/[orderCode]/  # Order confirmation & status check
│   │   ├── track-order/page.tsx        # Standalone privacy-safe order status lookup
│   │   ├── about/page.tsx              # About Us & Manufacturing credentials
│   │   ├── contact/page.tsx            # Contact sales desk & facility address
│   │   ├── privacy-policy/page.tsx     # Privacy Policy
│   │   ├── terms/page.tsx              # Terms of Supply & GST rules
│   │   ├── not-found.tsx               # Branded 404 page
│   │   ├── sitemap.ts                  # Dynamic SEO XML sitemap
│   │   ├── robots.ts                   # Robots.txt
│   │   ├── api/
│   │   │   ├── orders/
│   │   │   │   ├── create/route.ts     # Secure order creation + WhatsApp builder
│   │   │   │   └── track/route.ts      # Status-only order tracking API
│   │   │   ├── custom-requests/route.ts # Custom branding inquiry endpoint
│   │   │   ├── reviews/route.ts        # Reviews API with honeypot & rate limit
│   │   │   ├── coupons/validate/route.ts# Promo code validation
│   │   │   └── admin/settings/route.ts # Business settings persistence
│   │   └── admin/                      # Complete Admin Management Portal
│   │       ├── page.tsx                # Dashboard statistics & low-stock alerts
│   │       ├── login/page.tsx          # Supabase Auth / Demo login
│   │       ├── orders/page.tsx         # Orders list, filters, CSV export
│   │       ├── orders/[id]/page.tsx    # Order detail & WhatsApp reply
│   │       ├── orders/[id]/invoice/    # Printable Tax Invoice & Packing Slip
│   │       ├── products/page.tsx       # Product inventory & stock table
│   │       ├── products/new/page.tsx   # Add product with bulk tiers
│   │       ├── products/[id]/page.tsx  # Edit product & specifications
│   │       ├── categories/page.tsx     # Category manager & sort orders
│   │       ├── customers/page.tsx      # Customer accounts & order drilldown
│   │       ├── custom-requests/page.tsx# Custom branding submissions & logos
│   │       ├── discounts/page.tsx      # Coupons manager (BULK10, FESTIVE5)
│   │       ├── reviews/page.tsx        # Review approval queue
│   │       └── settings/page.tsx       # Business profile & WhatsApp number
│   ├── components/
│   │   ├── layout/                     # Header, Footer, AnnouncementBar, FloatingWhatsApp
│   │   ├── home/                       # Hero, CategoryGrid, FeaturedProducts, WhyChooseUs, etc.
│   │   ├── products/                   # ProductCard, BulkPriceTable, ProductSpecs, Reviews
│   │   ├── ui/                         # RatingStars, Toast, Badges
│   │   └── admin/                      # AdminSidebar, AdminHeader, StatCard
│   ├── context/
│   │   ├── CartContext.tsx             # Persistent cart with bulk pricing
│   │   └── ToastContext.tsx            # Alert notifications
│   └── lib/
│       ├── types.ts                    # Full TypeScript data definitions
│       ├── utils.ts                    # Indian currency (lakh commas), phone & PIN validation
│       ├── pricing.ts                  # Bulk tier calculation & coupon engine
│       ├── whatsapp.ts                 # Pre-filled WhatsApp message formatting
│       ├── mockData.ts                 # Offline / demo fallback seed dataset
│       └── supabase/                   # Supabase client & admin data access layer
└── supabase/
    ├── schema.sql                      # Complete PostgreSQL schema with RLS & sequences
    └── seed.sql                        # 6 categories, 20 sample products, bulk tiers, coupons
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Local Development Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The site runs immediately out of the box with sample products, reviews, categories, checkout, and admin demo mode even before connecting Supabase!

---

### 2. Setting Up Supabase (Free Tier Database)

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it `crystal-clean-amenities`. Choose a strong database password and select the **South Asia (Mumbai)** region for lowest latency.
3. Open the **SQL Editor** tab from the left sidebar in your Supabase dashboard.
4. Open the file `supabase/schema.sql` from this codebase, paste its entire contents into the SQL Editor, and click **Run**.
5. Next, open `supabase/seed.sql`, paste its entire contents into the SQL Editor, and click **Run**.
6. This will create:
   - All 10 database tables with indexes and Row Level Security (RLS)
   - PostgreSQL sequences for auto-generating `CUST-0001` and `ORD-1001`
   - Storage bucket `crystal-clean-assets` for product photos and property logos
   - 6 categories and 20 sample hotel amenity products with pricing and bulk tiers.

---

### 3. Creating the Admin User in Supabase

1. In your Supabase dashboard, navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email (e.g. `admin@crystalclean.in`) and a secure password.
4. Ensure **Auto Confirm User?** is checked.
5. Click **Create User**. You can now sign in at `/admin/login` using these credentials.

---

### 4. Setting Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your project credentials from **Supabase Dashboard -> Project Settings -> API**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Business WhatsApp Number (91 + 10 digits, no + or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210

# Business Information
NEXT_PUBLIC_BUSINESS_NAME=Crystal Clean
NEXT_PUBLIC_BUSINESS_PHONE=+91 98765 43210
NEXT_PUBLIC_BUSINESS_EMAIL=orders@crystalclean.in
NEXT_PUBLIC_BUSINESS_ADDRESS=Plot 42, Industrial Area, Phase II, New Delhi 110020, India
NEXT_PUBLIC_BUSINESS_GST=07AAAAA0000A1Z5
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### 5. Deploying to Vercel (Free Tier)

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [https://vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. In the **Environment Variables** section, paste all variables from your `.env.local` file.
5. Click **Deploy**. Your B2B website will be live with full SSL, global CDN, and instant edge routing.

---

## 📱 Where to Change WhatsApp Number & Business Information

You can update your business details in two ways:

1. **Directly from the Admin Portal (Recommended):**
   - Log in at `/admin/login`
   - Go to **Settings** in the left sidebar
   - Update your **WhatsApp Number**, **Phone**, **Email**, **Address**, **GSTIN**, or **Top Announcement Bar Text**
   - Click **Save Business Settings**. Changes apply across the website instantly.

2. **Via Environment Variables:**
   - Modify `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` or your Vercel project settings.

---

## 🛡️ WhatsApp Order Message Format

When a hotel client clicks **Place order on WhatsApp**, the server formats and sends:

```
New Order from Crystal Clean website
Order #ORD-1024
Customer ID: CUST-0007 (Returning customer)
Name: Rahul Sharma
Hotel: Sunrise Inn
Phone: 9829012345
Address: Palace Road, Jaipur, 302002
GST: 08AABCG1234F1Z1

1. Shampoo Bottle 30ml, Pack of 100 x 500 = Rs 3,900
2. Hand Sanitizer 50ml x 200 = Rs 2,700
Subtotal: Rs 6,600
Discount (BULK10): -Rs 660
Total: Rs 5,940
Notes: Deliver to back security gate
```

---

## 📄 License & Commercial Rights

© 2026 Crystal Clean. All rights reserved. Built for institutional B2B hospitality commerce in India.
