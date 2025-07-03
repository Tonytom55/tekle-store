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

interface ForgotPasswordForm {
  email: string;
}

export default function LoginPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialIsLogin = params.get('register') === '1' ? false : true;
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, login: loginUser, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<LoginForm | RegisterForm | ForgotPasswordForm>();
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
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  // Forgot password handler
  const onForgot = async (data: ForgotPasswordForm) => {
    setLoading(true);
    const result = await forgotPassword(data.email);
    setLoading(false);
    if (result.success) {
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgot(false);
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  const switchMode = (mode: 'login' | 'register' | 'forgot') => {
    reset();
    if (mode === 'login') {
      setIsLogin(true);
      setShowForgot(false);
    } else if (mode === 'register') {
      setIsLogin(false);
      setShowForgot(false);
    } else {
      setShowForgot(true);
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
            {showForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-gray-600">
            {showForgot 
              ? 'Enter your email to receive reset instructions'
              : isLogin 
                ? 'Sign in to your account' 
                : 'Join our community today'
            }
          </p>
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
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 mt-2"
              >
                Back to Sign In
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
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
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
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                </div>
              </div>
              
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
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
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
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
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message as string}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Demo Credentials */}
          {isLogin && !showForgot && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> tigraytip@gmail.com / tom@11223344</p>
                <p><strong>Customer:</strong> customer@example.com / password123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}