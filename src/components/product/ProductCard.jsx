import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inCart = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const stars = Math.round(product.rating?.rate || 4);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-obsidian-800/50 rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all duration-400 card-hover"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-obsidian-700/30 aspect-square">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-4xl text-obsidian-500">
            🛍️
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-obsidian-900/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <svg
            className={`w-4 h-4 transition-colors ${wishlisted ? "text-red-400 fill-current" : "text-obsidian-300"}`}
            fill={wishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-mono bg-obsidian-900/70 backdrop-blur-sm text-gold-400 px-2 py-1 rounded-md capitalize">
            {product.category?.split("'")[0]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-cream text-sm font-medium leading-snug line-clamp-2 mb-2 group-hover:text-gold-100 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < stars ? "text-gold-400" : "text-obsidian-600"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-obsidian-500 text-xs font-mono">
            ({product.rating?.count || 0})
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-gold-400 font-display text-lg font-semibold">
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
              added
                ? "bg-green-500/20 text-green-400 scale-95"
                : inCart
                ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20"
                : "bg-gold-500 text-obsidian-900 hover:bg-gold-400 hover:scale-105"
            }`}
          >
            {added ? "✓ Added" : inCart ? "In Cart" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
