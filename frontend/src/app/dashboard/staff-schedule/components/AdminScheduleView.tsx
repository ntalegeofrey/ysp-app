'use client';

import { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import RequestsQueue from './RequestsQueue';
import StaffRoster from './StaffRoster';
import OvertimeArchive from './OvertimeArchive';

export default function AdminScheduleView() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'requests' | 'staff' | 'overtime'>('schedule');

  const stats = {
    totalScheduled: 98,
    openOT: 12,
    mandatoryOT: 3,
    pendingRequests: 8,
    onLeaveToday: 5,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-font-heading mb-2">Staff Schedule Management</h1>
        <p className="text-sm text-font-detail">Manage schedules, approve requests, and track staffing</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-font-heading">{stats.totalScheduled}</p>
              <p className="text-xs text-font-detail mt-1">Total Scheduled</p>
            </div>
            <i className="fa-solid fa-users text-primary text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">{stats.openOT}</p>
              <p className="text-xs text-font-detail mt-1">Open OT Slots</p>
            </div>
            <i className="fa-solid fa-clock text-success text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-error">{stats.mandatoryOT}</p>
              <p className="text-xs text-font-detail mt-1">Mandatory OT</p>
            </div>
            <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">{stats.pendingRequests}</p>
              <p className="text-xs text-font-detail mt-1">Pending Requests</p>
            </div>
            <i className="fa-solid fa-clipboard-list text-warning text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-font-medium">{stats.onLeaveToday}</p>
              <p className="text-xs text-font-detail mt-1">On Leave Today</p>
            </div>
            <i className="fa-solid fa-calendar-xmark text-font-medium text-xl"></i>
          </div>
        </div>
      </div>

      <div className="border-b border-bd mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className={`fa-solid fa-calendar-days mr-2 ${activeTab === 'schedule' ? 'text-primary' : 'text-font-detail'}`}></i>
            Schedule Calendar
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className={`fa-solid fa-clipboard-list mr-2 ${activeTab === 'requests' ? 'text-primary' : 'text-font-detail'}`}></i>
            Requests Queue
            {stats.pendingRequests > 0 && (
              <span className="ml-2 bg-warning text-white text-xs px-2 py-0.5 rounded-full">
                {stats.pendingRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'staff'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className={`fa-solid fa-users mr-2 ${activeTab === 'staff' ? 'text-primary' : 'text-font-detail'}`}></i>
            Staff Roster
          </button>
          <button
            onClick={() => setActiveTab('overtime')}
            className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'overtime'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className={`fa-solid fa-clock-rotate-left mr-2 ${activeTab === 'overtime' ? 'text-primary' : 'text-font-detail'}`}></i>
            Overtime Archive
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'schedule' && <CalendarGrid isAdmin={true} />}
        {activeTab === 'requests' && <RequestsQueue />}
        {activeTab === 'staff' && <StaffRoster />}
        {activeTab === 'overtime' && <OvertimeArchive />}
      </div>
    </div>
  );
}
