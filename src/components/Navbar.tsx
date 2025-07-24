import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, User, Package, Home, LogOut, Menu, X } from 'lucide-react';

export function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                Sweet-Heaven
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-rose-50"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-rose-50"
            >
              <Package className="h-5 w-5" />
              <span>Orders</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors duration-200 relative px-2 py-1 rounded-lg hover:bg-rose-50"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-rose-50"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-2 rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-rose-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200 rounded-lg"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200 rounded-lg"
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">Orders</span>
              </Link>
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Cart</span>
                </div>
                {getTotalItems() > 0 && (
                  <span className="bg-rose-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200 rounded-lg"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 px-3 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 transition-all duration-200 rounded-lg mx-1"
                    >
                      <Package className="h-5 w-5" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200 rounded-lg w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center space-x-3 px-3 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-200 rounded-lg mx-1 font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
            
            {/* User info in mobile menu */}
            {currentUser && (
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <p className="text-sm text-gray-600">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}