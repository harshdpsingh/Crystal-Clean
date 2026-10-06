import { createClient } from "@supabase/supabase-js";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DISCOUNTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_REQUESTS,
} from "../mockData";
import {
  Category,
  Product,
  Discount,
  Review,
  SettingsState,
  Customer,
  Order,
  CustomRequest,
  OrderItem,
} from "../types";

// In-memory fallback stores for smooth demo / offline dev
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryDiscounts: Discount[] = [...INITIAL_DISCOUNTS];
let memoryReviews: Review[] = [...INITIAL_REVIEWS];
let memoryCustomers: Customer[] = [...INITIAL_CUSTOMERS];
let memoryOrders: Order[] = [...INITIAL_ORDERS];
let memoryCustomRequests: CustomRequest[] = [...INITIAL_CUSTOM_REQUESTS];
let memorySettings: SettingsState = { ...INITIAL_SETTINGS };

let nextCustomerSeq = 3;
let nextOrderSeq = 1003;

export function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("your-project-id")) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// -------------------------------------------------------------
// DATA ACCESS FUNCTIONS (with Supabase query + Mock fallback)
// -------------------------------------------------------------

export async function getSettings(): Promise<SettingsState> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return memorySettings;

  try {
    const { data, error } = await supabase.from("settings").select("*");
    if (error || !data || data.length === 0) return memorySettings;

    const res: any = { ...memorySettings };
    data.forEach((row: any) => {
      res[row.key] = row.value;
    });
    return res;
  } catch {
    return memorySettings;
  }
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
  (memorySettings as any)[key] = value;
  const supabase = getAdminSupabaseClient();
  if (!supabase) return true;

  try {
    await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return memoryCategories.filter((c) => c.is_active);

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return memoryCategories.filter((c) => c.is_active);
    return data;
  } catch {
    return memoryCategories.filter((c) => c.is_active);
  }
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return memoryCategories;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return memoryCategories;
    return data;
  } catch {
    return memoryCategories;
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  customizableOnly?: boolean;
  onOfferOnly?: boolean;
  searchQuery?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
}): Promise<Product[]> {
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    let items = [...memoryProducts].filter((p) => p.is_active);

    if (options?.categoryId) {
      items = items.filter((p) => p.category_id === options.categoryId);
    } else if (options?.categorySlug) {
      const cat = memoryCategories.find((c) => c.slug === options.categorySlug);
      if (cat) {
        items = items.filter((p) => p.category_id === cat.id);
      }
    }

    if (options?.featuredOnly) {
      items = items.filter((p) => p.is_featured);
    }
    if (options?.customizableOnly) {
      items = items.filter((p) => p.is_customizable);
    }
    if (options?.onOfferOnly) {
      items = items.filter((p) => p.old_price && p.old_price > p.price);
    }
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (options?.sortBy === "price_asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (options?.sortBy === "price_desc") {
      items.sort((a, b) => b.price - a.price);
    } else if (options?.sortBy === "popular") {
      items.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    }

    return items;
  }

  try {
    let query = supabase
      .from("products")
      .select("*, bulk_prices(*), category:categories(*)")
      .eq("is_active", true);

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }
    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }
    if (options?.customizableOnly) {
      query = query.eq("is_customizable", true);
    }

    if (options?.sortBy === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (options?.sortBy === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error || !data) return memoryProducts.filter((p) => p.is_active);
    return data;
  } catch {
    return memoryProducts.filter((p) => p.is_active);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return memoryProducts.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, bulk_prices(*), category:categories(*)")
      .eq("slug", slug)
      .single();
    if (error || !data) return memoryProducts.find((p) => p.slug === slug) || null;
    return data;
  } catch {
    return memoryProducts.find((p) => p.slug === slug) || null;
  }
}

export async function getDiscounts(): Promise<Discount[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return memoryDiscounts.filter((d) => d.is_active);

  try {
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("is_active", true);
    if (error || !data) return memoryDiscounts.filter((d) => d.is_active);
    return data;
  } catch {
    return memoryDiscounts.filter((d) => d.is_active);
  }
}

export async function getDiscountByCode(code: string): Promise<Discount | null> {
  const cleanCode = code.trim().toUpperCase();
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return memoryDiscounts.find((d) => d.coupon_code?.toUpperCase() === cleanCode && d.is_active) || null;
  }

  try {
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("coupon_code", cleanCode)
      .eq("is_active", true)
      .single();
    if (error || !data) {
      return memoryDiscounts.find((d) => d.coupon_code?.toUpperCase() === cleanCode && d.is_active) || null;
    }
    return data;
  } catch {
    return memoryDiscounts.find((d) => d.coupon_code?.toUpperCase() === cleanCode && d.is_active) || null;
  }
}

export async function getApprovedReviews(productId?: string): Promise<Review[]> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    if (productId) {
      return memoryReviews.filter((r) => r.product_id === productId && r.is_approved);
    }
    return memoryReviews.filter((r) => r.is_approved);
  }

  try {
    let q = supabase.from("reviews").select("*").eq("is_approved", true);
    if (productId) {
      q = q.eq("product_id", productId);
    }
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error || !data) {
      return memoryReviews.filter((r) => (!productId || r.product_id === productId) && r.is_approved);
    }
    return data;
  } catch {
    return memoryReviews.filter((r) => (!productId || r.product_id === productId) && r.is_approved);
  }
}

export async function createReview(review: Omit<Review, "id" | "is_approved" | "is_verified" | "created_at">): Promise<Review> {
  const newReview: Review = {
    id: `r-${Date.now()}`,
    ...review,
    is_approved: false, // Hidden until admin approval
    is_verified: false,
    created_at: new Date().toISOString(),
  };

  memoryReviews.unshift(newReview);
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("reviews").insert([newReview]);
    } catch (e) {
      console.error("Supabase review insert error:", e);
    }
  }

  return newReview;
}

export async function createCustomRequest(request: Omit<CustomRequest, "id" | "status" | "created_at">): Promise<CustomRequest> {
  const newReq: CustomRequest = {
    id: `cr-${Date.now()}`,
    ...request,
    status: "New",
    created_at: new Date().toISOString(),
  };

  memoryCustomRequests.unshift(newReq);
  const supabase = getAdminSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("custom_requests").insert([newReq]);
    } catch (e) {
      console.error("Supabase custom request insert error:", e);
    }
  }

  return newReq;
}

// -------------------------------------------------------------
// SECURE ORDER CREATION WITH SERVER-SIDE RE-CALCULATION
// -------------------------------------------------------------

export interface CreateOrderPayload {
  name: string;
  hotel_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  gst_number?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  coupon_code?: string;
}

export async function processAndSaveOrder(payload: CreateOrderPayload): Promise<{
  order: Order;
  customer: Customer;
  items: OrderItem[];
  isReturningCustomer: boolean;
}> {
  const supabase = getAdminSupabaseClient();
  const cleanPhone = payload.phone.replace(/[^0-9]/g, "");

  // 1. Fetch current live products from DB or memory to re-calculate prices securely
  const allProducts = await getProducts();
  const orderItems: OrderItem[] = [];
  let subtotal = 0;

  for (const requestedItem of payload.items) {
    const product = allProducts.find((p) => p.id === requestedItem.productId);
    if (!product) {
      throw new Error(`Product not found: ID ${requestedItem.productId}`);
    }

    if (requestedItem.quantity < product.min_order_qty) {
      throw new Error(
        `Minimum order quantity for ${product.name} is ${product.min_order_qty} units.`
      );
    }

    // Determine unit price based on bulk pricing tiers
    let unitPrice = Number(product.price);
    if (product.bulk_prices && product.bulk_prices.length > 0) {
      const sortedTiers = [...product.bulk_prices].sort((a, b) => b.min_qty - a.min_qty);
      for (const tier of sortedTiers) {
        if (requestedItem.quantity >= tier.min_qty) {
          unitPrice = Number(tier.price);
          break;
        }
      }
    }

    const lineTotal = unitPrice * requestedItem.quantity;
    subtotal += lineTotal;

    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      qty: requestedItem.quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
      sku: product.sku,
      pack_size: product.pack_size,
    });
  }

  // 2. Validate and calculate discount
  let discountAmount = 0;
  let validCouponCode: string | undefined = undefined;

  if (payload.coupon_code) {
    const discount = await getDiscountByCode(payload.coupon_code);
    if (discount && discount.is_active) {
      if (!discount.min_cart_value || subtotal >= discount.min_cart_value) {
        if (discount.type === "percent") {
          discountAmount = (subtotal * discount.value) / 100;
        } else if (discount.type === "flat") {
          discountAmount = Math.min(discount.value, subtotal);
        }
        validCouponCode = discount.coupon_code;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount);

  // 3. Customer lookup by unique phone
  let customer: Customer;
  let isReturningCustomer = false;

  const existingCustomer = memoryCustomers.find(
    (c) => c.phone.replace(/[^0-9]/g, "") === cleanPhone
  );

  if (existingCustomer) {
    isReturningCustomer = true;
    existingCustomer.name = payload.name;
    existingCustomer.hotel_name = payload.hotel_name;
    existingCustomer.address = payload.address;
    existingCustomer.city = payload.city;
    existingCustomer.pincode = payload.pincode;
    if (payload.email) existingCustomer.email = payload.email;
    if (payload.gst_number) existingCustomer.gst_number = payload.gst_number;
    existingCustomer.total_orders += 1;
    existingCustomer.total_spent += grandTotal;
    customer = existingCustomer;
  } else {
    const custCode = `CUST-${String(nextCustomerSeq++).padStart(4, "0")}`;
    customer = {
      id: `cust-${Date.now()}`,
      customer_code: custCode,
      name: payload.name,
      hotel_name: payload.hotel_name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      city: payload.city,
      pincode: payload.pincode,
      gst_number: payload.gst_number,
      tag: "Standard",
      total_orders: 1,
      total_spent: grandTotal,
      created_at: new Date().toISOString(),
    };
    memoryCustomers.push(customer);
  }

  // 4. Create Order
  const orderCode = `ORD-${String(nextOrderSeq++).padStart(4, "0")}`;
  const order: Order = {
    id: `ord-${Date.now()}`,
    order_code: orderCode,
    customer_id: customer.id,
    customer: customer,
    subtotal: subtotal,
    discount_amount: discountAmount,
    coupon_code: validCouponCode,
    total: grandTotal,
    status: "New",
    notes: payload.notes,
    items: orderItems,
    created_at: new Date().toISOString(),
  };

  memoryOrders.unshift(order);

  // 5. Persist to Supabase if connected
  if (supabase) {
    try {
      // Upsert customer
      const { data: dbCust } = await supabase
        .from("customers")
        .upsert(
          {
            phone: customer.phone,
            name: customer.name,
            hotel_name: customer.hotel_name,
            email: customer.email,
            address: customer.address,
            city: customer.city,
            pincode: customer.pincode,
            gst_number: customer.gst_number,
            total_orders: customer.total_orders,
            total_spent: customer.total_spent,
          },
          { onConflict: "phone" }
        )
        .select()
        .single();

      const customerId = dbCust ? dbCust.id : customer.id;

      // Insert Order
      const { data: dbOrder } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          subtotal: order.subtotal,
          discount_amount: order.discount_amount,
          coupon_code: order.coupon_code,
          total: order.total,
          status: "New",
          notes: order.notes,
        })
        .select()
        .single();

      if (dbOrder) {
        order.id = dbOrder.id;
        order.order_code = dbOrder.order_code || order.order_code;

        // Insert Order Items
        const itemsToInsert = orderItems.map((item) => ({
          order_id: dbOrder.id,
          product_id: item.product_id,
          product_name: item.product_name,
          qty: item.qty,
          unit_price: item.unit_price,
          line_total: item.line_total,
        }));

        await supabase.from("order_items").insert(itemsToInsert);
      }
    } catch (e) {
      console.error("Supabase order persistence error:", e);
    }
  }

  return {
    order,
    customer,
    items: orderItems,
    isReturningCustomer,
  };
}

// -------------------------------------------------------------
// STATUS-ONLY ORDER TRACKING (Privacy preserved)
// -------------------------------------------------------------

export async function trackOrderStatus(
  orderCode: string,
  phone: string
): Promise<{ orderCode: string; status: string; createdAt: string } | null> {
  const cleanOrderCode = orderCode.trim().toUpperCase();
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    const found = memoryOrders.find(
      (o) =>
        o.order_code.toUpperCase() === cleanOrderCode &&
        o.customer?.phone.replace(/[^0-9]/g, "").endsWith(cleanPhone.slice(-10))
    );
    if (!found) return null;
    return {
      orderCode: found.order_code,
      status: found.status,
      createdAt: found.created_at,
    };
  }

  try {
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("order_code, status, created_at, customer:customers(phone)")
      .eq("order_code", cleanOrderCode)
      .single();

    if (error || !orderData) return null;

    const custPhone = ((orderData.customer as any)?.phone || "").replace(/[^0-9]/g, "");
    if (!custPhone.endsWith(cleanPhone.slice(-10))) {
      return null;
    }

    return {
      orderCode: orderData.order_code,
      status: orderData.status,
      createdAt: orderData.created_at,
    };
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// ADMIN DATA ACCESS HELPERS
// -------------------------------------------------------------

export async function getAdminDashboardStats() {
  const allOrders = memoryOrders;
  const allCustomers = memoryCustomers;
  const allProducts = memoryProducts;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const ordersToday = allOrders.filter((o) => new Date(o.created_at).getTime() >= startOfDay);
  const ordersThisMonth = allOrders.filter((o) => new Date(o.created_at).getTime() >= startOfMonth);

  const revenueThisMonth = ordersThisMonth
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const newCustomersThisMonth = allCustomers.filter(
    (c) => new Date(c.created_at).getTime() >= startOfMonth
  ).length;

  const lowStockProducts = allProducts.filter((p) => p.stock < 500);

  return {
    ordersTodayCount: ordersToday.length,
    ordersThisMonthCount: ordersThisMonth.length,
    revenueThisMonth,
    newCustomersCount: newCustomersThisMonth,
    lowStockProducts,
    recentOrders: allOrders.slice(0, 10),
  };
}

export async function getAdminOrders(statusFilter?: string): Promise<Order[]> {
  if (statusFilter && statusFilter !== "all") {
    return memoryOrders.filter((o) => o.status === statusFilter);
  }
  return memoryOrders;
}

export async function getAdminOrderById(id: string): Promise<Order | null> {
  return memoryOrders.find((o) => o.id === id || o.order_code === id) || null;
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: any,
  adminNotes?: string
): Promise<boolean> {
  const order = memoryOrders.find((o) => o.id === orderId || o.order_code === orderId);
  if (order) {
    order.status = status;
    if (adminNotes !== undefined) order.admin_notes = adminNotes;
    return true;
  }
  return false;
}

export async function getAdminCustomers(): Promise<Customer[]> {
  return memoryCustomers;
}

export async function getAdminReviews(): Promise<Review[]> {
  return memoryReviews;
}

export async function updateAdminReview(
  id: string,
  is_approved: boolean,
  is_verified?: boolean
): Promise<boolean> {
  const rev = memoryReviews.find((r) => r.id === id);
  if (rev) {
    rev.is_approved = is_approved;
    if (is_verified !== undefined) rev.is_verified = is_verified;
    return true;
  }
  return false;
}

export async function deleteAdminReview(id: string): Promise<boolean> {
  memoryReviews = memoryReviews.filter((r) => r.id !== id);
  return true;
}

export async function getAdminCustomRequests(): Promise<CustomRequest[]> {
  return memoryCustomRequests;
}

export async function updateAdminCustomRequestStatus(
  id: string,
  status: any
): Promise<boolean> {
  const req = memoryCustomRequests.find((r) => r.id === id);
  if (req) {
    req.status = status;
    return true;
  }
  return false;
}
