/* ============================================================
   SERVICE WORKER — The Brain of Your PWA
   ============================================================
   WHY THIS FILE EXISTS:
   - Intercepts ALL network requests from your app
   - Caches assets so the app works offline
   - Enables background sync, push notifications
   - Runs in a separate thread (no DOM access)
   - Lives even after the tab/browser is closed
   ============================================================ */

/* ---- CACHE NAMES ---- */
// Versioning your cache names is critical:
// When you update the app, bump the version → old cache is deleted
const CACHE_NAME = "luxeshop-v1";
const STATIC_CACHE = "luxeshop-static-v1";
const DYNAMIC_CACHE = "luxeshop-dynamic-v1";
const API_CACHE = "luxeshop-api-v1";

/* ---- ASSETS TO PRE-CACHE ON INSTALL ---- */
// These are cached immediately when SW installs.
// Your app will load instantly even offline.
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/offline.html",
];

/* ---- API URLS TO CACHE ---- */
const API_URLS = ["https://fakestoreapi.com/products"];

/* ================================================================
   INSTALL EVENT
   - Fired once when service worker is first registered
   - Pre-cache all static assets here
   - Call skipWaiting() to activate immediately (don't wait for old SW)
   ================================================================ */
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker v1...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Pre-caching static assets");
        // addAll fetches and caches all URLs atomically
        // If one fails, the whole install fails (be careful what you list)
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn("[SW] Some assets failed to pre-cache:", err);
        });
      })
      .then(() => {
        // Skip the waiting phase — activate immediately
        // Without this, the new SW waits for old tabs to close
        return self.skipWaiting();
      })
  );
});

/* ================================================================
   ACTIVATE EVENT
   - Fired after install, when the SW takes control
   - Perfect place to delete OLD caches
   ================================================================ */
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker...");

  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !currentCaches.includes(name)) // find old caches
            .map((name) => {
              console.log("[SW] Deleting old cache:", name);
              return caches.delete(name); // delete them
            })
        );
      })
      .then(() => {
        // Take control of all open tabs immediately
        // Without this, existing tabs still use the old SW
        return self.clients.claim();
      })
  );
});

/* ================================================================
   FETCH EVENT
   - Fired for EVERY network request made by your app
   - This is where caching strategies are implemented
   ================================================================ */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, DELETE go straight to network)
  if (request.method !== "GET") return;

  // Skip Chrome extension requests
  if (url.protocol === "chrome-extension:") return;

  /* ---- STRATEGY 1: Cache First (for static assets) ----
     Check cache → if found, return it. Otherwise fetch from network.
     Best for: CSS, JS, fonts, images that rarely change */
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  /* ---- STRATEGY 2: Network First with Cache Fallback (for API) ----
     Try network first → if fails, serve from cache.
     Best for: API data that should be fresh but can work offline */
  if (url.hostname === "fakestoreapi.com") {
    event.respondWith(networkFirstWithCache(request, API_CACHE));
    return;
  }

  /* ---- STRATEGY 3: Stale While Revalidate (for HTML pages) ----
     Serve from cache immediately, then update cache in background.
     Best for: HTML pages, frequently changing but non-critical data */
  if (request.destination === "document") {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Default: Network first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

/* ================================================================
   CACHING STRATEGY IMPLEMENTATIONS
   ================================================================ */

// Strategy: Cache First
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response("Offline - resource not cached", { status: 503 });
  }
}

// Strategy: Network First with Cache Fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()); // update cache
    }
    return response;
  } catch (err) {
    // Network failed — try cache
    const cached = await caches.match(request);
    if (cached) {
      console.log("[SW] Serving from cache (offline):", request.url);
      return cached;
    }
    return new Response(JSON.stringify({ error: "Offline, no cache available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Strategy: Network First (no special caching)
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match("/offline.html");
  }
}

// Strategy: Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  // Return cached immediately (stale), or wait for network
  return cached || fetchPromise;
}

/* ================================================================
   PUSH NOTIFICATIONS (optional — shows how it works)
   ================================================================ */
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "LuxeShop";
  const options = {
    body: data.body || "New deal available!",
    icon: "/logo192.png",
    badge: "/logo192.png",
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});

/* ================================================================
   BACKGROUND SYNC (optional — shows pattern)
   ================================================================ */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-cart") {
    console.log("[SW] Background sync: syncing cart data...");
    // Here you'd read from IndexedDB and POST to your server
  }
});
