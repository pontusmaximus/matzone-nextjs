'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart';
import type { WCProduct } from '@/types/woocommerce';
import type { Locale } from '@/i18n';

interface AddToCartButtonProps {
  product: WCProduct;
  locale: Locale;
}

export default function AddToCartButton({ product, locale }: AddToCartButtonProps) {
  const t = useTranslations('product');
  const { addItem } = useCart();
  const isOutOfStock = product.stock_status === 'outofstock';

  return (
    <button
      onClick={() => addItem(product)}
      disabled={isOutOfStock}
      className="w-full bg-black text-white py-4 text-[13px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {isOutOfStock ? t('outOfStock') : t('addToCart')}
    </button>
  );
}
