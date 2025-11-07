// components/Header.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Sparkles, Star, Gem, Crown, Zap, Cloud, Clock, LogOut, Settings } from 'lucide-react';
import { useCart } from '../lib/cart-context';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  profileImage?: string;
}

export default function Header() {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isClockHovered, setIsClockHovered] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Set client-side flag - SIMPLE AND SAFE
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced digital clock with date - CLIENT ONLY
  useEffect(() => {
    if (!isClient) return;

    const updateDateTime = () => {
      const now = new Date();
      
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, [isClient]);

  // Enhanced mouse tracking - CLIENT ONLY
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  // Enhanced scroll effect - CLIENT ONLY
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Fetch user data - SAFE CLIENT-SIDE ONLY
  useEffect(() => {
    if (!isClient) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data);
          }
        }
        // 401 is normal - user not logged in
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Use timeout to ensure it's after initial render
    const timer = setTimeout(() => {
      fetchUserData();
    }, 100);

    return () => clearTimeout(timer);
  }, [isClient]);

  // Enhanced click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMenuOpen) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, isUserDropdownOpen, isMenuOpen]);

  // Close all menus function
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsDropdownOpen(false);
      setIsUserDropdownOpen(false);
    }
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      closeAllMenus();
    }
  };

  // Handle account click
  const handleAccountClick = () => {
    if (user) {
      toggleUserDropdown();
    } else {
      router.push('/auth/login');
      closeAllMenus();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        setIsUserDropdownOpen(false);
        closeAllMenus();
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    router.push('/profile');
    closeAllMenus();
  };

  // Handle settings navigation
  const handleSettingsClick = () => {
    router.push('/settings');
    closeAllMenus();
  };

  // Mobile navigation handler
  const handleMobileNavigation = (href: string) => {
    closeAllMenus();
    setTimeout(() => {
      router.push(href);
    }, 50);
  };

  // Mobile button handlers
  const handleMobileButtonClick = (action: () => void) => {
    closeAllMenus();
    setTimeout(() => {
      action();
    }, 50);
  };

  // Navigation configuration
  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Sparkles,
      description: 'Begin your journey',
      condition: (isMobile: boolean) => isMobile || pathname !== '/'
    },
    { 
      name: 'Products', 
      href: '/Product', 
      icon: Gem,
      description: 'Discover excellence',
      condition: (isMobile: boolean) => isMobile || !pathname.startsWith('/Product')
    },
    { 
      name: 'Categories', 
      href: '/categories', 
      icon: Cloud,
      description: 'Explore collections',
      condition: (isMobile: boolean) => isMobile || !pathname.startsWith('/categories')
    },

    

    { 
      name: 'Contact', 
      href: '/contact', 
      icon: Zap,
      description: 'Connect with us',
      condition: (isMobile: boolean) => isMobile || pathname !== '/contact'
    },
  ];

  const dropdownLinks = [
    { 
      name: 'All Products', 
      href: '/Product', 
      icon: Sparkles, 
      badge: '✨',
      gradient: 'from-purple-500 to-pink-500',
      condition: () => pathname !== '/Product'
    },
    { 
      name: 'New Arrivals', 
      href: '/Product?filter=new', 
      icon: Star, 
      badge: 'NEW',
      gradient: 'from-green-500 to-blue-500',
      condition: () => true
    },
    { 
      name: 'Best Sellers', 
      href: '/Product?filter=bestsellers', 
      icon: Crown, 
      badge: 'TOP',
      gradient: 'from-yellow-500 to-orange-500',
      condition: () => true
    },
    { 
      name: 'Limited Edition', 
      href: '/Product?filter=limited', 
      icon: Gem, 
      badge: 'EXCLUSIVE',
      gradient: 'from-purple-500 to-blue-500',
      condition: () => true
    },
    { 
      name: 'Sale', 
      href: '/Product?filter=sale', 
      icon: '⚡', 
      badge: '50% OFF',
      gradient: 'from-red-500 to-pink-500',
      condition: () => true
    },
  ];

  // Filter navigation based on conditions
  const getFilteredNavigation = (isMobile: boolean = false) => {
    return navigation.filter(item => item.condition(isMobile));
  };

  // Filter dropdown links based on conditions
  const getFilteredDropdownLinks = () => {
    return dropdownLinks.filter(link => link.condition());
  };

  // Check if dropdown should be shown
  const shouldShowDropdown = getFilteredDropdownLinks().length > 0;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  // Get user full name
  const getUserFullName = () => {
    if (!user) return 'Account';
    return `${user.firstName} ${user.lastName}`;
  };

  // Get user profile image URL
  const getUserProfileImage = () => {
    if (!user) return null;
    return user.avatar || user.profileImage || null;
  };

  // Check if user has profile image
  const hasProfileImage = () => {
    return getUserProfileImage() !== null;
  };

  // Simple loading state for initial render
  if (!isClient) {
    return (
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
  }

  return (
    <>
      {/* Enhanced Animated Background Canvas */}
      {isClient && (
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
      )}

      {/* Fixed Header */}
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

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={menuRef}>
          <div className="flex justify-between items-center h-20">
            
            {/* Enhanced Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-4 group relative" 
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

            {/* Enhanced Digital Clock with Date */}
            {currentTime && (
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
            )}

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-2 relative">
              {getFilteredNavigation(false).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-6 py-4 font-semibold transition-all duration-700 group ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-white'
                    }`}
                    onMouseEnter={() => setActiveHover(item.name)}
                    onMouseLeave={() => setActiveHover(null)}
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
              })}
              
              {/* Enhanced Dropdown */}
              {shouldShowDropdown && (
                <div className="relative">
                  <button
                    className="flex items-center space-x-3 px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-white font-semibold transition-all duration-700 group"
                    onMouseEnter={() => setActiveHover('shop')}
                    onMouseLeave={() => setActiveHover(null)}
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
                       <Link href={"/collections"}> <span className="text-sm">Collections
                          
                        </span></Link>
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
                </div>
              )}
            </nav>

            {/* Enhanced Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search Button */}
              <button 
                onClick={toggleSearch}
                className="relative p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 rounded-2xl group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                <Search className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </button>

              {/* User Account Button with Name and Profile Image */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={handleAccountClick}
                  className="relative flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 group rounded-2xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 rounded-2xl group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                  
                  {user ? (
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="relative">
                        {hasProfileImage() ? (
                          <img
                            src={getUserProfileImage()!}
                            alt={`${getUserFullName()}'s profile`}
                            className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm transform group-hover:scale-110 transition-transform duration-500">
                            {getUserInitials()}
                          </div>
                        )}
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
                          {hasProfileImage() ? (
                            <img
                              src={getUserProfileImage()!}
                              alt={`${getUserFullName()}'s profile`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg transform hover:scale-105 transition-transform duration-300">
                              {getUserInitials()}
                            </div>
                          )}
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
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                      >
                        <User className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={handleSettingsClick}
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
                  className="relative p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 group"
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
              className="md:hidden relative p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 group"
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

          {/* Enhanced Search Interface */}
          {isSearchOpen && (
            <div ref={searchRef} className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 z-60">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-3xl blur-2xl transform scale-105 animate-pulse" />
                  
                  <input
                    id="search-input"
                    type="text"
                    placeholder="✨ Discover timeless elegance..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative w-full px-8 py-5 pl-14 pr-14 rounded-3xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl shadow-2xl text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/40 transition-all duration-500 font-light"
                  />
                  
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}
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

                {/* User Info in Mobile Menu with Profile Image */}
                {user && (
                  <div className="px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30 mb-4 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {hasProfileImage() ? (
                          <img
                            src={getUserProfileImage()!}
                            alt={`${getUserFullName()}'s profile`}
                            className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/50"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl transform hover:scale-105 transition-transform duration-300">
                            {getUserInitials()}
                          </div>
                        )}
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
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/25 to-blue-500/25 rounded-3xl blur-lg transform scale-105" />
                      <input
                        type="text"
                        placeholder="🔮 Search with elegance..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="relative w-full px-6 py-4 pl-12 rounded-3xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-500 text-base font-light"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-4 h-4" />
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2 px-6 relative">
                  {getFilteredNavigation(true).map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleMobileNavigation(item.href)}
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
                  })}

                  {/* Mobile Dropdown Links */}
                  {getFilteredDropdownLinks().map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.name}
                        onClick={() => handleMobileNavigation(link.href)}
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
                        onClick={() => handleMobileButtonClick(handleProfileClick)}
                        className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                      >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Profile</span>
                      </button>
                      
                      <button 
                        onClick={() => handleMobileButtonClick(handleSettingsClick)}
                        className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                      >
                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Settings</span>
                      </button>
                      
                      <button 
                        onClick={() => handleMobileButtonClick(handleLogout)}
                        className="flex-1 flex items-center justify-center space-x-2 py-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleMobileButtonClick(handleAccountClick)}
                      className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-500 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 group shadow-2xl border border-white/20 dark:border-gray-700/30"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-semibold text-sm">Login</span>
                    </button>
                  )}
                  
                  {/* Mobile Cart Button - Only show when user is logged in */}
                  {user && (
                    <button 
                      onClick={() => handleMobileNavigation('/cart')}
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