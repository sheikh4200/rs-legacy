// components/Products/ProductInfo.tsx
'use client';

import { useState } from 'react';
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  features: string[];
  specifications?: {
    [key: string]: string;
  };
  colors?: string[];
  sizes?: string[];
  
}

interface ProductInfoProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  selectedColor, 
  selectedSize, 
  onColorChange, 
  onSizeChange 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [internalSelectedColor, setInternalSelectedColor] = useState(product.colors?.[0] || '');
  const [internalSelectedSize, setInternalSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Use external controls if provided, otherwise use internal state
  const currentColor = selectedColor !== undefined ? selectedColor : internalSelectedColor;
  const currentSize = selectedSize !== undefined ? selectedSize : internalSelectedSize;

  const handleColorChange = (color: string) => {
    if (onColorChange) {
      onColorChange(color);
    } else {
      setInternalSelectedColor(color);
    }
  };

  const handleSizeChange = (size: string) => {
    if (onSizeChange) {
      onSizeChange(size);
    } else {
      setInternalSelectedSize(size);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (value > product.stockCount) return;
    setQuantity(value);
  };

  const addToCart = () => {
    console.log('Added to cart:', {
      product: product.id,
      color: currentColor,
      size: currentSize,
      quantity,
    });
  };

  const buyNow = () => {
    console.log('Buy now:', {
      product: product.id,
      color: currentColor,
      size: currentSize,
      quantity,
    });
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${
              sizeClasses[size]
            } ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({product.reviewCount})</span>
      </div>
    );
  };

  // Safe handling for specifications
  const specifications = product.specifications || {};
  const hasSpecifications = Object.keys(specifications).length > 0;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
        
        {/* Rating */}
        <div className="mt-2 flex items-center">
          <StarRating rating={product.rating} />
          <span className="mx-2 text-gray-300">•</span>
          <span className={`text-sm font-medium ${
            product.inStock ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-xl text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
              Save {product.discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Features</h3>
        <ul className="space-y-1">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Color</h3>
          <div className="flex space-x-2">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  currentColor === color ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  currentSize === size
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Actions */}
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Quantity</span>
          <div className="flex items-center border border-gray-300 rounded-lg dark:border-gray-600">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 text-gray-900 font-medium dark:text-white">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
              disabled={quantity >= product.stockCount}
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.stockCount} available
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={addToCart}
            disabled={!product.inStock}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Add to Cart
          </button>
          <button
            onClick={buyNow}
            disabled={!product.inStock}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Buy Now
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isWishlisted
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>Wishlist</span>
          </button>
          <button
            onClick={shareProduct}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg hover:text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Shipping & Support */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Truck className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RotateCcw className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Easy Returns</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">2-Year Warranty</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manufacturer warranty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;