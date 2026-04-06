import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, hreflangMap, type Locale } from '@/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CountrySelectorModal from '@/components/CountrySelectorModal';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matzone.eu';

  // Build hreflang alternates for all locales
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${siteUrl}/${l}`;
  }
  languages['x-default'] = `${siteUrl}/de`;

  return {
    title: {
      default: t('homeTitle'),
      template: `%s | matzone`,
    },
    description: t('homeDesc'),
    metadataBase: new URL(siteUrl),
    alternates: {
      languages,
      canonical: `${siteUrl}/${locale}`,
    },
    openGraph: {
      type: 'website',
      locale: hreflangMap[locale as Locale],
      url: `${siteUrl}/${locale}`,
      siteName: 'matzone',
      title: t('homeTitle'),
      description: t('homeDesc'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale as Locale);

  const messages = await getMessages();

  return (
    <html lang={hreflangMap[locale as Locale]?.split('-')[0] ?? locale}>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <CountrySelectorModal />
          <Navbar locale={locale as Locale} />
          <main>{children}</main>
          <Footer locale={locale as Locale} />
          <CartDrawer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
