/* ================================================================
   SERVICE WORKER REGISTRATION
   WHY: React's built-in registerServiceWorker was removed.
   This file manually handles SW registration and updates.
   ================================================================ */

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  // PWA only works in production OR on localhost
  if ("serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener("load", () => {
      const swUrl = `/service-worker.js`;

      if (isLocalhost) {
        // On localhost: check if SW still exists
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log("[PWA] Running with service worker (localhost).");
        });
      } else {
        // On production: just register
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Listen for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New content is available — notify user
              console.log("[PWA] New content available! Refresh to update.");
              if (config && config.onUpdate) config.onUpdate(registration);
            } else {
              // Content is cached for offline use
              console.log("[PWA] Content cached for offline use.");
              if (config && config.onSuccess) config.onSuccess(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("[PWA] Service Worker registration failed:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { "Service-Worker": "script" } })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (response.status === 404 || (contentType && !contentType.includes("javascript"))) {
        // SW not found — reload
        navigator.serviceWorker.ready.then((reg) => reg.unregister()).then(() => window.location.reload());
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => console.log("[PWA] No internet. Running in offline mode."));
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((err) => console.error(err.message));
  }
}
