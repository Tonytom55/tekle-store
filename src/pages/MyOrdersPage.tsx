import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const { orders, loading, fetchUserOrders } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserOrders(user.id);
    }
  }, [user, fetchUserOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'placed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Please log in to view your orders.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">When you place orders, they'll appear here</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className="font-semibold text-gray-900">
                          Order #{order.id.slice(-8)}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium">R{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-medium">{order.items.length} items</p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Tracking Number:</span>
                        <span className="text-blue-700">{order.trackingNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Order Items Preview */}
                  <div className="flex space-x-4 overflow-x-auto">
                    {order.items.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.images?.[0] || '/placeholder-image.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={item.images?.[0] || '/placeholder-image.jpg'}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.title}</h5>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">R{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-sm text-gray-600">R{item.price} each</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold text-gray-900 mb-4">Delivery Information</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-gray-600">{order.customerEmail}</p>
                          <p className="text-gray-600">{order.customerPhone}</p>
                          {order.customerAddress && (
                            <div className="mt-2">
                              <p className="text-gray-600">
                                {order.customerAddress.street}, {order.customerAddress.city}
                              </p>
                              <p className="text-gray-600">
                                {order.customerAddress.province} {order.customerAddress.postalCode}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}