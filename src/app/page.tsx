import React from "react";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CustomBrandingSection from "@/components/home/CustomBrandingSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ClientLogos from "@/components/home/ClientLogos";
import CustomerReviews from "@/components/home/CustomerReviews";
import CtaBanner from "@/components/home/CtaBanner";
import {
  getSettings,
  getCategories,
  getProducts,
  getApprovedReviews,
} from "@/lib/supabase/admin";

export const revalidate = 60; // ISR revalidate

export default async function HomePage() {
  const [settings, categories, products, reviews] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featuredOnly: true }),
    getApprovedReviews(),
  ]);

  return (
    <div className="flex flex-col">
      <Hero settings={settings} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />
      <CustomBrandingSection />
      <WhyChooseUs />
      <ClientLogos />
      <CustomerReviews reviews={reviews} />
      <CtaBanner settings={settings} />
    </div>
  );
}
