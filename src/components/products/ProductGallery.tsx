"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const safeImages = images && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"];

  const [selectedImage, setSelectedImage] = useState(safeImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="relative w-full aspect-[4/5] bg-offwhite rounded-md border border-border overflow-hidden">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 aspect-square rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === img
                  ? "border-teal opacity-100"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
