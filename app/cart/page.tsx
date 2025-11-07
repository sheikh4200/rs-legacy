// app/cart/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Shield, Truck, Clock, Heart, LogIn } from "lucide-react";
import { useCart } from "../lib/cart-context"; 
import { useAuth } from "../lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Enhanced debug component
function CartDebug() {
  const { state } = useCart();
  
  useEffect(() => {
    console.log("=== CART DEBUG ===");
    console.log("Full state:", state);
    console.log("Items array:", state.items);
    console.log("Items length:", state.items?.length);
    console.log("Item count:", state.itemCount);
    console.log("Total:", state.total);
    
    if (state.items && state.items.length > 0) {
      state.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        });
      });
    }
  }, [state]);

  if (!state.items) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg z-50 text-sm">
        ❌ state.items is undefined
      </div>
    );
  }

  const validItems = state.items.filter(item => 
    item.id && item.name && !isNaN(item.price) && !isNaN(item.quantity)
  );

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg z-50 text-sm max-w-xs">
      <div>🛒 Valid Items: {validItems.length}</div>
      <div>📦 Total Count: {state.itemCount || 0}</div>
      <div>💰 Total: ${(state.total || 0).toFixed(2)}</div>
      {validItems.length > 0 && (
        <div className="mt-2 border-t pt-1">
          <div>First item: {validItems[0].name}</div>
          <div>Qty: {validItems[0].quantity}</div>
          <div>Price: ${validItems[0].price}</div>
        </div>
      )}
      {state.items.length !== validItems.length && (
        <div className="mt-1 text-yellow-300">
          ⚠️ {state.items.length - validItems.length} invalid items
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  // Filter out invalid items and fix data issues
  const validItems = state.items?.filter(item => 
    item && 
    item.id && 
    item.name && 
    !isNaN(item.price) && 
    !isNaN(item.quantity) &&
    item.quantity > 0
  ) || [];

  // Recalculate totals based on valid items
  const itemCount = validItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const total = validItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  const shippingCost = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

  // Enhanced debugging
  useEffect(() => {
    console.log("=== CART PAGE RENDER ===");
    console.log("Raw items:", state.items);
    console.log("Valid items:", validItems);
    console.log("Item count:", itemCount);
    console.log("Total:", total);
    console.log("Is authenticated:", isAuthenticated);
  }, [state, validItems, itemCount, total, isAuthenticated]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Please login to proceed with checkout");
      return;
    }

    if (validItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    setIsCheckingOut(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to address page
    console.log("Redirecting to address page with valid items:", validItems);
    router.push("/checkout/address");
    
    setIsCheckingOut(false);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.name) {
      return user.name;
    }
    
    return user.email || "User";
  };

  // Show login required message if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-8">
              <LogIn className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sign In Required
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Please sign in to view your cart and manage your items.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
              
              <Link
                href="/Product"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              {[
                { icon: <Shield className="w-8 h-8" />, title: "Secure Payment", desc: "100% protected" },
                { icon: <Truck className="w-8 h-8" />, title: "Free Shipping", desc: "On orders over $50" },
                { icon: <Clock className="w-8 h-8" />, title: "Easy Returns", desc: "30-day policy" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
                >
                  <div className="text-purple-600 dark:text-purple-400 mb-3 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (validItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Temporary debug - remove after fixing */}
        <CartDebug />
        
        {/* Add user welcome message */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-right mb-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, <span className="font-semibold text-purple-600 dark:text-purple-400">{getUserDisplayName()}</span>
              </span>
            </motion.div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/Product"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
              
              <Link
                href="/Product"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              {[
                { icon: <Shield className="w-8 h-8" />, title: "Secure Payment", desc: "100% protected" },
                { icon: <Truck className="w-8 h-8" />, title: "Free Shipping", desc: "On orders over $50" },
                { icon: <Clock className="w-8 h-8" />, title: "Easy Returns", desc: "30-day policy" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
                >
                  <div className="text-purple-600 dark:text-purple-400 mb-3 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Temporary debug - remove after fixing */}
      <CartDebug />
      
      {/* Add user welcome message */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-semibold text-purple-600 dark:text-purple-400">{getUserDisplayName()}</span>
            </span>
          </motion.div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 transition-colors duration-300"
              >
                <Trash2 className="w-5 h-5" />
                Clear Cart
              </button>
            </motion.div>

            {/* Cart Items List */}
            <div className="space-y-4">
              <AnimatePresence>
                {validItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.quantity}`} // Unique key with quantity to avoid duplicates
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name}
                          width={200}
                          height={200}
                          className="object-cover rounded-xl w-full h-full"
                        />
                        
                        {/* Sale Badge */}
                        {item.price < 50 && (
                          <div className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sale
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {item.name}
                            </h3>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Quantity:
                            </span>
                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-colors duration-300"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className={`w-4 h-4 ${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`} />
                              </button>
                              
                              <span className="font-semibold text-gray-900 dark:text-white min-w-8 text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-colors duration-300"
                              >
                                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Save for Later */}
                        <div className="flex justify-end mt-3">
                          <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300 text-sm">
                            <Heart className="w-4 h-4" />
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex justify-between items-center"
            >
              <Link
                href="/Product"
                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors duration-300"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Continue Shopping
              </Link>

              {/* Cart Summary Mobile */}
              <div className="sm:hidden text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {itemCount} items
                </p>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h3>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {/* Shipping Progress */}
                {total < 50 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-yellow-800 dark:text-yellow-200">
                        Free shipping on orders over $50
                      </span>
                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                        ${(50 - total).toFixed(2)} away
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="border-t dark:border-gray-600 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button - Now redirects to address page */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isCheckingOut || validItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Security Message */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                Secure checkout guaranteed
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                  We accept:
                </p>
                <div className="flex justify-center gap-3">
                  {['Visa', 'MC', 'PayPal', 'Apple'].map((method) => (
                    <div
                      key={method}
                      className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Trust Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 gap-4 mt-6"
            >
              {[
                { icon: <Shield className="w-5 h-5" />, text: "30-day return policy" },
                { icon: <Truck className="w-5 h-5" />, text: "Free shipping over $50" },
                { icon: <Clock className="w-5 h-5" />, text: "Customer support 24/7" },
              ].map((feature, index) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="text-green-500">
                    {feature.icon}
                  </div>
                  {feature.text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}