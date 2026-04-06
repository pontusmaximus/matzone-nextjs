'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrate with API endpoint or email service
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-[24px] mb-2">✓</p>
          <p className="text-[15px] font-medium">{t('success')}</p>
          <p className="text-[13px] text-gray-400 mt-1">{t('successSub')}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('firstName')}</label>
          <input type="text" required className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
        </div>
        <div>
          <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('lastName')}</label>
          <input type="text" required className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('emailLabel')}</label>
        <input type="email" required className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
      </div>
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('subject')}</label>
        <select className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors bg-white">
          <option value="general">{t('subjectGeneral')}</option>
          <option value="order">{t('subjectOrder')}</option>
          <option value="custom">{t('subjectCustom')}</option>
          <option value="return">{t('subjectReturn')}</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('message')}</label>
        <textarea required rows={5} className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors resize-none" />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-4 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors"
      >
        {t('send')}
      </button>
    </form>
  );
}
