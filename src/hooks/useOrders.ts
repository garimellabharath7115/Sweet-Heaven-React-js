import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, CartItem, DeliveryDetails } from '../types/Order';
import { useAuth } from '../context/AuthContext';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setUserOrders([]);
      setLoading(false);
      return;
    }

    // For admin: listen to all orders
    if (isAdmin) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          })) as Order[];
          
          setOrders(ordersData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching orders:', error);
          setError('Failed to fetch orders');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      // For regular users: listen to their orders only
      // Option 1: Use where clause only, then sort in memory
      const q = query(
        collection(db, 'orders'), 
        where('userId', '==', currentUser.uid)
      );
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          })) as Order[];
          
          // Sort in memory instead of using Firestore orderBy
          ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          setUserOrders(ordersData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching user orders:', error);
          setError('Failed to fetch orders');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [currentUser, isAdmin]);

  const createOrder = async (
    items: CartItem[],
    deliveryDetails: DeliveryDetails,
    totalAmount: number,
    paymentMethod: string,
    utrNumber: string
  ) => {
    if (!currentUser) {
      throw new Error('User must be logged in to create an order');
    }

    try {
      setError(null);
      
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        items,
        deliveryDetails,
        totalAmount,
        paymentMethod,
        utrNumber,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setError(null);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      console.log('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
      throw error;
    }
  };

  return {
    orders: isAdmin ? orders : userOrders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
  };
}