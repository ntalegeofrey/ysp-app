'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoUrl } from '../utils/logo';

const menuItems = [
  {
    icon: 'fa-house',
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['admin', 'manager', 'staff', 'supervisor'],
    subPages: [
      {
        path: '/dashboard/add-resident',
        title: 'Add Resident',
        breadcrumb: 'Add Resident',
      },
      {
        path: '/dashboard/view-resident',
        title: 'Resident Overview',
        breadcrumb: 'Resident Overview',
      },
    ],
  },
  {
    icon: 'fa-user-plus',
    label: 'Unit Registry',
    href: '/dashboard/unit-registry',
    roles: ['admin', 'manager'],
  },
  {
    icon: 'fa-users',
    label: 'Staff Management',
    href: '/dashboard/staff-management',
    roles: ['admin', 'manager'],
    subPages: [
      {
        path: '/dashboard/staff-management/edit-schedule',
        title: 'Create/Edit Schedule',
        breadcrumb: 'Schedule Builder',
      },
    ],
  },
  {
    icon: 'fa-calendar-days',
    label: 'Schedule',
    href: '/dashboard/schedule',
    roles: ['admin', 'manager', 'staff', 'supervisor'],
  },
  {
    icon: 'fa-brain',
    label: 'AI Insights',
    href: '/dashboard/ai-insights',
    roles: ['admin', 'manager'],
  },
  {
    icon: 'fa-clipboard-check',
    label: 'Residential Census',
    href: '/dashboard/residential-census',
    roles: ['admin', 'manager', 'supervisor'],
  },
  {
    icon: 'fa-pills',
    label: 'Medication Count',
    href: '/dashboard/medication',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-triangle-exclamation',
    label: 'Incident Management',
    href: '/dashboard/incidents',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-boxes-stacked',
    label: 'Inventory Management',
    href: '/dashboard/inventory',
    roles: ['admin', 'manager'],
  },
  {
    icon: 'fa-truck-medical',
    label: 'Medical Run Coordination',
    href: '/dashboard/medical-runs',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-fire-extinguisher',
    label: 'Fire Plan Management',
    href: '/dashboard/fire-plan',
    roles: ['admin', 'manager'],
  },
  {
    icon: 'fa-file-lines',
    label: 'UCR Reports',
    href: '/dashboard/ucr',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-phone',
    label: 'Visitation & Phone Log',
    href: '/dashboard/visitation',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-bed',
    label: 'Sleep Log & Watch',
    href: '/dashboard/sleep-log',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-book',
    label: 'Log Book & Events',
    href: '/dashboard/logbook',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-wrench',
    label: 'Repair Management',
    href: '/dashboard/repairs',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    icon: 'fa-headset',
    label: 'Contact Support',
    href: '/dashboard/support',
    roles: ['admin', 'manager', 'staff', 'supervisor'],
  },
  { icon: 'fa-gear', label: 'System Admin', href: '/dashboard/system-admin', roles: ['admin'] },
];

// Helper function to get page title and breadcrumb
const getPageTitleAndBreadcrumb = (pathname: string) => {
  // First, check if we're on an exact match for a main menu item
  const exactMainMatch = menuItems.find((item) => pathname === item.href);
  if (exactMainMatch) {
    return {
      title: exactMainMatch.label,
      breadcrumb: exactMainMatch.label,
    };
  }

  // Check if we're on a subpage
  for (const item of menuItems) {
    if (item.subPages) {
      for (const subPage of item.subPages) {
        if (pathname === subPage.path || pathname.startsWith(subPage.path + '/')) {
          return {
            title: subPage.title,
            breadcrumb: `${item.label} • ${subPage.breadcrumb}`,
          };
        }
      }
    }
  }

  // Check if we're on a path that starts with a main menu item's href
  const startsWithMatch = menuItems.find(
    (item) => pathname.startsWith(item.href + '/') && pathname !== item.href
  );

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // list of pages want the back button to appear on
  const pagesWithBack = ['/dashboard/add-resident', '/dashboard/staff-management/edit-schedule'];

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

  const filteredMenuItems = menuItems.filter((item) => user && item.roles.includes(user.role));

  if (!user) return null;

  const showBackButton = pagesWithBack.includes(pathname);
  const { title, breadcrumb } = getPageTitleAndBreadcrumb(pathname);

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
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              // Check if current item is active
              const isActive = item.subPages
                ? (
                    pathname === item.href ||
                    item.subPages.some((subPage) =>
                      pathname === subPage.path || pathname.startsWith(subPage.path + '/')
                    )
                  )
                : (
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/')
                  );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-font-detail rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-primary text-white font-medium'
                      : 'text-font-base hover:bg-primary-lightest'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`fa-solid ${item.icon} w-4 mr-3 text-sm`}></i>
                  <span className="flex-1 text-sm">{item.label}</span>
                </Link>
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
        <header className="bg-white border-b border-bd px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
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
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

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
      `}</style>
    </div>
  );
}
