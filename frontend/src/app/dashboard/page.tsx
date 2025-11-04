'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { label: 'Total Residents', value: '156', icon: 'fa-users', color: 'bg-blue-100 text-blue-600', change: '+12' },
    { label: 'Active Staff', value: '48', icon: 'fa-user-tie', color: 'bg-green-100 text-green-600', change: '+3' },
    { label: 'Open Incidents', value: '7', icon: 'fa-triangle-exclamation', color: 'bg-red-100 text-red-600', change: '-2' },
    { label: 'Pending Tasks', value: '23', icon: 'fa-clipboard-check', color: 'bg-yellow-100 text-yellow-600', change: '+5' },
  ];

  const recentActivities = [
    { id: 1, type: 'incident', title: 'New incident reported', time: '10 minutes ago', icon: 'fa-triangle-exclamation', color: 'text-red-600' },
    { id: 2, type: 'medication', title: 'Medication count completed', time: '1 hour ago', icon: 'fa-pills', color: 'text-green-600' },
    { id: 3, type: 'staff', title: 'New staff member onboarded', time: '2 hours ago', icon: 'fa-user-plus', color: 'text-blue-600' },
    { id: 4, type: 'repair', title: 'Repair request submitted', time: '3 hours ago', icon: 'fa-wrench', color: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-font-heading mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-font-detail">Here's what's happening in your facility today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
              <span className="text-sm font-medium text-success">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-font-heading mb-1">{stat.value}</p>
            <p className="text-sm text-font-detail">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-bd">
          <h2 className="text-lg font-bold text-font-heading">Recent Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-bg-subtle rounded-lg">
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center ${activity.color}`}>
                  <i className={`fa-solid ${activity.icon}`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-font-base">{activity.title}</p>
                  <p className="text-sm text-font-detail">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-primary text-white p-6 rounded-lg hover:bg-primary-light transition flex items-center gap-4">
          <i className="fa-solid fa-user-plus text-2xl"></i>
          <div className="text-left">
            <p className="font-bold">New Resident</p>
            <p className="text-sm opacity-90">Onboard resident</p>
          </div>
        </button>
        <button className="bg-primary-alt text-white p-6 rounded-lg hover:bg-primary-alt-dark transition flex items-center gap-4">
          <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
          <div className="text-left">
            <p className="font-bold">Report Incident</p>
            <p className="text-sm opacity-90">Create new report</p>
          </div>
        </button>
        <button className="bg-highlight text-font-dark p-6 rounded-lg hover:bg-highlight-lighter transition flex items-center gap-4">
          <i className="fa-solid fa-pills text-2xl"></i>
          <div className="text-left">
            <p className="font-bold">Med Count</p>
            <p className="text-sm opacity-90">Start medication count</p>
          </div>
        </button>
      </div>
    </div>
  );
}
