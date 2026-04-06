'use client';

import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart';
import { useShopCountry } from '@/lib/shop-country';
import { shippingZones, formatLocalPrice } from '@/lib/shipping';
import type { Locale } from '@/i18n';

interface CartDrawerProps {
  locale: Locale;
}

export default function CartDrawer({ locale }: CartDrawerProps) {
  const t = useTranslations('cart');
  const { items, isOpen, closeCart, updateQty, totalPrice } = useCart();
  const { country } = useShopCountry();

  const shopCountry = country ?? locale;
  const zone = shippingZones[shopCountry];
  const subtotalEur = totalPrice();
  const hasFreeThreshold = zone.freeFrom > 0;
  const freeFromEur = hasFreeThreshold ? zone.freeFrom / zone.exchangeRate : 0;
  const isFreeShipping = hasFreeThreshold && subtotalEur >= freeFromEur;
  const remainingEur = hasFreeThreshold ? Math.max(0, freeFromEur - subtotalEur) : 0;
  const progress = hasFreeThreshold ? Math.min(100, (subtotalEur / freeFromEur) * 100) : 0;

  const shippingCostEur = isFreeShipping ? 0 : zone.flat / zone.exchangeRate;
  const grandTotalEur = subtotalEur + shippingCostEur;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[200] transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[420px] max-w-[100vw] bg-white z-[201] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
          <h2 className="text-[15px] font-medium">
            {t('title')} ({items.reduce((s, i) => s + i.qty, 0)})
          </h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-black transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && hasFreeThreshold && (
          <div className="px-7 pt-5 pb-4">
            {isFreeShipping ? (
              <p className="text-[12px] text-green-600 font-medium text-center">
                Kostenloser Versand aktiviert 🎉
              </p>
            ) : (
              <p className="text-[12px] text-gray-500 text-center mb-2">
                Noch <strong className="text-black">{formatLocalPrice(remainingEur, shopCountry)}</strong> bis kostenloser Versand
              </p>
            )}
            <div className="w-full h-1 bg-gray-100 overflow-hidden mt-1.5">
              <div
                className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-green-500' : 'bg-black'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm">{t('empty')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 items-start">
                  <div className="w-[72px] h-[54px] bg-gray-100 flex-shrink-0 relative overflow-hidden">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium leading-snug truncate">{item.product.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.product.categories?.[0]?.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-6 h-6 border border-gray-200 flex items-center justify-center hover:border-black transition-colors">
                        <Minus size={11} />
                      </button>
                      <span className="text-[13px] w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="w-6 h-6 border border-gray-200 flex items-center justify-center hover:border-black transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="text-[13px] font-medium whitespace-nowrap">
                    {formatLocalPrice(parseFloat(item.product.price) * item.qty, shopCountry)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-7 border-t border-gray-100">
            <div className="flex justify-between items-center text-[13px] text-gray-500 mb-2">
              <span>{t('subtotal')}</span>
              <span>{formatLocalPrice(subtotalEur, shopCountry)}</span>
            </div>
            <div className="flex justify-between items-center text-[13px] text-gray-500 mb-3">
              <span>Versand</span>
              <span className={isFreeShipping ? 'text-green-600' : ''}>
                {isFreeShipping ? 'Kostenlos' : formatLocalPrice(shippingCostEur, shopCountry)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[15px] font-medium mb-4 pt-3 border-t border-gray-100">
              <span>Gesamt</span>
              <span>{formatLocalPrice(grandTotalEur, shopCountry)}</span>
            </div>
            <button className="w-full bg-black text-white py-4 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors mb-2.5">
              {t('checkout')} →
            </button>
            <p className="text-center text-[11px] text-gray-400">{t('shippingNote')}</p>
          </div>
        )}
      </div>
    </>
  );
}
