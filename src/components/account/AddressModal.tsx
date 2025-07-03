import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAddressStore, Address } from '../../stores/addressStore';
import toast from 'react-hot-toast';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
}

interface AddressForm {
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

const provinces = [
  'Western Cape',
  'Gauteng',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Free State'
];

export default function AddressModal({ isOpen, onClose, address }: AddressModalProps) {
  const { addAddress, updateAddress } = useAddressStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressForm>();

  React.useEffect(() => {
    if (address) {
      reset({
        name: address.name,
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        phone: address.phone,
        isDefault: address.isDefault
      });
    } else {
      reset({
        name: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        phone: '',
        isDefault: false
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: AddressForm) => {
    try {
      let success;
      if (address) {
        success = await updateAddress(address.id, data);
      } else {
        success = await addAddress(data);
      }

      if (success) {
        toast.success(address ? 'Address updated successfully!' : 'Address added successfully!');
        onClose();
      } else {
        toast.error('Failed to save address');
      }
    } catch (error) {
      toast.error('An error occurred while saving the address');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {address ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Name *
            </label>
            <input
              {...register('name', { required: 'Address name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Home, Office"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              {...register('street', { required: 'Street address is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main Street"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                {...register('city', { required: 'City is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Cape Town"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                {...register('postalCode', { required: 'Postal code is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="8001"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province *
            </label>
            <select
              {...register('province', { required: 'Province is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              {...register('phone', { required: 'Phone number is required' })}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+27 12 345 6789"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...register('isDefault')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {address ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}