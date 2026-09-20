/**
 * Zustand cart store with localStorage persistence.
 *
 * ARCHITECTURE NOTE:
 * - This is a CLIENT-ONLY store (zustand runs in the browser)
 * - We use the persist middleware to sync to localStorage
 * - Components should use SELECTORS to avoid unnecessary re-renders:
 *     useCartStore(state => state.items)   ✅ only re-renders when items change
 *     useCartStore()                       ❌ re-renders on every store change
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  // Derived
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      increaseQty: (id) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      decreaseQty: (id) => {
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "nextjs-lab-cart", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ────────────────────────────────────────────────────────────
// Selector hooks — expose only what each component needs.
// This is the recommended Zustand pattern to minimise re-renders.
// ────────────────────────────────────────────────────────────

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartTotalItems = () =>
  useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

export const useCartActions = () =>
  useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      increaseQty: state.increaseQty,
      decreaseQty: state.decreaseQty,
      clearCart: state.clearCart,
    }))
  );
