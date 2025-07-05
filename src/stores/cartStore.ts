import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';
import { supabase } from '../lib/supabase';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  toggleCart: () => void;
  syncCartWithServer: () => Promise<void>;
  loadCartFromServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product: any, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          let newItems;
          if (existingItem) {
            newItems = state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const cartItem: CartItem = {
              id: product.id,
              title: product.title,
              price: product.price,
              images: product.images,
              quantity
            };
            newItems = [...state.items, cartItem];
          }
          
          // Sync with server for authenticated users
          get().syncCartWithServer();
          
          return { items: newItems };
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== productId);
          get().syncCartWithServer();
          return { items: newItems };
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => {
          const newItems = state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          );
          get().syncCartWithServer();
          return { items: newItems };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
        get().syncCartWithServer();
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => 
          total + (item.price * item.quantity), 0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      syncCartWithServer: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const items = get().items;
          const { error } = await supabase
            .from('user_carts')
            .upsert({
              user_id: user.id,
              items: items,
              updated_at: new Date().toISOString()
            });

          if (error) console.error('Error syncing cart:', error);
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      },

      loadCartFromServer: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('user_carts')
            .select('items')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading cart:', error);
            return;
          }

          if (data?.items) {
            set({ items: data.items });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);