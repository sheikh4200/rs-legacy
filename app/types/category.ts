// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  coverImage?: string;
  icon?: string;
  color?: string;
  gradient?: string;
  parentId?: string | null;
  subcategories?: Category[];
  productCount: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  search: string;
  isFeatured: boolean | null;
  sortBy: 'name' | 'productCount' | 'newest';
  tags: string[];
}
