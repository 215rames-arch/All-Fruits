/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ChevronLeft,
  Truck,
  Apple,
  Chrome
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { PaymentMethod, Order } from '@/src/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'shipping' | 'payment' | 'confirm' | 'success';

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { user } = useAuth();
  const { cart, totalPrice, totalSavings, clearCart } = useCart();
  const [step, setStep] = useState<Step>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const [address, setAddress] = useState({
    fullName: user?.displayName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const handleNext = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'payment') setStep('shipping');
    else if (step === 'confirm') setStep('payment');
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        email: user.email || '',
        items: cart.map(item => ({
          fruitId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit
        })),
        subtotal: totalPrice + totalSavings,
        savings: totalSavings,
        totalAmount: totalPrice,
        status: 'pending',
        paymentMethod,
        shippingAddress: address,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setStep('success');
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={step === 'success' ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit bg-white rounded-[48px] shadow-2xl z-[201] overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center relative">
              {step !== 'shipping' && step !== 'success' && (
                <button
                  onClick={handleBack}
                  className="absolute left-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="flex-1 text-center">
                <h2 className="text-2xl font-serif font-black text-gray-900">
                  {step === 'shipping' && 'Shipping Details'}
                  {step === 'payment' && 'Payment Method'}
                  {step === 'confirm' && 'Order Summary'}
                  {step === 'success' && 'Order Confirmed!'}
                </h2>
                <div className="flex justify-center gap-2 mt-4">
                  {(['shipping', 'payment', 'confirm'] as const).map((s, i) => (
                    <div 
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        step === 'success' ? 'w-4 bg-brand-green' :
                        step === s ? 'w-8 bg-brand-green' : 
                        step === 'payment' && i === 0 ? 'w-4 bg-brand-green' :
                        step === 'confirm' && i < 2 ? 'w-4 bg-brand-green' :
                        'w-4 bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {step !== 'success' && (
                <button
                  onClick={onClose}
                  className="absolute right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="p-10">
              <AnimatePresence mode="wait">
                {step === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                        <input
                          type="text"
                          value={address.fullName}
                          onChange={e => setAddress({...address, fullName: e.target.value})}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green focus:bg-white px-6 py-4 rounded-2xl transition-all outline-none font-medium"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Street Address</label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={e => setAddress({...address, street: e.target.value})}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green focus:bg-white px-6 py-4 rounded-2xl transition-all outline-none font-medium"
                          placeholder="123 Fresh Lane"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={e => setAddress({...address, city: e.target.value})}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green focus:bg-white px-6 py-4 rounded-2xl transition-all outline-none font-medium"
                          placeholder="Berryville"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">State / Prov</label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={e => setAddress({...address, state: e.target.value})}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green focus:bg-white px-6 py-4 rounded-2xl transition-all outline-none font-medium"
                          placeholder="CA"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={!address.fullName || !address.street || !address.city}
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl active:scale-[0.98] mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      Payment Method <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {[
                      { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
                      { id: 'apple-pay', name: 'Apple Pay', icon: <Apple size={20} /> },
                      { id: 'google-pay', name: 'Google Pay', icon: <Chrome size={20} /> },
                      { id: 'paypal', name: 'PayPal', icon: <div className="font-bold italic text-blue-800">PP</div> }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                        className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
                          paymentMethod === method.id 
                            ? 'border-brand-green bg-brand-green/5' 
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${paymentMethod === method.id ? 'bg-white text-brand-green' : 'bg-white text-gray-400'}`}>
                            {method.icon}
                          </div>
                          <span className="font-bold text-gray-900">{method.name}</span>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center text-white">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </button>
                    ))}

                    {paymentMethod === 'card' && (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="p-6 bg-gray-900 rounded-[32px] text-white mt-6 space-y-4"
                       >
                         <div className="flex justify-between items-start">
                           <div className="w-12 h-8 bg-yellow-400 rounded-md"></div>
                           <span className="text-xs font-bold text-white/40 tracking-widest uppercase">VISA</span>
                         </div>
                         <div className="py-2">
                           <div className="text-xl font-mono tracking-widest">•••• •••• •••• 4242</div>
                         </div>
                         <div className="flex justify-between items-end">
                           <div>
                             <p className="text-[8px] font-black text-white/30 truncate uppercase tracking-tighter">Card Holder</p>
                             <p className="text-xs font-bold uppercase">{address.fullName || 'YOUR NAME'}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[8px] font-black text-white/30 truncate uppercase tracking-tighter">Expires</p>
                             <p className="text-xs font-bold">12/28</p>
                           </div>
                         </div>
                       </motion.div>
                    )}

                    <button
                      onClick={handleNext}
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl active:scale-[0.98] mt-6 flex items-center justify-center gap-3"
                    >
                      Review Order <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-gray-50 rounded-[32px] p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-full text-brand-green shadow-sm">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping To</p>
                            <p className="text-sm font-bold text-gray-900">{address.street}, {address.city}</p>
                          </div>
                        </div>
                        <button onClick={() => setStep('shipping')} className="text-[10px] font-black text-brand-green uppercase">Edit</button>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-full text-brand-green shadow-sm">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                            <p className="text-sm font-bold text-gray-900 uppercase">{paymentMethod.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <button onClick={() => setStep('payment')} className="text-[10px] font-black text-brand-green uppercase">Edit</button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium tracking-tight">Subtotal ({cart.length} items)</span>
                        <span className="font-bold text-gray-900">${(totalPrice + totalSavings).toFixed(2)}</span>
                      </div>
                      {totalSavings > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-brand-green font-medium tracking-tight">Total Savings</span>
                          <span className="font-black text-brand-green">-${totalSavings.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm pb-4 border-b border-gray-100">
                        <span className="text-gray-500 font-medium tracking-tight">Standard Delivery</span>
                        <span className="text-green-600 font-black uppercase text-[10px] tracking-widest">Free</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-black text-gray-900 tracking-tight">Order Total</span>
                        <div className="text-right">
                          <span className="text-2xl font-serif font-black text-brand-green">${totalPrice.toFixed(2)}</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">USD (incl. taxes)</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-brand-green transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          Place Order Now
                          <Truck size={24} />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-8 py-10"
                  >
                    <div className="w-32 h-32 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle2 size={72} />
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border-4 border-brand-green/20"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-4xl font-serif font-black text-gray-900">Sweet Success!</h3>
                      <p className="text-gray-500 font-medium max-w-xs mx-auto">
                        Your order has been placed and is currently being picked from the orchard.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[32px] w-full border border-gray-100 flex items-center justify-between">
                       <div className="text-left">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                         <p className="font-mono font-bold text-gray-900">OR-{Math.floor(100000 + Math.random() * 900000)}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                         <div className="flex items-center gap-2 text-brand-green">
                           <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                           <span className="text-xs font-black uppercase">Pending</span>
                         </div>
                       </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl active:scale-95"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
