import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: any;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, trackingNumber?: string) => Promise<boolean>;
  subscribeToOrders: (callback: (order: Order) => void) => () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const orders = data?.map(order => ({
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        items: order.items,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        deliveryNotes: order.delivery_notes,
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      })) || [];

      set({ orders, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ loading: false });
    }
  },

  fetchUserOrders: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const orders = data?.map(order => ({
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        items: order.items,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        deliveryNotes: order.delivery_notes,
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      })) || [];

      set({ orders, loading: false });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      const updateData: any = {
        order_status: status,
        updated_at: new Date().toISOString()
      };

      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }

      if (status === 'shipped' && !trackingNumber) {
        updateData.tracking_number = `TRK${Date.now()}`;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                orderStatus: status, 
                trackingNumber: updateData.tracking_number || order.trackingNumber,
                updatedAt: updateData.updated_at
              }
            : order
        )
      }));

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  },

  subscribeToOrders: (callback: (order: Order) => void) => {
    const subscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        const newOrder = {
          id: payload.new.id,
          userId: payload.new.user_id,
          customerName: payload.new.customer_name,
          customerEmail: payload.new.customer_email,
          customerPhone: payload.new.customer_phone,
          customerAddress: payload.new.customer_address,
          items: payload.new.items,
          totalAmount: payload.new.total_amount,
          paymentMethod: payload.new.payment_method,
          paymentStatus: payload.new.payment_status,
          orderStatus: payload.new.order_status,
          deliveryNotes: payload.new.delivery_notes,
          trackingNumber: payload.new.tracking_number,
          estimatedDelivery: payload.new.estimated_delivery,
          createdAt: payload.new.created_at,
          updatedAt: payload.new.updated_at
        };
        
        callback(newOrder);
        
        // Update local state
        set(state => ({
          orders: [newOrder, ...state.orders]
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }
}));