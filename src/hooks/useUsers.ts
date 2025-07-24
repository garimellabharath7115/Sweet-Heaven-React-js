import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  orderBy, 
  query,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from '../firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  isAdmin?: boolean;
}

export function useUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to users collection in Firestore
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastLoginAt: doc.data().lastLoginAt?.toDate(),
        })) as UserData[];
        
        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    users,
    loading,
    error,
    deleteUserAccount: async (uid: string) => {
      try {
        setError(null);
        
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', uid));
        
        console.log(`User ${uid} deleted from Firestore`);
        
        // Note: Deleting from Firebase Auth requires admin SDK on backend
        // For now, we only delete from Firestore
        // In production, you'd need a cloud function to delete from Auth
        
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
        throw error;
      }
    }
  };
}