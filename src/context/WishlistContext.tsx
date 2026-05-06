/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Fruit } from '@/src/types';

interface WishlistContextType {
  wishlist: Fruit[];
  toggleWishlist: (fruit: Fruit) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Fruit[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('all_fruit_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wishlist');
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('all_fruit_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (fruit: Fruit) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === fruit.id);
      if (exists) {
        return prev.filter(item => item.id !== fruit.id);
      }
      return [...prev, fruit];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
