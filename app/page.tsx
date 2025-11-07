// app/page.tsx
'use client';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import { 
  Star, Truck, Shield, Clock, ArrowRight, Sparkles, 
  TrendingUp, ChevronLeft, ChevronRight, Heart, 
  Eye, ShoppingBag, Zap, Users, Award 
} from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Types - Export these for reuse in other projects
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  colors: string[];
  sizes: string[];
  category: string;
  featured: boolean;
}

export interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  gradient: string;
}

export interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  gradient: string;
}

export interface Category {
  name: string;
  icon: string;
  href: string;
  color: string;
}

export interface Stat {
  number: string;
  label: string;
  trend: 'up' | 'down' | 'stable';
  icon: JSX.Element;
}

// Constants - Export these for reuse
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    description: "Premium quality cotton t-shirt for everyday comfort",
    price: 25.99,
    originalPrice: 35.99,
    discount: 28,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 50,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"],
    features: ["100% Cotton", "Machine Wash", "Premium Fit"],
    specifications: { "Material": "Cotton", "Fit": "Regular" },
    colors: ["black", "white", "gray"],
    sizes: ["S", "M", "L", "XL"],
    category: "clothing",
    featured: true
  },
  {
    id: "2",
    name: "Premium Denim Jacket",
    description: "Stylish denim jacket for a casual yet sophisticated look",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    stockCount: 25,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"],
    features: ["100% Cotton", "Classic Fit", "Durable"],
    specifications: { "Material": "Denim", "Style": "Jacket" },
    colors: ["blue", "black"],
    sizes: ["S", "M", "L", "XL"],
    category: "clothing",
    featured: true
  },
  {
    id: "3",
    name: "Urban Style Sneakers",
    description: "Comfortable and trendy sneakers for urban lifestyle",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    rating: 4.7,
    reviewCount: 256,
    inStock: true,
    stockCount: 30,
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop"],
    features: ["Comfort Fit", "Durable Sole", "Breathable"],
    specifications: { "Type": "Sneakers", "Sole": "Rubber" },
    colors: ["white", "black"],
    sizes: ["38", "39", "40", "41", "42"],
    category: "footwear",
    featured: true
  },
  {
    id: "4",
    name: "Designer Handbag",
    description: "Elegant handbag for modern women",
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    stockCount: 15,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop"],
    features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap"],
    specifications: { "Material": "Leather", "Style": "Handbag" },
    colors: ["brown", "black", "beige"],
    sizes: ["One Size"],
    category: "accessories",
    featured: true
  }
];

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: "/images/img1.jpg",
    title: "Summer Collection",
    subtitle: "New Arrivals",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 2,
    image: "/images/img2.jpg",
    title: "Electronics Sale",
    subtitle: "Up to 50% Off",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 3,
    image: "/images/img3.jpg",
    title: "Home & Living",
    subtitle: "Modern Designs",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: 4,
    image: "/images/img4.jpg",
    title: "Premium Accessories",
    subtitle: "Limited Edition",
    gradient: "from-orange-500/20 to-red-500/20"
  }
];

export const FEATURES: Feature[] = [
  {
    icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Free Shipping",
    description: "Free shipping on all orders over $50",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Secure Payment",
    description: "100% secure payment processing with encryption",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Clock className="w-6 h-6 md:w-8 md:h-8" />,
    title: "24/7 Support",
    description: "Round-the-clock customer support service",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <Star className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Quality Guarantee",
    description: "30-day money back quality guarantee",
    gradient: "from-orange-500 to-red-500"
  }
];

export const CATEGORIES: Category[] = [
  { name: 'Electronics', icon: '📱', href: '/categories/electronics', color: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing', icon: '👕', href: '/categories/clothing', color: 'from-purple-500 to-pink-500' },
  { name: 'Home & Garden', icon: '🏠', href: '/categories/home-garden', color: 'from-green-500 to-emerald-500' },
  { name: 'Sports', icon: '⚽', href: '/categories/sports', color: 'from-orange-500 to-red-500' },
  { name: 'Books', icon: '📚', href: '/categories/books', color: 'from-indigo-500 to-purple-500' },
];

// Reusable Components - Export these for other projects
export const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ 
      y: -15,
      scale: 1.02,
      transition: { duration: 0.4, type: "spring", stiffness: 300 }
    }}
    transition={{ duration: 0.6 }}
    className="relative group"
  >
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          FEATURED
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-300 text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {product.discount && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export const StatsSection = ({ 
  stats, 
  title = "Numbers That Speak",
  description = "Witness our growth in real-time with live statistics that never stop amazing"
}: { 
  stats: Stat[]; 
  title?: string;
  description?: string;
}) => (
  <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-lg opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-15 animate-ping" style={{ animationDelay: '2s' }}></div>
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6"
        >
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-semibold text-white">LIVE STATISTICS</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">REAL-TIME</span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          {title.split(' ').map((word, index, array) => 
            word === 'Speak' ? (
              <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 animate-pulse">
                {word}{' '}
              </span>
            ) : (
              <span key={index}>{word}{' '}</span>
            )
          )}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -10,
              transition: { duration: 0.3 }
            }}
            className="relative group"
          >
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 md:p-8 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              <div className="absolute inset-[2px] bg-slate-900 rounded-3xl z-10"></div>
              
              <div className="relative z-20">
                <div className="flex justify-center mb-4">
                  <div className={`p-2 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                    stat.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                    {stat.trend === 'down' && <TrendingUp className="w-5 h-5 rotate-180" />}
                    {stat.trend === 'stable' && <div className="w-2 h-2 bg-current rounded-full" />}
                  </div>
                </div>

                <motion.div
                  key={stat.number}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2"
                >
                  {stat.number}
                </motion.div>

                <div className="text-sm md:text-base text-gray-300 font-semibold flex items-center justify-center gap-2">
                  {stat.icon}
                  {stat.label}
                </div>

                {stat.label !== 'Support' && (
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    <span className="text-[10px] text-green-400 font-bold">LIVE</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-8"
      >
        <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">Stats update every 3 seconds</span>
          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      </motion.div>
    </div>
  </section>
);

// Main Component
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    customers: 0,
    products: 0,
    categories: 0,
    support: '24/7'
  });
  const [isHovering, setIsHovering] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize
  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, []);

  // Memoized data
  const stats = useMemo((): Stat[] => [
    { 
      number: `${animatedStats.customers.toLocaleString()}+`, 
      label: 'Happy Customers',
      trend: animatedStats.customers >= 10000 ? 'up' : 'down',
      icon: <Users className="w-5 h-5" />
    },
    { 
      number: `${animatedStats.products}+`, 
      label: 'Premium Products',
      trend: animatedStats.products >= 500 ? 'up' : 'down',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    { 
      number: `${animatedStats.categories}+`, 
      label: 'Categories',
      trend: animatedStats.categories >= 50 ? 'up' : 'down',
      icon: <Award className="w-5 h-5" />
    },
    { 
      number: animatedStats.support, 
      label: 'Support',
      trend: 'stable',
      icon: <Clock className="w-5 h-5" />
    }
  ], [animatedStats]);

  // Optimized handlers
  const fetchProducts = useCallback(async () => {
    try {
      setTimeout(() => {
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }
  }, []);

  // Carousel controls
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto slide
  useEffect(() => {
    if (isHovering || !isClient) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovering, isClient, nextSlide]);

  // Stats animation
  useEffect(() => {
    if (!isClient) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateStats();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated, isClient]);

  const animateStats = useCallback(() => {
    const targetValues = { customers: 10000, products: 500, categories: 50 };
    const initialValues = { customers: 8500, products: 450, categories: 45 };

    setAnimatedStats(prev => ({ ...prev, ...initialValues }));

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      
      if (step <= steps) {
        const progress = step / steps;
        
        setAnimatedStats(prev => ({
          ...prev,
          customers: Math.floor(initialValues.customers + (targetValues.customers - initialValues.customers) * progress),
          products: Math.floor(initialValues.products + (targetValues.products - initialValues.products) * progress),
          categories: Math.floor(initialValues.categories + (targetValues.categories - initialValues.categories) * progress)
        }));
      } else {
        clearInterval(timer);
        startRealTimeUpdates();
      }
    }, stepDuration);
  }, []);

  const startRealTimeUpdates = useCallback(() => {
    setInterval(() => {
      setAnimatedStats(prev => ({
        ...prev,
        customers: Math.max(9800, Math.min(10200, prev.customers + Math.floor(Math.random() * 20 - 10))),
        products: Math.max(480, Math.min(520, prev.products + Math.floor(Math.random() * 6 - 3))),
        categories: Math.max(48, Math.min(52, prev.categories + Math.floor(Math.random() * 2 - 1)))
      }));
    }, 3000);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    console.log('Added to cart:', product.name);
    alert(`Added ${product.name} to cart!`);
  }, []);

  return (
    <>
      <Head>
        <title>ShopNow - Your Ultimate Online Shopping Destination</title>
        <meta 
          name="description" 
          content="Discover amazing products at unbeatable prices on ShopNow. Free shipping on orders over $50, secure payments, 24/7 customer support, and 30-day quality guarantee." 
        />
        <meta name="keywords" content="online shopping, e-commerce, electronics, clothing, home goods, fashion, deals, discounts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <Header />
        
        <main className="pt-16 lg:pt-20">
          {/* Hero Carousel */}
          <section 
            className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-blue-700 text-white overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
              <AnimatePresence mode="wait">
                {CAROUSEL_SLIDES.map((slide, index) => (
                  index === currentSlide && (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <div 
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} backdrop-blur-[1px]`}></div>
                      </div>
                      
                      <div className="relative h-full flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex justify-center mb-4 md:mb-6"
                          >
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center space-x-1 md:space-x-2 animate-pulse">
                              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{slide.subtitle}</span>
                            </span>
                          </motion.div>
                          
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight"
                          >
                            {slide.title}{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 animate-pulse block sm:inline">
                              Collection
                            </span>
                          </motion.h1>
                          
                          <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed px-2"
                          >
                            Shop the latest trends with unbeatable prices. Quality guaranteed with 
                            fast shipping and excellent customer service.
                          </motion.p>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
                          >
                            <Link 
                              href="/Product" 
                              className="bg-blue-500 text-primary-600 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl md:shadow-2xl flex items-center space-x-2 group text-sm md:text-base w-full sm:w-auto justify-center"
                            >
                              <span>Start Shopping</span>
                              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link 
                              href="/categories" 
                              className="border-2 border-white  px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-blue-700 hover: text-primary-600 transition-all duration-300 transform hover:scale-105 text-sm md:text-base w-full sm:w-auto text-center"
                            >
                              Explore Categories
                            </Link>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {CAROUSEL_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute top-10 left-10 w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full animate-bounce-gentle z-0"></div>
            <div className="absolute top-20 right-20 w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-full animate-bounce-gentle z-0" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-20 w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-full animate-bounce-gentle z-0" style={{ animationDelay: '2s' }}></div>
          </section>

          {/* Stats Section */}
          <div ref={statsRef}>
            <StatsSection stats={stats} />
          </div>

          {/* Features Section */}
          <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-16 px-2">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4"
                >
                  Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">ShopNow</span>?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  We provide the best shopping experience with premium services and customer care
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border border-gray-100">
                      <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/50 overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-6 py-3 mb-6 shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-semibold">FEATURED PRODUCTS</span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                    Featured
                  </span>{' '}
                  Products
                </h2>
                
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Discover our handpicked selection of premium products loved by our customers
                </p>
              </motion.div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="relative"
                    >
                      <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-8 animate-pulse h-96"></div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {products.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-12"
              >
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 group"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-12 md:py-16 bg-gradient-to-br from-primary-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-16 px-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                  Shop by Category
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore our wide range of categories to find exactly what you need
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={category.href}
                      className="block card p-3 sm:p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 group bg-white rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-purple-200/50 border border-gray-100"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r ${category.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">{category.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">Explore now</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                Stay Updated with Latest Deals
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto px-2">
                Subscribe to our newsletter and be the first to know about exclusive offers and new arrivals
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto px-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white shadow-lg text-sm md:text-base"
                />
                <button className="bg-blue-400 text-primary-600 px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-blue-00 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base  w-full sm:w-auto">
                  Subscribe
                </button>
              </div>
              <p className="text-xs sm:text-sm opacity-75 mt-3 md:mt-4">
                No spam ever. Unsubscribe anytime.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}