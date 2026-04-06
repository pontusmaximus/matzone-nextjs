'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart';
import { useShopCountry } from '@/lib/shop-country';
import { shippingZones, formatLocalPrice } from '@/lib/shipping';
import type { Locale } from '@/i18n';

interface CheckoutFormProps {
  locale: Locale;
}

export default function CheckoutForm({ locale }: CheckoutFormProps) {
  const t = useTranslations('checkout');
  const tc = useTranslations('cart');
  const { items, totalPrice, clearCart } = useCart();
  const { country } = useShopCountry();
  const shopCountry = country ?? locale;
  const zone = shippingZones[shopCountry];

  const [submitted, setSubmitted] = useState(false);

  const subtotalEur = totalPrice();
  const hasFreeThreshold = zone.freeFrom > 0;
  const freeFromEur = hasFreeThreshold ? zone.freeFrom / zone.exchangeRate : 0;
  const isFreeShipping = hasFreeThreshold && subtotalEur >= freeFromEur;
  const shippingCostEur = isFreeShipping ? 0 : zone.flat / zone.exchangeRate;
  const grandTotalEur = subtotalEur + shippingCostEur;

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-[48px] mb-4">✓</p>
        <h2 className="font-serif text-[28px] mb-2">{t('thankYou')}</h2>
        <p className="text-[14px] text-gray-500 mb-6">{t('thankYouSub')}</p>
        <Link href={`/${locale}/shop`} className="text-[13px] border-b border-black pb-0.5 hover:text-gray-600 transition-colors">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-[15px] text-gray-500 mb-4">{tc('empty')}</p>
        <Link href={`/${locale}/shop`} className="text-[13px] border-b border-black pb-0.5">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with WooCommerce orders API or payment gateway
    clearCart();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        {/* Left: Address form */}
        <div className="space-y-8">
          {/* Contact */}
          <div>
            <h2 className="text-[14px] font-medium mb-4">{t('contactSection')}</h2>
            <input type="email" required placeholder={t('email')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-[14px] font-medium mb-4">{t('shippingSection')}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required placeholder={t('firstName')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
                <input type="text" required placeholder={t('lastName')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
              </div>
              <input type="text" placeholder={t('company')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
              <input type="text" required placeholder={t('street')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
              <div className="grid grid-cols-[120px_1fr] gap-3">
                <input type="text" required placeholder={t('zip')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
                <input type="text" required placeholder={t('city')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
              </div>
              <input type="text" required placeholder={t('country')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
              <input type="tel" placeholder={t('phonePlaceholder')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <h2 className="text-[14px] font-medium mb-4">{t('notesSection')}</h2>
            <textarea rows={3} placeholder={t('notesPlaceholder')} className="w-full border border-gray-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-black transition-colors resize-none" />
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="bg-white p-6 border border-gray-200 h-fit lg:sticky lg:top-24">
          <h2 className="text-[14px] font-medium mb-5 pb-4 border-b border-gray-100">{t('orderSummary')}</h2>

          {/* Items */}
          <div className="space-y-4 mb-5">
            {items.map(item => (
              <div key={`${item.product.id}-${item.variationId ?? 0}`} className="flex gap-3 items-start">
                <div className="w-14 h-14 bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] && (
                    <Image src={item.product.images[0].src} alt={item.product.name} fill className="object-cover" sizes="56px" />
                  )}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[9px] rounded-full flex items-center justify-center">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate">{item.product.name}</p>
                  {item.selectedOptions && (
                    <p className="text-[11px] text-gray-400">{Object.values(item.selectedOptions).join(' / ')}</p>
                  )}
                </div>
                <span className="text-[12px] font-medium">{formatLocalPrice(parseFloat(item.product.price) * item.qty, shopCountry)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-[13px]">
            <div className="flex justify-between text-gray-500">
              <span>{tc('subtotal')}</span>
              <span>{formatLocalPrice(subtotalEur, shopCountry)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>{t('shipping')}</span>
              <span className={isFreeShipping ? 'text-green-600' : ''}>
                {isFreeShipping ? t('freeShipping') : formatLocalPrice(shippingCostEur, shopCountry)}
              </span>
            </div>
            <div className="flex justify-between text-[15px] font-medium pt-3 border-t border-gray-100">
              <span>{t('total')}</span>
              <span>{formatLocalPrice(grandTotalEur, shopCountry)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 bg-black text-white py-4 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors"
          >
            {t('placeOrder')}
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-3">{t('secureNote')}</p>
        </div>
      </div>
    </form>
  );
}
