// app/products/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Grid, List, Heart, 
  Star, ChevronDown, X, SlidersHorizontal,
  Menu // Added for mobile menu
} from "lucide-react";
import Image from "next/image";
import AddToCart from "../components/AddToCart";
import { productService, Product } from "../services/productService";
import { useRouter } from "next/navigation";

// Currency conversion utility
const USD_TO_PKR = 280; // Current exchange rate (adjust as needed)

const convertToPKR = (usdPrice: number): number => {
  return Math.round(usdPrice * USD_TO_PKR);
};

const formatPKR = (amount: number): string => {
  return `Rs ${amount.toLocaleString('en-PK')}`;
};

// Memoize static data with PKR prices
const filters = {
  price: [
    { label: "Under Rs 7,000", value: "0-7000" },
    { label: "Rs 7,000 - Rs 14,000", value: "7000-14000" },
    { label: "Rs 14,000 - Rs 28,000", value: "14000-28000" },
    { label: "Over Rs 28,000", value: "28000-280000" }
  ],
  rating: [
    { label: "4+ Stars", value: "4" },
    { label: "3+ Stars", value: "3" },
    { label: "2+ Stars", value: "2" }
  ]
} as const;

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Optimized product card component - Made responsive
const ProductCard = React.memo(({ 
  product, 
  viewMode, 
  index,
  isFavorite,
  onToggleFavorite,
  onProductClick
}: { 
  product: Product;
  viewMode: "grid" | "list";
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onProductClick: (product: Product) => void;
}) => {
  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product.id);
  }, [product.id, onToggleFavorite]);

  const handleClick = useCallback(() => {
    onProductClick(product);
  }, [product, onProductClick]);

  // Convert prices to PKR
  const pricePKR = convertToPKR(product.price);
  const originalPricePKR = convertToPKR(product.originalPrice);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
        hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer
        ${viewMode === "list" ? "lg:flex-row lg:gap-6" : ""}
        w-full
      `}
      onClick={handleClick}
    >
      {/* Image Container - Made responsive */}
      <div className={`
        relative overflow-hidden bg-gray-100 dark:bg-gray-700
        ${viewMode === "list" 
          ? "lg:w-64 lg:h-64 w-full aspect-[4/3] lg:aspect-auto" 
          : "w-full aspect-[4/3]"
        }
      `}>
        <Image
          src={product.image}
          alt={product.name}
          width={viewMode === "list" ? 256 : 400}
          height={viewMode === "list" ? 256 : 300}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          priority={index < 6}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk8eDdGW4PwswwS2MpICcnNcbSM1CI9kHq6r+9Bw5IeiMjCwugjHn//Z"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 lg:top-4 lg:right-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full backdrop-blur-sm hover:scale-110 transition-transform shadow-lg"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 lg:top-4 lg:left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 lg:px-3 lg:py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
              New
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-1 lg:px-3 lg:py-1 bg-purple-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Featured
            </span>
          )}
          {product.originalPrice > product.price && (
            <span className="px-2 py-1 lg:px-3 lg:py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Sale
            </span>
          )}
        </div>

        {/* Overlay Add to Cart */}
        <div 
          className="absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCart 
            product={{
              id: product.id.toString(),
              name: product.name,
              price: pricePKR, // Pass PKR price
              image: product.image,
              currency: "PKR"
            }}
          />
        </div>
      </div>

      {/* Content - Made responsive */}
      <div className={`flex-1 flex flex-col ${viewMode === "list" ? "lg:py-6 lg:pr-6 p-4" : "p-4 lg:p-6"}`}>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg line-clamp-2 mb-2 leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3 lg:mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 lg:w-4 lg:h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
              ({product.reviews.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Price & Bottom CTA */}
        <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-baseline gap-2">
            <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
              {formatPKR(pricePKR)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs lg:text-sm text-gray-500 line-through">
                {formatPKR(originalPricePKR)}
              </span>
            )}
          </div>
          
          {/* Default Add to Cart - Hidden on hover */}
          <div 
            className="group-hover:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <AddToCart 
              product={{
                id: product.id.toString(),
                name: product.name,
                price: pricePKR, // Pass PKR price
                image: product.image,
                currency: "PKR"
              }}
              variant="icon"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// Optimized filter components - Made responsive
const PriceFilter = React.memo(({ 
  selectedFilters, 
  onToggleFilter 
}: { 
  selectedFilters: string[];
  onToggleFilter: (type: 'price', value: string) => void;
}) => (
  <div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm lg:text-base">Price Range</h3>
    <div className="space-y-2">
      {filters.price.map(option => (
        <label key={option.value} className="flex items-center gap-3 text-xs lg:text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={selectedFilters.includes(option.value)}
            onChange={() => onToggleFilter('price', option.value)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 lg:w-5 lg:h-5"
          />
          {option.label}
        </label>
      ))}
    </div>
  </div>
));

PriceFilter.displayName = 'PriceFilter';

const RatingFilter = React.memo(({ 
  selectedFilters, 
  onToggleFilter 
}: { 
  selectedFilters: string[];
  onToggleFilter: (type: 'rating', value: string) => void;
}) => (
  <div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm lg:text-base">Rating</h3>
    <div className="space-y-2">
      {filters.rating.map(option => (
        <label key={option.value} className="flex items-center gap-3 text-xs lg:text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={selectedFilters.includes(option.value)}
            onChange={() => onToggleFilter('rating', option.value)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 lg:w-5 lg:h-5"
          />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < parseInt(option.value)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span>& up</span>
          </div>
        </label>
      ))}
    </div>
  </div>
));

RatingFilter.displayName = 'RatingFilter';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, count: number}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Added mobile menu state
  const [selectedFilters, setSelectedFilters] = useState({
    price: [] as string[],
    rating: [] as string[]
  });
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  // Load data
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);
        
        if (mounted) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Product click handler
  const handleProductClick = useCallback((product: Product) => {
    router.push(`/products/${product.id}`);
  }, [router]);

  // Memoized filtered products with PKR conversion for filtering
  const filteredProducts = useMemo(() => {
    if (isLoading) return [];

    let filtered = products;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Price filter - Convert USD prices to PKR for filtering
    if (selectedFilters.price.length > 0) {
      filtered = filtered.filter(product => {
        const pricePKR = convertToPKR(product.price);
        return selectedFilters.price.some(priceRange => {
          const [min, max] = priceRange.split('-').map(Number);
          return pricePKR >= min && pricePKR <= max;
        });
      });
    }

    // Rating filter
    if (selectedFilters.rating.length > 0) {
      filtered = filtered.filter(product => {
        return selectedFilters.rating.some(rating => 
          product.rating >= parseInt(rating)
        );
      });
    }

    // Sorting - Convert to PKR for price-based sorting
    return filtered.sort((a, b) => {
      const priceAPKR = convertToPKR(a.price);
      const priceBPKR = convertToPKR(b.price);
      
      switch (sortBy) {
        case "price-low": return priceAPKR - priceBPKR;
        case "price-high": return priceBPKR - priceAPKR;
        case "rating": return b.rating - a.rating;
        default: return a.id - b.id;
      }
    });
  }, [products, selectedCategory, debouncedSearchQuery, selectedFilters, sortBy, isLoading]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    if (selectedCategory !== "all") {
      return [{ category: selectedCategory, products: filteredProducts }];
    }

    const groups = filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    return Object.entries(groups).map(([category, products]) => ({
      category,
      products
    }));
  }, [filteredProducts, selectedCategory]);

  // Optimized event handlers
  const toggleFavorite = useCallback((productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const toggleFilter = useCallback((type: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters({ price: [], rating: [] });
    setSearchQuery("");
  }, []);

  const activeFilterCount = selectedFilters.price.length + selectedFilters.rating.length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Made responsive */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8"> {/* Improved padding */}
          <div className="flex items-center justify-between h-14 lg:h-16"> {/* Responsive height */}
            <div className="flex items-center gap-4 lg:gap-8"> {/* Responsive gap */}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Shop
              </h1>
              
              {/* Categories - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-6">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {category.name}
                    {category.count > 0 && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({category.count})
                      </span>
                    )}
                    {selectedCategory === category.id && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls - Made responsive */}
            <div className="flex items-center gap-2 lg:gap-4"> {/* Responsive gap */}
              {/* Mobile Search - Hidden on desktop */}
              <div className="lg:hidden relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span> {/* Hide text on very small screens */}
                {activeFilterCount > 0 && (
                  <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8"> {/* Responsive padding */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8"> {/* Responsive layout */}
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  <PriceFilter 
                    selectedFilters={selectedFilters.price}
                    onToggleFilter={toggleFilter}
                  />
                  <RatingFilter 
                    selectedFilters={selectedFilters.rating}
                    onToggleFilter={toggleFilter}
                  />

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 lg:mb-6 lg:hidden scrollbar-hide"> {/* Responsive margin */}
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md"
                      : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm hover:shadow-md"
                  }`}
                >
                  {category.name}
                  {category.count > 0 && (
                    <span className="ml-1 text-xs opacity-75">
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort Bar - Made responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 lg:mb-8"> {/* Responsive layout */}
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400"> {/* Responsive text */}
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </p>
              
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full sm:w-auto"> {/* Responsive width */}
                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Sort by:</span> {/* Responsive text */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="  text-xs lg:text-sm border-0 bg-transparent focus:ring-0 text-gray-900 dark:text-blue-400 font-medium w-full" 
                  // {/* Responsive text and width */}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products by Category */}
            <div className="space-y-8 lg:space-y-12"> {/* Responsive spacing */}
              {groupedProducts.map((group, groupIndex) => (
                <motion.section
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  {/* Category Header - Only show when viewing "All" categories */}
                  {selectedCategory === "all" && (
                    <div className="mb-6 lg:mb-8"> {/* Responsive margin */}
                      <div className="flex items-center gap-3 lg:gap-4"> {/* Responsive gap */}
                        <div className="w-1 h-6 lg:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div> {/* Responsive height */}
                        <div>
                          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white capitalize"> {/* Responsive text */}
                            {group.category}
                          </h2>
                          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1"> {/* Responsive text */}
                            {group.products.length} product{group.products.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products Grid - Made responsive */}
                  <div className={`
                    ${viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8"  /* Responsive grid and gap */
                      : "space-y-6 lg:space-y-8" /* Responsive spacing */
                    }
                  `}>
                    <AnimatePresence mode="popLayout">
                      {group.products.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          viewMode={viewMode}
                          index={index}
                          isFavorite={favorites.includes(product.id)}
                          onToggleFavorite={toggleFavorite}
                          onProductClick={handleProductClick}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Empty State - Made responsive */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 lg:py-16" 
                // {/* Responsive padding */}
              >
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"> {/* Responsive size */}
                  <Search className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" /> {/* Responsive icon */}
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2"> {/* Responsive text */}
                  No products found
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto px-4"> {/* Responsive text and padding */}
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 lg:px-8 lg:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl text-sm lg:text-base" 
                  // {/* Responsive padding and text */}
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 lg:p-6"> {/* Responsive padding */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Filters */}
                <div className="space-y-6">
                  <PriceFilter 
                    selectedFilters={selectedFilters.price}
                    onToggleFilter={toggleFilter}
                  />
                  <RatingFilter 
                    selectedFilters={selectedFilters.rating}
                    onToggleFilter={toggleFilter}
                  />
                </div>

                {/* Apply Filters */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Sheet - Added for mobile categories */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        {category.count > 0 && (
                          <span className="text-xs opacity-75">
                            {category.count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsContent />;
}