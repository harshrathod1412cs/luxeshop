import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/product/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <span className="text-6xl mb-6 block animate-float">🤍</span>
        <h2 className="font-display text-4xl text-cream mb-3">Wishlist is empty</h2>
        <p className="text-obsidian-400 text-sm mb-8">Save items you love by tapping the heart icon.</p>
        <Link
          to="/products"
          className="bg-gold-500 text-obsidian-900 font-bold px-8 py-3 rounded-xl hover:bg-gold-400 transition-colors"
        >
          Discover Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-10 animate-fade-up">
        <p className="text-gold-400 text-xs font-mono uppercase tracking-widest mb-2">
          {wishlist.length} saved items
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-cream">
          Your <span className="text-gradient">Wishlist</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
