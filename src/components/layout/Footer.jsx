import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24 bg-obsidian-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-gold-400 text-2xl">✦</span>
              <span className="font-display text-xl font-bold text-cream">
                Luxe<span className="text-gold-400">Shop</span>
              </span>
            </Link>
            <p className="text-obsidian-400 text-sm leading-relaxed max-w-xs">
              Premium curated products, delivered with care. A PWA-powered shopping experience that works even offline.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-obsidian-400 font-mono">PWA — Works Offline</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-cream font-semibold text-sm uppercase tracking-widest mb-5">Shop</h4>
            <div className="flex flex-col gap-3">
              {["All Products", "Electronics", "Jewellery", "Men's Clothing", "Women's Clothing"].map((l) => (
                <Link key={l} to="/products" className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-cream font-semibold text-sm uppercase tracking-widest mb-5">Learn</h4>
            <div className="flex flex-col gap-3">
              {["About PWA", "Service Workers", "Offline Mode", "Install Guide", "Cart & Wishlist"].map((l) => (
                <span key={l} className="text-obsidian-400 text-sm cursor-default hover:text-gold-400 transition-colors">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-obsidian-500 text-xs font-mono">
            © 2025 LuxeShop • Built with React + PWA
          </p>
          <p className="text-obsidian-600 text-xs">
            Powered by{" "}
            <a href="https://fakestoreapi.com" className="text-gold-600 hover:text-gold-400 transition-colors" target="_blank" rel="noopener noreferrer">
              FakeStore API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
