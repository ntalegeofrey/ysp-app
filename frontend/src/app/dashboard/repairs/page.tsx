'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RepairsPage() {
  const router = useRouter();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [detailsModal, setDetailsModal] = useState<any>(null);
  
  const repairDetails = {
    0: {
      resident: 'Marcus Johnson',
      id: '2847',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      repairType: 'R3',
      violation: 'Major Violation - Fighting',
      date: '2025-11-22',
      assignedBy: 'John Smith',
      duration: '7 days',
      startedDays: '3 days ago',
      interventions: ['DBT packet', 'Clinical Reflection', 'Character Essay'],
      comments: 'Physical altercation in common area during recreation time. Escalated quickly despite staff intervention. Resident has shown remorse and is engaging well with interventions.',
      status: 'Active',
      pointsSuspended: true
    },
    1: {
      resident: 'David Chen',
      id: '2851',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
      repairType: 'R2',
      violation: 'Moderate Violation - Disrespect to Staff',
      date: '2025-11-24',
      assignedBy: 'Sarah Williams',
      duration: '3 days',
      startedDays: '1 day ago',
      interventions: ['Clean classrooms', 'Wipe down dining area'],
      comments: 'Verbally disrespectful during room inspection. Used inappropriate language. Resident has been cooperative with cleaning tasks.',
      status: 'Active',
      pointsSuspended: true
    },
    2: {
      resident: 'Alex Rodriguez',
      id: '2849',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
      repairType: 'R1',
      violation: 'Minor Violation - Late to Count',
      date: '2025-11-25',
      assignedBy: 'Mike Johnson',
      duration: '1 day',
      startedDays: 'Today',
      interventions: ['Written apology', 'Update Distress Tolerance'],
      comments: 'Missed morning count due to oversleeping. Apologized immediately and completed repair tasks promptly.',
      status: 'Active',
      pointsSuspended: true
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Total Residents</p>
              <p className="text-2xl font-bold text-primary">47</p>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-users text-primary text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Active Repairs</p>
              <p className="text-2xl font-bold text-error">8</p>
            </div>
            <div className="bg-error bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Points Awarded Today</p>
              <p className="text-2xl font-bold text-success">324</p>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-star text-success text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-bd">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-font-detail text-sm">Average Score</p>
              <p className="text-2xl font-bold text-highlight">78</p>
            </div>
            <div className="bg-highlight bg-opacity-10 p-3 rounded-lg">
              <i className="fa-solid fa-chart-line text-highlight text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Active Behavioral Repairs */}
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base">Active Behavioral Repairs</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-error-lightest border border-error rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-error">R3 - Major Violation</h4>
                  <p className="text-sm text-font-detail mt-1">Marcus Johnson - ID: 2847</p>
                  <p className="text-sm text-font-detail">Started: 3 days ago | Duration: 7 days</p>
                  <p className="text-xs text-error mt-2">Point accrual suspended</p>
                </div>
                <button 
                  onClick={() => setDetailsModal(repairDetails[0])}
                  className="bg-error text-white px-3 py-1 rounded text-sm hover:bg-error/90 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-highlight-lightest border border-highlight rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-highlight">R2 - Moderate Violation</h4>
                  <p className="text-sm text-font-detail mt-1">David Chen - ID: 2851</p>
                  <p className="text-sm text-font-detail">Started: 1 day ago | Duration: 3 days</p>
                  <p className="text-xs text-highlight mt-2">Point accrual suspended</p>
                </div>
                <button 
                  onClick={() => setDetailsModal(repairDetails[1])}
                  className="bg-highlight text-white px-3 py-1 rounded text-sm hover:bg-highlight/90 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-primary-lightest border border-primary rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-primary">R1 - Minor Violation</h4>
                  <p className="text-sm text-font-detail mt-1">Alex Rodriguez - ID: 2849</p>
                  <p className="text-sm text-font-detail">Started: Today | Duration: 1 day</p>
                  <p className="text-xs text-primary mt-2">Point accrual suspended</p>
                </div>
                <button 
                  onClick={() => setDetailsModal(repairDetails[2])}
                  className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      {/* Resident Overview Table */}
      <div className="mt-2">
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-font-base">Resident Overview</h3>
              <div className="flex items-center space-x-4">
                <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                  <option>All Residents</option>
                  <option>Active Repairs</option>
                  <option>High Performers</option>
                  <option>Needs Attention</option>
                </select>
                <input type="text" placeholder="Search residents..." className="border border-bd rounded-lg px-3 py-2 text-sm w-48" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle">
                <tr>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Resident</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Current Points</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Weekly Change</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Status</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Last Activity</th>
                  <th className="text-left p-3 font-medium text-font-base text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bd hover:bg-primary-lightest/30">
                  <td className="p-3">
                    <div className="flex items-center">
                      <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="Resident" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="text-sm font-medium">Marcus Johnson</p>
                        <p className="text-xs text-font-detail">ID: 2847</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm font-bold text-success">245</td>
                  <td className="p-3 text-sm text-success">+32</td>
                  <td className="p-3"><span className="bg-error text-white px-2 py-1 rounded text-xs">R3 Repair</span></td>
                  <td className="p-3 text-sm text-font-detail">2 hours ago</td>
                  <td className="p-3">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded hover:bg-bg-subtle"
                        onClick={() => setOpenMenuIndex(openMenuIndex === 0 ? null : 0)}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                      {openMenuIndex === 0 && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-bd rounded-lg shadow z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/history/2847')}>
                            <i className="fa-solid fa-history text-primary"></i>
                            View Repairs
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/award')}>
                            <i className="fa-solid fa-star text-success"></i>
                            Points Management
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/assign')}>
                            <i className="fa-solid fa-exclamation-circle text-error"></i>
                            Assign Repair
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-bd hover:bg-primary-lightest/30">
                  <td className="p-3">
                    <div className="flex items-center">
                      <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" alt="Resident" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="text-sm font-medium">David Chen</p>
                        <p className="text-xs text-font-detail">ID: 2851</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm font-bold text-highlight">189</td>
                  <td className="p-3 text-sm text-error">-15</td>
                  <td className="p-3"><span className="bg-highlight text-white px-2 py-1 rounded text-xs">R2 Repair</span></td>
                  <td className="p-3 text-sm text-font-detail">4 hours ago</td>
                  <td className="p-3">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded hover:bg-bg-subtle"
                        onClick={() => setOpenMenuIndex(openMenuIndex === 1 ? null : 1)}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                      {openMenuIndex === 1 && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-bd rounded-lg shadow z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/history/2851')}>
                            <i className="fa-solid fa-history text-primary"></i>
                            View Repairs
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/award')}>
                            <i className="fa-solid fa-star text-success"></i>
                            Points Management
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/assign')}>
                            <i className="fa-solid fa-exclamation-circle text-error"></i>
                            Assign Repair
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-bd hover:bg-primary-lightest/30">
                  <td className="p-3">
                    <div className="flex items-center">
                      <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg" alt="Resident" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="text-sm font-medium">Alex Rodriguez</p>
                        <p className="text-xs text-font-detail">ID: 2849</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm font-bold text-success">312</td>
                  <td className="p-3 text-sm text-success">+45</td>
                  <td className="p-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">R1 Repair</span></td>
                  <td className="p-3 text-sm text-font-detail">1 hour ago</td>
                  <td className="p-3">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded hover:bg-bg-subtle"
                        onClick={() => setOpenMenuIndex(openMenuIndex === 2 ? null : 2)}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                      {openMenuIndex === 2 && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-bd rounded-lg shadow z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/history/2849')}>
                            <i className="fa-solid fa-history text-primary"></i>
                            View Repairs
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/award')}>
                            <i className="fa-solid fa-star text-success"></i>
                            Points Management
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/assign')}>
                            <i className="fa-solid fa-exclamation-circle text-error"></i>
                            Assign Repair
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-bd hover:bg-primary-lightest/30">
                  <td className="p-3">
                    <div className="flex items-center">
                      <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg" alt="Resident" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="text-sm font-medium">James Wilson</p>
                        <p className="text-xs text-font-detail">ID: 2852</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm font-bold text-success">428</td>
                  <td className="p-3 text-sm text-success">+67</td>
                  <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Active</span></td>
                  <td className="p-3 text-sm text-font-detail">30 min ago</td>
                  <td className="p-3">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded hover:bg-bg-subtle"
                        onClick={() => setOpenMenuIndex(openMenuIndex === 3 ? null : 3)}
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                      {openMenuIndex === 3 && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-bd rounded-lg shadow z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/history/2852')}>
                            <i className="fa-solid fa-history text-primary"></i>
                            View Repairs
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/award')}>
                            <i className="fa-solid fa-star text-success"></i>
                            Points Management
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-bg-subtle flex items-center gap-2" onClick={() => router.push('/dashboard/repairs/assign')}>
                            <i className="fa-solid fa-exclamation-circle text-error"></i>
                            Assign Repair
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-bd bg-bg-subtle flex justify-between items-center">
            <p className="text-sm text-font-detail">Showing 4 of 47 residents</p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-light">
              View All Residents
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Repair Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-primary p-6 text-white sticky top-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img 
                    src={detailsModal.avatar} 
                    alt={detailsModal.resident} 
                    className="w-16 h-16 rounded-full border-2 border-white"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{detailsModal.resident}</h2>
                    <p className="text-primary-lightest">ID: {detailsModal.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDetailsModal(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Repair Type Badge */}
              <div className="flex justify-center">
                <span className={`
                  ${detailsModal.repairType === 'R3' ? 'bg-error' : 
                    detailsModal.repairType === 'R2' ? 'bg-highlight' : 'bg-primary'}
                  text-white px-6 py-2 rounded-full text-lg font-bold
                `}>
                  {detailsModal.repairType} - {detailsModal.violation}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Date Assigned</p>
                  <p className="font-semibold text-font-base">
                    {new Date(detailsModal.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Assigned By</p>
                  <p className="font-semibold text-font-base">{detailsModal.assignedBy}</p>
                </div>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Duration</p>
                  <p className="font-semibold text-font-base">{detailsModal.duration}</p>
                </div>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-detail mb-1">Status</p>
                  <p className="font-semibold text-font-base flex items-center gap-2">
                    <span className={`
                      ${detailsModal.status === 'Active' ? 'bg-error' : 'bg-success'}
                      w-2 h-2 rounded-full
                    `}></span>
                    {detailsModal.status}
                  </p>
                </div>
              </div>

              {/* Points Suspension Alert */}
              {detailsModal.pointsSuspended && (
                <div className="bg-error-lightest border border-error rounded-lg p-4 flex items-center gap-3">
                  <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
                  <div>
                    <p className="font-semibold text-error">Point Accrual Suspended</p>
                    <p className="text-sm text-font-detail">Resident cannot earn points during this repair period</p>
                  </div>
                </div>
              )}

              {/* Interventions */}
              <div>
                <h3 className="text-lg font-semibold text-font-base mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-clipboard-list text-primary"></i>
                  Assigned Interventions
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {detailsModal.interventions.map((intervention: string, index: number) => (
                    <div key={index} className="bg-primary-lightest border-l-4 border-primary p-3 rounded">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-check-circle text-primary"></i>
                        <span className="text-sm font-medium text-font-base">{intervention}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold text-font-base mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-comment text-primary"></i>
                  Staff Comments
                </h3>
                <div className="bg-bg-subtle p-4 rounded-lg border border-bd">
                  <p className="text-sm text-font-base leading-relaxed">{detailsModal.comments}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-bd bg-bg-subtle flex justify-end gap-3">
              <button 
                onClick={() => setDetailsModal(null)}
                className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setDetailsModal(null);
                  router.push(`/dashboard/repairs/history/${detailsModal.id}`);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-history"></i>
                View Full History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
