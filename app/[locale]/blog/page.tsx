import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  return { title: t('blogTitle') };
}

// Demo blog posts (in real use these come from WordPress REST API or a CMS)
const demoPostsDe = [
  {
    slug: 'fussmatten-pflege-tipps',
    title: 'Fussmatten richtig pflegen — 5 Tipps für lange Lebensdauer',
    excerpt: 'Erfahre, wie du deine Fussmatten optimal pflegst und reinigst, damit sie jahrelang schön aussehen und zuverlässig schmutzabweisend bleiben.',
    date: '2026-03-15',
    category: 'Pflege',
    readTime: '4 min',
    img: 'https://fussmatte.at/wp-content/uploads/2018/01/rips_schwarz2.jpg',
  },
  {
    slug: 'aussenbereich-fussmatten-guide',
    title: 'Außenbereich Fussmatten: Der komplette Kaufguide',
    excerpt: 'Welche Fussmatten eignen sich für den Außenbereich? Aluprofil, Gummi oder Kokosfaser? Wir erklären die Unterschiede und helfen bei der Wahl.',
    date: '2026-02-28',
    category: 'Guide',
    readTime: '7 min',
    img: 'https://fussmatte.at/wp-content/uploads/2018/02/ALU_KB.jpg',
  },
  {
    slug: 'logo-fussmatten-fuer-unternehmen',
    title: 'Logo-Fussmatten für Unternehmen: Professioneller erster Eindruck',
    excerpt: 'Eine gebrandete Eingangs-Fussmatte ist oft der erste Kontakt, den Kunden mit deinem Unternehmen haben. Warum sich die Investition lohnt.',
    date: '2026-02-10',
    category: 'Business',
    readTime: '5 min',
    img: 'https://fussmatte.at/wp-content/uploads/2018/02/Textil-XA.jpg',
  },
  {
    slug: 'edelstahlroste-premium',
    title: 'Edelstahlroste — warum Premium-Qualität bei Fussmatten zählt',
    excerpt: 'Edelstahlroste sind langlebig, elegant und pflegeleicht. In diesem Artikel zeigen wir, für welche Einsatzbereiche sie sich besonders eignen.',
    date: '2026-01-20',
    category: 'Produkte',
    readTime: '6 min',
    img: 'https://fussmatte.at/wp-content/uploads/2018/01/Rondo-Classic-1.jpg',
  },
  {
    slug: 'seo-europaweiter-fussmatten-shop',
    title: 'Wie matzone den europäischen Markt mit lokalem SEO erschließt',
    excerpt: 'Länderspezifische Domains, hreflang-Tags und lokalisierte Inhalte: So bauen wir unsere europäische Online-Präsenz strategisch auf.',
    date: '2026-01-05',
    category: 'Strategie',
    readTime: '8 min',
    img: 'https://fussmatte.at/wp-content/uploads/2022/06/fussmatte_Sisal-scaled.jpg',
  },
  {
    slug: 'massanfertigung-fussmatten',
    title: 'Maßgenaue Fussmatten: Jede Größe ist möglich',
    excerpt: 'Standard-Größen passen nicht? Bei matzone ist das kein Problem — wir fertigen jede Fussmatte exakt nach deinen Maßen.',
    date: '2025-12-18',
    category: 'Maßanfertigung',
    readTime: '4 min',
    img: 'https://fussmatte.at/wp-content/uploads/2022/06/Fussmatte_Rips-schwarz.jpg',
  },
];

export default async function BlogPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-20 py-16 border-b border-gray-100">
        <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-3" translate="no">matzone</p>
        <h1 className="font-serif text-[48px] font-normal tracking-[-0.02em] mb-2">{t('title')}</h1>
        <p className="text-[14px] text-gray-500">{t('subtitle')}</p>
      </div>

      {/* Posts Grid */}
      <div className="px-20 py-16">
        {/* Featured Post */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 pb-16 border-b border-gray-100">
          <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
            <img
              src={demoPostsDe[0].img}
              alt={demoPostsDe[0].title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1">
                {demoPostsDe[0].category}
              </span>
              <span className="text-[11px] text-gray-400">{demoPostsDe[0].readTime} Lesezeit</span>
            </div>
            <h2 className="font-serif text-[28px] font-normal tracking-[-0.02em] leading-snug mb-4">
              {demoPostsDe[0].title}
            </h2>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">{demoPostsDe[0].excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-gray-400">{demoPostsDe[0].date}</span>
              <Link
                href={`/${locale}/blog/${demoPostsDe[0].slug}`}
                className="text-[12px] uppercase tracking-widest border-b border-gray-300 pb-0.5 hover:border-black transition-colors"
              >
                {t('readMore')} →
              </Link>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {demoPostsDe.slice(1).map(post => (
            <article key={post.slug} className="group">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-4 relative">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{post.category}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-400">{post.readTime}</span>
              </div>
              <h3 className="font-serif text-[18px] font-normal tracking-[-0.01em] leading-snug mb-2 group-hover:text-gray-700 transition-colors">
                <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">{post.date}</span>
                <Link href={`/${locale}/blog/${post.slug}`} className="text-[11px] text-gray-600 hover:text-black transition-colors">
                  {t('readMore')} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
