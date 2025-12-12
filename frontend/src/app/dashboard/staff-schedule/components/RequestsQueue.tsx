'use client';

import { useState } from 'react';
import ReviewRequestModal from './ReviewRequestModal';

export default function RequestsQueue() {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'ot' | 'leave'>('pending');

  const requests = [
    {
      id: 1,
      staff: { name: 'Rodriguez, Maria', position: 'JJYDS I' },
      type: 'overtime',
      details: 'Nov 20, Evening 3PM-11PM',
      impact: 'Fills critical slot',
      status: 'pending',
      priority: 'high',
      requestedAt: '2 hours ago',
      reason: 'Voluntary pickup - need extra hours',
      otHours: 12,
      competing: 3,
    },
    {
      id: 2,
      staff: { name: 'Martinez, Carlos', position: 'JJYDS II' },
      type: 'leave',
      subtype: 'vacation',
      details: 'Dec 15-22 (6 days)',
      impact: 'Creates 2 OT slots',
      status: 'pending',
      priority: 'medium',
      requestedAt: 'Nov 15, 2024',
      reason: 'Family vacation - visiting relatives for holidays',
    },
    {
      id: 3,
      staff: { name: 'Thompson, Angela', position: 'JJYDS I' },
      type: 'leave',
      subtype: 'sick',
      details: 'Nov 25-29 (5 days)',
      impact: 'Creates 1 mandatory OT',
      status: 'pending',
      priority: 'medium',
      requestedAt: 'Nov 18, 2024',
      reason: 'Medical appointment - doctor note attached',
    },
    {
      id: 4,
      staff: { name: 'Johnson, Kevin', position: 'JJYDS II' },
      type: 'overtime',
      details: 'Nov 22, Day 7AM-3PM',
      impact: 'Fills slot',
      status: 'pending',
      priority: 'medium',
      requestedAt: '5 hours ago',
      reason: 'Can cover for staff on leave',
      otHours: 8,
      competing: 1,
    },
    {
      id: 5,
      staff: { name: 'Davis, Robert', position: 'JJYDS III' },
      type: 'leave',
      subtype: 'personal',
      details: 'Dec 1-3 (3 days)',
      impact: 'Covered',
      status: 'approved',
      priority: 'low',
      requestedAt: 'Nov 16, 2024',
      approvedBy: 'Davis, Linda',
    },
  ];

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return req.status === 'pending';
    if (filter === 'ot') return req.type === 'overtime';
    if (filter === 'leave') return req.type === 'leave';
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const otCount = requests.filter(r => r.type === 'overtime').length;
  const leaveCount = requests.filter(r => r.type === 'leave').length;

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-error';
    if (priority === 'medium') return 'text-warning';
    return 'text-font-detail';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return 'bg-warning text-white';
    if (status === 'approved') return 'bg-success text-white';
    return 'bg-font-detail text-white';
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-font-base">Staff Requests Management</h3>
              <div className="mt-2 text-sm text-font-detail">
                Review and process staff overtime and time off requests
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'all' ? 'bg-primary text-white' : 'bg-bg-subtle text-font-base'
                }`}
              >
                All Requests
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'pending' ? 'bg-warning text-white' : 'bg-bg-subtle text-font-base'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('ot')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'ot' ? 'bg-primary text-white' : 'bg-bg-subtle text-font-base'
                }`}
              >
                OT Only ({otCount})
              </button>
              <button
                onClick={() => setFilter('leave')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'leave' ? 'bg-primary text-white' : 'bg-bg-subtle text-font-base'
                }`}
              >
                Leave Only ({leaveCount})
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bd">
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Staff</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Request Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Details</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Impact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-font-detail">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-bd hover:bg-bg-subtle">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <i className={`fa-solid fa-circle-exclamation ${getPriorityColor(request.priority)} mr-2`}></i>
                      <span className={`text-xs font-medium uppercase ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-font-base">{request.staff.name}</div>
                    <div className="text-xs text-font-detail">{request.staff.position}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <i className={`fa-solid ${
                        request.type === 'overtime' ? 'fa-clock text-warning' : 'fa-calendar-xmark text-primary'
                      } mr-2`}></i>
                      <div>
                        <div className="text-sm font-medium text-font-base">
                          {request.type === 'overtime' ? 'Overtime Request' : 'Time Off Request'}
                        </div>
                        {request.subtype && (
                          <div className="text-xs text-font-detail capitalize">{request.subtype}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-font-base">{request.details}</div>
                    <div className="text-xs text-font-detail">Requested: {request.requestedAt}</div>
                    {request.competing && (
                      <div className="text-xs text-warning mt-1">
                        {request.competing} total requests for this slot
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-font-base">{request.impact}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(request.status)}`}>
                      {request.status === 'pending' ? 'Pending' : 'Approved'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {request.status === 'pending' ? (
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-light"
                      >
                        Review
                      </button>
                    ) : (
                      <button className="text-primary text-xs hover:underline">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <ReviewRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
