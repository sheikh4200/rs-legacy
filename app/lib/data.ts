// lib/data.ts
import { Product } from '../types/product/item';
import { Order } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage (replace with database in production)
let products: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    inStock: true,
    features: [],
    // createdAt: new Date(),
    // updatedAt: new Date(),
    originalPrice: undefined,
    rating: 23,
    images: [],
    brand: '',
    sku: '',
    specifications: undefined,
    reviewCount: 0,
    reviews: 0
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with health monitoring, GPS, and smartphone integration. Track your fitness goals and stay connected.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 30,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: '3',
    name: 'Premium Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology. Perfect for marathon training and daily workouts.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Sports',
    stock: 75,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'Clothing',
    stock: 100,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: '5',
    name: 'Professional Camera',
    description: '4K professional camera with multiple lenses. Ideal for photography enthusiasts and professionals.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
    category: 'Electronics',
    stock: 15,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: '6',
    name: 'Modern Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature. Perfect for home office setup.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    category: 'Home & Garden',
    stock: 60,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: '7',
    name: 'Bestseller Novel',
    description: 'Award-winning fiction novel that has captivated millions of readers worldwide.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
    category: 'Books',
    stock: 200,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: '8',
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and floor exercises.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
    category: 'Sports',
    stock: 80,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalPrice: undefined,
    inStock: undefined,
    rating: function (rating: any): unknown {
      throw new Error('Function not implemented.');
    }
  }
];

let orders: Order[] = [];

export const productService = {
  getAll: () => products,
  getById: (id: string) => products.find(p => p.id === id),
  getByCategory: (category: string) => products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  ),
  getFeatured: () => products.filter(p => p.featured),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    products.push(product);
    return product;
  },
  update: (id: string, data: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date(),
    };
    return products[index];
  },
  delete: (id: string) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    return true;
  },
};

export const orderService = {
  create: (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: uuidv4(),
      createdAt: new Date(),
    };
    orders.push(newOrder);
    return newOrder;
  },
  getAll: () => orders,
};