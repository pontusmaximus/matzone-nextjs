import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts, formatPrice } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from '@/components/AddToCartButton';
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
    // Product structured data added via script below
  };
}

export default async function ProductPage({ params: { locale, slug } }: ProductPageProps) {
  setRequestLocale(locale);
  const t = await getTranslations('product');

  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const related = await getProducts({ per_page: 4, category: product.categories?.[0]?.id }).catch(() => []);
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 3);

  const isSale = product.on_sale && product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);
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

      <div className="px-20 py-16">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-gray-400 mb-10 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/shop`} className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Images */}
          <div className="flex flex-col gap-2">
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
              {product.images?.[0] && (
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map(img => (
                  <div key={img.id} className="aspect-square bg-gray-100 relative overflow-hidden">
                    <Image src={img.src} alt={img.alt || product.name} fill className="object-cover" sizes="12.5vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] tracking-[0.1em] uppercase text-gray-400 mb-3">
              {product.categories?.[0]?.name}
            </p>
            <h1 className="font-serif text-[36px] font-normal tracking-[-0.02em] mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium">{formatPrice(product.price, locale)}</span>
              {isSale && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.regular_price, locale)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className="text-[12px] text-gray-500">
                {product.stock_status === 'instock' ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.attributes.map(attr => (
                  <div key={attr.id}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 mb-2">{attr.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {attr.options.map(opt => (
                        <button
                          key={opt}
                          className="text-[12px] px-3 py-1.5 border border-gray-300 hover:border-black transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} locale={locale} />

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
                { icon: '🚚', label: 'Kostenloser Versand', sub: 'ab €69' },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
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
