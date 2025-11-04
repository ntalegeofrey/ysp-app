'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { icon: 'fa-house', label: 'Dashboard', href: '/dashboard', roles: ['admin', 'manager', 'staff', 'supervisor'] },
  { icon: 'fa-user-plus', label: 'Resident & Staff Onboarding', href: '/dashboard/onboarding', roles: ['admin', 'manager'] },
  { icon: 'fa-users', label: 'Staff Management', href: '/dashboard/staff-management', roles: ['admin', 'manager'] },
  { icon: 'fa-brain', label: 'AI Insights', href: '/dashboard/ai-insights', roles: ['admin', 'manager'] },
  { icon: 'fa-chart-line', label: 'Analytics', href: '/dashboard/analytics', roles: ['admin', 'manager'] },
  { icon: 'fa-pills', label: 'Medication Count', href: '/dashboard/medication', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-triangle-exclamation', label: 'Incident Management', href: '/dashboard/incidents', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-boxes-stacked', label: 'Inventory Management', href: '/dashboard/inventory', roles: ['admin', 'manager'] },
  { icon: 'fa-truck-medical', label: 'Medical Run Coordination', href: '/dashboard/medical-runs', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-fire-extinguisher', label: 'Fire Plan Management', href: '/dashboard/fire-plan', roles: ['admin', 'manager'] },
  { icon: 'fa-file-lines', label: 'UCR Reports', href: '/dashboard/ucr', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-phone', label: 'Visitation & Phone Log', href: '/dashboard/visitation', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-bed', label: 'Sleep Log & Watch', href: '/dashboard/sleep-log', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-book', label: 'Log Book & Events', href: '/dashboard/logbook', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-wrench', label: 'Repair Management', href: '/dashboard/repairs', roles: ['admin', 'manager', 'staff'] },
  { icon: 'fa-headset', label: 'Contact Support', href: '/dashboard/support', roles: ['admin', 'manager', 'staff', 'supervisor'] },
  { icon: 'fa-gear', label: 'System Admin', href: '/dashboard/system-admin', roles: ['admin'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-bd flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-bd">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
              <i className="fa-solid fa-shield text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Mass. DYS</h1>
              <p className="text-xs text-font-detail">Youth Supervisory Platform</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-font-detail text-sm"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-bd rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-primary-lightest text-primary font-medium'
                      : 'text-font-base hover:bg-bg-subtle'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-bd">
          <div className="flex items-center gap-3 px-4 py-3 bg-bg-subtle rounded-lg">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-white"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-font-base truncate">{user.name}</p>
              <p className="text-xs text-font-detail capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-bd px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-bg-subtle"
              >
                <i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
              <h2 className="text-xl font-bold text-font-heading">
                {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-bg-subtle">
                <i className="fa-solid fa-bell text-xl text-font-base"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 rounded-lg hover:bg-bg-subtle">
                <i className="fa-solid fa-gear text-xl text-font-base"></i>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
