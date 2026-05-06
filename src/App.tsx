/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { WishlistProvider } from '@/src/context/WishlistContext';
import Navbar from '@/src/components/Navbar';
import Hero from '@/src/components/Hero';
import FruitCard from '@/src/components/FruitCard';
import CategoryFilter from '@/src/components/CategoryFilter';
import CartDrawer from '@/src/components/CartDrawer';
import SearchInput from '@/src/components/SearchInput';
import { Fruit } from '@/src/types';
import { INITIAL_FRUITS, CATEGORIES } from '@/src/constants';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Sparkles, Leaf } from 'lucide-react';

function Dashboard() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'fruits'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fruitData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fruit));
      setFruits(fruitData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'fruits');
    });

    return () => unsubscribe();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const seedDatabase = async () => {
    try {
      for (const fruit of INITIAL_FRUITS) {
        await setDoc(doc(db, 'fruits', fruit.id), fruit);
      }
      alert('Database seeded with fresh fruits!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'fruits');
    }
  };

  const filteredFruits = fruits.filter(fruit => {
    const matchesCategory = selectedCategory === 'All' || fruit.category === selectedCategory;
    const matchesSearch = fruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fruit.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-green-100 selection:text-green-900 relative">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" className="text-brand-green" />
        </svg>
      </div>

      <Navbar onCartToggle={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main>
        <Hero />

        <section id="shop" className="max-w-7xl mx-auto px-6 md:px-12 py-20 bg-white rounded-[60px] shadow-sm -mt-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-brand-green font-black text-xs mb-4 uppercase tracking-[0.2em]">
                <Sparkles size={16} />
                <span>PREMIUM SELECTION</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-gray-900 tracking-tight leading-tight mb-8">
                Fresh From <br className="md:hidden" /> Our Orchards
              </h2>
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right hidden lg:block">Filter by category</p>
              <CategoryFilter
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-[400px] bg-gray-50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : fruits.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-3xl">
              <div className="max-w-md mx-auto">
                <Filter className="mx-auto text-gray-200 mb-6" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No fruits found in store</h3>
                <p className="text-gray-500 mb-8">Ready to grow your collection? Seed the initial inventory below.</p>
                <button
                  onClick={seedDatabase}
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Seed Fruit Collection
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredFruits.map((fruit) => (
                  <FruitCard key={fruit.id} fruit={fruit} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {fruits.length > 0 && (
            <div className="mt-20 p-12 bg-gray-900 rounded-[40px] text-center text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 -ml-32 -mb-32"></div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Want 20% off your first order?</h3>
              <p className="text-gray-400 mb-10 max-w-lg mx-auto">Join our fresh fruit community and get exclusive seasonal updates and recipes.</p>
              
              <AnimatePresence>
                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 font-bold"
                  >
                    Thanks for joining! Your coupon code is: FRESH20
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-white"
                    />
                    <button 
                      type="submit"
                      className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-400 transition-colors"
                    >
                      Join Now
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white pt-32 pb-12 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                  <Leaf size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                  All <span className="text-green-600">Fruit</span>
                </span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                Your destination for the world's freshest fruits. We partner with sustainable farms to bring nature's sweetness to your doorstep.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'Facebook'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-100 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Shop</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-green-600 transition-colors">Seasonal</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Organic</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Gift Boxes</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Bulk Order</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-green-600 transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-400 font-medium tracking-wide italic">
              "Small acts of kindness can change the world."
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500 font-bold tracking-wider">
              <a href="https://www.savethechildren.org" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">SAVE THE CHILDREN</a>
              <a href="https://www.redcross.org" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">RED CROSS</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              © 2026 ALL FRUIT INTL. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400 font-semibold tracking-wider">
              <span>SOUTH ASIA REGION</span>
              <span>USD ($)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Dashboard />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

