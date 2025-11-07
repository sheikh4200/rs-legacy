// components/categories/CategoriesGrid.tsx
'use client';

import { motion } from 'framer-motion';
import { Category } from '../../types/category';
import CategoryCard from './CategoryCard';

interface CategoriesGridProps {
  categories: Category[];
  title?: string;
  description?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CategoriesGrid({ 
  categories, 
  title, 
  description 
}: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="text-gray-400 text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No categories found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filters
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {(title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          {title && (
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      )}

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
}