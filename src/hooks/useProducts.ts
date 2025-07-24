import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Product } from '../types/Product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[];
        
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `products/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, fileName);
    
    try {
      console.log('Uploading image to:', fileName);
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Upload successful:', uploadResult);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File) => {
    try {
      setError(null);
      console.log('Adding product with data:', productData);
      console.log('Image file:', imageFile);
      
      const imageUrl = await uploadImage(imageFile);
      console.log('Image uploaded successfully, URL:', imageUrl);
      
      const productDoc = {
        ...productData,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      console.log('Adding product document:', productDoc);
      const docRef = await addDoc(collection(db, 'products'), productDoc);
      console.log('Product added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
      throw error;
    }
  };

  const updateProduct = async (
    productId: string, 
    productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>, 
    imageFile?: File
  ) => {
    try {
      setError(null);
      const updateData: any = {
        ...productData,
        updatedAt: serverTimestamp(),
      };

      if (imageFile) {
        console.log('Updating product with new image');
        // Delete old image
        const oldProduct = products.find(p => p.id === productId);
        if (oldProduct?.imageUrl) {
          try {
            await deleteImage(oldProduct.imageUrl);
          } catch (error) {
            console.warn('Could not delete old image:', error);
          }
        }
        
        // Upload new image
        updateData.imageUrl = await uploadImage(imageFile);
        console.log('New image uploaded:', updateData.imageUrl);
      }

      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updateData);
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setError(null);
      const product = products.find(p => p.id === productId);
      
      if (product?.imageUrl) {
        await deleteImage(product.imageUrl);
      }
      
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
      throw error;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}