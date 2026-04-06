import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  return { title: t('shopTitle'), description: t('shopDesc') };
}

interface ShopPageProps {
  params: { locale: Locale };
  searchParams: { cat?: string; page?: string; sort?: string };
}

export default async function ShopPage({ params: { locale }, searchParams }: ShopPageProps) {
  const t   = await getTranslations('products');
  const currentPage = parseInt(searchParams.page ?? '1', 10);
  const perPage = 12;

  const [products, categories] = await Promise.all([
    getProducts({ per_page: perPage, page: currentPage, orderby: searchParams.sort ?? 'popularity' }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const filterOptions = [
    { label: t('filterAll'),       val: '' },
    { label: t('filterOutdoor'),   val: 'außenbereich' },
    { label: t('filterIndoor'),    val: 'innenbereich' },
    { label: t('filterStandard'),  val: 'standard' },
    { label: t('filterSteel'),     val: 'edelstahl' },
    { label: t('filterAccessory'), val: 'zubehör' },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="px-20 py-16 border-b border-gray-100">
        <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-3" translate="no">matzone</p>
        <h1 className="font-serif text-[48px] font-normal tracking-[-0.02em] mb-2">{t('title')}</h1>
        <p className="text-[14px] text-gray-500">{products.length} Produkte</p>
      </div>

      <div className="px-20 py-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-gray-100">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map(f => (
            <a
              key={f.val}
              href={`/${locale}/shop${f.val ? `?cat=${f.val}` : ''}`}
              className={`text-[11px] px-4 py-1.5 border transition-all tracking-[0.04em] ${
                (searchParams.cat ?? '') === f.val
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              {f.label}
            </a>
          ))}
        </div>

        {/* Sort */}
        <select
          className="text-[12px] border border-gray-300 py-1.5 px-3 text-gray-600 bg-transparent appearance-none cursor-pointer"
          defaultValue={searchParams.sort ?? 'popularity'}
        >
          <option value="popularity">Beliebtheit</option>
          <option value="date">Neuheiten</option>
          <option value="price">Preis aufsteigend</option>
          <option value="price-desc">Preis absteigend</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="px-20 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Keine Produkte gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {products.length === perPage && (
          <div className="flex justify-center gap-2 mt-16">
            {currentPage > 1 && (
              <a
                href={`/${locale}/shop?page=${currentPage - 1}`}
                className="px-5 py-2.5 border border-gray-300 text-[12px] text-gray-600 hover:border-black hover:text-black transition-all"
              >
                ← Zurück
              </a>
            )}
            <span className="px-5 py-2.5 bg-black text-white text-[12px]">{currentPage}</span>
            <a
              href={`/${locale}/shop?page=${currentPage + 1}`}
              className="px-5 py-2.5 border border-gray-300 text-[12px] text-gray-600 hover:border-black hover:text-black transition-all"
            >
              Weiter →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
