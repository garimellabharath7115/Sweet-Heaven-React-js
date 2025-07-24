import React from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, User, Calendar, CreditCard, Hash } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/Order';

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'shipped':
      return <Truck className="h-5 w-5 text-blue-500" />;
    case 'confirmed':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'pending':
      return <Package className="h-5 w-5 text-gray-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'confirmed':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Order Received';
    case 'confirmed':
      return 'Confirmed';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export function Orders() {
  const { orders, loading, error } = useOrders();

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Package className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-rose-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Your Sweet Orders</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">Track your delicious orders from Sweet-Heaven</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
            <p className="text-sm sm:text-base text-gray-500 mt-2">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Package className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-4" />
            <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Start ordering some delicious sweets from our menu!</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="bg-white p-3 rounded-full shadow-md">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span>{order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusColor(order.status)} whitespace-nowrap`}>
                        {getStatusText(order.status)}
                      </span>
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-rose-600">₹{order.totalAmount.toFixed(2)}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Total Amount</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Items Section */}
                    <div className="space-y-4 sm:space-y-6">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 mr-2" />
                        Order Items
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
                            <div className="flex-shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl shadow-md"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h5 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{item.name}</h5>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</span>
                                <span className="text-sm sm:text-base font-bold text-rose-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">₹{item.price.toFixed(2)} each</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Delivery Details */}
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center mb-3 sm:mb-4">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 mr-2" />
                          Delivery Details
                        </h4>
                        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 space-y-3">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base font-medium text-gray-900 break-words">{order.deliveryDetails.fullName}</span>
                          </div>
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm sm:text-base text-gray-700">
                              <p className="break-words">{order.deliveryDetails.address}</p>
                              <p className="font-medium">PIN: {order.deliveryDetails.pincode}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base font-medium text-gray-900">{order.deliveryDetails.phoneNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center mb-3 sm:mb-4">
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 mr-2" />
                          Payment Details
                        </h4>
                        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base text-gray-600">Payment Method</span>
                            <span className="text-sm sm:text-base font-semibold text-gray-900 uppercase">{order.paymentMethod}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="text-sm sm:text-base text-gray-600 flex items-center">
                              <Hash className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              UTR Number
                            </span>
                            <span className="font-mono text-xs sm:text-sm bg-white px-2 sm:px-3 py-1 rounded-lg border font-semibold text-gray-900 break-all">
                              {order.utrNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}