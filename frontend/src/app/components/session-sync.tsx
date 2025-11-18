"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionSync() {
  const router = useRouter();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'logout') {
        try { localStorage.removeItem('token'); } catch {}
        // Use hard redirect to ensure all state is cleared
        window.location.replace('http://147.93.191.183/signin-required');
      }
    };
    window.addEventListener('storage', onStorage);

    const SIGNIN_URL = 'http://147.93.191.183/signin-required';

    // Centralized redirect that also syncs other tabs
    const forceLogout = () => {
      try { localStorage.removeItem('token'); } catch {}
      try { localStorage.setItem('logout', String(Date.now())); } catch {}
      // Hard redirect to external sign-in-required page
      window.location.replace(SIGNIN_URL);
    };

    // Wrap window.fetch to catch 401/403 anywhere in the app
    const originalFetch = window.fetch.bind(window);
    const wrappedFetch: typeof window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const res = await originalFetch(input as any, init);
        if (res && (res.status === 401 || res.status === 403)) {
          forceLogout();
        }
        return res;
      } catch (err) {
        // Network errors shouldn't log users out automatically
        return Promise.reject(err);
      }
    };
    (window as any).fetch = wrappedFetch;

    // Periodic heartbeat to detect silent expiry (when user is active)
    const checkSession = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const r = await originalFetch('/auth/me', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!r.ok) {
          if (r.status === 401 || r.status === 403) {
            forceLogout();
          }
        }
      } catch {
        // ignore transient failures
      }
    };

    // Idle detection (10 minutes)
    const IDLE_LIMIT_MS = 10 * 60 * 1000;
    let lastActivity = Date.now();
    const markActive = () => { lastActivity = Date.now(); };
    ['click','keydown','mousemove','scroll','touchstart','touchmove','pointerdown','wheel'].forEach(evt => {
      window.addEventListener(evt, markActive, { passive: true });
    });

    // Check every 30s for idle timeout and also perform heartbeat when user is active
    const tick = () => {
      const idleFor = Date.now() - lastActivity;
      if (idleFor >= IDLE_LIMIT_MS) {
        forceLogout();
        return; // stop further checks after logout redirect
      }
      // Only check session when user is active in the last minute
      if (idleFor < 60_000) {
        checkSession();
      }
    };
    // Run immediately then schedule
    tick();
    const intervalId = setInterval(tick, 30_000);

    // Re-check when tab becomes visible
    const onVisibility = () => { if (document.visibilityState === 'visible') checkSession(); };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
      ['click','keydown','mousemove','scroll','touchstart','touchmove','pointerdown','wheel'].forEach(evt => {
        window.removeEventListener(evt, markActive as any);
      });
    };
  }, [router]);

  return null;
}
