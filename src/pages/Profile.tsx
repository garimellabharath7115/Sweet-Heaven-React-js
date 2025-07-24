import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Heart, Package, Settings } from 'lucide-react';

export function Profile() {
  const { currentUser, isAdmin } = useAuth();

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <User className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-rose-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">My Profile</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">Manage your Sweet-Heaven account</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 mr-2" />
              Account Information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-900 break-all">{currentUser?.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Account Type</label>
                <div className="flex items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  {isAdmin ? (
                    <>
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-amber-600 font-semibold">Administrator</span>
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-rose-600 font-semibold">Sweet Lover</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Member Since</label>
                <div className="flex items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-900">
                    {currentUser?.metadata?.creationTime ? 
                      new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                      'Today'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 mr-2" />
              Order Statistics
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-rose-600">0</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600">₹0.00</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">★ 0.0</div>
                <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Preferences</h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Favorite Sweets</h3>
              <div className="space-y-2">
                <p className="text-gray-500 text-xs sm:text-sm">No favorites yet. Start ordering to build your preferences!</p>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Delivery Preferences</h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <p>📍 Default Address: Not set</p>
                <p>🕐 Preferred Time: Not set</p>
                <p>📱 SMS Notifications: Not configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}