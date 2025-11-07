// app/checkout/payment/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../lib/cart-context';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  Clock,
  Smartphone,
  User,
  Mail,
  MapPin,
  Truck,
  Package
} from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'jazzcash' | 'card' | 'wallet';
  icon: string;
  description: string;
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export default function PaymentPage() {
  const { state: cartState } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>('jazzcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Mock order data - in real app, this would come from API
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  });

  // JazzCash payment form state
  const [jazzCashForm, setJazzCashForm] = useState({
    phoneNumber: '',
    email: '',
    cnic: ''
  });

  // Card payment form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      type: 'jazzcash',
      icon: '📱',
      description: 'Pay securely with your JazzCash wallet'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: '💳',
      description: 'Pay with Visa, MasterCard, or UnionPay'
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      type: 'wallet',
      icon: '💰',
      description: 'Pay using your EasyPaisa account'
    }
  ];

  // Calculate order summary
  useEffect(() => {
    if (cartState.items && cartState.items.length > 0) {
      const subtotal = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const shipping = subtotal >= 50 ? 0 : 9.99;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;

      setOrderSummary({
        subtotal,
        shipping,
        tax,
        total,
        itemCount: cartState.itemCount
      });
    }
  }, [cartState]);

  const handleJazzCashInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJazzCashForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardForm(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setCardForm(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const simulateJazzCashPayment = async () => {
    // Simulate API call to JazzCash
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful payment 90% of the time
        const success = Math.random() > 0.1;
        resolve(success);
      }, 3000);
    });
  };

  const handlePayment = async () => {
    if (selectedMethod === 'jazzcash') {
      // Validate JazzCash form
      if (!jazzCashForm.phoneNumber || !jazzCashForm.email) {
        alert('Please fill in all required fields for JazzCash payment');
        return;
      }

      if (!/^03\d{9}$/.test(jazzCashForm.phoneNumber)) {
        alert('Please enter a valid Pakistani mobile number (03XXXXXXXXX)');
        return;
      }
    }

    if (selectedMethod === 'card') {
      // Validate card form
      if (!cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv || !cardForm.cardHolder) {
        alert('Please fill in all card details');
        return;
      }

      if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardForm.cardNumber)) {
        alert('Please enter a valid 16-digit card number');
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
      }

      if (!/^\d{3,4}$/.test(cardForm.cvv)) {
        alert('Please enter a valid CVV');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      const paymentSuccess = await simulateJazzCashPayment();

      if (paymentSuccess) {
        // Generate order ID
        const newOrderId = `ORD-${Date.now().toString().slice(-8)}`;
        setOrderId(newOrderId);
        setIsSuccess(true);
        
        // In real app, you would:
        // 1. Send order to backend
        // 2. Clear cart
        // 3. Redirect to order confirmation
      } else {
        alert('Payment failed. Please try again or use a different payment method.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewOrder = () => {
    // Redirect to order confirmation page
    router.push(`/order-confirmation/${orderId}`);
  };

  const handleContinueShopping = () => {
    router.push('/Product');
  };

  if (cartState.items.length === 0 && !isSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Package className="w-32 h-32 text-gray-300 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to payment.</p>
              <Link
                href="/Product"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-lg text-gray-600 mb-2">
                Thank you for your purchase
              </p>
              
              <p className="text-gray-500 mb-8">
                Order ID: <span className="font-mono font-bold text-purple-600">{orderId}</span>
              </p>

              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="text-2xl font-bold text-green-600">
                    Rs. {orderSummary.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Payment Method</span>
                  <span className="font-semibold">
                    {paymentMethods.find(method => method.id === selectedMethod)?.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleViewOrder}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  View Order Details
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Order Timeline */}
              <div className="mt-12 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                      1
                    </div>
                    <span>Order Placed</span>
                  </div>
                  <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                      2
                    </div>
                    <span>Payment Done</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                      3
                    </div>
                    <span>Processing</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="font-semibold">Address</span>
              </div>
              <div className="flex-1 h-1 bg-green-500 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="font-semibold text-gray-900">Payment</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="font-semibold">Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Payment Methods */}
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <CreditCard className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Payment Method</h1>
                  <p className="text-gray-600">Choose how you want to pay</p>
                </div>
              </motion.div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                        selectedMethod === method.id
                          ? 'border-purple-500 bg-purple-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{method.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            {selectedMethod === method.id && (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Payment Forms */}
              <div className="space-y-6">
                {/* JazzCash Form */}
                {selectedMethod === 'jazzcash' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-2 border-purple-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">JazzCash Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">+92</span>
                          </div>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={jazzCashForm.phoneNumber}
                            onChange={handleJazzCashInputChange}
                            placeholder="3XX XXXXXXX"
                            className="w-full pl-12 rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your JazzCash registered mobile number
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={jazzCashForm.email}
                          onChange={handleJazzCashInputChange}
                          placeholder="your@email.com"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CNIC Number (Optional)
                        </label>
                          <input
                          type="text"
                          name="cnic"
                          value={jazzCashForm.cnic}
                          onChange={handleJazzCashInputChange}
                          placeholder="XXXXX-XXXXXXX-X"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        />
                      </div>

                      {/* JazzCash Instructions */}
                      <div className="bg-blue-50 rounded-xl p-4 mt-4">
                        <h4 className="font-semibold text-blue-900 mb-2">How to pay with JazzCash:</h4>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Enter your JazzCash registered mobile number</li>
                          <li>You will receive a payment request on your phone</li>
                          <li>Enter your MPIN to confirm the payment</li>
                          <li>Payment will be processed instantly</li>
                        </ol>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Card Form */}
                {selectedMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-2 border-purple-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardForm.cardNumber}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardForm.expiryDate}
                            onChange={handleCardInputChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardForm.cvv}
                            onChange={handleCardInputChange}
                            placeholder="123"
                            maxLength={4}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Holder Name *
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={cardForm.cardHolder}
                          onChange={handleCardInputChange}
                          placeholder="John Doe"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* EasyPaisa Info */}
                {selectedMethod === 'easypaisa' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-2 border-purple-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💰</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        EasyPaisa Payment
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You will be redirected to EasyPaisa to complete your payment securely.
                      </p>
                      <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-800">
                        <p>Make sure you have sufficient balance in your EasyPaisa account.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-2xl border border-green-200">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  Your payment is secure and encrypted
                </span>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({orderSummary.itemCount} items)</span>
                    <span>Rs. {orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {orderSummary.shipping === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `Rs. ${orderSummary.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rs. {orderSummary.tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>Rs. {orderSummary.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Including all taxes</p>
                  </div>
                </div>

                {/* Pay Now Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay Rs. {orderSummary.total.toFixed(2)}
                    </>
                  )}
                </motion.button>

                {/* Security Message */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  256-bit SSL secured payment
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3 text-center">
                    Trusted by thousands
                  </p>
                  <div className="flex justify-center gap-4">
                    {['🔒', '🛡️', '⭐', '✓'].map((badge, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg"
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Support Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 rounded-2xl p-6 mt-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Need Help?</h4>
                </div>
                <p className="text-sm text-blue-800 mb-2">
                  Our support team is here to help you with your payment.
                </p>
                <div className="text-sm text-blue-700">
                  <p>📞 Call: 021-111-123-456</p>
                  <p>💬 WhatsApp: +92-300-1234567</p>
                  <p>⏰ 24/7 Customer Support</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Back to Address */}
          <div className="text-center mt-8">
            <Link
              href="/checkout/address"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Address
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}