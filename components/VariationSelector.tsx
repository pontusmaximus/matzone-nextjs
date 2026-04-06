'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart';
import { useShopCountry } from '@/lib/shop-country';
import { formatLocalPrice } from '@/lib/shipping';
import type { WCProduct, WCVariation, WCAttribute } from '@/types/woocommerce';
import type { Locale } from '@/i18n';

interface VariationSelectorProps {
  product: WCProduct;
  variations: WCVariation[];
  locale: Locale;
}

export default function VariationSelector({ product, variations, locale }: VariationSelectorProps) {
  const t = useTranslations('product');
  const { addItem } = useCart();
  const { country } = useShopCountry();
  const shopCountry = country ?? locale;

  // Only show variation-attributes (the ones that change between variations)
  const variationAttributes = product.attributes.filter(a => a.variation);

  // State: selected option per attribute
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variationAttributes.forEach(attr => {
      initial[attr.name] = '';
    });
    return initial;
  });

  // Auto-select first option for each attribute
  useEffect(() => {
    const initial: Record<string, string> = {};
    variationAttributes.forEach(attr => {
      initial[attr.name] = attr.options[0] ?? '';
    });
    setSelected(initial);
  }, [product.id]);

  // Find matching variation
  const matchedVariation = useMemo(() => {
    if (variationAttributes.length === 0) return null;
    const allSelected = variationAttributes.every(a => selected[a.name]);
    if (!allSelected) return null;

    return variations.find(v =>
      variationAttributes.every(attr => {
        const vAttr = v.attributes.find(a => a.name === attr.name);
        // Empty option in variation = "any" (matches all)
        if (!vAttr || vAttr.option === '') return true;
        return vAttr.option === selected[attr.name];
      })
    ) ?? null;
  }, [selected, variations, variationAttributes]);

  const isVariable = product.type === 'variable';
  const currentPrice = matchedVariation?.price ?? product.price;
  const currentRegularPrice = matchedVariation?.regular_price ?? product.regular_price;
  const currentSalePrice = matchedVariation?.sale_price ?? product.sale_price;
  const isOnSale = matchedVariation ? matchedVariation.on_sale : product.on_sale;
  const isOutOfStock = isVariable
    ? (matchedVariation ? matchedVariation.stock_status === 'outofstock' : true)
    : product.stock_status === 'outofstock';
  const canAddToCart = isVariable ? !!matchedVariation && !isOutOfStock : !isOutOfStock;

  const handleSelect = (attrName: string, value: string) => {
    setSelected(prev => ({ ...prev, [attrName]: value }));
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addItem(
      { ...product, price: currentPrice },
      1,
      matchedVariation?.id,
      isVariable ? selected : undefined
    );
  };

  return (
    <div>
      {/* Price */}
      <div className="mb-6">
        {isOnSale && currentSalePrice ? (
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-medium">{formatLocalPrice(parseFloat(currentSalePrice), shopCountry)}</span>
            <span className="text-[18px] text-gray-400 line-through">{formatLocalPrice(parseFloat(currentRegularPrice), shopCountry)}</span>
          </div>
        ) : (
          <span className="text-[28px] font-medium">{formatLocalPrice(parseFloat(currentPrice), shopCountry)}</span>
        )}
      </div>

      {/* Variation selectors */}
      {variationAttributes.map(attr => (
        <div key={attr.name} className="mb-5">
          <label className="block text-[12px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-2">
            {attr.name}
            {selected[attr.name] && (
              <span className="ml-2 text-black normal-case tracking-normal font-normal">
                — {selected[attr.name]}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {attr.options.map(option => {
              const isActive = selected[attr.name] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(attr.name, option)}
                  className={`px-4 py-2.5 text-[13px] border transition-colors ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Non-variation attributes (display only) */}
      {product.attributes.filter(a => !a.variation && a.visible).map(attr => (
        <div key={attr.name} className="mb-4 flex items-center gap-2 text-[13px] text-gray-500">
          <span className="font-medium text-gray-700">{attr.name}:</span>
          <span>{attr.options.join(', ')}</span>
        </div>
      ))}

      {/* Stock status */}
      {isVariable && matchedVariation && (
        <p className={`text-[12px] mb-4 ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
          {isOutOfStock ? t('outOfStock') : t('inStock')}
        </p>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className="w-full bg-black text-white py-4 text-[13px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isOutOfStock ? t('outOfStock') : t('addToCart')}
      </button>
    </div>
  );
}
