import React, { Suspense } from "react";
import { Metadata } from "next";
import CatalogClient from "./CatalogClient";
import { getProducts, getCategories } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Commercial Hotel Amenities Catalog",
  description:
    "Explore our complete range of certified hotel guest toiletries, bathroom amenities, housekeeping chemicals, and custom branded supplies with direct bulk pricing.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    customizable?: string;
    offer?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-site mx-auto px-4 py-20 text-center text-xs text-body-muted">
          Loading commercial catalog...
        </div>
      }
    >
      <CatalogClient
        initialProducts={products}
        categories={categories}
        initialCategory={params.category}
        initialQuery={params.q}
      />
    </Suspense>
  );
}
