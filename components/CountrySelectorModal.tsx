'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { shippingZones, countryToLanguage, type ShippingZone } from '@/lib/shipping';
import { useShopCountry } from '@/lib/shop-country';
import type { Locale } from '@/i18n';

interface Country {
  code: Locale;
  flag: string;
  name: string;
}

interface Region {
  label: string;
  countries: Country[];
}

const regions: Region[] = [
  {
    label: 'DACH',
    countries: [
      { code: 'de', flag: '🇩🇪', name: 'Deutschland' },
      { code: 'at', flag: '🇦🇹', name: 'Österreich' },
      { code: 'ch', flag: '🇨🇭', name: 'Schweiz' },
    ],
  },
  {
    label: 'Western Europe',
    countries: [
      { code: 'en', flag: '🇬🇧', name: 'United Kingdom' },
      { code: 'fr', flag: '🇫🇷', name: 'France' },
      { code: 'nl', flag: '🇳🇱', name: 'Nederland' },
      { code: 'be', flag: '🇧🇪', name: 'België' },
    ],
  },
  {
    label: 'Southern Europe',
    countries: [
      { code: 'it', flag: '🇮🇹', name: 'Italia' },
      { code: 'es', flag: '🇪🇸', name: 'España' },
      { code: 'pt', flag: '🇵🇹', name: 'Portugal' },
    ],
  },
  {
    label: 'Northern Europe',
    countries: [
      { code: 'sv', flag: '🇸🇪', name: 'Sverige' },
      { code: 'nb', flag: '🇳🇴', name: 'Norge' },
      { code: 'da', flag: '🇩🇰', name: 'Danmark' },
      { code: 'fi', flag: '🇫🇮', name: 'Suomi' },
    ],
  },
  {
    label: 'Eastern Europe',
    countries: [
      { code: 'pl', flag: '🇵🇱', name: 'Polska' },
      { code: 'cs', flag: '🇨🇿', name: 'Česko' },
      { code: 'hu', flag: '🇭🇺', name: 'Magyarország' },
      { code: 'ro', flag: '🇷🇴', name: 'România' },
    ],
  },
];

export default function CountrySelectorModal() {
  const { country, setCountry } = useShopCountry();
  const [visible, setVisible] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<Locale | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!country) setVisible(true);
  }, [country]);

  const select = (code: Locale) => {
    setCountry(code);
    setVisible(false);
    // Navigate to the default language for this country
    const lang = countryToLanguage[code];
    const segments = pathname.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
  };

  if (!visible) return null;

  const hoveredZone: ShippingZone | null = hoveredCode ? shippingZones[hoveredCode] : null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 bg-white w-[94vw] max-w-3xl max-h-[88vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="text-center pt-10 pb-6 px-6 flex-shrink-0">
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-gray-400 mb-3">
            <span translate="no">matzone</span>
          </p>
          <h2 className="font-serif text-[clamp(24px,3vw,40px)] font-normal tracking-[-0.02em] mb-2">
            Choose your region
          </h2>
          <p className="text-[13px] text-gray-400 max-w-sm mx-auto">
            Select your country for local currency and shipping.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {regions.map(region => (
            <div key={region.label} className="mb-8">
              <h3 className="text-[10px] font-medium tracking-[0.18em] uppercase text-gray-300 mb-3 border-b border-gray-100 pb-2">
                {region.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {region.countries.map(c => {
                  const zone = shippingZones[c.code];
                  return (
                    <button
                      key={c.code}
                      onClick={() => select(c.code)}
                      onMouseEnter={() => setHoveredCode(c.code)}
                      onMouseLeave={() => setHoveredCode(null)}
                      className="group text-left px-4 py-3 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-lg leading-none">{c.flag}</span>
                        <span className="text-[13px] font-medium text-black">{c.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {zone.currencySymbol} · {zone.carrier}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Hover preview bar */}
        {hoveredZone && (
          <div className="flex-shrink-0 bg-black text-white px-6 py-3 text-[11px] flex items-center justify-center gap-6 tracking-wide">
            <span>{hoveredZone.carrier}</span>
            <span className="text-gray-500">|</span>
            <span>{hoveredZone.estimatedDays}</span>
          </div>
        )}
      </div>
    </div>
  );
}
