'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { logoUrl } from '../utils/logo';

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
      { icon: 'fa-truck-medical', label: 'Medical Run Coordination', href: '/dashboard/medical-runs', roles: ['admin', 'manager', 'staff'] },
    ],
  },
  {
    id: 'resident',
    label: 'Resident Care',
    items: [
      { icon: 'fa-pills', label: 'Medication Count', href: '/dashboard/medication', roles: ['admin', 'manager', 'staff'], subPages: [ { path: '/dashboard/medication/all-medication-records', title: 'All Medication Records', breadcrumb: 'All Records' }, { path: '/dashboard/medication/medication-sheet', title: 'Resident Med Sheet', breadcrumb: 'Resident Med Sheet' } ] },
      { icon: 'fa-phone', label: 'Visitation & Phone Log', href: '/dashboard/visitation', roles: ['admin', 'manager', 'staff'] },
      { icon: 'fa-bed', label: 'Sleep Log & Watch', href: '/dashboard/sleep-log', roles: ['admin', 'manager', 'staff'] },
      { icon: 'fa-wrench', label: 'Repair Management', href: '/dashboard/repairs', roles: ['admin', 'manager', 'staff'], subPages: [ { path: '/dashboard/repairs/award', title: 'Manage Resident Credits', breadcrumb: 'Award Points' }, { path: '/dashboard/repairs/assign', title: 'Assign Repair Intervention', breadcrumb: 'Assign Repair' } ] },
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
      { icon: 'fa-user-plus', label: 'Unit Registry', href: '/dashboard/unit-registry', roles: ['admin', 'manager'] },
      { icon: 'fa-gear', label: 'System Admin', href: '/dashboard/system-admin', roles: ['admin'] },
    ],
  },
];

// Helper function to get page title and breadcrumb
const getPageTitleAndBreadcrumb = (pathname: string) => {
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
}: {
  baseTitle: string;
  baseBreadcrumb: string;
  showBackButtonDefault: boolean;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onLogout: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let title = baseTitle;
  let breadcrumb = baseBreadcrumb;
  let showBackButton = showBackButtonDefault;

  if (pathname.startsWith('/dashboard/medication/medication-sheet')) {
    const residentId = searchParams.get('resident') || '';
    showBackButton = true;
    title = residentId ? `${residentId} - Medication Sheet` : 'Resident Med Sheet';
    breadcrumb = `Medication Count • ${residentId ? `${residentId} Med Sheet` : 'Resident Med Sheet'}`;
  }

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
          {/* Date Display - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-sm text-font-detail">
            <i className="fa-solid fa-calendar text-primary"></i>
            <span>
              Current Date: <span className="font-medium">Nov 18, 2024</span>
            </span>
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

          {/* Logout Button - Text hidden on mobile */}
          <button
            onClick={onLogout}
            className="px-3 sm:px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="hidden sm:inline">Logout</span>
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

  // list of pages want the back button to appear on
  const pagesWithBack = ['/dashboard/add-resident', '/dashboard/staff-management/edit-schedule', '/dashboard/medication/medication-sheet', '/dashboard/medication/all-medication-records', '/dashboard/inventory/refill-request', '/dashboard/inventory/reorganize', '/dashboard/ucr/notify', '/dashboard/repairs/award', '/dashboard/repairs/assign'];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const filteredGroups = menuGroups.map((group) => ({
    ...group,
    items: group.items.filter((item: any) => user && item.roles.includes(user.role)),
  })).filter((group) => group.items.length > 0);

  useEffect(() => {
    // Ensure the group containing the active route is open, but do not auto-close others
    const updates: Record<string, boolean> = {};
    for (const group of filteredGroups) {
      const hasActive = (group.items as any[]).some((item) => pathname === item.href || pathname.startsWith(item.href + '/'));
      if (hasActive) updates[group.id] = true;
    }
    setExpandedGroups((prev) => ({ ...prev, ...updates }));
  }, [pathname, user]);

  if (!user) return null;
  const showBackButtonDefault = pagesWithBack.includes(pathname);
  const base = getPageTitleAndBreadcrumb(pathname);

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
                <div key={group.id}>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wide rounded-lg transition-colors ${
                      isGroupActive
                        ? 'bg-primary-lightest text-primary font-semibold'
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
                    <div className="pt-1 space-y-1">
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
                <p className="text-sm font-medium text-font-base truncate">{user.name}</p>
                <p className="text-xs text-font-detail capitalize">{user.role}</p>
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
        <Suspense fallback={
          <header className="bg-white border-b border-bd px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-bg-subtle transition-colors"
                >
                  <i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-font-heading">{base.title}</h2>
                  <p className="text-sm text-font-detail mt-1">{base.breadcrumb}</p>
                </div>
              </div>
            </div>
          </header>
        }>
          <HeaderWithParams
            baseTitle={base.title}
            baseBreadcrumb={base.breadcrumb}
            showBackButtonDefault={showBackButtonDefault}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            onLogout={handleLogout}
          />
        </Suspense>

        {/* Page Content - Scrollable main area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
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
      `}</style>
    </div>
  );
}
