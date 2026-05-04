import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setCheckedOut(true);
  };

  if (checkedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center animate-scale-in">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-4xl text-cream mb-3">Order Placed!</h2>
        <p className="text-obsidian-400 mb-8 text-sm max-w-xs">
          Thank you for your purchase. Your order is being processed.
        </p>
        <Link
          to="/products"
          className="bg-gold-500 text-obsidian-900 font-bold px-8 py-3 rounded-xl hover:bg-gold-400 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <span className="text-6xl mb-6 block animate-float">🛒</span>
        <h2 className="font-display text-4xl text-cream mb-3">Your cart is empty</h2>
        <p className="text-obsidian-400 text-sm mb-8">Start adding some amazing products!</p>
        <Link
          to="/products"
          className="bg-gold-500 text-obsidian-900 font-bold px-8 py-3 rounded-xl hover:bg-gold-400 transition-colors"
        >
          Shop Now →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="mb-10 animate-fade-up">
        <p className="text-gold-400 text-xs font-mono uppercase tracking-widest mb-2">{totalItems} Items</p>
        <h1 className="font-display text-4xl sm:text-5xl text-cream">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-obsidian-800/40 rounded-2xl p-4 border border-white/5 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <Link to={`/products/${item.id}`} className="flex-shrink-0">
                <div className="w-20 h-20 bg-obsidian-700/50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`}>
                  <h3 className="text-cream text-sm font-medium line-clamp-2 hover:text-gold-400 transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-gold-400 font-mono text-sm font-semibold mt-1">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Quantity + Remove */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 bg-obsidian-700 rounded-lg border border-white/10">
                  <button
                    onClick={() =>
                      item.quantity === 1
                        ? removeItem(item.id)
                        : updateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-2.5 py-1.5 text-obsidian-300 hover:text-cream transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="text-cream font-mono text-xs w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1.5 text-obsidian-300 hover:text-cream transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-obsidian-500 hover:text-red-400 transition-colors text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-obsidian-500 hover:text-red-400 transition-colors text-xs font-mono mt-2"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-obsidian-800/40 rounded-2xl p-6 border border-white/5 sticky top-24 animate-slide-left">
            <h3 className="text-cream font-semibold mb-6">Order Summary</h3>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-obsidian-400">Subtotal ({totalItems} items)</span>
                <span className="text-cream font-mono">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-400">Shipping</span>
                <span className="text-green-400 font-mono">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-400">Tax (10%)</span>
                <span className="text-cream font-mono">${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="h-px bg-white/10 mb-5" />

            <div className="flex justify-between text-lg mb-8">
              <span className="text-cream font-semibold">Total</span>
              <span className="text-gold-400 font-display font-bold">
                ${(totalPrice * 1.1).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gold-500 text-obsidian-900 font-bold py-4 rounded-xl hover:bg-gold-400 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.25)] text-sm"
            >
              Checkout — ${(totalPrice * 1.1).toFixed(2)}
            </button>

            <Link
              to="/products"
              className="block text-center text-obsidian-400 hover:text-gold-400 transition-colors text-xs mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
