import type { Locale } from '@/i18n';

export interface ShippingZone {
  freeFrom: number;
  flat: number;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  estimatedDays: string;
  carrier: string;
}

// Versandkosten basierend auf fussmatte.at/versandkosten-lieferzeiten/
// Carrier: DPD (bis 31kg), Spedition ab 31kg/1,65m
// Preise = DPD-Tarif (Standardversand bis 31kg)
// Kein kostenloser Versand laut fussmatte.at (freeFrom: 0 = deaktiviert)

export const shippingZones: Record<Locale, ShippingZone> = {
  // ── DACH ──
  at: { freeFrom: 0, flat: 12.50, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '2–4 Werktage', carrier: 'DPD' },
  de: { freeFrom: 0, flat: 15.00, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '2–4 Werktage', carrier: 'DPD' },
  ch: { freeFrom: 0, flat: 0,     currency: 'CHF', currencySymbol: 'CHF', exchangeRate: 0.94, estimatedDays: 'Auf Anfrage', carrier: 'Auf Anfrage' },

  // ── Western EU ──
  en: { freeFrom: 0, flat: 0,     currency: 'GBP', currencySymbol: '£', exchangeRate: 0.86, estimatedDays: 'Auf Anfrage', carrier: 'Auf Anfrage' },
  fr: { freeFrom: 0, flat: 35.00, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '5–8 jours ouvrés', carrier: 'DPD' },
  nl: { freeFrom: 0, flat: 35.00, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '4–7 werkdagen', carrier: 'DPD' },
  be: { freeFrom: 0, flat: 25.00, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '4–7 werkdagen', carrier: 'DPD' },

  // ── Southern EU ──
  it: { freeFrom: 0, flat: 35.00, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '5–8 giorni lavorativi', carrier: 'DPD' },
  es: { freeFrom: 0, flat: 50.00, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '6–9 días laborables', carrier: 'DPD' },
  pt: { freeFrom: 0, flat: 58.50, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '7–10 dias úteis', carrier: 'DPD' },

  // ── Northern EU ──
  sv: { freeFrom: 0, flat: 35.00, currency: 'SEK', currencySymbol: 'kr', exchangeRate: 11.49, estimatedDays: '5–8 arbetsdagar', carrier: 'DPD' },
  nb: { freeFrom: 0, flat: 37.50, currency: 'NOK', currencySymbol: 'kr', exchangeRate: 11.72, estimatedDays: '5–8 virkedager', carrier: 'DPD' },
  da: { freeFrom: 0, flat: 25.00, currency: 'DKK', currencySymbol: 'kr', exchangeRate: 7.46, estimatedDays: '4–7 hverdage', carrier: 'DPD' },
  fi: { freeFrom: 0, flat: 37.50, currency: 'EUR', currencySymbol: '€', exchangeRate: 1, estimatedDays: '6–9 arkipäivää', carrier: 'DPD' },

  // ── Eastern EU ──
  pl: { freeFrom: 0, flat: 25.00, currency: 'PLN', currencySymbol: 'zł', exchangeRate: 4.32, estimatedDays: '5–8 dni roboczych', carrier: 'DPD' },
  cs: { freeFrom: 0, flat: 25.00, currency: 'CZK', currencySymbol: 'Kč', exchangeRate: 24.52, estimatedDays: '4–7 pracovních dnů', carrier: 'DPD' },
  hu: { freeFrom: 0, flat: 25.00, currency: 'HUF', currencySymbol: 'Ft', exchangeRate: 394.5, estimatedDays: '5–8 munkanap', carrier: 'DPD' },
  ro: { freeFrom: 0, flat: 25.00, currency: 'RON', currencySymbol: 'lei', exchangeRate: 4.97, estimatedDays: '6–9 zile lucrătoare', carrier: 'DPD' },
};

/** Convert a EUR price to the local currency for a given locale. */
export function convertPrice(eurPrice: number, locale: Locale): number {
  const zone = shippingZones[locale];
  return eurPrice * zone.exchangeRate;
}

/** Format a EUR price in the local currency of the given locale. */
export function formatLocalPrice(eurPrice: number, locale: Locale): string {
  const zone = shippingZones[locale];
  const localPrice = eurPrice * zone.exchangeRate;

  // Round to 2 decimals for most currencies, 0 for high-rate currencies
  const decimals = zone.exchangeRate > 5 ? 0 : 2;
  const rounded = localPrice.toFixed(decimals);

  // Format with symbol
  if (zone.currency === 'GBP') return `£${rounded}`;
  if (zone.currencySymbol === 'kr') return `${rounded} ${zone.currencySymbol}`;
  if (['zł', 'Kč', 'Ft', 'lei'].includes(zone.currencySymbol)) return `${rounded} ${zone.currencySymbol}`;
  if (zone.currency === 'CHF') return `CHF ${rounded}`;
  return `€${rounded}`;
}

/** Map shop-country → default UI language */
export const countryToLanguage: Record<Locale, Locale> = {
  de: 'de', at: 'de', ch: 'de',
  en: 'en',
  fr: 'fr',
  nl: 'nl', be: 'nl',
  it: 'it',
  es: 'es',
  pt: 'pt',
  sv: 'sv',
  nb: 'nb',
  da: 'da',
  fi: 'fi',
  pl: 'pl',
  cs: 'cs',
  hu: 'hu',
  ro: 'ro',
};
