/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Heart, Loader2, Star, MessageSquare } from 'lucide-react';
import { Fruit, Review } from '@/src/types';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import ReviewModal from './ReviewModal';

interface FruitCardProps {
  fruit: Fruit;
}

const FruitCard: FC<FruitCardProps> = ({ fruit }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const reviewsRef = collection(db, 'fruits', fruit.id, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
    });

    return () => unsubscribe();
  }, [fruit.id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(fruit, quantity);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsAdding(false);
    setQuantity(1); // Reset quantity after adding
  };

  const isFavorite = isInWishlist(fruit.id);
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const basePrice = fruit.price * quantity;
  const { bulkDiscountThreshold, bulkDiscountRate } = useCart();
  const isBulk = quantity >= bulkDiscountThreshold;
  const finalPrice = isBulk ? basePrice * (1 - bulkDiscountRate) : basePrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-green-100 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={fruit.image}
          alt={fruit.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-wider border border-gray-100 w-fit">
            {fruit.category}
          </span>
          {isBulk && (
            <span className="px-3 py-1 bg-brand-green text-white shadow-sm rounded-full text-[10px] font-black uppercase tracking-wider w-fit animate-pulse">
              10% BULK OFF
            </span>
          )}
          {avgRating && (
            <div className="flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold text-gray-800 border border-gray-100 w-fit">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span>{avgRating} ({reviews.length})</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{fruit.name}</h3>
          <span className="text-lg font-serif font-black text-brand-green">${fruit.price}</span>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
            {fruit.description}
          </p>
          {fruit.origin && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Origin: {fruit.origin}</span>
            </div>
          )}
        </div>

        {fruit.nutrition && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 flex flex-col items-center">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Calories</span>
              <span className="text-[10px] font-bold text-gray-900">{fruit.nutrition.calories}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 flex flex-col items-center">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Fiber</span>
              <span className="text-[10px] font-bold text-gray-900">{fruit.nutrition.fiber}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 flex flex-col items-center">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Sugar</span>
              <span className="text-[10px] font-bold text-gray-900">{fruit.nutrition.sugar}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 flex flex-col items-center">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Vit C</span>
              <span className="text-[10px] font-bold text-gray-900">{fruit.nutrition.vitaminC || 'N/A'}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => setShowReviews(!showReviews)}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-green transition-colors flex items-center gap-2"
            >
              <MessageSquare size={12} />
              {showReviews ? 'Hide Reviews' : `${reviews.length} Reviews`}
            </button>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="text-[10px] font-black text-brand-green uppercase tracking-widest hover:underline"
            >
              Add Review
            </button>
          </div>
          
          <AnimatePresence>
            {showReviews && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 max-h-40 overflow-y-auto no-scrollbar py-2">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-gray-900">{review.userName}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-600 line-clamp-2 italic">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-500 hover:text-brand-green transition-colors active:scale-90"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs font-black text-gray-900 tracking-widest">{quantity} {fruit.unit}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-500 hover:text-brand-green transition-colors active:scale-90"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</span>
            <div className="flex items-center gap-2">
               {isBulk && <span className="text-[10px] text-gray-400 line-through font-bold">${basePrice.toFixed(2)}</span>}
               <span className="text-sm font-black text-gray-900">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => toggleWishlist(fruit)}
              className={`p-3 rounded-2xl border transition-all active:scale-95 flex-shrink-0 ${
                isFavorite 
                  ? 'bg-red-50 text-red-500 border-red-100' 
                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-red-500'
              }`}
              title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 sm:flex-none flex items-center gap-3 bg-gray-900 text-white min-w-[140px] justify-center px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl shadow-gray-200 hover:shadow-brand-green/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <ReviewModal
        fruitId={fruit.id}
        fruitName={fruit.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={() => setShowReviews(true)}
      />
    </motion.div>
  );
};

export default FruitCard;
