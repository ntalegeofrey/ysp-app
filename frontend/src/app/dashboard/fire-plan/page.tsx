'use client';

import { useState } from 'react';

export default function FirePlanPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'report' | 'archive' | 'floor'>('current');

  // Derived current date/time and shift label for header
  const now = new Date();
  const hours = now.getHours();
  const shiftLabel =
    hours >= 7 && hours < 15
      ? 'Day (7:00 AM - 3:00 PM)'
      : hours >= 15 && hours < 23
      ? 'Evening (3:00 PM - 11:00 PM)'
      : 'Night (11:00 PM - 7:00 AM)';

  const tabBtnBase = 'flex items-center px-1 py-3 text-sm font-medium border-b-2 transition-colors';
  const tabBtnInactive = 'border-transparent text-font-detail hover:text-font-base hover:border-bd';
  const tabBtnActive = 'border-primary text-primary';

  const handlePrint = () => alert('Print action coming soon.');
  const handleExport = () => alert('Exporting archive...');
  const handleSaveReport = () => alert('Drill report saved.');
  const handleCancelReport = () => alert('Canceled.');
  const handleUpdateFloorPlan = () => alert('Upload floor plan coming soon.');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div>
        <nav className="flex space-x-8 border-b border-bd">
          <button className={`${tabBtnBase} ${activeTab === 'current' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('current')}>
            <i className={`fa-solid fa-fire-flame-simple mr-2 ${activeTab === 'current' ? 'text-primary' : 'text-font-detail'}`}></i>
            Current Plan
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'report' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('report')}>
            <i className={`fa-solid fa-clipboard-check mr-2 ${activeTab === 'report' ? 'text-primary' : 'text-font-detail'}`}></i>
            Drill Report
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('archive')}>
            <i className={`fa-solid fa-archive mr-2 ${activeTab === 'archive' ? 'text-primary' : 'text-font-detail'}`}></i>
            Drill Archive
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'floor' ? tabBtnActive : tabBtnInactive}`} onClick={() => setActiveTab('floor')}>
            <i className={`fa-solid fa-map mr-2 ${activeTab === 'floor' ? 'text-primary' : 'text-font-detail'}`}></i>
            Floor Plan
          </button>
        </nav>
      </div>

      {/* Current Plan */}
      {activeTab === 'current' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-fire-flame-simple text-error mr-3"></i>
                  Current Shift Fire Plan
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success text-white">Active Plan</span>
                  <button onClick={handlePrint} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                    <i className="fa-solid fa-print mr-2"></i>
                    Print Plan
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-font-detail">
                Generated: {now.toLocaleDateString()} at{' '}
                {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} | Shift: {shiftLabel}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-primary-lightest p-4 rounded-lg">
                  <h4 className="font-semibold text-font-base mb-2">Total Staff</h4>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-font-detail">8 Regular • 4 Overtime</div>
                </div>
                <div className="bg-highlight-lightest p-4 rounded-lg">
                  <h4 className="font-semibold text-font-base mb-2">Total Residents</h4>
                  <div className="text-2xl font-bold text-warning">24</div>
                  <div className="text-sm text-font-detail">3 on Separation</div>
                </div>
                <div className="bg-error-lightest p-4 rounded-lg">
                  <h4 className="font-semibold text-font-base mb-2">Supervisors</h4>
                  <div className="text-2xl font-bold text-error">5</div>
                  <div className="text-sm text-font-detail">8 Regular • 4 Overtime</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-font-base mb-4">Staff Assignments</h4>
                  <div className="space-y-3">
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-font-base">J. Smith (Lead)</span>
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded">Primary Route</span>
                      </div>
                      <div className="text-sm text-font-detail">Assigned: Residents A1-A4 | Route: Main Stairwell → Exit A</div>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-font-base">M. Johnson</span>
                        <span className="bg-error text-white text-xs px-2 py-1 rounded">1:1 Separation</span>
                      </div>
                      <div className="text-sm text-font-detail">Assigned: Resident B2 (Separation) | Route: East Stairwell → Exit C</div>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-font-base">K. Williams</span>
                        <span className="bg-primary-light text-white text-xs px-2 py-1 rounded">Secondary Route</span>
                      </div>
                      <div className="text-sm text-font-detail">Assigned: Residents C1-C3 | Route: West Stairwell → Exit B</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-font-base mb-4">Evacuation Routes</h4>
                  <div className="space-y-3">
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-font-base">Primary Route A</span>
                        <span className="bg-success text-white text-xs px-2 py-1 rounded">Available</span>
                      </div>
                      <div className="text-sm text-font-detail">Units A & B → Main Stairwell → Exit A → Assembly Point 1</div>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-font-base">Secondary Route B</span>
                        <span className="bg-success text-white text-xs px-2 py-1 rounded">Available</span>
                      </div>
                      <div className="text-sm text-font-detail">Units C & D → West Stairwell → Exit B → Assembly Point 2</div>
                    </div>
                    <div className="border border-bd rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-font-base">Separation Route C</span>
                        <span className="bg-warning text-white text-xs px-2 py-1 rounded">Restricted</span>
                      </div>
                      <div className="text-sm text-font-detail">Separated Residents → East Stairwell → Exit C → Assembly Point 3</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-font-base mb-4">Assembly Points & Safety Zones</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="border border-bd rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-1 text-white"></i>
                    </div>
                    <h5 className="font-medium text-font-base mb-2">Assembly Point 1</h5>
                    <div className="text-sm text-font-detail">Front Parking Lot<br/>Units A & B<br/>Staff: J. Smith, L. Davis</div>
                  </div>
                  <div className="border border-bd rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-2 text-white"></i>
                    </div>
                    <h5 className="font-medium text-font-base mb-2">Assembly Point 2</h5>
                    <div className="text-sm text-font-detail">Side Yard<br/>Units C & D<br/>Staff: K. Williams, R. Brown</div>
                  </div>
                  <div className="border border-bd rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-3 text-white"></i>
                    </div>
                    <h5 className="font-medium text-font-base mb-2">Assembly Point 3</h5>
                    <div className="text-sm text-font-detail">Separated Area<br/>Rear Courtyard<br/>Staff: M. Johnson, T. Wilson</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drill Report */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-clipboard-check text-primary mr-3"></i>
                Fire Drill Report Form
              </h3>
              <button onClick={handlePrint} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                <i className="fa-solid fa-print mr-2"></i>
                Print Report
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Basic Drill Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Drill Date</label>
                  <input type="date" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Drill Time</label>
                  <input type="time" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Drill Type</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    <option>Scheduled Drill</option>
                    <option>Unannounced Drill</option>
                    <option>Actual Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Shift & Staff Information</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Shift</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    <option>Day Shift (7:00 AM - 3:00 PM)</option>
                    <option>Evening Shift (3:00 PM - 11:00 PM)</option>
                    <option>Night Shift (11:00 PM - 7:00 AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Shift Supervisor</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    <option>John Smith - Shift Supervisor</option>
                    <option>Mary Johnson - Assistant Supervisor</option>
                    <option>Robert Brown - Senior JJYDS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Report Completed By</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    <option>John Smith - Shift Supervisor</option>
                    <option>Mary Johnson - Assistant Supervisor</option>
                    <option>Kevin Williams - JJYDS I</option>
                    <option>Lisa Davis - Support Staff</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Total Evacuation Time</label>
                  <input type="text" placeholder="e.g., 4 minutes 30 seconds" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Weather Conditions</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    <option>Clear</option>
                    <option>Rainy</option>
                    <option>Snowy</option>
                    <option>Windy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Total Staff Present</label>
                  <input type="number" placeholder="12" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Total Residents Present</label>
                  <input type="number" placeholder="24" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Drill Assessment</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Overall Drill Performance</label>
                  <textarea rows={4} placeholder="Describe overall performance, staff response, resident compliance, coordination effectiveness..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Issues/Bottlenecks Identified</label>
                  <textarea rows={4} placeholder="Detail any delays, blocked routes, equipment issues, communication problems..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Recommendations for Improvement</label>
                  <textarea rows={4} placeholder="Suggested improvements, training needs, equipment updates, procedure changes..." className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Route Performance Analysis</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Primary Route A', 'Secondary Route B', 'Separation Route C'].map((title) => (
                  <div key={title} className="border border-bd rounded-lg p-4">
                    <h5 className="font-medium text-font-base mb-3">{title}</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-font-detail mb-1">Evacuation Time</label>
                        <input type="text" placeholder={title === 'Primary Route A' ? '3:45' : title === 'Secondary Route B' ? '4:15' : '5:00'} className="w-full border border-bd rounded px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-font-detail mb-1">Issues Encountered</label>
                        <textarea rows={2} placeholder="Any delays or problems..." className="w-full border border-bd rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-font-base mb-4">Digital Signature & Verification</h4>
              <div className="border border-bd rounded-lg p-6 bg-bg-subtle">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                    <span>I certify that the information provided in this fire drill report is accurate and complete to the best of my knowledge.</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                    <span>I confirm that this drill was conducted in accordance with facility safety protocols and state regulations.</span>
                  </label>
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary border-bd rounded focus:ring-2 focus:ring-primary" />
                    <span>I authorize the submission of this report and understand it will be reviewed by facility administration.</span>
                  </label>
                  <div className="pt-4 border-t border-bd">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Digital Signature</label>
                        <div className="border border-bd rounded-lg p-3 bg-bg-subtle">
                          <div className="text-sm text-font-detail">Digital signature will be generated here</div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-font-base mb-2">Date & Time</label>
                        <input type="datetime-local" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={handleCancelReport} className="px-4 py-2 border border-bd text-font-detail rounded-lg hover:bg-bg-subtle">Cancel</button>
              <button onClick={handleSaveReport} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">Save Drill Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Drill Archive */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Fire Drill Archive
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <input type="text" placeholder="Search drills..." className="border border-bd rounded-lg px-3 py-2 text-sm w-64" />
                <select className="border border-bd rounded-lg px-3 py-2 text-sm">
                  <option>All Types</option>
                  <option>Scheduled</option>
                  <option>Unannounced</option>
                  <option>Actual Emergency</option>
                </select>
              </div>
              <button onClick={handleExport} className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-light">
                <i className="fa-solid fa-download mr-2"></i>
                Export Archive
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg-subtle">
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Date</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Time</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Type</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Duration</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Status</th>
                    <th className="border border-bd p-3 text-left text-sm font-medium text-font-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-bd p-3 text-sm">Oct 15, 2024</td>
                    <td className="border border-bd p-3 text-sm">2:30 PM</td>
                    <td className="border border-bd p-3 text-sm">Scheduled</td>
                    <td className="border border-bd p-3 text-sm">4:30</td>
                    <td className="border border-bd p-3 text-sm">
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">Successful</span>
                    </td>
                    <td className="border border-bd p-3 text-sm">
                      <button className="text-primary hover:underline mr-2">View</button>
                      <button className="text-primary hover:underline">Print</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-bd p-3 text-sm">Oct 1, 2024</td>
                    <td className="border border-bd p-3 text-sm">10:15 AM</td>
                    <td className="border border-bd p-3 text-sm">Unannounced</td>
                    <td className="border border-bd p-3 text-sm">5:45</td>
                    <td className="border border-bd p-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">Issues Found</span>
                    </td>
                    <td className="border border-bd p-3 text-sm">
                      <button className="text-primary hover:underline mr-2">View</button>
                      <button className="text-primary hover:underline">Print</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floor Plan */}
      {activeTab === 'floor' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-font-base flex items-center">
                <i className="fa-solid fa-map text-primary mr-3"></i>
                Facility Floor Plan & Exit Routes
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={handleUpdateFloorPlan} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                  <i className="fa-solid fa-upload mr-2"></i>
                  Update Floor Plan
                </button>
                <button onClick={handlePrint} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light font-medium text-sm">
                  <i className="fa-solid fa-print mr-2"></i>
                  Print Plan
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <img className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5ea061d02c-eff4b0701f06055f1bc2.png" alt="facility floor plan with fire exit routes, emergency exits marked in red, assembly points marked with green circles, stairwells and corridors clearly labeled, professional architectural style" />
            </div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-font-base mb-3">Exit Route Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-error rounded mr-3"></div>
                    <span className="text-sm text-font-base">Primary Exit Routes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-warning rounded mr-3"></div>
                    <span className="text-sm text-font-base">Secondary Exit Routes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-success rounded mr-3"></div>
                    <span className="text-sm text-font-base">Assembly Points</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-font-base mb-3">Plan Details</h4>
                <div className="text-sm text-font-detail space-y-1">
                  <p><strong>Last Updated:</strong> October 1, 2024</p>
                  <p><strong>Scale:</strong> 1:100</p>
                  <p><strong>Total Exits:</strong> 6 exits available</p>
                  <p><strong>Assembly Points:</strong> 3 designated areas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
