import { create } from 'zustand';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        originalPrice: item.original_price || undefined,
        images: item.images,
        category: item.category,
        brand: item.brand,
        inStock: item.in_stock,
        stockQuantity: item.stock_quantity,
        rating: item.rating,
        reviewCount: item.review_count,
        tags: item.tags,
        profitMargin: item.profit_margin,
        specifications: item.specifications || {},
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      set({ products, loading: false });
    } catch (error: any) {
      console.error('fetchProducts error:', error);
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: productData.title,
          description: productData.description,
          price: productData.price,
          original_price: productData.originalPrice,
          images: productData.images,
          category: productData.category,
          brand: productData.brand,
          in_stock: productData.inStock,
          stock_quantity: productData.stockQuantity,
          rating: productData.rating,
          review_count: productData.reviewCount,
          tags: productData.tags,
          profit_margin: productData.profitMargin,
          specifications: productData.specifications
        }])
        .select()
        .single();

      if (error) throw error;

      // Refresh products list
      await get().fetchProducts();
      return true;
    } catch (error: any) {
      console.error('addProduct error:', error);
      set({ error: error.message });
      return false;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          original_price: productData.originalPrice,
          images: productData.images,
          category: productData.category,
          brand: productData.brand,
          in_stock: productData.inStock,
          stock_quantity: productData.stockQuantity,
          rating: productData.rating,
          review_count: productData.reviewCount,
          tags: productData.tags,
          profit_margin: productData.profitMargin,
          specifications: productData.specifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh products list
      await get().fetchProducts();
      return true;
    } catch (error: any) {
      console.error('updateProduct error:', error);
      set({ error: error.message });
      return false;
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh products list
      await get().fetchProducts();
      return true;
    } catch (error: any) {
      console.error('deleteProduct error:', error);
      set({ error: error.message });
      return false;
    }
  }
}));