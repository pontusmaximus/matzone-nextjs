import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n';

interface FooterProps {
  locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
  setRequestLocale(locale);
  const t = await getTranslations('footer');

  return (
    <footer className="bg-[#0a0a0a] text-gray-500 pt-16 pb-9 px-20">
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 mb-12">
        {/* Brand */}
        <div>
          <div className="text-white text-2xl font-semibold tracking-[-0.04em] mb-3">
            <span translate="no">mat</span><span className="text-gray-600 font-light" translate="no">zone</span>
          </div>
          <p className="text-sm leading-relaxed mb-5">{t('about')}</p>
          {/* Payment Icons */}
          <div className="flex gap-2 flex-wrap">
            {['VISA', 'MC', 'AMEX', 'PayPal', 'Klarna'].map(pay => (
              <span key={pay} className="bg-[#1a1a1a] px-2.5 py-1 text-[10px] tracking-wide text-gray-500 rounded-sm">
                {pay}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white text-[11px] font-medium tracking-[0.12em] uppercase mb-4">{t('shop')}</h4>
          <ul className="flex flex-col gap-2.5">
            {Object.entries(t.raw('shopLinks') as Record<string, string>).map(([key, label]) => (
              <li key={key}>
                <Link href={`/${locale}/shop`} className="text-sm text-gray-500 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service */}
        <div>
          <h4 className="text-white text-[11px] font-medium tracking-[0.12em] uppercase mb-4">{t('service')}</h4>
          <ul className="flex flex-col gap-2.5">
            {Object.entries(t.raw('serviceLinks') as Record<string, string>).map(([key, label]) => (
              <li key={key}>
                <Link href={`/${locale}`} className="text-sm text-gray-500 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white text-[11px] font-medium tracking-[0.12em] uppercase mb-4">{t('company')}</h4>
          <ul className="flex flex-col gap-2.5">
            {Object.entries(t.raw('companyLinks') as Record<string, string>).map(([key, label]) => (
              <li key={key}>
                <Link href={`/${locale}`} className="text-sm text-gray-500 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1a1a1a] pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px]">
        <span>{t('legal')}</span>
        <div className="flex gap-5">
          {[
            { key: 'privacy', label: t('privacy') },
            { key: 'imprint', label: t('imprint') },
            { key: 'terms',   label: t('terms') },
            { key: 'cookies', label: t('cookies') },
          ].map(item => (
            <Link key={item.key} href={`/${locale}`} className="text-gray-600 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
