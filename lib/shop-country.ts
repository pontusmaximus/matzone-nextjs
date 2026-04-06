'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/i18n';

interface ShopCountryStore {
  country: Locale | null;
  setCountry: (country: Locale) => void;
}

export const useShopCountry = create<ShopCountryStore>()(
  persist(
    (set) => ({
      country: null,
      setCountry: (country) => set({ country }),
    }),
    { name: 'matzone-country' }
  )
);
