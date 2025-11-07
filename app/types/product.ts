
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  colors?: string[];
  sizes?: string[];
  image?:string,
  reviews:number
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
  color?: string;
  size?: string;
 
}

