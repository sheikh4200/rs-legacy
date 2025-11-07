// components/categories/FiltersClient.tsx
'use client';

import { useState } from 'react';
import { Category, CategoryFilters } from '../../types/category';
import CategoryFiltersComponent from './CategoryFilters';

interface FiltersClientProps {
  categories: Category[];
  className?: string;
}

export function FiltersClient({ categories, className }: FiltersClientProps) {
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);

  const handleFiltersChange = (filters: CategoryFilters) => {
    // Filter logic here
    let filtered = [...categories];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        category.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Featured filter
    if (filters.isFeatured !== null) {
      filtered = filtered.filter(category => category.isFeatured === filters.isFeatured);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(category =>
        filters.tags.some(tag => category.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'productCount':
          return b.productCount - a.productCount;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCategories(filtered);
  };

  return (
    <CategoryFiltersComponent
      categories={categories}
      onFiltersChange={handleFiltersChange}
      className={className}
    />
  );
}