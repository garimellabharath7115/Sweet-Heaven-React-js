import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Award, Heart, ShoppingCart } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/Product';

export function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent leading-tight">
            Welcome to Sweet-Heaven
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
            Indulge in our heavenly collection of handcrafted sweets, cakes, and desserts
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <Link
              to="/orders"
              className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              Order Now
            </Link>
            <Link
              to="/cart"
              className="w-full sm:w-auto bg-white text-rose-600 border-2 border-rose-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full hover:bg-rose-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Our Sweet Collection</h2>
          
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
              <p className="text-sm sm:text-base text-gray-500 mt-4">Loading delicious sweets...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Heart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
              <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">Our delicious sweets will be available soon!</p>
              <Link
                to="/orders"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 sm:px-8 py-3 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold"
              >
                Check Back Soon
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={false}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Why Choose Sweet-Heaven?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Award className="h-12 w-12 sm:h-16 sm:w-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Premium Quality</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">We use only the finest ingredients to create our heavenly treats</p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Fast Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Fresh desserts delivered to your doorstep within 30 minutes</p>
            </div>
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Made with Love</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Every sweet is crafted with passion and attention to detail</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}