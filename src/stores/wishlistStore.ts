import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface WishlistStore {
  items: Product[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const products = data?.map(item => ({
        id: item.products.id,
        title: item.products.title,
        description: item.products.description,
        price: item.products.price,
        originalPrice: item.products.original_price,
        images: item.products.images,
        category: item.products.category,
        brand: item.products.brand,
        inStock: item.products.in_stock,
        stockQuantity: item.products.stock_quantity,
        rating: item.products.rating,
        reviewCount: item.products.review_count,
        tags: item.products.tags,
        profitMargin: item.products.profit_margin,
        specifications: item.products.specifications,
        createdAt: item.products.created_at,
        updatedAt: item.products.updated_at
      })) || [];

      set({ items: products, loading: false });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      set({ loading: false });
    }
  },

  addToWishlist: async (product: Product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('wishlists')
        .insert([{
          user_id: user.id,
          product_id: product.id
        }]);

      if (error) throw error;

      set(state => ({
        items: [...state.items, product]
      }));

      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      set(state => ({
        items: state.items.filter(item => item.id !== productId)
      }));

      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some(item => item.id === productId);
  }
}));