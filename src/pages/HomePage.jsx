import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import { ProductGridSkeleton } from "../components/ui/Skeleton";

const CATEGORIES = [
  { key: "electronics", label: "Electronics", icon: "⚡", color: "from-blue-900/30 to-obsidian-800/30" },
  { key: "jewelery", label: "Jewellery", icon: "💎", color: "from-purple-900/30 to-obsidian-800/30" },
  { key: "men's clothing", label: "Men's Fashion", icon: "👔", color: "from-emerald-900/30 to-obsidian-800/30" },
  { key: "women's clothing", label: "Women's Fashion", icon: "👗", color: "from-rose-900/30 to-obsidian-800/30" },
];

export default function HomePage() {
  const { products, loading } = useProducts();
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length) {
      // Highest rated products
      const sorted = [...products].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      setFeatured(sorted.slice(0, 8));
    }
  }, [products]);

  return (
    <div className="grain">
      {/* ---- HERO ---- */}
      <section className="relative py-37.5 md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs font-mono tracking-widest uppercase">Progressive Web App</span>
          </div>

          <h1
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-cream leading-none mb-6 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Discover
            <br />
            <span className="text-gradient italic">Luxury</span>
          </h1>

          <p
            className="text-obsidian-300 text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Curated products, stunning design, and a native app experience — all in your browser.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/products"
              className="bg-gold-500 text-obsidian-900 font-bold px-8 py-4 rounded-xl hover:bg-gold-400 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] text-sm tracking-wide"
            >
              Shop Now →
            </Link>
            <Link
              to="/products?category=electronics"
              className="border border-white/10 text-cream font-medium px-8 py-4 rounded-xl hover:border-gold-500/30 hover:bg-white/5 transition-all duration-200 text-sm"
            >
              Explore Electronics
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 max-w-xs mx-auto mt-20 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            {[
              { value: "20+", label: "Products" },
              { value: "4", label: "Categories" },
              { value: "PWA", label: "Offline Ready" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-mono text-gold-400 text-xl font-bold">{stat.value}</div>
                <div className="text-obsidian-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
          <span className="text-obsidian-500 text-xs font-mono">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-obsidian-500 to-transparent" />
        </div>
      </section>

      {/* ---- CATEGORIES ---- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl text-cream mb-4">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-obsidian-400 text-sm">Explore our curated collections</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.key)}`)}
              className={`group relative bg-gradient-to-br ${cat.color} rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-gold-500/20 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </span>
              <h3 className="text-cream font-semibold text-sm sm:text-base">{cat.label}</h3>
              <p className="text-obsidian-400 text-xs mt-1 group-hover:text-gold-400 transition-colors">
                Explore →
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ---- FEATURED PRODUCTS ---- */}
      <section className="py-10 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-gold-400 text-xs font-mono tracking-widest uppercase mb-2">Handpicked</p>
            <h2 className="font-display text-4xl sm:text-5xl text-cream">
              Top Rated
            </h2>
          </div>
          <Link
            to="/products"
            className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm font-medium hidden sm:block"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block border border-white/10 text-cream px-8 py-3 rounded-xl hover:border-gold-500/30 hover:bg-white/5 transition-all duration-200 text-sm font-medium"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* ---- PWA FEATURES BANNER ---- */}
      <section className="py-16 bg-obsidian-800/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "📶", title: "Works Offline", desc: "Service Worker caches your products" },
              { icon: "⚡", title: "Instant Loading", desc: "Assets cached for lightning speed" },
              { icon: "📱", title: "Install as App", desc: "Add to homescreen, no app store needed" },
              { icon: "🔔", title: "Push Notifications", desc: "Get notified of deals & updates" },
            ].map((feat) => (
              <div key={feat.title} className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{feat.icon}</span>
                <div>
                  <h4 className="text-cream font-semibold text-sm">{feat.title}</h4>
                  <p className="text-obsidian-400 text-xs mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
