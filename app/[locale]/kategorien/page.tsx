import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getCategories } from '@/lib/woocommerce';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'categories' });
  return { title: `${t('title')} — matzone` };
}

export default async function CategoriesPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('categories');
  const categories = await getCategories().catch(() => []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 md:px-20 py-12 md:py-16 border-b border-gray-100">
        <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-3" translate="no">matzone</p>
        <h1 className="font-serif text-[36px] md:text-[48px] font-normal tracking-[-0.02em] mb-2">{t('title')}</h1>
        <p className="text-[14px] text-gray-500">{t('subtitle')}</p>
      </div>

      {/* Category Grid */}
      <div className="px-6 md:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/${locale}/shop?cat=${cat.id}`}
              className="group relative overflow-hidden bg-gray-100 aspect-[4/3]"
            >
              {cat.image && (
                <Image
                  src={cat.image.src}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center text-white">
                <h2 className="font-serif text-[28px] font-normal tracking-[-0.02em] mb-1">{cat.name}</h2>
                <p className="text-[12px] text-white/70">{cat.count} Produkte</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Fallback if no categories from WooCommerce */}
        {categories.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'outdoor', color: 'from-stone-600 to-stone-800' },
              { key: 'indoor', color: 'from-gray-500 to-gray-700' },
              { key: 'steel', color: 'from-zinc-500 to-zinc-700' },
              { key: 'logo', color: 'from-neutral-500 to-neutral-700' },
            ].map(cat => (
              <Link
                key={cat.key}
                href={`/${locale}/shop`}
                className="group aspect-[3/4] relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} group-hover:scale-105 transition-transform duration-500`} />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-white font-serif text-[24px] font-normal">{t(cat.key as any)}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
