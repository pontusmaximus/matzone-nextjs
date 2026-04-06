import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: `${t('title')} — matzone` };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 md:px-20 py-12 md:py-16 border-b border-gray-100">
        <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-3" translate="no">matzone</p>
        <h1 className="font-serif text-[36px] md:text-[48px] font-normal tracking-[-0.02em] mb-2">{t('title')}</h1>
        <p className="text-[14px] text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="px-6 md:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-[24px] font-normal tracking-[-0.02em] mb-6">{t('infoTitle')}</h2>
            <div className="space-y-6 text-[14px] text-gray-600">
              <div>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-1">{t('phone')}</p>
                <a href="tel:+4369910088504" className="hover:text-black transition-colors">+43 699 100 88 504</a>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-1">{t('emailLabel')}</p>
                <a href="mailto:office@fussmatte.at" className="hover:text-black transition-colors">office@fussmatte.at</a>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-1">{t('address')}</p>
                <p>fussmatte.at</p>
                <p>Österreich</p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-1">{t('hours')}</p>
                <p>Mo – Fr: 08:00 – 17:00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
