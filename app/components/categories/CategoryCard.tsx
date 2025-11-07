// components/categories/CategoryCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '../../types/category';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <Link
        href={`/categories/${category.slug}`}
        className="block relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm"
      >
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: category.gradient || `linear-gradient(135deg, ${category.color}20, transparent)`
          }}
        />
        
        {/* Header with Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Featured Badge */}
          {category.isFeatured && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <Sparkles size={12} />
                Featured
              </div>
            </div>
          )}
          
          {/* Hover Arrow */}
          <div className="absolute top-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
              <ArrowUpRight size={16} className="text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-1">
              {category.name}
            </h3>
          </div>
          
          {category.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {category.description}
            </p>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              {category.productCount} products
            </span>
            
            {category.subcategories && category.subcategories.length > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{category.subcategories.length} subcategories
              </span>
            )}
          </div>
          
          {/* Tags */}
          {category.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {category.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {category.tags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{category.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}