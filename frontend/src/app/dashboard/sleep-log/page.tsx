'use client';

import { useState } from 'react';

export default function SleepLogPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'add' | 'archive'>('active');

  const tabBtnBase = 'flex items-center px-0 py-4 text-sm transition-all duration-300 border-b-2';
  const tabActive = 'text-primary font-semibold border-primary';
  const tabInactive = 'text-font-medium font-medium border-transparent hover:text-primary';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="mb-2">
        <div className="border-b border-bd">
          <div className="flex space-x-8 px-6">
            <button className={`${tabBtnBase} ${activeTab === 'active' ? tabActive : tabInactive}`} onClick={() => setActiveTab('active')}>
              <i className={`fa-solid fa-eye w-4 h-4 mr-3 ${activeTab === 'active' ? 'text-primary' : 'text-font-detail'}`}></i>
              <span>Active Watches</span>
            </button>
            <button className={`${tabBtnBase} ${activeTab === 'add' ? tabActive : tabInactive}`} onClick={() => setActiveTab('add')}>
              <i className={`fa-solid fa-user-plus w-4 h-4 mr-3 ${activeTab === 'add' ? 'text-primary' : 'text-font-detail'}`}></i>
              <span>Add to Watch</span>
            </button>
            <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabActive : tabInactive}`} onClick={() => setActiveTab('archive')}>
              <i className={`fa-solid fa-archive w-4 h-4 mr-3 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
              <span>Archive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Watches */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">Total on Watch</p>
                  <p className="text-2xl font-bold text-primary">7</p>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-eye text-primary text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">Elevated Watch</p>
                  <p className="text-2xl font-bold text-error">2</p>
                </div>
                <div className="bg-error bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-exclamation-triangle text-error text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">Alert Watch</p>
                  <p className="text-2xl font-bold text-warning">3</p>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-shield-halved text-warning text-xl"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-bd">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-font-detail text-sm">General Watch</p>
                  <p className="text-2xl font-bold text-success">2</p>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-lg">
                  <i className="fa-solid fa-bed text-success text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Resident Watch 1 */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-error bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-user text-error text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-font-base">Michael Rodriguez</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="bg-error text-white px-3 py-1 rounded-full text-xs font-medium">Critical Watch</span>
                      <span className="text-sm text-font-detail">Room 204B</span>
                      <span className="text-sm text-font-detail">Started: 6:00 PM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary hover:underline text-sm">View History</button>
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm">Log Entry</button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Hourly Log Entry</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Time</label>
                        <input type="time" defaultValue="23:45" className="w-full border border-bd rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <select defaultValue="Critical" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                          <option>Normal</option>
                          <option>Critical</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Activity</label>
                      <select defaultValue="Walking" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                        <option>Sleeping</option>
                        <option>Laying on bed</option>
                        <option>Walking</option>
                        <option>Playing</option>
                        <option>Engaging</option>
                        <option>Bathroom</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Notes</label>
                      <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20" placeholder="Enter detailed observations...">Resident appears agitated, pacing in room. Verbal de-escalation attempted.</textarea>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light">Submit Entry</button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Recent Entries (Last 6 Hours)</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="border border-error rounded-lg p-3 bg-error bg-opacity-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">10:45 PM</span>
                        <span className="bg-error text-white px-2 py-1 rounded text-xs">Critical</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Walking</p>
                      <p className="text-sm text-font-detail">Resident pacing, showing signs of distress. Clinician notified.</p>
                    </div>
                    <div className="border border-warning rounded-lg p-3 bg-warning bg-opacity-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">9:45 PM</span>
                        <span className="bg-warning text-white px-2 py-1 rounded text-xs">High</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Laying on bed</p>
                      <p className="text-sm text-font-detail">Resident restless, difficulty settling for sleep.</p>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">8:45 PM</span>
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">Normal</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Engaging</p>
                      <p className="text-sm text-font-detail">Participated in evening activities, cooperative mood.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resident Watch 2 */}
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-user text-warning text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-font-base">Sarah Johnson</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="bg-warning text-white px-3 py-1 rounded-full text-xs font-medium">Elevated Watch</span>
                      <span className="text-sm text-font-detail">Room 103A</span>
                      <span className="text-sm text-font-detail">Started: 8:00 PM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-primary hover:underline text-sm">View History</button>
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm">Log Entry</button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-font-base mb-4">Hourly Log Entry</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Time</label>
                        <input type="time" defaultValue="23:45" className="w-full border border-bd rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Status</label>
                        <select defaultValue="Normal" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                          <option>Normal</option>
                          <option>Critical</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Activity</label>
                      <select defaultValue="Sleeping" className="w-full border border-bd rounded-lg px-3 py-2 text-sm">
                        <option>Sleeping</option>
                        <option>Laying on bed</option>
                        <option>Walking</option>
                        <option>Playing</option>
                        <option>Engaging</option>
                        <option>Bathroom</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-font-base mb-2">Notes</label>
                      <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-20" placeholder="Enter detailed observations...">Resident sleeping peacefully, no disturbances noted.</textarea>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light">Submit Entry</button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-font-base mb-4">Recent Entries (Last 6 Hours)</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">10:45 PM</span>
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">Normal</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Sleeping</p>
                      <p className="text-sm text-font-detail">Resident settled for the night, regular breathing pattern.</p>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">9:45 PM</span>
                        <span className="bg-success text-white px-2 py-1 rounded text-xs">Normal</span>
                      </div>
                      <p className="text-sm text-font-detail mb-1"><strong>Activity:</strong> Laying on bed</p>
                      <p className="text-sm text-font-detail">Preparing for sleep, reading quietly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Watch */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-user-plus text-primary mr-3"></i>
              Add Resident to Watch (Clinician Only)
            </h3>
            <p className="text-sm text-font-detail mt-1">Complete this form to place a resident under watch supervision</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident Name</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Select Resident...</option>
                      <option>Alex Thompson</option>
                      <option>Jordan Martinez</option>
                      <option>Casey Williams</option>
                      <option>Riley Johnson</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Room Number</label>
                    <input type="text" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="e.g., 204B" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Watch Type</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>General Watch</option>
                      <option>Alert Watch</option>
                      <option>Elevated Watch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Start Date & Time</label>
                    <input type="datetime-local" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Clinical Reason</label>
                  <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter clinical justification for watch placement..."></textarea>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Risk Assessment</label>
                  <div className="space-y-3">
                    <label className="flex items-center"><input type="checkbox" className="mr-3 text-primary focus:ring-primary" /><span className="text-sm">Self-harm risk</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 text-primary focus:ring-primary" /><span className="text-sm">Suicidal ideation</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 text-primary focus:ring-primary" /><span className="text-sm">Aggressive behavior</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 text-primary focus:ring-primary" /><span className="text-sm">Sleep disturbance</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-3 text-primary focus:ring-primary" /><span className="text-sm">Medical concern</span></label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Clinician Authorization</label>
                  <input type="text" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Dr. Smith (auto-filled)" readOnly />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-light transition-colors">
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add to Watch
                  </button>
                  <button className="px-6 py-3 border border-bd rounded-lg text-font-base hover:bg-bg-subtle transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center mb-4">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Watch Archive
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input type="text" placeholder="Search resident..." className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              <select className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option>All Watch Types</option>
                <option>Elevated Watch</option>
                <option>Alert Watch</option>
                <option>General Watch</option>
              </select>
              <input type="date" className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              <input type="date" className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              <select className="border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option>All Outcomes</option>
                <option>Completed Successfully</option>
                <option>Escalated</option>
                <option>Transferred</option>
                <option>Discontinued</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-subtle">
                <tr>
                  <th className="text-left p-4 font-medium text-font-base">Resident</th>
                  <th className="text-left p-4 font-medium text-font-base">Watch Type</th>
                  <th className="text-left p-4 font-medium text-font-base">Start Date/Time</th>
                  <th className="text-left p-4 font-medium text-font-base">End Date/Time</th>
                  <th className="text-left p-4 font-medium text-font-base">Duration</th>
                  <th className="text-left p-4 font-medium text-font-base">Outcome</th>
                  <th className="text-left p-4 font-medium text-font-base">Total Entries</th>
                  <th className="text-left p-4 font-medium text-font-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bd hover:bg-bg-subtle">
                  <td className="p-4 font-medium">Michael Rodriguez</td>
                  <td className="p-4"><span className="bg-error text-white px-2 py-1 rounded text-sm">Critical</span></td>
                  <td className="p-4">10/23/2024 2:00 PM</td>
                  <td className="p-4">10/24/2024 8:00 AM</td>
                  <td className="p-4">18h 00m</td>
                  <td className="p-4"><span className="bg-success text-white px-2 py-1 rounded text-sm">Completed</span></td>
                  <td className="p-4">18</td>
                  <td className="p-4"><button className="text-primary hover:underline mr-3">View Log</button><button className="text-success hover:underline">Print</button></td>
                </tr>
                <tr className="border-b border-bd hover:bg-bg-subtle">
                  <td className="p-4 font-medium">Sarah Johnson</td>
                  <td className="p-4"><span className="bg-warning text-white px-2 py-1 rounded text-sm">Elevated</span></td>
                  <td className="p-4">10/22/2024 10:00 PM</td>
                  <td className="p-4">10/23/2024 6:00 AM</td>
                  <td className="p-4">8h 00m</td>
                  <td className="p-4"><span className="bg-success text-white px-2 py-1 rounded text-sm">Completed</span></td>
                  <td className="p-4">8</td>
                  <td className="p-4"><button className="text-primary hover:underline mr-3">View Log</button><button className="text-success hover:underline">Print</button></td>
                </tr>
                <tr className="border-b border-bd hover:bg-bg-subtle">
                  <td className="p-4 font-medium">Alex Thompson</td>
                  <td className="p-4"><span className="bg-primary-light text-white px-2 py-1 rounded text-sm">Alert</span></td>
                  <td className="p-4">10/21/2024 6:00 PM</td>
                  <td className="p-4">10/22/2024 12:00 PM</td>
                  <td className="p-4">18h 00m</td>
                  <td className="p-4"><span className="bg-warning text-white px-2 py-1 rounded text-sm">Escalated</span></td>
                  <td className="p-4">18</td>
                  <td className="p-4"><button className="text-primary hover:underline mr-3">View Log</button><button className="text-success hover:underline">Print</button></td>
                </tr>
                <tr className="border-b border-bd hover:bg-bg-subtle">
                  <td className="p-4 font-medium">Jordan Martinez</td>
                  <td className="p-4"><span className="bg-success text-white px-2 py-1 rounded text-sm">General</span></td>
                  <td className="p-4">10/20/2024 11:00 PM</td>
                  <td className="p-4">10/21/2024 7:00 AM</td>
                  <td className="p-4">8h 00m</td>
                  <td className="p-4"><span className="bg-success text-white px-2 py-1 rounded text-sm">Completed</span></td>
                  <td className="p-4">8</td>
                  <td className="p-4"><button className="text-primary hover:underline mr-3">View Log</button><button className="text-success hover:underline">Print</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-bd">
            <div className="flex justify-center">
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light">
                <i className="fa-solid fa-arrow-down mr-2"></i>
                Load More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
