import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStore {
  reviews: Review[];
  loading: boolean;
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (productId: string, rating: number, comment: string) => Promise<boolean>;
  updateReview: (reviewId: string, rating: number, comment: string) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  loading: false,

  fetchReviews: async (productId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviews = data?.map(review => ({
        id: review.id,
        productId: review.product_id,
        userId: review.user_id,
        userName: review.profiles?.name || 'Anonymous',
        rating: review.rating,
        comment: review.comment || '',
        createdAt: review.created_at,
        updatedAt: review.updated_at
      })) || [];

      set({ reviews, loading: false });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ loading: false });
    }
  },

  addReview: async (productId: string, rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('product_reviews')
        .insert([{
          product_id: productId,
          user_id: user.id,
          rating,
          comment
        }]);

      if (error) throw error;

      await get().fetchReviews(productId);
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  },

  updateReview: async (reviewId: string, rating: number, comment: string) => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Refresh reviews for the product
      const review = get().reviews.find(r => r.id === reviewId);
      if (review) {
        await get().fetchReviews(review.productId);
      }
      return true;
    } catch (error) {
      console.error('Error updating review:', error);
      return false;
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      const review = get().reviews.find(r => r.id === reviewId);
      
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      if (review) {
        await get().fetchReviews(review.productId);
      }
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }
}));