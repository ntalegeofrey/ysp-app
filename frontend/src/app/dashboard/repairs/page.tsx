'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RepairsPage() {
  const router = useRouter();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
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
                <button className="bg-error text-white px-3 py-1 rounded text-sm">View Details</button>
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
                <button className="bg-highlight text-white px-3 py-1 rounded text-sm">View Details</button>
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
                <button className="bg-primary text-white px-3 py-1 rounded text-sm">View Details</button>
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
    </div>
  );
}
