import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';
import type { Locale } from '@/i18n';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('homeTitle'),
    description: t('homeDesc'),
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t     = await getTranslations('hero');
  const tp    = await getTranslations('products');
  const tc    = await getTranslations('categories');
  const tb    = await getTranslations('band');
  const tn    = await getTranslations('newsletter');
  const tco   = await getTranslations('countries');

  // Fetch data
  const [products, categories] = await Promise.all([
    getProducts({ per_page: 6, orderby: 'popularity' }).catch(() => []),
    getCategories().catch(() => []),
  ]);

  // Hero product (first product)
  const heroProduct = products[0];

  const countryList = [
    { flag: '🇩🇪', name: 'Deutschland' }, { flag: '🇦🇹', name: 'Österreich' },
    { flag: '🇨🇭', name: 'Schweiz' },     { flag: '🇫🇷', name: 'France' },
    { flag: '🇮🇹', name: 'Italia' },      { flag: '🇪🇸', name: 'España' },
    { flag: '🇳🇱', name: 'Nederland' },   { flag: '🇧🇪', name: 'België' },
    { flag: '🇬🇧', name: 'United Kingdom' }, { flag: '🇵🇱', name: 'Polska' },
    { flag: '🇸🇪', name: 'Sverige' },     { flag: '🇩🇰', name: 'Danmark' },
    { flag: '🇵🇹', name: 'Portugal' },    { flag: '🇨🇿', name: 'Česko' },
    { flag: '🇫🇮', name: 'Suomi' },       { flag: '🇳🇴', name: 'Norge' },
    { flag: '🇭🇺', name: 'Magyarország' },{ flag: '🇷🇴', name: 'România' },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-101px)]">
        <div className="flex flex-col justify-center px-20 py-20">
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-gray-400 mb-5">
            {t('eyebrow')}
          </p>
          <h1 className="font-serif text-[clamp(38px,4.2vw,64px)] font-normal leading-[1.07] tracking-[-0.02em] mb-6">
            {t('title').split(t('titleEm'))[0]}
            <em className="italic text-gray-400">{t('titleEm')}</em>
            {t('title').split(t('titleEm'))[1]}
          </h1>
          <p className="text-[15px] text-gray-600 leading-[1.75] max-w-[400px] mb-10">
            {t('desc')}
          </p>
          <div className="flex gap-4 items-center">
            <Link
              href={`/${locale}/shop`}
              className="bg-black text-white px-8 py-3.5 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/shop`}
              className="text-[13px] text-gray-500 border-b border-gray-300 pb-0.5 hover:text-black hover:border-black transition-all"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="bg-gray-100 relative overflow-hidden min-h-[400px] flex items-center justify-center">
          <Image
            src="https://fussmatte.at/wp-content/uploads/2024/07/fussmatte_Taktil-04.jpg"
            alt="Fussmatte Taktil"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          {heroProduct && (
            <div className="absolute bottom-10 left-10 bg-white px-5 py-4 border-l-[3px] border-black z-10">
              <p className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">{t('bestseller')}</p>
              <p className="text-[17px] font-medium mt-0.5">{heroProduct.name}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="px-20 py-20" id="products">
        <div className="flex items-end justify-between mb-11">
          <div>
            <h2 className="font-serif text-3xl font-normal tracking-[-0.02em]">{tp('title')}</h2>
            <p className="text-[13px] text-gray-400 mt-1.5">{tp('subtitle')}</p>
          </div>
          <Link href={`/${locale}/shop`} className="text-[11px] text-gray-600 uppercase tracking-[0.08em] border-b border-gray-300 pb-0.5 hover:text-black hover:border-black transition-all whitespace-nowrap">
            {tp('viewAll')} →
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2.5 mb-10 flex-wrap">
          {[
            { label: tp('filterAll'), val: '' },
            { label: tp('filterOutdoor'), val: 'außenbereich' },
            { label: tp('filterIndoor'), val: 'innenbereich' },
            { label: tp('filterStandard'), val: 'standard' },
            { label: tp('filterSteel'), val: 'edelstahl' },
          ].map(f => (
            <Link
              key={f.val}
              href={f.val ? `/${locale}/shop?cat=${f.val}` : `/${locale}/shop`}
              className="text-[11px] px-4 py-1.5 border border-gray-300 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all tracking-[0.04em]"
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {products.slice(0, 6).map(product => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      {/* ── BAND ── */}
      <div className="bg-black text-white px-20 py-[72px] grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-serif text-[42px] font-normal leading-[1.1] tracking-[-0.02em]">
            {tb('title').split(tb('titleEm'))[0]}
            <em className="italic text-gray-500">{tb('titleEm')}</em>
            {tb('title').split(tb('titleEm'))[1]}
          </h2>
          <p className="text-gray-500 leading-relaxed mt-5 mb-8 text-sm">{tb('desc')}</p>
          <Link
            href={`/${locale}/shop`}
            className="bg-white text-black px-8 py-3.5 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-gray-100 transition-colors inline-block"
          >
            {tb('cta')}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[
            { n: '50+', l: 'Modelle' }, { n: '18', l: 'EU-Länder' }, { n: '4.9★', l: 'Bewertung' },
            { n: 'Maß', l: 'Anfertigung' }, { n: '30T', l: 'Rückgabe' }, { n: 'AT', l: 'Produktion' },
          ].map(s => (
            <div key={s.l}>
              <div className="font-serif text-4xl font-normal mb-1">{s.n}</div>
              <div className="text-[11px] text-gray-500 tracking-[0.08em] uppercase">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-20" id="categories">
        <div className="px-20 mb-11">
          <h2 className="font-serif text-3xl font-normal tracking-[-0.02em]">{tc('title')}</h2>
          <p className="text-[13px] text-gray-400 mt-1.5">{tc('subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
          {[
            { name: tc('outdoor'), count: '9', img: 'https://fussmatte.at/wp-content/uploads/2018/02/ALU_KB.jpg' },
            { name: tc('indoor'),  count: '15', img: 'https://fussmatte.at/wp-content/uploads/2018/01/rips_schwarz2.jpg' },
            { name: tc('steel'),   count: '9', img: 'https://fussmatte.at/wp-content/uploads/2018/01/Rondo-Classic-1.jpg' },
            { name: tc('logo'),    count: '4', img: 'https://fussmatte.at/wp-content/uploads/2018/02/Textil-XA.jpg' },
          ].map(cat => (
            <Link key={cat.name} href={`/${locale}/shop`} className="group relative aspect-[3/4] overflow-hidden bg-gray-100 flex items-end">
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 p-6 text-white">
                <p className="text-base font-medium tracking-[-0.01em]">{cat.name}</p>
                <p className="text-[11px] opacity-65 tracking-[0.06em] mt-1">{cat.count} Produkte</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── COUNTRIES ── */}
      <div className="bg-gray-100 px-20 py-14">
        <h3 className="font-serif text-[26px] font-normal mb-1.5">{tco('title')}</h3>
        <p className="text-[13px] text-gray-400 mb-8">{tco('subtitle')}</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {countryList.map(c => (
            <div
              key={c.name}
              className="flex items-center gap-2 px-3.5 py-2.5 border border-gray-300 bg-white text-[12px] text-gray-600 hover:border-black hover:text-black transition-all cursor-pointer"
            >
              <span className="text-lg leading-none">{c.flag}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEWSLETTER ── */}
      <div className="px-20 py-20 text-center border-t border-gray-100">
        <h3 className="font-serif text-[32px] font-normal tracking-[-0.02em] mb-2">{tn('title')}</h3>
        <p className="text-[14px] text-gray-400 mb-8">{tn('desc')}</p>
        <form className="flex justify-center max-w-[400px] mx-auto" action="#">
          <input
            type="email"
            placeholder={tn('placeholder')}
            className="flex-1 px-5 py-3.5 border border-r-0 border-gray-300 text-[13px] outline-none placeholder:text-gray-400 focus:border-black transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-3.5 bg-black text-white text-[11px] font-medium tracking-[0.08em] uppercase hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
          >
            {tn('cta')}
          </button>
        </form>
      </div>
    </>
  );
}
