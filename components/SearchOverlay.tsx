'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Search } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/woocommerce';
import type { WCProduct } from '@/types/woocommerce';
import type { Locale } from '@/i18n';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export default function SearchOverlay({ isOpen, onClose, locale }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WCProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 bg-white/97 z-[300] transition-opacity flex items-start justify-center pt-28 px-6 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button onClick={onClose} className="absolute top-7 right-9 text-gray-400 hover:text-black text-3xl">
        <X size={28} />
      </button>

      <div className="w-full max-w-[580px]">
        <div className="flex items-center gap-3 border-b-2 border-black">
          <Search size={22} className="text-gray-300" strokeWidth={1.8} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Suchen…"
            className="flex-1 text-[28px] border-none outline-none font-serif font-normal text-black bg-transparent py-2 placeholder:text-gray-200"
          />
        </div>

        <div className="mt-5">
          {loading && <p className="text-sm text-gray-400 py-3">Suche läuft…</p>}
          {!loading && results.length > 0 && (
            <div>
              {results.slice(0, 6).map(p => (
                <div
                  key={p.id}
                  onClick={() => { addItem(p); onClose(); }}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-1 transition-colors"
                >
                  {p.images?.[0] ? (
                    <div className="w-[52px] h-[38px] relative flex-shrink-0">
                      <Image src={p.images[0].src} alt={p.name} fill className="object-cover" sizes="52px" />
                    </div>
                  ) : (
                    <div className="w-[52px] h-[38px] bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{p.categories?.[0]?.name}</p>
                  </div>
                  <p className="text-[13px] font-medium whitespace-nowrap">{formatPrice(p.price, locale)}</p>
                </div>
              ))}
            </div>
          )}
          {!loading && query.trim() && results.length === 0 && (
            <p className="text-sm text-gray-400 py-3">Keine Ergebnisse für „{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
