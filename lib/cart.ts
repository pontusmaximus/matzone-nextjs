'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import type { WCProduct, WCCartItem } from '@/types/woocommerce';

interface CartStore {
  items: WCCartItem[];
  isOpen: boolean;
  addItem: (product: WCProduct, qty?: number, variationId?: number, selectedOptions?: Record<string, string>) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQty: (productId: number, qty: number, variationId?: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function cartItemKey(item: WCCartItem): string {
  return `${item.product.id}-${item.variationId ?? 0}`;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, qty = 1, variationId, selectedOptions) => {
        set(state => {
          const existing = state.items.find(
            i => i.product.id === product.id && (i.variationId ?? 0) === (variationId ?? 0)
          );
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id && (i.variationId ?? 0) === (variationId ?? 0)
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { product, qty, variationId, selectedOptions }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, variationId) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.product.id === productId && (i.variationId ?? 0) === (variationId ?? 0))
          ),
        }));
      },

      updateQty: (productId, qty, variationId) => {
        if (qty <= 0) {
          get().removeItem(productId, variationId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId && (i.variationId ?? 0) === (variationId ?? 0)
              ? { ...i, qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),
      totalPrice: () =>
        get().items.reduce((s, i) => s + (parseFloat(i.product.price) || 0) * i.qty, 0),
    }),
    { name: 'matzone-cart' }
  )
);

/** Hydration-safe hook — returns empty cart on server, real cart after mount */
export function useCart() {
  const store = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return {
    ...store,
    items: hydrated ? store.items : [],
    totalItems: () => hydrated ? store.totalItems() : 0,
    totalPrice: () => hydrated ? store.totalPrice() : 0,
  };
}
