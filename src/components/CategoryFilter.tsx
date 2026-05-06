/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 active:scale-90 ${
            selected === category
              ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 scale-105'
              : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-brand-green hover:text-brand-green'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
