import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Package } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialIsLogin = params.get('register') === '1' ? false : true;
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showForgot, setShowForgot] = useState(false);
  const { register: registerUser, login: loginUser, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm | RegisterForm>();
  const [loading, setLoading] = useState(false);

  // Login handler
  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    const { email, password } = data;
    const result = await loginUser(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Successfully logged in!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  // Register handler
  const onRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await registerUser(data.email, data.password, data.name);
    setLoading(false);
    if (result.success) {
      toast.success('Registration successful! Please check your email to confirm.');
      setIsLogin(true);
      reset();
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  // Forgot password handler
  const onForgot = async (data: { email: string }) => {
    setLoading(true);
    const result = await forgotPassword(data.email);
    setLoading(false);
    if (result.success) {
      toast.success('Password reset email sent!');
      setShowForgot(false);
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 text-2xl font-bold text-blue-600 mb-6">
            <Package className="h-8 w-8" />
            <span>DropShip Store</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {showForgot ? 'Forgot Password' : isLogin ? 'Sign In' : 'Register'}
          </h2>
        </div>
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {showForgot ? (
            <form onSubmit={handleSubmit(onForgot)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 mt-2"
              >
                Back to Login
              </button>
            </form>
          ) : isLogin ? (
            <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message as string}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}