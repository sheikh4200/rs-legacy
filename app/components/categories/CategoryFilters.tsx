// components/categories/CategoryFilters.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star } from 'lucide-react';
import { Category } from '../../types/category';
import type { CategoryFilters } from '../../types/category';

interface CategoryFiltersProps {
  categories: Category[];
  onFiltersChange: (filters: CategoryFilters) => void;
  className?: string;
}

const allTags = ['Trending', 'New', 'Popular', 'Limited', 'Sustainable'];

export default function CategoryFilters({ 
  categories, 
  onFiltersChange, 
  className = '' 
}: CategoryFiltersProps) {
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    isFeatured: null,
    sortBy: 'name',
    tags: []
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const updateFilters = (newFilters: Partial<CategoryFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const toggleTag = (tag: string) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    updateFilters({ tags: updatedTags });
  };

  const clearFilters = () => {
    const cleared: CategoryFilters = {
      search: '',
      isFeatured: null,
      sortBy: 'name', // explicitly typed as CategoryFilters['sortBy']
      tags: []
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = filters.search || filters.isFeatured !== null || filters.tags.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 ${
            hasActiveFilters 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300'
          }`}
        >
          <Filter size={20} />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-blue-500 text-xs px-2 py-1 rounded-full">
              {filters.tags.length + (filters.isFeatured !== null ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                  Clear all
                </button>
              )}
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Featured Status
              </label>
              <div className="flex gap-3">
                {[
                  { value: null, label: 'All' },
                  { value: true, label: 'Featured' },
                  { value: false, label: 'Regular' }
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => updateFilters({ isFeatured: option.value })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                      filters.isFeatured === option.value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.value && <Star size={16} />}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Popular Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="name">Alphabetical</option>
                <option value="productCount">Product Count</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}