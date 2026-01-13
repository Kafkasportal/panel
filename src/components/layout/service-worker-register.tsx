"use client";

import { useEffect } from "react";

/**
 * Service Worker Registration Component
 * 
 * Registers the service worker for PWA functionality.
 * Handles installation, updates, and offline support.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register in browser and production
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

          // Handle service worker updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available, prompt user to refresh
                  console.log("Yeni sürüm mevcut. Sayfayı yenileyin.");
                }
              });
            }
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour

          console.log("Service Worker kayıt edildi:", registration.scope);
        } catch (error) {
          console.error("Service Worker kayıt hatası:", error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return null;
}
