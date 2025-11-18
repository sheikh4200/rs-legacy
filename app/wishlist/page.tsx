// app/wishlist/page.tsx
"use client";

import { useWishlist } from '../lib/wishlist-context';
import { useCart } from '../lib/cart-context';
import { Trash2, ShoppingCart, ArrowLeft, Heart, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      originalPrice: item.originalPrice,
      category: item.category,
      currency:"PKR"
    });
  };

  const handleMoveAllToCart = () => {
    wishlistState.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        originalPrice: item.originalPrice,
        category: item.category,
      currency:"PKR"

      });
    });
    clearWishlist();
  };

  if (wishlistState.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <Heart className="w-32 h-32 text-gray-300 mx-auto relative z-10" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-red-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Start adding items you love to your wishlist. They'll be saved here for you to revisit later.
              </p>
              <Link
                href="/Product"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 inline-flex items-center gap-3"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Discover Amazing Products
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur-lg opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-2xl">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Wishlist
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {wishlistState.itemCount} {wishlistState.itemCount === 1 ? 'treasured item' : 'treasured items'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMoveAllToCart}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Move All to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearWishlist}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </motion.button>
            </div>
          </motion.div>

          {/* Wishlist Items Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {wishlistState.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white p-2 rounded-2xl transition-all duration-300 shadow-2xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>

                  {/* Category Badge */}
                  {item.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-2xl text-xs font-semibold backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight group-hover:text-gray-700 transition-colors duration-300">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue Shopping */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              href="/Product"
              className="group inline-flex items-center gap-3 text-gray-700 hover:text-gray-900 font-semibold text-lg bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 hover:border-purple-200/50"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Continue Exploring Products
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}