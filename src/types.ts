export interface Fruit {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  season?: string;
  origin?: string;
  nutrition?: {
    calories: number;
    fiber: string;
    sugar: string;
    vitaminC?: string;
  };
  stock: number;
}

export interface CartItem extends Fruit {
  quantity: number;
}

export type PaymentMethod = 'card' | 'paypal' | 'apple-pay' | 'google-pay';

export interface Order {
  id?: string;
  userId: string;
  email: string;
  items: {
    fruitId: string;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  subtotal: number;
  savings: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: PaymentMethod;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: any; // Firestore Timestamp
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  rating: number;
  comment: string;
  createdAt: any;
}
