import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import ProductCard from "../components/product/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { products } = useProducts();
  const { addItem, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const stars = Math.round(product?.rating?.rate || 4);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24">
        <span className="text-5xl">😕</span>
        <h2 className="text-cream font-display text-2xl">Product not found</h2>
        <Link to="/products" className="text-gold-400 hover:text-gold-300 text-sm">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-obsidian-500 mb-10 font-mono">
        <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gold-400 transition-colors">Shop</Link>
        {product && (
          <>
            <span>/</span>
            <span className="text-obsidian-400 capitalize">{product.category}</span>
          </>
        )}
      </div>

      {loading ? (
        <ProductDetailSkeleton />
      ) : product ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 animate-fade-in">
            {/* Image */}
            <div className="bg-obsidian-800/40 rounded-2xl p-8 sm:p-12 border border-white/5 flex items-center justify-center aspect-square relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/3 to-transparent" />
              {imgError ? (
                <span className="text-6xl">🛍️</span>
              ) : (
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain w-full h-full transition-transform duration-700 hover:scale-105"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center animate-slide-left">
              <span className="text-gold-400 text-xs font-mono uppercase tracking-widest mb-3 capitalize">
                {product.category}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl text-cream leading-tight mb-5">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < stars ? "text-gold-400" : "text-obsidian-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-obsidian-400 text-sm font-mono">
                  {product.rating?.rate} ({product.rating?.count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-display font-bold text-gradient mb-6">
                ${product.price?.toFixed(2)}
              </div>

              {/* Description */}
              <p className="text-obsidian-300 text-sm leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-obsidian-400 text-sm">Quantity</span>
                <div className="flex items-center gap-2 bg-obsidian-800 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-obsidian-300 hover:text-cream hover:bg-white/5 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-cream font-mono text-sm w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-4 py-2 text-obsidian-300 hover:text-cream hover:bg-white/5 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    added
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gold-500 text-obsidian-900 hover:bg-gold-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.25)]"
                  }`}
                >
                  {added ? "✓ Added to Cart!" : isInCart(product.id) ? "Add More to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-14 h-14 rounded-xl border transition-all duration-200 flex items-center justify-center hover:scale-105 ${
                    isWishlisted(product.id)
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-white/10 text-obsidian-300 hover:border-white/20 hover:text-cream"
                  }`}
                  aria-label="Wishlist"
                >
                  <svg
                    className="w-5 h-5"
                    fill={isWishlisted(product.id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-6 flex-wrap">
                {["Free Shipping", "30-day Returns", "Secure Payment"].map((tag) => (
                  <span key={tag} className="text-xs font-mono bg-obsidian-800 border border-white/5 text-obsidian-400 px-3 py-1 rounded-full">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-24">
              <h2 className="font-display text-3xl text-cream mb-8">
                Related <span className="text-gradient">Products</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
