'use client';

import { useState, useEffect } from 'react';
import AdminScheduleView from './components/AdminScheduleView';
import StaffScheduleView from './components/StaffScheduleView';

export default function StaffSchedulePage() {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

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

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERVISOR';

  return (
    <div className="flex-1 p-6 overflow-auto">
      {isAdmin ? <AdminScheduleView /> : <StaffScheduleView />}
    </div>
  );
}
