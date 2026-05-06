/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for fresh fruits..."
        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green focus:bg-white px-12 py-3.5 rounded-2xl text-sm font-medium transition-all outline-none placeholder:text-gray-400 shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
