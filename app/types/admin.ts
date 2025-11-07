export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isFeatured: boolean;
  colors: string[];
  inStock: boolean;
  description?: string;
  tags?: string[];
}

export interface ProductFormData {
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  category: string;
  featured: boolean;
  inStock: number;
  colors: string[];
  tags: string[];
}

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AddToCartProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showQuantity?: boolean;
  className?: string;
}

export interface FilterState {
  category: string;
  sortBy: string;
  viewMode: "grid" | "list";
  priceRange: [number, number];
  searchQuery: string;
}

export interface FavoriteState {
  favorites: number[];
  toggleFavorite: (productId: number) => void;
}
