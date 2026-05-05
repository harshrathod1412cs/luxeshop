import React, { useState } from "react";
import { usePWA } from "../../hooks/usePWA";

export default function PWABanner() {
  const { canInstall, isOnline, swUpdate, promptInstall, updateSW } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {/* ---- Offline Badge ---- */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-obsidian-800 border border-white/10 rounded-full px-4 py-2 shadow-2xl pwa-banner">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-xs text-obsidian-200 font-mono">Offline — Using cached data</span>
        </div>
      )}

      {/* ---- SW Update Banner ---- */}
      {swUpdate && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-obsidian-800 border border-gold-500/30 rounded-2xl px-6 py-4 shadow-2xl pwa-banner flex items-center gap-4 max-w-sm w-[calc(100vw-2rem)]">
          <span className="text-gold-400 text-lg">🔄</span>
          <div className="flex-1">
            <p className="text-cream text-sm font-semibold">Update Available</p>
            <p className="text-obsidian-400 text-xs">A new version of the app is ready.</p>
          </div>
          <button
            onClick={updateSW}
            className="bg-gold-500 cursor-pointer text-obsidian-900 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gold-400 transition-colors"
          >
            Update
          </button>
        </div>
      )}

      {/* ---- Install PWA Banner ---- */}
      {canInstall && !dismissed && (
        <div className="fixed bottom-4 right-4 z-50 bg-obsidian-800 border border-gold-500/20 rounded-2xl p-4 shadow-2xl pwa-banner max-w-xs w-[calc(100vw-2rem)] sm:w-80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-gold-400 text-lg">✦</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream text-sm font-semibold font-display">Install LuxeShop</p>
              <p className="text-obsidian-400 text-xs mt-0.5 leading-relaxed">
                Add to your home screen for a native app experience — works offline too!
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={promptInstall}
                  className="flex-1 cursor-pointer bg-gold-500 text-obsidian-900 text-xs font-bold py-1.5 rounded-lg hover:bg-gold-400 transition-colors"
                >
                  Install App
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="px-3 cursor-pointer text-obsidian-400 hover:text-obsidian-200 text-xs transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
