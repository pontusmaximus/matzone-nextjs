'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/woocommerce';
import type { WCProduct } from '@/types/woocommerce';
import type { Locale } from '@/i18n';

interface ProductCardProps {
  product: WCProduct;
  locale: Locale;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('products');
  const { addItem } = useCart();

  const isSale =
    product.on_sale &&
    product.sale_price &&
    parseFloat(product.sale_price) < parseFloat(product.regular_price);
  const isNew = product.id > 7000;
  const isOutOfStock = product.stock_status === 'outofstock';
  const colorOptions = product.attributes.find(a =>
    a.name.toLowerCase().includes('farbe') || a.name.toLowerCase().includes('color')
  )?.options ?? [];

  return (
    <div className="group cursor-pointer relative bg-white">
      {/* Image */}
      <Link href={`/${locale}/shop/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].src}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-xs">No image</span>
            </div>
          )}

          {/* Badge */}
          {isSale && (
            <span className="absolute top-3 left-3 bg-red-700 text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 z-10">
              {t('sale')}
            </span>
          )}
          {!isSale && isNew && (
            <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 z-10">
              {t('new')}
            </span>
          )}

          {/* Quick Add */}
          <button
            onClick={e => {
              e.preventDefault();
              if (!isOutOfStock) addItem(product);
            }}
            disabled={isOutOfStock}
            className="absolute bottom-0 left-0 right-0 bg-black/90 text-white py-3.5 text-[11px] font-medium tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-250 z-10 disabled:bg-gray-400"
          >
            {isOutOfStock ? t('outOfStock') : `+ ${t('addToCart')}`}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-3.5 pb-6">
        <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1.5">
          {product.categories?.[0]?.name}
        </p>
        <Link href={`/${locale}/shop/${product.slug}`}>
          <h3 className="text-[15px] font-normal text-black hover:text-gray-700 transition-colors mb-2 tracking-[-0.01em]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="text-[14px] font-medium">
            {formatPrice(product.price, locale)}
          </span>
          {isSale && (
            <span className="text-[13px] text-gray-400 line-through">
              {formatPrice(product.regular_price, locale)}
            </span>
          )}
        </div>
        {/* Color swatches */}
        {colorOptions.length > 0 && (
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {colorOptions.slice(0, 4).map(opt => (
              <span
                key={opt}
                className="text-[9px] px-2 py-1 border border-gray-200 text-gray-400 tracking-[0.04em]"
              >
                {opt}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
