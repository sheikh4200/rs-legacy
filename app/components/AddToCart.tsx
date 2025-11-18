// components/protected-add-to-cart.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';
import LoginModal from './login-modal';

// Currency conversion utility
const USD_TO_PKR = 280; // Current exchange rate

const convertToPKR = (usdPrice: number): number => {
  return Math.round(usdPrice * USD_TO_PKR);
};

interface ProtectedAddToCartProps {
  product: {
    id: string;
    name: string;
    price: number; // This can be either USD or PKR, we'll handle conversion
    image: string;
    size?: string;
    color?: string;
    originalPrice?: number;
    category?: string;
    currency?: 'PKR'; // Add currency indicator
  };
  className?: string;
  variant?: 'default' | 'icon' | 'small';
}

export default function ProtectedAddToCart({ 
  product, 
  className = '',
  variant = 'default'
}: ProtectedAddToCartProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<typeof product | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Convert price to PKR if needed
  const getPriceInPKR = (price: number, currency?: string): number => {
    if (currency === 'PKR') {
      return price; // Already in PKR
    }
    return convertToPKR(price); // Convert from USD to PKR
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setPendingProduct(product);
      setShowLoginModal(true);
      return;
    }

    // Convert price to PKR before adding to cart
    const priceInPKR = getPriceInPKR(product.price, product.currency);
    const originalPriceInPKR = product.originalPrice 
      ? getPriceInPKR(product.originalPrice, product.currency)
      : undefined;

    // Add to cart with PKR prices
    addToCart({
      id: product.id,
      name: product.name,
      price: priceInPKR,
      image: product.image,
      size: product.size,
      color: product.color,
      originalPrice: originalPriceInPKR,
      category: product.category,
      currency: 'PKR' // Always store as PKR in cart
    });
  };

  const handleLoginSuccess = () => {
    // After successful login, add the pending product to cart with PKR conversion
    if (pendingProduct) {
      const priceInPKR = getPriceInPKR(pendingProduct.price, pendingProduct.currency);
      const originalPriceInPKR = pendingProduct.originalPrice 
        ? getPriceInPKR(pendingProduct.originalPrice, pendingProduct.currency)
        : undefined;

      addToCart({
        id: pendingProduct.id,
        name: pendingProduct.name,
        price: priceInPKR,
        image: pendingProduct.image,
        size: pendingProduct.size,
        color: pendingProduct.color,
        originalPrice: originalPriceInPKR,
        category: pendingProduct.category,
        currency: 'PKR'
      });
      setPendingProduct(null);
    }
  };

  // Different button variants
  const getButtonContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full font-semibold transition-colors duration-300 ${className}`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        );
      
      case 'small':
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 text-sm ${className}`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
        );
      
      default:
        return (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 ${className}`}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </motion.button>
        );
    }
  };

  return (
    <>
      {getButtonContent()}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingProduct(null);
        }}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}