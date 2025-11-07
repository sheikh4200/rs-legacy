export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  features: string[];
  inStock: boolean;
//   quantity:number;
  stockQuantity: number;
  sku?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  _id: string;
  name: string;
  description: string;
  slug: string;
  bannerImage: string;
  coverImage: string;
  products: Product[];
  featuredProducts: Product[];
  category: string;
  tags: string[];
  isActive: boolean;
  displayOrder: number;
  metadata?: {
    season?: string;
    year?: number;
    theme?: string;
  };
  createdAt: Date;
  updatedAt: Date;

}

export interface CollectionsResponse {
  success: boolean;
  data: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CollectionResponse {
  success: boolean;
  data: Collection;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  rating: number;
  sortBy: string;
}