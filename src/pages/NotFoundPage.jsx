import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
      <p className="font-mono text-gold-400 text-8xl font-bold mb-4 animate-float">404</p>
      <h1 className="font-display text-4xl text-cream mb-4">Page Not Found</h1>
      <p className="text-obsidian-400 text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-gold-500 text-obsidian-900 font-bold px-8 py-3 rounded-xl hover:bg-gold-400 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
