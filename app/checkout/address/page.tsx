// app/checkout/address/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../lib/cart-context';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  Building, 
  User, 
  Phone, 
  Mail, 
  Edit2,
  Check,
  Truck,
  Shield,
  CreditCard,
  Package,
  Clock,
  Plus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

interface Address {
  _id?: string;
  id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  userId?: string; // For future user authentication
}

export default function CheckoutAddressPage() {
  const { state: cartState, updateShippingAddress } = useCart(); // Add updateShippingAddress to your cart context
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Addresses from MongoDB
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    type: 'home',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan'
  });

  // Fetch addresses from MongoDB on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Set default address when addresses load
  useEffect(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses]);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await fetch('/api/addresses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // You can set some default addresses or show an error message
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const finalTotal = subtotal + shippingCost + tax;

    return { subtotal, shippingCost, tax, finalTotal };
  };

  const { subtotal, shippingCost, tax, finalTotal } = calculateTotals();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingAddress) {
      setEditingAddress(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAddress,
          isDefault: addresses.length === 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh addresses list
        await fetchAddresses();
        setSelectedAddress(result.addressId);
        setShowAddressForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/addresses/${editingAddress._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAddress),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh addresses list
        await fetchAddresses();
        setIsEditing(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string, mongoId?: string) => {
    if (addresses.length <= 1) {
      alert('You must have at least one address');
      return;
    }

    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses/${mongoId || id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh addresses list
        await fetchAddresses();
        if (selectedAddress === id) {
          const remainingAddress = addresses.find(addr => addr.id !== id);
          setSelectedAddress(remainingAddress?.id || '');
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch('/api/addresses/set-default', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh addresses list
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address. Please try again.');
    }
  };

  const resetForm = () => {
    setNewAddress({
      type: 'home',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    });
  };

  const handleContinueToPayment = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the selected address details
      const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
      
      if (selectedAddressData) {
        // Store the selected address in cart context or session
        if (updateShippingAddress) {
          updateShippingAddress({
            street: selectedAddressData.addressLine1,
            city: selectedAddressData.city,
            state: selectedAddressData.state,
            zip: selectedAddressData.zipCode
          });
        }
        
        // You can also store it in localStorage for persistence
        localStorage.setItem('selectedShippingAddress', JSON.stringify(selectedAddressData));
        
        // Navigate to payment page
        router.push('/checkout/payment');
      }
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setIsEditing(true);
    setShowAddressForm(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingAddress(null);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  if (cartState.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Package className="w-32 h-32 text-gray-300 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="font-semibold text-gray-900">Address</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4">
                <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600 w-0"></div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="font-semibold">Payment</span>
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
            {/* Left Column - Address Selection */}
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <MapPin className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Shipping Address</h1>
                  <p className="text-gray-600">Where should we deliver your order?</p>
                </div>
              </motion.div>

              {/* Saved Addresses */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
                  {isLoadingAddresses && (
                    <div className="text-sm text-gray-500">Loading addresses...</div>
                  )}
                </div>
                
                {!isLoadingAddresses && addresses.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <motion.div
                        key={address.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                          selectedAddress === address.id
                            ? 'border-purple-500 bg-purple-50/50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 mb-2">
                            {getAddressIcon(address.type)}
                            <span className="font-semibold text-gray-900 capitalize">
                              {address.type} {address.isDefault && '(Default)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedAddress === address.id && (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(address);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <p className="font-semibold">
                            {address.firstName} {address.lastName}
                          </p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                          <p className="flex items-center gap-1 mt-2">
                            <Phone className="w-4 h-4" />
                            {address.phone}
                          </p>
                          <p className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {address.email}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                              Set as Default
                            </button>
                          )}
                          {addresses.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id, address._id);
                              }}
                              className="text-sm text-red-600 hover:text-red-700 font-medium ml-4 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Address Button */}
              {!showAddressForm && !isEditing && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowAddressForm(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-purple-600">
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center transition-colors">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-semibold">Add New Address</span>
                    <span className="text-sm">Add a new shipping address</span>
                  </div>
                </motion.button>
              )}

              {/* Add/Edit Address Form */}
              <AnimatePresence>
                {(showAddressForm || isEditing) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-2 border-purple-200 rounded-2xl p-6 bg-white/80 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isEditing ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={isEditing ? handleUpdateAddress : handleAddAddress}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Form fields remain the same as your original code */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type
                          </label>
                          <select
                            name="type"
                            value={isEditing ? editingAddress?.type : newAddress.type}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={isEditing ? editingAddress?.firstName : newAddress.firstName}
                              onChange={isEditing ? handleEditInputChange : handleInputChange}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={isEditing ? editingAddress?.lastName : newAddress.lastName}
                              onChange={isEditing ? handleEditInputChange : handleInputChange}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={isEditing ? editingAddress?.phone : newAddress.phone}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={isEditing ? editingAddress?.email : newAddress.email}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={isEditing ? editingAddress?.addressLine1 : newAddress.addressLine1}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={isEditing ? editingAddress?.addressLine2 : newAddress.addressLine2}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={isEditing ? editingAddress?.city : newAddress.city}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={isEditing ? editingAddress?.state : newAddress.state}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={isEditing ? editingAddress?.zipCode : newAddress.zipCode}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={isEditing ? editingAddress?.country : newAddress.country}
                            onChange={isEditing ? handleEditInputChange : handleInputChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              {isEditing ? 'Updating...' : 'Saving...'}
                            </>
                          ) : (
                            isEditing ? 'Update Address' : 'Add Address'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={isEditing ? cancelEdit : () => setShowAddressForm(false)}
                          disabled={isLoading}
                          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
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
                    <span>Subtotal ({cartState.itemCount} items)</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `Rs. ${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                  </div>

                  {/* Shipping Progress */}
                  {subtotal < 50 && (
                    <div className="bg-yellow-50 rounded-lg p-3 mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-yellow-800">
                          Free shipping on orders over Rs. 50
                        </span>
                        <span className="font-semibold text-yellow-800">
                          Rs. {(50 - subtotal).toFixed(2)} away
                        </span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>Rs. {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueToPayment}
                  disabled={isLoading || !selectedAddress || addresses.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Continue to Payment
                    </>
                  )}
                </motion.button>

                {/* Security Message */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  Secure checkout guaranteed
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3 text-center">
                    We accept:
                  </p>
                  <div className="flex justify-center gap-3">
                    {['Visa', 'MC', 'JazzCash', 'EasyPaisa'].map((method) => (
                      <div
                        key={method}
                        className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold text-gray-600"
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
                  { icon: <Truck className="w-5 h-5" />, text: "Free shipping over Rs. 50" },
                  { icon: <Clock className="w-5 h-5" />, text: "Customer support 24/7" },
                ].map((feature, index) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 text-sm text-gray-600"
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

          {/* Back to Cart */}
          <div className="text-center mt-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}