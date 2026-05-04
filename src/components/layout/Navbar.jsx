import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/products?category=electronics", label: "Electronics" },
    { to: "/products?category=jewelery", label: "Jewellery" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian-900/95 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-gold-400 text-2xl group-hover:rotate-12 transition-transform duration-300">✦</span>
            <span className="font-display text-xl font-bold tracking-wide text-cream">
              Luxe<span className="text-gold-400">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold-400 ${
                  location.pathname === link.to
                    ? "text-gold-400"
                    : "text-obsidian-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-obsidian-300 hover:text-gold-400 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-obsidian-300 hover:text-gold-400 transition-colors"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-mono">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-obsidian-300 hover:text-gold-400 transition-colors"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-obsidian-900 text-xs rounded-full flex items-center justify-center font-mono font-bold pulse-gold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-obsidian-300 hover:text-gold-400"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 pb-4 pt-2">
            <div className="relative">
              <input
                autoFocus={searchOpen}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-obsidian-800 border border-white/10 rounded-xl px-5 py-3 text-cream placeholder-obsidian-400 focus:outline-none focus:border-gold-500/50 transition-colors font-body text-sm"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-99 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-obsidian-900 border-l border-white/5 p-8 pt-24 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display text-2xl text-cream hover:text-gold-400 transition-colors"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link to="/wishlist" className="text-obsidian-300 hover:text-gold-400 transition-colors font-body">
              Wishlist ({wishlist.length})
            </Link>
            <Link to="/cart" className="text-obsidian-300 hover:text-gold-400 transition-colors font-body">
              Cart ({totalItems})
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
