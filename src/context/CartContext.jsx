import React, { createContext, useContext, useReducer, useEffect } from "react";

/* ================================================================
   CART CONTEXT
   - Global cart state using React Context + useReducer
   - Persists to localStorage so cart survives page refresh
   - This is the standard pattern for simple global state
   ================================================================ */

const CartContext = createContext(null);

// Cart reducer — handles all cart state transitions
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // Hydrate from localStorage on mount
    try {
      const saved = localStorage.getItem("luxeshop-cart");
      return saved ? { items: JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("luxeshop-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const isInCart = (id) => state.items.some((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
