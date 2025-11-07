
// app/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  discount:number;
  stockCount:number;
  features: string[];
  specifications: Record<string, string>;


}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}