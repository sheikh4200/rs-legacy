// components/protected-add-to-cart.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';
import LoginModal from './login-modal';

interface ProtectedAddToCartProps {
  product: {
    id: string; // Changed to string to match your cart context
    name: string;
    price: number;
    image: string;
    size?: string;
    color?: string;
    originalPrice?: number;
    category?: string;
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setPendingProduct(product);
      setShowLoginModal(true);
      return;
    }

    // Add to cart directly
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      color: product.color,
      originalPrice: product.originalPrice,
      category: product.category
    });
  };

  const handleLoginSuccess = () => {
    // After successful login, add the pending product to cart
    if (pendingProduct) {
      addToCart({
        id: pendingProduct.id,
        name: pendingProduct.name,
        price: pendingProduct.price,
        image: pendingProduct.image,
        size: pendingProduct.size,
        color: pendingProduct.color,
        originalPrice: pendingProduct.originalPrice,
        category: pendingProduct.category
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