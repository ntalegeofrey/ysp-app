"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../components/loading";
import { logoUrl } from "../utils/logo";
import { abbreviateTitle } from "../utils/titleAbbrev";

function AppBar() {
  const [displayName, setDisplayName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Try localStorage first
        const cached = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (cached) {
          try {
            const obj = JSON.parse(cached);
            if (!cancelled) {
              setDisplayName(obj?.fullName || obj?.name || obj?.email || "");
              setJobTitle(obj?.jobTitle || obj?.position || "");
            }
          } catch {}
        }
        // Fetch authoritative user profile
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/auth/me', { credentials: 'include', headers: { 'Accept': 'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (res.ok) {
          const me = await res.json();
          if (!cancelled) {
            const name = me?.fullName || me?.name || me?.email || displayName;
            const jt = me?.jobTitle || me?.position || jobTitle;
            setDisplayName(name || "");
            setJobTitle(jt || "");
            try { localStorage.setItem('user', JSON.stringify(me)); } catch {}
          }
        }
      } catch {}
    };
    load();
    return () => { cancelled = true; };
  }, []);
  const onLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedProgram');
      localStorage.setItem('logout', String(Date.now()));
      window.location.href = '/signin-required';
    } catch {
      window.location.href = '/signin-required';
    }
  };
  return (
    <header className="bg-white border-b border-bd px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <img src={logoUrl} alt="DYS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-primary">DYS • Mass</div>
            <h2 className="text-sm sm:text-base font-semibold text-font-heading">System Admin</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-2 rounded-lg hover:bg-bg-subtle transition-colors" title="Notifications">
            <i className="fa-solid fa-bell text-lg sm:text-xl text-font-base"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-bg-subtle transition-colors" title="Settings">
            <i className="fa-solid fa-gear text-lg sm:text-xl text-font-base"></i>
          </button>
          <div className="flex items-center gap-2 pl-2">
            <button className="p-2 rounded-lg hover:bg-bg-subtle transition-colors" title="Account">
              <i className="fa-solid fa-circle-user text-xl text-font-base"></i>
            </button>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-medium text-font-base">{displayName || 'Authenticated User'}</div>
              <div className="text-xs text-font-detail">{abbreviateTitle(jobTitle || 'Staff')}</div>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 rounded-lg hover:bg-bg-subtle transition-colors" title="Logout">
            <i className="fa-solid fa-right-from-bracket text-lg sm:text-xl text-font-base"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AdminOperationsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'logout') router.replace('/signin-required');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const url = `/api/permissions/check?module=${encodeURIComponent('System Admin')}`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) {
          if (!cancelled) {
            router.replace('/access-denied');
            setAllowed(false);
          }
          return;
        }
        const data = await res.json();
        const access = (data?.access || '').toUpperCase();
        const isFull = access === 'FULL';
        if (!cancelled) {
          if (isFull) {
            setAllowed(true);
          } else {
            router.replace('/access-denied');
            setAllowed(false);
          }
        }
      } catch (e) {
        if (!cancelled) {
          router.replace('/access-denied');
          setAllowed(false);
        }
      }
    };
    check();
    return () => { cancelled = true; };
  }, [router]);

  if (allowed === false) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Suspense fallback={<Loading /> }>
        <AppBar />
      </Suspense>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
