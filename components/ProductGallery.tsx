'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { WCImage } from '@/types/woocommerce';

interface ProductGalleryProps {
  images: WCImage[];
  productName: string;
  variationImage?: string;
}

export default function ProductGallery({ images, productName, variationImage }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // When variation image changes, show it as main image
  const [overrideSrc, setOverrideSrc] = useState<string | undefined>(variationImage);
  useEffect(() => {
    if (variationImage) {
      setOverrideSrc(variationImage);
      setActiveIndex(-1); // -1 = showing override
    }
  }, [variationImage]);

  const handleThumbClick = (i: number) => {
    setActiveIndex(i);
    setOverrideSrc(undefined);
  };

  if (!images.length && !overrideSrc) {
    return <div className="aspect-[4/3] bg-gray-100" />;
  }

  const mainSrc = activeIndex === -1 && overrideSrc
    ? overrideSrc
    : images[activeIndex]?.src ?? images[0]?.src;
  const mainAlt = activeIndex === -1
    ? productName
    : images[activeIndex]?.alt || productName;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden cursor-zoom-in group">
        <Image
          src={mainSrc}
          alt={mainAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {(images.length > 1 || overrideSrc) && (
        <div className="grid grid-cols-5 gap-2">
          {/* Variation image thumb */}
          {overrideSrc && !images.some(img => img.src === overrideSrc) && (
            <button
              onClick={() => { setActiveIndex(-1); setOverrideSrc(overrideSrc); }}
              className={`aspect-square bg-gray-100 relative overflow-hidden border-2 transition-colors ${
                activeIndex === -1 ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image src={overrideSrc} alt={productName} fill className="object-cover" sizes="10vw" />
            </button>
          )}
          {images.slice(0, overrideSrc ? 4 : 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => handleThumbClick(i)}
              className={`aspect-square bg-gray-100 relative overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image src={img.src} alt={img.alt || productName} fill className="object-cover" sizes="10vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
