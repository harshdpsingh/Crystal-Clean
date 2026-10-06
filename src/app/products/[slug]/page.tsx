import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import {
  getProductBySlug,
  getProducts,
  getApprovedReviews,
  getSettings,
} from "@/lib/supabase/admin";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Crystal Clean",
    };
  }

  const title = `${product.name} (SKU: ${product.sku})`;
  const description = product.description.substring(0, 155);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Crystal Clean Hotel Amenities`,
      description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [allCategoryProducts, reviews, settings] = await Promise.all([
    getProducts({ categoryId: product.category_id }),
    getApprovedReviews(product.id),
    getSettings(),
  ]);

  const relatedProducts = allCategoryProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
      settings={settings}
    />
  );
}
