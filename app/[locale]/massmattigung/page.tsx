import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import CustomOrderForm from '@/components/CustomOrderForm';

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

      <div className="px-6 md:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16">
          {/* Info */}
          <div>
            <h2 className="font-serif text-[24px] font-normal tracking-[-0.02em] mb-6">{t('howTitle')}</h2>
            <div className="space-y-8">
              {[
                { step: '01', title: t('step1Title'), desc: t('step1Desc') },
                { step: '02', title: t('step2Title'), desc: t('step2Desc') },
                { step: '03', title: t('step3Title'), desc: t('step3Desc') },
                { step: '04', title: t('step4Title'), desc: t('step4Desc') },
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <span className="text-[28px] font-serif text-gray-200 leading-none">{s.step}</span>
                  <div>
                    <h3 className="text-[14px] font-medium mb-1">{s.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust info */}
            <div className="mt-10 pt-8 border-t border-gray-100 space-y-3 text-[13px] text-gray-500">
              <p>📞 {t('phoneNote')}: +43 699 100 88 504</p>
              <p>📧 office@fussmatte.at</p>
              <p>⏱ {t('deliveryNote')}</p>
            </div>
          </div>

          {/* Form */}
          <CustomOrderForm />
        </div>
      </div>
    </div>
  );
}
