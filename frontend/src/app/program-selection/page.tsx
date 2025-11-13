'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoUrl } from '../utils/logo';

type Program = {
  name: string;
  subtitle: string;
  location: string;
  capacity: string;
  hours: string;
  icon: string; // fontawesome class
  color: string; // bg color class
  disabled?: boolean;
  status: { label: string; color: string; icon?: string };
};

const PROGRAMS: Program[] = [
  { name: 'Westborough Secure', subtitle: 'Secure Treatment Facility', location: 'Westborough, MA', capacity: 'Capacity: 32 Residents', hours: '24/7 Operations', icon: 'fa-building', color: 'bg-primary', status: { label: 'Active', color: 'bg-success' } },
  { name: 'Worcester Group Home', subtitle: 'Community-Based Program', location: 'Worcester, MA', capacity: 'Capacity: 12 Residents', hours: 'Day Program', icon: 'fa-home', color: 'bg-primary-alt', status: { label: 'Active', color: 'bg-success' } },
  { name: 'Springfield Education Center', subtitle: 'Educational Services', location: 'Springfield, MA', capacity: 'Capacity: 45 Students', hours: 'School Hours', icon: 'fa-graduation-cap', color: 'bg-highlight', status: { label: 'Active', color: 'bg-success' } },
  { name: 'Boston Detention Center', subtitle: 'Secure Detention', location: 'Boston, MA', capacity: 'Capacity: 28 Residents', hours: '24/7 Operations', icon: 'fa-shield', color: 'bg-primary-light', status: { label: 'Active', color: 'bg-success' } },
  { name: 'Berkshire Wilderness', subtitle: 'Outdoor Therapeutic Program', location: 'Pittsfield, MA', capacity: 'Capacity: 16 Participants', hours: 'Residential Program', icon: 'fa-tree', color: 'bg-primary-alt-dark', status: { label: 'Active', color: 'bg-success' } },
  { name: 'Cape Cod Transitional', subtitle: 'Transitional Living', location: 'Hyannis, MA', capacity: 'Capacity: 8 Residents', hours: 'Independent Living', icon: 'fa-tools', color: 'bg-gray-400', disabled: true, status: { label: 'Maintenance', color: 'bg-warning', icon: 'fa-lock' } },
];

export default function ProgramSelectionPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!raw || !token) {
        router.push('/');
        return;
      }
      setRole(JSON.parse(raw).role || '');
      setReady(true);
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PROGRAMS.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
  }, [search]);

  const onSelect = (p: Program) => {
    if (p.disabled) return;
    localStorage.setItem('selectedProgram', JSON.stringify({ name: p.name, location: p.location }));
    router.push('/dashboard');
  };

  if (!ready) return null;
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
                <p className="text-sm font-medium text-font-base">Welcome, Sarah Wilson</p>
                <p className="text-xs text-font-detail">Super Administrator</p>
              </div>
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-primary-lighter" />
              <button className="text-font-detail hover:text-primary ml-4" onClick={() => { try { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('selectedProgram'); } catch {}; router.push('/'); }}>
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
            {role === 'admin' && (
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

        <div id="programs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div key={p.name} className={`program-card bg-white rounded-xl shadow-md border border-bd p-6 cursor-pointer ${p.disabled ? 'opacity-75' : ''}`} onClick={() => onSelect(p)}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${p.color} rounded-lg flex items-center justify-center mr-4`}>
                  <i className={`fa-solid ${p.icon} text-white`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-font-base">{p.name}</h3>
                  <p className="text-sm text-font-detail">{p.subtitle}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-font-detail">
                  <i className="fa-solid fa-map-marker-alt w-4 mr-2 text-primary"></i>
                  <span>{p.location}</span>
                </div>
                <div className="flex items-center text-sm text-font-detail">
                  <i className="fa-solid fa-users w-4 mr-2 text-primary"></i>
                  <span>{p.capacity}</span>
                </div>
                <div className="flex items-center text-sm text-font-detail">
                  <i className="fa-solid fa-clock w-4 mr-2 text-primary"></i>
                  <span>{p.hours}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${p.status.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>{p.status.label}</span>
                {p.disabled ? (
                  <i className="fa-solid fa-lock text-gray-400"></i>
                ) : (
                  <i className="fa-solid fa-arrow-right text-primary"></i>
                )}
              </div>
            </div>
          ))}
        </div>

        <div id="recent-programs" className="mt-16">
          <h3 className="text-2xl font-semibold text-font-base mb-6 text-center">Recently Accessed Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PROGRAMS.slice(0,3).map((p) => (
              <div key={p.name} className="bg-white rounded-lg border border-bd p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(p)}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${p.color} rounded-lg flex items-center justify-center mr-3`}>
                    <i className={`fa-solid ${p.icon} text-white text-sm`}></i>
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

      <style jsx>{`
        .program-card { transition: all 0.3s ease; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); }
        .program-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(20, 85, 143, 0.15); }
        .hero-pattern { background-image: radial-gradient(circle at 20% 50%, rgba(20, 85, 143, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56, 133, 87, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(246, 197, 27, 0.1) 0%, transparent 50%); }
      `}</style>
    </div>
  );
}
