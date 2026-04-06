'use client';

import { useState } from 'react';
import ProductGallery from './ProductGallery';
import VariationSelector from './VariationSelector';
import type { WCProduct, WCVariation } from '@/types/woocommerce';
import type { Locale } from '@/i18n';

interface ProductDetailProps {
  product: WCProduct;
  variations: WCVariation[];
  locale: Locale;
}

export default function ProductDetail({ product, variations, locale }: ProductDetailProps) {
  const [variationImage, setVariationImage] = useState<string | undefined>();

  const handleVariationChange = (variation: WCVariation | null) => {
    if (variation?.image?.src) {
      setVariationImage(variation.image.src);
    } else {
      setVariationImage(undefined);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
      {/* Image Gallery — synced with variation */}
      <ProductGallery
        images={product.images}
        productName={product.name}
        variationImage={variationImage}
      />

      {/* Info */}
      <div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-gray-400 mb-3">
          {product.categories?.[0]?.name}
        </p>
        <h1 className="font-serif text-[28px] md:text-[36px] font-normal tracking-[-0.02em] mb-6">{product.name}</h1>

        <VariationSelector
          product={product}
          variations={variations}
          locale={locale}
          onVariationChange={handleVariationChange}
        />

        {/* Short Description */}
        {product.short_description && (
          <div
            className="mt-6 text-sm text-gray-600 leading-relaxed prose prose-sm"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {/* Trust badges */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🚚', label: 'DPD Versand', sub: 'EU-weit' },
            { icon: '↩️', label: '30 Tage Rückgabe', sub: 'Standardmaße' },
            { icon: '🇦🇹', label: 'Made in Austria', sub: 'Handgefertigt' },
          ].map(b => (
            <div key={b.label} className="text-center">
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="text-[11px] font-medium text-gray-700">{b.label}</div>
              <div className="text-[10px] text-gray-400">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
