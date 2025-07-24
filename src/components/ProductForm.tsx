import React, { useState, useRef } from 'react';
import { Product } from '../types/Product';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'cakes',
    inStock: product?.inStock ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'cakes', label: 'Cakes' },
    { value: 'cookies', label: 'Cookies' },
    { value: 'pastries', label: 'Pastries' },
    { value: 'chocolates', label: 'Chocolates' },
    { value: 'ice-cream', label: 'Ice Cream' },
    { value: 'beverages', label: 'Beverages' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
        console.log('Image preview set');
      };
      reader.readAsDataURL(file);
      setError('');
    } else {
      // Handle case when no file is selected (user cancels)
      setImageFile(null);
      if (!product) {
        setImagePreview('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('Form submitted with data:', formData);
    console.log('Image file:', imageFile);

    if (!product && !imageFile) {
      setError('Please select an image for the product');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      console.log('Calling onSubmit...');
      await onSubmit(formData, imageFile || undefined);
      console.log('Product saved successfully');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-rose-400 transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 sm:h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : (
              <div className="cursor-pointer">
                <ImageIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">Click to upload product image</p>
                <p className="text-xs sm:text-sm text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${imagePreview ? 'hidden' : ''}`}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs sm:text-sm text-rose-600 hover:text-rose-700"
              >
                Change Image
              </button>
            )}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
            placeholder="Enter product name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
            placeholder="Enter product description"
          />
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* In Stock Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.inStock}
            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            className="h-3 w-3 sm:h-4 sm:w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 block text-sm sm:text-base text-gray-700">
            Product is in stock
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}