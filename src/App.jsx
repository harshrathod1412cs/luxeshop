import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PWABanner from "./components/ui/PWABanner";

/*
  ✅ Code Splitting with React.lazy
  - Each page is loaded only when the route is visited
  - Reduces initial bundle size significantly
  - Webpack automatically creates separate chunks
*/
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading fallback shown during lazy load
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-gold-400 text-3xl animate-spin-slow">✦</span>
        <p className="text-obsidian-500 text-xs font-mono">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    /*
      ✅ Provider Composition Pattern:
      - BrowserRouter: enables React Router
      - CartProvider: global cart state
      - WishlistProvider: global wishlist state
    */
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-obsidian-950 flex flex-col">
            <Navbar />

            <main className="flex-1">
              {/* Suspense wraps lazy-loaded routes */}
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />

            {/* PWA Install prompt + offline indicator */}
            <PWABanner />
          </div>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
