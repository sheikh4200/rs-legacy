

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customer: {
    name: string;
    email: string;
    address: string;
  };
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// types/index.ts
export interface Product {
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
  images: string[]; // Array of image URLs
  features: string[];
  specifications: {
    [key: string]: string;
  };
  colors?: string[];
  sizes?: string[];
  category: string;
  featured?: boolean;
}



