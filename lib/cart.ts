'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WCProduct, WCCartItem } from '@/types/woocommerce';

interface CartStore {
  items: WCCartItem[];
  isOpen: boolean;
  addItem: (product: WCProduct, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, qty = 1) => {
        set(state => {
          const existing = state.items.find(i => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { product, qty }], isOpen: true };
        });
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.product.id !== productId) }));
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.map(i => i.product.id === productId ? { ...i, qty } : i),
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
