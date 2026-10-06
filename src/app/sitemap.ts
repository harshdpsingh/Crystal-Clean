import { MetadataRoute } from "next";
import { INITIAL_PRODUCTS } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crystalclean.in";

  const staticPages = [
    "",
    "/products",
    "/custom-order",
    "/track-order",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productPages = INITIAL_PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
