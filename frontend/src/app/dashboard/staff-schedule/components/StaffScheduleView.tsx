'use client';

import { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import RequestOvertimeModal from './RequestOvertimeModal';
import RequestTimeOffModal from './RequestTimeOffModal';
import CallOutModal from './CallOutModal';

export default function StaffScheduleView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'requests'>('dashboard');
  const [showOTModal, setShowOTModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCallOutModal, setShowCallOutModal] = useState(false);

  const myStats = {
    shiftsThisWeek: 4,
    otHoursMonth: 12,
    leaveAvailable: 15,
    pendingRequests: 1,
  };

  const myUpcomingShifts = [
    { date: 'Mon Nov 18', shift: 'Day Shift 7AM-3PM', supervisor: 'Davis, L.' },
    { date: 'Wed Nov 20', shift: 'Evening 3PM-11PM', supervisor: 'Martinez, R.', isOT: true, isPending: true },
    { date: 'Thu Nov 21', shift: 'Day Shift 7AM-3PM', supervisor: 'Davis, L.' },
    { date: 'Sat Nov 23', shift: 'Day Shift 7AM-3PM', supervisor: 'Davis, L.' },
  ];

  const availableOT = [
    { date: 'Nov 20 (Wed)', shift: 'Evening 3PM-11PM', position: 'JJYDS I/II', requests: ['Rodriguez M.', 'Johnson K.', 'Taylor M.'], myRequest: true },
    { date: 'Nov 22 (Fri)', shift: 'Day 7AM-3PM', position: 'JJYDS II', requests: ['Johnson K.'] },
    { date: 'Nov 25 (Mon)', shift: 'Overnight 11PM-7AM', position: 'JJYDS I/II', requests: [] },
  ];

  const recentActivity = [
    { text: 'Johnson, K. approved for Nov 18 Day Shift (OT)', type: 'approval', time: '2 hours ago' },
    { text: 'Davis, R. time off approved: Dec 1-3', type: 'approval', time: '1 day ago' },
    { text: 'Your OT request for Nov 20 Evening under review', type: 'pending', time: '2 hours ago' },
  ];

  const myRequests = [
    { id: 1, type: 'overtime', details: 'Nov 20 Evening', status: 'pending', submitted: '2 hours ago', competing: 2 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-font-heading mb-2">My Schedule & Time Off</h1>
        <p className="text-sm text-font-detail">View your schedule, request overtime, and manage time off</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-font-heading">{myStats.shiftsThisWeek}</p>
              <p className="text-xs text-font-detail mt-1">My Shifts This Week</p>
            </div>
            <i className="fa-solid fa-calendar-day text-primary text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">{myStats.otHoursMonth} hrs</p>
              <p className="text-xs text-font-detail mt-1">My OT This Month</p>
            </div>
            <i className="fa-solid fa-clock text-warning text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">{myStats.leaveAvailable} days</p>
              <p className="text-xs text-font-detail mt-1">Leave Available</p>
            </div>
            <i className="fa-solid fa-umbrella-beach text-success text-xl"></i>
          </div>
        </div>

        <div className="bg-white border border-bd rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-font-medium">{myStats.pendingRequests}</p>
              <p className="text-xs text-font-detail mt-1">Pending Requests</p>
            </div>
            <i className="fa-solid fa-hourglass-half text-font-medium text-xl"></i>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setShowOTModal(true)}
          className="bg-warning text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm"
        >
          <i className="fa-solid fa-clock mr-2"></i>
          Grab Overtime
        </button>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm"
        >
          <i className="fa-solid fa-calendar-xmark mr-2"></i>
          Request Time Off
        </button>
        <button 
          onClick={() => setShowCallOutModal(true)}
          className="bg-error text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
        >
          <i className="fa-solid fa-phone-slash mr-2"></i>
          Log Call Out
        </button>
      </div>

      <div className="border-b border-bd mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'dashboard'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className={`fa-solid fa-home mr-2 ${activeTab === 'dashboard' ? 'text-primary' : 'text-font-detail'}`}></i>
            My Dashboard
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-primary text-primary'
                : 'border-transparent text-font-detail hover:text-font-base'
            }`}
          >
            <i className={`fa-solid fa-calendar-days mr-2 ${activeTab === 'schedule' ? 'text-primary' : 'text-font-detail'}`}></i>
            Full Schedule
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
            My Requests
            {myStats.pendingRequests > 0 && (
              <span className="ml-2 bg-warning text-white text-xs px-2 py-0.5 rounded-full">
                {myStats.pendingRequests}
              </span>
            )}
          </button>
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="font-semibold text-font-heading flex items-center">
                <i className="fa-solid fa-calendar-check text-primary mr-2"></i>
                My Upcoming Shifts
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {myUpcomingShifts.map((shift, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-bd rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <div>
                        <div className="text-sm font-medium text-font-base">
                          {shift.date} - {shift.shift}
                        </div>
                        <div className="text-xs text-font-detail">Supervisor: {shift.supervisor}</div>
                      </div>
                    </div>
                    {shift.isOT && shift.isPending && (
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                        OT Request Pending
                      </span>
                    )}
                    {shift.isOT && !shift.isPending && (
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                        Overtime
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="font-semibold text-font-heading flex items-center">
                <i className="fa-solid fa-clock text-success mr-2"></i>
                Available Overtime Opportunities
                <span className="ml-2 text-xs text-font-detail">(Transparent List)</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {availableOT.map((ot, idx) => (
                  <div key={idx} className={`p-4 border rounded-lg ${ot.myRequest ? 'border-warning bg-highlight-lightest' : 'border-bd bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-font-base">
                          {ot.date} - {ot.shift}
                        </div>
                        <div className="text-xs text-font-detail">Position: {ot.position}</div>
                      </div>
                      {!ot.myRequest && (
                        <button
                          onClick={() => setShowOTModal(true)}
                          className="bg-success text-white px-3 py-1 rounded text-xs hover:bg-primary-alt"
                        >
                          <i className="fa-solid fa-hand mr-1"></i>
                          Request This Shift
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-font-detail">
                      <span className="font-medium">Requests ({ot.requests.length}):</span>
                      {ot.requests.length > 0 ? ` ${ot.requests.join(', ')}` : ' No requests yet'}
                    </div>
                    {ot.myRequest && (
                      <div className="mt-2 text-xs text-warning font-medium">
                        <i className="fa-solid fa-arrow-right mr-1"></i>
                        YOU REQUESTED THIS - Pending admin approval
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="font-semibold text-font-heading flex items-center">
                <i className="fa-solid fa-bell text-primary mr-2"></i>
                Recent Activity
                <span className="ml-2 text-xs text-font-detail">(Transparent Feed)</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${
                      activity.type === 'approval' ? 'bg-success' : 'bg-warning'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm text-font-base">{activity.text}</div>
                      <div className="text-xs text-font-detail">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && <CalendarGrid isAdmin={false} />}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="font-semibold text-font-heading">My Requests & History</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-font-base mb-3">Pending Requests</h4>
              {myRequests.map((req) => (
                <div key={req.id} className="bg-highlight-lightest border border-warning rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-font-base">
                      <i className="fa-solid fa-clock text-warning mr-2"></i>
                      OT Request: {req.details}
                    </div>
                    <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                      Pending
                    </span>
                  </div>
                  <div className="text-xs text-font-detail space-y-1">
                    <div>Submitted: {req.submitted}</div>
                    <div>You're competing with {req.competing} other staff</div>
                    <div>Expected review: Within 24 hours</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-font-base mb-3">Approved Requests</h4>
              <div className="space-y-2 text-sm text-font-detail">
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-success mr-2"></i>
                  Nov 15 Day Shift OT - Approved Nov 14
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-success mr-2"></i>
                  Oct 28 Evening OT - Approved Oct 27
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-font-base mb-3">Denied Requests</h4>
              <div className="space-y-2 text-sm text-font-detail">
                <div className="flex items-center">
                  <i className="fa-solid fa-times-circle text-error mr-2"></i>
                  Nov 10 Overnight - Another staff selected (earlier request)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOTModal && <RequestOvertimeModal onClose={() => setShowOTModal(false)} />}
      {showLeaveModal && <RequestTimeOffModal onClose={() => setShowLeaveModal(false)} />}
      {showCallOutModal && <CallOutModal onClose={() => setShowCallOutModal(false)} />}
    </div>
  );
}
