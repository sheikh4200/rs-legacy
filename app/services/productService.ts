// app/services/productService.ts

// Constants for better maintainability
const IMAGE_PATHS = {
  // Clothing images
  T_SHIRT: '/images/img1.jpg',
  DENIM_JACKET: '/images/img6.jpg',
  WOOL_SCARF: '/images/img3.jpg',
  BEANIE_HAT: '/images/img4.jpg',
  RUNNING_SHORTS: '/images/img5.jpg',
  
  // Electronics images
  HEADPHONES: '/images/img6.jpg',
  FITNESS_WATCH: '/images/img7.jpg',
  CAMERA: '/images/img8.jpg',
  GAMING_LAPTOP: '/images/img9.png',
  PHONE_CHARGER: '/images/img10.jpg',
  BLUETOOTH_SPEAKER: '/images/img11.jpg',
  SMARTPHONE: '/images/img12.jpg',
  
  // Accessories images
  HANDBAG: '/images/img13.jpg',
  SUNGLASSES: '/images/img14.jpg',
  WALLET: '/images/img15.jpg',
  WOODEN_WATCH: '/images/img16.jpg',
  BACKPACK: '/images/img17.jpg',
  PHONE_CASE: '/images/img18.jpg',
  
  // Footwear images
  SNEAKERS: '/images/img19.jpg',
  RUNNING_SHOES: '/images/img20.jpg',
  BASKETBALL_SHOES: '/images/img21.jpg',
  
  // Home images
  COFFEE_MUG: '/images/img22.jpg',
  BED_SHEETS: '/images/img23.jpg',
  PLANT_POTS: '/images/img24.jpg',
  KNIFE_SET: '/images/img25.jpg'
} as const;

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  clothing: 'Clothing',
  electronics: 'Electronics',
  accessories: 'Accessories',
  footwear: 'Footwear',
  home: 'Home'
} as const;

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

  
}

// Organized mock data with local images
let products: Product[] = [
  // Clothing products
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 25.99,
    originalPrice: 35.99,
    image: IMAGE_PATHS.T_SHIRT,
    category: "clothing",
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isFeatured: true,
    colors: ["black", "white", "gray"],
  },
  {
    id: 2,
    name: "Premium Denim Jacket",
    price: 79.99,
    originalPrice: 99.99,
    image: IMAGE_PATHS.DENIM_JACKET,
    category: "clothing",
    rating: 4.8,
    reviews: 89,
    isNew: false,
    isFeatured: true,
    colors: ["blue", "black"],
  },
  {
    id: 19,
    name: "Winter Wool Scarf",
    price: 34.99,
    originalPrice: 44.99,
    image: IMAGE_PATHS.WOOL_SCARF,
    category: "clothing",
    rating: 4.5,
    reviews: 167,
    isNew: false,
    isFeatured: false,
    colors: ["gray", "navy", "burgundy"],
  },
  {
    id: 35,
    name: "Wool Beanie Hat",
    price: 24.99,
    originalPrice: 34.99,
    image: IMAGE_PATHS.BEANIE_HAT,
    category: "clothing",
    rating: 4.6,
    reviews: 189,
    isNew: false,
    isFeatured: false,
    colors: ["black", "gray", "navy"],
  },
  {
    id: 37,
    name: "Running Shorts",
    price: 34.99,
    originalPrice: 44.99,
    image: IMAGE_PATHS.RUNNING_SHORTS,
    category: "clothing",
    rating: 4.4,
    reviews: 267,
    isNew: false,
    isFeatured: false,
    colors: ["black", "blue", "gray"],
  },

  // Electronics products
  {
    id: 5,
    name: "Wireless Bluetooth Headphones",
    price: 149.99,
    originalPrice: 199.99,
    image: IMAGE_PATHS.HEADPHONES,
    category: "electronics",
    rating: 4.4,
    reviews: 342,
    isNew: true,
    isFeatured: false,
    colors: ["black", "white", "blue"],
  },
  {
    id: 6,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: IMAGE_PATHS.FITNESS_WATCH,
    category: "electronics",
    rating: 4.3,
    reviews: 421,
    isNew: false,
    isFeatured: false,
    colors: ["black", "silver", "rose-gold"],
  },
  {
    id: 9,
    name: "Professional Camera",
    price: 899.99,
    originalPrice: 1099.99,
    image: IMAGE_PATHS.CAMERA,
    category: "electronics",
    rating: 4.8,
    reviews: 89,
    isNew: true,
    isFeatured: true,
    colors: ["black"],
  },
  {
    id: 12,
    name: "Gaming Laptop",
    price: 1299.99,
    originalPrice: 1499.99,
    image: IMAGE_PATHS.GAMING_LAPTOP,
    category: "electronics",
    rating: 4.2,
    reviews: 156,
    isNew: true,
    isFeatured: true,
    colors: ["black", "gray"],
  },
  {
    id: 15,
    name: "Wireless Phone Charger",
    price: 29.99,
    originalPrice: 39.99,
    image: IMAGE_PATHS.PHONE_CHARGER,
    category: "electronics",
    rating: 4.3,
    reviews: 278,
    isNew: false,
    isFeatured: false,
    colors: ["white", "black"],
  },
  {
    id: 18,
    name: "Bluetooth Speaker",
    price: 89.99,
    originalPrice: 119.99,
    image: IMAGE_PATHS.BLUETOOTH_SPEAKER,
    category: "electronics",
    rating: 4.4,
    reviews: 312,
    isNew: true,
    isFeatured: false,
    colors: ["black", "blue", "red"],
  },
  {
    id: 20,
    name: "Smartphone Pro",
    price: 799.99,
    originalPrice: 899.99,
    image: IMAGE_PATHS.SMARTPHONE,
    category: "electronics",
    rating: 4.7,
    reviews: 523,
    isNew: true,
    isFeatured: true,
    colors: ["black", "white", "purple"],
  },

  // Accessories products
  {
    id: 4,
    name: "Designer Leather Handbag",
    price: 129.99,
    originalPrice: 159.99,
    image: IMAGE_PATHS.HANDBAG,
    category: "accessories",
    rating: 4.6,
    reviews: 178,
    isNew: false,
    isFeatured: true,
    colors: ["brown", "black", "beige"],
  },
  {
    id: 11,
    name: "Vintage Sunglasses",
    price: 39.99,
    originalPrice: 49.99,
    image: IMAGE_PATHS.SUNGLASSES,
    category: "accessories",
    rating: 4.4,
    reviews: 298,
    isNew: true,
    isFeatured: false,
    colors: ["black", "brown", "tortoise"],
  },
  {
    id: 13,
    name: "Leather Wallet",
    price: 49.99,
    originalPrice: 69.99,
    image: IMAGE_PATHS.WALLET,
    category: "accessories",
    rating: 4.5,
    reviews: 213,
    isNew: false,
    isFeatured: false,
    colors: ["brown", "black"],
  },
  {
    id: 24,
    name: "Wooden Watch",
    price: 59.99,
    originalPrice: 79.99,
    image: IMAGE_PATHS.WOODEN_WATCH,
    category: "accessories",
    rating: 4.5,
    reviews: 156,
    isNew: true,
    isFeatured: false,
    colors: ["brown", "black", "walnut"],
  },
  {
    id: 31,
    name: "Designer Backpack",
    price: 89.99,
    originalPrice: 119.99,
    image: IMAGE_PATHS.BACKPACK,
    category: "accessories",
    rating: 4.6,
    reviews: 278,
    isNew: false,
    isFeatured: false,
    colors: ["black", "gray", "navy"],
  },
  {
    id: 46,
    name: "Smartphone Case",
    price: 19.99,
    originalPrice: 29.99,
    image: IMAGE_PATHS.PHONE_CASE,
    category: "accessories",
    rating: 4.4,
    reviews: 445,
    isNew: true,
    isFeatured: false,
    colors: ["black", "clear", "blue"],
  },

  // Footwear products
  {
    id: 3,
    name: "Urban Style Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    image: IMAGE_PATHS.SNEAKERS,
    category: "footwear",
    rating: 4.7,
    reviews: 256,
    isNew: true,
    isFeatured: true,
    colors: ["white", "black"],
  },
  {
    id: 16,
    name: "Running Shoes Lightweight",
    price: 79.99,
    originalPrice: 99.99,
    image: IMAGE_PATHS.RUNNING_SHOES,
    category: "footwear",
    rating: 4.6,
    reviews: 189,
    isNew: true,
    isFeatured: true,
    colors: ["red", "black", "white"],
  },
  {
    id: 29,
    name: "Basketball Shoes",
    price: 119.99,
    originalPrice: 149.99,
    image: IMAGE_PATHS.BASKETBALL_SHOES,
    category: "footwear",
    rating: 4.5,
    reviews: 223,
    isNew: false,
    isFeatured: false,
    colors: ["red", "black", "white"],
  },

  // Home products
  {
    id: 7,
    name: "Minimalist Coffee Mug Set",
    price: 34.99,
    originalPrice: 49.99,
    image: IMAGE_PATHS.COFFEE_MUG,
    category: "home",
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isFeatured: false,
    colors: ["white", "black", "gray"],
  },
  {
    id: 8,
    name: "Organic Cotton Bed Sheets",
    price: 69.99,
    originalPrice: 89.99,
    image: IMAGE_PATHS.BED_SHEETS,
    category: "home",
    rating: 4.5,
    reviews: 234,
    isNew: false,
    isFeatured: false,
    colors: ["white", "cream", "light-blue"],
  },
  {
    id: 17,
    name: "Ceramic Plant Pots",
    price: 19.99,
    originalPrice: 29.99,
    image: IMAGE_PATHS.PLANT_POTS,
    category: "home",
    rating: 4.8,
    reviews: 134,
    isNew: false,
    isFeatured: false,
    colors: ["terracotta", "white", "gray"],
  },
  {
    id: 25,
    name: "Kitchen Knife Set",
    price: 149.99,
    originalPrice: 199.99,
    image: IMAGE_PATHS.KNIFE_SET,
    category: "home",
    rating: 4.8,
    reviews: 189,
    isNew: false,
    isFeatured: false,
    colors: ["silver", "black"],
  },
];

// Cache for frequently accessed data
let categoriesCache: { id: string; name: string; count: number }[] | null = null;
let productsCache: Product[] | null = null;

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const formatCategoryName = (category: string): string => {
  return CATEGORY_DISPLAY_NAMES[category] || 
         category.charAt(0).toUpperCase() + category.slice(1);
};

const calculateCategoryCounts = (): Map<string, number> => {
  const categoryMap = new Map<string, number>();
  
  products.forEach(product => {
    categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
  });
  
  return categoryMap;
};

const getCategoriesFromCache = (): { id: string; name: string; count: number }[] => {
  if (!categoriesCache) {
    const categoryCounts = calculateCategoryCounts();
    
    const categories = Array.from(categoryCounts.entries()).map(([id, count]) => ({
      id,
      name: formatCategoryName(id),
      count
    }));

    categoriesCache = [
      { id: "all", name: "All", count: products.length },
      ...categories
    ];
  }
  
  return categoriesCache;
};

// Invalidation function for cache
const invalidateCache = (): void => {
  categoriesCache = null;
  productsCache = null;
};

export const productService = {
  // Get all products with caching
  getProducts: async (): Promise<Product[]> => {
    await delay(100);
    
    if (!productsCache) {
      productsCache = [...products];
    }
    
    return productsCache;
  },

  // Get product by ID with early return
  getProduct: async (id: number): Promise<Product | undefined> => {
    await delay(100);
    return products.find((p: Product) => p.id === id);
  },

  // Get all categories with caching
  getCategories: async (): Promise<{ id: string; name: string; count: number }[]> => {
    await delay(100);
    return getCategoriesFromCache();
  },

  // Get products by category with filtering
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await delay(100);
    
    if (category === "all") {
      return productService.getProducts();
    }
    
    const allProducts = await productService.getProducts();
    return allProducts.filter(product => product.category === category);
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    await delay(100);
    const allProducts = await productService.getProducts();
    return allProducts.filter(product => product.isFeatured);
  },

  // Get new products
  getNewProducts: async (): Promise<Product[]> => {
    await delay(100);
    const allProducts = await productService.getProducts();
    return allProducts.filter(product => product.isNew);
  },

  // Search products by name
  searchProducts: async (query: string): Promise<Product[]> => {
    await delay(100);
    const allProducts = await productService.getProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
  },

  // Add new product (with cache invalidation)
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await delay(100);
    
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    
    products.push(newProduct);
    invalidateCache();
    
    return newProduct;
  },

  // Update product (with cache invalidation)
  updateProduct: async (id: number, updates: Partial<Product>): Promise<Product | undefined> => {
    await delay(100);
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    products[index] = { ...products[index], ...updates };
    invalidateCache();
    
    return products[index];
  },

  // Delete product (with cache invalidation)
  deleteProduct: async (id: number): Promise<boolean> => {
    await delay(100);
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    
    if (products.length !== initialLength) {
      invalidateCache();
      return true;
    }
    
    return false;
  }
};