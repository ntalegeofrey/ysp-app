'use client';

import { useState } from 'react';

export default function VisitationPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'todays' | 'phone' | 'archive'>('schedule');

  const tabBtnBase = 'flex-1 px-6 py-4 text-sm font-medium border-b-2 bg-transparent';
  const tabActive = 'border-primary text-primary';
  const tabInactive = 'border-transparent text-font-detail hover:text-primary';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="mb-2">
        <div className="flex border-b border-bd bg-transparent">
          <button className={`${tabBtnBase} ${activeTab === 'schedule' ? tabActive : tabInactive}`} onClick={() => setActiveTab('schedule')}>
            <i className={`fa-solid fa-calendar-plus mr-2 ${activeTab === 'schedule' ? 'text-primary' : ''}`}></i>
            Schedule Visitation
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'todays' ? tabActive : tabInactive}`} onClick={() => setActiveTab('todays')}>
            <i className={`fa-solid fa-calendar-day mr-2 ${activeTab === 'todays' ? 'text-primary' : ''}`}></i>
            Today's Schedule
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'phone' ? tabActive : tabInactive}`} onClick={() => setActiveTab('phone')}>
            <i className={`fa-solid fa-phone mr-2 ${activeTab === 'phone' ? 'text-primary' : ''}`}></i>
            Phone Log Entry
          </button>
          <button className={`${tabBtnBase} ${activeTab === 'archive' ? tabActive : tabInactive}`} onClick={() => setActiveTab('archive')}>
            <i className={`fa-solid fa-archive mr-2 ${activeTab === 'archive' ? 'text-primary' : ''}`}></i>
            Historical Records
          </button>
        </div>
      </div>

      {/* Schedule Visitation */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-calendar-plus text-primary mr-3"></i>
              Schedule Visitation
            </h3>
            <div className="mt-2 text-sm text-font-detail">
              Administrator scheduling interface for youth visitations
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Select Resident</option>
                      <option>Resident A01 - Johnson, Michael</option>
                      <option>Resident A02 - Rodriguez, Carlos</option>
                      <option>Resident B01 - Williams, David</option>
                      <option>Resident C01 - Brown, Anthony</option>
                      <option>Resident C02 - Davis, Marcus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Visit Type</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>In-Person Visit</option>
                      <option>Video Visit</option>
                      <option>Professional Visit</option>
                      <option>Legal Visit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Visitor Information</label>
                  <input type="text" placeholder="Full name and relationship to resident" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Visit Date</label>
                    <input type="date" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Time Slot</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>10:00 AM - 11:30 AM</option>
                      <option>2:00 PM - 3:30 PM</option>
                      <option>4:00 PM - 5:30 PM</option>
                      <option>6:00 PM - 7:30 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Special Instructions</label>
                  <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20" placeholder="Any special requirements or restrictions..." />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Assigned Staff</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Auto-assign based on shift</option>
                    <option>L. Davis - Available</option>
                    <option>R. Martinez - Available</option>
                    <option>K. Thompson - Available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Visitation Room</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Visitation Room A</option>
                    <option>Visitation Room B</option>
                    <option>Video Conference Room</option>
                    <option>Private Legal Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Contact Information</label>
                  <input type="text" placeholder="Visitor phone number" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary mb-2" />
                  <input type="email" placeholder="Visitor email address" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="bg-primary-lightest p-4 rounded-lg">
                  <h4 className="font-medium text-font-base mb-2">Approval Status</h4>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center"><input type="radio" name="approval" className="text-primary focus:ring-primary" /><span className="ml-2 text-sm text-success">Approved</span></label>
                    <label className="flex items-center"><input defaultChecked type="radio" name="approval" className="text-primary focus:ring-primary" /><span className="ml-2 text-sm text-warning">Pending Review</span></label>
                    <label className="flex items-center"><input type="radio" name="approval" className="text-primary focus:ring-primary" /><span className="ml-2 text-sm text-error">Denied</span></label>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light font-medium">
                  <i className="fa-solid fa-calendar-check mr-2"></i>
                  Schedule Visitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      {activeTab === 'todays' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-calendar-day text-primary mr-3"></i>
              Today's Scheduled Visitations
            </h3>
            <div className="mt-2 text-sm text-font-detail">All approved visitations scheduled for today's shift</div>
          </div>
          <div className="p-6 space-y-4">
            <div className="border border-bd rounded-lg p-4 bg-success-lightest">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><span className="font-semibold text-success">10:00 AM - 11:30 AM</span><span className="bg-success text-white px-2 py-1 rounded text-xs ml-3">Completed</span></div>
                <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-edit mr-1"></i>Log Visit</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-font-base">Resident C01 - Brown, Anthony</h4>
                  <p className="text-sm text-font-detail">Father - Robert Brown</p>
                  <p className="text-xs text-font-detail">Relationship: Parent</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Assignment</h5>
                  <p className="text-sm text-font-detail">Staff: L. Davis</p>
                  <p className="text-xs text-font-detail">Room: Visitation A</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Status</h5>
                  <p className="text-xs text-font-detail">Visit completed successfully</p>
                </div>
              </div>
            </div>

            <div className="border border-bd rounded-lg p-4 bg-primary-lightest">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><span className="font-semibold text-primary">2:00 PM - 3:30 PM</span><span className="bg-primary text-white px-2 py-1 rounded text-xs ml-3">Scheduled</span></div>
                <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-eye mr-1"></i>View Details</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-font-base">Resident A01 - Johnson, Michael</h4>
                  <p className="text-sm text-font-detail">Mother & Sister</p>
                  <p className="text-xs text-font-detail">Sarah Johnson, Emily Johnson</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Assignment</h5>
                  <p className="text-sm text-font-detail">Staff: R. Martinez</p>
                  <p className="text-xs text-font-detail">Room: Visitation B</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Special Notes</h5>
                  <p className="text-xs text-font-detail">Birthday visit - cake pre-approved</p>
                </div>
              </div>
            </div>

            <div className="border border-bd rounded-lg p-4 bg-warning-lightest">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center"><span className="font-semibold text-warning">4:00 PM - 5:30 PM</span><span className="bg-warning text-white px-2 py-1 rounded text-xs ml-3">Pending Staff</span></div>
                <button className="text-primary hover:text-primary-light"><i className="fa-solid fa-user-plus mr-1"></i>Assign Staff</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-font-base">Resident B01 - Williams, David</h4>
                  <p className="text-sm text-font-detail">Grandmother - Maria Williams</p>
                  <p className="text-xs text-font-detail">Relationship: Grandparent</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Assignment</h5>
                  <p className="text-sm text-error">No staff assigned</p>
                  <p className="text-xs text-font-detail">Room: Visitation A</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-font-base">Action Required</h5>
                  <p className="text-xs text-font-detail">Assign supervising staff member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Log Entry */}
      {activeTab === 'phone' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-phone text-primary mr-3"></i>
              Phone Call Log Entry
            </h3>
            <div className="mt-2 text-sm text-font-detail">Log completed phone calls for resident contact tracking</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Select Resident</option>
                      <option>Resident A01 - Johnson, Michael</option>
                      <option>Resident A02 - Rodriguez, Carlos</option>
                      <option>Resident B01 - Williams, David</option>
                      <option>Resident C01 - Brown, Anthony</option>
                      <option>Resident C02 - Davis, Marcus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Call Type</label>
                    <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Outgoing Call</option>
                      <option>Incoming Call</option>
                      <option>Legal Call</option>
                      <option>Emergency Call</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Person Called/Calling</label>
                  <input type="text" placeholder="Full name and relationship to resident" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Call Time</label>
                    <input type="time" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-font-base mb-2">Duration (minutes)</label>
                    <input type="number" placeholder="15" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Phone Number</label>
                  <input type="tel" placeholder="(555) 123-4567" className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Authorizing Call</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Staff Member</option>
                    <option>L. Davis - Supervisor</option>
                    <option>R. Martinez - JJYDS II</option>
                    <option>K. Thompson - JJYDS I</option>
                    <option>M. Wilson - Caseworker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Staff Monitoring Call</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Select Monitoring Staff</option>
                    <option>L. Davis - Supervisor</option>
                    <option>R. Martinez - JJYDS II</option>
                    <option>K. Thompson - JJYDS I</option>
                    <option>J. Anderson - Support Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Resident Behavior During Call</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Positive - Calm and appropriate</option>
                    <option>Neutral - No significant issues</option>
                    <option>Agitated - Elevated but manageable</option>
                    <option>Distressed - Emotional response</option>
                    <option>Concerning - Required intervention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Post-Call Behavior</label>
                  <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Improved - Positive mood change</option>
                    <option>No change - Maintained baseline</option>
                    <option>Slightly elevated - Minor agitation</option>
                    <option>Significantly impacted - Requires monitoring</option>
                    <option>Crisis level - Immediate intervention needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-font-base mb-2">Additional Comments</label>
                  <textarea className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary h-20" placeholder="Any additional observations about the call or resident's response..." />
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light font-medium">
                  <i className="fa-solid fa-save mr-2"></i>
                  Log Phone Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Records */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-lg border border-bd">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-archive text-primary mr-3"></i>
              Historical Records Archive
            </h3>
            <div className="mt-2 text-sm text-font-detail">Complete historical records of all visitations and phone calls with advanced filtering</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Date Range</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Record Type</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Records</option>
                  <option>Visitations Only</option>
                  <option>Phone Calls Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-font-base mb-2">Resident</label>
                <select className="w-full border border-bd rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                  <option>All Residents</option>
                  <option>Resident A01 - Johnson</option>
                  <option>Resident A02 - Rodriguez</option>
                  <option>Resident B01 - Williams</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light font-medium">
                  <i className="fa-solid fa-search mr-2"></i>
                  Filter Records
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-subtle border-b border-bd">
                  <tr>
                    <th className="text-left p-3 font-medium text-font-base">Date/Time</th>
                    <th className="text-left p-3 font-medium text-font-base">Type</th>
                    <th className="text-left p-3 font-medium text-font-base">Resident</th>
                    <th className="text-left p-3 font-medium text-font-base">Contact</th>
                    <th className="text-left p-3 font-medium text-font-base">Staff</th>
                    <th className="text-left p-3 font-medium text-font-base">Status</th>
                    <th className="text-left p-3 font-medium text-font-base">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  <tr className="hover:bg-bg-subtle">
                    <td className="p-3">Nov 15, 2024 10:00 AM</td>
                    <td className="p-3"><span className="bg-primary text-white px-2 py-1 rounded text-xs">Visitation</span></td>
                    <td className="p-3">C01 - Brown, Anthony</td>
                    <td className="p-3">Father - Robert Brown</td>
                    <td className="p-3">L. Davis</td>
                    <td className="p-3"><span className="text-success">Completed</span></td>
                    <td className="p-3"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                  <tr className="hover:bg-bg-subtle">
                    <td className="p-3">Nov 14, 2024 3:15 PM</td>
                    <td className="p-3"><span className="bg-success text-white px-2 py-1 rounded text-xs">Phone Call</span></td>
                    <td className="p-3">A01 - Johnson, Michael</td>
                    <td className="p-3">Mother - Sarah Johnson</td>
                    <td className="p-3">R. Martinez</td>
                    <td className="p-3"><span className="text-success">Completed</span></td>
                    <td className="p-3"><button className="text-primary hover:text-primary-light mr-2"><i className="fa-solid fa-eye"></i></button><button className="text-primary hover:text-primary-light"><i className="fa-solid fa-download"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-center">
              <button className="bg-bd text-font-base px-6 py-2 rounded-lg hover:bg-primary hover:text-white font-medium">Load More Records</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
