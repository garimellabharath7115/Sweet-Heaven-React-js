import React from 'react';
import { Product } from '../types/Product';
import { Edit, Trash2, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, isAdmin = false, onEdit, onDelete, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full max-w-sm mx-auto">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 sm:h-48 lg:h-52 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">{product.name}</h3>
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-600 whitespace-nowrap">₹{product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
            {product.category.replace('-', ' ')}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            product.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {isAdmin ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onEdit?.(product)}
              className="flex-1 bg-blue-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete?.(product.id)}
              className="flex-1 bg-red-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold transform hover:scale-105 text-sm sm:text-base"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        )}
      </div>
    </div>
  );
}