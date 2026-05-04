import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


/*
  ✅ PWA KEY STEP: Register the Service Worker
  - "register" = enable offline support, caching, push notifications
  - "unregister" = disable PWA features (use during development if needed)

  The callbacks let you notify users about updates:
*/
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // New SW is ready — prompt user to refresh
    const event = new CustomEvent("swUpdate", { detail: registration });
    window.dispatchEvent(event);
  },
  onSuccess: (registration) => {
    console.log("[PWA] App ready for offline use! SW registered.");
  },
});
