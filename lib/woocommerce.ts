import type { WCProduct, WCProductCategory, WCVariation } from '@/types/woocommerce';

const BASE_URL  = process.env.WOOCOMMERCE_URL!;
const CK        = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const CS        = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

function authParams(extra: Record<string, string | number> = {}): string {
  const params = new URLSearchParams({
    consumer_key:    CK,
    consumer_secret: CS,
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])),
  });
  return params.toString();
}

async function wcFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = `${BASE_URL}/wp-json/wc/v3${path}?${authParams(params)}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // cache 1h, revalidate on deploy
  });
  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

/* ── Products ── */
export async function getProducts(params: Record<string, string | number> = {}): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>('/products', {
    per_page: 24,
    status:   'publish',
    orderby:  'popularity',
    ...params,
  });
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await wcFetch<WCProduct[]>('/products', { slug, status: 'publish' });
  return products[0] ?? null;
}

export async function getProductById(id: number): Promise<WCProduct> {
  return wcFetch<WCProduct>(`/products/${id}`);
}

export async function getFeaturedProducts(limit = 6): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>('/products', {
    per_page: limit,
    status:   'publish',
    featured: 'true',
    orderby:  'popularity',
  });
}

export async function getProductsByCategory(categoryId: number, limit = 12): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>('/products', {
    per_page: limit,
    status:   'publish',
    category: categoryId,
    orderby:  'popularity',
  });
}

/* ── Variations ── */
export async function getProductVariations(productId: number): Promise<WCVariation[]> {
  return wcFetch<WCVariation[]>(`/products/${productId}/variations`, {
    per_page: 100,
    status: 'publish',
  });
}

/* ── Categories ── */
export async function getCategories(): Promise<WCProductCategory[]> {
  const cats = await wcFetch<WCProductCategory[]>('/products/categories', {
    per_page: 50,
    orderby:  'count',
    order:    'desc',
  });
  return cats.filter(c => c.count > 0 && c.slug !== 'uncategorized');
}

/* ── Helpers ── */
export function formatPrice(price: string, locale: string): string {
  const num = parseFloat(price);
  if (isNaN(num)) return price;

  const { currency, localeCode } = getCurrencyForLocale(locale);

  return new Intl.NumberFormat(localeCode, {
    style:    'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(num);
}

export function getCurrencyForLocale(locale: string): { currency: string; localeCode: string } {
  const map: Record<string, { currency: string; localeCode: string }> = {
    de:  { currency: 'EUR', localeCode: 'de-DE' },
    at:  { currency: 'EUR', localeCode: 'de-AT' },
    ch:  { currency: 'CHF', localeCode: 'de-CH' },
    fr:  { currency: 'EUR', localeCode: 'fr-FR' },
    nl:  { currency: 'EUR', localeCode: 'nl-NL' },
    be:  { currency: 'EUR', localeCode: 'nl-BE' },
    en:  { currency: 'GBP', localeCode: 'en-GB' },
    it:  { currency: 'EUR', localeCode: 'it-IT' },
    es:  { currency: 'EUR', localeCode: 'es-ES' },
    pt:  { currency: 'EUR', localeCode: 'pt-PT' },
    sv:  { currency: 'SEK', localeCode: 'sv-SE' },
    nb:  { currency: 'NOK', localeCode: 'nb-NO' },
    da:  { currency: 'DKK', localeCode: 'da-DK' },
    fi:  { currency: 'EUR', localeCode: 'fi-FI' },
    pl:  { currency: 'PLN', localeCode: 'pl-PL' },
    cs:  { currency: 'CZK', localeCode: 'cs-CZ' },
    hu:  { currency: 'HUF', localeCode: 'hu-HU' },
    ro:  { currency: 'RON', localeCode: 'ro-RO' },
  };
  return map[locale] ?? { currency: 'EUR', localeCode: 'de-DE' };
}
