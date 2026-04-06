import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts, getProductVariations } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';
import VariationSelector from '@/components/VariationSelector';
import ProductGallery from '@/components/ProductGallery';
import type { Locale } from '@/i18n';

interface ProductPageProps {
  params: { locale: Locale; slug: string };
}

export async function generateMetadata({ params: { locale, slug } }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matzone.eu';
  const imgUrl  = product.images?.[0]?.src;

  return {
    title: `${product.name} — matzone`,
    description: product.short_description.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: {
      title: `${product.name} — matzone`,
      description: product.short_description.replace(/<[^>]+>/g, '').slice(0, 160),
      images: imgUrl ? [{ url: imgUrl }] : [],
      url: `${siteUrl}/${locale}/shop/${slug}`,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params: { locale, slug } }: ProductPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations('product');

  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  // Fetch variations for variable products
  const variations = product.type === 'variable'
    ? await getProductVariations(product.id).catch(() => [])
    : [];

  const related = await getProducts({ per_page: 4, category: product.categories?.[0]?.id }).catch(() => []);
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 3);

  const cleanDesc = product.description.replace(/<[^>]+>/g, '');

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: cleanDesc.slice(0, 500),
    image: product.images.map(i => i.src),
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'matzone' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.stock_status === 'instock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/shop/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="px-6 md:px-20 py-8 md:py-16">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-gray-400 mb-8 md:mb-10 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/shop`} className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-black truncate">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div>
            <p className="text-[11px] tracking-[0.1em] uppercase text-gray-400 mb-3">
              {product.categories?.[0]?.name}
            </p>
            <h1 className="font-serif text-[28px] md:text-[36px] font-normal tracking-[-0.02em] mb-6">{product.name}</h1>

            {/* Variation selector (handles price, attributes, add-to-cart) */}
            <VariationSelector
              product={product}
              variations={variations}
              locale={locale}
            />

            {/* Short Description */}
            {product.short_description && (
              <div
                className="mt-6 text-sm text-gray-600 leading-relaxed prose prose-sm"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: '🚚', label: 'DPD Versand', sub: 'EU-weit' },
                { icon: '↩️', label: '30 Tage Rückgabe', sub: 'Kostenlos' },
                { icon: '🇦🇹', label: 'Made in Austria', sub: 'Handgefertigt' },
              ].map(b => (
                <div key={b.label} className="text-center">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-[11px] font-medium text-gray-700">{b.label}</div>
                  <div className="text-[10px] text-gray-400">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] mb-6">{t('description')}</h2>
            <div
              className="text-sm text-gray-600 leading-relaxed prose max-w-2xl"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Related Products */}
        {relatedFiltered.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] mb-8">{t('relatedTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
              {relatedFiltered.map(p => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
