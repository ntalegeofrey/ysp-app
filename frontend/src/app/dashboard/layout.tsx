'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { logoUrl } from '../utils/logo';
import { abbreviateTitle } from '../utils/titleAbbrev';
import Loading from '../components/loading';

const menuGroups = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        icon: 'fa-house',
        label: 'Dashboard',
        href: '/dashboard',
        roles: ['admin', 'manager', 'staff', 'supervisor'],
        subPages: [
          { path: '/dashboard/add-resident', title: 'Add Resident', breadcrumb: 'Add Resident' },
          { path: '/dashboard/view-resident', title: 'Resident Overview', breadcrumb: 'Resident Overview' },
        ],
      },
      { icon: 'fa-brain', label: 'AI Insights', href: '/dashboard/ai-insights', roles: ['admin', 'manager'] },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { icon: 'fa-calendar-days', label: 'Schedule', href: '/dashboard/schedule', roles: ['admin', 'manager', 'staff', 'supervisor'] },
      { icon: 'fa-users', label: 'Staff Management', href: '/dashboard/staff-management', roles: ['admin', 'manager'], subPages: [ { path: '/dashboard/staff-management/edit-schedule', title: 'Create/Edit Schedule', breadcrumb: 'Schedule Builder' } ] },
      { icon: 'fa-clipboard-check', label: 'Residential Census', href: '/dashboard/residential-census', roles: ['admin', 'manager', 'supervisor'] },
      { icon: 'fa-boxes-stacked', label: 'Inventory Management', href: '/dashboard/inventory', roles: ['admin', 'manager'], subPages: [ { path: '/dashboard/inventory/refill-request', title: 'Inventory Refill Request', breadcrumb: 'Create Refill Request' }, { path: '/dashboard/inventory/reorganize', title: 'Storage Reorganization', breadcrumb: 'Plan Reorganization' } ] },
      { icon: 'fa-route', label: 'Off-Site Movements', href: '/dashboard/offsite-movements', roles: ['admin', 'manager', 'staff'] },
    ],
  },
  {
    id: 'resident',
    label: 'Resident Care',
    items: [
      { icon: 'fa-pills', label: 'Medication Management', href: '/dashboard/medication', roles: ['admin', 'manager', 'staff'], subPages: [ { path: '/dashboard/medication/all-medication-records', title: 'All Medication Records', breadcrumb: 'All Records' }, { path: '/dashboard/medication/medication-sheet', title: 'Resident Med Sheet', breadcrumb: 'Resident Med Sheet' } ] },
      { icon: 'fa-phone', label: 'Visitation & Phone Log', href: '/dashboard/visitation', roles: ['admin', 'manager', 'staff'] },
      { icon: 'fa-bed', label: 'Sleep Log & Watch', href: '/dashboard/sleep-log', roles: ['admin', 'manager', 'staff'] },
      { icon: 'fa-screwdriver-wrench', label: 'Repair Management', href: '/dashboard/repairs', roles: ['admin', 'manager', 'staff'], subPages: [ { path: '/dashboard/repairs/award', title: 'Manage Resident Credits', breadcrumb: 'Award Points' }, { path: '/dashboard/repairs/assign', title: 'Assign Repair Intervention', breadcrumb: 'Assign Repair' }, { path: '/dashboard/repairs/history', title: 'Repair History', breadcrumb: 'Repair History' } ] },
      { icon: 'fa-book', label: 'Log Book & Events', href: '/dashboard/logbook', roles: ['admin', 'manager', 'staff'] },
    ],
  },
  {
    id: 'safety',
    label: 'Safety & Compliance',
    items: [
      { icon: 'fa-triangle-exclamation', label: 'Incident Management', href: '/dashboard/incidents', roles: ['admin', 'manager', 'staff'] },
      { icon: 'fa-fire-extinguisher', label: 'Fire Plan Management', href: '/dashboard/fire-plan', roles: ['admin', 'manager'] },
      { icon: 'fa-building', label: 'Unit Condition (UCR)', href: '/dashboard/ucr', roles: ['admin', 'manager', 'staff'], subPages: [ { path: '/dashboard/ucr/notify', title: 'Notify Supervisor', breadcrumb: 'Notify Supervisor' } ] },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    items: [
      { icon: 'fa-user-tie', label: 'Staff Registry', href: '/dashboard/staff-registry', roles: ['admin', 'manager'] },
      { icon: 'fa-users', label: 'Resident Registry', href: '/dashboard/resident-registry', roles: ['admin', 'manager'] },
    ],
  },
];

// Helper function to get page title and breadcrumb
const getPageTitleAndBreadcrumb = (pathname: string) => {
  // Check for resident profile dynamic route
  if (pathname.startsWith('/dashboard/resident-registry/') && pathname.split('/').length > 4) {
    return {
      title: 'Resident Profile',
      breadcrumb: 'Resident Registry • Resident Profile',
    };
  }

  // First, check if we're on an exact match for a main menu item
  let exactMainMatch: any = null;
  for (const group of menuGroups) {
    const match = group.items.find((item: any) => pathname === item.href);
    if (match) { exactMainMatch = match; break; }
  }
  if (exactMainMatch) {
    return {
      title: exactMainMatch.label,
      breadcrumb: exactMainMatch.label,
    };
  }

  // Check if we're on a subpage
  for (const group of menuGroups) {
    for (const item of group.items as any[]) {
      if (item.subPages) {
        for (const subPage of item.subPages) {
          if (pathname === subPage.path || pathname.startsWith(subPage.path + '/')) {
            return { title: subPage.title, breadcrumb: `${item.label} • ${subPage.breadcrumb}` };
          }
        }
      }
    }
  }

  // Check if we're on a path that starts with a main menu item's href
  let startsWithMatch: any = null;
  for (const group of menuGroups) {
    const match = (group.items as any[]).find((item) => pathname.startsWith(item.href + '/') && pathname !== item.href);
    if (match) { startsWithMatch = match; break; }
  }

  if (startsWithMatch) {
    return {
      title: startsWithMatch.label,
      breadcrumb: startsWithMatch.label,
    };
  }

  // Fallback - check if we're on dashboard or any dashboard sub-route
  if (pathname.startsWith('/dashboard')) {
    return {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
    };
  }

  // Final fallback
  return {
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
  };
};

function HeaderWithParams({
  baseTitle,
  baseBreadcrumb,
  showBackButtonDefault,
  onToggleSidebar,
  sidebarOpen,
  onLogout,
  userName,
  userJobTitle,
}: {
  baseTitle: string;
  baseBreadcrumb: string;
  showBackButtonDefault: boolean;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onLogout: () => void;
  userName: string;
  userJobTitle: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [programName, setProgramName] = useState<string | null>(null);

  let title = baseTitle;
  let breadcrumb = baseBreadcrumb;
  let showBackButton = showBackButtonDefault;

  if (pathname.startsWith('/dashboard/medication/medication-sheet')) {
    const residentId = searchParams.get('resident') || '';
    const firstName = searchParams.get('firstName') || '';
    const lastName = searchParams.get('lastName') || '';
    const residentName = firstName && lastName ? `${firstName} ${lastName}` : (residentId || 'Resident');
    showBackButton = true;
    title = `${residentName} - Medication Sheet`;
    breadcrumb = `Medication Management • ${residentName} Med Sheet`;
  }

  // Show back button for repairs history dynamic route
  if (pathname.startsWith('/dashboard/repairs/history/')) {
    showBackButton = true;
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedProgram');
      if (raw) {
        const p = JSON.parse(raw);
        setProgramName(p.name || null);
      }
    } catch {}
  }, []);

  return (
    <header className="bg-white border-b border-bd px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-bg-subtle transition-colors"
          >
            <i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>

          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-font-detail hover:text-primary hover:bg-primary-lightest rounded-lg"
            >
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
          )}
          <div>
            {/* Page Title - Responsive text size */}
            <h2 className="text-lg sm:text-xl font-bold text-font-heading">{title}</h2>

            {/* Breadcrumb under title */}
            <p className="text-sm text-font-detail mt-1">{breadcrumb}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Date Display with Program beneath - Hidden on mobile */}
          <div className="hidden md:flex items-start gap-2 text-sm text-font-detail">
            <i className="fa-solid fa-calendar text-primary mt-0.5"></i>
            <div className="leading-tight">
              <div>
                Current Date: <span className="font-medium">Nov 18, 2024</span>
              </div>
              {programName && (
                <div className="text-xs text-font-detail mt-0.5 flex items-center gap-1">
                  <i className="fa-solid fa-building text-primary"></i>
                  <span className="truncate">{programName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-bg-subtle transition-colors">
            <i className="fa-solid fa-bell text-lg sm:text-xl text-font-base"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-bg-subtle transition-colors">
            <i className="fa-solid fa-gear text-lg sm:text-xl text-font-base"></i>
          </button>

          {/* User identity next to avatar */}
          <div className="flex items-center gap-2 pl-2">
            <button className="p-2 rounded-lg hover:bg-bg-subtle transition-colors" title="Account">
              <i className="fa-solid fa-circle-user text-xl text-font-base"></i>
            </button>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-medium text-font-base">{userName || 'Authenticated User'}</div>
              <div className="text-xs text-font-detail">{abbreviateTitle(userJobTitle || 'Staff')}</div>
            </div>
          </div>

          {/* Logout - icon button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-bg-subtle transition-colors"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket text-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [moduleAccess, setModuleAccess] = useState<Record<string, string>>({});
  // Program access gate
  const [programAuthChecked, setProgramAuthChecked] = useState(false);
  const [programAuthorized, setProgramAuthorized] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; tone: 'info' | 'success' | 'error' }>>([]);
  const removeToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));
  const addToast = (title: string, tone: 'info' | 'success' | 'error' = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts(t => [...t, { id, title, tone }]);
    setTimeout(() => removeToast(id), 3500);
  };

  // list of pages want the back button to appear on
  const pagesWithBack = ['/dashboard/add-resident', '/dashboard/staff-management/edit-schedule', '/dashboard/medication/medication-sheet', '/dashboard/medication/all-medication-records', '/dashboard/inventory/refill-request', '/dashboard/inventory/reorganize', '/dashboard/ucr/notify', '/dashboard/repairs/award', '/dashboard/repairs/assign'];
  
  // Check if it's a resident profile page
  const isResidentProfile = pathname.startsWith('/dashboard/resident-registry/') && pathname.split('/').length > 4;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin-required');
      return;
    }
    // Try fetching profile from backend
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE || '/api';
        const res = await fetch(`${base}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const profile = await res.json();
          setUser({
            email: profile.email,
            role: profile.role,
            name: profile.fullName || (profile.email ? String(profile.email).split('@')[0] : ''),
            fullName: profile.fullName,
            jobTitle: profile.jobTitle,
          });
          return;
        }
      } catch {}
      // Fallback to local storage user
      if (userData) {
        try { setUser(JSON.parse(userData)); } catch {}
      } else {
        router.push('/signin-required');
      }
    })();
  }, [router]);

  // Require a selected program for any dashboard module
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem('selectedProgram');
      if (!raw) {
        try { localStorage.setItem('global-toast', JSON.stringify({ title: 'Please select a program to continue.', tone: 'info' })); } catch {}
        setProgramAuthorized(false);
        setProgramAuthChecked(true);
        setTimeout(() => router.replace('/program-selection'), 500);
      }
    } catch {}
  }, [user, pathname, router]);

  // Enforce program membership for non-admins: selected program must be one of /programs/my
  useEffect(() => {
    (async () => {
      if (!user) return;
      const role = String(user.role || '').toLowerCase();
      const isAdmin = role === 'admin' || role === 'administrator';
      if (isAdmin) { setProgramAuthorized(true); setProgramAuthChecked(true); return; } // admins can view any program
      let selectedId: string | null = null;
      try {
        const raw = localStorage.getItem('selectedProgram');
        if (!raw) return;
        const p = JSON.parse(raw);
        selectedId = p?.id ? String(p.id) : null;
      } catch { selectedId = null; }
      if (!selectedId) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/programs/my', { credentials: 'include', headers: { 'Accept':'application/json', ...(token? { Authorization: `Bearer ${token}` }: {}) } });
        if (!res.ok) return;
        const mine: Array<{ id: number|string }> = await res.json();
        const ids = new Set(mine.map(m => String(m.id)));
        if (!ids.has(selectedId)) {
          try { localStorage.removeItem('selectedProgram'); } catch {}
          try { localStorage.setItem('global-toast', JSON.stringify({ title: 'You are not attached to this program. Please contact the Program Admin.', tone: 'error' })); } catch {}
          setProgramAuthorized(false);
          setProgramAuthChecked(true);
          // Redirect after a brief delay to allow the toast to be visible, but do not render page content during this time
          setTimeout(() => router.replace('/program-selection'), 800);
        } else {
          setProgramAuthorized(true);
          setProgramAuthChecked(true);
        }
      } catch {}
    })();
  }, [user, pathname, router]);

  // Load module access for all menu items; show items with FULL access regardless of role
  const loadModuleAccess = async () => {
    if (!user) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const modules = Array.from(new Set(menuGroups.flatMap((g: any) => (g.items as any[]).map((it) => it.label))));
      const accessMap: Record<string, string> = {};
      await Promise.all(modules.map(async (m) => {
        try {
          const res = await fetch(`/api/permissions/check?module=${encodeURIComponent(m)}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (res.ok) {
            const data = await res.json();
            accessMap[m] = (data?.access || '').toUpperCase();
          }
        } catch {}
      }));
      setModuleAccess(accessMap);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => { if (!cancelled) await loadModuleAccess(); })();
    return () => { cancelled = true; };
  }, [user]);

  // Refresh module access on tab visibility change and on cross-tab permissions update
  useEffect(() => {
    const onVis = () => { if (!document.hidden) loadModuleAccess(); };
    const onStorage = (e: StorageEvent) => { if (e.key === 'perms-bump') loadModuleAccess(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('storage', onStorage);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('storage', onStorage); };
  }, [user]);

  // Listen for global toast broadcasts from pages
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'global-toast' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue) as { title?: string; tone?: 'info'|'success'|'error' };
          if (payload?.title) addToast(payload.title, (payload.tone || 'info'));
        } catch {}
        // Clear key to allow subsequent identical messages
        try { localStorage.removeItem('global-toast'); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'logout') router.replace('/signin-required');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedProgram');
      localStorage.setItem('logout', String(Date.now()));
    } catch {}
    router.push('/signin-required');
  };

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const filteredGroups = menuGroups
    .map((group) => ({
      ...group,
      items: (group.items as any[]).filter((item: any) => {
        if (!user) return false;
        const roleAllowed = item.roles.includes(user.role);
        const access = (moduleAccess[item.label] || '').toUpperCase();
        const hasFull = access === 'FULL';
        return roleAllowed || hasFull;
      }),
    }))
    .filter((group) => (group.items as any[]).length > 0);

  useEffect(() => {
  }, [pathname, user]);

  if (!user) return null;
  const showBackButtonDefault = pagesWithBack.includes(pathname) || isResidentProfile;
  const base = getPageTitleAndBreadcrumb(pathname);

  const canRenderContent = !!user && programAuthChecked && programAuthorized;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-bd flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header - Same height as app bar */}
        <div className="p-6 border-b border-bd h-[88px] flex items-center">
          <div className="flex items-center">
            {/* Logo */}
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
              <img src={logoUrl} alt="DYS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Mass. DYS</h1>
              <p className="text-xs text-font-detail">Youth Supervisory Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredGroups.map((group) => {
              const isGroupActive = (group.items as any[]).some((item) =>
                item.subPages
                  ? (pathname === item.href || item.subPages.some((sp: any) => pathname === sp.path || pathname.startsWith(sp.path + '/')))
                  : (pathname === item.href || pathname.startsWith(item.href + '/'))
              );
              return (
                <div
                  key={group.id}
                  className={`rounded-lg transition-colors ${isGroupActive ? 'bg-active-group' : ''}`}
                >
                  <button
                    className={`w-full flex items-center justify-between px-2 py-2 text-xs uppercase tracking-wide rounded-md transition-colors ${
                      isGroupActive
                        ? 'text-primary font-semibold'
                        : 'text-font-detail hover:bg-primary-lightest'
                    }`}
                    onClick={() => setExpandedGroups((s) => ({ ...s, [group.id]: !s[group.id] }))}
                    aria-expanded={!!expandedGroups[group.id]}
                    aria-controls={`group-${group.id}`}
                  >
                    <span>{group.label}</span>
                    <i className={`fa-solid ${expandedGroups[group.id] ? 'fa-chevron-up' : 'fa-chevron-down'} text-[11px] ${isGroupActive ? 'text-primary' : 'text-font-detail'}`}></i>
                  </button>
                  <div
                    id={`group-${group.id}`}
                    className={`collapsible ${expandedGroups[group.id] ? 'open' : ''}`}
                  >
                    <div className="pt-1 pb-1 space-y-1">
                      {(group.items as any[]).map((item) => {
                        const isActive = item.subPages
                          ? (pathname === item.href || item.subPages.some((sp: any) => pathname === sp.path || pathname.startsWith(sp.path + '/')))
                          : (pathname === item.href || pathname.startsWith(item.href + '/'));
                        const itemBase = 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm';
                        const itemActive = 'bg-primary text-white font-medium';
                        const itemInactive = 'text-font-base hover:bg-primary-lightest hover:text-primary';
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`${itemBase} ${isActive ? itemActive : itemInactive}`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <i className={`fa-solid ${item.icon} w-4 mr-3 text-sm ${isActive ? 'text-white' : 'text-font-detail'}`}></i>
                            <span className="flex-1 text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-bd">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-white"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-font-base truncate">{user.fullName || user.name || user.email}</p>
                <p className="text-xs text-font-detail truncate">{abbreviateTitle(user.jobTitle || (user.role ? String(user.role) : ''))}</p>
              </div>
            </div>
            {/* Logout Button in Sidebar */}
            <button
              onClick={handleLogout}
              className="p-2 text-font-detail hover:text-primary transition-colors"
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Navigation Bar */}
        <Suspense fallback={<Loading /> }>
          <HeaderWithParams
            baseTitle={base.title}
            baseBreadcrumb={base.breadcrumb}
            showBackButtonDefault={showBackButtonDefault}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            onLogout={handleLogout}
            userName={user.fullName || user.name || user.email}
            userJobTitle={user.jobTitle || (user.role ? String(user.role).toLowerCase() : '')}
          />
        </Suspense>

        {/* Page Content - Scrollable main area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {canRenderContent ? (
            children
          ) : (
            <div className="w-full h-full flex items-center justify-center text-font-detail">
              <div className="flex items-center gap-3"><i className="fa-solid fa-shield text-primary"></i> Validating access…</div>
            </div>
          )}
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[2000] space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 bg-white ${t.tone === 'success' ? 'border-success' : t.tone === 'error' ? 'border-error' : 'border-bd'}`}>
            <i className={`fa-solid ${t.tone === 'success' ? 'fa-circle-check text-success' : t.tone === 'error' ? 'fa-circle-exclamation text-error' : 'fa-circle-info text-primary'} mt-1`}></i>
            <div className="flex-1 text-sm text-font-base">{t.title}</div>
            <button className="text-font-detail hover:text-primary" onClick={() => removeToast(t.id)}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Custom scrollbar hiding */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-y-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Smooth collapsible for sidebar groups */
        .collapsible {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 260ms ease, opacity 220ms ease;
        }
        .collapsible.open {
          max-height: 1000px; /* enough for group items */
          opacity: 1;
        }
        /* Slightly lighter than #e8eef4 for active group background */
        .bg-active-group {
          background-color: #f0f4f8;
        }
      `}</style>
    </div>
  );
}
