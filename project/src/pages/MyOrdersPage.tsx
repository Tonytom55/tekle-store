import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();

    // Real-time subscription for user's orders
    const orderSub = supabase
      .channel('user-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, (payload) => {
        setOrders((prevOrders) => {
          if (payload.eventType === 'INSERT') {
            return [payload.new, ...prevOrders];
          } else if (payload.eventType === 'UPDATE') {
            return prevOrders.map((order) => order.id === payload.new.id ? payload.new : order);
          } else if (payload.eventType === 'DELETE') {
            return prevOrders.filter((order) => order.id !== payload.old.id);
          }
          return prevOrders;
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(orderSub);
    };
  }, [user]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Please log in to view your orders.</h1></div>;
  }

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">You have no orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold">Order ID:</span> {order.id}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{order.status || 'Not yet shipped'}</span>
              </div>
              <div className="text-gray-600 mb-2">Placed on: {order.created_at ? new Date(order.created_at).toLocaleString() : ''}</div>
              <div className="font-semibold mb-1">Total: R{order.total}</div>
              {/* You can expand this to show order items, address, etc. */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 