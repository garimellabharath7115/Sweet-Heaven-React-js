import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { useUsers } from '../hooks/useUsers';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { Product } from '../types/Product';
import { Order } from '../types/Order';
import { UserData } from '../hooks/useUsers';
import { 
  Package, 
  Plus, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  User,
  Trash2,
  AlertTriangle,
  CreditCard,
  Hash
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'orders' | 'users';

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

export function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  const { users, loading: usersLoading, deleteUserAccount } = useUsers();

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalUsers = users.length;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        alert('Product deleted successfully!');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleProductSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, imageFile);
        alert('Product updated successfully!');
      } else {
        if (!imageFile) {
          throw new Error('Image is required for new products');
        }
        await addProduct(productData, imageFile);
        alert('Product added successfully!');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteUser = async (uid: string, email: string) => {
    if (email === 'admin@gmail.com') {
      alert('Cannot delete admin account');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user: ${email}?`)) {
      try {
        await deleteUserAccount(uid);
        alert('User deleted successfully!');
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Package className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-rose-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Admin Dashboard</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">Manage your Sweet-Heaven business</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 sm:mb-8">
          <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-rose-500 text-rose-600 bg-rose-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 sm:h-12 sm:w-12 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600">{pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-amber-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Recent Orders</h2>
              {ordersLoading ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No orders yet</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="text-sm sm:text-base font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs sm:text-sm text-gray-500 break-all">{order.userEmail}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm sm:text-base font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{order.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4 sm:space-y-6">
            {showProductForm ? (
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                loading={formLoading}
              />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Products Management</h2>
                  <button
                    onClick={handleAddProduct}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base font-semibold"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Add Product</span>
                  </button>
                </div>

                {productsLoading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isAdmin={true}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Orders Management</h2>
            
            {ordersLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base text-gray-500">No orders yet</p>
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
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span>{order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="break-all">{order.userEmail}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
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
                                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
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
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Users Management</h2>
              <div className="bg-white rounded-lg px-3 sm:px-4 py-2 shadow-md">
                <span className="text-xs sm:text-sm text-gray-600">Total Users: </span>
                <span className="text-base sm:text-lg font-bold text-rose-600">{totalUsers}</span>
              </div>
            </div>
            
            {usersLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Users className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base text-gray-500">No users yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          UID
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Joined
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                          Last Login
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
                                </div>
                              </div>
                              <div className="ml-2 sm:ml-4">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                  {user.displayName || 'No name'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-xs sm:text-sm text-gray-900 break-all max-w-xs">{user.email}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-xs text-gray-500 font-mono">{user.uid.slice(0, 8)}...</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isAdmin 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                            {user.createdAt?.toLocaleDateString() || 'Unknown'}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden xl:table-cell">
                            {user.lastLoginAt?.toLocaleDateString() || 'Never'}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            {user.email !== 'admin@gmail.com' ? (
                              <button
                                onClick={() => handleDeleteUser(user.uid, user.email)}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1 transition-colors p-1"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}