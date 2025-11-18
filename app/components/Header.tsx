// components/Header.tsx - FIXED SEARCH TOGGLE
"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Sparkles, Star, Gem, Crown, Zap, Cloud, Clock, LogOut, Settings, Loader2 } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  profileImage?: string;
}

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
}

// Mock product database - Replace with your actual API
const PRODUCT_DATABASE: SearchProduct[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    price: 25.99,
    originalPrice: 35.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    category: "clothing",
    inStock: true,
    rating: 4.5
  },
  {
    id: "2",
    name: "Premium Denim Jacket",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    category: "clothing",
    inStock: true,
    rating: 4.8
  },
  {
    id: "3",
    name: "Urban Style Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
    category: "footwear",
    inStock: false,
    rating: 4.7
  },
  {
    id: "4",
    name: "Elegance Formal Shirt",
    price: 45.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
    category: "clothing",
    inStock: true,
    rating: 4.3
  },
  {
    id: "5",
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "electronics",
    inStock: true,
    rating: 4.6
  }
];

// Constants
const NAVIGATION_ITEMS = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Sparkles,
    description: 'Begin your journey'
  },
  { 
    name: 'Products', 
    href: '/products', 
    icon: Gem,
    description: 'Discover excellence'
  },
  { 
    name: 'Categories', 
    href: '/categories', 
    icon: Cloud,
    description: 'Explore collections'
  },
  { 
    name: 'Contact', 
    href: '/contact', 
    icon: Zap,
    description: 'Connect with us'
  },
];

const DROPDOWN_LINKS = [
  { 
    name: 'All Products', 
    href: '/products', 
    icon: Sparkles, 
    badge: '✨',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'New Arrivals', 
    href: '/products?filter=new', 
    icon: Star, 
    badge: 'NEW',
    gradient: 'from-green-500 to-blue-500'
  },
  { 
    name: 'Best Sellers', 
    href: '/products?filter=bestsellers', 
    icon: Crown, 
    badge: 'TOP',
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    name: 'Limited Edition', 
    href: '/products?filter=limited', 
    icon: Gem, 
    badge: 'EXCLUSIVE',
    gradient: 'from-purple-500 to-blue-500'
  },
  { 
    name: 'Sale', 
    href: '/products?filter=sale', 
    icon: '⚡', 
    badge: '50% OFF',
    gradient: 'from-red-500 to-pink-500'
  },
];

export default function Header() {
  const { state } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isClockHovered, setIsClockHovered] = useState(false);
  
  // Enhanced Search States
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Combined effects for better performance
  useEffect(() => {
    if (!isClient) return;

    // DateTime effect
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      }));
    };

    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 1000);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll effect
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient]);

  // Enhanced Search Functionality - FIXED
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredProducts = PRODUCT_DATABASE.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredProducts);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  }, [performSearch]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    // If we have search results, navigate to the first product
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      router.push(`/products/${firstResult.id}`);
    } else {
      // If no results found, redirect to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    
    // Reset search state
    closeSearch();
  }, [searchQuery, searchResults, router]);

  const handleProductClick = useCallback((productId: string) => {
    router.push(`/products/${productId}`);
    closeSearch();
  }, [router]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setIsSearching(false);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close search if clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (isSearchOpen) {
          closeSearch();
        }
      }

      // Close other dropdowns
      const targets = [
        { ref: userDropdownRef, condition: isUserDropdownOpen },
        { ref: mobileMenuRef, condition: isMenuOpen },
        { ref: dropdownRef, condition: isDropdownOpen }
      ];

      targets.forEach(({ ref, condition }) => {
        if (ref.current && !ref.current.contains(event.target as Node) && condition) {
          if (ref === userDropdownRef) {
            setIsUserDropdownOpen(false);
          } else if (ref === mobileMenuRef) {
            closeAllMenus();
          } else if (ref === dropdownRef) {
            setIsDropdownOpen(false);
          }
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, isUserDropdownOpen, isMenuOpen, isDropdownOpen, closeSearch]);

  // Close dropdown when route changes
  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  // Memoized values
  const filteredNavigation = useMemo(() => 
    NAVIGATION_ITEMS.filter(item => 
      isMenuOpen || pathname !== item.href
    ), [isMenuOpen, pathname]
  );

  const filteredDropdownLinks = useMemo(() => 
    DROPDOWN_LINKS.filter(link => 
      link.href !== '/products' || pathname !== '/products'
    ), [pathname]
  );

  const shouldShowDropdown = filteredDropdownLinks.length > 0;

  // User data helpers
  const getUserInitials = useCallback(() => 
    user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U'
  , [user]);

  const getUserFullName = useCallback(() => 
    user ? `${user.firstName} ${user.lastName}` : 'Account'
  , [user]);

  const getUserProfileImage = useCallback(() => 
    user ? user.avatar || user.profileImage || null : null
  , [user]);

  const hasProfileImage = useCallback(() => 
    getUserProfileImage() !== null
  , [getUserProfileImage]);

  // Core functions - FIXED TOGGLE SEARCH
  const closeAllMenus = useCallback(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
    closeSearch();
  }, [closeSearch]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => {
      if (!prev) {
        setIsDropdownOpen(false);
        setIsUserDropdownOpen(false);
        closeSearch();
      }
      return !prev;
    });
  }, [closeSearch]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => {
      if (prev) return !prev;
      setIsUserDropdownOpen(false);
      closeSearch();
      return true;
    });
  }, [closeSearch]);

  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(prev => {
      if (prev) return !prev;
      setIsDropdownOpen(false);
      closeSearch();
      return true;
    });
  }, [closeSearch]);

  // FIXED: Simplified toggleSearch function
  const toggleSearch = useCallback(() => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      closeAllMenus();
      setIsSearchOpen(true);
      // Focus input after a small delay to ensure it's rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen, closeAllMenus, closeSearch]);

  const handleAccountClick = useCallback(() => {
    if (user) {
      toggleUserDropdown();
    } else {
      router.push('/auth/login');
      closeAllMenus();
    }
  }, [user, toggleUserDropdown, router, closeAllMenus]);

  const handleLogout = useCallback(async () => {
    try {
      logout();
      setIsUserDropdownOpen(false);
      closeAllMenus();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router, closeAllMenus, logout]);

  const handleNavigation = useCallback((href: string) => {
    closeAllMenus();
    setTimeout(() => router.push(href), 50);
  }, [router, closeAllMenus]);

  const handleMobileButton = useCallback((action: () => void) => {
    closeAllMenus();
    setTimeout(action, 50);
  }, [closeAllMenus]);

  // JSX Components as variables for better organization
  const HeaderSkeleton = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-300 rounded-2xl animate-pulse" />
            <div className="flex flex-col">
              <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mt-1" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );

  const AnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-30">
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(120, 119, 198, 0.25), transparent 70%),
            radial-gradient(600px at ${mousePosition.x * 0.7}px ${mousePosition.y * 0.7}px, 
              rgba(255, 119, 198, 0.15), transparent 50%),
            radial-gradient(400px at ${mousePosition.x * 1.3}px ${mousePosition.y * 1.3}px, 
              rgba(119, 198, 255, 0.1), transparent 40%)
          `,
        }}
      />
    </div>
  );

  const Logo = () => (
    <Link 
      href="/" 
      className={`flex items-center space-x-4 group relative transition-all duration-500 ${
        isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      onClick={closeAllMenus}
      onMouseEnter={() => setActiveHover('logo')}
      onMouseLeave={() => setActiveHover(null)}
    >
      <div className="relative">
        <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-110" />
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-10 group-hover:opacity-30 transition-all duration-700 group-hover:scale-105" />
        
        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 transform-gpu border border-white/10">
          <Crown className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform duration-300" />
          
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute -bottom-1 -left-1">
            <Sparkles className="w-2 h-2 text-cyan-400 animate-pulse" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tighter group-hover:scale-105 transition-transform duration-300 relative">
          RS-LEGACY
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 group-hover:w-full transition-all duration-500" />
        </span>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
            Timeless Elegance
          </span>
        </div>
      </div>
    </Link>
  );

  const DigitalClock = () => (
    <div className="hidden md:flex items-center justify-center">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsClockHovered(true)}
        onMouseLeave={() => setIsClockHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-lg transform scale-110 transition-all duration-500 group-hover:scale-125 group-hover:opacity-40" />
        
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-3xl rounded-2xl px-6 py-3 border border-white/40 dark:border-gray-700/40 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Clock className="w-4 h-4 text-purple-500 transform group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-mono text-lg font-bold text-gray-800 dark:text-white tracking-wider">
                {currentTime}
              </span>
              <span className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-500 ${
                isClockHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-1'
              }`}>
                {currentDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NavigationLink = useCallback(({ item, isMobile = false }: { item: typeof NAVIGATION_ITEMS[0], isMobile?: boolean }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    if (isMobile) {
      return (
        <button
          onClick={() => handleNavigation(item.href)}
          className={`w-full flex items-center space-x-4 py-4 px-6 font-semibold rounded-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/30 group ${
            isActive
              ? 'text-white bg-gradient-to-r from-purple-500/40 to-blue-500/40'
              : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/25 hover:to-blue-500/25'
          }`}
        >
          <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? 'text-white' : 'text-purple-500'
          }`} />
          <div className="flex flex-col items-start">
            <span className="text-base">{item.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80">
              {item.description}
            </span>
          </div>
          {isActive && (
            <div className="ml-auto">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            </div>
          )}
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        className={`relative px-6 py-4 font-semibold transition-all duration-700 group ${
          isActive 
            ? 'text-white' 
            : 'text-gray-700 dark:text-gray-300 hover:text-white'
        }`}
        onMouseEnter={() => setActiveHover(item.name)}
        onMouseLeave={() => setActiveHover(null)}
        onClick={closeAllMenus}
      >
        <div className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500/40 to-blue-500/40' 
            : activeHover === item.name 
            ? 'bg-gradient-to-r from-purple-500/25 to-blue-500/25' 
            : 'bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/15 group-hover:to-blue-500/15'
        }`} />
        
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700 ${
          isActive || activeHover === item.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`} style={{ 
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1.5px',
        }} />
        
        <div className="relative z-10 flex items-center space-x-3">
          <Icon className={`w-4 h-4 transition-all duration-700 ${
            isActive || activeHover === item.name
              ? 'text-white scale-110' 
              : 'text-gray-500 group-hover:text-purple-400'
          }`} />
          <div className="flex flex-col">
            <span className="tracking-wide text-sm">{item.name}</span>
            <span className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-500 ${
              activeHover === item.name ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-1'
            }`}>
              {item.description}
            </span>
          </div>
        </div>
        
        {isActive && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
        )}
        
        {!isActive && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:w-12 transition-all duration-700" />
        )}
      </Link>
    );
  }, [pathname, activeHover, closeAllMenus, handleNavigation]);

  const UserAvatar = useCallback(({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-lg',
      lg: 'w-14 h-14 text-xl'
    };

    if (hasProfileImage()) {
      return (
        <img
          src={getUserProfileImage()!}
          alt={`${getUserFullName()}'s profile`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300`}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform duration-500`}>
        {getUserInitials()}
      </div>
    );
  }, [hasProfileImage, getUserProfileImage, getUserFullName, getUserInitials]);

  const SearchInterface = () => (
    <div ref={searchRef} className="absolute top-0 left-0 right-0 h-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border-b border-gray-200/20 dark:border-gray-700/20">
      <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl relative">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-3xl blur-2xl transform scale-105 animate-pulse" />
          
          <input
            ref={searchInputRef}
            id="search-input"
            type="text"
            placeholder="✨ Search products... (Try 'T-Shirt', 'Jacket', 'Sneakers')"
            value={searchQuery}
            onChange={handleSearchChange}
            className="relative w-full px-8 py-5 pl-14 pr-14 rounded-3xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl shadow-2xl text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/40 transition-all duration-500 font-light"
            autoFocus
          />
          
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
          
          {isSearching && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
            </div>
          )}
          
          <button
            type="button"
            onClick={closeSearch}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-purple-500/20 border border-white/20 dark:border-gray-700/30 py-4 z-70 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
            
            <div className="relative z-10 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <>
                  <div className="px-6 py-3 border-b border-gray-200/30 dark:border-gray-700/30">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                  </div>
                  
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center space-x-4 px-6 py-4 text-left hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-300 group border-b border-gray-100/30 dark:border-gray-700/30 last:border-b-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200/30 dark:border-gray-700/30 group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full capitalize">
                            {product.category}
                          </span>
                          {!product.inStock && (
                            <span className="text-xs text-red-500 font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                      
                      <ChevronDown className="w-4 h-4 text-gray-400 transform -rotate-90 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                  ))}
                  
                  <div className="px-6 py-4 border-t border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Search className="w-4 h-4" />
                      <span>View First Product</span>
                    </button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                      Or click any product above to view details
                    </p>
                  </div>
                </>
              ) : !isSearching ? (
                <div className="px-6 py-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2">
                    No products found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    We couldn't find any products matching "{searchQuery}"
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span>Browse All Products</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </form>
    </div>
  );

  // Simple loading state for initial render
  if (!isClient) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      {isClient && <AnimatedBackground />}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl shadow-2xl shadow-purple-500/10 border-b border-white/20 dark:border-gray-700/30' 
          : 'bg-gradient-to-b from-white/98 via-white/95 to-white/90 dark:from-gray-900/98 dark:via-gray-900/95 dark:to-gray-900/90 backdrop-blur-2xl border-b border-gray-200/20 dark:border-gray-700/20'
      }`}>
        
        {/* Elegant Top Border with Gradient Flow */}
        <div className="h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
        </div>
        
        {/* Enhanced Floating Particles */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-20">
            
            <Logo />

            {currentTime && !isSearchOpen && <DigitalClock />}

            {/* Enhanced Desktop Navigation - Hide when search is open */}
            {!isSearchOpen && (
              <nav className="hidden xl:flex items-center space-x-2 relative">
                {filteredNavigation.map((item) => (
                  <NavigationLink key={item.name} item={item} />
                ))}
                
                {/* Enhanced Dropdown */}
                {shouldShowDropdown && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="flex items-center space-x-3 px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-white font-semibold transition-all duration-700 group"
                      onMouseEnter={() => setActiveHover('shop')}
                      onMouseLeave={() => setActiveHover(null)}
                      onClick={toggleDropdown}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 rounded-2xl transition-all duration-700 ${
                        activeHover === 'shop' || isDropdownOpen
                          ? 'from-purple-500/25 to-blue-500/25' 
                          : 'group-hover:from-purple-500/15 group-hover:to-blue-500/15'
                      }`} />
                      
                      <div className="relative z-10 flex items-center space-x-3">
                        <Gem className={`w-4 h-4 transition-all duration-700 ${
                          activeHover === 'shop' || isDropdownOpen
                            ? 'text-white scale-110' 
                            : 'text-gray-500 group-hover:text-purple-400'
                        }`} />
                        <div className="flex flex-col">
                          <span className="text-sm">Collections</span>
                          <span className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-500 ${
                            activeHover === 'shop' ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-1'
                          }`}>
                            Explore more
                          </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-700 ${
                          isDropdownOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'
                        }`} />
                      </div>
                    </button>

                    {/* Dropdown Content */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-purple-500/20 border border-white/20 dark:border-gray-700/30 py-4 z-60 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60" />
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
                        
                        <div className="relative z-10 px-2">
                          {filteredDropdownLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeAllMenus}
                                className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-2xl mx-2"
                              >
                                <div className="flex items-center space-x-3">
                                  {typeof Icon === 'string' ? (
                                    <span className="text-lg">{Icon}</span>
                                  ) : (
                                    <Icon className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                                  )}
                                  <span className="font-medium text-sm">{link.name}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${link.gradient} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                                  {link.badge}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </nav>
            )}

            {/* Enhanced Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search Button - FIXED: Now properly toggles */}
              <button 
                onClick={toggleSearch}
                className={`relative p-3 transition-all duration-500 group ${
                  isSearchOpen 
                    ? 'text-purple-600 dark:text-purple-400 scale-110' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                  isSearchOpen
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                    : 'bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10'
                }`} />
                <Search className={`w-5 h-5 relative z-10 transition-transform duration-500 ${
                  isSearchOpen ? 'scale-110 rotate-90' : 'group-hover:scale-110'
                }`} />
              </button>

              {/* User Account Button */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={handleAccountClick}
                  className={`relative flex items-center space-x-3 px-4 py-2 transition-all duration-500 group rounded-2xl ${
                    isSearchOpen
                      ? 'opacity-0 scale-95 pointer-events-none' 
                      : 'opacity-100 scale-100 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 rounded-2xl group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                  
                  {user ? (
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="relative">
                        <UserAvatar size="sm" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      </div>
                      
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {user.firstName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Welcome back!
                        </span>
                      </div>
                      
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 relative z-10">
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                      <span className="hidden lg:block text-sm font-medium">Account</span>
                    </div>
                  )}
                </button>
                
                {/* Enhanced User Dropdown Menu */}
                {isUserDropdownOpen && user && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-purple-500/20 border border-white/20 dark:border-gray-700/30 py-4 z-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60" />
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
                    
                    <div className="px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30 relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <UserAvatar size="md" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {getUserFullName()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Online
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2 relative z-10">
                      <button
                        onClick={() => handleMobileButton(() => router.push('/profile'))}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                      >
                        <User className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => handleMobileButton(() => router.push('/settings'))}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                      >
                        <Settings className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                        <span>Account Settings</span>
                      </button>
                      
                      <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 group hover:bg-red-50/50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Cart Button - Only show when user is logged in */}
              {user && (
                <Link 
                  href="/cart" 
                  className={`relative p-3 transition-all duration-500 group ${
                    isSearchOpen
                      ? 'opacity-0 scale-95 pointer-events-none' 
                      : 'opacity-100 scale-100 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                  onClick={closeAllMenus}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 rounded-2xl group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ 
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '1.5px',
                  }} />
                  
                  <ShoppingCart className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  
                  {state.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-2xl z-20 animate-bounce-scale">
                      {state.itemCount}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`md:hidden relative p-3 transition-all duration-500 group ${
                isSearchOpen
                  ? 'opacity-0 scale-95 pointer-events-none' 
                  : 'opacity-100 scale-100 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 rounded-2xl group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
              {isMenuOpen ? (
                <X className="w-6 h-6 relative z-10 transform transition-all duration-500 group-hover:rotate-90 scale-110" />
              ) : (
                <Menu className="w-6 h-6 relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-180" />
              )}
            </button>
          </div>

          {/* Search Interface */}
          {isSearchOpen && <SearchInterface />}
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={closeAllMenus}
            />
            
            <div 
              ref={mobileMenuRef}
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border-t border-gray-200/30 dark:border-gray-700/30 shadow-2xl z-50 overflow-y-auto max-h-[80vh]"
            >
              <div className="py-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-blue-500/10 to-cyan-500/5" />
                
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" style={{ animationDuration: '2s' }} />
                </div>

                {/* Enhanced Mobile Digital Clock */}
                {currentTime && (
                  <div className="px-6 mb-6 relative">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/25 to-blue-500/25 rounded-2xl blur-lg transform scale-105" />
                      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-2xl px-6 py-4 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                        <div className="flex items-center justify-center space-x-3">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <div className="flex flex-col items-center">
                            <span className="font-mono text-lg font-bold text-gray-800 dark:text-white tracking-wider">
                              {currentTime}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {currentDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Info in Mobile Menu */}
                {user && (
                  <div className="px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30 mb-4 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <UserAvatar size="lg" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {getUserFullName()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Mobile Search */}
                <div className="px-6 mb-8 relative">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/25 to-blue-500/25 rounded-3xl blur-lg transform scale-105" />
                      <input
                        type="text"
                        placeholder="🔮 Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="relative w-full px-6 py-4 pl-12 rounded-3xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-500 text-base font-light"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-4 h-4" />
                      {isSearching && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2 px-6 relative">
                  {filteredNavigation.map((item) => (
                    <NavigationLink key={item.name} item={item} isMobile={true} />
                  ))}

                  {/* Mobile Dropdown Links */}
                  {filteredDropdownLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.name}
                        onClick={() => handleNavigation(link.href)}
                        className="w-full flex items-center justify-between py-4 px-6 text-gray-700 dark:text-gray-300 hover:text-white font-semibold rounded-2xl transition-all duration-500 hover:bg-gradient-to-r hover:from-purple-500/25 hover:to-blue-500/25 group border border-white/20 dark:border-gray-700/30"
                      >
                        <div className="flex items-center space-x-4">
                          {typeof Icon === 'string' ? (
                            <span className="text-lg">{Icon}</span>
                          ) : (
                            <Icon className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                          )}
                          <span>{link.name}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${link.gradient} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                          {link.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex items-center space-x-3 mt-8 pt-8 border-t border-gray-200/30 dark:border-gray-700/30 px-6 relative">
                  {user ? (
                    <>
                      <button 
                        onClick={() => handleMobileButton(() => router.push('/profile'))}
                        className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                      >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Profile</span>
                      </button>
                      
                      <button 
                        onClick={() => handleMobileButton(() => router.push('/settings'))}
                        className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                      >
                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Settings</span>
                      </button>
                      
                      <button 
                        onClick={() => handleMobileButton(handleLogout)}
                        className="flex-1 flex items-center justify-center space-x-2 py-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleMobileButton(handleAccountClick)}
                      className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-semibold text-sm">Login</span>
                    </button>
                  )}
                  
                  {/* Mobile Cart Button */}
                  {user && (
                    <button 
                      onClick={() => handleNavigation('/cart')}
                      className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30 relative"
                    >
                      <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-semibold text-sm">Cart</span>
                      {state.itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-black rounded-full w-4 h-4 flex items-center justify-center shadow-2xl animate-ping">
                          {state.itemCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-10px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(-5px) rotate(240deg) scale(0.9); }
        }
        
        @keyframes bounce-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-scale {
          animation: bounce-scale 1s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}