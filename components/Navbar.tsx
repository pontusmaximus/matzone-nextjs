'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Search, Menu, X, Globe, Languages } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/lib/cart';
import { useShopCountry } from '@/lib/shop-country';
import { locales, type Locale } from '@/i18n';
import { shippingZones, countryToLanguage } from '@/lib/shipping';
import SearchOverlay from './SearchOverlay';

interface NavbarProps {
  locale: Locale;
}

const countryInfo: Record<Locale, { flag: string; name: string }> = {
  de: { flag: '🇩🇪', name: 'Deutschland' },
  at: { flag: '🇦🇹', name: 'Österreich' },
  ch: { flag: '🇨🇭', name: 'Schweiz' },
  en: { flag: '🇬🇧', name: 'United Kingdom' },
  fr: { flag: '🇫🇷', name: 'France' },
  nl: { flag: '🇳🇱', name: 'Nederland' },
  be: { flag: '🇧🇪', name: 'België' },
  it: { flag: '🇮🇹', name: 'Italia' },
  es: { flag: '🇪🇸', name: 'España' },
  pt: { flag: '🇵🇹', name: 'Portugal' },
  sv: { flag: '🇸🇪', name: 'Sverige' },
  nb: { flag: '🇳🇴', name: 'Norge' },
  da: { flag: '🇩🇰', name: 'Danmark' },
  fi: { flag: '🇫🇮', name: 'Suomi' },
  pl: { flag: '🇵🇱', name: 'Polska' },
  cs: { flag: '🇨🇿', name: 'Česko' },
  hu: { flag: '🇭🇺', name: 'Magyarország' },
  ro: { flag: '🇷🇴', name: 'România' },
};

// Unique languages (multiple countries can share a language)
const languages: { code: Locale; label: string }[] = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'it', label: 'Italiano' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'sv', label: 'Svenska' },
  { code: 'nb', label: 'Norsk' },
  { code: 'da', label: 'Dansk' },
  { code: 'fi', label: 'Suomi' },
  { code: 'pl', label: 'Polski' },
  { code: 'cs', label: 'Čeština' },
  { code: 'hu', label: 'Magyar' },
  { code: 'ro', label: 'Română' },
];

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const tb = useTranslations('topbar');
  const { totalItems, openCart } = useCart();
  const { country, setCountry } = useShopCountry();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const countryRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const shopCountry = country ?? locale;
  const zone = shippingZones[shopCountry];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLanguage = (lang: Locale) => {
    const segments = pathname.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  const switchCountry = (code: Locale) => {
    setCountry(code);
    setCountryOpen(false);
    // Also switch language to match the country
    const lang = countryToLanguage[code];
    const segments = pathname.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-black text-gray-300 text-[11px] tracking-widest py-2 px-6 flex items-center justify-center gap-8 flex-wrap">
        <span>{zone.carrier} · {zone.estimatedDays}</span>
        <span>30 {tb('returns')}</span>
      </div>

      {/* Nav */}
      <nav
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-16 flex items-center px-10 transition-shadow ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        {/* Logo */}
        <Link href={`/${locale}`} className="font-sans text-[22px] font-semibold tracking-[-0.04em] text-black flex-shrink-0">
          <span translate="no">mat</span><span className="text-gray-400 font-light" translate="no">zone</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 mx-auto list-none">
          {[
            { href: `/${locale}/shop`, label: t('shop') },
            { href: `/${locale}/kategorien`, label: t('categories') },
            { href: `/${locale}/massmattigung`, label: t('custom') },
            { href: `/${locale}/blog`, label: t('blog') },
            { href: `/${locale}/kontakt`, label: t('contact') },
          ].map(link => (
            <li key={link.href}>
              <Link href={link.href} className="text-[13px] text-gray-600 hover:text-black transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto md:ml-0">
          {/* Search */}
          <button onClick={() => setSearchOpen(true)} className="text-gray-500 hover:text-black transition-colors p-1" aria-label="Search">
            <Search size={18} strokeWidth={1.8} />
          </button>

          {/* Cart */}
          <button onClick={openCart} className="relative text-black p-1" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.8} />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                {totalItems()}
              </span>
            )}
          </button>

          {/* Country Switcher (Shop) */}
          <div className="relative" ref={countryRef}>
            <button
              onClick={() => { setCountryOpen(!countryOpen); setLangOpen(false); }}
              className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Select country"
            >
              <Globe size={17} strokeWidth={1.8} />
              <span className="text-[11px]">{countryInfo[shopCountry].flag}</span>
            </button>

            {countryOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] max-h-[380px] overflow-y-auto bg-white border border-gray-200 shadow-xl z-[100]">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-gray-400">Shop / Versand</span>
                </div>
                {locales.map(c => {
                  const info = countryInfo[c];
                  const z = shippingZones[c];
                  const isActive = c === shopCountry;
                  return (
                    <button
                      key={c}
                      onClick={() => switchCountry(c)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-base leading-none">{info.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-black">{info.name}</div>
                        <div className="text-[10px] text-gray-400">{z.currencySymbol} · {z.carrier}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => { setLangOpen(!langOpen); setCountryOpen(false); }}
              className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Select language"
            >
              <Languages size={17} strokeWidth={1.8} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-[200px] max-h-[380px] overflow-y-auto bg-white border border-gray-200 shadow-xl z-[100]">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-gray-400">Sprache</span>
                </div>
                {languages.map(lang => {
                  const isActive = lang.code === locale;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2.5 text-[12px] hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? 'bg-gray-50 font-medium' : 'text-gray-600'}`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-600 hover:text-black p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4">
          {[
            { href: `/${locale}/shop`, label: t('shop') },
            { href: `/${locale}/kategorien`, label: t('categories') },
            { href: `/${locale}/massmattigung`, label: t('custom') },
            { href: `/${locale}/blog`, label: t('blog') },
            { href: `/${locale}/kontakt`, label: t('contact') },
          ].map(link => (
            <Link key={link.href} href={link.href} className="text-sm text-gray-700 hover:text-black" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
    </>
  );
}
