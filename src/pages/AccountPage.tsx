import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, MapPin, Heart, Package, Edit2, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAddressStore } from '../stores/addressStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import AddressModal from '../components/account/AddressModal';
import { supabase } from '../lib/supabase';

type TabType = 'profile' | 'security' | 'addresses' | 'wishlist' | 'orders';

interface ProfileForm {
  name: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const { user, logout } = useAuthStore();
  const { addresses, fetchAddresses, deleteAddress, setDefaultAddress } = useAddressStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm<ProfileForm>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm<PasswordForm>();

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email
      });
    }
  }, [user, resetProfile]);

  useEffect(() => {
    fetchAddresses();
    fetchWishlist();
  }, [fetchAddresses, fetchWishlist]);

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: { name: data.name }
      });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setIsEditingPassword(false);
      resetPassword();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const success = await deleteAddress(addressId);
      if (success) {
        toast.success('Address deleted successfully');
      } else {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    const success = await setDefaultAddress(addressId);
    if (success) {
      toast.success('Default address updated');
    } else {
      toast.error('Failed to update default address');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Personal Details', icon: User },
    { id: 'security', label: 'Security Settings', icon: Lock },
    { id: 'addresses', label: 'Address Book', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'orders', label: 'My Orders', icon: Package },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your account</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Details */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Personal Details</h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        {...registerProfile('name', { required: 'Name is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        {...registerProfile('email', { required: 'Email is required' })}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <button
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>{isEditingPassword ? 'Cancel' : 'Change Password'}</span>
                  </button>
                </div>

                {isEditingPassword ? (
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        {...registerPassword('currentPassword', { required: 'Current password is required' })}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        {...registerPassword('newPassword', { required: 'New password is required' })}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        {...registerPassword('confirmPassword', { required: 'Please confirm your password' })}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingPassword(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-600">••••••••••••</p>
                      </div>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Address Book */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Address Book</h2>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.isDefault && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.street}, {address.city}, {address.province} {address.postalCode}
                            </p>
                            <p className="text-gray-600 text-sm">{address.phone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingAddress(address);
                                setIsAddressModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefault(address.id)}
                                className="text-green-600 hover:text-green-700 text-xs"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">My Orders</h2>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
      />
    </div>
  );
}