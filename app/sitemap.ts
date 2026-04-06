import { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { getProducts } from '@/lib/woocommerce';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matzone.eu';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ per_page: 100 }).catch(() => []);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${BASE_URL}/${l}`])
        ),
      },
    });

    // Shop
    entries.push({
      url: `${BASE_URL}/${locale}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Blog
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Products
    for (const product of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/shop/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
