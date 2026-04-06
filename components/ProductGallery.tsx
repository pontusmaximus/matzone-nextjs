'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { WCImage } from '@/types/woocommerce';

interface ProductGalleryProps {
  images: WCImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return <div className="aspect-[4/3] bg-gray-100" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden cursor-zoom-in group">
        <Image
          src={images[activeIndex].src}
          alt={images[activeIndex].alt || productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`aspect-square bg-gray-100 relative overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || productName}
                fill
                className="object-cover"
                sizes="10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
