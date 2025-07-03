import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, token: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      sendOtp: async (email: string): Promise<boolean> => {
        try {
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error) {
            console.error('sendOtp error:', error);
            return false;
          }
          return true;
        } catch (error) {
          console.error('sendOtp error:', error);
          return false;
        }
      },

      verifyOtp: async (email: string, token: string): Promise<boolean> => {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
          });
          if (error) {
            console.error('verifyOtp error:', error);
            return false;
          }
          if (data && data.user) {
            set({ user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || '',
              role: data.user.user_metadata?.role || 'customer',
              createdAt: data.user.created_at,
            }, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('verifyOtp error:', error);
          return false;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name: name || '' },
            },
          });
          if (error) {
            return { success: false, error: error.message };
          }
          if (data.user) {
            set({ user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || '',
              role: data.user.user_metadata?.role || 'customer',
              createdAt: data.user.created_at,
            }, isAuthenticated: true });
          }
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            return { success: false, error: error.message };
          }
          if (data.user) {
            set({ user: {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || '',
              role: data.user.user_metadata?.role || 'customer',
              createdAt: data.user.created_at,
            }, isAuthenticated: true });
          }
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const { data, error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) {
            return { success: false, error: error.message };
          }
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        supabase.auth.signOut();
      },
    }),
    {
      name: 'auth-storage'
    }
  )
);