import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import CheckoutForm from '@/components/CheckoutForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'checkout' });
  return { title: `${t('title')} — matzone`, robots: { index: false, follow: false } };
}

export default async function CheckoutPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('checkout');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 md:px-20 py-8 md:py-12">
        <h1 className="font-serif text-[28px] md:text-[36px] font-normal tracking-[-0.02em] mb-8">{t('title')}</h1>
        <CheckoutForm locale={locale} />
      </div>
    </div>
  );
}
