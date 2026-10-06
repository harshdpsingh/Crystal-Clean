-- ==========================================================
-- CRYSTAL CLEAN - SEED DATA FOR HOSPITALITY AMENITIES
-- ==========================================================

-- Clean existing seed data safely if re-running
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM bulk_prices;
DELETE FROM reviews;
DELETE FROM discounts;
DELETE FROM custom_requests;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM settings;

-- 1. SETTINGS
INSERT INTO settings (key, value) VALUES
  ('business_name', 'Crystal Clean'),
  ('tagline', 'Hotel Amenities & Hygiene Supplies'),
  ('whatsapp_number', '919149953610'),
  ('phone', '+91 91499 53610'),
  ('email', 'orders@crystalclean.in'),
  ('address', 'Plot 42, Industrial Area, Phase II, New Delhi 110020, India'),
  ('gst_number', '07AAAAA0000A1Z5'),
  ('announcement_bar', 'Bulk pricing for hotels and resorts | Custom branding available | Pan-India delivery'),
  ('currency_symbol', '₹'),
  ('min_order_default', '100'),
  ('catalog_pdf_url', '/catalog/CrystalClean_Hotel_Amenities_Catalog_2026.pdf')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. CATEGORIES
INSERT INTO categories (id, name, slug, image_url, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000003', 'Cleaning Supplies & Chemicals', 'cleaning-supplies', '/products/dishwash-plus-5l.jpg', 1, true),
  ('c1000000-0000-0000-0000-000000000004', 'Housekeeping Essentials', 'housekeeping-essentials', '/products/furniture-cleaner-300ml.jpg', 2, true),
  ('c1000000-0000-0000-0000-000000000001', 'Hygiene & Toiletries', 'hygiene-toiletries', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 3, true),
  ('c1000000-0000-0000-0000-000000000002', 'Guest Room Amenities', 'guest-room-amenities', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Custom Branded Amenities', 'custom-branded', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Bulk Packs & Cartons', 'bulk-packs', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', 6, true);

-- 3. PRODUCTS
INSERT INTO products (id, category_id, name, slug, sku, description, specifications, price, old_price, stock, min_order_qty, pack_size, is_customizable, is_featured, is_active, images) VALUES
-- Real Product 1. Dish Wash + 5L
(
  'p1000000-0000-0000-0000-000000000101',
  'c1000000-0000-0000-0000-000000000003',
  'Dish Wash + Antibacterial Concentrate (5 Litres)',
  'dish-wash-plus-antibacterial-concentrate-5-litres',
  'CC-CLN-DW01',
  'Heavy-duty commercial dishwashing liquid concentrate formulated for hotel kitchens, restaurants, and catering. Cuts through stubborn grease, oil, and food deposits with anti-bacterial protection. Clear high-purity formulation: ''We serve cleanness not coloured water''.',
  '{"volume": "5 Litres Can with Handle", "formulation": "Clear Active Grease-Cutting Concentrate", "dilution": "10 - 20 ml per litre of water", "antibacterial_action": "Kills 99.9% Food-Borne Bacteria", "packaging": "Heavy Duty Recyclable Jar with Carry Handle", "fragrance": "Subtle Citrus Fresh"}'::jsonb,
  399.00,
  499.00,
  2500,
  2,
  'Can of 5 Litres',
  false,
  true,
  true,
  ARRAY['/products/dishwash-plus-5l.jpg']
),
-- Real Product 2. Magic Cleaner 1L
(
  'p1000000-0000-0000-0000-000000000102',
  'c1000000-0000-0000-0000-000000000003',
  'Magic Cleaner Multipurpose Heavy-Duty Stain Remover (1 Litre)',
  'magic-cleaner-multipurpose-stain-remover-1-litre',
  'CC-CLN-MC02',
  'Specialized deep-cleaning formulation designed to dissolve tough carbon deposits, grease, grout stains, hard water marks, and metal oxidation. Delivers instant before-and-after transformation on kitchen counters, cooktops, tiles, and bathroom fixtures.',
  '{"volume": "1 Litre Bottle", "application": "Stain Removal, Grout, Cooktops, Sinks, Fixtures", "action_time": "1 - 3 Minutes fast acting", "formulation": "Concentrated Deep-Penetrating Liquid", "packaging": "Heavy Bottle with Child-Resistant Screw Cap"}'::jsonb,
  180.00,
  240.00,
  3200,
  3,
  'Bottle of 1 Litre',
  false,
  true,
  true,
  ARRAY['/products/magic-cleaner-1l.jpg']
),
-- Real Product 3. Furniture Cleaner 300ml
(
  'p1000000-0000-0000-0000-000000000103',
  'c1000000-0000-0000-0000-000000000004',
  'Furniture Cleaner & Wood Polish Spray - Lemon Fragrance (300 ml)',
  'furniture-cleaner-wood-polish-spray-lemon-300ml',
  'CC-HKP-FC03',
  'Premium conditioning cleaner and polish for hotel room wooden furniture, laminate headboards, desks, and leatherette upholstery. Cleans dust, smudges, and fingerprints while leaving a protective antistatic sheen with fresh lemon scent.',
  '{"volume": "300 ml Trigger Spray Bottle", "fragrance": "Natural Lemon Citrus", "surface_safe": "Solid Wood, Veneer, Laminates, Leatherette, Melamine", "dispenser": "Fine-Mist Precision Spray Nozzle", "feature": "Anti-Static Dust Repelling Shield"}'::jsonb,
  145.00,
  190.00,
  4500,
  6,
  '300 ml Spray Bottle',
  false,
  true,
  true,
  ARRAY['/products/furniture-cleaner-300ml.jpg']
),
-- Real Product 4. Toilet Cleaner 10x Power 5L
(
  'p1000000-0000-0000-0000-000000000104',
  'c1000000-0000-0000-0000-000000000003',
  'Toilet Cleaner 10x Power Germ Protection & Descaler (5 Litres)',
  'toilet-cleaner-10x-power-disinfectant-5-litres',
  'CC-CLN-TC04',
  'Hospital-grade 10x power descaling toilet and urinal cleaner for high-traffic hotel restrooms. Thick clinging formula dissolves yellow hard water encrustation, limescale, and uric stains while eliminating 99.9% odor-causing bacteria.',
  '{"volume": "5 Litres Can", "power_formula": "10x Clinging Descaling Action", "disinfection": "99.9% Broad-Spectrum Germ Kill", "odour_control": "Active Neutralizing Pine & Mint", "packaging": "Industrial Grade Heavy Duty Jar"}'::jsonb,
  420.00,
  520.00,
  1800,
  2,
  'Can of 5 Litres',
  false,
  true,
  true,
  ARRAY['/products/toilet-cleaner-10x-5l.jpg']
),
-- Real Product 5. Phenolic Cleaner 5L
(
  'p1000000-0000-0000-0000-000000000105',
  'c1000000-0000-0000-0000-000000000003',
  'Phenolic Cleaner & Surface Disinfectant - Floral Blend (5 Litres)',
  'phenolic-cleaner-surface-disinfectant-floral-5-litres',
  'CC-CLN-PC05',
  'Therapeutic high-coefficient phenolic floor cleaner and deodorizing fluid infused with Rose and Lavender essential aromas. Disinfects hotel corridors, banquet floors, lobby marble, and washrooms with long-lasting freshness.',
  '{"volume": "5 Litres Can with Handle", "fragrance": "Exotic Rose & Fresh Lavender Herbal", "formulation": "High-Efficacy Disinfecting Phenolic Compound", "dilution": "20 - 30 ml per 5 Litres of mopping water", "floor_compatibility": "Marble, Granite, Ceramic Tiles, Kota Stone"}'::jsonb,
  360.00,
  450.00,
  2200,
  2,
  'Can of 5 Litres',
  false,
  true,
  true,
  ARRAY['/products/phenolic-cleaner-5l.jpg']
),
-- 1. Shampoo Bottle 30 ml
(
  'p1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Shampoo Bottle 30 ml, Pack of 100',
  'shampoo-bottle-30ml-pack-of-100',
  'CC-HYG-001',
  'Mild cleansing formulation enriched with Aloe Vera and Green Tea extract. pH balanced, paraben-free hotel guest shampoo in 100% recyclable clear PET bottle with flip-top cap.',
  '{"volume": "30 ml", "packaging": "Clear PET Flip-top", "carton_qty": "100 Units", "fragrance": "Green Tea & Aloe", "shelf_life": "24 Months"}'::jsonb,
  8.50,
  10.00,
  15000,
  100,
  'Pack of 100 Units',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80']
),
-- 2. Conditioner Bottle 30 ml
(
  'p1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000001',
  'Conditioner Bottle 30 ml, Pack of 100',
  'conditioner-bottle-30ml-pack-of-100',
  'CC-HYG-002',
  'Silky nourishing hair conditioner formulated with Argan oil and Vitamin E. Leaves hair manageable and smooth. Ideal for luxury suites and boutique hotels.',
  '{"volume": "30 ml", "packaging": "Clear PET Flip-top", "carton_qty": "100 Units", "fragrance": "Mild Citrus Argan", "shelf_life": "24 Months"}'::jsonb,
  9.00,
  11.00,
  12000,
  100,
  'Pack of 100 Units',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80']
),
-- 3. Moisturising Body Lotion 30 ml
(
  'p1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000001',
  'Moisturising Body Lotion 30 ml, Pack of 100',
  'body-lotion-30ml-pack-of-100',
  'CC-HYG-003',
  'Fast-absorbing, non-greasy hotel body lotion with Shea Butter and Almond Oil. Keeps guest skin hydrated across all climates.',
  '{"volume": "30 ml", "packaging": "White PET Flip-top", "carton_qty": "100 Units", "fragrance": "Almond & Shea", "shelf_life": "24 Months"}'::jsonb,
  9.50,
  11.50,
  10000,
  100,
  'Pack of 100 Units',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80']
),
-- 4. Bath Soap Bar 20g
(
  'p1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000001',
  'Bath Soap Bar 20g (Pleated Wrap), Pack of 200',
  'bath-soap-bar-20g-pack-of-200',
  'CC-HYG-004',
  'Pure vegetable oil-based toilet soap bar with mild glycerine moisturizing base. Individually pleated in hygienic butter-paper with custom sticker option.',
  '{"weight": "20g", "packaging": "Pleated Butter Paper", "carton_qty": "200 Units", "TFM": "76% Grade 1", "shelf_life": "36 Months"}'::jsonb,
  4.20,
  5.00,
  35000,
  200,
  'Pack of 200 Units',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1607006314185-c5464a93540c?auto=format&fit=crop&w=800&q=80']
),
-- 5. Dental Kit
(
  'p1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000002',
  'Dental Kit (Biodegradable Toothbrush + 10g Paste)',
  'dental-kit-biodegradable-box-of-100',
  'CC-GRM-005',
  'Eco-friendly bamboo handle toothbrush with soft charcoal bristles and 10g mint toothpaste in recyclable kraft paper box packaging.',
  '{"contents": "1 Toothbrush + 10g Paste", "packaging": "Kraft Cardboard Box", "carton_qty": "100 Kits", "material": "Bamboo + Mint Paste"}'::jsonb,
  7.80,
  9.50,
  8000,
  100,
  'Pack of 100 Kits',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1559591937-e10816ef0627?auto=format&fit=crop&w=800&q=80']
),
-- 6. Shaving Kit
(
  'p1000000-0000-0000-0000-000000000006',
  'c1000000-0000-0000-0000-000000000002',
  'Shaving Kit (Twin Blade Razor + 15g Shaving Cream)',
  'shaving-kit-razor-cream-pack-of-100',
  'CC-GRM-006',
  'Lubricating strip twin blade disposable razor paired with 15g soothing aloe shaving cream in compact hotel-ready packaging.',
  '{"contents": "1 Razor + 15g Cream Tube", "packaging": "Sealed Poly / Paper Box", "carton_qty": "100 Kits"}'::jsonb,
  11.00,
  13.00,
  6000,
  100,
  'Pack of 100 Kits',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1503925802536-c9451dcd8715?auto=format&fit=crop&w=800&q=80']
),
-- 7. Shower Cap
(
  'p1000000-0000-0000-0000-000000000007',
  'c1000000-0000-0000-0000-000000000002',
  'Shower Cap in Paper Box, Pack of 200',
  'shower-cap-paper-box-pack-of-200',
  'CC-GRM-007',
  'Waterproof elasticated shower cap made with durable virgin PE film. Compact folded into stylish paper box.',
  '{"material": "Virgin PE Film", "packaging": "Printed Paper Box", "carton_qty": "200 Units", "size": "Universal Stretch"}'::jsonb,
  3.20,
  4.00,
  20000,
  200,
  'Pack of 200 Units',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80']
),
-- 8. Hand Sanitizer 50 ml
(
  'p1000000-0000-0000-0000-000000000008',
  'c1000000-0000-0000-0000-000000000001',
  'Hand Sanitizer 50 ml, Pocket Bottle (Pack of 50)',
  'hand-sanitizer-50ml-pocket-bottle-pack-50',
  'CC-HYG-008',
  '70% Isopropyl Alcohol disinfectant hand gel with moisturizer. Kills 99.9% germs without water. Perfect for reception desks and guest rooms.',
  '{"volume": "50 ml", "alcohol_content": "70% v/v", "carton_qty": "50 Bottles", "form": "Gel"}'::jsonb,
  15.00,
  18.00,
  5000,
  50,
  'Pack of 50 Bottles',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80']
),
-- 9. Commercial Toilet Cleaner Concentrate 5L
(
  'p1000000-0000-0000-0000-000000000009',
  'c1000000-0000-0000-0000-000000000003',
  'Commercial Toilet Cleaner Concentrate 5 Litres',
  'toilet-cleaner-concentrate-5-litres',
  'CC-CLN-009',
  'Heavy duty acid-based descaling toilet cleaner for institutional use. Removes tough water stains, limescale, and uric encrustations.',
  '{"volume": "5 Litres Can", "dilution": "Ready to use / 1:2", "carton_qty": "4 Cans per Carton", "fragrance": "Fresh Pine"}'::jsonb,
  380.00,
  450.00,
  450,
  2,
  'Can of 5 Litres',
  false,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80']
),
-- 10. Surface & Glass Cleaner Concentrate 5L
(
  'p1000000-0000-0000-0000-000000000010',
  'c1000000-0000-0000-0000-000000000003',
  'Surface & Glass Cleaner Concentrate 5 Litres',
  'surface-glass-cleaner-concentrate-5-litres',
  'CC-CLN-010',
  'Streak-free formula for hotel mirrors, windows, glass facades, and polished granite tops. Dilution ratio 20-40 ml per litre of water.',
  '{"volume": "5 Litres Can", "dilution": "20-40ml / Litre", "carton_qty": "4 Cans per Carton", "color": "Blue Transparent"}'::jsonb,
  320.00,
  390.00,
  600,
  2,
  'Can of 5 Litres',
  false,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80']
),
-- 11. Floor Cleaner Concentrate 5L
(
  'p1000000-0000-0000-0000-000000000011',
  'c1000000-0000-0000-0000-000000000003',
  'Heavy Duty Floor Cleaner Concentrate 5 Litres (Citrus)',
  'floor-cleaner-concentrate-5-litres-citrus',
  'CC-CLN-011',
  'Neutral pH floor cleaning solution safe for Italian marble, vitrified tiles, wooden flooring, and granite. Leaves a pleasant long-lasting fragrance.',
  '{"volume": "5 Litres Can", "dilution": "10-20ml / Litre", "carton_qty": "4 Cans per Carton", "fragrance": "Sparkling Citrus"}'::jsonb,
  340.00,
  420.00,
  800,
  2,
  'Can of 5 Litres',
  false,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80']
),
-- 12. Disinfectant Multi-Surface Spray 500ml
(
  'p1000000-0000-0000-0000-000000000012',
  'c1000000-0000-0000-0000-000000000003',
  'Disinfectant Multi-Surface Spray 500 ml with Trigger',
  'disinfectant-multi-surface-spray-500ml',
  'CC-CLN-012',
  'Hospitality-grade sanitizing spray for door knobs, remote controls, elevator buttons, and bathroom fittings.',
  '{"volume": "500 ml with Trigger", "carton_qty": "24 Bottles per Box", "kill_rate": "99.9% Bacteria & Viruses"}'::jsonb,
  85.00,
  105.00,
  1200,
  12,
  'Pack of 12 Bottles',
  false,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80']
),
-- 13. Heavy Duty Dustbin Liners
(
  'p1000000-0000-0000-0000-000000000013',
  'c1000000-0000-0000-0000-000000000004',
  'Heavy Duty Dustbin Liners (Black, 29x39 inch, 100 pcs)',
  'dustbin-liners-black-29x39-inch-100pcs',
  'CC-HSK-013',
  'High-density virgin polymer garbage bags with star-seal bottom leak protection. Puncture-resistant for guest room and kitchen bins.',
  '{"size": "29 x 39 Inches (Large)", "micron": "35 Microns", "count": "100 Bags per Roll", "color": "Black"}'::jsonb,
  240.00,
  290.00,
  2500,
  5,
  'Pack of 100 Bags',
  false,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80']
),
-- 14. Premium White Bath Towel 600 GSM
(
  'p1000000-0000-0000-0000-000000000014',
  'c1000000-0000-0000-0000-000000000002',
  'Premium White Bath Towel 600 GSM 100% Cotton (Pack of 10)',
  'bath-towel-600-gsm-white-cotton-pack-10',
  'CC-GRM-014',
  'Institutional 100% ring-spun combed cotton bath towel. Double stitched edges prevent fraying during industrial laundering.',
  '{"gsm": "600 GSM", "dimensions": "70 x 140 cm", "material": "100% Ring Spun Cotton", "color": "Optical White"}'::jsonb,
  3200.00,
  3800.00,
  500,
  1,
  'Pack of 10 Towels',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80']
),
-- 15. Hotel Slippers
(
  'p1000000-0000-0000-0000-000000000015',
  'c1000000-0000-0000-0000-000000000002',
  'Disposable Non-Woven Hotel Slippers (Closed Toe, 100 Pairs)',
  'disposable-hotel-slippers-closed-toe-100-pairs',
  'CC-GRM-015',
  'Soft non-woven fabric with 4mm anti-slip EVA sole. Individually sealed in hygienic polybag. Suitable for luxury hotels and spas.',
  '{"sole": "4mm Anti-skid EVA", "upper": "80 GSM Non-woven", "size": "Universal Free Size (28 cm)", "carton_qty": "100 Pairs"}'::jsonb,
  1850.00,
  2200.00,
  1500,
  1,
  'Carton of 100 Pairs',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80']
),
-- 16. Emergency Sewing Kit
(
  'p1000000-0000-0000-0000-000000000016',
  'c1000000-0000-0000-0000-000000000002',
  'Emergency Sewing Kit in Kraft Envelope, Pack of 200',
  'emergency-sewing-kit-envelope-pack-200',
  'CC-GRM-016',
  '6 pre-threaded coloured cotton threads, 1 needle, 2 pearl buttons, and 1 safety pin packed in flat kraft card envelope.',
  '{"contents": "6 Threads, Needle, 2 Buttons, Safety Pin", "packaging": "Recyclable Kraft Paper", "carton_qty": "200 Kits"}'::jsonb,
  3.50,
  4.50,
  10000,
  200,
  'Pack of 200 Kits',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80']
),
-- 17. Wooden Vanity Comb
(
  'p1000000-0000-0000-0000-000000000017',
  'c1000000-0000-0000-0000-000000000002',
  'Wooden Vanity Comb in Paper Sleeve, Pack of 100',
  'wooden-vanity-comb-sleeve-pack-100',
  'CC-GRM-017',
  'Smooth-polished birchwood hair comb with rounded anti-static teeth. Plastic-free sustainable guest amenity.',
  '{"material": "Natural Birchwood", "length": "14 cm", "packaging": "Printed Butter Paper Sleeve", "carton_qty": "100 Combs"}'::jsonb,
  4.80,
  6.00,
  9000,
  100,
  'Pack of 100 Combs',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?auto=format&fit=crop&w=800&q=80']
),
-- 18. Vanity Kit
(
  'p1000000-0000-0000-0000-000000000018',
  'c1000000-0000-0000-0000-000000000002',
  'Vanity Kit (Cotton Buds + Cotton Pads + Emery Board)',
  'vanity-kit-cotton-pads-buds-pack-100',
  'CC-GRM-018',
  'Includes 3 pure bamboo cotton buds, 2 round soft cotton makeup pads, and 1 mini emery nail file in compact box.',
  '{"contents": "3 Buds, 2 Cotton Pads, 1 Emery Board", "packaging": "Card Box", "carton_qty": "100 Kits"}'::jsonb,
  5.20,
  6.50,
  12000,
  100,
  'Pack of 100 Kits',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80']
),
-- 19. Facial Tissue Box 2-Ply
(
  'p1000000-0000-0000-0000-000000000019',
  'c1000000-0000-0000-0000-000000000004',
  'Facial Tissue Box 2-Ply (100 Pulls per Box, Pack of 24)',
  'facial-tissue-box-2ply-pack-24',
  'CC-HSK-019',
  'Ultra-soft 100% virgin pulp facial tissues with superior absorption. Clean popup dispensing box for guest rooms and conference halls.',
  '{"ply": "2-Ply", "pulls": "100 Pulls per Box", "carton_qty": "24 Boxes", "sheet_size": "20 x 20 cm"}'::jsonb,
  960.00,
  1150.00,
  800,
  1,
  'Carton of 24 Boxes',
  false,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80']
),
-- 20. Room Freshener Spray 250 ml
(
  'p1000000-0000-0000-0000-000000000020',
  'c1000000-0000-0000-0000-000000000004',
  'Citrus Essential Room Freshener Spray 250 ml (Pack of 6)',
  'citrus-room-freshener-spray-250ml-pack-6',
  'CC-HSK-020',
  'Long-lasting aromatic room deodorizer with natural essential oils. Eliminates musty odours and tobacco smells in guest corridors.',
  '{"volume": "250 ml per Can", "fragrance": "Sweet Citrus & Bergamot", "carton_qty": "6 Cans per Pack"}'::jsonb,
  720.00,
  850.00,
  650,
  1,
  'Pack of 6 Cans',
  false,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80']
);

-- 4. BULK PRICE TIERS (Sample tiers for volume purchase)
INSERT INTO bulk_prices (product_id, min_qty, price) VALUES
-- Dish Wash + 5L
('p1000000-0000-0000-0000-000000000101', 4, 360.00),
('p1000000-0000-0000-0000-000000000101', 12, 330.00),
('p1000000-0000-0000-0000-000000000101', 30, 299.00),

-- Magic Cleaner 1L
('p1000000-0000-0000-0000-000000000102', 6, 160.00),
('p1000000-0000-0000-0000-000000000102', 24, 140.00),
('p1000000-0000-0000-0000-000000000102', 60, 125.00),

-- Furniture Cleaner 300ml
('p1000000-0000-0000-0000-000000000103', 12, 130.00),
('p1000000-0000-0000-0000-000000000103', 48, 115.00),
('p1000000-0000-0000-0000-000000000103', 120, 99.00),

-- Toilet Cleaner 10x Power 5L
('p1000000-0000-0000-0000-000000000104', 4, 380.00),
('p1000000-0000-0000-0000-000000000104', 12, 350.00),
('p1000000-0000-0000-0000-000000000104', 30, 310.00),

-- Phenolic Cleaner 5L
('p1000000-0000-0000-0000-000000000105', 4, 325.00),
('p1000000-0000-0000-0000-000000000105', 12, 295.00),
('p1000000-0000-0000-0000-000000000105', 30, 265.00),

-- Shampoo 30ml
('p1000000-0000-0000-0000-000000000001', 500, 7.80),
('p1000000-0000-0000-0000-000000000001', 1000, 7.20),
('p1000000-0000-0000-0000-000000000001', 5000, 6.50),

-- Conditioner 30ml
('p1000000-0000-0000-0000-000000000002', 500, 8.20),
('p1000000-0000-0000-0000-000000000002', 1000, 7.60),

-- Body Lotion 30ml
('p1000000-0000-0000-0000-000000000003', 500, 8.70),
('p1000000-0000-0000-0000-000000000003', 1000, 8.00),

-- Bath Soap 20g
('p1000000-0000-0000-0000-000000000004', 1000, 3.80),
('p1000000-0000-0000-0000-000000000004', 5000, 3.40),

-- Dental Kit
('p1000000-0000-0000-0000-000000000005', 500, 7.20),
('p1000000-0000-0000-0000-000000000005', 1000, 6.60),

-- Floor Cleaner 5L
('p1000000-0000-0000-0000-000000000011', 10, 310.00),
('p1000000-0000-0000-0000-000000000011', 25, 290.00);

-- 5. SAMPLE DISCOUNTS & COUPONS
INSERT INTO discounts (id, name, type, value, applies_to, coupon_code, min_cart_value, usage_limit, used_count, is_active) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Bulk Purchase Discount (10% Off)', 'percent', 10.00, 'cart', 'BULK10', 10000.00, 500, 42, true),
  ('d1000000-0000-0000-0000-000000000002', 'Festive Season Offer (5% Flat)', 'percent', 5.00, 'cart', 'FESTIVE5', 3000.00, 1000, 88, true);

-- 6. APPROVED REVIEWS (From Real Hospitality Managers)
INSERT INTO reviews (product_id, reviewer_name, hotel_name, rating, comment, is_approved, is_verified, created_at) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Vikram Malhotra', 'Grand Heritage Palace, Jaipur', 5, 'Consistently reliable quality across our last 6 batch orders. The customized logo printing on the 30ml bottles was sharp and leak-proof.', true, true, NOW() - INTERVAL '12 days'),
  ('p1000000-0000-0000-0000-000000000005', 'Sunita Rao', 'The Bayview Resort, Goa', 5, 'Switching to their bamboo dental kits helped us achieve our sustainability pledge. Guests frequently compliment the packaging.', true, true, NOW() - INTERVAL '18 days'),
  ('p1000000-0000-0000-0000-000000000011', 'Arun Kulkarni', 'Silver Sands Business Hotel, Pune', 5, 'The 5L floor cleaner concentrate has reduced our housekeeping chemical cost by nearly 25% without compromising shine on Italian marble.', true, true, NOW() - INTERVAL '25 days'),
  ('p1000000-0000-0000-0000-000000000004', 'Rajeev Menon', 'Kovalam Palm Tree Retreat, Kerala', 5, 'Soap bars do not get soggy in humid bathroom conditions. Prompt dispatch within 3 days via WhatsApp order.', true, true, NOW() - INTERVAL '5 days');
