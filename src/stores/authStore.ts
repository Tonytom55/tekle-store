import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      register: async (email: string, password: string, name?: string) => {
        try {
          // Check if this is the admin email
          const isAdmin = email === 'tigraytip@gmail.com';
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { 
                name: name || '',
                role: isAdmin ? 'admin' : 'customer'
              },
            },
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          if (data.user) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || '',
              role: data.user.user_metadata?.role || 'customer',
              createdAt: data.user.created_at,
            };
            
            set({ user: userData, isAuthenticated: true });
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
            const userData: User = {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || '',
              role: data.user.user_metadata?.role || 'customer',
              createdAt: data.user.created_at,
            };
            
            set({ user: userData, isAuthenticated: true });
          }
          
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          
          if (error) {
            return { success: false, error: error.message };
          }
          
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      updateProfile: async (name: string, email: string) => {
        try {
          const { error } = await supabase.auth.updateUser({
            email,
            data: { name }
          });

          if (error) {
            return { success: false, error: error.message };
          }

          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                name,
                email
              }
            });
          }

          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      updatePassword: async (newPassword: string) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          });

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