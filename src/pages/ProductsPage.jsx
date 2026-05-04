import React, { useState,  useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import { ProductGridSkeleton } from "../components/ui/Skeleton";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const searchQuery = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "all";

  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    params.delete("search");
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory && activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)); break;
      case "name": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sort, priceRange]);

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-gold-400 text-xs font-mono tracking-widest uppercase mb-2">
          {filteredProducts.length} Products
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-cream">
          {searchQuery ? (
            <>Search: <span className="text-gradient italic">"{searchQuery}"</span></>
          ) : activeCategory && activeCategory !== "all" ? (
            <span className="capitalize">{activeCategory}</span>
          ) : (
            <>All <span className="text-gradient">Products</span></>
          )}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ---- Sidebar Filters ---- */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-obsidian-800/40 rounded-2xl p-5 border border-white/5 sticky top-24">
            <h3 className="text-cream font-semibold text-sm uppercase tracking-widest mb-5">Filters</h3>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-obsidian-400 text-xs uppercase tracking-wider mb-3">Category</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setCategory("all")}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                    activeCategory === "all"
                      ? "bg-gold-500/10 text-gold-400"
                      : "text-obsidian-300 hover:text-cream hover:bg-white/5"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                      activeCategory === cat
                        ? "bg-gold-500/10 text-gold-400"
                        : "text-obsidian-300 hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <p className="text-obsidian-400 text-xs uppercase tracking-wider mb-3">Sort By</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-obsidian-700 border border-white/10 text-cream text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500/50"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-obsidian-400 text-xs uppercase tracking-wider mb-3">
                Max Price: <span className="text-gold-400 font-mono">${priceRange[1]}</span>
              </p>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-gold-500 cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* ---- Product Grid ---- */}
        <div className="flex-1 min-w-0">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 text-sm">{error}</p>
              <p className="text-obsidian-400 text-xs mt-1">Check your connection — cached data may be available</p>
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-cream font-display text-2xl mb-2">No products found</h3>
              <p className="text-obsidian-400 text-sm">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
