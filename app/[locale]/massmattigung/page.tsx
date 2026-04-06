import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'custom' });
  return { title: `${t('title')} — matzone` };
}

export default async function CustomPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('custom');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 md:px-20 py-12 md:py-16 border-b border-gray-100">
        <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-3" translate="no">matzone</p>
        <h1 className="font-serif text-[36px] md:text-[48px] font-normal tracking-[-0.02em] mb-2">{t('title')}</h1>
        <p className="text-[14px] text-gray-500 max-w-xl">{t('subtitle')}</p>
      </div>

      <div className="px-6 md:px-20 py-12 md:py-16 max-w-3xl">
        {/* Steps */}
        <h2 className="font-serif text-[24px] font-normal tracking-[-0.02em] mb-8">{t('howTitle')}</h2>
        <div className="space-y-8 mb-12">
          {[
            { step: '01', title: t('step1Title'), desc: t('step1Desc') },
            { step: '02', title: t('step2Title'), desc: t('step2Desc') },
            { step: '03', title: t('step3Title'), desc: t('step3Desc') },
            { step: '04', title: t('step4Title'), desc: t('step4Desc') },
          ].map(s => (
            <div key={s.step} className="flex gap-5">
              <span className="text-[32px] font-serif text-gray-200 leading-none flex-shrink-0">{s.step}</span>
              <div>
                <h3 className="text-[15px] font-medium mb-1">{s.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to shop */}
        <div className="bg-gray-50 p-8 border border-gray-100">
          <p className="text-[14px] text-gray-600 mb-4">{t('shopNote')}</p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block bg-black text-white px-8 py-3.5 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors"
          >
            {t('shopCta')}
          </Link>
        </div>

        {/* Contact info */}
        <div className="mt-10 pt-8 border-t border-gray-100 space-y-3 text-[13px] text-gray-500">
          <p>📞 {t('phoneNote')}: +43 699 100 88 504</p>
          <p>📧 office@fussmatte.at</p>
          <p>⏱ {t('deliveryNote')}</p>
        </div>
      </div>
    </div>
  );
}
