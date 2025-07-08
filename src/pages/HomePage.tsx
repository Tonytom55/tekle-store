import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Package, Star } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useProductStore } from '../stores/productStore';

export default function HomePage() {
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Demo products to show if no products are loaded
  const demoProducts = [
    {
      id: 'demo-1',
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium wireless headphones with noise cancellation',
      price: 299.99,
      originalPrice: 399.99,
      images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600'],
      category: 'Electronics',
      brand: 'AudioTech',
      inStock: true,
      stockQuantity: 50,
      rating: 4.8,
      reviewCount: 156,
      tags: ['wireless', 'bluetooth'],
      profitMargin: 35,
      specifications: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-2',
      title: 'Smart Fitness Watch',
      description: 'Advanced fitness tracker with heart rate monitoring',
      price: 199.99,
      originalPrice: 249.99,
      images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600'],
      category: 'Electronics',
      brand: 'FitTech',
      inStock: true,
      stockQuantity: 75,
      rating: 4.6,
      reviewCount: 89,
      tags: ['smartwatch', 'fitness'],
      profitMargin: 40,
      specifications: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-3',
      title: 'Premium Coffee Maker',
      description: 'Professional-grade coffee maker with built-in grinder',
      price: 149.99,
      originalPrice: 199.99,
      images: ['https://images.pexels.com/photos/2434365/pexels-photo-2434365.jpeg?auto=compress&cs=tinysrgb&w=600'],
      category: 'Home & Garden',
      brand: 'BrewMaster',
      inStock: true,
      stockQuantity: 32,
      rating: 4.7,
      reviewCount: 112,
      tags: ['coffee', 'kitchen'],
      profitMargin: 30,
      specifications: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-4',
      title: 'Wireless Gaming Mouse',
      description: 'High-precision gaming mouse with RGB lighting',
      price: 79.99,
      originalPrice: 99.99,
      images: ['https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600'],
      category: 'Electronics',
      brand: 'GameTech',
      inStock: true,
      stockQuantity: 68,
      rating: 4.5,
      reviewCount: 203,
      tags: ['gaming', 'mouse'],
      profitMargin: 45,
      specifications: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const displayProducts = products.length > 0 ? products.slice(0, 8) : demoProducts;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Welcome to Our Store
                <span className="block text-yellow-300">Quality Products for You</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Browse our carefully selected collection of premium products. 
                Quality guaranteed, delivered to your door with excellent customer service.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="lg:flex justify-center">
              <img
                src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Shopping Experience"
                className="rounded-2xl shadow-2xl max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600">We provide the best shopping experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">Free shipping on orders over R1,000. Get your products delivered quickly and safely.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with bank-level security. Your data is always protected.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated support team is here to help you with any questions or concerns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Discover our amazing collection</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest deals and product updates
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}