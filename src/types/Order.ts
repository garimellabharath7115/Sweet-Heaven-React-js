export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface DeliveryDetails {
  fullName: string;
  address: string;
  pincode: string;
  phoneNumber: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  totalAmount: number;
  paymentMethod: string;
  utrNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}