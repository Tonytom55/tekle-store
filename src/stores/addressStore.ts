import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressStore {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],
  loading: false,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      const addresses = data?.map(addr => ({
        id: addr.id,
        name: addr.name,
        street: addr.street,
        city: addr.city,
        province: addr.province,
        postalCode: addr.postal_code,
        phone: addr.phone,
        isDefault: addr.is_default,
        createdAt: addr.created_at,
        updatedAt: addr.updated_at
      })) || [];

      set({ addresses, loading: false });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      set({ loading: false });
    }
  },

  addAddress: async (addressData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('addresses')
        .insert([{
          user_id: user.id,
          name: addressData.name,
          street: addressData.street,
          city: addressData.city,
          province: addressData.province,
          postal_code: addressData.postalCode,
          phone: addressData.phone,
          is_default: addressData.isDefault
        }]);

      if (error) throw error;

      await get().fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error adding address:', error);
      return false;
    }
  },

  updateAddress: async (id, addressData) => {
    try {
      const updateData: any = {};
      if (addressData.name) updateData.name = addressData.name;
      if (addressData.street) updateData.street = addressData.street;
      if (addressData.city) updateData.city = addressData.city;
      if (addressData.province) updateData.province = addressData.province;
      if (addressData.postalCode) updateData.postal_code = addressData.postalCode;
      if (addressData.phone) updateData.phone = addressData.phone;
      if (addressData.isDefault !== undefined) updateData.is_default = addressData.isDefault;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('addresses')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await get().fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error updating address:', error);
      return false;
    }
  },

  deleteAddress: async (id) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      return false;
    }
  },

  setDefaultAddress: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // First, unset all default addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      await get().fetchAddresses();
      return true;
    } catch (error) {
      console.error('Error setting default address:', error);
      return false;
    }
  }
}));