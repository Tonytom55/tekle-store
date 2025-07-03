import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CategoriesPage from './pages/CategoriesPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './stores/authStore';
import { createClient } from '@supabase/supabase-js';
import MyOrdersPage from './pages/MyOrdersPage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { user } = useAuthStore();
  console.log('Current user:', user);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            {/* Placeholder routes for other pages */}
            <Route path="/deals" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Deals Page - Coming Soon</h1></div>} />
            <Route path="/track" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Order Tracking - Coming Soon</h1></div>} />
            <Route path="/account" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Account Page - Coming Soon</h1></div>} />
            <Route path="/orders" element={<MyOrdersPage />} />
          </Routes>
        </main>
        <Footer />
        <CartSidebar />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;