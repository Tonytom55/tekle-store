import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          original_price: number | null;
          images: string[];
          category: string;
          brand: string;
          in_stock: boolean;
          stock_quantity: number;
          rating: number;
          review_count: number;
          tags: string[];
          profit_margin: number;
          specifications: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          original_price?: number | null;
          images: string[];
          category: string;
          brand: string;
          in_stock?: boolean;
          stock_quantity?: number;
          rating?: number;
          review_count?: number;
          tags?: string[];
          profit_margin?: number;
          specifications?: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          images?: string[];
          category?: string;
          brand?: string;
          in_stock?: boolean;
          stock_quantity?: number;
          rating?: number;
          review_count?: number;
          tags?: string[];
          profit_margin?: number;
          specifications?: Record<string, string>;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: Record<string, string>;
          items: any[];
          total_amount: number;
          payment_method: string;
          payment_status: string;
          order_status: string;
          delivery_notes: string | null;
          tracking_number: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: Record<string, string>;
          items: any[];
          total_amount: number;
          payment_method: string;
          payment_status?: string;
          order_status?: string;
          delivery_notes?: string | null;
          tracking_number?: string | null;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          payment_status?: string;
          order_status?: string;
          tracking_number?: string | null;
          estimated_delivery?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}