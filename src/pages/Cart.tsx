import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Heart, CreditCard, MapPin, Phone, User, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { DeliveryDetails } from '../types/Order';

type Step = 'cart' | 'delivery' | 'payment' | 'confirmation';

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('cart');
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    address: '',
    pincode: '',
    phoneNumber: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotalAmount();
  const tax = subtotal * 0.08;
  const delivery = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + delivery;

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDetails.fullName || !deliveryDetails.address || !deliveryDetails.pincode || !deliveryDetails.phoneNumber) {
      setError('Please fill in all delivery details');
      return;
    }
    setError('');
    setCurrentStep('payment');
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (!utrNumber.trim()) {
      setError('Please enter the UTR number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createOrder(
        cartItems,
        deliveryDetails,
        total,
        paymentMethod,
        utrNumber.trim()
      );
      
      clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order! We've received your payment and will start preparing your delicious sweets.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold"
              >
                Track Your Order
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
            {[
              { step: 'cart', label: 'Cart', icon: ShoppingCart },
              { step: 'delivery', label: 'Delivery', icon: MapPin },
              { step: 'payment', label: 'Payment', icon: CreditCard },
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                  currentStep === step 
                    ? 'bg-rose-500 border-rose-500 text-white' 
                    : index < ['cart', 'delivery', 'payment'].indexOf(currentStep)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Icon className="h-3 w-3 sm:h-5 sm:w-5" />
                </div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  currentStep === step ? 'text-rose-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {index < 2 && <div className="w-4 sm:w-8 h-px bg-gray-300 mx-2 sm:mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <ShoppingCart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-rose-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            {currentStep === 'cart' && 'Your Sweet Cart'}
            {currentStep === 'delivery' && 'Delivery Details'}
            {currentStep === 'payment' && 'Payment'}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            {currentStep === 'cart' && 'Review your delicious selections'}
            {currentStep === 'delivery' && 'Where should we deliver your sweets?'}
            {currentStep === 'payment' && 'Complete your payment'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {currentStep === 'cart' && (
          <>
            {cartItems.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                          <p className="text-rose-600 font-bold text-sm sm:text-base">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1.5 sm:p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors ml-1 sm:ml-2"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-20 lg:top-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">
                          {delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-base sm:text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-rose-600">₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => currentUser ? setCurrentStep('delivery') : navigate('/auth')}
                      className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 sm:py-3 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-semibold text-sm sm:text-base"
                    >
                      {currentUser ? 'Proceed to Delivery' : 'Login to Continue'}
                    </button>
                    <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-3">
                      Free delivery on orders over ₹50
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <ShoppingCart className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-4" />
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Add some delicious sweets to get started!</p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  Browse Menu
                </button>
              </div>
            )}
          </>
        )}

        {currentStep === 'delivery' && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleDeliverySubmit} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Delivery Information</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      <User className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.fullName}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, fullName: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Delivery Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={deliveryDetails.address}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
                      placeholder="Enter your complete address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        value={deliveryDetails.pincode}
                        onChange={(e) => setDeliveryDetails({...deliveryDetails, pincode: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
                        placeholder="123456"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        <Phone className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={deliveryDetails.phoneNumber}
                        onChange={(e) => setDeliveryDetails({...deliveryDetails, phoneNumber: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('cart')}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold text-sm sm:text-base"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-20 lg:top-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                      {delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-base sm:text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-rose-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-3">
                  Free delivery on orders over ₹50
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Payment Method</h3>
                
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border-2 border-rose-200 rounded-lg bg-rose-50">
                    <input
                      type="radio"
                      id="upi"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-3 w-3 sm:h-4 sm:w-4 text-rose-600"
                    />
                    <label htmlFor="upi" className="flex-1 font-medium text-gray-900 text-sm sm:text-base">
                      UPI Payment
                    </label>
                  </div>
                </div>
                
                <div className="text-center mb-6 sm:mb-8">
                  <QRCodeGenerator 
                    upiId="7601017292@ybl" 
                    amount={total}
                    merchantName="Sweet-Heaven"
                  />
                </div>
                
                <form onSubmit={handleOrderSubmit}>
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      UTR/Transaction Reference Number
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base"
                      placeholder="Enter UTR number after payment"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                      Scan the QR code with any UPI app (GPay, PhonePe, Paytm) to pay ₹{total.toFixed(2)}, then enter the UTR/Transaction ID here
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('delivery')}
                      className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
                    >
                      {loading ? 'Processing...' : 'Complete Order'}
                    </button>
                  </div>
                </form>
              </div>
                </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-20 lg:top-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm sm:text-base mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                      {delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-base sm:text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-rose-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Delivery To:</h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p className="font-medium break-words">{deliveryDetails.fullName}</p>
                    <p className="break-words">{deliveryDetails.address}</p>
                    <p>{deliveryDetails.pincode}</p>
                    <p>{deliveryDetails.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}