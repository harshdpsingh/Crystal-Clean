export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
}

export interface BulkPriceTier {
  id?: string;
  product_id?: string;
  min_qty: number;
  price: number;
}

export interface ProductSpecifications {
  volume?: string;
  weight?: string;
  packaging?: string;
  carton_qty?: string;
  fragrance?: string;
  shelf_life?: string;
  material?: string;
  size?: string;
  gsm?: string;
  contents?: string;
  dilution?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  category_id: string;
  category?: Category;
  name: string;
  slug: string;
  sku: string;
  description: string;
  specifications: ProductSpecifications;
  price: number;
  old_price?: number;
  stock: number;
  min_order_qty: number;
  pack_size: string;
  is_customizable: boolean;
  is_featured: boolean;
  is_active: boolean;
  images: string[];
  bulk_prices?: BulkPriceTier[];
  avg_rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percent' | 'flat';
  value: number;
  applies_to: 'product' | 'category' | 'cart';
  product_id?: string;
  category_id?: string;
  coupon_code?: string;
  min_cart_value: number;
  usage_limit?: number;
  used_count: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Customer {
  id: string;
  customer_code: string;
  name: string;
  hotel_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  gst_number?: string;
  tag: 'Standard' | 'VIP' | 'Bulk buyer';
  notes?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  line_total: number;
  image?: string;
  sku?: string;
  pack_size?: string;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  order_code: string;
  customer_id: string;
  customer?: Customer;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  total: number;
  status: OrderStatus;
  notes?: string;
  admin_notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  product_name?: string;
  reviewer_name: string;
  hotel_name?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_verified: boolean;
  created_at: string;
}

export type CustomRequestStatus = 'New' | 'Quoted' | 'In production' | 'Done';

export interface CustomRequest {
  id: string;
  customer_id?: string;
  name: string;
  hotel_name: string;
  phone: string;
  product_type: string;
  quantity: number;
  details?: string;
  logo_url?: string;
  status: CustomRequestStatus;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SettingsState {
  business_name: string;
  tagline: string;
  whatsapp_number: string;
  phone: string;
  email: string;
  address: string;
  gst_number: string;
  announcement_bar: string;
  currency_symbol: string;
  min_order_default: string;
  catalog_pdf_url: string;
}
