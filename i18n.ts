import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = [
  'de', 'at', 'ch',       // DACH
  'en',                    // UK / IE
  'fr', 'nl', 'be',       // Benelux / FR
  'it', 'es', 'pt',       // Southern EU
  'sv', 'nb', 'da', 'fi', // Nordic
  'pl', 'cs', 'hu', 'ro', // Eastern EU
] as const;

export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'de';

// Map locale → BCP47 language tag for hreflang
export const hreflangMap: Record<Locale, string> = {
  de: 'de-DE',
  at: 'de-AT',
  ch: 'de-CH',
  en: 'en-GB',
  fr: 'fr-FR',
  nl: 'nl-NL',
  be: 'nl-BE',
  it: 'it-IT',
  es: 'es-ES',
  pt: 'pt-PT',
  sv: 'sv-SE',
  nb: 'nb-NO',
  da: 'da-DK',
  fi: 'fi-FI',
  pl: 'pl-PL',
  cs: 'cs-CZ',
  hu: 'hu-HU',
  ro: 'ro-RO',
};

export const localeNames: Record<Locale, string> = {
  de: '🇩🇪 Deutsch',
  at: '🇦🇹 Österreich',
  ch: '🇨🇭 Schweiz',
  en: '🇬🇧 English',
  fr: '🇫🇷 Français',
  nl: '🇳🇱 Nederlands',
  be: '🇧🇪 Belgisch',
  it: '🇮🇹 Italiano',
  es: '🇪🇸 Español',
  pt: '🇵🇹 Português',
  sv: '🇸🇪 Svenska',
  nb: '🇳🇴 Norsk',
  da: '🇩🇰 Dansk',
  fi: '🇫🇮 Suomi',
  pl: '🇵🇱 Polski',
  cs: '🇨🇿 Čeština',
  hu: '🇭🇺 Magyar',
  ro: '🇷🇴 Română',
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) as Locale;
  if (!locale || !locales.includes(locale)) notFound();

  // Load base language file (de covers at/ch, en covers all English, etc.)
  const baseLocale = getBaseLocale(locale);

  const messages = (await import(`./messages/${baseLocale}.json`)).default;
  return { locale, messages };
});

function getBaseLocale(locale: Locale): string {
  const map: Partial<Record<Locale, string>> = {
    at: 'de',
    ch: 'de',
    be: 'nl',
    nb: 'da', // Norwegian close to Danish for now
  };
  return map[locale] ?? locale;
}
