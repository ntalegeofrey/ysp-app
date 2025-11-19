'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoUrl } from '../utils/logo';
import { abbreviateTitle } from '../utils/titleAbbrev';

type Program = {
  id?: number;
  name: string;
  subtitle?: string;
  location?: string;
  capacity?: string | number;
  hours?: string;
  icon?: string; // fontawesome class
  color?: string; // bg color class
  disabled?: boolean;
  status?: { label: string; color: string; icon?: string };
};

export default function ProgramSelectionPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [ready, setReady] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [canManagePrograms, setCanManagePrograms] = useState<boolean>(false);
  const [canCreateEditPrograms, setCanCreateEditPrograms] = useState<boolean>(false);
  // local toast notifications
  type Toast = { id: string; title: string; tone?: 'success' | 'error' | 'info' };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (title: string, tone?: 'success' | 'error' | 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, title, tone }]);
    try { localStorage.setItem('global-toast', JSON.stringify({ title, tone })); } catch {}
    setTimeout(() => removeToast(id), 5000);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter(t => t.id !== id));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!raw || !token) {
          router.push('/');
          return;
        }
        const u = JSON.parse(raw);
        setRole(u.role || '');
        setDisplayName(u.fullName || u.email?.split('@')[0] || '');
        setJobTitle(u.jobTitle || '');
        setReady(true);
        // Try to hydrate from cache immediately
        try {
          const cacheKey = ((u.role || '').toString().trim().toLowerCase() === 'admin' || (u.role || '').toString().trim().toLowerCase() === 'administrator') ? 'programs_cache_all' : 'programs_cache_public';
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed?.items)) {
              setPrograms(parsed.items as Program[]);
              setLoading(false);
            }
          }
        } catch {}
      } catch {}
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, [router]);

  // Hydrate any pending global toast (e.g. from dashboard redirect when user is not attached to a program)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('global-toast') : null;
      if (raw) {
        const payload = JSON.parse(raw) as { title?: string; tone?: 'success' | 'error' | 'info' };
        if (payload?.title) {
          addToast(payload.title, payload.tone);
        }
        try { localStorage.removeItem('global-toast'); } catch {}
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'logout') {
        router.replace('/signin-required');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    const loadPrograms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        // Probe admin capability by attempting /programs; fallback to /programs/my
        let data: any[] = [];
        let manage = false;
        const tryAdmin = await fetch('/api/programs', { credentials: 'include', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (tryAdmin.ok) {
          manage = true;
          data = await tryAdmin.json();
        } else {
          const pub = await fetch('/api/programs/public', { credentials: 'include', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
          if (!pub.ok) return;
          data = await pub.json();
        }
        if (cancelled) return;
        setCanManagePrograms(manage);
        const typeLabel = (t?: string, other?: string) => {
          switch ((t || '').toString()) {
            case 'detention': return 'Detention Program';
            case 'treatment': return 'Treatment Program';
            case 'assessment': return 'Assessment Program';
            case 'revocation': return 'Revocation Program';
            case 'community': return 'Community Program';
            case 'independent-living': return 'Independent Living Program';
            case 'day-reporting': return 'Day Reporting Program';
            case 'transition': return 'Transition Program';
            case 'short-term-treatment': return 'Short-Term Treatment Program';
            case 'long-term-treatment': return 'Long-Term Treatment Program';
            case 'hardware-secure': return 'Hardware Secure Program';
            case 'staff-secure': return 'Staff Secure Program';
            case 'group-home': return 'Group Home Program';
            case 'diversion': return 'Diversion Program';
            case 'female': return 'Female Program';
            case 'specialized-treatment': return 'Specialized Treatment Program';
            case 'education-vocational': return 'Education/Vocational Program';
            case 'other': return other || 'Other';
            default: return t || '';
          }
        };
        const typeIcon = (t?: string) => {
          switch ((t || '').toString()) {
            case 'detention': return { icon: 'fa-shield-halved', color: 'bg-primary' };
            case 'treatment': return { icon: 'fa-hands-holding-heart', color: 'bg-highlight' };
            case 'assessment': return { icon: 'fa-clipboard-check', color: 'bg-primary-alt' };
            case 'revocation': return { icon: 'fa-rotate-left', color: 'bg-primary' };
            case 'community': return { icon: 'fa-people-group', color: 'bg-primary-alt' };
            case 'independent-living': return { icon: 'fa-house-chimney', color: 'bg-primary' };
            case 'day-reporting': return { icon: 'fa-sun', color: 'bg-primary' };
            case 'transition': return { icon: 'fa-road', color: 'bg-primary' };
            case 'short-term-treatment': return { icon: 'fa-clock', color: 'bg-primary' };
            case 'long-term-treatment': return { icon: 'fa-hourglass-half', color: 'bg-primary-alt-dark' };
            case 'hardware-secure': return { icon: 'fa-lock', color: 'bg-primary' };
            case 'staff-secure': return { icon: 'fa-user-shield', color: 'bg-primary' };
            case 'group-home': return { icon: 'fa-home', color: 'bg-primary-alt' };
            case 'diversion': return { icon: 'fa-route', color: 'bg-primary' };
            case 'female': return { icon: 'fa-venus', color: 'bg-highlight' };
            case 'specialized-treatment': return { icon: 'fa-stethoscope', color: 'bg-primary-alt' };
            case 'education-vocational': return { icon: 'fa-graduation-cap', color: 'bg-highlight' };
            case 'other': return { icon: 'fa-layer-group', color: 'bg-primary' };
            default: return { icon: 'fa-building', color: 'bg-primary' };
          }
        };
        const hoursLabel = (h?: string, custom?: string) => {
          switch ((h || '').toString()) {
            case '24-7': return '24/7 Operations';
            case 'day': return 'Day Program (8 AM - 4 PM)';
            case 'school': return 'School Hours (7 AM - 3 PM)';
            case 'evening': return 'Evening Program (4 PM - 10 PM)';
            case 'custom': return custom ? `Custom: ${custom}` : 'Custom Schedule';
            default: return h || '';
          }
        };
        const mapped: Program[] = (Array.isArray(data) ? data : []).map((p: any) => {
          const ti = typeIcon(p.programType);
          return {
            id: p.id,
            name: p.name,
            subtitle: typeLabel(p.programType, p.programTypeOther),
            location: [p.city, p.state].filter(Boolean).join(', '),
            capacity: p.capacity ? `Capacity: ${p.capacity}` : undefined,
            hours: hoursLabel(p.operatingHours, p.customSchedule),
            icon: ti.icon,
            color: ti.color,
            disabled: p.status && String(p.status).toLowerCase() === 'maintenance' ? true : false,
            status: { label: (p.status ? String(p.status) : (p.active === false ? 'Inactive' : 'Active')).toString().replace(/\b\w/g, (l: string) => l.toUpperCase()), color: (p.active === false || (p.status && String(p.status).toLowerCase() === 'inactive')) ? 'bg-gray-400' : 'bg-success' }
          };
        });
        setPrograms(mapped);
        setLoading(false);
        // Save to cache for instant next load
        try {
          const cacheKey = manage ? 'programs_cache_all' : 'programs_cache_public';
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), items: mapped }));
        } catch {}
      } catch {}
    };
    if (ready) loadPrograms();
    return () => { cancelled = true; };
  }, [ready, role]);

  // Check operation permission for creating/editing programs
  useEffect(() => {
    let cancelled = false;
    const checkOp = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/permissions/check?module=${encodeURIComponent('op.CREATE_PROGRAM')}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setCanCreateEditPrograms(Boolean(data?.allowed));
        }
      } catch {}
    };
    if (ready) checkOp();
    return () => { cancelled = true; };
  }, [ready, role]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return programs.filter(p => (p.name || '').toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q));
  }, [search, programs]);

  const SkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-bd rounded-xl p-5 bg-white animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bg-subtle" />
              <div>
                <div className="h-4 w-40 bg-bg-subtle rounded mb-2" />
                <div className="h-3 w-24 bg-bg-subtle rounded" />
              </div>
            </div>
            <div className="h-4 w-6 bg-bg-subtle rounded" />
          </div>
          <div className="h-3 w-48 bg-bg-subtle rounded mb-2" />
          <div className="h-3 w-32 bg-bg-subtle rounded" />
        </div>
      ))}
    </div>
  );

  const onSelect = async (p: Program) => {
    if (p.disabled) return;
    const r = (role || '').toString().trim().toLowerCase();
    const isAdmin = r === 'admin' || r === 'administrator';
    // If not admin, verify access by checking membership list
    if (!isAdmin && p.id) {
      try {
        const token = localStorage.getItem('token') || '';
        const resp = await fetch('/api/programs/my', { credentials: 'include', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (resp.ok) {
          const mine = await resp.json();
          const allowed = Array.isArray(mine) && mine.some((x: any) => String(x.id) === String(p.id));
          if (!allowed) {
            addToast('You are not attached to this program. Please contact the Program Director.', 'error');
            return;
          }
        }
      } catch {}
    }
    localStorage.setItem('selectedProgram', JSON.stringify({ id: p.id, name: p.name, location: p.location }));
    router.push('/dashboard');
  };

  if (!ready) return null;
  const isAdmin = (role || '').toString().trim().toLowerCase() === 'admin' || (role || '').toString().trim().toLowerCase() === 'administrator';
  const shortTitle = abbreviateTitle(jobTitle || ((canCreateEditPrograms || canManagePrograms || isAdmin) ? 'Administrator' : 'Staff'));
  return (
    <div id="program-selection-container" className="min-h-screen hero-pattern">
      <header id="header" className="bg-white shadow-sm border-b border-bd">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logoUrl} alt="DYS Logo" className="w-14 h-14 mr-4 rounded-full object-contain" />
              <div>
                <h1 className="text-xl font-bold text-primary">Commonwealth of Massachusetts</h1>
                <p className="text-sm text-font-detail">Department of Youth Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-font-base">Welcome, {displayName || 'Authenticated User'}</p>
                <p className="text-xs text-font-detail">{shortTitle}</p>
              </div>
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-lighter" />
              <button className="text-font-detail hover:text-primary ml-4" onClick={() => { try { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('selectedProgram'); localStorage.setItem('logout', String(Date.now())); } catch {}; router.push('/signin-required'); }}>
                <i className="fa-solid fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        <div id="welcome-section" className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-4xl font-bold text-font-base">Select Your Program</h2>
            {(canCreateEditPrograms || canManagePrograms) && (
              <button id="create-program-btn" className="ml-6 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center" onClick={() => router.push('/program-selection/create')}>
                <i className="fa-solid fa-plus mr-2"></i>
                Create New Program
              </button>
            )}
          </div>
          <p className="text-lg text-font-detail max-w-3xl mx-auto">
            Choose the facility or program you're working with today. Each program has its own dedicated Youth Supervisory Platform with specialized tools and modules.
          </p>
        </div>

        <div id="search-filter" className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-font-detail"></i>
              <input
                type="text"
                placeholder="Search programs by name or location..."
                className="w-full pl-10 pr-4 py-3 border border-bd rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div id="programs-grid" className="min-h-[280px]">
          {loading ? (
            <SkeletonCards />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <div key={(p.id ? String(p.id) : p.name)} className={`program-card bg-white rounded-xl shadow-md border border-bd p-6 cursor-pointer ${p.disabled ? 'opacity-75' : ''}`} onClick={() => onSelect(p)}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${p.color || 'bg-primary'} rounded-lg flex items-center justify-center mr-4`}>
                      <i className={`fa-solid ${p.icon || 'fa-building'} text-white`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-font-base">{p.name}</h3>
                      <p className="text-sm text-font-detail">{p.subtitle || ''}</p>
                    </div>
                    {(canCreateEditPrograms) && (
                  <button
                    title="Edit program"
                    className="ml-auto text-primary hover:text-primary-light p-2"
                    onClick={(e) => { e.stopPropagation(); router.push(`/program-selection/create?id=${p.id ?? ''}`); }}
                  >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-font-detail">
                      <i className="fa-solid fa-map-marker-alt w-4 mr-2 text-primary"></i>
                      <span>{p.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-font-detail">
                      <i className="fa-solid fa-users w-4 mr-2 text-primary"></i>
                      <span>{typeof p.capacity === 'number' ? `Capacity: ${p.capacity}` : (p.capacity || '')}</span>
                    </div>
                    <div className="flex items-center text-sm text-font-detail">
                      <i className="fa-solid fa-clock w-4 mr-2 text-primary"></i>
                      <span>{p.hours}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${p.status?.color || 'bg-success'} text-white px-3 py-1 rounded-full text-xs font-medium`}>{p.status?.label || 'Active'}</span>
                    {p.disabled ? (
                      <i className="fa-solid fa-lock text-gray-400"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-right text-primary"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="recent-programs" className="mt-16">
          <h3 className="text-2xl font-semibold text-font-base mb-6 text-center">Recently Accessed Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {programs.slice(0,3).map((p) => (
              <div key={p.name} className="bg-white rounded-lg border border-bd p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(p)}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${p.color || 'bg-primary'} rounded-lg flex items-center justify-center mr-3`}>
                    <i className={`fa-solid ${p.icon || 'fa-building'} text-white text-sm`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-font-base">{p.name}</p>
                    <p className="text-xs text-font-detail">Last accessed: Recently</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer id="footer" className="bg-white border-t border-bd mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logoUrl} alt="DYS Logo" className="w-8 h-8 rounded-full mr-3 object-contain" />
              <div>
                <p className="text-sm font-medium text-font-base">Massachusetts Department of Youth Services</p>
                <p className="text-xs text-font-detail">Youth Supervisory Platform v2.1</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-font-detail">© 2024 Commonwealth of Massachusetts</p>
              <p className="text-xs text-font-detail">All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-md border ${t.tone === 'error' ? 'bg-red-50 border-red-200 text-red-800' : t.tone === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-bd text-font-base'}`}>
            <div className="flex items-center">
              <i className={`fa-solid ${t.tone === 'error' ? 'fa-circle-exclamation text-red-500' : t.tone === 'success' ? 'fa-circle-check text-green-600' : 'fa-circle-info text-primary'} mr-2`}></i>
              <span className="text-sm font-medium">{t.title}</span>
              <button className="ml-3 text-xs text-font-detail hover:text-font-base" onClick={() => removeToast(t.id)}>
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .program-card { transition: all 0.3s ease; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); }
        .program-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(20, 85, 143, 0.15); }
        .hero-pattern { background-image: radial-gradient(circle at 20% 50%, rgba(20, 85, 143, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56, 133, 87, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(246, 197, 27, 0.1) 0%, transparent 50%); }
      `}</style>
    </div>
  );
}
