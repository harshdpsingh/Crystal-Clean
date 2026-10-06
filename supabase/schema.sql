-- ==========================================================
-- CRYSTAL CLEAN - HOTEL AMENITIES B2B E-COMMERCE DATABASE
-- SUPABASE POSTGRESQL SCHEMA WITH RLS & AUTO-SEQUENCES
-- ==========================================================

-- Enable pgcrypto extension for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Sequences for Customer Code (CUST-0001) and Order Code (ORD-1001)
CREATE SEQUENCE IF NOT EXISTS customer_code_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS order_code_seq START WITH 1001 INCREMENT BY 1;

-- Functions to generate formatted codes
CREATE OR REPLACE FUNCTION generate_customer_code() 
RETURNS TEXT AS $$
BEGIN
  RETURN 'CUST-' || LPAD(nextval('customer_code_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_order_code() 
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || LPAD(nextval('order_code_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  price NUMERIC(12, 2) NOT NULL,
  old_price NUMERIC(12, 2),
  stock INTEGER DEFAULT 1000,
  min_order_qty INTEGER DEFAULT 100,
  pack_size TEXT DEFAULT 'Pack of 100',
  is_customizable BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BULK PRICE TIERS
CREATE TABLE IF NOT EXISTS bulk_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_qty INTEGER NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT bulk_prices_unique_tier UNIQUE(product_id, min_qty)
);

-- 5. DISCOUNTS & COUPONS
CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percent', 'flat')),
  value NUMERIC(12, 2) NOT NULL,
  applies_to TEXT NOT NULL CHECK (applies_to IN ('product', 'category', 'cart')),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  coupon_code TEXT UNIQUE,
  min_cart_value NUMERIC(12, 2) DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMERS TABLE (Phone is unique identity key)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code TEXT UNIQUE NOT NULL DEFAULT generate_customer_code(),
  name TEXT NOT NULL,
  hotel_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  gst_number TEXT,
  tag TEXT DEFAULT 'Standard',
  notes TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL DEFAULT generate_order_code(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  subtotal NUMERIC(12, 2) NOT NULL,
  discount_amount NUMERIC(12, 2) DEFAULT 0.00,
  coupon_code TEXT,
  total NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  hotel_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CUSTOM REQUESTS (Custom Branded Items)
CREATE TABLE IF NOT EXISTS custom_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  hotel_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  details TEXT,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Quoted', 'In production', 'Done')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SETTINGS TABLE (Key-Value configuration)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_bulk_prices_product_id ON bulk_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_discounts_coupon_code ON discounts(coupon_code);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Categories: Public read active
CREATE POLICY "Public categories read" ON categories
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin categories all" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: Public read active
CREATE POLICY "Public products read" ON products
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin products all" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Bulk Prices: Public read
CREATE POLICY "Public bulk prices read" ON bulk_prices
  FOR SELECT USING (true);

CREATE POLICY "Admin bulk prices all" ON bulk_prices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Discounts: Public read active
CREATE POLICY "Public discounts read" ON discounts
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin discounts all" ON discounts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Reviews: Public read approved
CREATE POLICY "Public reviews read" ON reviews
  FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin reviews all" ON reviews
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Settings: Public read
CREATE POLICY "Public settings read" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Admin settings all" ON settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Customers, Orders, Order Items, Custom Requests:
-- Accessible to authenticated admin users in Supabase, and accessed via Service Role API on customer side
CREATE POLICY "Admin customers all" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin orders all" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin order items all" ON order_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin custom requests all" ON custom_requests
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket setup for product images and logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crystal-clean-assets', 'crystal-clean-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public assets view" ON storage.objects
  FOR SELECT USING (bucket_id = 'crystal-clean-assets');

CREATE POLICY "Admin assets upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'crystal-clean-assets');

CREATE POLICY "Admin assets update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'crystal-clean-assets');

CREATE POLICY "Admin assets delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'crystal-clean-assets');
