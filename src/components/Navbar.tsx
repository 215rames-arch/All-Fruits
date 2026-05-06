/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, User as UserIcon, Heart, Leaf } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { signInWithGoogle, logout } from '@/src/lib/firebase';
import { motion } from 'motion/react';

interface NavbarProps {
  onCartToggle: () => void;
}

export default function Navbar({ onCartToggle }: NavbarProps) {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
          <Leaf size={24} />
        </div>
        <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">
          All <span className="text-brand-green">Fruit</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <a href="#shop" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-green transition-colors">Shop</a>
        <a href="#" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-green transition-colors">Seasonal</a>
        <a href="#" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-green transition-colors">Sustainability</a>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button
          className="relative p-2 text-gray-400 hover:text-red-500 transition-colors group"
        >
          <Heart size={22} className="group-hover:scale-110 transition-transform" />
          {wishlist.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-4 h-4 bg-red-50 text-white text-[8px] flex items-center justify-center rounded-full font-bold"
            >
              {wishlist.length}
            </motion.span>
          )}
        </button>

        <button
          onClick={onCartToggle}
          className="relative p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors group"
        >
          <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-5 h-5 bg-brand-green text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm"
            >
              {totalItems}
            </motion.span>
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL || ''}
              alt={user.displayName || ''}
              className="w-10 h-10 rounded-full border-2 border-brand-green-light"
            />
            <button
              onClick={logout}
              className="hidden lg:block text-sm font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 bg-white border-2 border-gray-900 text-gray-900 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <UserIcon size={16} />
            <span className="mt-0.5">Member Access</span>
          </button>
        )}
      </div>
    </nav>
  );
}
