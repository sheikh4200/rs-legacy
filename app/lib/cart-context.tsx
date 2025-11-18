// lib/cart-context.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Item Interface - Updated to use string for id
export interface CartItem {
  id: string; // Changed from number to string
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  originalPrice?: number;
  category?: string;
  currency:string
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;


}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Calculate totals helper function
function calculateTotals(items: CartItem[]): Omit<CartState, 'items'> {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    total: parseFloat(total.toFixed(2)),
    itemCount,
  };
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      }
      
      const newItem = { ...action.payload, quantity: 1 };
      const updatedItems = [...state.items, newItem];
      
      return {
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity === 0) {
        const updatedItems = state.items.filter(item => item.id !== id);
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        items: updatedItems,
        ...calculateTotals(updatedItems)
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return {
        items: action.payload,
        ...calculateTotals(action.payload)
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  updateShippingAddress: (address: { street: string; city: string; state: string; zip: string }) => void;
  
}

// FIX: Make sure CartContext is properly created
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      // If item exists, increase quantity
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // If new item, add with quantity 1
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: { ...product }
      });
    }
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.itemCount;
  };

  const getTotalPrice = () => {
    return state.total;
  };

  const isInCart = (id: string) => {
    return state.items.some(item => item.id === id);
  };

  const getItemQuantity = (id: string) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };
  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
   
  
    updateShippingAddress: (address: { street: string; city: string; state: string; zip: string }) => {
      try {
        localStorage.setItem('shippingAddress', JSON.stringify(address));
      } catch (error) {
        console.error('Failed to save shipping address to localStorage:', error);
      }
    },
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


  
  // FIX: Make sure useCart hook is properly exported
  export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  }


// "use client";

// import React, { createContext, useContext, useReducer, useEffect } from 'react';

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   originalPrice?: number;
//   category?: string;
//   quantity: number;
//   size?:string,
//   color? :string,
//   currency?: string
// }

// interface CartState {
//   items: CartItem[];
//   itemCount: number;
//   total: number;
// }

// interface CartAction {
//   type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_QUANTITY' | 'CLEAR_CART' | 'LOAD_CART';
//   payload?: any;
// }

// const initialState: CartState = {
//   items: [],
//   itemCount: 0,
//   total: 0,
// };

// const cartReducer = (state: CartState, action: CartAction): CartState => {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       const existingItem = state.items.find(item => item.id === action.payload.id);
//       let newItems: CartItem[];

//       if (existingItem) {
//         newItems = state.items.map(item =>
//           item.id === action.payload.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         newItems = [...state.items, { ...action.payload, quantity: 1 }];
//       }

//       const itemCount = newItems.reduce((total, item) => total + item.quantity, 0);
//       const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//       return {
//         items: newItems,
//         itemCount,
//         total,
//       };

//     case 'REMOVE_FROM_CART':
//       const filteredItems = state.items.filter(item => item.id !== action.payload);
//       const newItemCount = filteredItems.reduce((total, item) => total + item.quantity, 0);
//       const newTotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//       return {
//         items: filteredItems,
//         itemCount: newItemCount,
//         total: newTotal,
//       };

//     case 'UPDATE_QUANTITY':
//       const updatedItems = state.items.map(item =>
//         item.id === action.payload.id
//           ? { ...item, quantity: action.payload.quantity }
//           : item
//       ).filter(item => item.quantity > 0);

//       const updatedItemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
//       const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//       return {
//         items: updatedItems,
//         itemCount: updatedItemCount,
//         total: updatedTotal,
//       };

//     case 'CLEAR_CART':
//       return {
//         items: [],
//         itemCount: 0,
//         total: 0,
//       };

//     case 'LOAD_CART':
//       return {
//         items: action.payload.items || [],
//         itemCount: action.payload.itemCount || 0,
//         total: action.payload.total || 0,
//       };

//     default:
//       return state;
//   }
// };

// interface CartContextType {
//   state: CartState;
//   addToCart: (item: Omit<CartItem, 'quantity'>) => void;
//   removeFromCart: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       try {
//         const cartData = JSON.parse(savedCart);
//         dispatch({ type: 'LOAD_CART', payload: cartData });
//       } catch (error) {
//         console.error('Error loading cart from localStorage:', error);
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(state));
//   }, [state]);

//   const addToCart = (item: Omit<CartItem, 'quantity'>) => {
//     dispatch({ type: 'ADD_TO_CART', payload: item });
//   };

//   const removeFromCart = (id: string) => {
//     dispatch({ type: 'REMOVE_FROM_CART', payload: id });
//   };

//   const updateQuantity = (id: string, quantity: number) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: 'CLEAR_CART' });
//   };

//   return (
//     <CartContext.Provider value={{
//       state,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }

