// types/product.ts
export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
  stock?: number;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  originalPrice?: number;
  rating?: number | ((rating: any) => unknown);
  images?: string[];
  brand?: string;
  sku?: string;
  specifications?: ProductSpecifications;
  reviewCount?: number;
  reviews?: number;
  features?: string[];
  discount?: number;
  tags?: string[];
  weight?: number;
  dimensions?: ProductDimensions;
  warranty?: string;
  colors?: string[];
  sizes?: string[];
}

export interface ProductSpecifications {
  [key: string]: string | number | boolean | undefined;
  material?: string;
  dimensions?: string;
  weight?: string;
  power?: string;
  connectivity?: string;
  battery?: string;
  screen?: string;
  processor?: string;
  storage?: string;
  camera?: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch' | 'mm';
}

export interface ProductReview {
  id: string;
  productId: string | number;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: Date;
  verified: boolean;
  helpful: number;
}

export interface ProductFilter {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  brand?: string[];
  tags?: string[];
}

export interface ProductSortOption {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
}

// Extended product for cart/order context
export interface CartProduct extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}