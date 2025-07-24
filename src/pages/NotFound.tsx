import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl sm:text-8xl font-bold text-rose-500 mb-4">404</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Oops! The sweet page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go to Homepage</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <Search className="h-5 w-5 text-rose-500" />
            <span>Looking for something?</span>
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <Link to="/" className="block hover:text-rose-600 transition-colors">
              🏠 Homepage - Browse our sweet collection
            </Link>
            <Link to="/cart" className="block hover:text-rose-600 transition-colors">
              🛒 Cart - View your selected items
            </Link>
            <Link to="/orders" className="block hover:text-rose-600 transition-colors">
              📦 Orders - Track your sweet orders
            </Link>
            <Link to="/profile" className="block hover:text-rose-600 transition-colors">
              👤 Profile - Manage your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}