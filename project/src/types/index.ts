export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  supplierId?: string;
  profitMargin: number;
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  images: string[];
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'placed' | 'processing' | 'supplier_notified' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  apiConnected: boolean;
  products: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}