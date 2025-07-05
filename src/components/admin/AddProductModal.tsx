import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { categories } from '../../data/products';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

interface ProductForm {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  stockQuantity: number;
  profitMargin: number;
  tags: string;
  specifications: { key: string; value: string }[];
}

const defaultCategories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Health',
  'Books & Media',
  'Automotive',
  'Toys & Games'
];

export default function AddOrEditProductModal({ isOpen, onClose, product }: AddProductModalProps) {
  const { addProduct, updateProduct } = useProductStore();
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
        stockQuantity: product.stockQuantity,
        profitMargin: product.profitMargin,
        tags: product.tags ? product.tags.join(', ') : '',
      });
      setSpecifications(Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value })) || [{ key: '', value: '' }]);
      setExistingImages(product.images || []);
      setImageFiles([]);
    } else {
      reset();
      setSpecifications([{ key: '', value: '' }]);
      setExistingImages([]);
      setImageFiles([]);
    }
  }, [product, reset]);

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error('Please select only JPEG, PNG, or WebP images');
        return;
      }
      
      // Validate file sizes (max 5MB each)
      const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error('Each image must be less than 5MB');
        return;
      }
      
      setImageFiles(files);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(((i + 1) / files.length) * 100);
      
      try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        if (!publicUrlData.publicUrl) {
          throw new Error(`Failed to get public URL for ${file.name}`);
        }
        
        uploadedUrls.push(publicUrlData.publicUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }
    
    setUploadProgress(0);
    return uploadedUrls;
  };

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true);
    
    try {
      let finalImageUrls: string[] = [...existingImages];

      // Upload new images if any
      if (imageFiles.length > 0) {
        toast.info('Uploading images...');
        const uploadedUrls = await uploadImages(imageFiles);
        finalImageUrls = [...uploadedUrls];
      }

      if (finalImageUrls.length === 0) {
        toast.error('Please add at least one product image');
        setIsSubmitting(false);
        return;
      }

      const validSpecs = specifications.reduce((acc, spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          acc[spec.key.trim()] = spec.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice || undefined,
        images: finalImageUrls,
        category: data.category,
        brand: data.brand,
        inStock: true,
        stockQuantity: data.stockQuantity,
        rating: product?.rating || 4.5,
        reviewCount: product?.reviewCount || 0,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        profitMargin: data.profitMargin,
        specifications: validSpecs
      };

      let success = false;
      if (product) {
        success = await updateProduct(product.id, productData);
      } else {
        success = await addProduct(productData);
      }

      if (success) {
        toast.success(product ? 'Product updated successfully!' : 'Product added successfully!');
        reset();
        setImageFiles([]);
        setExistingImages([]);
        setSpecifications([{ key: '', value: '' }]);
        onClose();
      } else {
        toast.error(product ? 'Failed to update product. Please try again.' : 'Failed to add product. Please try again.');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(`Error: ${error.message || 'Failed to save product'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                {...register('title', { required: 'Product title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                {...register('brand', { required: 'Brand is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (R) *
              </label>
              <input
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0.01, message: 'Price must be greater than 0' }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (R)
              </label>
              <input
                {...register('originalPrice')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profit Margin (%) *
              </label>
              <input
                {...register('profitMargin', { 
                  required: 'Profit margin is required',
                  min: { value: 0, message: 'Profit margin cannot be negative' }
                })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
              />
              {errors.profitMargin && (
                <p className="text-red-500 text-sm mt-1">{errors.profitMargin.message}</p>
              )}
            </div>
          </div>

          {/* Category and Stock */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {defaultCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                {...register('stockQuantity', { 
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock quantity cannot be negative' }
                })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="wireless, bluetooth, headphones"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images * (JPEG, PNG, WebP - Max 5MB each)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload images or drag and drop</p>
                <p className="text-sm text-gray-500">Supports JPEG, PNG, WebP (Max 5MB each)</p>
              </label>
            </div>
            
            {uploadProgress > 0 && (
              <div className="mt-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading... {Math.round(uploadProgress)}%</p>
              </div>
            )}
            
            {/* Preview existing images */}
            {existingImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="w-20 h-20 bg-gray-100 rounded overflow-hidden border">
                      <img
                        src={url}
                        alt="Current"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Preview new images */}
            {imageFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">New Images ({imageFiles.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="w-20 h-20 bg-gray-100 rounded overflow-hidden border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specifications
            </label>
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specification name"
                  />
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Specification value"
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecification}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add Specification</span>
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSubmitting ? (product ? 'Updating...' : 'Adding Product...') : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}