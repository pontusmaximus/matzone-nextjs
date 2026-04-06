'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart';
import { useShopCountry } from '@/lib/shop-country';
import { formatLocalPrice } from '@/lib/shipping';
import type { WCProduct, WCVariation } from '@/types/woocommerce';
import type { Locale } from '@/i18n';

interface VariationSelectorProps {
  product: WCProduct;
  variations: WCVariation[];
  locale: Locale;
  onVariationChange?: (variation: WCVariation | null) => void;
}

export default function VariationSelector({ product, variations, locale, onVariationChange }: VariationSelectorProps) {
  const t = useTranslations('product');
  const { addItem } = useCart();
  const { country } = useShopCountry();
  const shopCountry = country ?? locale;

  const variationAttributes = product.attributes.filter(a => a.variation);

  // Selected variation options
  const [selected, setSelected] = useState<Record<string, string>>({});

  // Custom dimensions
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const isCustomSize = width !== '' || length !== '';

  // Auto-select first option
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
        if (!vAttr || vAttr.option === '') return true;
        return vAttr.option === selected[attr.name];
      })
    ) ?? null;
  }, [selected, variations, variationAttributes]);

  // Notify parent about variation change (for image swap)
  useEffect(() => {
    onVariationChange?.(matchedVariation);
  }, [matchedVariation]);

  const isVariable = product.type === 'variable';
  const pricePerM2 = parseFloat(matchedVariation?.price ?? product.price);
  const regularPricePerM2 = parseFloat(matchedVariation?.regular_price ?? product.regular_price);
  const salePricePerM2 = parseFloat((matchedVariation?.sale_price ?? product.sale_price) || '0');
  const isOnSale = matchedVariation ? matchedVariation.on_sale : product.on_sale;
  const isOutOfStock = isVariable
    ? (matchedVariation ? matchedVariation.stock_status === 'outofstock' : true)
    : product.stock_status === 'outofstock';
  const canAddToCart = isVariable ? !!matchedVariation && !isOutOfStock : !isOutOfStock;

  // Calculate area-based price from custom dimensions
  const widthM = parseFloat(width) / 1000 || 0;
  const lengthM = parseFloat(length) / 1000 || 0;
  const areaM2 = widthM * lengthM;
  const hasCustomDimensions = widthM > 0 && lengthM > 0;

  const calculatedPrice = hasCustomDimensions ? pricePerM2 * areaM2 : pricePerM2;
  const calculatedRegularPrice = hasCustomDimensions ? regularPricePerM2 * areaM2 : regularPricePerM2;
  const calculatedSalePrice = hasCustomDimensions && salePricePerM2 > 0 ? salePricePerM2 * areaM2 : 0;

  const handleSelect = (attrName: string, value: string) => {
    setSelected(prev => ({ ...prev, [attrName]: value }));
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    const options = { ...selected };
    if (width) options['Breite (mm)'] = width;
    if (length) options['Länge (mm)'] = length;

    addItem(
      { ...product, price: String(calculatedPrice) },
      1,
      matchedVariation?.id,
      options
    );
  };

  return (
    <div>
      {/* Price */}
      <div className="mb-6">
        {hasCustomDimensions ? (
          <div>
            {isOnSale && calculatedSalePrice > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-medium">{formatLocalPrice(calculatedSalePrice, shopCountry)}</span>
                <span className="text-[18px] text-gray-400 line-through">{formatLocalPrice(calculatedRegularPrice, shopCountry)}</span>
              </div>
            ) : (
              <span className="text-[28px] font-medium">{formatLocalPrice(calculatedPrice, shopCountry)}</span>
            )}
            <p className="text-[11px] text-gray-400 mt-1">
              {areaM2.toFixed(2)} m² × {formatLocalPrice(pricePerM2, shopCountry)}/m²
            </p>
          </div>
        ) : (
          <div>
            {isOnSale && salePricePerM2 > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-medium">{formatLocalPrice(salePricePerM2, shopCountry)}</span>
                <span className="text-[18px] text-gray-400 line-through">{formatLocalPrice(regularPricePerM2, shopCountry)}</span>
              </div>
            ) : (
              <span className="text-[28px] font-medium">{formatLocalPrice(pricePerM2, shopCountry)}</span>
            )}
            <p className="text-[11px] text-gray-400 mt-1">{t('priceNote')}</p>
          </div>
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

      {/* Custom dimensions */}
      <div className="mb-5">
        <label className="block text-[12px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-2">
          {t('customSize')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">{t('widthMm')}</label>
            <input
              type="number"
              min="100"
              max="5000"
              step="1"
              value={width}
              onChange={e => setWidth(e.target.value)}
              placeholder="z.B. 800"
              className="w-full border border-gray-200 px-3 py-2.5 text-[13px] outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">{t('lengthMm')}</label>
            <input
              type="number"
              min="100"
              max="5000"
              step="1"
              value={length}
              onChange={e => setLength(e.target.value)}
              placeholder="z.B. 500"
              className="w-full border border-gray-200 px-3 py-2.5 text-[13px] outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
        {isCustomSize && (
          <p className="text-[11px] text-amber-600 mt-2 flex items-center gap-1">
            <span>⚠</span> {t('customSizeNote')}
          </p>
        )}
      </div>

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
