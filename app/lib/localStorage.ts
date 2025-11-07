import { Product } from '../types/admin';

const PRODUCTS_KEY = 'e-commerce-products';
const FAVORITES_KEY = 'e-commerce-favorites';

// Default products data
const defaultProducts: Product[] = [
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
    colors: ["black", "white", "gray", "navy"],
    inStock: true,
    description: "Comfortable cotton t-shirt for everyday wear. Made from 100% premium cotton for maximum comfort and durability."
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
    colors: ["blue", "black"],
    inStock: true,
    description: "High-quality denim jacket for a stylish look. Perfect for casual outings and layered outfits."
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
    colors: ["white", "black"],
    inStock: true,
    description: "Comfortable and stylish sneakers for urban lifestyle. Features advanced cushioning technology."
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
    colors: ["white", "blue", "pink"],
    inStock: true,
    description: "Elegant formal shirt for professional occasions. Crisp cotton fabric with perfect fit."
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
    colors: ["red", "yellow", "blue"],
    inStock: true,
    description: "Beautiful floral dress perfect for summer occasions. Lightweight and breathable fabric."
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
    colors: ["brown", "black", "beige"],
    inStock: true,
    description: "Luxurious designer handbag for the modern woman. Spacious interior with multiple compartments."
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
    colors: ["red", "blue", "black"],
    inStock: true,
    description: "High-performance running shoes for athletes. Enhanced grip and superior comfort."
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
    colors: ["brown", "black", "silver"],
    inStock: true,
    description: "Timeless leather watch for the sophisticated individual. Water-resistant and durable."
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
    colors: ["gray", "cream", "navy"],
    inStock: true,
    description: "Warm wool sweater for cold winter days. Soft and cozy with elegant design."
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
    colors: ["beige", "olive", "black"],
    inStock: true,
    description: "Comfortable linen pants for casual wear. Perfect for summer and warm weather."
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
    colors: ["black", "brown", "gold"],
    inStock: true,
    description: "Stylish designer sunglasses for sun protection. UV protection with polarized lenses."
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
    colors: ["black", "navy", "burgundy"],
    inStock: true,
    description: "Elegant evening gown for special occasions. Flowing silhouette with delicate details."
  }
];

// Products management
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts;
  
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading products from localStorage:', error);
    return defaultProducts;
  }
};

export const saveProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    // Trigger storage event to update other tabs
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct: Product = {
    ...product,
    id: newId,
  };
  
  const updatedProducts = [...products, newProduct];
  saveProducts(updatedProducts);
  return newProduct;
};

export const updateProduct = (id: number, productData: Partial<Product>): Product | null => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) return null;
  
  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    id: id,
  };
  
  products[productIndex] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
};

export const deleteProduct = (id: number): boolean => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) return false;
  
  products.splice(productIndex, 1);
  saveProducts(products);
  return true;
};

export const getProduct = (id: number): Product | null => {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
};

// Favorites management
export const getFavorites = (): number[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites: number[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const toggleFavorite = (productId: number): number[] => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.includes(productId)
    ? favorites.filter(id => id !== productId)
    : [...favorites, productId];
  
  saveFavorites(updatedFavorites);
  return updatedFavorites;
};

export const isFavorite = (productId: number): boolean => {
  const favorites = getFavorites();
  return favorites.includes(productId);
};