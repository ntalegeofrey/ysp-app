'use client';

import { useState, useEffect } from 'react';
import AdminScheduleView from './components/AdminScheduleView';
import StaffScheduleView from './components/StaffScheduleView';

export default function StaffSchedulePage() {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewAsRole, setViewAsRole] = useState<'admin' | 'staff' | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.role || '');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-font-detail">Loading...</div>
      </div>
    );
  }

  const actualIsAdmin = userRole === 'ADMIN' || userRole === 'SUPERVISOR';
  const displayAsAdmin = viewAsRole === 'admin' || (viewAsRole === null && actualIsAdmin);

  return (
    <div className="flex-1 overflow-auto">
      {/* Role Switcher - For Testing */}
      <div className="sticky top-0 z-10 bg-warning text-white px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-flask"></i>
          <span className="text-sm font-medium">Testing Mode - Switch Views:</span>
          <button
            onClick={() => setViewAsRole('admin')}
            className={`px-3 py-1 rounded text-xs ${
              displayAsAdmin ? 'bg-white text-warning font-semibold' : 'bg-warning-dark text-white border border-white'
            }`}
          >
            Admin / Program Director View
          </button>
          <button
            onClick={() => setViewAsRole('staff')}
            className={`px-3 py-1 rounded text-xs ${
              !displayAsAdmin ? 'bg-white text-warning font-semibold' : 'bg-warning-dark text-white border border-white'
            }`}
          >
            Staff View
          </button>
        </div>
        <div className="text-xs">
          Your actual role: <span className="font-semibold">{userRole || 'Unknown'}</span>
        </div>
      </div>

      <div className="p-6">
        {displayAsAdmin ? <AdminScheduleView /> : <StaffScheduleView />}
      </div>
    </div>
  );
}
