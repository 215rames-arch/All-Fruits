/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Star, Leaf } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden bg-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1920&q=80"
          alt="Fresh fruit orchard background"
          className="w-full h-full object-cover opacity-[0.08]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white"></div>
      </div>

      {/* Subtle Mesh Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-[100px] -z-10 opacity-40"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Star size={14} fill="#16a34a" className="text-brand-green" />
            <span className="text-gray-900">TOP RATED IN ASIA SOUTH</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter text-gray-900 leading-[1.05] mb-8">
            Nature's <br />
            <span className="text-brand-green italic font-medium">Finest</span> <br />
            To Your Door.
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
            Hand-picked, seasonal organic fruits delivered with care from sustainable local orchards.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <button className="bg-gray-900 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-2xl shadow-gray-200 flex items-center gap-3 group active:scale-95">
              Start Shopping
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <button className="bg-white border-2 border-gray-100 text-gray-900 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:border-brand-green hover:text-brand-green transition-all active:scale-95">
              View Seasonal
            </button>
          </div>

          <div className="mt-16 flex items-center gap-12">
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">12k+</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Happy Clients</p>
            </div>
            <div className="w-px h-12 bg-gray-100"></div>
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">45+</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Varieties</p>
            </div>
            <div className="w-px h-12 bg-gray-100"></div>
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">100%</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Organic</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-brand-green/10 rounded-[60px] blur-3xl -z-10 group-hover:bg-brand-green/20 transition-colors duration-700"></div>
          <div className="relative overflow-hidden rounded-[60px] shadow-2xl shadow-green-100/50">
            <img
              src="https://images.unsplash.com/photo-1619566636858-adb3ef26403b?auto=format&fit=crop&w=1200&q=80"
              alt="Hand-picked premium fruits"
              className="w-full object-cover aspect-[4/5] lg:aspect-[3/4] group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 hidden md:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-brand-green">
                <Leaf size={28} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Guaranteed</p>
                <p className="text-lg font-serif font-black text-gray-900 leading-none">Always Fresh</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
