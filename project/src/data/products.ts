import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 245
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 189
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 156
  },
  {
    id: '4',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 98
  },
  {
    id: '5',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 127
  },
  {
    id: '6',
    name: 'Books & Media',
    slug: 'books-media',
    image: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 78
  }
];

export const products: Product[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    price: 299.99,
    originalPrice: 399.99,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Electronics',
    brand: 'AudioTech',
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 156,
    tags: ['wireless', 'bluetooth', 'headphones', 'noise-cancelling'],
    profitMargin: 35,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '2',
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, waterproof design, and 7-day battery life. Track your health and fitness goals.',
    price: 199.99,
    originalPrice: 249.99,
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Electronics',
    brand: 'FitTech',
    inStock: true,
    stockQuantity: 75,
    rating: 4.6,
    reviewCount: 89,
    tags: ['smartwatch', 'fitness', 'health', 'waterproof'],
    profitMargin: 40,
    createdAt: '2024-01-16T09:20:00Z',
    updatedAt: '2024-01-21T16:45:00Z'
  },
  {
    id: '3',
    title: 'Premium Coffee Maker',
    description: 'Professional-grade coffee maker with programmable brewing, built-in grinder, and thermal carafe. Make perfect coffee every morning.',
    price: 149.99,
    originalPrice: 199.99,
    images: [
      'https://images.pexels.com/photos/2434365/pexels-photo-2434365.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Home & Garden',
    brand: 'BrewMaster',
    inStock: true,
    stockQuantity: 32,
    rating: 4.7,
    reviewCount: 112,
    tags: ['coffee', 'kitchen', 'appliance', 'premium'],
    profitMargin: 30,
    createdAt: '2024-01-17T11:15:00Z',
    updatedAt: '2024-01-22T13:30:00Z'
  },
  {
    id: '4',
    title: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting, 12000 DPI sensor, and ultra-fast wireless connectivity for competitive gaming.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Electronics',
    brand: 'GameTech',
    inStock: true,
    stockQuantity: 68,
    rating: 4.5,
    reviewCount: 203,
    tags: ['gaming', 'mouse', 'wireless', 'rgb'],
    profitMargin: 45,
    createdAt: '2024-01-18T14:45:00Z',
    updatedAt: '2024-01-23T10:20:00Z'
  },
  {
    id: '5',
    title: 'Organic Skincare Set',
    description: 'Complete 5-piece skincare routine with cleanser, toner, serum, moisturizer, and SPF. Made with natural organic ingredients for all skin types.',
    price: 89.99,
    originalPrice: 119.99,
    images: [
      'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Beauty & Health',
    brand: 'NaturalGlow',
    inStock: true,
    stockQuantity: 45,
    rating: 4.9,
    reviewCount: 78,
    tags: ['skincare', 'organic', 'natural', 'beauty'],
    profitMargin: 50,
    createdAt: '2024-01-19T08:30:00Z',
    updatedAt: '2024-01-24T15:45:00Z'
  },
  {
    id: '6',
    title: 'Yoga Mat Premium',
    description: 'Extra thick non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and home workouts. Includes carrying strap.',
    price: 49.99,
    originalPrice: 69.99,
    images: [
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4327024/pexels-photo-4327024.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Sports & Outdoors',
    brand: 'ZenFit',
    inStock: true,
    stockQuantity: 120,
    rating: 4.4,
    reviewCount: 165,
    tags: ['yoga', 'fitness', 'mat', 'eco-friendly'],
    profitMargin: 60,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  },
  {
    id: '7',
    title: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7937047/pexels-photo-7937047.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Electronics',
    brand: 'ChargeTech',
    inStock: true,
    stockQuantity: 95,
    rating: 4.3,
    reviewCount: 134,
    tags: ['wireless', 'charger', 'phone', 'fast-charging'],
    profitMargin: 55,
    createdAt: '2024-01-21T16:20:00Z',
    updatedAt: '2024-01-26T11:30:00Z'
  },
  {
    id: '8',
    title: 'Designer Sunglasses',
    description: 'Premium polarized sunglasses with UV400 protection and lightweight titanium frame. Stylish design suitable for any occasion.',
    price: 159.99,
    originalPrice: 219.99,
    images: [
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1534392/pexels-photo-1534392.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'Fashion',
    brand: 'StyleVision',
    inStock: true,
    stockQuantity: 28,
    rating: 4.6,
    reviewCount: 92,
    tags: ['sunglasses', 'fashion', 'designer', 'polarized'],
    profitMargin: 65,
    createdAt: '2024-01-22T13:45:00Z',
    updatedAt: '2024-01-27T14:20:00Z'
  }
];