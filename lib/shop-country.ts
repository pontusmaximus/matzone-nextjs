'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n';

interface ShopCountryStore {
  country: Locale | null;
  setCountry: (country: Locale) => void;
}

export const useShopCountryStore = create<ShopCountryStore>()(
  persist(
    (set) => ({
      country: null,
      setCountry: (country) => set({ country }),
    }),
    { name: 'matzone-country' }
  )
);

/** Hook that defers localStorage hydration to avoid SSR mismatch */
export function useShopCountry() {
  const store = useShopCountryStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return {
    country: hydrated ? store.country : null,
    setCountry: store.setCountry,
  };
}
