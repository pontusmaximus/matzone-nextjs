'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CustomOrderForm() {
  const t = useTranslations('custom');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrate with API endpoint
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
      {/* Size inputs */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-3">{t('dimensions')}</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">{t('width')} (mm)</label>
            <input type="number" required min="100" max="5000" placeholder="z.B. 800" className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">{t('length')} (mm)</label>
            <input type="number" required min="100" max="5000" placeholder="z.B. 500" className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">{t('height')} (mm)</label>
            <select className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors bg-white">
              <option value="10">10 mm</option>
              <option value="17">17 mm</option>
              <option value="22" selected>22 mm</option>
              <option value="27">27 mm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product type */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('productType')}</label>
        <select required className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors bg-white">
          <option value="">{t('selectType')}</option>
          <option value="aluprofil-rips">Aluprofil Rips</option>
          <option value="aluprofil-buerste">Aluprofil Bürste</option>
          <option value="aluprofil-gummi">Aluprofil Gummi</option>
          <option value="sauberlauf">Sauberlauf</option>
          <option value="sisal">Sisal</option>
          <option value="kokos">Kokos</option>
          <option value="edelstahlrost">Edelstahlrost</option>
          <option value="other">{t('other')}</option>
        </select>
      </div>

      {/* Frame */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('frame')}</label>
        <select className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors bg-white">
          <option value="none">{t('noFrame')}</option>
          <option value="einbau">{t('frameEinbau')}</option>
          <option value="antritt">{t('frameAntritt')}</option>
          <option value="alu-antritt">{t('frameAluAntritt')}</option>
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('color')}</label>
        <div className="flex gap-3">
          {['Schwarz', 'Grau', 'Beige'].map(color => (
            <label key={color} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="color" value={color} className="accent-black" />
              <span className="text-[13px]">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('quantity')}</label>
        <input type="number" min="1" defaultValue="1" className="w-24 border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
      </div>

      {/* Contact */}
      <div className="pt-4 border-t border-gray-100">
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-3">{t('contactInfo')}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" required placeholder={t('name')} className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
          <input type="email" required placeholder={t('email')} className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors" />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-gray-500 mb-1.5">{t('notes')}</label>
        <textarea rows={3} placeholder={t('notesPlaceholder')} className="w-full border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-black transition-colors resize-none" />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-4 text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-[#1a1a1a] transition-colors"
      >
        {t('submit')}
      </button>
    </form>
  );
}
