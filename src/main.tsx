import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    registerSW({
      immediate: true,
      onRegisteredSW(_swUrl, registration) {
        if (registration) {
          registration.update().catch(() => {
            // Ignore silent offline update checks
          });
        }
      },
      onRegisterError() {
        // Non-fatal in restricted/sandboxed preview frames
      },
    });
  } else {
    // Flush any previously registered dev/old service workers + workbox caches immediately
    navigator.serviceWorker
      .getRegistrations()
      .then(async (regs) => {
        if (regs.length === 0) return;
        await Promise.all(regs.map((r) => r.unregister()));
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys.filter((k) => k.includes('workbox') || k.includes('precache')).map((k) => caches.delete(k)),
          );
        }
        try {
          if (!sessionStorage.getItem('sw_flushed_dev')) {
            sessionStorage.setItem('sw_flushed_dev', '1');
            window.location.reload();
          }
        } catch {
          // Ignore storage restrictions
        }
      })
      .catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(<App />);
