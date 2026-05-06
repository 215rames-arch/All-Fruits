import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Fruit, CartItem } from '@/src/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (fruit: Fruit, quantity?: number) => void;
  removeFromCart: (fruitId: string) => void;
  updateQuantity: (fruitId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  bulkDiscountThreshold: number;
  bulkDiscountRate: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (fruit: Fruit, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === fruit.id);
      if (existing) {
        return prev.map(item =>
          item.id === fruit.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...fruit, quantity }];
    });
  };

  const removeFromCart = (fruitId: string) => {
    setCart(prev => prev.filter(item => item.id !== fruitId));
  };

  const updateQuantity = (fruitId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(fruitId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === fruitId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const bulkDiscountThreshold = 5;
  const bulkDiscountRate = 0.1; // 10%

  const calculateItemTotal = (item: CartItem) => {
    const basePrice = item.price * item.quantity;
    if (item.quantity >= bulkDiscountThreshold) {
      return basePrice * (1 - bulkDiscountRate);
    }
    return basePrice;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const totalSavings = cart.reduce((sum, item) => {
    if (item.quantity >= bulkDiscountThreshold) {
      return sum + (item.price * item.quantity * bulkDiscountRate);
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        totalPrice,
        totalSavings,
        bulkDiscountThreshold,
        bulkDiscountRate
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
