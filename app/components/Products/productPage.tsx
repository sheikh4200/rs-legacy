// app/products/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag, Filter, Grid, List } from "lucide-react";
import Image from "next/image";
import AddToCart from "../../components/AddToCart";


const categories = [
  { id: "all", name: "All Products" },
  { id: "men", name: "Men's Fashion" },
  { id: "women", name: "Women's Fashion" },
  { id: "accessories", name: "Accessories" },
  { id: "footwear", name: "Footwear" },
  { id: "new", name: "New Arrivals" },
];

const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 25.99,
    originalPrice: 35.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    category: "men",
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isFeatured: false,
    colors: ["black", "white", "gray", "navy"]
  },
  {
    id: 2,
    name: "Premium Denim Jacket",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    category: "men",
    rating: 4.8,
    reviews: 89,
    isNew: false,
    isFeatured: true,
    colors: ["blue", "black"]
  },
  {
    id: 3,
    name: "Urban Style Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
    category: "footwear",
    rating: 4.7,
    reviews: 256,
    isNew: true,
    isFeatured: true,
    colors: ["white", "black"]
  },
  {
    id: 4,
    name: "Elegance Formal Shirt",
    price: 45.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
    category: "men",
    rating: 4.3,
    reviews: 67,
    isNew: false,
    isFeatured: false,
    colors: ["white", "blue", "pink"]
  },
  {
    id: 5,
    name: "Summer Floral Dress",
    price: 65.99,
    originalPrice: 85.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
    category: "women",
    rating: 4.9,
    reviews: 342,
    isNew: true,
    isFeatured: true,
    colors: ["red", "yellow", "blue"]
  },
  {
    id: 6,
    name: "Designer Handbag",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
    category: "accessories",
    rating: 4.6,
    reviews: 178,
    isNew: false,
    isFeatured: true,
    colors: ["brown", "black", "beige"]
  },
  {
    id: 7,
    name: "Sports Running Shoes",
    price: 75.99,
    originalPrice: 95.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "footwear",
    rating: 4.4,
    reviews: 203,
    isNew: true,
    isFeatured: false,
    colors: ["red", "blue", "black"]
  },
  {
    id: 8,
    name: "Classic Leather Watch",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop",
    category: "accessories",
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isFeatured: true,
    colors: ["brown", "black", "silver"]
  },
  {
    id: 9,
    name: "Winter Wool Sweater",
    price: 55.99,
    originalPrice: 75.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop",
    category: "women",
    rating: 4.5,
    reviews: 98,
    isNew: true,
    isFeatured: false,
    colors: ["gray", "cream", "navy"]
  },
  {
    id: 10,
    name: "Casual Linen Pants",
    price: 49.99,
    originalPrice: 69.99,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
    category: "men",
    rating: 4.2,
    reviews: 76,
    isNew: false,
    isFeatured: false,
    colors: ["beige", "olive", "black"]
  },
  {
    id: 11,
    name: "Designer Sunglasses",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "accessories",
    rating: 4.7,
    reviews: 234,
    isNew: true,
    isFeatured: true,
    colors: ["black", "brown", "gold"]
  },
  {
    id: 12,
    name: "Evening Gown",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
    category: "women",
    rating: 4.9,
    reviews: 167,
    isNew: true,
    isFeatured: true,
    colors: ["black", "navy", "burgundy"]
  }
];

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProducts = products
    .filter(product => selectedCategory === "all" || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "new":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Our Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our carefully curated selection of premium fashion items. 
            From casual wear to elegant accessories, find your perfect style.
          </p>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="featured">Featured</option>
              <option value="new">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "grid grid-cols-1 gap-6"
          }`}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className={`${
                    viewMode === "list" ? "h-48 object-cover" : "h-64 w-full object-cover"
                  } group-hover:scale-105 transition-transform duration-300`}
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      New
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Sale
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Add to Cart Component */}
                <AddToCart 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  }}
                  size="md"
                  showQuantity={true}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your category filter
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (

      <ProductsContent />
    
  );
}