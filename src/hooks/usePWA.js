import { useState, useEffect } from "react";

/* ================================================================
   usePWA Hook
   WHY: Centralizes all PWA-specific logic:
   - Install prompt (beforeinstallprompt event)
   - Online/offline detection
   - SW update detection
   ================================================================ */

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swUpdate, setSwUpdate] = useState(false);

  useEffect(() => {
    /* ---- Install Prompt ----
       Browser fires "beforeinstallprompt" when app meets PWA criteria.
       We prevent the default browser prompt and store the event
       so we can show our OWN custom install UI. */
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log("[PWA] Install prompt captured. You can show your custom install button now.");
    };

    /* ---- App Installed ----
       Fires when the user installs the app (from our prompt or browser's). */
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    /* ---- Online/Offline ---- */
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    /* ---- SW Update (fired from index.js) ---- */
    const handleSwUpdate = () => setSwUpdate(true);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("swUpdate", handleSwUpdate);

    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("swUpdate", handleSwUpdate);
    };
  }, []);

  // Trigger the native install dialog
  const promptInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setInstallPrompt(null);
  };

  // Force SW update
  const updateSW = () => {
    window.location.reload();
  };

  return {
    canInstall: !!installPrompt,
    isInstalled,
    isOnline,
    swUpdate,
    promptInstall,
    updateSW,
  };
}
